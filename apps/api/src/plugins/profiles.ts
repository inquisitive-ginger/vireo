import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'
import bcrypt from 'bcryptjs'
import { prisma } from '@family-os/platform/server'
import {
  CreateProfileSchema,
  UpdateProfileSchema,
  ResetPinSchema,
  CheckPinSchema,
  FamilyNameUpdateSchema,
} from '@family-os/schemas'
import { seedWidgetLayout } from '../lib/seed-layout'

const FAMILY_PROFILE_ID = 'family'

function requireTier4(tier: number): { error: string } | null {
  return tier < 4 ? { error: 'Requires tier 4' } : null
}

const profilesPlugin: FastifyPluginAsync = async (fastify) => {
  // POST /profiles — create a new profile (tier 4 only)
  fastify.post('/profiles', async (request, reply) => {
    const guard = requireTier4(request.profile.tier)
    if (guard) return reply.status(403).send(guard)

    const result = CreateProfileSchema.safeParse(request.body)
    if (!result.success) return reply.status(400).send({ error: result.error.flatten() })

    const { name, tier } = result.data
    const profile = await prisma.profile.create({ data: { name, tier } })
    await seedWidgetLayout(profile.id, tier)

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

    const updated = await prisma.profile.update({
      where: { id },
      data: result.data,
    })

    return { id: updated.id, name: updated.name, tier: updated.tier }
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
