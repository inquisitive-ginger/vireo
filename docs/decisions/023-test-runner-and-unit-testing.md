# ADR 023 — Test Runner and Unit/Integration Testing

**Status:** Decided

## Decision

**Vitest** is the test runner for all packages. Component tests use `@testing-library/react` with a **jsdom** environment. Fastify route tests use **`fastify.inject()`** — no real HTTP.

## Why

Vitest shares the Vite build pipeline (ADR 007). This means the same module resolution, aliases, and ESM handling used by the app are used in tests — no separate Babel transform, no `jest.config` fighting with `vite.config`, no ESM gymnastics. Turborepo's task graph can cache `vitest run` outputs like any other task.

`@testing-library/react` is the React testing standard — it tests behavior from a user perspective rather than component internals, which is the right level for this project. jsdom is the correct environment for component tests that don't need a real browser.

`fastify.inject()` is Fastify's built-in test utility; it exercises the full request/response pipeline (plugins, hooks, decorators) without opening a real socket. It pairs directly with Vitest — no separate test HTTP client needed.

## Alternatives considered

- **Jest** — requires additional transforms to handle ESM modules and doesn't share the Vite config. Extra maintenance surface for no gain given ADR 007.
- **Enzyme** — poor React 18 support; tests implementation details rather than behavior.
- **Vitest browser mode** — runs in a real browser via Playwright, which is appealing but still maturing. The added complexity isn't warranted for unit/integration work; reserved for Playwright E2E (ADR 024) when the full app is running.

## Scope

Applies to all packages under `packages/` and `apps/` and all plugins under `plugins/`. Each package configures its own `vitest.config.ts` extending a shared workspace root config.

## Do not revisit unless

Vite Module Federation (ADR 007) produces unresolvable module resolution conflicts inside the Vitest environment that can't be fixed via config.
