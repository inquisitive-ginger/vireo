# 2026-07-30 — Design+Dev: parent ticket corrections (ad-hoc, PR #89)

Ad-hoc, and it started as a data fix. Teddy used an "Extra screen time" ticket by
accident; there was no in-app remedy, so it was corrected with a hand-written
`UPDATE` against the prod database. The session is the answer to "why did that
need psql?"

## The prod fix, first

```
84e70579-… · Extra screen time · Teddy · used 2026-07-30 15:33 → owned
```

`status='owned'`, `used_at`/`use_requested_at`/`decided_*` cleared. **No ledger
row was written and none should have been** — the debit happened at purchase
(ADR 055) and a tear never touches the balance. Teddy had two used "Extra screen
time" tickets; the most recent use was the one reverted.

## What was decided

**This is not a re-litigation of ADR 055.** `used` stays terminal in the
kid-reachable flow and nothing here gives a kid a way back from a tear. Undoing a
use is an **administrative correction**, the same class as the revoke exception
the ADR already carries — a second member of that family, not a change to what a
redemption is. If that reading is wrong it belongs in a follow-up to 055.

Three gates were put to the user, all taken as recommended.

### The surface didn't exist

Tier 4 had **no parent-facing ticket surface at all**. Approvals shows what is
waiting and empties to zero; the catalog is rewards, not tickets. Used tickets
appeared nowhere, for anyone but the kid who tore them.

So: a third tab, **Tickets**, grouped by kid, **In pocket** over **Recently
used**. Rejected: a disclosure inside Approvals (that surface's grammar is "clear
to zero" — a permanent inventory doesn't belong in it) and a Wallets → per-kid
drill-in (an extra tap per kid to reach a correction).

### Two corrections, and the difference is what comes back

- **Put it back** (new) — `used` → `owned`, every decision field cleared, so the
  ticket is indistinguishable from one never used and asks again if it must. No
  ledger movement.
- **Refund & remove** — the existing `DELETE /rewards/redemptions/:id`. **It had
  shipped since M4/5 with no button anywhere.** Wired up here, which is the second
  reason this session exists.

Only the second moves money, so only the second confirms — and its copy names the
cheaper correction, or a parent undoing a mistaken tear reaches for the refund and
hands back P-Bucks that were never owed. There is a test pinning that sentence.

The kid is notified on restore, matching decide and revoke. Teddy is tier 2, so it
reaches him (`notify()` skips tier < 2).

## The list overflow, added mid-session

Asked for the #81/#82 treatment. Used tickets are never archived, so the used
shelf is the unbounded-wall shape #82 named — count-clamped (10, then
`Show N more`), header states the **true** total.

**It opens by default, unlike the chores `Done` it borrows from.** Putting a
mistakenly torn ticket back is the reason a parent opens this tab; the common case
must not start behind a tap. In pocket is left unclamped — 1–2 rows, and a kid
spends tickets down.

### The third caller, and the extraction it triggered

The 2026-07-28 log left an explicit instruction: `CollapsibleSection` (chores,
client clamp) and the Settled disclosure (shell, cursor paging) share a header and
nothing else — **"if a third caller appears, extract the header as a `Disclosure`
and let each keep its own body."**

Rewards is the third caller, and it can reach neither (ADR 048 — plugins never
import each other). So `Disclosure` and `RevealMore` are now in `@family-os/ui`;
chores and the triage board rewire onto them. Bodies stayed put: chores and
rewards clamp by count, the board still pages by cursor. `RevealMore`'s `fetches`
flag keeps the distinction visible — the `›` marks a trip to the server, and a
count clamp takes none.

Chores (75) and shell (17) test counts are **unchanged**, which is the whole
evidence that the extraction was behaviour-preserving.

## Known, not fixed

`GET /rewards/redemptions` still hardcodes `limit=100` and returns a bare array,
so `Show N more` can only ever reveal up to 100 used tickets before the oldest are
silently absent — the shape #81 called "worse than unbounded". The user chose the
client clamp alone; the envelope would have touched four consumers. Two kids puts
the cap years out. **Queued, not forgotten.**

## Gotchas

- `platform.profiles.id` is **text**, `rewards.redemptions.profile_id` is **uuid** —
  a join between them needs `p.id = r.profile_id::text` or Postgres refuses. Worth
  knowing before writing another correction by hand.
- Dev held only 4–5 used tickets, under the clamp, so 18 were seeded to make the
  reveal reviewable and deleted afterwards. Dev is back at Teddy 4 / Zoë 5.

## Verification

rewards **59** (+5) · ui **192** (+5) · api **373** (+2) · chores 75 · shell 17.
Lint, typecheck and a full production build clean. CI green on #89.

**The live review did not happen.** The standing rule is a real-shell review with
sign-off before any close-out task; the dev server was up and seeded and handed
over, and the user chose to go straight to PR → merge → close-out instead. The
tier-4 PIN is not recoverable from the sandbox, so nobody has seen this tab in a
browser. That is the one open risk in this change.

## What the next session needs to know

- **Nobody has looked at the Tickets tab.** First parent on prod is the review.
- **The 100-cap is the last unbounded-list defect of the #81 family** and it is now
  the only one left in the app.
- ADR 055 gained a second administrative exception without an ADR amendment. If a
  third appears, the "administrative corrections" set is worth naming in the ADR
  rather than discovering again from a psql session.
