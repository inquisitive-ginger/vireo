# ADR 024 — End-to-End Testing

**Status:** Decided

## Decision

**Playwright** is the E2E test framework. Implemented in the M0 shell-skeleton story — `packages/e2e/` ships in M0.

## Why

Playwright is the current standard for browser automation: multi-browser, first-class TypeScript, parallel execution, no JVM dependency, and a built-in test runner that integrates cleanly with Turborepo. Its auto-waiting model removes most flakiness sources that plague older E2E frameworks.

E2E before M0 is complete is premature. There is no meaningful UI flow to drive until the shell renders and the first plugin loads. Writing E2E scaffolding against an empty shell creates tests that exercise nothing and must be rewritten. The stack decision is made now so it doesn't become a last-minute choice; the `packages/e2e` package is created when shell-skeleton is implemented.

## Alternatives considered

- **Cypress** — heavier runtime, advanced parallelism requires paid tier, slower test execution than Playwright in CI.
- **Vitest browser mode** — correct for component-level browser tests but not full-stack E2E across the Fastify API and React shell. Not a substitute.
- **WebdriverIO** — broad protocol support but more configuration overhead than needed for a single-host local app.

## Scope

E2E tests live in `packages/e2e/` (separate from per-package unit tests). Tests run against a locally-started Docker Compose environment. No external test environment — this is a locally-hosted app.

## Do not revisit unless

Playwright's Vite Module Federation support degrades significantly (loading federated remotes in a test browser context), in which case Cypress with its own Vite integration is the fallback.
