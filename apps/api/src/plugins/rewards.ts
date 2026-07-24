import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'
import { prisma } from '@family-os/platform/server'
import type { EventBus } from '@family-os/platform/server'
import { FAMILY_PROFILE_ID } from '@family-os/platform/types'
import { getBalance, listEntries, postEntry } from '../lib/ledger'
import {
  approvePayout,
  declinePayout,
  findPayout,
  getPayout,
  holdPayout,
  listPayouts,
  PayoutError,
  voidPayout,
  type PendingPayoutRecord,
} from '../lib/payouts'

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 50
const CHORE_SOURCE = 'chores.task'

// ─── Chores earn subscriber (ADR 048) ────────────────────────────────────────
//
// `rewards` never imports `chores` — it credits whatever a chore event carries.
// `coinReward` is priced on the task (defaults to 0), so most completions move
// nothing. The ledger keys by the completion INSTANCE (`taskId@completedAt`), not
// the task, so a reopen→re-complete cycle re-earns instead of colliding with the
// original credit; the reversal uses a distinct sourceType against the same
// instance id. Both directions are idempotent under the ledger's unique key.
//
// M4/3b: a chore may opt into approval (`requiresApproval`). Its payout is HELD in
// `pending_payouts` instead of crediting on completion, and a parent releases it
// (see the routes below). The auto path is unchanged.

type ChoreEarnPayload = {
  taskId: string
  assigneeId: string
  coinReward: number
  completedAt: string | null
  title?: string
  requiresApproval?: boolean
}

const instanceId = (taskId: string, completedAt: string): string => `${taskId}@${completedAt}`

async function handleChoreCredit(payload: unknown, bus: EventBus): Promise<void> {
  const { taskId, assigneeId, coinReward, completedAt, title, requiresApproval } =
    payload as ChoreEarnPayload
  if (!(coinReward > 0) || !completedAt) return

  const source = { sourceType: CHORE_SOURCE, sourceId: instanceId(taskId, completedAt) }

  // Held, not credited: the balance doesn't move until a parent approves.
  if (requiresApproval) {
    await holdPayout({
      profileId: assigneeId,
      amount: coinReward,
      reason: title ?? 'Chore',
      ...source,
    })
    return
  }

  await postEntry(bus, {
    profileId: assigneeId,
    delta: coinReward,
    reason: title ?? 'Chore',
    ...source,
  })
}

async function handleChoreReversal(payload: unknown, bus: EventBus): Promise<void> {
  const { taskId, assigneeId, coinReward, completedAt, title } = payload as ChoreEarnPayload
  // A reopen with no prior completedAt reverses nothing (it was never credited).
  if (!(coinReward > 0) || !completedAt) return

  const sourceId = instanceId(taskId, completedAt)

  // A payout still awaiting a decision was never credited, so voiding it moves no
  // balance (ADR 047). Once released (approved) — or on the auto path, where no
  // payout row exists — the reversal debits, exactly as M4/3 did. A declined or
  // already-voided payout never credited, so there is nothing to reverse.
  const payout = await findPayout(CHORE_SOURCE, sourceId)
  if (payout?.status === 'pending') {
    await voidPayout(CHORE_SOURCE, sourceId)
    return
  }
  if (payout && payout.status !== 'approved') return

  await postEntry(bus, {
    profileId: assigneeId,
    delta: -coinReward,
    reason: title ? `Reopened: ${title}` : 'Chore reopened',
    sourceType: 'chores.task.reversal',
    sourceId,
  })
}

async function handleChoreDeleted(payload: unknown): Promise<void> {
  const { taskId, coinReward, completedAt } = payload as ChoreEarnPayload
  // Only a still-pending payout is voided. An already-approved one leaves its ledger
  // entry alone — deleting the chore record does not claw back money already paid.
  if (!(coinReward > 0) || !completedAt) return
  await voidPayout(CHORE_SOURCE, instanceId(taskId, completedAt))
}

function serializePayout(p: PendingPayoutRecord) {
  return {
    id: p.id,
    profileId: p.profileId,
    amount: p.amount,
    reason: p.reason,
    sourceType: p.sourceType,
    sourceId: p.sourceId,
    status: p.status,
    decidedBy: p.decidedBy,
    decidedNote: p.decidedNote,
    decidedAt: p.decidedAt ? p.decidedAt.toISOString() : null,
    createdAt: p.createdAt.toISOString(),
  }
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

  // GET /rewards/payouts?status=&profileId= — held payouts. The tier-4 board reads
  // ALL pending payouts (to overlay the tray onto its rows); a kid reads their OWN
  // (pending → the "held" badge, declined → the note). `status` is a comma list,
  // default `pending`. Scope mirrors the wallet: tier 4 sees everyone; below that,
  // forced to own.
  fastify.get('/rewards/payouts', async (request, reply) => {
    const query = request.query as { status?: string; profileId?: string; limit?: string }

    if (!request.ability.can('view', 'rewards.Wallet')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }
    const isAdmin = request.profile.tier >= 4

    // Below tier 4 the scope is always the caller's own profile, whatever they ask.
    const profileId = isAdmin ? query.profileId : request.profile.id
    if (profileId === FAMILY_PROFILE_ID) {
      return reply.status(403).send({ error: 'The family profile holds no balance' })
    }

    const statuses = (query.status ?? 'pending')
      .split(',')
      .map((s) => s.trim())
      .filter((s) => ['pending', 'approved', 'declined', 'voided'].includes(s))
    if (statuses.length === 0) {
      return reply.status(400).send({ error: 'Invalid status' })
    }

    const limit = Math.min(parseInt(query.limit ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT, 100)

    const payouts = await listPayouts({ profileId: profileId ?? undefined, statuses, limit })
    return { payouts: payouts.map(serializePayout) }
  })

  // PATCH /rewards/payouts/:id — a parent releases or refuses a held payout. Tier 4
  // only (`decide` via `manage all`). Approve writes the normal ledger credit;
  // decline stores the optional note and moves nothing. Deciding an
  // already-decided payout is a 409 — the decision is final.
  fastify.patch('/rewards/payouts/:id', async (request, reply) => {
    if (!request.ability.can('decide', 'rewards.Payout')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }

    const { id } = request.params as { id: string }
    const body = (request.body ?? {}) as { decision?: unknown; note?: unknown }
    if (body.decision !== 'approve' && body.decision !== 'decline') {
      return reply.status(400).send({ error: "decision must be 'approve' or 'decline'" })
    }

    const existing = await getPayout(id)
    if (!existing) {
      return reply.status(404).send({ error: 'Payout not found' })
    }

    try {
      if (body.decision === 'approve') {
        const { payout, balance } = await approvePayout(fastify.eventBus, id, request.profile.id)
        return { payout: serializePayout(payout), balance }
      }
      const note =
        typeof body.note === 'string' && body.note.trim().length > 0 ? body.note.trim() : null
      const { payout } = await declinePayout(id, request.profile.id, note)
      return { payout: serializePayout(payout), balance: null }
    } catch (err) {
      if (err instanceof PayoutError) {
        return reply.status(409).send({ error: err.message })
      }
      throw err
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
  fastify.eventBus.on('chores.task.deleted', (payload) => {
    void handleChoreDeleted(payload).catch((err) =>
      fastify.log.error({ err }, '[rewards] chore deleted subscriber failed')
    )
  })
}

export default fp(rewardsPlugin, { name: 'rewards' })
