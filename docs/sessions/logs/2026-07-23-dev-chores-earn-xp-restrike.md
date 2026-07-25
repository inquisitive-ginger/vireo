# 2026-07-23 — Dev: Chores Earn + the XP re-strike (M4/3, PR #64)

> **Naming note (ADR 054, 2026-07-24):** the currency called "F$" / "Family Dollars" below is now "Pritchett Bucks" — "P$" in compact text, "P-Bucks" in a sentence, and the P-mark struck on the coin. This log is a dated record and is not rewritten.

Backend earn wiring + the ADR-051 coin/star re-strike, with the F$ surfaces behind a flag.

## What was built

- **`coinReward` on `chores.Task`** (default **0**, ADR 052) — migration `20260722120000_add_coin_reward`; threaded through create/patch/serialize and the `completed`/`reopened` events.
- **Earn subscribers in `apps/api/src/plugins/rewards.ts`** (ADR 048 — `rewards` never imports `chores`): `chores.task.completed` credits, `chores.task.reopened` debits, both via `postEntry` from `lib/ledger.ts`. Keyed by the **completion instance** `taskId@completedAt`; the reversal uses `sourceType: 'chores.task.reversal'` against the same instance id.
- **XP re-strike (ADR 051):** F$ takes gold + the coin; XP → quiet `--muted-foreground` star across `ScorePlate`, `XpPill`, `FlightChip`, `FocusView`, `CreateTaskDrawer`, and `TodaySummaryView`. `gold.ts` deleted.
- **Shared currency mark:** `Coin` / `CoinValue` in `@family-os/ui` + `--coin-*` brass tokens (theme-invariant metal, dark tint/ink overrides). `coin.stories.tsx` for isolation review.
- **`CreateTaskDrawer`:** XP picker relabelled "Score" (neutral); new "Pays" picker at `1/2/5/10` F$ (free = nothing selected; tap-selected clears to free).
- **Feature flag `REWARDS_UI_ENABLED`** (`plugins/chores/src/lib/flags.ts`) gates the two F$ surfaces (picker + coin). Off in prod by default; on in dev via gitignored `plugins/chores/.env.local`. Verified a flag-off build tree-shakes the picker out.

## Acceptance criteria status (all pass)

- Completing a paying chore credits `coinReward`; a 0 F$ chore moves nothing. ✅
- Reopen debits symmetrically; **reopen→re-complete re-earns** (instance keying, not `taskId`). ✅
- Redelivered completion event does not double-credit (ledger unique key). ✅
- XP shows as a quiet star everywhere; F$ coin renders on paying rows, **coin before XP** on all six surfaces. ✅
- Prod-safe: F$ surfaces absent from a flag-off build. ✅

## Decisions made

- **Instance-keyed idempotency** (`taskId@completedAt`) over the kickoff's bare `taskId` — a `taskId`-only credit key leaves the balance stuck negative after a reopen→re-complete cycle. User approved at the gate.
- **F$ tiers `1/2/5/10`, not ADR 052's `0/2/5/10`** — mid-review user call. 0 is expressed as "no tier selected" (default free; chores still opt in to paying). More F$ always ⇒ more XP, which is the "no `100 XP / 1 F$` mismatch" property the user wanted. **Minor ADR 052 deviation — note it if 052 is ever reconciled.**
- **F$ leads XP** on every task surface (user call) — the coin is the spendable thing.
- **XP re-strike ships unflagged; F$ surfaces flagged** — flagging the whole ADR-051 swap would need dual gold/star paths in ~7 files. XP-as-quiet-star stands alone; the coin returns when the flag flips.

## Scope additions

- Widget (`TodaySummaryView`) added to the re-strike beyond ADR 051's five listed surfaces — it hand-rolled its own gold and had to move too (gold.ts is fully retired).
- The feature flag was not in the original scope — added on the user's request to avoid shipping the half-done earn loop (no wallet/store yet) to the live fridge.

## New stories created

- **M4/8 — Design: XP Derived from F$ + XP Progression** (queued). Amends ADR 052: one value at assignment (`xp = 5 + F$×10`), removes the XP picker, adds an XP cosmetic/avatar sink (unlock at thresholds, never deduct; no microtransactions). **Coupled to the F$ launch (M4/5)** — dropping the XP picker while F$ is flagged off would flatten every chore to base-5 XP in prod.

## Open questions

- None blocking. The `1/2/5/10` vs `0/2/5/10` deviation should be folded into M4/8's ADR-052 amendment.

## What the next session needs to know

- **The earn ledger is live but dormant** — backend records earns unconditionally; nothing sets `coinReward > 0` in prod while the picker is flagged off.
- **When M4/5 (store + wallet) ships, flip `REWARDS_UI_ENABLED` on in the prod build** (`VITE_REWARDS_UI=true`) and land M4/8's XP-derivation together — that's when the picker is removed and XP goes single-value.
- **M4/3b (Payout Approval) must still land before M4/5** — a reopen after spend overdrafts; harmless until F$ is spendable.
- The chore serializer + `ChoreTask` now carry `coinReward`; `postEntry` is the one path for all earns (M5's meals cook award is the ADR-048 generalization test).
- Local `familyos` + `familyos_test` both had the column applied by raw SQL; the dev migration was `migrate resolve --applied`. Prod applies it fresh via `migrate deploy` on deploy.
