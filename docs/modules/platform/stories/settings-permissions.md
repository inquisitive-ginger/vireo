# Story: Settings Permissions

**Module:** platform
**Status:** ⬜ Not Started

## User story

As a family member (tier 2–3), I can reach a limited Settings view to control my own appearance preference, so I'm not locked out of personalisation.

## Background

The profile-management story introduced Settings as a tier-4-only route (`RequireTier4` guard). This was correct for the admin sections — profile CRUD, PIN reset, family name — but it unintentionally removed appearance control from tier 2–3 profiles. ADR 003 establishes that tier 2+ should have personal preference control; ADR 015/018 establishes that `TierGate` is the correct primitive for structural access control (hard ceiling, not overridable).

The fix is to gate per section inside the page rather than at the route level.

## Scope

**In:**

- `/settings` route accessible to tier 2+ (`RequireTier2` replaces `RequireTier4`)
- Family, Profiles, and Security sections gated with `TierGate min={4}` inside the page — only tier 4 sees them
- Display section visible to tier 2+ — no `TierGate` wrapper
- Settings sidebar nav item visible to tier 2+ (currently tier 4 only)
- Tier 1 (including the family pseudo-profile) redirected from `/settings` to `/`

**Out:**

- `PermissionGate`-based appearance locking (a parent revoking a child's ability to change appearance) — this is a follow-up for the permission-overrides story via `platform.preferences.appearance` in `PERMISSION_REGISTRY`
- Any new settings sections beyond what profile-management already built

## Acceptance criteria

1. Tier 2–3 profiles see a Settings nav item in the sidebar
2. `/settings` as tier 2–3 renders only the Display section; Family, Profiles, and Security are not present in the DOM
3. Tier 4 sees the full page unchanged
4. Tier 1 and the family pseudo-profile are redirected from `/settings` to `/`
5. Direct URL navigation respects the same tier rules (no flicker — guard is synchronous off the auth cache)

## Design notes

Use `TierGate` from `@family-os/platform` inside `Settings.tsx` to wrap the admin sections — do not build a new gate primitive. The existing `RequireTier4` component becomes `RequireTier2`; `SettingsNavItem` in `Sidebar.tsx` lowers its tier check accordingly.

## Dependencies

- profile-management ✅
- ADR 015, ADR 018
