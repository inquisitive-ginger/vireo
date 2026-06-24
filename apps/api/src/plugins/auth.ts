import fp from 'fastify-plugin'
import type { FastifyPluginAsync, FastifyRequest } from 'fastify'
import fastifySession from '@fastify/session'
import fastifyCookie from '@fastify/cookie'
import ConnectPgSimple from 'connect-pg-simple'
import bcrypt from 'bcryptjs'
import { prisma } from '@family-os/platform/server'
import { createAbility } from '@family-os/platform/server'
import type { AppAbility } from '@family-os/platform/server'
import type { Profile } from '@family-os/platform/types'
import { resolveFocusMode, FAMILY_PROFILE_ID } from '@family-os/platform/types'

declare module 'fastify' {
  interface Session {
    activeProfileId: string
  }
  interface FastifyRequest {
    profile: Profile
    ability: AppAbility
  }
}

// connect-pg-simple uses express-session's SessionData; @fastify/session expects Session.
// Same shape at runtime — this bridges the structural mismatch at the type level.
type FastifySessionStore = Exclude<Parameters<typeof fastifySession>[1]['store'], undefined>

const authPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(fastifyCookie)

  const PgStore = ConnectPgSimple(
    fastifySession as unknown as Parameters<typeof ConnectPgSimple>[0]
  )

  await fastify.register(fastifySession, {
    secret: process.env.SESSION_SECRET ?? 'dev-secret-change-in-production-32chars',
    cookie: { secure: false, httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 },
    store: new PgStore({
      conString:
        process.env.DATABASE_URL ?? 'postgresql://familyos:familyos@localhost:5432/familyos',
      createTableIfMissing: false,
      schemaName: 'platform',
      tableName: 'sessions',
    }) as unknown as FastifySessionStore,
  })

  // Auth middleware — resolves activeProfileId → Profile + AppAbility on every request
  fastify.addHook('preHandler', async (request: FastifyRequest) => {
    const profileId = request.session.activeProfileId ?? FAMILY_PROFILE_ID

    const row = await prisma.profile.findUnique({
      where: { id: profileId },
      include: { permissionOverrides: true },
    })

    const profile: Profile = row
      ? {
          id: row.id,
          name: row.name,
          tier: row.tier as Profile['tier'],
          avatarUrl: row.avatarUrl ?? undefined,
          darkMode: row.darkMode ?? null,
          focusMode: row.focusMode ?? null,
          pushEnabled: row.pushEnabled,
        }
      : {
          id: FAMILY_PROFILE_ID,
          name: 'Family',
          tier: 1,
          darkMode: null,
          focusMode: null,
          pushEnabled: false,
        }

    const overrides =
      row?.permissionOverrides.map((o) => ({
        id: o.id,
        profileId: o.profileId,
        action: o.action,
        subject: o.subject,
        type: o.type as 'grant' | 'revocation',
        grantedBy: o.grantedBy ?? undefined,
      })) ?? []

    request.profile = profile
    request.ability = createAbility(profile, overrides)
  })

  fastify.get('/auth/me', async (request) => {
    const familyNameConfig = await prisma.systemConfig.findUnique({ where: { key: 'family_name' } })
    return {
      id: request.profile.id,
      name: request.profile.name,
      tier: request.profile.tier,
      darkMode: request.profile.darkMode ?? null,
      // Effective variant — null override defers to the tier default (ADR 036).
      focusMode: resolveFocusMode(request.profile.focusMode, request.profile.tier),
      pushEnabled: request.profile.pushEnabled ?? false,
      familyName: (familyNameConfig?.value as string | null) ?? null,
      rules: request.ability.rules,
    }
  })

  fastify.post<{ Body: { targetProfileId: string } }>('/auth/switch', async (request, reply) => {
    const { targetProfileId } = request.body

    const target = await prisma.profile.findUnique({ where: { id: targetProfileId } })
    if (!target) return reply.status(404).send({ error: 'Profile not found' })

    if (target.tier === 4 && request.profile.tier < 4) {
      return reply.status(403).send({ error: 'PIN required to switch to a tier-4 profile' })
    }

    request.session.activeProfileId = targetProfileId
    return { id: target.id, name: target.name, tier: target.tier }
  })

  fastify.get('/profiles', async () => {
    const profiles = await prisma.profile.findMany({ orderBy: { tier: 'desc' } })
    // focusMode is the raw nullable override (null = tier default) so the parent
    // override UI can show "Default" vs an explicit choice (ADR 036).
    return profiles.map((p) => ({ id: p.id, name: p.name, tier: p.tier, focusMode: p.focusMode }))
  })

  fastify.post<{ Body: { pin: string; targetProfileId: string } }>(
    '/auth/verify-pin',
    async (request, reply) => {
      const { pin, targetProfileId } = request.body

      const config = await prisma.systemConfig.findUnique({ where: { key: 'family_pin_hash' } })
      if (!config) return reply.status(423).send({ error: 'No family PIN has been set' })

      const pinHash = config.value as string
      const valid = await bcrypt.compare(pin, pinHash)
      if (!valid) return reply.status(403).send({ error: 'Invalid PIN' })

      const target = await prisma.profile.findUnique({ where: { id: targetProfileId } })
      if (!target) return reply.status(404).send({ error: 'Profile not found' })

      request.session.activeProfileId = targetProfileId
      return { id: target.id, name: target.name, tier: target.tier }
    }
  )
}

export default fp(authPlugin, { name: 'auth' })
