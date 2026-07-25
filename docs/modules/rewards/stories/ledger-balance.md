# Story: Ledger + Balance

**Module:** rewards
**Status:** ✅ Done — 2026-07-22, PR #63

## User story

As a kid, I have an P-Bucks balance I can see and a history that explains it, so "where
did my 12 P-Bucks go" has an answer that isn't "trust the number."

## Scope

**In:**

- The `rewards` plugin package — Prisma schema in its own `rewards` PG schema, a
  `./db` export, migration, generated client (the `family-feed` shape)
- `ledger_entries` — append-only (ADR 047), signed `delta`, `reason`,
  `(source_type, source_id)` UNIQUE as the idempotency claim
- `balances` — a recomputable cache, written in the same transaction as the entry
- A server-side ledger service (`postEntry` / `getBalance` / `recomputeBalance`)
  that every later earn/spend story calls — chores earn (M4/3), redemption (M4/4),
  punch payout (M4/6), grants (M4/7)
- `rewards.balance.credited` / `.debited` on the event bus
- `GET /rewards/wallet` — balance + paged history; own by default, any profile for
  tier 4
- `rewards.wallet.view` in `PERMISSION_REGISTRY`, `rewards.Wallet` as a CASL subject,
  row-level own-only for tiers 1–3 (ADR 053)
- Wiring: `apps/api` dependency, CI migrate loop, `docker-entrypoint.sh`, `db:reset`

**Out:** Any UI (store page and wallet widget are M4/5). Federation/vite/manifest/
nav scaffolding — added in M4/5 when there is a component to expose. Earn sources,
the catalog, redemptions, punch cards, grants — their own stories.

## Acceptance criteria

1. `rewards.ledger_entries` and `rewards.balances` exist via a committed migration;
   `prisma migrate deploy` creates the schema fresh on an empty database
2. `postEntry` appends an immutable row **and** upserts the balance in one
   transaction; the balance always equals the sum of the profile's deltas
3. A replayed `(source_type, source_id)` is a **no-op** — one entry, balance
   unmoved, the existing entry returned rather than an error
4. A zero `delta` is rejected; a debit that takes the balance negative is **allowed**
   (a reversal after the coins were spent is legitimate — affordability is checked at
   the spend site, not in the ledger)
5. No entry may carry the `family` pseudo-profile — rejected in the ledger service
   **and** by the route (ADR 053)
6. `GET /rewards/wallet` returns `{ profileId, balance, entries, nextCursor }` for the
   active profile at every tier, tier 1 included
7. `GET /rewards/wallet?profileId=…` returns another member's wallet for tier 4 and
   **403s** for tiers 1–3; the family profile 403s for everyone
8. `recomputeBalance` rebuilds the cache from the entries and matches the cached value
9. `rewards.balance.credited` / `.debited` emit with
   `{ profileId, delta, balance, reason, sourceType, sourceId }`
10. Route + service tests via `fastify.inject()` against `familyos_test` (ADR 026)

## Dependencies

M4/1 design gate (✅) — for the two nullable columns it added and the household
exclusion. Nothing else; the data layer starts cold.

## Notes

- **ADR 047** — append-only, balance is a cache, cost snapshots. **Do not copy
  `chores.xp_balances`**: a bare mutable total is fine for a number that only rises
  and insufficient the moment it falls.
- **ADR 048** — `rewards` never imports another plugin. The service takes an amount
  and a provenance pair; it knows nothing about what earned it.
- **ADR 053** — a balance belongs to a person; tier 1 holds a wallet.
- Postgres treats NULLs as distinct under a unique index, so a plain
  `@@unique([sourceType, sourceId])` _is_ the spec's partial index — many entries
  with a null `source_id` coexist, and no raw SQL is needed.
