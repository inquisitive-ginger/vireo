# Story: Appearance Preference Gate

**Module:** platform
**Status:** ⬜ Not Started

## User story

As a parent, I can revoke appearance control from specific child profiles so the system's visual settings reflect family-level decisions rather than individual preferences.

## Scope

**In:**

- `platform.preferences.appearance` added to `PERMISSION_REGISTRY` in `@family-os/platform/types`
- Tier baseline: all tiers 1–4 include this permission (toggle is on by default for every profile)
- Dark mode toggle in Settings wrapped with `PermissionGate` — absent (not disabled) when the active profile lacks the permission
- A tier 4 parent can revoke or restore the permission per-profile via the existing permission-overrides UI

**Out:** Any other preference controls; profile-specific appearance settings beyond dark mode

## Acceptance criteria

1. `platform.preferences.appearance` exists in `PERMISSION_REGISTRY` with a label and correct `module`, `action`, `subject` fields
2. The dark mode toggle in Settings is absent for any profile whose `platform.preferences.appearance` permission has been explicitly revoked
3. The toggle is present for all profiles that have not had the permission revoked (tier baseline includes it)
4. A tier 4 parent can revoke and restore the permission for a tier 2–3 profile via the permission overrides drawer; the toggle disappears/reappears on next Settings load for the affected profile

## Dependencies

- settings-permissions
- permission-overrides

## Notes

Surfaced in the 2026-06-09 audit as a deferred gap from the settings-permissions story. Small addendum — the only deliverables are one new entry in `PERMISSION_REGISTRY` and a `PermissionGate` wrapper around the existing dark mode toggle in Settings.
