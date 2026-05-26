# Story: Auth & Family Profiles

**Module:** platform
**Status:** ⬜ Not Started

## User story
As a plugin developer, I can read the current user's identity and trust tier from the platform so that plugins can render tier-appropriate content.

## Scope
**In:** Family profiles stored in PostgreSQL (id, name, tier level); auth context loaded at session start; `useAuth()`, `useTier()`, and `usePermissions()` hooks exported from `@family-os/platform` and return correct values; `TierGate` and `PermissionGate` render conditionally based on effective permissions; seeded profiles for testing (at minimum: one tier-4 parent, one tier-1 child); a minimal M0 mechanism to activate a profile during a session (UX TBD — see notes)

**Out:** Login / profile-switch UX design (deferred — see notes); profile creation / editing UI; password or PIN authentication; permission grant/revoke management UI; any module-specific permissions (those belong in module stories)

## Acceptance criteria
1. Family profiles exist in the database with a tier level (1–4) and are loadable by the platform
2. `useAuth()` returns the correct user object (id, name, tier) for the active profile
3. `useTier()` returns the correct numeric tier (1–4) for the active profile
4. `usePermissions()` returns the tier's baseline effective permissions — `can('some.permission')` returns a boolean
5. `<TierGate min={4}>` renders its children only when a tier-4 profile is active; shows nothing (or a provided fallback) otherwise
6. `<PermissionGate permission="x">` renders its children only when `x` is in the active profile's effective permission set
7. At least two seeded profiles are loadable: one tier-4 (parent) and one tier-1 (child)
8. Switching the active profile updates all TierGate and PermissionGate output without a page refresh

## Dependencies
- dev-environment
- shell-skeleton

## Notes
**Login / profile-switch UX is not defined here.** The mechanism for selecting or switching the active profile (a switcher screen, PIN entry, QR code, proximity tap, etc.) is a design question that belongs in a dedicated design session. For M0, the simplest workable approach (e.g., a dev-mode selector, a query parameter, or a hardcoded default) is sufficient to satisfy these ACs. Do not design the real login experience in this story.

**Also blocked on M0 Architecture session** — the auth identity mechanism (JWT, Lucia, server-side sessions) must be resolved before implementation. The ACs are mechanism-agnostic.

The permission string registry (full enumeration of `module.noun.verb` strings) is deferred to M0 Architecture. Tier baselines for this story can use a small representative set.
