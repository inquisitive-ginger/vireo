# Session Log — Dev: Permission Overrides

**Date:** 2026-06-05 → 2026-06-06
**Type:** Development
**Story:** `docs/modules/platform/stories/permission-overrides.md`
**Branch:** `dev/platform-permission-overrides`
**PR:** #10

---

## What was built

### API routes (`apps/api/src/plugins/profiles.ts`)

- `GET /api/profiles/:id/permissions` — returns merged capability list (tier baseline + overrides) with `{ key, label, description, active, overrideStatus: 'Granted' | 'Revoked' | 'None' }` per permission
- `POST /api/profiles/:id/permissions` — creates a permission override (grant or revoke)
- `DELETE /api/profiles/:id/permissions/:permissionId` — removes an override, restoring baseline

**Tier change clears overrides atomically:** `PATCH /profiles/:id` wraps `deleteMany(overrides) + profile.update` in a Prisma `$transaction` when the tier changes.

**Last-admin guard:** demoting the only tier-4 profile returns 409 `{ error: 'At least one administrator (tier 4) must remain' }`.

### UI components (`packages/ui`)

- `Switch` — Radix `@radix-ui/react-switch` with `role="switch"` and `aria-checked`
- `Drawer` — right-side slide-over panel with Close button
- `PermissionToggleItem` — wraps Switch + label + override badge (`Granted` / `Revoked`); wrapped in `React.memo` to prevent unnecessary re-renders
- `PermissionToggleList` — renders a list of `PermissionToggleItem` components

### Profile Edit Drawer (`apps/shell/src/pages/Settings.tsx`)

- `ProfileEditFields` — name field with autosave on blur + animated checkmark
- `ProfileRoleField` — tier buttons (Little one / Teen / Grown-up / Parent); optimistic state, reverts + shows error on API failure; invalidates permissions query on tier change
- `CapabilitiesPanel` — fetches `GET /permissions`, renders `PermissionToggleList`; hidden for own profile (no self-override editing)
- `ProfileEditDrawer` — two visual sections: name (white) / "ROLE & CAPABILITIES" section (hard `border-t-2` stop), role buttons sit directly under the section header, permission toggles separated by a lighter `border-t`

**Switch re-render fix:** replaced `isPending: boolean` (all items dim) with `pendingKey: string | null` (only the toggled item dims). Passed `onToggle` directly without an inline wrapper so `React.memo` sees stable references.

### `dev/reset` fix (`apps/api/src/plugins/dev.ts`)

`POST /api/dev/reset` now seeds `default_layout_tier_1_2` and `default_layout_tier_3_4` system config keys and calls `seedWidgetLayout('family', 1)` for the pseudo-profile. Without this, `seedWidgetLayout` returned early (no config found), leaving all profiles with empty grids and the E2E onboarding test failing on a fresh DB.

---

## Tests

### Unit tests (`apps/api/src/plugins/profiles.test.ts`)

79 tests passing. New coverage:

- `PATCH`: 409 for last admin, clears overrides on tier change, no-op on name-only change
- `GET /permissions`: 4 tests (tier baseline, grants, revocations, 404)
- `POST /permissions`: 6 tests (create grant, create revoke, idempotent upsert, 400 on bad key)
- `DELETE /permissions/:id`: 4 tests (delete grant, delete revoke, 404, wrong profile)

### E2E tests (`packages/e2e/tests/permission-overrides.spec.ts`)

8 new tests — serial, share one `dev/reset` via onboarding dependency:

- Capabilities panel: non-own shows switches; own shows role buttons only
- Permission toggles: revoke (Revoked badge, aria-checked false); restore; grant (Granted badge, aria-checked true); remove grant
- Role change: changing tier clears overrides; last-admin prevention shows error

Also fixed `profile-management.spec.ts`: "can edit a profile name" clicked `getByRole('button', { name: 'Save changes' })` which no longer exists after the drawer moved to autosave; updated to `nameInput.blur()` + close drawer.

**Final E2E results: 48 passed, 0 failed.**

---

## What was sent back

Nothing.

---

## Open questions

None — all acceptance criteria met.

---

## What the next session needs to know

- `dev/reset` now seeds layout system config + family profile layout — safe for any E2E test that navigates to `/` without a session
- Permission CASL baselines: tier 1/2 → `platform.plugin.view`; tier 3 → + `platform.profile.switch`; tier 4 → manage all
- Own profile (`activeProfileId === targetId`) never shows capability switches — checked in `CapabilitiesPanel` and guarded at the route level
- `PermissionToggleItem` uses `React.memo` — pass stable callback references; the `onToggle` signature is `(key: string) => void`
