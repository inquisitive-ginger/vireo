# Kickoff — M4/5a Dev: Ticket Lifecycle (API)

**Type:** development · **Interjects into the in-flight M4/5 branch
`dev/rewards-store-wallet`** (worktree `../family-os-store-wallet`, uncommitted).
Backend only — no design gate; the model itself was gated 2026-07-26 (ADR 055).

## Pre-session reads

- ADR 055 (the decision — do not re-litigate), 047, 048, 053
- `apps/api/src/lib/redemptions.ts`, `apps/api/src/plugins/rewards.ts` + tests
- `logs/2026-07-26-design-rewards-store-rework.md`

## Scope

Rework the redemption model per ADR 055. Statuses
`pending·granted·declined·fulfilled` → `owned·use_requested·used`.

- **Buy** (`POST /rewards/redemptions`): always debits immediately (no approval
  branch), snapshots cost, lands `owned`. Stock decrements here. Idempotency and
  ledger mechanics unchanged.
- **Use** (new): kid-initiated. Non-approval reward → straight to `used`.
  `requiresApproval` → `use_requested`, `notify()` parents.
- **Decide** (tier-4): yes → `used` (this _is_ fulfilment — the fulfil action is
  deleted); not-now → back to `owned`, `decided_note` optional, **no refund**,
  `notify()` the kid either way.
- **Revoke** (tier-4, the exception): refunds via `postEntry` and removes the
  ticket. Not reachable from kid UI.
- Queue endpoint returns `use_requested` rows (+ the M4/3b payouts, unchanged).
- Events: rename within `rewards.*` to match the model (naming decided in-session;
  spec table updated to match).
- Migration: the branch is unmerged and prod-dormant — edit the branch migration
  in place rather than stacking a rename migration.

## ACs

1. Buy debits once with snapshot; replayed request is a no-op (idempotency claim).
2. Use → not-now → use → yes cycles land exactly one debit; ticket survives the
   not-now with its note.
3. Non-approval use is immediately `used`; no parent interaction exists for it.
4. Revoke refunds the snapshot cost and the ledger stays balanced.
5. Full API suite green; `familyos_test` P3009 caveat applies (hand-apply if a new
   migration is added — see 2026-07-22 log).

## Outputs

- [ ] Code + tests on `dev/rewards-store-wallet`
- [ ] `docs/modules/rewards/spec.md` events/statuses table updated
- [ ] Session log + queue/progress updates; delete this kickoff
