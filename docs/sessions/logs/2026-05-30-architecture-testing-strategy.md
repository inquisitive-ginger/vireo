# Session Log — Architecture: Testing Strategy
**Date:** 2026-05-30
**Type:** Architecture

---

## What was decided

Four ADRs settled the full testing stack:

**ADR 023 — Test runner and unit/integration testing**
Vitest as the universal test runner across all packages. `@testing-library/react` + jsdom for component tests. `fastify.inject()` for route-level integration tests. Chosen because Vitest shares the Vite build pipeline (ADR 007) — same module resolution, no ESM transform friction, Turborepo-cacheable.

**ADR 024 — E2E testing**
Playwright, deferred to M1 shell-skeleton. No E2E scaffold in M0 — there's nothing meaningful to drive until the shell renders and a plugin loads. The decision is made now so it's not a last-minute choice when M1 arrives.

**ADR 025 — Component catalog**
Storybook 8 in `packages/ui`, shipping in the M0 dev-environment story. Chosen because design sessions need a living canvas — the Visual Language Design session (blocked on M0) requires somewhere to render tokens and components interactively. Storybook 8's native Vite integration makes setup trivial given ADR 007.

**ADR 026 — Test conventions**
- Test files colocated with source
- No enforced coverage thresholds — `packages/platform` and permission logic are high-priority targets by convention; plugin UI tested for behavior
- Real PostgreSQL for any test touching Prisma; test-prefixed schemas, wiped between runs
- Shared `packages/test-utils` for RTL custom render, profile factories, and an event bus test double

## What was produced

- `docs/decisions/023-test-runner-and-unit-testing.md`
- `docs/decisions/024-e2e-testing.md`
- `docs/decisions/025-component-catalog-storybook.md`
- `docs/decisions/026-test-conventions.md`
- `docs/architecture.md` updated: settled decisions table (023–026, plus backfilled 021–022 which were missing), new Testing section with stack table, conventions, and package layout

## Open questions raised

None. Testing stack is fully settled.

## What the next session needs to know

- The M0 `dev-environment` story must include Vitest, Storybook 8, and `packages/test-utils` scaffold as explicit deliverables — update the story spec before running the development session.
- The `development` session template does not yet exist — write it before running the first dev session (as noted in the session that queued these).
- Playwright (`packages/e2e`) is created at M1 shell-skeleton, not before.
- ADR 021 and 022 were missing from the settled decisions table in `docs/architecture.md` — now backfilled.
