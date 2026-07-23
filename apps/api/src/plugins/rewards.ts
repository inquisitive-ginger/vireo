import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'
import { prisma } from '@family-os/platform/server'
import type { EventBus } from '@family-os/platform/server'
import { FAMILY_PROFILE_ID } from '@family-os/platform/types'
import { getBalance, listEntries, postEntry } from '../lib/ledger'

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 50

// ─── Chores earn subscriber (ADR 048) ────────────────────────────────────────
//
// `rewards` never imports `chores` — it credits whatever a chore event carries.
// `coinReward` is priced on the task (defaults to 0), so most completions move
// nothing. The ledger keys by the completion INSTANCE (`taskId@completedAt`), not
// the task, so a reopen→re-complete cycle re-earns instead of colliding with the
// original credit; the reversal uses a distinct sourceType against the same
// instance id. Both directions are idempotent under the ledger's unique key.

type ChoreEarnPayload = {
  taskId: string
  assigneeId: string
  coinReward: number
  completedAt: string | null
  title?: string
}

const instanceId = (taskId: string, completedAt: string): string => `${taskId}@${completedAt}`

async function handleChoreCredit(payload: unknown, bus: EventBus): Promise<void> {
  const { taskId, assigneeId, coinReward, completedAt, title } = payload as ChoreEarnPayload
  if (coinReward <= 0 || !completedAt) return

  await postEntry(bus, {
    profileId: assigneeId,
    delta: coinReward,
    reason: title ?? 'Chore',
    sourceType: 'chores.task',
    sourceId: instanceId(taskId, completedAt),
  })
}

async function handleChoreReversal(payload: unknown, bus: EventBus): Promise<void> {
  const { taskId, assigneeId, coinReward, completedAt, title } = payload as ChoreEarnPayload
  // A reopen with no prior completedAt reverses nothing (it was never credited).
  if (coinReward <= 0 || !completedAt) return

  await postEntry(bus, {
    profileId: assigneeId,
    delta: -coinReward,
    reason: title ? `Reopened: ${title}` : 'Chore reopened',
    sourceType: 'chores.task.reversal',
    sourceId: instanceId(taskId, completedAt),
  })
}

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

  // ─── Event subscribers ─────────────────────────────────────────────────────
  // Earning is contributed (ADR 048): rewards listens to chore events and moves
  // the ledger. Errors are logged and swallowed so a failed credit never fails
  // the chore completion that triggered it.
  fastify.eventBus.on('chores.task.completed', (payload) => {
    void handleChoreCredit(payload, fastify.eventBus).catch((err) =>
      fastify.log.error({ err }, '[rewards] chore credit subscriber failed')
    )
  })
  fastify.eventBus.on('chores.task.reopened', (payload) => {
    void handleChoreReversal(payload, fastify.eventBus).catch((err) =>
      fastify.log.error({ err }, '[rewards] chore reversal subscriber failed')
    )
  })
}

export default fp(rewardsPlugin, { name: 'rewards' })
