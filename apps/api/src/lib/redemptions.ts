import { rewardsPrisma } from '@family-os/plugin-rewards/db'
import { FAMILY_PROFILE_ID } from '@family-os/platform/types'
import type { EventBus } from '@family-os/platform/server'
import { getBalance, postEntry } from './ledger'

/* Tickets (ADR 055). Buying and using a reward are two moments: buy debits the
   wallet once, with no parent gate at any price (it's the kid's money, ADR 053),
   and the ticket sits `owned` until the kid explicitly uses it. `requiresApproval`
   gates USE — a use request waits for a parent, and "not now" returns the ticket
   whole; the money stays spent. Used IS fulfilment. The tier-4 revoke exception
   refunds the snapshot cost and deletes the row.

   `cost` is snapshotted at purchase, so repricing the reward never moves a ticket
   already owned. Every ledger movement goes through `postEntry` (ADR 047): the
   debit is keyed `(redemption, id)` and the revoke refund `(refund, id)`, so both
   are idempotent under the ledger's unique index. rewards still imports no other
   plugin (ADR 048). Guards live here so the routes inherit them, the way the
   ledger and payout services do. */

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
  purchasedAt: Date
  useRequestedAt: Date | null
  usedAt: Date | null
  decidedBy: string | null
  decidedAt: Date | null
  decidedNote: string | null
}

export type RedemptionWithReward = RedemptionRecord & {
  reward: Pick<RewardRecord, 'id' | 'name' | 'emoji' | 'description'> & {
    requiresApproval: boolean
  }
}

export class RedemptionError extends Error {
  /** 400 for a request the kid could fix (can't afford, out of stock); 404 when the
      ticket doesn't exist — or isn't theirs, which reads the same from outside; 409
      for a lifecycle conflict. The route maps `status` to the reply. */
  constructor(
    message: string,
    public status: 400 | 404 | 409 = 400
  ) {
    super(message)
    this.name = 'RedemptionError'
  }
}

const rewardSelect = {
  select: { id: true, name: true, emoji: true, description: true, requiresApproval: true },
}

/** A kid buys a ticket. Snapshots the cost, debits the P-Bucks, lands `owned` —
 *  there is no approval branch and no parent notification: it's the kid's money.
 *
 *  Affordability is checked HERE (the spend site, per ADR 047 — the ledger itself
 *  permits overdrafts): a purchase the kid cannot afford is refused before any debit.
 *  The check and the debit are not one atomic step, so a burst of concurrent buys
 *  could still overdraw; that is acceptable (the ledger tolerates it and a parent's
 *  revoke is the correction), and locking every wallet read would buy nothing here. */
export async function purchaseRedemption(
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

  const redemption = await rewardsPrisma.redemption.create({
    data: { rewardId: reward.id, profileId, cost: reward.cost },
  })

  const { balance: newBalance } = await postEntry(bus, {
    profileId,
    delta: -reward.cost,
    reason: `Bought ${reward.emoji} ${reward.name}`,
    sourceType: 'redemption',
    sourceId: redemption.id,
  })

  bus.emit('rewards.redemption.purchased', {
    redemptionId: redemption.id,
    profileId,
    rewardId: reward.id,
    cost: reward.cost,
  })

  return { redemption, balance: newBalance }
}

/** Every surviving row holds a stock unit — a revoke DELETES its row, so there is
    no freed-by-status case. A used ticket stays claimed: stock counts how many were
    ever sold, not how many are outstanding. */
function claimedCount(rewardId: string): Promise<number> {
  return rewardsPrisma.redemption.count({ where: { rewardId } })
}

export function getRedemption(id: string): Promise<RedemptionWithReward | null> {
  return rewardsPrisma.redemption.findUnique({ where: { id }, include: { reward: rewardSelect } })
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
    include: { reward: rewardSelect },
    orderBy: { purchasedAt: 'desc' },
    take: opts.limit,
  })
}

/** The kid tears (or asks to tear) an owned ticket. Own-ticket only — someone
 *  else's ticket 404s rather than 403s, so the response doesn't confirm it exists.
 *
 *  `requiresApproval` is read off the reward NOW, not snapshotted: a parent editing
 *  the flag changes the gate for tickets already owned, which is the point of the
 *  flag being about timing. A retired reward's ticket still tears — retiring stops
 *  purchases, never the use of what was already bought. */
