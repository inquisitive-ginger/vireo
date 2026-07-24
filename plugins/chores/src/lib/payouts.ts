import type { ChoreTask, PendingPayout } from '../types'

/* Chores owns the completion-instance key (`taskId@completedAt`) — the same one the
   rewards ledger uses (ADR 048) — so it can match a plugin-agnostic payout row back
   to the task row it belongs to. Keeping this here, not in rewards, is what lets the
   rewards table stay ignorant of chores. */

export type PayoutsByInstance = Map<string, PendingPayout>

const instanceKey = (task: ChoreTask): string | null =>
  task.completedAt ? `${task.id}@${task.completedAt}` : null

export function indexPayouts(payouts: PendingPayout[]): PayoutsByInstance {
  const map: PayoutsByInstance = new Map()
  for (const p of payouts) map.set(p.sourceId, p)
  return map
}

/** The payout for this task's current completion instance, if one is held/decided. */
export function payoutForTask(
  task: ChoreTask,
  index: PayoutsByInstance
): PendingPayout | undefined {
  const key = instanceKey(task)
  return key ? index.get(key) : undefined
}

/* What a kid sees for the F$ on a completed paying chore. Derived mostly from the
   TASK so the state is correct the instant a completion lands — the held payout is
   written by an async subscriber, so waiting on the payout row would leave the card
   blank until a refetch. The payout row only refines the outcome once a parent has
   decided (approved → earned, declined). */
export type KidPayoutView =
  | { kind: 'held'; amount: number }
  | { kind: 'earned'; amount: number }
  | { kind: 'declined'; note: string | null }
  | null

/* The F$ that reopening this completed chore would claw back from the kid's wallet —
   0 when nothing was paid. Reopening posts the symmetric reversal only when the
   completion actually credited: an auto-credited paying chore always did; an approval
   chore only once a parent approved it (a still-held payout voids on reopen, moving
   nothing). Mirrors the backend reversal branch, so the warning matches the effect.
   Approved payouts must be in `index` (the board fetches them) or an approved chore
   reads as unpaid. */
export function reopenClawback(task: ChoreTask, payout?: PendingPayout): number {
  if (task.status !== 'completed' || task.coinReward <= 0) return 0
  if (task.requiresApproval) return payout?.status === 'approved' ? payout.amount : 0
  return task.coinReward // auto-credited on completion
}

export function kidPayoutView(task: ChoreTask, payout?: PendingPayout): KidPayoutView {
  if (task.coinReward <= 0 || task.status !== 'completed') return null

  if (payout) {
    if (payout.status === 'pending') return { kind: 'held', amount: payout.amount }
    if (payout.status === 'approved') return { kind: 'earned', amount: payout.amount }
    if (payout.status === 'declined') return { kind: 'declined', note: payout.decidedNote }
    return null // voided — the chore is no longer done
  }

  // No payout row (yet, or never): an approval chore is being held; a plain paying
  // chore was auto-credited on completion.
  return task.requiresApproval
    ? { kind: 'held', amount: task.coinReward }
    : { kind: 'earned', amount: task.coinReward }
}
