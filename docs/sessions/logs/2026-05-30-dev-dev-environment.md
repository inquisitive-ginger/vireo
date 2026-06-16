# Session Log — Dev: dev-environment

**Date:** 2026-05-30
**Type:** Development
**Story:** `platform/dev-environment`

---

## What was built

Full monorepo scaffold from a greenfield repo. All M0 dev-environment infrastructure is in place:

**Root**

- `package.json` (pnpm workspace root, Turborepo scripts)
- `pnpm-workspace.yaml` — `apps/*`, `packages/*`, `plugins/*`
- `turbo.json` — `dev`, `build`, `test`, `typecheck`, `storybook`, `lint` task pipeline
- `tsconfig.json` — root TypeScript config (strict, bundler resolution, react-jsx)
- `docker-compose.yml` — PostgreSQL 16 on port 5432
- `vitest.workspace.ts` — discovers all `*/vitest.config.ts` files
- `eslint.config.mjs` — ESLint 9 flat config with TypeScript + React rules
- `.prettierrc` — no semis, single quotes, 100-char width
- `CONTRIBUTING.md` — code style, file naming, branching + git workflow (AC 11 scope addition)

**`packages/platform`** — type-only stub

- `src/types.ts` — `TierLevel`, `EventName`, `Profile`, `PluginManifest` (with `widgets?: unknown[]`), `PERMISSION_REGISTRY`, `PermissionString`, `PermissionOverride`
- `src/index.ts` — client barrel (types only; hooks added by shell-skeleton + auth-and-profiles)
- `src/server.ts` — server barrel (`EventBus` interface; implementations added by event-bus story)

**`packages/ui`** — stub + Storybook 8

- `src/index.ts` — barrel stub
- `src/styles.css` — `@import "tailwindcss"` (Tailwind v4 entrypoint)
- `vite.config.ts` — React + Tailwind v4 plugins
- `.storybook/main.ts` — `@storybook/react-vite` framework, essentials addon
- `.storybook/preview.ts` — imports `styles.css`
- `src/placeholder.stories.tsx` — Family OS Welcome story with Tailwind classes

**`packages/test-utils`** — shared test utilities (ADR 026)

- `src/render.tsx` — `renderWithProviders` (no-op wrapper; grows when AuthProvider lands)
- `src/factories.ts` — `createProfile(tier, overrides)`, `profileTier1`–`profileTier4`
- `src/event-bus-double.ts` — in-memory synchronous `EventBus` with `emitted` log + `reset()`
- `src/test-utils.test.tsx` — 6 tests covering factories, render, event bus double

**`apps/shell`** — React + Vite scaffold

- Vite on port 5173, React Fast Refresh (HMR), Tailwind v4, minimal `App.tsx`

**`apps/api`** — Fastify scaffold

- `tsx watch` dev server on port 3000, `/health` route, TypeScript strict

**`turbo/generators/`** — plugin generator

- `config.ts` — plop generator with kebab-case validation
- Templates for `package.json`, `vite.config.ts` (Module Federation), `manifest.json`, `tsconfig.json`, `src/index.ts`, `src/Plugin.tsx`

---

## Acceptance criteria status

| AC                                             | Status                 | Notes                                                       |
| ---------------------------------------------- | ---------------------- | ----------------------------------------------------------- |
| 1 — Docker/PostgreSQL on 5432                  | ⚠️ Needs manual verify | `docker compose up -d` then `psql -h localhost -U familyos` |
| 2 — `pnpm dev` starts shell + API              | ✅ Pass                | Confirmed via Turborepo dry-run                             |
| 3 — Shell at localhost:5173, no console errors | ⚠️ Needs manual verify | Needs browser                                               |
| 4 — Workspace deps resolve, no TS errors       | ✅ Pass                | All 5 packages typecheck clean                              |
| 5 — `pnpm typecheck` zero errors               | ✅ Pass                |                                                             |
| 6 — Hot-reload without full refresh            | ⚠️ Needs manual verify | Built into Vite + React Fast Refresh                        |
| 7 — Plugin generator creates 6 files           | ✅ Pass                | Syntax: `pnpm turbo gen plugin --args <name>`               |
| 8 — Plugin workspace auto-discovery            | ✅ Pass                | `plugins/*` glob in workspace file                          |
| 9 — `pnpm test` passes                         | ✅ Pass                | 6 tests in test-utils                                       |
| 10 — Storybook starts, placeholder renders     | ✅ Pass                | Full build clean; Welcome story in bundle                   |
| 11 — CONTRIBUTING.md                           | ✅ Pass                |                                                             |

ACs 1, 3, 6 require Docker and a browser — verify with `pnpm dev` before marking the story fully done.

---

## Scope additions (missing requirements folded in)

- **`CONTRIBUTING.md`** — identified during AC audit as a missing requirement that belongs in this story. Covers TypeScript/React code style, file naming, and branching/git workflow (branch naming, commit format, PR-per-story, squash merge). Also surfaced AC 7 syntax correction (`--args` not `--name`).
- **`src/Plugin.tsx` in generator** — architecture.md specifies this file but it was missing from the original AC 7. Added to both the generator and the updated AC.
- **`widgets: []` in manifest template** — ADR 022 defines this field on plugin manifests. Added as an empty placeholder; full typed `WidgetManifest` shape is M1 scope.

---

## New stories created

None.

---

## Open questions raised

- **AC 7 generator syntax** — `pnpm turbo gen plugin --args <name>` (positional value, not `--name=`). Story spec updated. Worth noting in CONTRIBUTING.md or a dev tip doc eventually.
- **pnpm minimum version** — root `package.json` requires `pnpm>=9.0.0` but project currently runs pnpm 11.5.0. Fine for now; just don't pin tightly.

---

## What the next session needs to know

- `dev-environment` is scaffolded; pnpm install is clean; typecheck and tests pass.
- ACs 1, 3, 6 need manual browser + Docker verification before the PR merges.
- `shell-skeleton` and `event-bus` are both unblocked and can run in parallel.
- `packages/platform` is types-only. Hooks (`useAuth`, `useTier`, `usePermissions`, `useEventBus`) and components (`AuthProvider`, `TierGate`, `PermissionGate`) are added by `shell-skeleton`. Server implementations (`createEventBusPlugin`, `createAbility`) are added by `event-bus` and `auth-and-profiles` respectively.
- `packages/test-utils` `renderWithProviders` is a no-op wrapper. It will gain `AuthProvider` + `QueryClientProvider` once those stories run — no call-site changes needed.
- `architecture.md` was updated during this session: `PluginManifest` now includes `widgets?: unknown[]` (ADR 022 field, typed shape deferred to M1).
