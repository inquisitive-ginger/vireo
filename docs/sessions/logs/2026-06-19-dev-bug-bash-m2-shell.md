# Session Log — Dev: Bug Bash (M2 chores + shell)

**Date:** 2026-06-19
**Type:** development (bug bash)
**Origin:** Issues found after the M2 chores work landed (post-M2 live review triage).

Four independent post-M2 bugs squashed. Three fixed + signed off live; the fourth
(#4) was traced to a deliberate dev-only constraint and deferred to the queued
prod SW story with the hook hardened in the meantime.

---

## What was built

### #5 — Parent self-notification on admin check-off (logic fix + tests) ✅

When a parent completed a chore **they created** (admin check-off for a child),
the parent-notification subscriber notified the parent of their own action.

- `chores.task.completed` now carries **`completedBy: request.profile.id`** (the
  actual completer — assignee, or a tier-4 admin).
- `handleParentNotification` skips when **`completedBy === createdBy`**. (Payload is
  loosely typed on the bus, so no event-schema change was needed.)
- Tests added to `chores.test.ts`:
  - parent admin check-off of their own created task → **0 notifications**;
  - a different completer (the assignee) → creator **still notified**.
- **163 API tests pass** (was 161).

### #3 — Settings cramped on mobile ✅

Profile rows scrunched on narrow viewports (avatar + name + tier pill + two text
buttons all on one line).

- `SettingsLayout`: `p-8` → `p-4 sm:p-6 md:p-8`; tightened the title/gap spacing on mobile.
- `ProfileListItem`: name now `min-w-0 truncate` instead of squishing; **Edit/Remove
  collapse to icon-only below `sm`** (labels return at `sm+`), `aria-label`s preserved;
  tier pill kept (`shrink-0`).
- Lives in `packages/ui` (shared component) — Bug Bash inherits it everywhere.
- Signed off live (mobile viewport).

### #6 — Create-task due-date field styling ✅

No format hint / no calendar affordance / picker indicator flush to the right edge;
**and (found in live review) Android also rendered a down-chevron** crowding the icon.

- First pass faded the native indicator (`opacity-0`) + overlaid a `CalendarDays`
  icon with `pr-10`. Live review showed Android still drew its own chevron.
- Final: **`appearance-none`** (kills the Android down-chevron) + **`display:none`**
  on `::-webkit-calendar-picker-indicator` / `-clear-button` / `-inner-spin-button`
  (the desktop calendar button occupies space when only faded), leaving the single
  overlaid calendar icon. Whole-field tap still calls `showPicker()`.
- Arbitrary-variant utilities emit via the shell's `@source` scan of `plugins/*/src`
  (ADR 035). Signed off live on Android.

### #4 — Push toggle stuck OFF in the tunneled PWA ⏸️ deferred (hook hardened)

**Root cause (traced live):** the tunneled PWA loads the **dev** build (`dev:tunnel`),
and `apps/shell/src/main.tsx` **deliberately unregisters the service worker + clears
caches in dev** (the stale-bundle guard shipped 2026-06-19). With no SW:

- there is no push subscription to reflect, and
- `navigator.serviceWorker.ready` **never resolves** — so the toggle hung at
  `'unknown'` (disabled, looks OFF). Reproduced in a cleared PWA and incognito (both dev).

So the toggle being OFF in the dev tunnel is a **consequence of the dev SW guard**,
not a UI reconcile bug — push cannot function in dev at all. The real user-facing fix
(push working in the installed PWA) requires a service worker, which is exactly what
the already-queued **prod SW cache-strategy** story restores.

**Shipped here (hook hardening — correct regardless of the SW story):**
`packages/platform/src/hooks/usePushSubscription.ts`

- Extracted a reusable `sync()`; **re-runs on `visibilitychange` / `focus`** so a
  long-lived installed PWA reconciles when brought back to the foreground (the prior
  hook captured state once at mount and never re-synced).
- Switched `serviceWorker.ready` → **`getRegistration()`**: `.ready` hangs forever
  when no SW is registered, pinning the toggle at a disabled `'unknown'`;
  `getRegistration()` resolves immediately to `undefined` → an accurate, interactable
  `'unsubscribed'`. In prod (SW present + subscribed) it reads `'subscribed'`.

**Decision (user, this session):** defer the user-facing fix to the prod SW story;
land the hook hardening now. A push-toggle verification step is folded into that
queue entry.

---

## Files touched

- `apps/api/src/plugins/chores.ts` — `completedBy` on the event + self-notify skip
- `apps/api/src/plugins/chores.test.ts` — 2 new subscriber tests
- `plugins/chores/src/components/CreateTaskDrawer.tsx` — date-field affordance
- `packages/ui/src/components/profile-list-item.tsx` — mobile row layout
- `packages/ui/src/components/settings-layout.tsx` — responsive page padding
- `packages/platform/src/hooks/usePushSubscription.ts` — sync/getRegistration/refocus

typecheck + lint green; 163 API tests pass. Live review: #3 (mobile), #6 (Android),
#5 (no self-notify) all signed off.

---

## Open / next session needs to know

- **#4 is not closed for the user** — push still can't work in the dev tunnel. The
  prod SW cache-strategy story must (a) restore an update-safe SW and (b) verify the
  push toggle reads ON for an enabled subscription in the installed PWA.
- Hook now uses `getRegistration()` + refocus re-sync — the prod story should confirm
  the toggle flips correctly once a SW exists.
