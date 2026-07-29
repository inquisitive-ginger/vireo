# Design + Dev: Recurring Daily Time-Window Events

> Queued from auto-bug #77 (reported by Zach, tier 4, `/calendar`): "Span events
> should have the ability to add a start and end time to them. ie Girls Rock Math
> is M-F from 9:30 am to 3:30 pm."

## Pre-session checklist

- [ ] Read `CLAUDE.md`
- [ ] Read ADR 038 (recurrence storage) — this session's "Do not revisit unless"
      clause is the trigger: _"Recurrence grows beyond uniform weekly... Any of
      these reopens the materialization question."_ A daily/weekday time window
      bounded by a date range is exactly that.
- [ ] Read `plugins/calendar/src/components/CreateEventDrawer.tsx` (span handling,
      `toInput`) and `apps/api/src/plugins/calendar.ts` (`expandWeekly`, read
      expansion)
- [ ] Read `docs/decisions/050-calendar-day-marks.md` — confirms this stays an
      `events` row (it needs a time and reminders), not a day-mark

## Session scope

Girls-Rock-Math-shaped events ("M–F, 9:30am–3:30pm, for the next 3 weeks") cannot
be modeled today. A multi-day **span** is one continuous all-day block
(`startsAt`/`endsAt` cover the whole range including the nights in between,
`allDay: true`); recurrence is a single `'weekly'` literal that shifts the whole
event by exactly one week per occurrence. Neither shape is "the same time window,
every weekday, between two dates" — and the two concepts (`multiDay` and
`recurrence`) are currently mutually exclusive in the form.

This is not a UI-only fix. `startsAt`/`endsAt` are already `timestamptz`, so a
time-of-day can be stored — but storing one on today's span model just means "one
continuous 4.5-day block," which is wrong for conflict checks, reminders, and any
agenda view that reads `startsAt`/`endsAt` as "busy." The real gap is a recurrence
kind that doesn't exist: daily/weekday-set, bounded by a range, same time window
per occurrence.

## Constraints coming in

- ADR 038 (recurrence storage) — canonical row + compute-on-read is the existing
  shape; the goal should be extending the _rule_, not switching to a materialized
  occurrences table, unless profiling says otherwise (it hasn't).
- `EventInputSchema` (`packages/schemas/src/index.ts`) currently hard-codes
  `recurrence: z.literal('weekly').nullish()` — any new kind is a wire-contract
  change, both plugins and API.
- `expandWeekly` (`apps/api/src/plugins/calendar.ts`) is the only expansion
  function today; a new kind needs its own expansion (or a generalized one).
- `SpanBand` / `spanWhenLabel` (`plugins/calendar/src/lib/week.ts`,
  `plugins/calendar/src/components/SpanBand.tsx`) render span dates with no time —
  they'll need real design work to show a time window without regressing the
  existing all-day span case.

## Decisions to make

- What recurrence kinds does this actually need? (Daily · specific weekdays ·
  something else — "M–F" is a weekday-set, not "daily.")
- Does a time-boxed recurring event replace "span" as a concept, or coexist with
  it as a third shape (single timed event / all-day span / recurring time-window)?
- Exceptions overlay (`event_exceptions`) — does skip-one-occurrence still work
  unchanged, or does a weekday-set recurrence need anything new there?
- How does this render: agenda, week view, month view, the Up Next widget — a
  recurring time-boxed event isn't a "span" visually (per-day tint sliver) or a
  simple weekly chip (per-week).
- Does this reopen ADR 038's materialization question, or does compute-on-read
  extend cleanly to a weekday-set rule? (Recommend checking this first — it's the
  cheapest way to keep the ADR's shape.)

## Outputs (required before closing)

- [ ] ADR amendment or new ADR if the recurrence model changes
- [ ] `docs/design-system.md` updated if a new visual treatment is needed
- [ ] Code: schema + expansion + form + rendering, with tests
- [ ] Session log committed to `docs/sessions/logs/YYYY-MM-DD-design-dev-recurring-daily-time-window.md`
- [ ] `CLAUDE.md` current status updated
- [ ] Close auto-bug issue #77 (move to `deployed` with a resolution once live)
