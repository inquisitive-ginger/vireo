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

## Prisma 7 notes (next session should know)

Prisma 7 changed the connection config model:
- `url` is removed from `schema.prisma`'s datasource block
- Connection is configured in `prisma.config.ts` via `datasource.url` (for CLI) and `migrate.adapter` (for runtime)
- `PrismaClient` must receive an adapter: `new PrismaClient({ adapter: new PrismaPg(pool) })`
- Seed is configured under `migrations.seed` in `prisma.config.ts`, not `package.json`
- `multiSchema` preview feature is deprecated; multi-schema works without it in Prisma 7

## Open questions raised

None.

## What the next session needs to know

- Run `pnpm --filter @family-os/platform exec prisma db seed` with `DATABASE_URL` set before starting if the DB has been reset
- `plugin-loader` depends on `useAuth()` and `usePermissions()` — both are now live from `@family-os/platform`
- `GET /profiles` endpoint is available and usable by the plugin-loader story if needed
- The shell's `AuthProvider` uses `staleTime: Infinity` — profile switches are driven by explicit `invalidateQueries(['auth/me'])` calls, not polling
