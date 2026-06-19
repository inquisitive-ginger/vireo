# Kickoff — Dev: Bug Bash (M2 chores + shell)

**Type:** development (bug bash)
**Origin:** Issues found after the M2 chores work landed (2026-06-19).

Squash the batch below. Each is independent; verify fixes live (mobile + tunneled
PWA where relevant). Write tests for the logic fixes (#5 especially).

## Bugs

### 1. Settings view smooshed horizontally on mobile (#3)

Profile items render scrunched / cramped on a mobile viewport.

- **Where:** `apps/shell/src/pages/Settings.tsx` (+ any profile-row component)
- **Fix:** responsive layout pass for narrow widths; apply the mobile-shell layout pattern (see `dev-mobile-shell-layout` session) where it overlaps.

### 2. Push toggle stuck OFF in the tunneled PWA for an enabled user (#4)

Zach has push enabled and notifications are arriving, but the settings toggle
shows OFF.

- **Likely cause:** the toggle derives state from `profile.pushEnabled` / a query that's out of sync with the actual `pushSubscription` — or the subscription exists but the flag/UI state isn't reconciled in the PWA context.
- **Where:** push toggle in Settings + `packages/platform/src/hooks/usePushSubscription.ts`; check how toggle state is read vs. the real subscription.
- **Fix:** reconcile the toggle with the actual subscription/enabled state.

### 3. Parent completing a child's chore self-notifies (#5)

When a **parent** completes a chore they created (admin check-off for a child),
the parent-notification subscriber notifies the parent (the creator) — their own
action. Not useful.

- **Where:** `apps/api/src/plugins/chores.ts` (`handleParentNotification`); `chores.task.completed` event payload.
- **Fix:** carry the **completer/actor** profile on the `chores.task.completed` event and skip the notification when `actor === createdBy`. Add a test.

### 4. Due-date field styling on the create-task form (#6)

No `mm/dd/yyyy` placeholder or calendar icon; the chevron is smashed against the
right edge.

- **Where:** `plugins/chores/src/components/CreateTaskDrawer.tsx` (date input).
- **Fix:** native date-input styling — placeholder/format hint, calendar affordance, padding so the picker indicator isn't flush to the edge.

## Required outputs

- All four fixed and verified live (mobile + tunneled PWA where relevant)
- Tests for the logic fix (#5: no self-notification; still notifies on a kid-completed task)
- Session log; this kickoff deleted
