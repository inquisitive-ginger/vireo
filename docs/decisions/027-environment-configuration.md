# ADR 027 — Environment Configuration

**Status:** Decided

## Decision

Environment variables are managed via `.env` files at the repository root.

| File           | Committed?      | Purpose                                                                |
| -------------- | --------------- | ---------------------------------------------------------------------- |
| `.env.example` | Yes             | Template documenting all required vars — copy to `.env` to get started |
| `.env`         | No (gitignored) | Dev values — loaded by the API server at startup                       |
| `.env.test`    | No (gitignored) | Test overrides — loaded by Vitest automatically                        |

**Variables:**

| Name             | Used by                | Description                                                                                                                          |
| ---------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `DATABASE_URL`   | API server, Prisma CLI | Database connection string — dev in `.env`, test in `.env.test`                                                                      |
| `SESSION_SECRET` | API server             | `@fastify/session` cookie signing key                                                                                                |
| `E2E`            | Playwright config      | Set to `true` in `.env.test`; disables `reuseExistingServer` for the API so E2E always starts a fresh server against `familyos_test` |

**Loading:**

- **API dev server** (`apps/api`): `tsx watch --env-file ../../.env src/index.ts` in the `dev` script. Uses Node 22's native `--env-file` flag — no `dotenv` dependency. `--env-file` does not override vars already set in the process environment.
- **Vitest** (`apps/api`): `envDir: '../../'` in `vitest.config.ts` causes Vitest to load `.env.test` after `.env`, overriding `DATABASE_URL` with `familyos_test`. `src/test.setup.ts` uses `??=` as a fallback guard in case Vitest is invoked outside the normal script. `src/test.globalSetup.ts` then upserts the suite's persistent fixtures (`family`, `seed-parent-1`, `seed-child-1`) before any test file runs, and carries the same non-`_test` refusal because it writes.
- **Playwright E2E** (`packages/e2e`): `node --env-file ../../.env.test` in the `e2e` and `e2e:ui` scripts loads `DATABASE_URL=familyos_test` and `E2E=true` into the Playwright process. Child processes (including the spawned API server) inherit these vars; tsx's own `--env-file ../../.env` does not override them.

**Database separation:**

Two databases are maintained locally inside the same Docker PostgreSQL container:

| Database        | Used by    |
| --------------- | ---------- |
| `familyos`      | Dev server |
| `familyos_test` | Test suite |

Tests never touch the dev database — `apps/api/src/test.setup.ts` refuses to run against a database whose name does not end in `_test`. `beforeEach` hooks truncate test-relevant tables between runs.

**Every script that writes names its target.** Three rules, each from a different way the dev database got hit:

- `prisma/reset.ts` requires `DATABASE_URL` and exits 1 without one. It cannot demand a `*_test` name — resetting dev is its purpose — so the target is stated, not validated.
- `prisma/seed.ts` creates the `seed-parent-1` / `seed-child-1` fixtures only against a `*_test` target. Everything else (`family`, the reward catalog) seeds everywhere. It defaults to the dev URL, so seeding them unconditionally put two fake people into `familyos`, the tier-4 one drawing every parent fan-out.
- The API suite provisions those fixtures itself (`globalSetup`), rather than inheriting them from `db:seed` where E2E's `POST /api/dev/reset` could delete them out from under it.

Both databases take the same migrations; only the test one takes the fixtures.

To set up the test database from scratch:

```bash
psql postgresql://familyos:familyos@localhost:5432/postgres -c "CREATE DATABASE familyos_test;"
DATABASE_URL=postgresql://familyos:familyos@localhost:5432/familyos_test \
  pnpm --filter @family-os/platform exec prisma migrate deploy
DATABASE_URL=postgresql://familyos:familyos@localhost:5432/familyos_test \
  pnpm --filter @family-os/platform exec prisma db seed
```

## Why

A single shared dev/test database silently corrupts dev state whenever the test suite runs — `beforeEach` truncates `platform.system_config`, which removes any PIN or config set during a dev session. Separate databases eliminate this at zero infrastructure cost: both live in the same Docker container that is already required by ADR 009.

`NODE_OPTIONS --env-file` is preferred over importing `dotenv` because Node 22 ships it natively. Vitest's `envDir` integrates with Vitest's env loading order (`.env` → `.env.test` → `.env.local`) without any extra setup code.

## Alternatives considered

- **Per-package `.env` files:** duplication — vars used by multiple packages (e.g. `DATABASE_URL`) must be copied to each; root-level is simpler
- **`dotenv/config` import in `index.ts`:** adds a runtime dependency and requires a path argument pointing to the root `.env`; less transparent than `NODE_OPTIONS`
- **Test schema prefixes (`test_platform`, `test_chore_engine`):** finer-grained but requires each package to know its prefixed schema name, and all migration commands must explicitly target the prefixed schema; a separate database is equivalent isolation at lower complexity

## Do not revisit unless

The project moves to a hosting model where `--env-file` is unavailable, or secrets management requires an external vault — at that point, environment injection at deploy time replaces `.env` files entirely.
