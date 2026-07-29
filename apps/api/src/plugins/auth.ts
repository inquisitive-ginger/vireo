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

const isProduction = process.env.NODE_ENV === 'production'

// The family PIN is four digits (ProfileGrid submits at length 4) — 10,000
// combinations, and the only credential guarding a tier-4 profile. The attacker
// this is actually built for is a kid with the household's own device, so a VPN
// does not remove the need for it.
const PIN_MAX_ATTEMPTS = 5
const PIN_WINDOW_MS = 15 * 60 * 1000

const pinFailures = new Map<string, { count: number; resetAt: number }>()

/** Seconds remaining on a lockout, or 0 if the caller may attempt a PIN. */
function pinLockoutSeconds(key: string): number {
  const record = pinFailures.get(key)
  if (!record) return 0
  if (Date.now() >= record.resetAt) {
    pinFailures.delete(key)
    return 0
  }
  if (record.count < PIN_MAX_ATTEMPTS) return 0
  return Math.ceil((record.resetAt - Date.now()) / 1000)
}

function recordPinFailure(key: string): void {
  const now = Date.now()
  const record = pinFailures.get(key)
  const count = record && now < record.resetAt ? record.count + 1 : 1
  pinFailures.set(key, { count, resetAt: now + PIN_WINDOW_MS })
}

/** Test seam — the limiter is process-wide and app.inject shares one client IP. */
export function resetPinRateLimit(): void {
  pinFailures.clear()
}

const authPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(fastifyCookie)

  const sessionSecret = process.env.SESSION_SECRET
  if (isProduction && !sessionSecret) {
    throw new Error('SESSION_SECRET must be set in production')
  }

  const PgStore = ConnectPgSimple(
    fastifySession as unknown as Parameters<typeof ConnectPgSimple>[0]
  )

  await fastify.register(fastifySession, {
    secret: sessionSecret ?? 'dev-secret-change-in-production-32chars',
    cookie: {
      secure: isProduction,
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    store: new PgStore({
      conString:
        process.env.DATABASE_URL ?? 'postgresql://familyos:familyos@localhost:5432/familyos',
      createTableIfMissing: false,
      schemaName: 'platform',
      tableName: 'sessions',
    }) as unknown as FastifySessionStore,
  })

  // @fastify/session drops a Secure cookie when request.protocol !== 'https' and
  // still answers 200, so a missing X-Forwarded-Proto breaks every login in the
  // house with no error raised anywhere. Say it once rather than never.
  if (isProduction) {
    let warned = false
    fastify.addHook('onRequest', async (request) => {
      if (!warned && request.protocol !== 'https') {
        warned = true
        request.log.error(
          'X-Forwarded-Proto is not https — Secure session cookies are being dropped'
        )
      }
    })
  }

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
          identityHue: row.identityHue,
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
      avatarUrl: request.profile.avatarUrl ?? null,
      identityHue: request.profile.identityHue ?? null,
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

    // The Family profile is synthetic (no DB row); the preHandler fabricates it on read.
    if (targetProfileId === FAMILY_PROFILE_ID) {
      request.session.activeProfileId = FAMILY_PROFILE_ID
      return { id: FAMILY_PROFILE_ID, name: 'Family', tier: 1 }
    }

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
    return profiles.map((p) => ({
      id: p.id,
      name: p.name,
      tier: p.tier,
      avatarUrl: p.avatarUrl,
      identityHue: p.identityHue,
      focusMode: p.focusMode,
    }))
  })

  fastify.post<{ Body: { pin: string; targetProfileId: string } }>(
    '/auth/verify-pin',
    async (request, reply) => {
      const { pin, targetProfileId } = request.body

      const lockedFor = pinLockoutSeconds(request.ip)
      if (lockedFor > 0) {
        return reply
          .status(429)
          .header('Retry-After', String(lockedFor))
          .send({ error: 'Too many attempts', retryAfter: lockedFor })
      }

      const config = await prisma.systemConfig.findUnique({ where: { key: 'family_pin_hash' } })
      if (!config) return reply.status(423).send({ error: 'No family PIN has been set' })

      const pinHash = config.value as string
      const valid = await bcrypt.compare(pin, pinHash)
      if (!valid) {
        recordPinFailure(request.ip)
        return reply.status(403).send({ error: 'Invalid PIN' })
      }
      pinFailures.delete(request.ip)

      const target = await prisma.profile.findUnique({ where: { id: targetProfileId } })
      if (!target) return reply.status(404).send({ error: 'Profile not found' })

      request.session.activeProfileId = targetProfileId
      return { id: target.id, name: target.name, tier: target.tier }
    }
  )
}

export default fp(authPlugin, { name: 'auth' })
