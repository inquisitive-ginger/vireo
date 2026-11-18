# Session 03h — Rides: where the week is set, and no open runs

Type: decide · Approver: Zach · Status: locked · Started: 2026-11-17 18:14 · Ended: 2026-11-17 18:24

## Goal

Zach decides where rides are reached and set up without a Rides page, how a seeded week carries forward, what the month cell shows, and whether a run can be open or cleared.

## Inputs

Zach's 3e walkthrough (verbatim in `03e-rides-school-runs-day-mark.md`, round 1). Reopens D-087 (grid cell, red flag), D-088 (open-run nudge), D-091 (entry point), D-092 (Rides page), D-094 (clear). Keeps D-086 (school runs, never calendar events), D-089/D-093 (drives, 3f), the day-mark lines contract and the iPad day/week marks built in 3e. Features F-041, F-042, F-043.

Assumed:

- The 3e branch's data model (a usual week plus per-day changes) stays unless the week item picks copy-forward.
- Whatever replaces the Rides page edits the same week, with a tab per kid (D-092's layout), opened from the calendar.
- The sample family is Mom, Dad, Zoë and Teddy, as seeded on the dev server.

## Implements

—

## Deliverable

A decision board: the entry point, the month cell, how the week carries forward, open runs, and Clear. Board: https://claude.ai/artifact/4ciroms6PVuBDBsEtvwaAK (source `docs/artifacts/03h-rides-week-and-open-runs.html`).

## Options

`entry`: A a car line in the calendar widget that unfolds today's runs in place · B its own Rides widget on Home · C a widget line that opens the calendar on today with the runs unfolded (a month cell with rides opens the same way).

`cell`: A the next driver's disc beside the car · B a muted line with time and name (spends a chip row) · C nothing.

`week`: A a usual week that repeats (as 3e built; "Every Tuesday" on a swap) · B copy forward after a Sunday review nudge (auto-copies Monday if ignored) · C copy forward automatically, swaps included. Answers the Rides-page comment either way: the week is set from a drawer opened in the day's runs, a tab per kid.

`no-open` (approve): every run has a driver; Claim, the red dot and 3g's open-run nudge go away.

`clear` (question): drop it · keep it as "Not needed today" · a per-day "No school" switch.

## Exit criteria

A pick or answer on each item. At lock-in: a D-### each (marked "replaces D-0xx" where it reopens one), the rides lines in `docs/design-system.md` and `docs/architecture.md` updated, and 3e's scope rewritten in its session file.

## Outcome

Round 1, 2026-11-17 · Sent 2026-11-17 18:16 · Back 2026-11-17 18:24

Entry A, a car line in the calendar widget that unfolds today's runs, "It's fine" (D-095). Cell A, the next driver's disc, "It's fine" (D-096). Week C, copy forward automatically, swaps included (D-097); at lock-in Zach confirmed "Not needed today" stays on its day. No open runs approved (D-098). Clear kept as "Not needed today" (D-099). Picks confirmed as meant (the board bug). No comments; why 3e's driver check failed is still unanswered. Files: `docs/decisions.md`, `docs/design-system.md`, `docs/architecture.md`, `docs/roadmap.md`, `03e`'s session file.
