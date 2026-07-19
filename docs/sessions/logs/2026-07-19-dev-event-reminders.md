# 2026-07-19 — Dev: Event Reminders (calendar story 6, PR #41)

**M3 MVP-complete.** The last MVP story shipped — the family can retire Google's
event notifications.

## What was built

- **Reminder scheduler** (`apps/api/src/lib/reminder-scheduler.ts`) — a 60s in-process
  poll started in the calendar plugin (off under `NODE_ENV=test`). Each tick expands the
  occurrences whose start ∈ `(now, now + reminderMinutes]` and fires any not already in a
  new `calendar.reminder_log` ledger, routing through the shared `notify()` at priority
  `alert`.
- **Audience** — owned/shared event → attendees **∪ every tier-4 parent**; Family event
  (0 attendees) → everyone. `notify()` applies the tier-2+/push gate.
- **Edit re-arm** — the PATCH route clears an event's `reminder_log` rows when `startsAt`
  or `reminderMinutes` changes (the ledger is keyed by occurrence _date_, so a same-day
  move would otherwise stay suppressed). Title/location-only edits leave it.
- **Migration** `calendar.reminder_log` + `ReminderLog` model.
- 14 tests (11 scheduler + 3 PATCH re-arm). Full API suite green (268), typecheck/lint clean.

## Acceptance criteria status

All 7 pass. Verified live end-to-end against the running server (fires on the tick,
correct audience, exactly-once); reviewer confirmed the edit re-arm live.
**AC1 Web Push caveat:** the routing to push is correct and tested, but native push
delivery could not be exercised over the **dev tunnel** — the dev build tears down the
service worker on load, so no push subscription can persist (DB had zero rows; the toggle
read "ON" off a stale browser-local subscription). This is the already-tracked SW/prod-cache
story, independent of the reminder path. To verify native push, use the preview (prod)
build tunnel.

## Decisions made

- **ADR 045 — reminder scheduling.** 60s poll + compute-on-read + a sparse `reminder_log`
  ledger (the dual of `event_exceptions`), so ADR 038's "never materialize future
  occurrences" holds. Stateless across restarts; edit/delete need no per-reminder
  bookkeeping. Rejected per-event `setTimeout`, materialized reminder-queue rows, external
  cron/Redis. No UI → design gate did not apply.
- **Audience** confirmed with the user: attendees + all tier-4 parents; Family → everyone.

## Scope additions

- **Edit re-arm** (AC5, surfaced in live review) — folded in with tests.

## New stories created

None.

## Open questions raised

None blocking.

## What the next session needs to know

- **M3 MVP is complete.** Only deferred story 8 (Suggested Events Inbox, north star) remains
  in the module, gated by the external-ingest ADR.
- The **SW / push-toggle** deferred story now also owns the _orphaned-subscription_ finding:
  a `db:reset` wipes `push_subscriptions` while a phone keeps its local subscription, so the
  toggle shows ON with no server row. Fixing native push (prod SW that registers + persists a
  subscription) is the last thing between reminders and a phone actually buzzing.
- **`family-feed` still has a `test` script and zero test files** (queued) — same silent-pass
  condition chores was in before ADR 043.
