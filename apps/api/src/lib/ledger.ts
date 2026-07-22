import { rewardsPrisma } from '@family-os/plugin-rewards/db'
import { FAMILY_PROFILE_ID } from '@family-os/platform/types'
import type { EventBus } from '@family-os/platform/server'

/* The F$ ledger (ADR 047). Entries are immutable; `rewards.balances` is a cache
   written in the same transaction. Every earn and spend in M4 goes through
   postEntry() — routes, event subscribers, punch payouts — so the guards below
   are inherited rather than re-implemented per caller.

   `sourceType` is a plain string on purpose: a union naming 'chores.task' and
   'meals.dinner' would put knowledge of the earning plugins inside the ledger,
   which is exactly what ADR 048 forbids. */

export type PostEntryInput = {
  profileId: string
  /** Signed, non-zero. Positive credits, negative debits. */
  delta: number
  reason: string
  sourceType: string
  sourceId?: string | null
  createdBy?: string | null
}

export type LedgerEntryRecord = {
  id: string
  profileId: string
  delta: number
  reason: string
  sourceType: string
  sourceId: string | null
  createdBy: string | null
  createdAt: Date
}

export type PostEntryResult = {
  entry: LedgerEntryRecord
  balance: number
  /** True when `(sourceType, sourceId)` was already posted — nothing moved. */
  replayed: boolean
}

export class LedgerError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'LedgerError'
  }
}

function isUniqueViolation(err: unknown): boolean {
  return (err as { code?: string } | null)?.code === 'P2002'
}

/** Appends an entry and moves the cached balance in one transaction.
 *
 * A replayed `(sourceType, sourceId)` is a no-op: the existing entry comes back
 * with `replayed: true` rather than an error, because a redelivered event is a
 * normal occurrence and not a failure the caller can act on (ADR 047).
 *
 * Overdrafts are permitted. Reopening a chore whose coins were already spent is
 * a legitimate reversal, and refusing it would leave the ledger disagreeing with
 * what happened. Affordability is checked at the spend site, not here. */
export async function postEntry(bus: EventBus, input: PostEntryInput): Promise<PostEntryResult> {
  const { profileId, delta, reason, sourceType, sourceId = null, createdBy = null } = input

  // ADR 053 — only a person holds a balance. Enforced here so every caller
  // inherits it, and again in the route.
  if (profileId === FAMILY_PROFILE_ID) {
    throw new LedgerError('The family profile holds no balance')
  }
  if (!Number.isInteger(delta) || delta === 0) {
    throw new LedgerError('delta must be a non-zero integer')
  }

  try {
    const { entry, balance } = await rewardsPrisma.$transaction(async (tx) => {
      const entry = await tx.ledgerEntry.create({
        data: { profileId, delta, reason, sourceType, sourceId, createdBy },
      })
      const cached = await tx.balance.upsert({
        where: { profileId },
        update: { balance: { increment: delta } },
        create: { profileId, balance: delta },
      })
      return { entry, balance: cached.balance }
    })

    bus.emit(delta > 0 ? 'rewards.balance.credited' : 'rewards.balance.debited', {
      profileId,
      delta,
      balance,
      reason,
      sourceType,
      sourceId,
    })

    return { entry, balance, replayed: false }
  } catch (err) {
    if (!isUniqueViolation(err) || sourceId === null) throw err

    const existing = await rewardsPrisma.ledgerEntry.findUnique({
      where: { sourceType_sourceId: { sourceType, sourceId } },
    })
    if (!existing) throw err

    return { entry: existing, balance: await getBalance(existing.profileId), replayed: true }
  }
}

export async function getBalance(profileId: string): Promise<number> {
  const cached = await rewardsPrisma.balance.findUnique({ where: { profileId } })
  return cached?.balance ?? 0
}

export async function listEntries(
  profileId: string,
  { limit, cursor }: { limit: number; cursor?: string | null }
): Promise<{ entries: LedgerEntryRecord[]; nextCursor: string | null }> {
  const rows = await rewardsPrisma.ledgerEntry.findMany({
    where: { profileId },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { createdAt: 'desc' },
  })

  const hasMore = rows.length > limit
  const entries = hasMore ? rows.slice(0, -1) : rows
  return {
    entries,
    nextCursor: hasMore ? (entries[entries.length - 1]?.id ?? null) : null,
  }
}

/** Rebuilds the cache from the entries. The balance is derived, so this is the
    repair path — and the assertion that the cache never silently drifts. */
export async function recomputeBalance(profileId: string): Promise<number> {
  const { _sum } = await rewardsPrisma.ledgerEntry.aggregate({
    where: { profileId },
    _sum: { delta: true },
  })
  const balance = _sum.delta ?? 0

  await rewardsPrisma.balance.upsert({
    where: { profileId },
    update: { balance },
    create: { profileId, balance },
  })
  return balance
}
