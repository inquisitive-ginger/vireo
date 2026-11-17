# Session 03a — Calendar: repeats (#152, #153)

Type: decide · Approver: Zach · Status: locked · Started: 2026-11-16 19:03 · Ended: 2026-11-16 19:33

## Goal

Zach picks how the calendar repeats an event monthly (#152) and which repeating or multi-day things the widget's All-week band holds (#153).

## Inputs

F-021 (activities repeat), F-023 (Up Next widget); D-038 (one canonical row, occurrences computed on read; reopened by #152), D-057 (daily time-window series; band holds only what is running; reopened by #153). ADR 057's "do not revisit unless" names a third recurrence kind as the point where RRULE-shaped storage earns its complexity. Reports: #152 "No way to create a monthly recurring event." and #153 "events that happen a couple times a week like (Middle School French) get displayed as 'all week' … only items that truly span consecutive days for the majority of the week should be displayed and then drop off a day or so before their ending." (both from Dad).

Assumed: Middle School French is a daily time-window series with two weekday chips (prod wasn't queried this session); a series of that shape lands in the band today because every running daily series does (`buildWeek` in `plugins/calendar/src/lib/week.ts`). The band rule picked here applies to the agenda's Ongoing panel too, since gate 4 made them share one rule. #145 (one continuous timed multi-day event) stays out of scope.

## Implements

—

## Deliverable

A decision board with two items, each option rendered as the widget or drawer it would produce: `monthly` (how a monthly repeat is modelled and offered) and `band` (what earns the All-week band). Board: https://claude.ai/artifact/VYyC3KVxToStjQHMxjZDCi (source `docs/artifacts/03a-calendar-repeats.html`). Each band option is shown on a widget model of one real-shaped week (Grandma visiting, Middle School French Tue · Thu, swim clinic M–F, a 2-day book fair) with a Tue/Wed/Thu/Fri switch; the widget as it renders today is shown beside them.

## Options

`monthly`, round 1:

- A · Monthly on the same date: a third kind, `'monthly'`, steps one calendar month; Repeat weekly becomes Never / Weekly / Monthly. Gives up "3rd Tuesday"; 29th–31st skip short months.
- B · Same date or same weekday: Monthly offers "On the 17th" or "On the 3rd Tuesday" (last-week dates offer "last Tuesday"). Gives up: still one kind per ask.
- C · One repeat rule for everything (breaks one-kind-per-ask, as ADR 057 asked): weekly, daily and monthly fold into one stored rule; Repeats list adds every other week and yearly; existing series migrate. Gives up: 3b likely splits.

`band`, round 1:

- A · Most of the week that's left: in the band only while it fills 4+ consecutive days of the coming seven; otherwise it lists on its days. Gives up: placement shifts day to day.
- B · What the thing is: spans and 4+-days-a-week series are conditions; 1–3-day series always list; a condition leaves the band on its last day ("last day"). Gives up: drops only on the last day; a 2-day span still bands.
- C · Keep the band, show its days (breaks D-057 gate 4): "This week" holds every span and series touching the window, each with a seven-day strip. Gives up: French stays in the band.

## Exit criteria

Both items picked. At lock-in: a new D-### per item reversing or amending D-038 and D-057, the ADR files amended (038, 057) or a new ADR if storage changes, and 3b's scope set from the picks.

## Outcome

Round 1, 2026-11-16 · Sent 2026-11-16 19:09 · Back 2026-11-16 19:31

`monthly`: C, one repeat rule for everything ("Love it"), D-082, ADR 082. `band`: B, by what the thing is ("It's fine"), D-083, locked with a 3-day minimum for spans that Claude suggested in chat after the board and Zach confirmed at lock-in. No comments; the assumption that Middle School French is a Tue · Thu daily series stands. Files: `docs/decisions.md`, `docs/decisions/082-one-repeat-rule.md` (new), ADR 038 and 057 status lines, `docs/architecture.md` (ADR table), `docs/design-system.md` (span band rule). Carried forward to 3b: the rule's column shape and the migration of existing rows, and how the grid and widget state a monthly event, both Zach's call.
