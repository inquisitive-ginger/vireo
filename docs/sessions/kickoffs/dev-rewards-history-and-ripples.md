# Kickoff — M4/5c Dev: History Sheet + Ripple Fixes

**Type:** development · **Interjects into `dev/rewards-store-wallet`.**
_Depends on: M4/5a (widget ticket-ready state reads `owned`); parallel with M4/5d._

## Pre-session reads

- Artifact Parts 7 + 9 · ADR 047 (the "a kid can explain their balance" promise),
  053 · `logs/2026-07-26-design-rewards-store-rework.md`

## Scope

- **History sheet** ("Where'd it go?" off the purse): bottom sheet reading
  `ledger_entries` in kid grammar — grouped by day, earned rows green and signed
  (`+2`), spent rows plain (`−15`), `reason` as the row text, grants quote their
  reason. New `GET /rewards/ledger` — own wallet at every tier, any wallet tier-4,
  family profile 403 (ADR 053 pattern from `/rewards/wallet`).
- **Widget**: new top-priority adaptive line when an owned ticket waits —
  "🍿 A ticket's waiting in your pocket ›" beats the affordability line.
- **Family-profile `/rewards`**: replace the infinite spinner + 403 storm with a
  chooser — "Wallets are personal. Whose pocket?" + member faces (audit finding:
  the fridge tablet's default profile hits a dead screen today).
- **Teen home layout**: `rewards.wallet` joins the tier-3 default (compact, below
  the triage row) — audit finding: Zoë earns and spends the currency with no
  wallet anywhere on home.

## ACs

1. The sheet explains the current balance: rows sum to it, visibly.
2. Family profile never fetches a wallet; the chooser renders at tier 1.
3. Widget shows ticket-ready > affordable > next-goal > first-earn, in that order.

## Outputs

- [ ] Code + tests on the branch; live review before closeout
- [ ] Session log + queue/progress updates; delete this kickoff
