import { rewardsPrisma } from '@family-os/plugin-rewards/db'
import { FAMILY_PROFILE_ID } from '@family-os/platform/types'
import type { EventBus } from '@family-os/platform/server'
import { postEntry } from './ledger'

/* Held payouts (M4/3b). A payout that a chore opted into approval for is held here
   instead of crediting the ledger on completion. The row carries the SAME
   (sourceType, sourceId) the auto-credit path would have used, so approving it is
   just `postEntry` with that pair — release and idempotency are one mechanism
   (ADR 047). rewards still knows nothing about chores: the earner encodes whatever
   it needs inside sourceId (ADR 048). Every guard lives here so the route and the
   event subscriber share one release path, the way the ledger service does. */

export type HoldPayoutInput = {
  profileId: string
  /** Signed positive, the P-Bucks to credit on release. */
  amount: number
  reason: string
  sourceType: string
  sourceId: string
}

export type PendingPayoutRecord = {
  id: string
  profileId: string
  amount: number
  reason: string
  sourceType: string
  sourceId: string
  status: string
  decidedBy: string | null
  decidedNote: string | null
  decidedAt: Date | null
  createdAt: Date
}

export class PayoutError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PayoutError'
  }
}

function isUniqueViolation(err: unknown): boolean {
  return (err as { code?: string } | null)?.code === 'P2002'
}

/** Holds a payout for a parent's OK. Idempotent on `(sourceType, sourceId)`: a
 *  redelivered completion returns the existing row rather than a second hold. */
export async function holdPayout(input: HoldPayoutInput): Promise<PendingPayoutRecord> {
  const { profileId, amount, reason, sourceType, sourceId } = input

  if (profileId === FAMILY_PROFILE_ID) {
    throw new PayoutError('The family profile holds no balance')
  }
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new PayoutError('amount must be a positive integer')
  }

  try {
    return await rewardsPrisma.pendingPayout.create({
      data: { profileId, amount, reason, sourceType, sourceId },
    })
  } catch (err) {
    if (!isUniqueViolation(err)) throw err
    const existing = await rewardsPrisma.pendingPayout.findUnique({
      where: { sourceType_sourceId: { sourceType, sourceId } },
    })
    if (!existing) throw err
    return existing
  }
}

/** The payout for a completion instance, at any status, or null. */
export function findPayout(
  sourceType: string,
  sourceId: string
): Promise<PendingPayoutRecord | null> {
  return rewardsPrisma.pendingPayout.findUnique({
    where: { sourceType_sourceId: { sourceType, sourceId } },
  })
}

export function getPayout(id: string): Promise<PendingPayoutRecord | null> {
  return rewardsPrisma.pendingPayout.findUnique({ where: { id } })
}

export async function listPayouts(opts: {
  profileId?: string
  statuses: string[]
  limit: number
}): Promise<PendingPayoutRecord[]> {
  return rewardsPrisma.pendingPayout.findMany({
    where: {
      status: { in: opts.statuses },
      ...(opts.profileId ? { profileId: opts.profileId } : {}),
    },
    take: opts.limit,
    orderBy: { createdAt: 'desc' },
  })
}

export type DecideResult = { payout: PendingPayoutRecord; balance: number | null }

/** Approve → release the held amount as the normal ledger credit (same provenance
 *  pair) and mark the payout approved. Idempotent by the ledger's unique key: a
 *  double-approve credits once. Only a `pending` payout can be approved. */
export async function approvePayout(
  bus: EventBus,
  id: string,
  decidedBy: string
): Promise<DecideResult> {
  const payout = await getPayout(id)
  if (!payout) throw new PayoutError('Payout not found')
  if (payout.status !== 'pending') throw new PayoutError('Payout already decided')

  const { balance } = await postEntry(bus, {
    profileId: payout.profileId,
    delta: payout.amount,
    reason: payout.reason,
    sourceType: payout.sourceType,
    sourceId: payout.sourceId,
    createdBy: decidedBy,
  })

  const updated = await rewardsPrisma.pendingPayout.update({
    where: { id },
    data: { status: 'approved', decidedBy, decidedAt: new Date() },
  })
  return { payout: updated, balance }
}

/** Decline → nothing moves. Stores the optional note verbatim (M4/1 gate:
 *  `decided_note` is optional and quoted back to the kid). Only a `pending` payout
 *  can be declined. */
export async function declinePayout(
  id: string,
  decidedBy: string,
  note: string | null
): Promise<DecideResult> {
  const payout = await getPayout(id)
  if (!payout) throw new PayoutError('Payout not found')
  if (payout.status !== 'pending') throw new PayoutError('Payout already decided')

  const updated = await rewardsPrisma.pendingPayout.update({
    where: { id },
    data: { status: 'declined', decidedBy, decidedNote: note, decidedAt: new Date() },
  })
  return { payout: updated, balance: null }
}

/** Void a still-pending payout because the completion was reopened before a
 *  decision — nothing was ever owed, so no ledger movement (ADR 047). A no-op if
 *  the payout is missing or already decided. */
export async function voidPayout(sourceType: string, sourceId: string): Promise<boolean> {
  const payout = await findPayout(sourceType, sourceId)
  if (!payout || payout.status !== 'pending') return false
  await rewardsPrisma.pendingPayout.update({
    where: { id: payout.id },
    data: { status: 'voided', decidedAt: new Date() },
  })
  return true
}
