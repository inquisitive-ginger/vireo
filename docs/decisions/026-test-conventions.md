# ADR 026 — Test Conventions

**Status:** Decided

## Decision

Four conventions apply across all packages:

### 1. File colocation
Test files live next to their source: `Component.test.tsx`, `util.test.ts`, `route.test.ts`. No `__tests__/` directories, no mirrored tree.

### 2. No enforced coverage thresholds
Coverage is not gated in CI. High-value targets are tested thoroughly by convention, not by threshold enforcement:
- `packages/platform` — platform API, permission logic, CASL ability construction
- `packages/platform/server` — Fastify plugins, event bus, route handlers
- Plugin business logic (chore rules, finance ledger) — unit tested
- Plugin UI components — RTL behavior tests for interactive elements; snapshot tests are discouraged

### 3. Real database for integration tests
Tests that touch Prisma use a real PostgreSQL database. Each plugin schema uses a `test_` prefixed schema (e.g. `test_chore_engine`) isolated from the dev schema. The `vitest.setup.ts` in each package that needs a database runs Prisma migrations against the test schema and truncates tables between tests. No Prisma mocking.

### 4. Shared setup
A root `vitest.workspace.ts` lists all packages. A shared `packages/test-utils/` package exports:
- RTL custom render wrapping `AuthProvider` and `QueryClientProvider`
- Test profile factories (pre-built `Profile` objects for each tier)
- Event bus test double (in-memory, synchronous)

## Why

**Colocation** — test files rename and move with their source; a parallel tree always drifts. Discoverability is immediate: open a file, its tests are one tab away.

**No thresholds** — this is a locally-hosted family app, not a public service. Coverage theater (70% line coverage that counts dead branches) costs maintenance and produces false confidence. The platform API and permission system are tested because bugs there are silent and cross-cutting; plugin UI is tested because behavior matters; everything else is tested where it makes sense.

**Real database** — Prisma's `accessibleBy()` (ADR 018/019) generates complex SQL that only catches bugs when run against a real engine. Mocking Prisma would require maintaining a second model of the query layer. The test schema approach gives real guarantees at acceptable cost (Docker is already required by ADR 009).

**Shared test utils** — prevents every package from independently solving "how do I render a component that needs auth" or "how do I make a tier-3 user." The factories are the test DSL for the project.

## Do not revisit unless

The real-database approach makes CI prohibitively slow (unlikely for a local-only project with a single Postgres container), or a package genuinely has no database dependency and is mistakenly pulling in DB setup overhead.
