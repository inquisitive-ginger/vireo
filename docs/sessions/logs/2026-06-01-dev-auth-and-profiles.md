# Session Log — 2026-06-01 — Development: auth-and-profiles

## What was built

**Database schema (AC 1–3)**
- Prisma schema with `platform.profiles`, `platform.permission_overrides`, `platform.system_config` tables
- `platform.sessions` table (Prisma-managed, used by `connect-pg-simple`)
- 3 migrations applied: `init-platform-schema`, `add-sessions-table`, `sync-sessions-model`
- Seeded: `family` pseudo-profile (tier 1), `seed-parent-1` (tier 4), `seed-child-1` (tier 1)

**Server layer (AC 10–11)**
- `@fastify/session` + `connect-pg-simple` session management
- `preHandler` hook resolves `activeProfileId → Profile + AppAbility` on every request
- `GET /auth/me` — returns `{ id, name, tier, rules }` (serialized CASL rules for client-side ability reconstruction)
- `POST /auth/switch` — allows if `target.tier ≤ current.tier`; 403 otherwise
- `POST /auth/verify-pin` — verifies against `system_config.family_pin_hash`; 423 if unset; 403 on mismatch
- `GET /profiles` — lists all profiles ordered by tier (real endpoint, not dev-only)

**CASL ability (AC 6)**
- `createAbility(profile, overrides): AppAbility` using `@casl/prisma`'s `createPrismaAbility`
- Tier baselines per ADR 018; grant/revocation overrides applied on top
- `@casl/prisma` installed alongside `@casl/ability` for future `accessibleBy()` use

**React auth layer (AC 4–5, 7–8, 12)**
- `AuthProvider` — wraps app with `QueryClientProvider`; fetches `/auth/me` via TanStack Query; reconstructs `AppAbility` from serialized rules client-side
- `useAuth()` — returns `{ id, name, tier }`
- `useTier()` — returns `TierLevel`
- `usePermissions()` — returns `AppAbility`
- `useEventBus()` — promoted from `apps/shell` dev hook to `@family-os/platform` with `{ publish, subscribe }` shape
- `TierGate` — renders children when `user.tier >= min`; shows fallback otherwise
- `PermissionGate` — renders children when `ability.can(action, subject)`

**Shell integration (AC 12)**
- `AuthProvider` wraps the shell app in `main.tsx`
- `ProfileChip` in sidebar reads from `useAuth()` (live name + initial)
- `DevProfileSelector` dropdown at sidebar bottom: lists profiles from `GET /profiles`, calls `POST /auth/switch` (falls back to PIN prompt on 403), invalidates `['auth/me']` query → reactive re-render of all gates

**Test utilities**
- `MockAuthProvider` in `packages/platform/src/testing.tsx` — uses live `AuthContext`; accepted by all gate components
- Re-exported from `@family-os/platform` and `@family-os/test-utils`
- `renderWithProviders` updated to accept `{ profile }` option; defaults to tier-1 profile

**Tests (40 total, all passing)**
- `ability.test.ts` (8 tests) — tier baselines + override grants/revocations
- `TierGate.test.tsx` (4 tests) — renders/hides/fallback
- `PermissionGate.test.tsx` (4 tests) — renders/hides/fallback
- `auth.test.ts` (7 tests) — `/auth/me`, `/auth/switch`, `/auth/verify-pin` with real PostgreSQL

## Acceptance criteria status

| # | Status |
|---|--------|
| 1 | ✅ Pass — `platform.profiles` table exists with correct columns |
| 2 | ✅ Pass — `platform.permission_overrides` table exists, wired into `createAbility` |
| 3 | ✅ Pass — `platform.system_config` table exists |
| 4 | ✅ Pass — `useAuth()` returns correct user object |
| 5 | ✅ Pass — `useTier()` returns correct numeric tier |
| 6 | ✅ Pass — `usePermissions()` returns `AppAbility`; tier-1 `can('view', 'platform.Plugin')` |
| 7 | ✅ Pass — `TierGate` renders/hides correctly; fallback supported |
| 8 | ✅ Pass — `PermissionGate` renders/hides correctly |
| 9 | ✅ Pass — 3 seeded profiles: `family`, `seed-parent-1` (tier 4), `seed-child-1` (tier 1) |
| 10 | ✅ Pass — `POST /auth/switch` 200 on downward switch; 403 on upward |
| 11 | ✅ Pass — `POST /auth/verify-pin` 423 when no PIN; 403 on mismatch; 200 on match |
| 12 | ✅ Pass — dev selector invalidates TanStack Query; gates re-render without reload |

## Scope additions

- `GET /profiles` added (not in original scope) — needed for the dev profile selector. Scoped conservatively: returns only `{ id, name, tier }`. Will evolve naturally when the profile management UI story is implemented.
- `platform.sessions` table added to Prisma schema — `connect-pg-simple` created it out-of-band; brought under Prisma migration management for consistent schema tracking.
- `packages/platform/src/testing.tsx` — `MockAuthProvider` placed in platform (not test-utils) since it owns `AuthContext`. Avoids circular dev-dep between platform and test-utils.

## Follow-up: environment system + test database isolation

Added after the main session — infrastructure cleanup between stories.

**Env files established (repo root):**
- `.env.example` — committed template; documents `DATABASE_URL`, `SESSION_SECRET`, `TEST_DATABASE_URL`
- `.env` — gitignored dev values; loaded by `apps/api` dev server via `NODE_OPTIONS='--env-file=../../.env'`
- `.env.test` — gitignored test overrides; loaded by Vitest via `envDir: '../../'` in `apps/api/vitest.config.ts`

**Test database isolation:**
- `familyos_test` database created in the same Docker Postgres container
- Migrations and seed applied to `familyos_test`; tests now always run against it
- `apps/api/src/test.setup.ts` default changed from `familyos` to `familyos_test`
- Dev database is no longer touched by `pnpm test`

**Docs updated:** ADR 027 (new — env config), ADR 026 (fixed DB isolation description), ADR 019 (Prisma 7 setup notes), ADR 018 (createPrismaAbility note), architecture.md (query key fix, testing section, Fastify scoping section).

## Open questions raised

`POST /api/auth/set-pin` endpoint is missing — tier-4 profiles cannot set the family PIN in the current UI. `verify-pin` always returns 423 in a fresh dev environment because no `family_pin_hash` row exists in `system_config`. This is a gap in the auth story scope that should be addressed before the profile switcher UX is finalized.

## What the next session needs to know

- **Dev setup:** copy `.env.example` to `.env` (and `.env.test` if needed); docker compose up; `pnpm install` — then `pnpm dev` works
- **Test setup:** `familyos_test` DB must exist and be migrated/seeded (see ADR 027 setup commands)
- `plugin-loader` depends on `useAuth()` and `usePermissions()` — both are live from `@family-os/platform`
- `GET /api/profiles` is available and usable by the plugin-loader story if needed
- `AuthProvider` uses `staleTime: Infinity` — profile switches are driven by explicit `invalidateQueries({ queryKey: ['api/auth/me'] })` calls, not polling
- `POST /api/auth/set-pin` does not exist yet — the PIN can only be set by inserting directly into `system_config` (as the test suite does via `bcrypt.hash` + `prisma.systemConfig.create`)
