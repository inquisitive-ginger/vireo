# Story: Dev Environment

**Module:** platform
**Status:** ⬜ Not Started

## User story
As a developer, I can run the full platform locally with one command so that I can work on any feature without manual environment setup.

## Scope
**In:** pnpm + Turborepo monorepo scaffold; `packages/ui` and `packages/platform` stubs (types + barrel exports — no implementation); `apps/shell` React + Vite app scaffold; `apps/api` Fastify service scaffold; Docker Compose with PostgreSQL 16; shell hot-reload in development

**Out:** CI/CD pipeline; production deployment config; plugin scaffolding tooling; seed data (added by the story that needs it); any real package implementation beyond stubs

## Acceptance criteria
1. `docker compose up` starts PostgreSQL and it accepts connections on the expected port
2. `pnpm dev` (via Turborepo) starts both the shell app and the API service without errors
3. The shell loads in a browser at `localhost` and renders without console errors
4. `packages/ui` and `packages/platform` resolve as workspace dependencies from `apps/shell` — no TypeScript import errors
5. `pnpm typecheck` passes with zero errors across all packages
6. Editing a shell source file triggers hot-reload without a full page refresh

## Dependencies
- none

## Notes
Monorepo layout: `apps/` for runnable services (shell, api), `packages/` for shared libraries (ui, platform). Package stubs export placeholder types only — real implementations are layered in by subsequent stories. See ADR 016 for the pnpm + Turborepo decision.
