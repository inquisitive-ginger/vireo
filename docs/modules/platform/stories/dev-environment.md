# Story: Dev Environment

**Module:** platform
**Status:** ✅ Done

## User story
As a developer, I can run the full platform locally with one command so that I can work on any feature without manual environment setup.

## Scope
**In:** pnpm + Turborepo monorepo scaffold; `packages/ui` and `packages/platform` stubs (types + barrel exports — no implementation); `apps/shell` React + Vite app scaffold; `apps/api` Fastify service scaffold; Docker Compose with PostgreSQL 16; shell hot-reload in development; `pnpm turbo gen plugin` Turborepo generator that scaffolds new plugins (per ADR 020); Vitest workspace config with per-package `vitest.config.ts` (ADR 023); `packages/test-utils` with RTL custom render, profile factories, and event bus test double (ADR 026); Storybook 8 in `packages/ui` with Tailwind CSS v4 and Vite integration (ADR 025); `CONTRIBUTING.md` with code style/formatting conventions and branching/git workflow

**Out:** CI/CD pipeline; production deployment config; seed data (added by the story that needs it); any real package implementation beyond stubs; Playwright E2E scaffold (deferred to shell-skeleton per ADR 024); Storybook stories beyond the initial setup verification story; typed `WidgetManifest` shape in generated manifest (placeholder `widgets: []` is included per ADR 022; full type is M1 scope)

## Acceptance criteria
1. `docker compose up` starts PostgreSQL and it accepts connections on the expected port
2. `pnpm dev` (via Turborepo) starts both the shell app and the API service without errors
3. The shell loads in a browser at `localhost` and renders without console errors
4. `packages/ui` and `packages/platform` resolve as workspace dependencies from `apps/shell` — no TypeScript import errors
5. `pnpm typecheck` passes with zero errors across all packages
6. Editing a shell source file triggers hot-reload without a full page refresh
7. `pnpm turbo gen plugin --args <name>` creates a valid plugin scaffold under `plugins/<name>/` containing `package.json`, `vite.config.ts`, `manifest.json`, `tsconfig.json`, `src/index.ts`, and `src/Plugin.tsx`
8. The scaffolded plugin's entry is added to `pnpm-workspace.yaml` automatically; `pnpm dev` picks it up without manual configuration
9. `pnpm test` (via Turborepo) runs Vitest across all packages and passes; a sample test in `packages/test-utils` using the profile factory and RTL custom render passes
10. `pnpm storybook` starts the Storybook dev server for `packages/ui` without errors; a placeholder story renders in the browser
11. `CONTRIBUTING.md` exists at the repo root and covers: code style and formatting conventions (TypeScript, React, file naming), and the branching/git workflow (branch naming, commit message format, PR-per-story process)

## Dependencies
- none

## Notes
Monorepo layout: `apps/` for runnable services (shell, api), `packages/` for shared libraries (ui, platform, test-utils). Package stubs export placeholder types only — real implementations are layered in by subsequent stories. See ADR 016 (monorepo), ADR 023 (Vitest), ADR 025 (Storybook), ADR 026 (test conventions).
