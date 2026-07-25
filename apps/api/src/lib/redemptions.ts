import { rewardsPrisma } from '@family-os/plugin-rewards/db'
import { FAMILY_PROFILE_ID } from '@family-os/platform/types'
import type { EventBus } from '@family-os/platform/server'
import { getBalance, postEntry } from './ledger'

/* Redemptions (M4/4). A kid spends P-Bucks on a catalog reward. The P-Bucks is DEBITED on
   request and REFUNDED on decline — not escrow, same effect with half the state
   (spec). `cost` is snapshotted onto the redemption at request time, so repricing
   the reward never moves a request already in flight.

   Every ledger movement goes through `postEntry` (ADR 047): the debit is keyed
   `(redemption, id)` and the refund `(refund, id)`, so both are idempotent under the
   ledger's unique index. rewards still imports no other plugin (ADR 048). Guards live
   here so the route inherits them, the way the ledger and payout services do. */

export type RewardRecord = {
  id: string
  name: string
  emoji: string
  description: string | null
  cost: number
  requiresApproval: boolean
  audience: string[]
  stock: number | null
  active: boolean
}

export type RedemptionRecord = {
  id: string
  rewardId: string
  profileId: string
  cost: number
  status: string
  requestedAt: Date
  decidedBy: string | null
  decidedAt: Date | null
  decidedNote: string | null
}

export type RedemptionWithReward = RedemptionRecord & {
  reward: Pick<RewardRecord, 'id' | 'name' | 'emoji' | 'description'>
}

export class RedemptionError extends Error {
  /** 400 for a request the kid could fix (can't afford, out of stock); 409 for a
      lifecycle conflict (already decided). The route maps `status` to the reply. */
  constructor(
    message: string,
    public status: 400 | 404 | 409 = 400
  ) {
    super(message)
    this.name = 'RedemptionError'
  }
}

/** A kid requests a reward. Snapshots the cost, debits the P-Bucks, and files the request
 *  — `pending` when the reward needs a parent's OK, `granted` immediately otherwise.
 *
 *  Affordability is checked HERE (the spend site, per ADR 047 — the ledger itself
 *  permits overdrafts): a request the kid cannot afford is refused before any debit.
 *  The check and the debit are not one atomic step, so a burst of concurrent requests
 *  could still overdraw; that is acceptable (the ledger tolerates it and a parent's
 *  reopen is the correction), and locking every wallet read would buy nothing here. */
export async function requestRedemption(
  bus: EventBus,
  input: { profileId: string; reward: RewardRecord }
): Promise<{ redemption: RedemptionRecord; balance: number }> {
  const { profileId, reward } = input

  if (profileId === FAMILY_PROFILE_ID) {
    throw new RedemptionError('The family profile holds no balance')
  }
  if (!reward.active) {
    throw new RedemptionError('That reward is no longer available')
  }
  if (reward.audience.length > 0 && !reward.audience.includes(profileId)) {
    throw new RedemptionError('That reward is not available to you')
  }
  if (reward.stock !== null && (await claimedCount(reward.id)) >= reward.stock) {
    throw new RedemptionError('That reward is out of stock')
  }

  const balance = await getBalance(profileId)
  if (balance < reward.cost) {
    throw new RedemptionError('Not enough P-Bucks for that yet')
  }

  const status = reward.requiresApproval ? 'pending' : 'granted'
  const redemption = await rewardsPrisma.redemption.create({
    data: { rewardId: reward.id, profileId, cost: reward.cost, status },
  })

  const { balance: newBalance } = await postEntry(bus, {
    profileId,
    delta: -reward.cost,
    reason: `Redeemed ${reward.emoji} ${reward.name}`,
    sourceType: 'redemption',
    sourceId: redemption.id,
  })

  bus.emit('rewards.redemption.requested', {
    redemptionId: redemption.id,
    profileId,
    rewardId: reward.id,
    cost: reward.cost,
    requiresApproval: reward.requiresApproval,
  })

  return { redemption, balance: newBalance }
}

/** A held payout counts against stock only until declined — a declined request
    refunds and frees its unit. `pending`, `granted`, and `fulfilled` all hold one. */
function claimedCount(rewardId: string): Promise<number> {
  return rewardsPrisma.redemption.count({
    where: { rewardId, status: { in: ['pending', 'granted', 'fulfilled'] } },
  })
}

export function getRedemption(id: string): Promise<RedemptionRecord | null> {
  return rewardsPrisma.redemption.findUnique({ where: { id } })
}

export async function listRedemptions(opts: {
  profileId?: string
  statuses: string[]
  limit: number
}): Promise<RedemptionWithReward[]> {
  return rewardsPrisma.redemption.findMany({
    where: {
      status: { in: opts.statuses },
      ...(opts.profileId ? { profileId: opts.profileId } : {}),
    },
    include: { reward: { select: { id: true, name: true, emoji: true, description: true } } },
    orderBy: { requestedAt: 'desc' },
    take: opts.limit,
  })
}

export type DecideAction = 'grant' | 'decline' | 'fulfil'

/** A parent grants or declines a pending request, or fulfils a granted one.
 *
 *  - grant:   pending → granted. Nothing moves — the P-Bucks left on request.
 *  - decline: pending → declined. Refunds the snapshot cost (`refund` / id), so a
 *             double-decline refunds once (the ledger's idempotency key).
 *  - fulfil:  granted → fulfilled. Nothing moves; it records the hand-off.
 *
 *  A decision out of turn (grant a fulfilled one, fulfil a pending one) is a 409 —
 *  the state machine is the guard, the same as the payout release. */
export async function decideRedemption(
  bus: EventBus,
  id: string,
  decidedBy: string,
  action: DecideAction,
  note: string | null
): Promise<{ redemption: RedemptionRecord; balance: number | null }> {
  const redemption = await getRedemption(id)
  if (!redemption) throw new RedemptionError('Redemption not found', 404)

  if (action === 'fulfil') {
    if (redemption.status !== 'granted') {
      throw new RedemptionError('Only a granted redemption can be fulfilled', 409)
    }
    const updated = await rewardsPrisma.redemption.update({
      where: { id },
      data: { status: 'fulfilled' },
    })
    bus.emit('rewards.redemption.fulfilled', {
      redemptionId: id,
      profileId: redemption.profileId,
      rewardId: redemption.rewardId,
    })
    return { redemption: updated, balance: null }
  }

  if (redemption.status !== 'pending') {
    throw new RedemptionError('That request has already been decided', 409)
  }

  let balance: number | null = null
  if (action === 'decline') {
    const refund = await postEntry(bus, {
      profileId: redemption.profileId,
      delta: redemption.cost,
      reason: 'Redemption declined — refunded',
      sourceType: 'refund',
      sourceId: id,
      createdBy: decidedBy,
    })
    balance = refund.balance
  }

  const updated = await rewardsPrisma.redemption.update({
    where: { id },
    data: {
      status: action === 'grant' ? 'granted' : 'declined',
      decidedBy,
      decidedAt: new Date(),
      decidedNote: action === 'decline' ? note : null,
    },
  })

  bus.emit('rewards.redemption.decided', {
    redemptionId: id,
    profileId: redemption.profileId,
    status: updated.status,
    decidedBy,
  })

  return { redemption: updated, balance }
}
