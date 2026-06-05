# Story: Notification Infrastructure

**Module:** platform
**Status:** ⬜ Not Started

## User story
As a user, I receive in-app notifications from the platform so that important events surface without interrupting what I'm doing.

## Scope
**In:**
- `platform.notify({ title, body?, variant, priority?, actions? })` exported from `@family-os/platform`
- Sonner toast at bottom-right: max 3 visible, queued; auto-dismiss per variant (success 3s, info 5s, warning 8s, error persistent)
- Notification tray: bell icon in sidebar between nav items and Settings, visible to tier 2+ only
- Tray panel slides in from right (`--duration-slow`, `--ease-in-out`), dims main content behind it
- Bell badge: unread count + max-severity color (`--accent` for info/success, `--warning`, `--error`)
- Notification history: `notifications` table in platform schema, last 50 per user pruned on insert, newest first
- Opening the tray marks all notifications as read and resets the badge
- `platform.notify()` persists to tray for tier 2+ profiles; toasts for all tiers
- `Toast`, `NotificationTray`, `NotificationItem`, and `BellBadge` exported from `packages/ui` with Storybook stories

**Out:** Web Push delivery (web-push story); per-plugin notification preferences; deduplication or batching

## Acceptance criteria
1. Calling `platform.notify({ title: 'Test', variant: 'success' })` renders a Sonner toast at bottom-right that auto-dismisses after 3s
2. `variant: 'error'` toasts do not auto-dismiss and must be explicitly dismissed
3. A maximum of 3 toasts are visible simultaneously; additional notifications queue and appear as earlier toasts dismiss
4. For tier 2+ profiles, each notification is persisted to the DB and appears in the tray panel, newest first
5. The bell icon shows an unread count badge; badge color reflects max severity across unread items: `--accent` (info/success), `--warning` (warning), `--error` (error)
6. Tapping the bell opens the tray panel with a right-side slide animation (`--duration-slow`, `--ease-in-out`); the main content dims behind it
7. Opening the tray marks all notifications as read and clears the badge
8. The bell icon and tray are not rendered for tier 1 profiles
9. The tray retains the last 50 notifications per user; entries beyond 50 are pruned on insert
10. `platform.notify()` is callable from any plugin via `@family-os/platform` and produces the correct toast and tray behavior
11. `Toast`, `NotificationTray`, `NotificationItem`, and `BellBadge` are exported from `packages/ui` with Storybook stories covering key states (variants, empty tray, badge severity levels)

## Dependencies
- none

## Notes
New platform DB table: `notifications { id uuid PK, profile_id uuid FK → platform.profiles, title text, body text nullable, variant text, priority text, is_read boolean default false, created_at timestamptz }`. Motion tokens (`--duration-*`, `--ease-*`) are added in the home-surface story and referenced here for tray animation timing.
