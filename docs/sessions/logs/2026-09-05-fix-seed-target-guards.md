# 2026-09-05 — Fix: the seed and the reset both name their target

**Type:** fix (ad-hoc, no kickoff) · **Story:** none · **Committed straight to `main`**
**Outcome:** shipped. Two fake profiles removed from dev; the two scripts that could
put them back now state which database they mean.

## The report

Two profiles — **Parent** (tier 4) and **Child** (tier 1) — sitting in the dev
database, assumed to have leaked in from the test suite.

They had not. The test suite never reached `familyos`: `apps/api/src/test.setup.ts`
refuses any database whose name fails `/(^|_)test$/`, `.env.test` and CI both point at
`familyos_test`, and E2E builds its own household through onboarding. The dedicated test
database already existed and was already isolated.

**`packages/platform/prisma/seed.ts` created them itself.** It upserted `seed-parent-1`
and `seed-child-1` unconditionally, and it defaults to the _dev_ URL — so any bare
`pnpm db:seed`, or the `db:reset` → re-seed cycle, installed the API suite's fixtures
into the family's database. They landed 2026-08-12 04:35.

Not cosmetic: `seed-parent-1` is **tier 4**, so it was a real recipient of every parent
fan-out. It had collected three notifications — the 16:00 dinner nudge among them.

## What shipped

**Seed is target-aware.** The two fixtures are gated behind an `isTestDatabase` check
using the same predicate as the setup guard; `family` and the starter reward catalog
still seed everywhere, so CI's `prisma db seed` against `familyos_test` is unchanged.
The seed log now names the database it wrote to.

**Reset has no default target.** `prisma/reset.ts` dropped its `?? '…/familyos'`
fallback — `DATABASE_URL` is required and it exits 1 without one. It deliberately does
_not_ demand a `*_test` name the way `test.setup.ts` does: resetting dev is its actual
purpose, so the target is **stated rather than validated**. The accident it now survives
is meaning `familyos_test` and forgetting the variable, which is the 2026-07-13 incident
that cost every member profile, avatar, the PIN and the layouts.

## Cleanup

Deleted 3 notifications + 2 profiles from `familyos`. Swept every text/uuid column
across the six plugin schemas first — no other rows referenced them. Dev is back to
Family, Hallie, Teddy, Zach, Zoë. The reset/reseed round-trip also cleared a stray
`c3bea47f` "Parent" an old E2E run had left in `familyos_test`.

## Verification

- `pnpm db:seed` with no `DATABASE_URL` → `Seeded: profiles ("familyos")`, dev clean.
- Against `familyos_test` → `Seeded: profiles + test fixtures ("familyos_test")`.
- `pnpm db:reset` with no `DATABASE_URL` → refuses, exit 1, touches nothing.
- API suite **593/593** after a full reset + reseed of the test DB.

## Left alone

`familyos_render` carries the same two stale rows. Nothing in the repo references that
database — it is a scratch copy from some earlier session. Not deleted; worth confirming
it is disposable and then dropping it.

## Follow-on: the API suite owns its fixtures

`familyos_render` turned out to be referenced **nowhere** — not in the tree, not in any
script, not in git history on any branch. A hand-made `pg_dump | psql` copy of dev from
around 2026-08-25, strictly older than dev (39 migrations vs 42, no `shopping` schema)
and holding no row dev lacked. Dumped to `~/vireo-familyos_render-20260905.sql.gz`, then
dropped. Two databases remain.

Chasing whether it was the E2E database surfaced the real defect. It is not — Playwright
uses `familyos_test` — but **both suites share that one database and step on each other**.
E2E's `onboarding.spec.ts` opens with `POST /api/dev/reset`, which deletes every profile
but `family`. That takes `seed-parent-1` and `seed-child-1` with it, and nothing in the
API suite recreates them: the `beforeEach` hooks preserve those ids but only `db:seed`
ever created them. So an E2E run left the API suite failing until someone re-seeded by
hand. CI never saw it (it seeds fresh and does not run both); locally it looked like
mystery failures.

`apps/api/src/test.globalSetup.ts` now upserts `family`, `seed-parent-1` and
`seed-child-1` before any test file runs, wired via `globalSetup` in `vitest.config.ts`.
It carries the same non-`_test` refusal as `test.setup.ts`, since unlike that file it
writes. The two suites still share the database — this makes the API suite self-repairing
rather than separating them.

**Verified:** deleted every row from `platform.profiles` in `familyos_test`, then ran the
suite cold — **593/593**, fixtures rebuilt. With `DATABASE_URL` forced at the dev database
it refuses (`Refusing to provision test fixtures in non-test database "familyos"`) and dev
still has its five profiles.
