import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'
import { prisma } from '@family-os/platform/server'
import type { EventBus } from '@family-os/platform/server'
import { FAMILY_PROFILE_ID } from '@family-os/platform/types'
import {
  RewardCreateSchema,
  RewardUpdateSchema,
  RedemptionCreateSchema,
  RedemptionDecideSchema,
  REDEMPTION_STATUSES,
  PunchTemplateCreateSchema,
  PunchTemplateUpdateSchema,
  PunchPrizeSchema,
} from '@family-os/schemas'
import { rewardsPrisma } from '@family-os/plugin-rewards/db'
import { getBalance, listEntries, postEntry } from '../lib/ledger'
import { notify } from '../lib/notify'
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
import {
  decideUse,
  listRedemptions,
  purchaseRedemption,
  requestUse,
  restoreRedemption,
  revokeRedemption,
  RedemptionError,
  type RedemptionRecord,
  type RedemptionWithReward,
  type RewardRecord,
} from '../lib/redemptions'
import {
  choosePrize,
  ensureOpenCards,
  getCard,
  listCards,
  punchCard,
  removeCard,
  sweepUntouchedCards,
  undoPunch,
  PunchCardError,
  type CardResolved,
  type FinishedSummary,
  type PunchTemplateRecord,
  type RewardSummary,
} from '../lib/punch-cards'

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

function serializeReward(r: RewardRecord & { createdAt?: Date }) {
  return {
    id: r.id,
    name: r.name,
    emoji: r.emoji,
    description: r.description,
    cost: r.cost,
    requiresApproval: r.requiresApproval,
    // Empty audience = everyone. Null is friendlier to render than [] on the client.
    audience: r.audience.length > 0 ? r.audience : null,
    stock: r.stock,
    active: r.active,
  }
}

function serializeTemplate(t: PunchTemplateRecord & { payoutOptions?: RewardSummary[] }) {
  return {
    id: t.id,
    name: t.name,
    glyph: t.glyph,
    goal: t.goal,
    payoutKind: t.payoutKind,
    payoutCoins: t.payoutCoins,
    payoutOptionIds: t.payoutOptionIds,
    payoutOptions: t.payoutOptions ?? null,
    audience: t.audience.length > 0 ? t.audience : null,
    active: t.active,
  }
}

function serializeCard(c: CardResolved) {
  return {
    id: c.id,
    templateId: c.templateId,
    profileId: c.profileId,
    count: c.count,
    chosenRewardId: c.chosenRewardId,
    chosenReward: c.chosenReward,
    completedAt: c.completedAt ? c.completedAt.toISOString() : null,
    prizeClaimedAt: c.prizeClaimedAt ? c.prizeClaimedAt.toISOString() : null,
    createdAt: c.createdAt.toISOString(),
    template: serializeTemplate({ ...c.template, payoutOptions: c.payoutOptions }),
  }
}

function serializeFinished(f: FinishedSummary) {
  return {
    templateId: f.templateId,
    profileId: f.profileId,
    name: f.name,
    glyph: f.glyph,
    count: f.count,
    lastFinishedAt: f.lastFinishedAt ? f.lastFinishedAt.toISOString() : null,
  }
}

function serializeRedemption(r: RedemptionRecord | RedemptionWithReward) {
  return {
    id: r.id,
    rewardId: r.rewardId,
    profileId: r.profileId,
    cost: r.cost,
    status: r.status,
    purchasedAt: r.purchasedAt.toISOString(),
    useRequestedAt: r.useRequestedAt ? r.useRequestedAt.toISOString() : null,
    usedAt: r.usedAt ? r.usedAt.toISOString() : null,
    decidedBy: r.decidedBy,
    decidedAt: r.decidedAt ? r.decidedAt.toISOString() : null,
    decidedNote: r.decidedNote,
    reward: 'reward' in r ? r.reward : undefined,
  }
}

