# Dev — Payout Approval on High-Value Chores (M4/3b, PR #65)

> **Naming note (ADR 054, 2026-07-24):** the currency called "F$" / "Family Dollars" below is now "Pritchett Bucks" — "P$" in compact text, "P-Bucks" in a sentence, and the P-mark struck on the coin. This log is a dated record and is not rewritten.

**Type:** development · **Merged:** 2026-07-24 → `main` (`60a1029`)
**Story:** `docs/modules/rewards/stories/payout-approval.md`

## What shipped

A per-chore **`requiresApproval`** flag holds the F$ payout in a new
`rewards.pending_payouts` table instead of crediting on completion. A tier-4 parent
**approves** — releasing the normal ledger entry with the **same** `(sourceType,
sourceId)` pair the auto path would have used, so release and idempotency are one
mechanism (ADR 047) — or **declines**, writing nothing plus an optional note. The
chore still completes, still notifies, still awards XP; only the money waits.

**Decided on the chores board via the payout tray (design "A1", gated in an
artifact).** `rewards` stays plugin-agnostic (ADR 048): the chores **page** reads
`GET /rewards/payouts` over HTTP and matches rows by its own instance-id format —
no code import in either direction. `pending_payouts` carries no `taskId` column.

**The safety cases, all tested:**

- **Reopen before a decision voids** the held payout — no ledger movement (nothing
  was owed).
- **Reopen after payout debits** the released amount (the M4/3 symmetric reversal).
  Narrows the window, doesn't close it.
- **Delete voids** a still-held payout via a new `chores.task.deleted` event rewards
  subscribes to; an already-approved payout stays paid (deleting the record doesn't
  claw money back).
- `decide` on a new `rewards.Payout` subject (tier-4 via `manage all`); reading own
  payouts follows the wallet rule.

Everything sits behind `REWARDS_UI_ENABLED` (off in prod until M4/5).

## Review-driven work folded into the same PR

The live review surfaced three things worth more than the payout story itself:

- **XP was double-awarding (pre-existing bug).** XP is up-only and never debited on
  reopen, so re-completing re-credited it — a reopen/complete loop farmed XP without
  bound. Fixed with an **atomic `xp_awarded` claim** (`updateMany` where
  `xp_awarded=false` wins the award, in one transaction so a failed credit can't
  leave the task marked). Migration backfills existing completed tasks as awarded.
  **F$ is balanced** across the same cycle (credit on complete, symmetric debit on
  reopen) — a test hammers three cycles and lands at exactly one credit. No infinite-F$.
- **Reopened state.** A pending task completed before (`xp_awarded && pending`) now
  reads as an amber **"Redo"** — distinct from a fresh assignment, distinct from red
  Overdue. One flag serves both the XP idempotency and the reopened signal.
- **"Everything is a chip" cleanup.** The taskee meta grew four look-alike pills
  meaning four different things, and Focus/Agency had drifted apart. New principle:
  **a chip is a collectible reward — nothing else wears the pill.** F$ is the one
  chip; XP is the quiet star; Overdue+date collapse to one red text phrase (the
  spine/border already alarms); Redo is an amber ↻ text tag. One shared **`TaskMeta`**
  (`TaskStatusLine` + `TaskReward`) renders both Focus and Agency so they can't drift
  again.

## Two UX decisions from the review

1. **Editing a completed chore is locked; reopen is the way back** (Option A). A held
   payout freezes the chore's terms, and editing price/assignee behind a snapshotted
   payout was the actual breakage. All completed rows drop tap-to-edit + the pencil;
   the reopen check unlocks (and voids a held payout, so re-completing re-prices).
2. **The reopen clawback is confirmed** — reopening a paid chore pops a dialog that
   fetches the kid's balance and shows the resulting number in red when it overdraws.
   The overdraw is the point of the dialog, so it reads at a glance (`ConfirmDialog`
   widened to accept `ReactNode`).

## Layout gotchas fixed (right-aligning the reward exposed them)

- The Agency reward group moved into the trailing cluster, **vertically centered with
  the completion circle** (the user's call — once it's over there, the circle is its
  alignment context).
- Right-alignment made width changes visible as a slide. Fixed by making **pending
  and earned rewards the same width** — earned XP is `✓ N XP` (check icon, same
  structure as the pending star), earned F$ is the same chip as pending (the done
  card marks it earned, not a badge on the chip). The in-flight XP chip also dropped
  its grey pill to match the resting star.
- On the **Focus hero** the reward shared a `justify-between` row with the status
  line, so its position tracked whether a status was present — sliding it as one task
  completed and the next promoted in. Fixed by giving the hero reward **its own line**,
  anchored at the card's left edge (the hero has no circle to align to).

## Environment notes

- `familyos_test` still cannot take `migrate deploy` (P3009), so the three new
  migrations (`pending_payouts`, `requires_approval`, `xp_awarded`) were applied to
  the test DB by hand-run SQL; dev took them via `migrate deploy`.
- Chores' generated Prisma client still carries the pretty-vs-minified mismatch — the
  runtime churn was stripped and the schema-derived files reformatted to the committed
  style, so only the real diff is committed (unchanged process from prior sessions).

## What the next session needs to know

- **M4/4 (Catalog + Redemption)** builds the tier-4 **approvals queue**. Chore payouts
  should join it alongside redemption decisions — **one shared release endpoint** (the
  payout `PATCH` is idempotent), and the queue is where the **decline note input**
  lands (the board decline defers it; the note plumbing — endpoint + kid rendering —
  already exists end-to-end). Make the held-payout row a shared component so the board
  and the queue don't diverge.
- **When M4/5 ships**, flip `REWARDS_UI_ENABLED` on in prod and land **M4/8** (XP
  from F$) with it.
- **`ConfirmDialog.description` now accepts `ReactNode`** (was `string`) — available
  for any dialog that needs emphasis.

## Verification

Full workspace suite green — **556 tests**. New coverage: hold / approve-release /
approve-idempotent / decline+note / void-on-reopen / debit-after-approval /
delete-void / auth (rewards API); XP award-once + F$-nets-across-cycle (chores API);
`reopenClawback` + `kidPayoutView` + the board tray + kid held/earned/declined + the
Redo badge + paid-reopen routing (chores UI). Typecheck + lint clean; chores plugin
builds for federation. Live-reviewed across Focus + Agency + the tier-4 board.
