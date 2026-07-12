import fp from 'fastify-plugin'
import type { FastifyPluginAsync, FastifyRequest } from 'fastify'
import bcrypt from 'bcryptjs'
import { prisma, createAbility } from '@family-os/platform/server'
import { PERMISSION_REGISTRY, FAMILY_PROFILE_ID } from '@family-os/platform/types'
import type { TierLevel } from '@family-os/platform/types'
import {
  CreateProfileSchema,
  UpdateProfileSchema,
  ResetPinSchema,
  CheckPinSchema,
  FamilyNameUpdateSchema,
  PermissionOverrideCreateSchema,
} from '@family-os/schemas'
import { sniffImageMime, imageHash, avatarUrl, MAX_IMAGE_BYTES } from '../lib/image'

function requireTier4(tier: number): { error: string } | null {
  return tier < 4 ? { error: 'Requires tier 4' } : null
}

/**
 * Who may change a given profile's photo (ADR 042).
 *
 * Anyone may change their OWN — choosing your face is not administration — and
 * tier 4 may change anyone's. The household pseudo-profile is tier-4 only: it has
 * tier 1 itself, so the "own profile" branch would otherwise let a family session
 * set the household photo.
 *
 * Row ownership is checked explicitly rather than through a `subject()`-tagged CASL
 * call: @casl/prisma's typed PrismaAbility keys subject instances by Prisma model
 * name and can't carry our namespaced string subjects (same limitation chores.Task
 * hit). The CASL capability still gates, so a parent's override revokes self-serve.
 */
function canEditAvatar(request: FastifyRequest, targetId: string): boolean {
  if (!request.ability.can('update', 'platform.Avatar')) return false
  if (targetId === FAMILY_PROFILE_ID) return request.profile.tier >= 4
  return request.profile.tier >= 4 || targetId === request.profile.id
}

