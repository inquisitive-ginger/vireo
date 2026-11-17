# ADR 082 — One Repeat Rule (Calendar)

**Status:** Decided — 2026-11-16 (session 03a, auto-bug #152) · Replaces the storage of ADR 038
(`recurrence = 'weekly'`) and ADR 057 (`'daily'` + `recurrence_day_offsets`); keeps their
read-expansion, exceptions and attendee contracts

## Decision

A recurring event stores **one repeat rule** instead of a recurrence kind per request. The rule
says how often (daily, weekly, monthly, yearly), every how many (1 = every, 2 = every other), and
which days: weekdays for weekly and daily, and for monthly either the date ("on the 17th") or the
weekday of the month ("on the 3rd Tuesday", "on the last Tuesday"). `recurrence_until` keeps its
inclusive-date meaning.

- **Weekly, daily time-window and monthly fold into it.** Existing weekly and daily rows migrate
  to the rule; nothing on the wall changes when they do.
- **Still one canonical row, occurrences computed on read** (ADR 038). The exceptions overlay, the
  reminder ledger and the synthetic `"{eventId}:{YYYY-MM-DD}"` ids are unchanged, and
  `apps/api/src/lib/recurrence.ts` stays the one expansion for both callers.
- **The drawer's Repeat weekly switch becomes a Repeats list**, worded from the event's own date:
  Doesn't repeat · Every week on Tuesday · Every other week on Tuesday · Every month on the 17th ·
  Every month on the 3rd Tuesday · Every year on Nov 17, with the optional Until. The daily
  time-window form (ADR 057's range + weekday chips + window) keeps its shape and writes the same
  rule.
- **`is_activity` stays weekly-only** (every-week, attendees ≥ 1). Monthly, yearly and
  every-other-week events are not Activities.

## Why

ADR 057's "do not revisit unless" named this moment: a third recurrence kind is where a rule earns
its complexity and the offsets column folds into it. Monthly was the third. Adding it as another
kind (the board's options A and B) would have left every-other-week and yearly to become a fourth
and fifth branch in the expansion, the drawer and their tests. The api runs in the household zone
(ADR 057, amended 2026-11-01), so the server can now resolve a local weekday, which removes the
reason offsets were stored instead of weekdays.

## Alternatives considered

- **Monthly on the same date**, a third kind. Smallest, but no "3rd Tuesday", which is how most
  monthly meetings are set.
- **Monthly by date or weekday**, a third kind plus a mode. Covered both monthly phrasings but kept
  one kind per request.

## Left to session 3b

- The column shape (structured columns or an RRULE string, and whether to use a library) and the
  migration of existing rows. Both are Zach's call when 3b starts.
- How the month grid and widget state a monthly or yearly event.

## Do not revisit unless

Per-occurrence field edits enter scope ("move just this week"), or read-expansion cost shows up in
profiling.