/** Alert every parent that a request is waiting. notify() skips tier < 2, so this is
    naturally the set of tier-4 parents; `alert` pushes to their handsets (ADR 029). */
async function notifyParents(
  bus: EventBus,
  input: { title: string; body?: string | null }
): Promise<void> {
  const parents = await prisma.profile.findMany({ where: { tier: 4 }, select: { id: true } })
  await Promise.all(
    parents.map((p) =>
      notify(bus, p.id, {
        title: input.title,
        body: input.body,
        variant: 'info',
        priority: 'alert',
      })
    )
  )
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

  // GET /rewards/store — the kid store (M4/5). Returns the caller's balance plus the
  // WHOLE active catalog scoped to them — never a pre-filtered affordable list, because
  // the store shows unaffordable rewards with their distance (spec: "distance, not
  // denial"). Affordability is a client rendering decision. Always own-scope: a store is
  // where you spend your own P-Bucks (`view rewards.Wallet`, tier 1+, own).
  fastify.get('/rewards/store', async (request, reply) => {
    if (!request.ability.can('view', 'rewards.Wallet')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }
    const profileId = request.profile.id
    if (profileId === FAMILY_PROFILE_ID) {
      return reply.status(403).send({ error: 'The family profile holds no balance' })
    }

    const [balance, active] = await Promise.all([
      getBalance(profileId),
      rewardsPrisma.reward.findMany({ where: { active: true }, orderBy: { cost: 'asc' } }),
    ])

    // Empty audience = everyone; a non-empty list scopes the reward to named kids.
    const rewards = active
      .filter((r) => r.audience.length === 0 || r.audience.includes(profileId))
      .map(serializeReward)

    return { profileId, balance, rewards }
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

  // ─── Catalog (M4/4) ──────────────────────────────────────────────────────────
  // Tier-4 CRUD (`manage rewards.Reward`). A kid never reaches these — browsing the
  // store to redeem is M4/5 and reads a different, kid-scoped endpoint.

  fastify.get('/rewards/rewards', async (request, reply) => {
    if (!request.ability.can('manage', 'rewards.Reward')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }
    const query = request.query as { includeRetired?: string }
    const rewards = await rewardsPrisma.reward.findMany({
      where: query.includeRetired === 'true' ? {} : { active: true },
      orderBy: [{ active: 'desc' }, { cost: 'asc' }],
    })
    return { rewards: rewards.map(serializeReward) }
  })

  fastify.post('/rewards/rewards', async (request, reply) => {
    if (!request.ability.can('manage', 'rewards.Reward')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }
    const parsed = RewardCreateSchema.safeParse(request.body)
    if (!parsed.success) return reply.status(400).send({ error: parsed.error.flatten() })
    const d = parsed.data
    const reward = await rewardsPrisma.reward.create({
      data: {
        name: d.name,
        emoji: d.emoji,
        description: d.description,
        cost: d.cost,
        requiresApproval: d.requiresApproval,
        audience: d.audience ?? [],
        stock: d.stock ?? null,
        active: d.active,
        createdBy: request.profile.id,
      },
    })
    return reply.status(201).send({ reward: serializeReward(reward) })
  })

  fastify.patch('/rewards/rewards/:id', async (request, reply) => {
    if (!request.ability.can('manage', 'rewards.Reward')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }
    const { id } = request.params as { id: string }
    const parsed = RewardUpdateSchema.safeParse(request.body)
    if (!parsed.success) return reply.status(400).send({ error: parsed.error.flatten() })
    const existing = await rewardsPrisma.reward.findUnique({ where: { id } })
    if (!existing) return reply.status(404).send({ error: 'Reward not found' })
    const d = parsed.data
    const reward = await rewardsPrisma.reward.update({
      where: { id },
      data: {
        ...(d.name !== undefined ? { name: d.name } : {}),
        ...(d.emoji !== undefined ? { emoji: d.emoji } : {}),
        ...(d.description !== undefined ? { description: d.description } : {}),
        ...(d.cost !== undefined ? { cost: d.cost } : {}),
        ...(d.requiresApproval !== undefined ? { requiresApproval: d.requiresApproval } : {}),
        ...(d.audience !== undefined ? { audience: d.audience ?? [] } : {}),
        ...(d.stock !== undefined ? { stock: d.stock } : {}),
        ...(d.active !== undefined ? { active: d.active } : {}),
      },
    })
    return { reward: serializeReward(reward) }
  })

  // DELETE retires a reward that redemptions — or punch-card finish lines (M4/6) —
  // reference; both need the row to survive (the FKs are RESTRICT). Hard-deletes an
  // unused one. Either way the store stops showing it.
  fastify.delete('/rewards/rewards/:id', async (request, reply) => {
    if (!request.ability.can('manage', 'rewards.Reward')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }
    const { id } = request.params as { id: string }
    const existing = await rewardsPrisma.reward.findUnique({ where: { id } })
    if (!existing) return reply.status(404).send({ error: 'Reward not found' })
    const [used, promised] = await Promise.all([
      rewardsPrisma.redemption.count({ where: { rewardId: id } }),
      rewardsPrisma.punchCardTemplate.count({ where: { payoutOptionIds: { has: id } } }),
    ])
    if (used + promised > 0) {
      const reward = await rewardsPrisma.reward.update({ where: { id }, data: { active: false } })
      return { retired: true, reward: serializeReward(reward) }
    }
    await rewardsPrisma.reward.delete({ where: { id } })
    return { deleted: true }
  })

  // ─── Redemptions (M4/4, reworked by ADR 055) ─────────────────────────────────
  // A redemption is a TICKET. Buy (create-own, every tier — ADR 053) debits at once
  // and lands `owned` — no parent gate at any price. Using it is a separate,
  // explicit act; `requiresApproval` gates use, and tier 4 answers yes / not-now.

  fastify.post('/rewards/redemptions', async (request, reply) => {
    // Create-own only: the ticket is always the caller's, so row-level ownership is
    // guaranteed by construction. The bare check still honours a revocation override.
    if (!request.ability.can('create', 'rewards.Redemption')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }
    const parsed = RedemptionCreateSchema.safeParse(request.body)
    if (!parsed.success) return reply.status(400).send({ error: parsed.error.flatten() })

    const reward = await rewardsPrisma.reward.findUnique({ where: { id: parsed.data.rewardId } })
    if (!reward) return reply.status(404).send({ error: 'Reward not found' })

    try {
      const { redemption, balance } = await purchaseRedemption(fastify.eventBus, {
        profileId: request.profile.id,
        reward,
      })
      return reply.status(201).send({ redemption: serializeRedemption(redemption), balance })
    } catch (err) {
      if (err instanceof RedemptionError)
        return reply.status(err.status).send({ error: err.message })
      throw err
    }
  })

  // POST /rewards/redemptions/:id/use — the kid tears an owned ticket. Same ability
  // as buying (using what you bought is not a second capability): a non-approval
  // ticket is `used` on the spot with no parent interaction at all; an approval one
  // waits as `use_requested` and the parents get the ask.
  fastify.post('/rewards/redemptions/:id/use', async (request, reply) => {
    if (!request.ability.can('create', 'rewards.Redemption')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }
    const { id } = request.params as { id: string }

    try {
      const { redemption } = await requestUse(fastify.eventBus, id, request.profile.id)
      if (redemption.status === 'use_requested') {
        await notifyParents(fastify.eventBus, {
          title: `${request.profile.name} wants to use ${redemption.reward.emoji} ${redemption.reward.name}`,
          body: 'Waiting on your OK',
        })
      }
      return { redemption: serializeRedemption(redemption) }
    } catch (err) {
      if (err instanceof RedemptionError)
        return reply.status(err.status).send({ error: err.message })
      throw err
    }
  })

  // GET /rewards/redemptions?status=&profileId= — the tier-4 queue reads everyone's
  // `use_requested` (the default); a kid reads their own pocket and history. Scope
  // mirrors the wallet: tier 4 sees all, below that forced to own.
  fastify.get('/rewards/redemptions', async (request, reply) => {
    if (!request.ability.can('view', 'rewards.Wallet')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }
    const query = request.query as { status?: string; profileId?: string; limit?: string }
    const isAdmin = request.profile.tier >= 4
    const profileId = isAdmin ? query.profileId : request.profile.id
    if (profileId === FAMILY_PROFILE_ID) {
      return reply.status(403).send({ error: 'The family profile holds no balance' })
    }

    const statuses = (query.status ?? 'use_requested')
      .split(',')
      .map((s) => s.trim())
      .filter((s) => (REDEMPTION_STATUSES as readonly string[]).includes(s))
    if (statuses.length === 0) {
      return reply.status(400).send({ error: 'Invalid status' })
    }

    const limit = Math.min(parseInt(query.limit ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT, 100)
    const redemptions = await listRedemptions({
      profileId: profileId ?? undefined,
      statuses,
      limit,
    })
    return { redemptions: redemptions.map(serializeRedemption) }
  })

  // PATCH /rewards/redemptions/:id — a parent answers a use request. Tier 4 only
  // (`decide` via `manage all`). Yes tears the ticket; not-now returns it to the
  // pocket with the optional note and NO refund — the ask was about timing, not
  // permission to spend (ADR 055). A decision with no request waiting is a 409.
  fastify.patch('/rewards/redemptions/:id', async (request, reply) => {
    if (!request.ability.can('decide', 'rewards.Redemption')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }
    const { id } = request.params as { id: string }
    const parsed = RedemptionDecideSchema.safeParse(request.body)
    if (!parsed.success) return reply.status(400).send({ error: parsed.error.flatten() })

    try {
      const { redemption } = await decideUse(
        fastify.eventBus,
        id,
        request.profile.id,
        parsed.data.action,
        parsed.data.note ?? null
      )
      // Tell the kid the news (notify() skips tier 1 — they'll see it in the pocket).
      const label = `${redemption.reward.emoji} ${redemption.reward.name}`
      await notify(
        fastify.eventBus,
        redemption.profileId,
        parsed.data.action === 'yes'
          ? { title: `Yes! ${label}`, variant: 'success', priority: 'alert' }
          : {
              title: `Not right now — ${label}`,
              body: redemption.decidedNote,
              variant: 'info',
              priority: 'alert',
            }
      )
      return { redemption: serializeRedemption(redemption) }
    } catch (err) {
      if (err instanceof RedemptionError)
        return reply.status(err.status).send({ error: err.message })
      throw err
    }
  })

  // POST /rewards/redemptions/:id/restore — the tier-4 "put it back": a ticket torn
  // by mistake returns to the pocket. Tier 4 only, and no balance moves — undoing a
  // tear is not a refund. A ticket that isn't `used` has nothing to undo (409).
  fastify.post('/rewards/redemptions/:id/restore', async (request, reply) => {
    if (!request.ability.can('decide', 'rewards.Redemption')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }
    const { id } = request.params as { id: string }

    try {
      const { redemption } = await restoreRedemption(fastify.eventBus, id, request.profile.id)
      await notify(fastify.eventBus, redemption.profileId, {
        title: `${redemption.reward.emoji} ${redemption.reward.name} is back in your pocket`,
        body: 'Use it again whenever you like',
        variant: 'info',
        priority: 'alert',
      })
      return { redemption: serializeRedemption(redemption) }
    } catch (err) {
      if (err instanceof RedemptionError)
        return reply.status(err.status).send({ error: err.message })
      throw err
    }
  })

  // DELETE /rewards/redemptions/:id — the tier-4 revoke exception (ADR 055): refund
  // the snapshot cost, remove the ticket. Never reachable from kid UI; a used
  // ticket was consumed and cannot be revoked (409).
  fastify.delete('/rewards/redemptions/:id', async (request, reply) => {
    if (!request.ability.can('decide', 'rewards.Redemption')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }
    const { id } = request.params as { id: string }

    try {
      const { redemption, balance } = await revokeRedemption(
        fastify.eventBus,
        id,
        request.profile.id
      )
      await notify(fastify.eventBus, redemption.profileId, {
        title: `${redemption.reward.emoji} ${redemption.reward.name} refunded`,
        body: `${redemption.cost} P-Bucks back in your wallet`,
        variant: 'info',
        priority: 'alert',
      })
      return { revoked: true, balance }
    } catch (err) {
      if (err instanceof RedemptionError)
        return reply.status(err.status).send({ error: err.message })
      throw err
    }
  })

  // ─── Punch cards (M4/6, ADR 049) ─────────────────────────────────────────────
  // Templates are tier-4 stocking, like the catalog. Cards materialize lazily on
  // read; the kid punches their own (`punch rewards.PunchCard`, row-checked), a
  // parent undoes via `manage all`.

  /** Every option must exist — an array carries no FK, so the route is the guard. */
  async function missingOptions(ids: string[]): Promise<boolean> {
    if (ids.length === 0) return false
    const found = await rewardsPrisma.reward.count({ where: { id: { in: ids } } })
    return found !== new Set(ids).size
  }

  async function optionSummaries(ids: string[]): Promise<Map<string, RewardSummary>> {
    if (ids.length === 0) return new Map()
    const rewards = await rewardsPrisma.reward.findMany({ where: { id: { in: ids } } })
    return new Map(
      rewards.map((r) => [
        r.id,
        {
          id: r.id,
          name: r.name,
          emoji: r.emoji,
          description: r.description,
          cost: r.cost,
          requiresApproval: r.requiresApproval,
          active: r.active,
        },
      ])
    )
  }

  function withOptions(
    t: PunchTemplateRecord,
    byId: Map<string, RewardSummary>
  ): PunchTemplateRecord & { payoutOptions: RewardSummary[] } {
    return {
      ...t,
      payoutOptions: t.payoutOptionIds
        .map((id) => byId.get(id))
        .filter((r): r is RewardSummary => !!r),
    }
  }

  fastify.get('/rewards/punch-templates', async (request, reply) => {
    if (!request.ability.can('manage', 'rewards.PunchCard')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }
    const query = request.query as { includeRetired?: string }
    const templates = await rewardsPrisma.punchCardTemplate.findMany({
      where: query.includeRetired === 'true' ? {} : { active: true },
      orderBy: [{ active: 'desc' }, { name: 'asc' }],
    })
    const byId = await optionSummaries(templates.flatMap((t) => t.payoutOptionIds))
    return { templates: templates.map((t) => serializeTemplate(withOptions(t, byId))) }
  })

  fastify.post('/rewards/punch-templates', async (request, reply) => {
    if (!request.ability.can('manage', 'rewards.PunchCard')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }
    const parsed = PunchTemplateCreateSchema.safeParse(request.body)
    if (!parsed.success) return reply.status(400).send({ error: parsed.error.flatten() })
    const d = parsed.data
    if (await missingOptions(d.payoutOptionIds ?? [])) {
      return reply.status(400).send({ error: 'A prize option was not found' })
    }
    const template = await rewardsPrisma.punchCardTemplate.create({
      data: {
        name: d.name,
        glyph: d.glyph,
        goal: d.goal,
        payoutKind: d.payoutKind,
        payoutCoins: d.payoutCoins ?? null,
        payoutOptionIds: d.payoutOptionIds ?? [],
        audience: d.audience ?? [],
        active: d.active,
      },
    })
    const byId = await optionSummaries(template.payoutOptionIds)
    return reply.status(201).send({ template: serializeTemplate(withOptions(template, byId)) })
  })

  fastify.patch('/rewards/punch-templates/:id', async (request, reply) => {
    if (!request.ability.can('manage', 'rewards.PunchCard')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }
    const { id } = request.params as { id: string }
    const parsed = PunchTemplateUpdateSchema.safeParse(request.body)
    if (!parsed.success) return reply.status(400).send({ error: parsed.error.flatten() })
    const existing = await rewardsPrisma.punchCardTemplate.findUnique({ where: { id } })
    if (!existing) return reply.status(404).send({ error: 'Template not found' })
    const d = parsed.data
    if (await missingOptions(d.payoutOptionIds ?? [])) {
      return reply.status(400).send({ error: 'A prize option was not found' })
    }
    const template = await rewardsPrisma.punchCardTemplate.update({
      where: { id },
      data: {
        ...(d.name !== undefined ? { name: d.name } : {}),
        ...(d.glyph !== undefined ? { glyph: d.glyph } : {}),
        ...(d.goal !== undefined ? { goal: d.goal } : {}),
        // The payout travels as a unit (schema refinement) — the kind swaps both fields.
        ...(d.payoutKind !== undefined
          ? {
              payoutKind: d.payoutKind,
              payoutCoins: d.payoutCoins ?? null,
              payoutOptionIds: d.payoutOptionIds ?? [],
            }
          : {}),
        ...(d.audience !== undefined ? { audience: d.audience ?? [] } : {}),
        ...(d.active !== undefined ? { active: d.active } : {}),
      },
    })
    // Narrowing the audience sweeps away untouched materialized cards; a punched
    // card survives and needs the explicit take-down below.
    if (d.audience !== undefined) {
      const profiles = await prisma.profile.findMany({
        where: { id: { not: FAMILY_PROFILE_ID } },
        select: { id: true, tier: true },
      })
      await sweepUntouchedCards(template, profiles)
    }
    const byId = await optionSummaries(template.payoutOptionIds)
    return { template: serializeTemplate(withOptions(template, byId)) }
  })

  // DELETE retires a template that cards reference — completed cards are retained
  // history, so the row must survive — and hard-deletes an untouched one.
  fastify.delete('/rewards/punch-templates/:id', async (request, reply) => {
    if (!request.ability.can('manage', 'rewards.PunchCard')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }
    const { id } = request.params as { id: string }
    const existing = await rewardsPrisma.punchCardTemplate.findUnique({ where: { id } })
    if (!existing) return reply.status(404).send({ error: 'Template not found' })
    const punched = await rewardsPrisma.punchCard.count({
      where: { templateId: id, OR: [{ count: { gt: 0 } }, { completedAt: { not: null } }] },
    })
    if (punched > 0) {
      const template = await rewardsPrisma.punchCardTemplate.update({
        where: { id },
        data: { active: false },
      })
      return { retired: true, template: serializeTemplate(template) }
    }
    // Untouched empty cards are only ever lazy materializations — safe to drop.
    await rewardsPrisma.punchCard.deleteMany({ where: { templateId: id } })
    await rewardsPrisma.punchCardTemplate.delete({ where: { id } })
    return { deleted: true }
  })

  // GET /rewards/punch-cards?profileId= — open cards + finished history. Scope
  // mirrors the wallet: tier 4 sees everyone (the Tickets tab), below that forced
  // to own. Materializes missing cards on read (ADR 058 precedent).
  fastify.get('/rewards/punch-cards', async (request, reply) => {
    if (!request.ability.can('view', 'rewards.Wallet')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }
    const query = request.query as { profileId?: string }
    const isAdmin = request.profile.tier >= 4
    const profileId = isAdmin ? query.profileId : request.profile.id
    if (profileId === FAMILY_PROFILE_ID || request.profile.id === FAMILY_PROFILE_ID) {
      return reply.status(403).send({ error: 'The family profile holds no cards' })
    }

    const profiles = await prisma.profile.findMany({
      where: {
        id: { not: FAMILY_PROFILE_ID },
        ...(profileId ? { id: profileId } : {}),
      },
      select: { id: true, tier: true },
    })
    await ensureOpenCards(profiles)

    const { cards, finished } = await listCards(profileId ? [profileId] : undefined)
    return { cards: cards.map(serializeCard), finished: finished.map(serializeFinished) }
  })

  // POST /rewards/punch-cards/:id/punch — the kid stamps their own card. No body:
  // a manual punch has no provenance beyond who drew it. Someone else's card 404s
  // rather than 403s, the redemption precedent.
  fastify.post('/rewards/punch-cards/:id/punch', async (request, reply) => {
    if (!request.ability.can('punch', 'rewards.PunchCard')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }
    const { id } = request.params as { id: string }
    const card = await getCard(id)
    if (!card || (card.profileId !== request.profile.id && request.profile.tier < 4)) {
      return reply.status(404).send({ error: 'Card not found' })
    }

    try {
      const result = await punchCard(fastify.eventBus, {
        cardId: id,
        sourceType: 'manual',
        createdBy: request.profile.id,
      })
      return {
        card: serializeCard(result.card),
        completed: result.completed,
        payout: result.payout,
        prizePending: result.prizePending,
      }
    } catch (err) {
      if (err instanceof PunchCardError)
        return reply.status(err.status).send({ error: err.message })
      throw err
    }
  })

  // POST /rewards/punch-cards/:id/prize — the kid names the prize they're working
  // for (open card: just moves the pointer, changeable anytime) or claims it on a
  // full card (mints on the spot). Same ability and row rule as the punch.
  fastify.post('/rewards/punch-cards/:id/prize', async (request, reply) => {
    if (!request.ability.can('punch', 'rewards.PunchCard')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }
    const { id } = request.params as { id: string }
    const parsed = PunchPrizeSchema.safeParse(request.body)
    if (!parsed.success) return reply.status(400).send({ error: parsed.error.flatten() })
    const card = await getCard(id)
    if (!card || (card.profileId !== request.profile.id && request.profile.tier < 4)) {
      return reply.status(404).send({ error: 'Card not found' })
    }

    try {
      const result = await choosePrize(fastify.eventBus, {
        cardId: id,
        rewardId: parsed.data.rewardId,
      })
      return { card: serializeCard(result.card), payout: result.payout }
    } catch (err) {
      if (err instanceof PunchCardError)
        return reply.status(err.status).send({ error: err.message })
      throw err
    }
  })

  // DELETE /rewards/punch-cards/:id/punch — the parent's eraser (ADR 049): remove
  // the newest punch from an open card. Tier 4 only, via `manage all`.
  fastify.delete('/rewards/punch-cards/:id/punch', async (request, reply) => {
    if (!request.ability.can('manage', 'rewards.PunchCard')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }
    const { id } = request.params as { id: string }
    try {
      const card = await undoPunch(id)
      return { card: serializeCard(card) }
    } catch (err) {
      if (err instanceof PunchCardError)
        return reply.status(err.status).send({ error: err.message })
      throw err
    }
  })

  // DELETE /rewards/punch-cards/:id — the take-down (M4/6 review gate): the parent
  // takes the open card off the fridge, punches and all, AND the kid leaves the
  // template's audience — without that, the next read would just materialize a
  // fresh card. Tier 4 only; a finished card is history and 409s.
  fastify.delete('/rewards/punch-cards/:id', async (request, reply) => {
    if (!request.ability.can('manage', 'rewards.PunchCard')) {
      return reply.status(403).send({ error: 'Permission denied' })
    }
    const { id } = request.params as { id: string }
    try {
      const profiles = await prisma.profile.findMany({
        where: { id: { not: FAMILY_PROFILE_ID } },
        select: { id: true, tier: true },
      })
      await removeCard(id, profiles)
      return { removed: true }
    } catch (err) {
      if (err instanceof PunchCardError)
        return reply.status(err.status).send({ error: err.message })
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
