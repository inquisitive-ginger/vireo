# Session Log: M1 Dev — Profile Management

**Date:** 2026-06-06
**Type:** Development
**Story:** `docs/modules/platform/stories/profile-management.md`
**Branch:** `dev/platform-profile-management`

---

## What was built

### API (`apps/api`)

- `POST /api/profiles` — create profile, seeds widget layout via extracted `seedWidgetLayout()`
- `PATCH /api/profiles/:id` — rename profile
- `DELETE /api/profiles/:id` — remove profile + cascade widget layout
- `POST /api/auth/pin` — set/change family PIN (hash stored in `system_config`)
- `GET /api/auth/pin-exists` — returns `{ exists: boolean }`, tier 4 guard
- `POST /api/auth/pin/check` — verify current PIN without changing it; enables immediate wrong-PIN feedback
- `PATCH /api/settings/family-name` — upserts `family_name` in `system_config`, tier 4 guard
- `GET /api/auth/me` — extended to include `familyName` from `system_config`
- `apps/api/src/lib/seed-layout.ts` — extracted `seedWidgetLayout()` shared helper

### Shell (`apps/shell`)

- `ProfileGrid.tsx` — replaces `DevProfileSelector`; switchable profiles exclude active + family; tier-4 switch requires family PIN entry inline; family view entry uses `ProfileAvatar` + shows actual family name
- `RequireTier4.tsx` — route guard; redirects tier < 4 to `/`
- `Sidebar.tsx` — `ProfileChip` shows family name when family profile active; `SettingsNavItem` (renamed from Tier4NavItem) pinned to bottom with divider; `gap-3` between avatar and name label
- `Settings.tsx` (rewrite) — `FamilySection` (inline family name edit), `PinResetRow` (immediate current-PIN check, no 'done' flash), `AppearanceRow` (optimistic updates, no `isPending` flicker); `RequireTier4` route guard wired in `main.tsx`

### Packages

- `packages/ui` — `SettingsLayout`, `SettingsSection`, `ProfileListItem`, `ConfirmDialog` (portal-based alertdialog), `PinInput` (sm/md sizes); all with Storybook stories
- `packages/ui` — `typography.stories.tsx` — heading token specimens (`page-title`, `section-label`) + scale reference
- `packages/platform` — `AuthUser` type extended with `familyName?: string | null`; `AuthLoader` maps it from `/auth/me`
- `packages/schemas` — `CheckPinSchema`, `FamilyNameUpdateSchema` and their input types

### Tests

- `apps/api/src/plugins/profiles.test.ts` — 62 tests total; covers all new endpoints (`pin-exists`, `pin/check`, `family-name`)
- `packages/e2e/tests/profile-management.spec.ts` — serial E2E spec: route guard, family name edit, profile CRUD (create/edit/delete), PIN reset (immediate error + correct flow)
- `packages/e2e/tests/home-surface.spec.ts` — removed test that navigated to `/settings` without auth (broken by `RequireTier4`)

### Docs

- `docs/modules/platform/progress.md` — profile-management → ✅ Done; settings-permissions and typography-scale rows added
- `docs/modules/platform/stories/settings-permissions.md` — new story spec
- `docs/modules/platform/stories/typography-scale.md` — new story spec
- `docs/sessions/queue.md` — settings-permissions (#1), typography-scale (#2), profile-management-tests (#3) added

---

## Key decisions

- **`POST /auth/pin/check`** added for immediate current-PIN validation — avoids the UX problem of only discovering a wrong PIN after entering new + confirm
- **`RequireTier4` route guard** wraps `/settings` in the router; selecting family profile from ProfileGrid while on `/settings` navigates away correctly
- **`SettingsNavItem`** (renamed from `Tier4NavItem`) — name should reflect what it does, not the gate it lives behind
- **PIN reset has no 'done' state** — success closes immediately; no redundant confirmation flash
- **Optimistic updates on appearance toggle** — `isPending` removed entirely from UI conditions; `onMutate`/`onError`/`onSettled` pattern keeps state consistent without visible flicker
- **`ConfirmDialog` uses `createPortal`** to `document.body` — avoids z-index and overflow clipping issues from Settings layout
- **CASL vs TierGate for settings-permissions** — confirmed `TierGate` is correct (hard structural ceiling per ADR 015/018); `PermissionGate` is for overridable capabilities, deferred to permission-overrides story
- **Typography base size open question** — 14px was organic; 16px + major second (×1.125) proposed as more deliberate starting point; captured in typography-scale story spec for the design session to resolve

---

## Open questions raised

- **14px vs 16px body size** — existing components sit at 14px organically; typography-scale design session should decide with rationale before formalising scale
- **settings-permissions regression** — tier 2–3 profiles now have no access to appearance settings (previously had via Settings page); settings-permissions story is #1 in queue

---

## What the next session needs to know

- **settings-permissions (#1)**: `RequireTier4` currently blocks all non-tier-4 from `/settings`; the story spec (`docs/modules/platform/stories/settings-permissions.md`) describes tiered access: tier 2–3 get a limited view (Display only), tier 4 retains full access, tier 1 continues to redirect
- **profile-management-tests (#3)**: E2E and API tests were written this session — this queue item is effectively done; remove or mark complete when the queue is next updated
- PIN is `1234` for "E2E Parent" after onboarding; E2E PIN reset test changes it to `5678` and does not reset it back (onboarding project re-seeds on next full run)
