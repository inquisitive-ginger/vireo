# Story: Auth & Family Profiles

**Module:** platform
**Status:** ⬜ Not Started

## User story
As a plugin developer, I can read the current user's identity and trust tier from the platform so that plugins can render tier-appropriate content.

## Scope
**In:** `platform.profiles` and `platform.permission_overrides` tables in PostgreSQL (schema per ADR 017/018); `@fastify/session` + `connect-pg-simple` session management; session stores `activeProfileId`; `POST /auth/switch` and `POST /auth/verify-pin` endpoints; `createAbility(profile, overrides)` exported from `@family-os/platform/server`; `useAuth()`, `useTier()`, and `usePermissions()` hooks exported from `@family-os/platform`; `TierGate` and `PermissionGate` components; seeded profiles for testing (at minimum: one tier-4 parent, one tier-1 child); a dev-mode profile selector to activate a profile during a session

**Out:** Login / profile-switch UX design (deferred — see notes); profile creation / editing UI; PIN authentication UX; permission grant/revoke management UI; any module-specific permissions (those belong in module stories)

## Acceptance criteria
1. `platform.profiles` table exists with columns `id`, `name`, `tier`, `pin_hash` (nullable), `avatar_url` (nullable), `created_at`
2. `platform.permission_overrides` table exists with columns `id`, `profile_id`, `action`, `subject`, `type` ('grant'|'revocation'), `granted_by` (nullable), `created_at` — table may be empty in M0
3. `useAuth()` returns the correct user object (`id`, `name`, `tier`) for the active profile
4. `useTier()` returns the correct numeric tier (1–4) for the active profile
5. `usePermissions()` returns a CASL `AppAbility` instance — `ability.can('view', 'Plugin')` returns `true` for a tier-1 profile; `ability.can('switch', 'Profile')` returns `true` for a tier-3+ profile
6. `<TierGate min={4}>` renders its children only when a tier-4 profile is active; shows nothing (or a provided fallback) otherwise
7. `<PermissionGate action="view" subject="Plugin">` renders its children only when the active profile's ability permits it
8. At least two seeded profiles are loadable: one tier-4 (parent) and one tier-1 (child)
9. `POST /auth/switch { targetProfileId }` switches the active profile when target tier ≤ current tier; returns 403 otherwise
10. Switching the active profile via the dev-mode selector updates all TierGate and PermissionGate output without a page refresh

## Dependencies
- dev-environment
- shell-skeleton

## Notes
**Login / profile-switch UX is not defined here.** The mechanism for selecting or switching the active profile (a switcher screen, PIN entry, QR code, proximity tap, etc.) belongs in the Login / Profile-Switch UX Design session. For M0, the dev-mode selector (e.g., a query parameter or a simple dropdown) is sufficient to satisfy these ACs. Do not design the real login experience in this story.

**Auth mechanism is settled (ADR 017):** `@fastify/session` + `connect-pg-simple`. The ACs are intentionally written against the concrete mechanism.

**Permission model is settled (ADR 018):** CASL `(action, subject)` model. `usePermissions()` returns an `AppAbility` instance built by `createAbility(profile, overrides)` from `@family-os/platform/server`. M0 tier baselines:

| Tier | Abilities |
|------|-----------|
| 1 | `can('view', 'Plugin')` |
| 2 | `can('view', 'Plugin')` |
| 3 | `can('view', 'Plugin')`, `can('switch', 'Profile')` |
| 4 | `can('manage', 'all')` |

The `permission_overrides` table must exist and be wired into `createAbility()` even if empty in M0 — it is the foundation for the parent permission management UI in a later story.
