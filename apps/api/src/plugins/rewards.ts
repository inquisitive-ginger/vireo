import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'
import { prisma } from '@family-os/platform/server'
import { FAMILY_PROFILE_ID } from '@family-os/platform/types'
import { getBalance, listEntries } from '../lib/ledger'

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 50

const rewardsPlugin: FastifyPluginAsync = async (fastify) => {
  // GET /rewards/wallet?profileId=&cursor=&limit= — balance plus the history that
  // explains it. Every tier reads its OWN wallet, tier 1 included (ADR 053);
  // `profileId` reads someone else's and is tier-4 only.
  fastify.get('/rewards/wallet', async (request, reply) => {
    const query = request.query as { profileId?: string; cursor?: string; limit?: string }
    const profileId = query.profileId ?? request.profile.id

    // Row-level ownership is enforced explicitly, as it is in chores — @casl/prisma
    // can't carry our namespaced string subject on a subject() instance.
    const canView = request.ability.can('view', 'rewards.Wallet')
    const isOwnOrAdmin = request.profile.tier >= 4 || profileId === request.profile.id
    if (!canView || !isOwnOrAdmin) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    // ADR 053 — a household has no balance, and the fridge tablet sits on this
    // exact profile.
    if (profileId === FAMILY_PROFILE_ID) {
      return reply.status(403).send({ error: 'The family profile holds no balance' })
    }

    const profile = await prisma.profile.findUnique({ where: { id: profileId } })
    if (!profile) {
      return reply.status(404).send({ error: 'Profile not found' })
    }

    const limit = Math.min(parseInt(query.limit ?? String(DEFAULT_LIMIT), 10), MAX_LIMIT)
    if (isNaN(limit) || limit < 1) {
      return reply.status(400).send({ error: 'Invalid limit' })
    }

    const [balance, { entries, nextCursor }] = await Promise.all([
      getBalance(profileId),
      listEntries(profileId, { limit, cursor: query.cursor ?? null }),
    ])

    return {
      profileId,
      balance,
      entries: entries.map((e) => ({
        id: e.id,
        delta: e.delta,
        reason: e.reason,
        sourceType: e.sourceType,
        sourceId: e.sourceId,
        createdBy: e.createdBy,
        createdAt: e.createdAt.toISOString(),
      })),
      nextCursor,
    }
  })
}

export default fp(rewardsPlugin, { name: 'rewards' })
