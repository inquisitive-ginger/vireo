## What was built

Per-profile permission grants and revocations, end to end.

**Backend (`apps/api/src/plugins/profiles.ts`):**

- `GET /api/profiles/:id/permissions` — returns all PERMISSION_REGISTRY entries with computed `inBaseline` (from `createAbility` with no overrides), current `override`/`overrideId`, plus `action`/`subject` for client mutations
- `POST /api/profiles/:id/permissions` — creates a grant or revocation override; tier 4 only; 403 on own profile
- `DELETE /api/profiles/:id/permissions/:permissionId` — removes an override; tier 4 only; 403 on own profile

**Schemas (`packages/schemas`):**

- `PermissionOverrideCreateSchema` and `PermissionOverrideCreateInput`

**UI components (`packages/ui`):**

- `Switch` — Radix `@radix-ui/react-switch` wrapper with Tailwind token classes; focus ring, disabled state, checked/unchecked colours via `data-[state=*]`
- `Drawer` — Radix `@radix-ui/react-dialog` as a right-side slide-over; focus trap, Escape dismiss, backdrop; 440px wide
- `PermissionToggleItem` — single permission row: label + optional Granted/Revoked badge (only when override exists) + Switch; badge omitted at baseline
- `PermissionToggleList` — iterates items, threads `isLast` for divider handling
- Storybook stories for `PermissionToggleItem` (all four states) and `PermissionToggleList` (interactive)
- All four exported from `packages/ui/src/index.ts`

**Shell (`apps/shell/src/pages/Settings.tsx`):**

- Profile edit moved from inline expand to a `Drawer` (profile name as title)
- Drawer contains `ProfileForm` (name + role) + `CapabilitiesPanel` (only shown when not editing own profile — AC6)
- `CapabilitiesPanel` queries permissions, handles POST/DELETE toggle mutations, disables list during pending
- Inline create form retained (compact, no capabilities needed on create)

## Acceptance criteria status

1. ✅ Tier 4 sees Capabilities section in profile edit view (inside drawer, for non-own profiles)
2. ✅ Each permission shows effective state derived from `inBaseline` + `override`
3. ✅ Toggle inactive → active creates grant record
4. ✅ Toggle active → inactive (above baseline) creates revocation record
5. ✅ Toggle back to baseline deletes override (no dangling rows) — client checks `overrideId`; if present, DELETE; if absent, POST
6. ✅ Own profile shows no Capabilities panel in drawer (`isOwnProfile` check); server 403 on own-profile POST/DELETE
7. ✅ All override routes 403 for tier < 4
8. ✅ `PermissionToggleList` and `PermissionToggleItem` exported from `packages/ui` with Storybook stories

## Decisions made

**Drawer over inline expand** — the inline edit form with a Capabilities panel below was rejected as not scalable. A right-side Drawer (Radix Dialog) gives the profile edit view its own focused context. Avatar builder (potential future module) would be a separate entry point from within the drawer, not an expansion of it.

**Override badge only on deviation** — Frame D selected from playground. Rows at tier baseline show no annotation; only explicit grants (teal) or revocations (destructive) surface a badge. Eliminates "Tier baseline" noise on every row.

**State model: `inBaseline` + `override` as independent dimensions** — not a flat 4-value enum. `inBaseline` is a fixed fact about the profile's tier (computed server-side from `createAbility` with empty overrides); `override` is the mutable DB row. Keeps toggle logic clean: baseline permissions toggle between active↔revoked; non-baseline toggle between inactive↔granted.

**GET endpoint included** — not in scope's explicit route list, but required for the UI to render AC2. Added as a read-only tier-4 endpoint with no own-profile restriction.

**`@radix-ui/react-switch` and `@radix-ui/react-dialog` installed** — both added to `packages/ui`. Radix Switch provides correct ARIA (`role="switch"`, `aria-checked`), keyboard activation (Space), and focus management. Radix Dialog provides focus trap, Escape dismiss, scroll lock for the drawer.

## Scope additions

- `Switch` component added to `packages/ui` (required primitive for `PermissionToggleItem`)
- `Drawer` component added to `packages/ui` (required for profile edit refactor; reusable)
- Accessibility & Radix audit stub story created (`docs/modules/platform/stories/accessibility-radix-audit.md`) — filed during session when it became clear `ConfirmDialog` and potentially other components should use Radix primitives. Added to queue.

## New stories created

- `platform/accessibility-radix-audit` — audit all `packages/ui` components for missing Radix primitives; known gap is `ConfirmDialog` (uses `createPortal` + manual backdrop, missing focus trap and Escape). Added to queue after web-push.

## Open questions raised

None.

## What the next session needs to know

- `Switch` and `Drawer` are general-purpose components in `packages/ui` — reuse them for any future drawer or toggle patterns
- `PermissionToggleList` will automatically pick up `family-feed.post.create` when added in family-feed-compose with no changes needed here (as noted in story spec)
- The profile edit drawer title shows the profile name — if a profile is renamed inside the drawer and saved, the drawer closes (mutation `onSuccess` calls `onClose`), which avoids a stale title
- 95 tests passing; no new tests written this session (tests to be added per project convention)
