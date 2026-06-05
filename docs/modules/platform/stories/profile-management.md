# Story: Profile Management

**Module:** platform
**Status:** ⬜ Not Started

## User story
As a parent, I can manage family member profiles from a settings page so the family's accounts stay current.

## Scope
**In:**
- Settings route accessible via sidebar to tier 4 only
- Profile list showing all non-family profiles with name, avatar, and tier
- Create profile: name, tier (1–4), initials avatar
- Edit profile: name, tier
- Delete profile: confirmation dialog; session reverts to family pseudo-profile if the active profile is deleted
- Family PIN reset: current PIN verified before new 4-digit PIN accepted; if no PIN set, prompts for new PIN directly
- React Hook Form + Zod; profile edit and PIN reset schemas from `packages/schemas`; server routes validate against same schemas
- `SettingsLayout`, `ProfileListItem`, and `ConfirmDialog` exported from `packages/ui` with Storybook stories

**Out:** Avatar image file upload (initials fallback only in M1); permission overrides (permission-overrides story); profile archival or deactivation

## Acceptance criteria
1. Tier 4 profiles see a Settings entry in the sidebar; tier 1–3 profiles do not
2. The profile list shows all non-family profiles with name, avatar, and tier; the family pseudo-profile is not shown and cannot be edited or deleted
3. A new profile can be created with a name and tier (1–4); it appears in the profile grid immediately
4. An existing profile's name and tier can be edited; changes reflect in the profile grid on next switch
5. Deleting a profile requires a confirmation dialog; if the deleted profile is currently active the session reverts to the family pseudo-profile
6. The family PIN can be reset from Settings: the current PIN must be verified before a new one is accepted
7. If no PIN is set the PIN reset flow prompts for a new PIN without requiring a current one
8. All profile management API routes return 403 for callers with tier < 4
9. Form fields show inline validation errors (name required, PIN must be exactly 4 digits) before the server is hit
10. `SettingsLayout`, `ProfileListItem`, and `ConfirmDialog` are exported from `packages/ui` with Storybook stories

## Dependencies
- none

## Notes
Tier changes take effect on the next profile switch — the active session is not invalidated mid-session. The PIN entry component introduced in the family-onboarding story is reused here.
