# Kickoff — M4/5b Dev: Ticket Store + Pocket UI

**Type:** development · **Interjects into `dev/rewards-store-wallet`.** The design
is settled and rendered — build to the artifact, don't re-explore.
_Depends on: M4/5a (the lifecycle the UI renders)._

## Pre-session reads

- ADR 055 · the rework artifact
  (https://claude.ai/code/artifact/b34e0c21-e40d-4185-a83a-864e065a4865, Parts 4–6)
- `logs/2026-07-26-design-rewards-store-rework.md`
- Worktree: `Store.tsx`, `RedeemDialog.tsx`, `affordability.ts`, `hooks.ts`,
  `widgets/WalletView.tsx` — `Modal`, the affordability lib, hooks shape and the
  wallet widget largely survive; `Store.tsx` is reshaped, not restarted.

## Scope

- **Two kid tabs** (segmented control): **Store** and **My stuff** (badge = owned
  tickets waiting). Parent tabs unchanged.
- **Store**: purse hero ("Teddy's P-Bucks", struck coin, metric numeral,
  "Where'd it go?" → history sheet, M4/5c) · "Get it now" ticket shelf ·
  "Almost there" rows with meters · "See all".
- **The ticket**: perforated stub carrying the cost (coin + numeral), emoji, name,
  **description**, brass wash when affordable (replaces the green success edge).
  Ask-first = quiet corner seal "ask to use" — informational, never a gate.
- **My stuff**: ready tickets ("Use it" / "Ask to use"), waiting state, and the
  **stub shelf** (torn-stub chips with counts — replaces the store's
  "You've earned N" row).
- **Modals**: buy confirm (arithmetic kept, "It goes in your pocket") ·
  ask-to-use · **the tear** (the module's one flourish; reduced-motion respected) ·
  not-now (note quoted, ticket safe).
- **Prod flip** (carried over from the original M4/5 scope): register `rewards` in
  `plugins.json` + `load-plugin.ts`, turn `REWARDS_UI` on, land M4/8 with it.
- **Code-seed the starter catalog with descriptions** (spec §Seed catalog — write
  the one-liners in-session, one per reward).
- Skeleton tickets for loading (no centered spinner).

## Constraints

- Everything in existing tokens — brass/coin tokens for money-warm, no new hues.
- `useFitRows` if any list can outgrow a slot; every list source `useMemo`'d.
- Update `design-system.md` §Rewards surfaces (store/redemption sections are
  superseded by the ticket system; wallet-widget section survives).

## Outputs

- [ ] Code + tests on the branch; live review in the real shell before closeout
- [ ] `design-system.md` §Rewards surfaces rewritten
- [ ] Session log + queue/progress updates; delete this kickoff
