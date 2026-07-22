# Story: Payout Approval on High-Value Chores

**Module:** rewards
**Status:** ⬜ Not Started · **stub** — raised during M4/2 (2026-07-22), not yet designed

## User story

As a parent, a chore worth real money doesn't pay out until I've seen it done, so a
kid can't check off "mow the lawn", spend the 10 F$, and leave me reopening a chore
against a balance that's already gone.

## The problem

Chore completion is **auto-accepted** — settled in M2 and correct for XP, which only
ever goes up. F$ goes down, and once M4/5 ships a store, the same auto-accept means:

1. kid completes a 10 F$ chore that isn't actually done
2. kid spends the 10 F$
3. parent reopens → `chores.task.reopened` debits 10 → **balance −10**

The ledger permits negative balances **deliberately** (M4/2): a symmetric reversal
after the coins were spent is a legitimate movement, and refusing it would leave the
ledger disagreeing with what happened. But a negative balance a kid didn't cause is a
household argument, and the fix belongs upstream of the ledger.

**Deadline: before M4/5.** Until a kid can spend, a wrong balance is harmless and a
parent's reopen fully corrects it.

## Shape (proposed — decide in the session)

- **A payout is held, not the chore.** The task still completes, still leaves the
  kid's list, still notifies the parent. Only the **credit** waits. M2's
  "auto-accepted, no `awaiting_approval` status" decision stands untouched.
- **Per-chore flag, not a household threshold.** `requiresApproval` on the chores
  `Task`, mirroring the catalog's per-reward flag — one concept in two places, and
  it puts the decision where ADR 052 already puts the price: at the moment the
  parent sets the chore up. A hidden `coinReward >= X` rule is invisible exactly
  where it's chosen.
- **A held payout cannot be a ledger entry** — ADR 047 makes entries immutable and
  the balance the sum of deltas, so a "pending" entry would either move the balance
  or break that identity. It is a `rewards.pending_payouts` row carrying the same
  `(source_type, source_id)` the auto path would have used, released by writing the
  normal entry — so release and idempotency are **one mechanism**, not two.
- **Decline writes nothing**, and quotes the parent's optional reason back verbatim
  (the `decided_note` treatment from the M4/1 design gate).
- **Reopening an already-released payout still debits.** This story narrows the
  window; it does not close it, and shouldn't pretend to.

## Open questions

- Does `rewards` learn the flag from the event payload (ADR 048 — the earner owns the
  amount, so it should also own "does this need signing off")? Almost certainly yes,
  which makes this one more field on `chores.task.completed`.
- Where does a parent see the queue — the existing completion notification, a chores
  board affordance, or a rewards surface? It is money, but it is about a chore.
- Does this need an ADR? The hold is a genuinely new concept beside ADR 047. Probably
  a short one; decide once the shape is fixed.

## Dependencies

**M4/3** (chores earn) — nothing to hold before it. Must land **before M4/5**.