export async function requestUse(
  bus: EventBus,
  id: string,
  profileId: string
): Promise<{ redemption: RedemptionWithReward }> {
  const redemption = await getRedemption(id)
  if (!redemption || redemption.profileId !== profileId) {
    throw new RedemptionError('Ticket not found', 404)
  }
  if (redemption.status === 'use_requested') {
    throw new RedemptionError('Already asked — waiting on a parent', 409)
  }
  if (redemption.status !== 'owned') {
    throw new RedemptionError('That ticket has already been used', 409)
  }

  if (!redemption.reward.requiresApproval) {
    const updated = await rewardsPrisma.redemption.update({
      where: { id },
      data: { status: 'used', usedAt: new Date() },
      include: { reward: rewardSelect },
    })
    bus.emit('rewards.redemption.used', {
      redemptionId: id,
      profileId,
      rewardId: redemption.rewardId,
    })
    return { redemption: updated }
  }

  // A fresh ask supersedes an earlier "not now" — the note answered that ask.
  const updated = await rewardsPrisma.redemption.update({
    where: { id },
    data: {
      status: 'use_requested',
      useRequestedAt: new Date(),
      decidedBy: null,
      decidedAt: null,
      decidedNote: null,
    },
    include: { reward: rewardSelect },
  })
  // Event segments are kebab-case (bus contract) — the STATUS string stays snake_case.
  bus.emit('rewards.redemption.use-requested', {
    redemptionId: id,
    profileId,
    rewardId: redemption.rewardId,
  })
  return { redemption: updated }
}

export type DecideAction = 'yes' | 'not_now'

/** A parent answers a use request. Yes tears the ticket — used IS fulfilment, there
 *  is no hand-off step. Not-now returns it to `owned` with the optional note; the
 *  money stays spent, because the ask was about timing, not permission to spend
 *  (ADR 055). A decision with no request waiting is a 409 — the state machine is
 *  the guard, the same as the payout release. */
export async function decideUse(
  bus: EventBus,
  id: string,
  decidedBy: string,
  action: DecideAction,
  note: string | null
): Promise<{ redemption: RedemptionWithReward }> {
  const redemption = await getRedemption(id)
  if (!redemption) throw new RedemptionError('Ticket not found', 404)
  if (redemption.status !== 'use_requested') {
    throw new RedemptionError('No use request is waiting on that ticket', 409)
  }

  const updated = await rewardsPrisma.redemption.update({
    where: { id },
    data:
      action === 'yes'
        ? { status: 'used', usedAt: new Date(), decidedBy, decidedAt: new Date() }
        : { status: 'owned', decidedBy, decidedAt: new Date(), decidedNote: note },
    include: { reward: rewardSelect },
  })

  bus.emit(action === 'yes' ? 'rewards.redemption.used' : 'rewards.redemption.deferred', {
    redemptionId: id,
    profileId: redemption.profileId,
    rewardId: redemption.rewardId,
    decidedBy,
  })

  return { redemption: updated }
}

/** The tier-4 exception (ADR 055): refund the snapshot cost and remove the ticket.
 *  An administrative correction (mis-buys, retired rewards), never a flow state —
 *  and never reachable from kid UI. A used ticket was consumed, so there is nothing
 *  to give back.
 *
 *  Refund BEFORE delete: if the delete fails, a retried revoke replays the refund as
 *  a no-op (the ledger's `(refund, id)` claim) and deletes cleanly. */
export async function revokeRedemption(
  bus: EventBus,
  id: string,
  revokedBy: string
): Promise<{ redemption: RedemptionWithReward; balance: number }> {
  const redemption = await getRedemption(id)
  if (!redemption) throw new RedemptionError('Ticket not found', 404)
  if (redemption.status === 'used') {
    throw new RedemptionError('That ticket has already been used', 409)
  }

  const { balance } = await postEntry(bus, {
    profileId: redemption.profileId,
    delta: redemption.cost,
    reason: `Refunded ${redemption.reward.emoji} ${redemption.reward.name}`,
    sourceType: 'refund',
    sourceId: id,
    createdBy: revokedBy,
  })
  await rewardsPrisma.redemption.delete({ where: { id } })

  bus.emit('rewards.redemption.revoked', {
    redemptionId: id,
    profileId: redemption.profileId,
    rewardId: redemption.rewardId,
    cost: redemption.cost,
    revokedBy,
  })

  return { redemption, balance }
}
