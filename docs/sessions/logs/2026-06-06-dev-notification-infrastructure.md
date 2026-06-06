# Session Log — Notification Infrastructure

**Date:** 2026-06-06
**Type:** Development
**Story:** platform/notification-infrastructure

---

## What was built

### DB

- `Notification` model added to `packages/platform/prisma/schema.prisma` (id, profile_id FK, title, body?, variant, priority, is_read, created_at)
- Migration `20260606200420_add_notifications_table` applied to dev and test DBs

### API (`apps/api/src/plugins/notifications.ts`)

- `POST /api/notifications` — persists for tier 2+; silently succeeds for tier 1; prunes to last 50 on insert
- `GET /api/notifications` — returns profile's notifications newest first; 403 for tier 1
- `GET /api/notifications/unread` — returns `{ unreadCount, maxSeverity }` (severity priority: error > warning > info/success)
- `POST /api/notifications/read` — marks all profile notifications as read

### Platform package (`packages/platform`)

- `useNotify()` hook exported from `@family-os/platform`
- Shows Sonner toast with variant-appropriate timing (success 3s, info 5s, warning 8s, error persistent)
- Calls `POST /api/notifications` via `useMutation`; invalidates `['notifications/unread']` on success
- `NotifyPayload`, `NotifyVariant`, `NotificationRecord` types exported

### UI package (`packages/ui`)

- `Toast` — configured `<Toaster>` from Sonner (bottom-right, max 3 visible, CSS token styling)
- `BellBadge` — extends the existing `Button` primitive; shows count + severity-colored badge; aria-label reflects unread count
- `NotificationItem` — variant icon + title + optional body + relative timestamp
- `NotificationTray` — Radix Dialog with Portal; `animate-tray-in` keyframe (300ms ease-in-out); backdrop overlay; empty state; loading state
- `animate-tray-in` keyframe added to `packages/ui/src/styles.css`
- All four components exported from `packages/ui/src/index.ts`
- Storybook stories in `notification.stories.tsx` covering all variants, badge severities, empty tray, loading state

### Shell

- `<Toast />` added to `App.tsx`
- `NotificationBell` integrated into `Sidebar.tsx` (tier 2+ only, between nav and Settings)
  - Fetches unread count via `useQuery(['notifications/unread'])`
  - Tray notifications fetched lazily when open
  - `window.addEventListener('platform:notification')` retained as fallback badge refresh path for notify() calls from other contexts

### Tests

- 17 new API tests in `notifications.test.ts` covering: persist/skip by tier, body persistence, 50-item pruning, newest-first ordering, per-profile isolation, unread count, severity priority (error > warning > info/success), mark-all-read cross-profile isolation
- 14 new UI tests (7 BellBadge + 7 NotificationTray) via RTL
- Fixed `setup.test.ts` and `profiles.test.ts` `beforeEach` to delete notifications before profiles (FK constraint)

---

## Acceptance criteria status

1. ✅ `notify({ variant: 'success' })` shows Sonner toast, auto-dismisses in 3s
2. ✅ `variant: 'error'` toast is persistent (Sonner `duration: Infinity`)
3. ✅ Max 3 visible via Sonner `visibleToasts={3}`
4. ✅ Tier 2+ notifications persisted to DB and shown in tray newest first
5. ✅ Bell badge shows unread count; color reflects max severity
6. ✅ Tray slides from right with `--duration-slow` / `--ease-in-out`; backdrop dims main content
7. ✅ Opening tray fires `POST /notifications/read`; badge invalidated
8. ✅ Bell + tray not rendered for tier 1 (`if (tier < 2) return null`)
9. ✅ 50-item pruning on insert (verified in tests)
10. ✅ `useNotify()` exported from `@family-os/platform`; callable from any plugin React component
11. ✅ `Toast`, `NotificationTray`, `NotificationItem`, `BellBadge` exported from `packages/ui` with Storybook stories

---

## Decisions made

- **`useNotify()` hook instead of plain `notify()` function** — uses `useMutation` and `useQueryClient().invalidateQueries()` for clean TanStack Query integration; no window events needed for cache invalidation. Plugins call `const notify = useNotify()`.
- **`NotifyVariant` defined in `packages/ui`** — avoids layering violation (`packages/ui` cannot import from `@family-os/platform`). Both packages define the same string union type independently; TypeScript structural typing ensures compatibility.
- **`BellBadge` extends `Button` primitive** — reuses focus ring, disabled state, and hover behaviour via `variant="ghost"` + className overrides.
- **`NotificationTray` uses `@radix-ui/react-dialog`** — consistent with `Drawer`; provides Portal, focus trap, and Escape-key dismiss without additional dependencies.
- **Tray fetched lazily** (`enabled: trayOpen`) — avoids background polling; marks as read on open and refetches both notification list and unread count.

---

## Scope additions

None — scope matched the story exactly.

---

## New stories created

None.

---

## Open questions raised

- **Sonner dark mode**: `Toast` uses `theme="system"` which follows `prefers-color-scheme`; the manual dark mode override (`data-theme` attribute) is not yet synced to Sonner's theme prop. Toast appearance may not match the app theme when a user has manually toggled dark mode. Low priority for M1 — add a follow-up if it becomes a visible issue.

---

## What the next session needs to know

- `useNotify()` is the standard notification API for all future plugins and shell code.
- The `notifications` table is in the `platform` schema and is ready for use.
- E2E tests for the notification flow are not yet written (Playwright). Queue a test addendum if web-push session doesn't cover it.
- Next: M1 Dev: pwa-installable.