const profilesPlugin: FastifyPluginAsync = async (fastify) => {
  // The client crops and encodes to WebP on a canvas, so an avatar arrives as one
  // raw image body — no multipart, and no `sharp` on the server (ADR 042). Parse
  // the allowed types as a Buffer; the bytes are still sniffed before storage.
  fastify.addContentTypeParser(
    ['image/webp', 'image/png', 'image/jpeg'],
    { parseAs: 'buffer', bodyLimit: MAX_IMAGE_BYTES },
    (_req, body, done) => done(null, body)
  )
  // POST /profiles — create a new profile (tier 4 only)
  fastify.post('/profiles', async (request, reply) => {
    const guard = requireTier4(request.profile.tier)
    if (guard) return reply.status(403).send(guard)

    const result = CreateProfileSchema.safeParse(request.body)
    if (!result.success) return reply.status(400).send({ error: result.error.flatten() })

    const { name, tier } = result.data
    // No widget layout is written: GET /home/layout serves the current default until
    // the profile actually customizes it (see home.ts).
    const profile = await prisma.profile.create({ data: { name, tier } })

    return { id: profile.id, name: profile.name, tier: profile.tier }
  })

  // PATCH /profiles/:id — update name and/or tier (tier 4 only)
  fastify.patch<{ Params: { id: string } }>('/profiles/:id', async (request, reply) => {
    const guard = requireTier4(request.profile.tier)
    if (guard) return reply.status(403).send(guard)

    const { id } = request.params
    if (id === FAMILY_PROFILE_ID)
      return reply.status(400).send({ error: 'Cannot edit the family profile' })

    const result = UpdateProfileSchema.safeParse(request.body)
    if (!result.success) return reply.status(400).send({ error: result.error.flatten() })

    const target = await prisma.profile.findUnique({ where: { id } })
    if (!target) return reply.status(404).send({ error: 'Profile not found' })

    // Prevent demoting the last tier-4 profile
    if (result.data.tier !== undefined && result.data.tier < 4 && target.tier === 4) {
      const tier4Count = await prisma.profile.count({ where: { tier: 4 } })
      if (tier4Count <= 1)
        return reply.status(409).send({ error: 'At least one administrator (tier 4) must remain' })
    }

    // Tier change — clear overrides atomically so stale grants/revocations don't carry over
    if (result.data.tier !== undefined && result.data.tier !== target.tier) {
      const [, updated] = await prisma.$transaction([
        prisma.permissionOverride.deleteMany({ where: { profileId: id } }),
        prisma.profile.update({ where: { id }, data: result.data }),
      ])
      return {
        id: updated.id,
        name: updated.name,
        tier: updated.tier,
        focusMode: updated.focusMode,
      }
    }

    const updated = await prisma.profile.update({ where: { id }, data: result.data })
    return { id: updated.id, name: updated.name, tier: updated.tier, focusMode: updated.focusMode }
  })

  // ─── Avatar photos (ADR 042) ────────────────────────────────────────────────

  // GET /profiles/:id/avatar — serve the stored bytes.
  //
  // Immutable: the `?v=` hash changes whenever the photo does, so a client may
  // cache this forever. Content-Type is the one we sniffed at upload, never one
  // the client asserted, and `nosniff` stops the browser second-guessing it.
  fastify.get<{ Params: { id: string } }>('/profiles/:id/avatar', async (request, reply) => {
    const image = await prisma.profileImage.findUnique({ where: { profileId: request.params.id } })
    if (!image) return reply.status(404).send({ error: 'No avatar set' })

    return reply
      .header('Content-Type', image.mimeType)
      .header('X-Content-Type-Options', 'nosniff')
      .header('Content-Security-Policy', "default-src 'none'; sandbox")
      .header('Cache-Control', 'public, max-age=31536000, immutable')
      .send(Buffer.from(image.bytes))
  })

  // POST /profiles/:id/avatar — upload. Raw image body (see the content-type parser).
  fastify.post<{ Params: { id: string } }>('/profiles/:id/avatar', async (request, reply) => {
    const { id } = request.params

    const target = await prisma.profile.findUnique({ where: { id } })
    if (!target) return reply.status(404).send({ error: 'Profile not found' })

    if (!canEditAvatar(request, id)) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const body = request.body
    if (!Buffer.isBuffer(body) || body.length === 0) {
      return reply.status(400).send({ error: 'Expected a raw image body' })
    }

    // Trust the bytes, not the client. A whitelist sniff is what keeps an SVG (or
    // an HTML file wearing an image Content-Type) out of a same-origin inline response.
    const mimeType = sniffImageMime(body)
    if (!mimeType) {
      return reply.status(415).send({ error: 'Unsupported image format — use JPEG, PNG or WebP' })
    }

    const hash = imageHash(body)
    const url = avatarUrl(id, hash)
    // Prisma's Bytes maps to Uint8Array<ArrayBuffer>; a Node Buffer is
    // Buffer<ArrayBufferLike>, which is not assignable. Copy into a plain view.
    const bytes = new Uint8Array(body)

    await prisma.$transaction([
      prisma.profileImage.upsert({
        where: { profileId: id },
        update: { bytes, mimeType, hash },
        create: { profileId: id, bytes, mimeType, hash },
      }),
      prisma.profile.update({ where: { id }, data: { avatarUrl: url } }),
    ])

    return { avatarUrl: url }
  })

  // DELETE /profiles/:id/avatar — drop back to initials.
  fastify.delete<{ Params: { id: string } }>('/profiles/:id/avatar', async (request, reply) => {
    const { id } = request.params

    const target = await prisma.profile.findUnique({ where: { id } })
    if (!target) return reply.status(404).send({ error: 'Profile not found' })

    if (!canEditAvatar(request, id)) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    await prisma.$transaction([
      prisma.profileImage.deleteMany({ where: { profileId: id } }),
      prisma.profile.update({ where: { id }, data: { avatarUrl: null } }),
    ])

    return { ok: true }
  })

  // DELETE /profiles/:id — delete a profile (tier 4 only)
  fastify.delete<{ Params: { id: string } }>('/profiles/:id', async (request, reply) => {
    const guard = requireTier4(request.profile.tier)
    if (guard) return reply.status(403).send(guard)

    const { id } = request.params
    if (id === FAMILY_PROFILE_ID)
      return reply.status(400).send({ error: 'Cannot delete the family profile' })

    const target = await prisma.profile.findUnique({ where: { id } })
    if (!target) return reply.status(404).send({ error: 'Profile not found' })

    await prisma.widgetLayout.deleteMany({ where: { profileId: id } })
    await prisma.permissionOverride.deleteMany({ where: { profileId: id } })
    await prisma.profile.delete({ where: { id } })

    // Revert session to family pseudo-profile if the active profile was just deleted
    if (request.session.activeProfileId === id) {
      request.session.activeProfileId = FAMILY_PROFILE_ID
    }

    return { ok: true }
  })

  // GET /profiles/:id/permissions — list effective permission state for a profile (tier 4 only)
  fastify.get<{ Params: { id: string } }>('/profiles/:id/permissions', async (request, reply) => {
    const guard = requireTier4(request.profile.tier)
    if (guard) return reply.status(403).send(guard)

    const { id } = request.params
    const target = await prisma.profile.findUnique({ where: { id } })
    if (!target) return reply.status(404).send({ error: 'Profile not found' })

    const overrides = await prisma.permissionOverride.findMany({ where: { profileId: id } })
    const baselineAbility = createAbility(
      { id: target.id, name: target.name, tier: target.tier as TierLevel },
      []
    )

    const permissions = Object.entries(PERMISSION_REGISTRY).map(([key, entry]) => {
      const inBaseline = baselineAbility.can(entry.action as never, entry.subject as never)
      const match = overrides.find((o) => o.action === entry.action && o.subject === entry.subject)
      return {
        key,
        label: entry.label,
        action: entry.action,
        subject: entry.subject,
        inBaseline,
        overrideId: match?.id ?? null,
        override: match ? (match.type as 'grant' | 'revocation') : null,
      }
    })

    return { permissions }
  })

  // POST /profiles/:id/permissions — create a permission override (tier 4 only, not own profile)
  fastify.post<{ Params: { id: string } }>('/profiles/:id/permissions', async (request, reply) => {
    const guard = requireTier4(request.profile.tier)
    if (guard) return reply.status(403).send(guard)

    const { id } = request.params
    if (id === request.profile.id)
      return reply.status(403).send({ error: 'Cannot edit overrides for your own profile' })

    const target = await prisma.profile.findUnique({ where: { id } })
    if (!target) return reply.status(404).send({ error: 'Profile not found' })

    const result = PermissionOverrideCreateSchema.safeParse(request.body)
    if (!result.success) return reply.status(400).send({ error: result.error.flatten() })

    const { action, subject, type } = result.data
    const created = await prisma.permissionOverride.create({
      data: { profileId: id, action, subject, type, grantedBy: request.profile.id },
    })

    return { id: created.id }
  })

  // DELETE /profiles/:id/permissions/:permissionId — remove an override (tier 4 only, not own profile)
  fastify.delete<{ Params: { id: string; permissionId: string } }>(
    '/profiles/:id/permissions/:permissionId',
    async (request, reply) => {
      const guard = requireTier4(request.profile.tier)
      if (guard) return reply.status(403).send(guard)

      const { id, permissionId } = request.params
      if (id === request.profile.id)
        return reply.status(403).send({ error: 'Cannot edit overrides for your own profile' })

      const override = await prisma.permissionOverride.findFirst({
        where: { id: permissionId, profileId: id },
      })
      if (!override) return reply.status(404).send({ error: 'Override not found' })

      await prisma.permissionOverride.delete({ where: { id: permissionId } })
      return { ok: true }
    }
  )

  // POST /auth/pin — reset the family PIN (tier 4 only)
  fastify.post('/auth/pin', async (request, reply) => {
    const guard = requireTier4(request.profile.tier)
    if (guard) return reply.status(403).send(guard)

    const result = ResetPinSchema.safeParse(request.body)
    if (!result.success) return reply.status(400).send({ error: result.error.flatten() })

    const { currentPin, newPin } = result.data

    const config = await prisma.systemConfig.findUnique({ where: { key: 'family_pin_hash' } })

    if (config) {
      // PIN already set — current PIN must be verified
      if (!currentPin) return reply.status(422).send({ error: 'Current PIN is required' })
      const valid = await bcrypt.compare(currentPin, config.value as string)
      if (!valid) return reply.status(403).send({ error: 'Current PIN is incorrect' })
    }
    // No PIN set — allowed to proceed without currentPin

    const newHash = await bcrypt.hash(newPin, 10)
    await prisma.systemConfig.upsert({
      where: { key: 'family_pin_hash' },
      update: { value: newHash },
      create: { key: 'family_pin_hash', value: newHash },
    })

    return { ok: true }
  })

  // GET /auth/pin-exists — returns whether the family PIN has been set (tier 4 only)
  fastify.get('/auth/pin-exists', async (request, reply) => {
    const guard = requireTier4(request.profile.tier)
    if (guard) return reply.status(403).send(guard)

    const config = await prisma.systemConfig.findUnique({ where: { key: 'family_pin_hash' } })
    return { exists: !!config }
  })

  // POST /auth/pin/check — verify current PIN without changing it (tier 4 only)
  fastify.post('/auth/pin/check', async (request, reply) => {
    const guard = requireTier4(request.profile.tier)
    if (guard) return reply.status(403).send(guard)

    const result = CheckPinSchema.safeParse(request.body)
    if (!result.success) return reply.status(400).send({ error: result.error.flatten() })

    const config = await prisma.systemConfig.findUnique({ where: { key: 'family_pin_hash' } })
    if (!config) return reply.status(423).send({ error: 'No family PIN has been set' })

    const valid = await bcrypt.compare(result.data.pin, config.value as string)
    if (!valid) return reply.status(403).send({ error: 'Incorrect PIN' })

    return { ok: true }
  })

  // PATCH /settings/family-name — update the family name in system_config (tier 4 only)
  fastify.patch('/settings/family-name', async (request, reply) => {
    const guard = requireTier4(request.profile.tier)
    if (guard) return reply.status(403).send(guard)

    const result = FamilyNameUpdateSchema.safeParse(request.body)
    if (!result.success) return reply.status(400).send({ error: result.error.flatten() })

    await prisma.systemConfig.upsert({
      where: { key: 'family_name' },
      update: { value: result.data.name },
      create: { key: 'family_name', value: result.data.name },
    })

    return { familyName: result.data.name }
  })
}

export default fp(profilesPlugin, { name: 'profiles' })
