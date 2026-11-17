# Session 03b — Calendar: repeats (#152, #153)

Type: build · Approver: Zach · Status: locked · Started: 2026-11-16 19:45 · Ended: 2026-11-17 06:15

## Goal

A recurring event stores one repeat rule, the drawer offers the Repeats list including monthly (#152), and the All week band holds only conditions, decided by shape (#153).

## Inputs

F-021 (activities repeat), F-023 (Up Next widget); D-082 / ADR 082 (one repeat rule), D-083 (band holds conditions by shape), D-038 / ADR 038 and D-057 / ADR 057 (read expansion, exceptions, attendees, `is_activity` unchanged). Session 03a board picks: `monthly` C, `band` B. Reports #152, #153.

Assumed: the household zone is the api process zone (ADR 057, amended 2026-11-01), so the server may resolve local weekdays; the migration converts offsets to weekdays in `America/Los_Angeles`, the compose default, since Postgres can't see the api's `TZ`. "Every other week" and "yearly" ship in this session because D-082 lists them in the Repeats list. #145 stays out of scope.

Zach's calls at start (ADR 082's "left to 3b"): structured columns, no library (`recurrence` as the frequency, `recurrence_interval`, `recurrence_weekdays`, `recurrence_month_week`; `recurrence_day_offsets` dropped); and every repeating row wears the existing Repeat glyph with the rule in its label, the drill-in row says the rule in words, month-grid chips unchanged. Assumed from the second: the glyph goes where it already was (agenda and drill-in rows), not onto the widget's rows.

## Implements

D-082, D-083.

## Deliverable

Branch `session-03b-calendar-repeats`: the rule columns and migration, the shared expansion stepping every frequency, the drawer's Repeats list, the band rule, and the surfaces stating a monthly or yearly event. A live walkthrough on the wall iPad and a phone from the session worktree's dev server (`http://192.168.0.6:5173`, worktree `../vireo-03b`, dev DB seeded with `source = '3b-preview'` rows to remove after), and an acceptance board: https://claude.ai/artifact/B5wGhKbprzCQndxu8wMcry (source `docs/artifacts/03b-calendar-repeats.html`).

Left to tests (not observable on the board's day): a condition on its last day leaves the band and reads "last day" (`D-083 a condition leaves the band on its last day …`), a series whose until falls on a non-meeting day ends on its last meeting, an overnight timed event stays an appointment. Test run: 1547 passed, 0 failed. Code review: 10 findings, 6 fixed; left: month grid still draws 1–3-day series as bars (on the board as a question), the drawer's next-dates helper mirrors the api's month stepping, the migration names its zone, widget/agenda "last day" casing follows each surface's existing label case.

## Options

—

## Exit criteria

Every acceptance check passes, machine-observable ones as tests citing D-082 / D-083 / #152 / #153; `loop.build` and `loop.test` green; Zach approves the walkthrough. At lock-in: ADR 082's "Left to 3b" closes, `docs/architecture.md` and `docs/design-system.md` match, PR says `Fixes #152` and `Fixes #153`.

## Outcome

Round 1, 2026-11-16 · Sent 2026-11-16 20:39 · Back 2026-11-16 21:47

Walkthrough approved; 14 of 15 checks passed, "every other week" left blank and counted as passed by its test at Zach's call. Grid question: "Draw a 1–3-day-a-week series as chips, like any appointment", built on the branch with a test (`D-083 draws a Tue · Thu series as chips …`) and locked without another round at Zach's call. No comments. D-084 (acceptance), D-085 (grid chips). PR #160, squash-merged so the branch's co-author trailers stay off main; deploy check passed for 24c5fe8. Files: `docs/decisions.md`, ADR 082 ("Settled in session 3b"), ADR 057 (month-grid gate amended), `docs/architecture.md`, `docs/design-system.md`. Test run: 1548 passed, 0 failed. Carried forward: the Pi's `TZ` wasn't verifiable before the migration (ssh unreachable); the drawer's next-dates helper mirrors the api's month stepping.
