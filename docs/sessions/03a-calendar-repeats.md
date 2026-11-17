# Session 03a — Calendar: repeats (#152, #153)

Type: decide · Approver: Zach · Status: in progress · Started: 2026-11-16 19:03 · Ended: —

## Goal

Zach picks how the calendar repeats an event monthly (#152) and which repeating or multi-day things the widget's All-week band holds (#153).

## Inputs

F-021 (activities repeat), F-023 (Up Next widget); D-038 (one canonical row, occurrences computed on read; reopened by #152), D-057 (daily time-window series; band holds only what is running; reopened by #153). ADR 057's "do not revisit unless" names a third recurrence kind as the point where RRULE-shaped storage earns its complexity. Reports: #152 "No way to create a monthly recurring event." and #153 "events that happen a couple times a week like (Middle School French) get displayed as 'all week' … only items that truly span consecutive days for the majority of the week should be displayed and then drop off a day or so before their ending." (both from Dad).

Assumed: Middle School French is a daily time-window series with two weekday chips (prod wasn't queried this session); a series of that shape lands in the band today because every running daily series does (`buildWeek` in `plugins/calendar/src/lib/week.ts`). The band rule picked here applies to the agenda's Ongoing panel too, since gate 4 made them share one rule. #145 (one continuous timed multi-day event) stays out of scope.

## Implements

—

## Deliverable

A decision board with two items, each option rendered as the widget or drawer it would produce: `monthly` (how a monthly repeat is modelled and offered) and `band` (what earns the All-week band). Board URL and source `docs/artifacts/03a-calendar-repeats.html`.

## Options

## Exit criteria

Both items picked. At lock-in: a new D-### per item reversing or amending D-038 and D-057, the ADR files amended (038, 057) or a new ADR if storage changes, and 3b's scope set from the picks.

## Outcome
