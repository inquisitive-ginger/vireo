# 2026-07-26 — Design + Dev: XP Derived from P-Bucks (M4/8)

**Type:** design + dev · **Branch:** `dev/rewards-store-wallet` (commit `a9f8d1a`) ·
**ADR:** 056 (amends 052) · **Gates the branch PR — now clear.**

## What was decided

- **ADR 056 — one value at assignment.** A parent sets the P-Bucks amount; XP is
  derived, `xp = 5 + coinReward × 10` (free 5 · 1→15 · 2→25 · 5→55 · 10→105). Not
  conversion — ADR 002 holds; deriving the award ≠ exchanging the balance; XP stays
  up-only (reopen debits P-Bucks, never XP). Base and slope live once in
  `plugins/chores/src/lib/economy.ts`, imported by the API via a new
  `@family-os/plugin-chores/economy` export.
- **Three gates, all taken as recommended:** derivation only this session (the XP
  sink is deferred — see below) · the drawer states the derived score as a quiet
  star line under Pays ("Scores 25 XP", live as the amount changes) · legacy
  hand-picked `xpReward` values **drain** (edits re-derive; no migration — a silent
  re-basing is what ADR 052 forbids). Prod context makes draining cheap: the flag
  was off, so every prod chore has `coinReward = 0`.
- **Mid-session user ask, gated and taken: Pays and Cost are one field.** The chore
  drawer's tier chips and the reward drawer's cost input+chips merge into a shared
  **`CoinAmountField`** in `@family-os/ui` (numeric input · preset chips, brass
  selected, coin on the selected chip) — and **both sides keep the free-typed
  input**: the ladder (1/2/5/10 chores · 5/10/15/25/40 catalog) is taught by
  presets, not enforced by them. Free is a typed/empty 0, replacing the old
  tap-selected-to-clear. This resolves the "0/2/5/10 vs 1/2/5/10" ADR 052 deviation
  standing since M4/3: 0 was always the absence of a tier.
- **The XP sink (cosmetic ladder) is deferred to its own design session** — the
  queue entry coupled it to M4/8, but its two hard questions are unexplored: gear on
  an avatar collides with ADR 042 (a photo is a face, not a token), and XP lives in
  `chores` while cosmetics would live on the profile (ownership/validation across
  that boundary needs an answer). The launch does not need it; XP without a sink is
  the status quo since M2. Queued as its own entry.

## What was built

- `plugins/chores/src/lib/economy.ts` — `XP_BASE`/`XP_PER_COIN`/`xpForCoins`; the one
  definition, exported to the API.
- **API derives, client is ignored:** create computes `xpReward = xpForCoins(coinReward)`;
  PATCH re-derives from the (possibly kept) `coinReward`; `xpReward` is gone from the
  accepted body. The completion subscriber and `xp_awarded` idempotency are untouched —
  the column remains the award record.
- **`CreateTaskDrawer`:** Score picker and `XpChip` deleted; `CreateTaskInput` drops
  `xpReward`; Pays becomes `FieldLabel "Pays (P$)"` + `CoinAmountField` (string at the
  field boundary, like the DatePicker's dates) + the derived star line. The approval
  toggle still appears only when the amount is > 0.
- **`RewardDrawer`:** Cost moves onto `CoinAmountField`; the hardcoded `"Cost (P$)"`
  label was an ADR 054 register leak (typed characters, not a named export) — now
  `CURRENCY.code`.
- **Tests:** api **351** (derives-from-tier · ignores client `xpReward` · PATCH
  re-derives) · chores **59** (new `CreateTaskDrawer.test.tsx`: no Score picker, the
  line tracks typed amounts and clears to base, submit carries no `xpReward`) · ui
  **184** (`CoinAmountField`: preset select, selected state, digit stripping) ·
  rewards 54. Typecheck + lint green across all four.

## Gotchas / for the next session

- **jsdom needs the `ResizeObserver` stub for this drawer now** — the approval
  Switch (Radix `useSize`) mounts once an amount is typed; chores'
  `test.setup.ts` gained the same stub calendar/rewards already had.
- The drawer test can't `getByLabelText(/Pays/)` — the approval switch's own label
  ("Pays out only after…") also matches; use the exact `'Pays (P$)'`.
- **No browser automation existed in this environment** (same as the auto-bug #73
  session): the live review was the running dev stack (worktree shell :5173, plugin
  dists rebuilt) reviewed by the user directly — **signed off** — plus the
  DOM-rendering drawer tests and real-HTTP API suite.
- The branch does **not** carry main's PR #74 (`isToday` widget fix) — expected;
  it merges cleanly via main. Verify at PR time.

## What the next session needs to know

**The branch PR is no longer gated.** `dev/rewards-store-wallet` now carries
M4/5a–d + M4/8 and the prod flip — opening and merging that PR **is the P-Bucks
launch**. At the flip, run the standing fridge-distance checks (coin beside
marigold, the P-mark at 16–18px, the amount field at fridge distance).
