# 2026-07-22 — Dev: Ledger + Balance (M4/2)

**PR #63** · branch `dev/rewards-ledger-balance`

## What was built

- **`rewards` plugin package** — Prisma schema in its own `rewards` PG schema, `./db`
  export, init migration, committed client. **No frontend scaffolding.** The queue said
  "mirror `family-feed`", but half that structure is vite/federation/manifest/nav and a
  nav item pointing at an empty route is a dead surface — it lands in M4/5 with the page
  it exposes.
- **`ledger_entries`** (append-only, ADR 047) + **`balances`** (cache, same transaction).
- **`apps/api/src/lib/ledger.ts`** — `postEntry` / `getBalance` / `listEntries` /
  `recomputeBalance`. Every M4 earn and spend goes through it, so the guards are
  inherited rather than re-implemented per caller.
- **`GET /rewards/wallet`** — balance + cursor-paged history; own at every tier,
  `?profileId=` tier-4 only, family profile 403.
- `rewards.wallet.view` in `PERMISSION_REGISTRY`, `rewards.Wallet` as a CASL subject.
- Wiring: CI migrate loop, `docker-entrypoint.sh`, `db:reset --module rewards`.

## Acceptance criteria

All 10 pass. **AC1 was verified on a genuinely empty database** — a scratch
`familyos_fresh_test` with all five packages' `migrate deploy` — not on the local test
DB. That distinction matters: the local `familyos_test` **cannot take `migrate deploy`
at all** (P3009, a failed `init_platform_schema` row from 2026-07-21 and only 3 rows in
`_prisma_migrations` against 16 tables). The rewards migration had to be applied by
psql + `migrate resolve --applied`. **Pre-existing local drift, not introduced here** —
CI builds fresh and is unaffected — but the next person to add a schema will hit it.

## Decisions made

- **Overdrafts are permitted.** ADR 048 makes reversal symmetric, so reopening a chore
  whose coins were already spent is a legitimate movement; refusing it would leave the
  ledger disagreeing with what happened. Affordability is a spend-site check.
- **`sourceType` is a plain string, not a union.** A union naming `chores.task` and
  `meals.dinner` puts knowledge of the earning plugins inside the ledger — exactly what
  ADR 048 forbids. The type would have been the coupling.
- **`@@unique([sourceType, sourceId])`, no raw SQL** — Postgres NULLS DISTINCT _is_ the
  spec's partial index.
- **`profile_id` is `@db.Uuid`** (chores precedent), so the ADR 053 family exclusion is
  structural as well as enforced in the service and the route. The test proved it the
  hard way: `count({ where: { profileId: 'family' } })` throws at the driver.
- **A replay returns the existing entry with `replayed: true`, not an error** — a
  redelivered event is normal and there is nothing the caller could do about it.

## Scope additions

- **`.prettierignore` now ignores generated Prisma output.** Found by accident:
  `pnpm format` reformats every committed Prisma client (~19k lines across four
  packages), which is one cause of the regenerate churn that has to be stripped by hand
  each time. The rewards client as committed is byte-identical to a fresh
  `prisma generate` — the first one in the repo that is.
- `profiles.test.ts` registry count 12 → 13.

## New stories

**M4/3b — Payout Approval on High-Value Chores**
(`docs/modules/rewards/stories/payout-approval.md`, queued). Raised by the user during
the gate. Chore completion is **auto-accepted** — settled in M2, correct for XP, which
only rises. Once a store exists: kid completes a 10 F$ chore, spends it, parent reopens
→ **balance −10**. Proposal: hold the **payout**, not the chore (per-chore
`requiresApproval`, a `pending_payouts` row released as the normal entry with the same
provenance pair, so release and idempotency are one mechanism). **Must land before
M4/5** — a wrong balance is harmless until it is spendable, and a parent's reopen fully
corrects it.

## Open questions

- Does M4/3b need an ADR? The _hold_ is a new concept beside ADR 047 (a pending entry
  would either move the balance or break `balance = sum(deltas)`). Probably a short one.
- Fractional F$ was raised and is **already settled by ADR 052** — integers, balances in
  tens. Not reopened. The one place a fraction could appear later is a multiplier (ADR
  048's own reopen trigger): round at computation, never store the fraction.

## What the next session needs to know

- **M4/3** adds `coinReward` to `chores.Task` (default 0) and subscribes
  `chores.task.completed` / `.reopened`. Call `postEntry(fastify.eventBus, …)` with
  `sourceType: 'chores.task'` and `sourceId: taskId` — the unique pair makes the
  subscriber idempotent for free, and the reopen debit reuses `sourceType:
'chores.task.reopened'` (a _different_ pair, or the reversal would be swallowed as a
  replay of the credit).
- M4/3 also carries **ADR 051's XP re-strike** and must decide where the gold constants
  live now that `rewards` owns them.
- The live-app review was **skipped with the user's agreement** — nothing renders. The
  route was still probed over real HTTP: an unauthenticated request falls back to the
  **family** profile and correctly 403s with the ADR 053 message, which is the
  fridge-tablet case verified live.
- I killed the user's running dev API while probing (my instance hit `EADDRINUSE`, so
  the curls hit theirs); restarted it detached, logs now in the session scratchpad
  rather than their terminal.
