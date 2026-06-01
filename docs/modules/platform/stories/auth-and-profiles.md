# Story: Auth & Family Profiles

**Module:** platform
**Status:** ✅ Done

## User story
As a plugin developer, I can read the current user's identity and trust tier from the platform so that plugins can render tier-appropriate content.

## Scope
**In:** `platform.profiles`, `platform.permission_overrides`, and `platform.system_config` tables in PostgreSQL (schema per ADR 017/018/021); `@fastify/session` + `connect-pg-simple` session management; session stores `activeProfileId`; `POST /auth/switch` and `POST /auth/verify-pin` endpoints; `createAbility(profile, overrides)` exported from `@family-os/platform/server`; `useAuth()`, `useTier()`, `usePermissions()`, and `useEventBus()` hooks exported from `@family-os/platform` (`useEventBus` promoted from the dev hook in `apps/shell` to the full `{ publish, subscribe }` platform API per architecture.md); `TierGate` and `PermissionGate` components; seeded profiles for testing (at minimum: one tier-4 parent, one tier-1 child, and the `family` pseudo-profile); a dev-mode profile selector to activate a profile during a session

**Out:** Login / profile-switch UX design (deferred — see notes); profile creation / editing UI; PIN authentication UX; permission grant/revoke management UI; any module-specific permissions (those belong in module stories)

## Acceptance criteria
1. `platform.profiles` table exists with columns `id`, `name`, `tier`, `avatar_url` (nullable), `created_at` — no `pin_hash` column (see ADR 021)
2. `platform.permission_overrides` table exists with columns `id`, `profile_id`, `action`, `subject`, `type` ('grant'|'revocation'), `granted_by` (nullable), `created_at` — table may be empty in M0
3. `platform.system_config` table exists with columns `key` (text PK), `value` (jsonb), `updated_by` (FK → profiles, nullable), `updated_at`
4. `useAuth()` returns the correct user object (`id`, `name`, `tier`) for the active profile
5. `useTier()` returns the correct numeric tier (1–4) for the active profile
6. `usePermissions()` returns a CASL `AppAbility` instance — `ability.can('view', 'platform.Plugin')` returns `true` for a tier-1 profile; `ability.can('switch', 'platform.Profile')` returns `true` for a tier-3+ profile
7. `<TierGate min={4}>` renders its children only when a tier-4 profile is active; shows nothing (or a provided fallback) otherwise
8. `<PermissionGate action="view" subject="platform.Plugin">` renders its children only when the active profile's ability permits it
9. Three seeded profiles exist: the `family` pseudo-profile (`id: 'family'`, tier 1, no write permissions), one tier-4 parent, one tier-1 child
10. `POST /auth/switch { targetProfileId }` switches the active profile when target tier ≤ current tier; returns 403 otherwise
11. `POST /auth/verify-pin { pin, targetProfileId }` verifies `pin` against `system_config` where `key = 'family_pin_hash'`; returns 423 if no PIN has been set; returns 403 on mismatch
12. Switching the active profile via the dev-mode selector updates all TierGate and PermissionGate output without a page refresh

## Dependencies
- dev-environment
- shell-skeleton

## Notes
**Login / profile-switch UX is not defined here.** The mechanism for selecting or switching the active profile (a switcher screen, PIN entry, QR code, proximity tap, etc.) belongs in the Login / Profile-Switch UX Design session. For M0, the dev-mode selector (e.g., a query parameter or a simple dropdown) is sufficient to satisfy these ACs. Do not design the real login experience in this story.

**Auth mechanism is settled (ADR 017, amended by ADR 021):** `@fastify/session` + `connect-pg-simple`. PIN verification checks against the global `system_config` family PIN, not a per-profile hash. The ACs are intentionally written against the concrete mechanism.

**Permission model is settled (ADR 018):** CASL `(action, subject)` model. `usePermissions()` returns an `AppAbility` instance built by `createAbility(profile, overrides)` from `@family-os/platform/server`. M0 tier baselines:

| Tier | Abilities |
|------|-----------|
| 1 | `can('view', 'platform.Plugin')` |
| 2 | `can('view', 'platform.Plugin')` |
| 3 | `can('view', 'platform.Plugin')`, `can('switch', 'platform.Profile')` |
| 4 | `can('manage', 'all')` |

The `permission_overrides` table must exist and be wired into `createAbility()` even if empty in M0 — it is the foundation for the parent permission management UI in a later story.
