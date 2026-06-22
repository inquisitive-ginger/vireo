# Story: Event Reminders

**Module:** calendar
**Status:** ⬜ Not Started

## User story

As a parent, I get a reminder before an event so nothing slips — and so I no longer
need Google Calendar's notifications, which is the only reason I was duplicating
events there.

## Scope

**In:**

- A per-event **reminder** (`reminder_minutes` — e.g. 30 minutes before) settable on
  the create/edit form (#3)
- A **time-based firing mechanism** (settled by the owed reminder-scheduling ADR)
  that, when an event's reminder time arrives, routes a notification through
  `platform.notify()` (ADR 029) → tray + Web Push for opted-in profiles
- Reminders respect ownership: an **owned** event reminds the owner (and tier-4
  parents, per the notify routing); a **Family** event reminds the family
  appropriately (exact audience per ADR 029 routing — confirm in the ADR)
- Reminders work for **recurring occurrences** (each occurrence reminds at its own
  time), bounded by `recurrence_until`
- No new event-bus namespace is required for the reminder itself; it flows through
  the platform notification path. (If the scheduler emits an internal signal, name
  it per the ADR.)

**Out:** Per-occurrence reminder overrides; multiple reminders per event; snooze;
SMS/email delivery channels (Web Push + tray only — ADR 010/029); digest/daily-
summary notifications.

## Acceptance criteria

1. An event with `reminderMinutes` set fires a notification at `startsAt -
reminderMinutes`, delivered via `platform.notify()` (tray + Web Push if opted in)
2. An event with no reminder fires nothing
3. A recurring event reminds for each occurrence at that occurrence's time, and
   stops after `recurrence_until`
4. The reminder audience matches the event's ownership per the ADR 029 routing
   (owned → owner/parents; Family → family)
5. Editing an event's time or reminder updates the pending reminder; deleting the
   event cancels it
6. The firing mechanism survives a server restart per the chosen ADR (no silently
   dropped reminders for events still in the future)
7. Tests cover: reminder fires at the right time (with time mocked), no-reminder
   case, recurring-occurrence reminder, edit/delete cancels/reschedules

## Dependencies

**Event Model** (#1) and **Event Create / Edit** (#3, sets `reminder_minutes`).
**Gated by the owed reminder-scheduling ADR** — the in-process `EventEmitter` bus
(ADR 008) has no timer/cron primitive, so how reminders fire (a scheduler tick, a
DB-backed due-queue poll, etc.) must be settled before this story opens.

## Notes

- This is the rung that, with **Mobile Event Creation** (#4), makes "stop using a
  separate calendar" actually true — the brainstorm identified notifications as the
  one job paper can't do and the reason Google persists.
- Keep delivery on the existing `platform.notify()` path; plugins never render their
  own push payloads (ADR 029).
