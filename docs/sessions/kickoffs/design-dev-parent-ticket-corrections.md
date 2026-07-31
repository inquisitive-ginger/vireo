# Kickoff — Design+Dev: Parent Ticket Corrections (ad-hoc)

**Type:** design + development · **Date:** 2026-07-30 · **Module:** `rewards`

## Why this exists

Teddy used an "Extra screen time" ticket by accident on 2026-07-30. There is no
in-app way for a parent to undo that, so it was fixed with a hand-written `UPDATE`
against the prod database. That is the second administrative correction the rewards
module has needed with no surface to do it from — the tier-4 revoke-and-refund
endpoint (`DELETE /rewards/redemptions/:id`) has shipped since M4/5 and has never
had a button.

## Pre-session reads

- ADR 055 (a redemption is a ticket) — statuses, the "used is fulfilment" claim,
  and the existing tier-4 revoke exception
- ADR 053 (a balance belongs to a person), ADR 047 (the ledger is append-only)
- `apps/api/src/lib/redemptions.ts`, `apps/api/src/plugins/rewards.ts`
- `plugins/rewards/src/pages/RewardsPage.tsx`, `components/ApprovalsQueue.tsx`

## ADR note — not a re-litigation

ADR 055 says a used ticket is fulfilment and cannot be revoked (409). This session
does **not** move that: `used` stays terminal in the kid-reachable flow, and undoing
a use stays an **administrative correction**, the same class as the revoke exception
the ADR already carries. Nothing here gives a kid a way back from a tear, and no
money moves. If that reading is wrong, it belongs in a follow-up to 055 rather than
a code change.

## Design gates (settled with the user before implementation)

1. **Surface** — a third tier-4 tab, **Tickets**, beside Approvals and Catalog.
   Grouped by kid; **In pocket** (owned + any ask in flight) over **Recently used**.
   Rejected: a disclosure inside Approvals (that surface's grammar is "clear to
   zero"; a permanent list doesn't belong in it) and a Wallets → per-kid drill-in
   (an extra tap per kid to reach a correction).
2. **Scope** — both corrections land here: **Put it back** (used → owned) _and_ the
   already-built **Refund & remove**, which finally gets a UI.
3. **Kid-facing** — the kid is notified when a ticket comes back, matching how
   decide and revoke already notify. Teddy is tier 2, so it reaches him.

```
Rewards
[ Approvals •2 ][ Catalog ][ Tickets ]

╭─ 🟣 Teddy ───────────── 2 in pocket ─╮
  IN POCKET
  ▌ 🎟️  Extra screen time
  ▌     bought Tue      [Refund & remove]
  RECENTLY USED
  ▌ 🎮  Extra screen time
  ▌     used today        [ Put it back ]
```

## Scope

**In:**

- `restoreRedemption` in `lib/redemptions.ts` — `used` → `owned`, clearing
  `usedAt`/`useRequestedAt`/`decidedBy`/`decidedAt`/`decidedNote`. Any other status
  is a 409. **No ledger movement** — the debit happened at purchase and stands.
- `POST /rewards/redemptions/:id/restore`, gated on `decide rewards.Redemption`
  (tier 4), emitting `rewards.redemption.restored` and notifying the kid.
- The **Tickets** tab: `TicketsView.tsx`, its hooks, and the revoke wiring.
- API tests for restore (happy path, 409 on a non-used ticket, 403 below tier 4)
  and component tests for the new view.

**Out:** anything that moves a balance; any kid-reachable undo; punch cards (M4/6);
the parent bonus grant (M4/7).

## Acceptance criteria

1. A tier-4 parent sees every kid's tickets under **Tickets**, grouped by kid.
2. **Put it back** on a used ticket returns it to the kid's pocket, and it is
   usable again from the kid's store.
3. **Refund & remove** on an owned ticket refunds the snapshot cost and removes it.
4. A kid below tier 4 gets a 403 from the restore route and never sees the tab.
5. Restoring a ticket notifies the kid.
6. Reviewed running in the real shell before any close-out task.

## Required outputs

- PR against `main`, merged after live review
- Session log at `docs/sessions/logs/2026-07-30-design-dev-parent-ticket-corrections.md`
- `docs/modules/rewards/progress.md` row; `docs/sessions/queue.md` entry; CLAUDE.md
  Current Status
