# Session 03d — Rides: the mark, the sheet and the pattern editor

Type: decide · Approver: Zach · Status: locked · Started: 2026-11-17 10:44 · Ended: 2026-11-17 11:04

## Goal

Zach decides where a day's rides open from the mark, how a parent lays out the weekly school-run pattern, and where a drive's driver is set on an activity.

## Inputs

F-041, F-042, F-044 (and F-043 for what the sheet must later carry). D-086 (school runs live in a `rides` plugin, never a calendar event), D-087 (one mark per day naming the next run, red flag when open, tap opens the day's sheet, claim or swap changes only the day), D-089 (a drive is stored against an event and its date; the row shows car + driver), D-050 / D-066 (one mark per provider per day; the provider names a glyph, the calendar resolves it), D-044 (driver hue plus a second channel), D-074 (page frame). Carried from 3c: the sheet's look, the pattern editor, where a drive's driver is set, the mark on a day with no school. Brief: design for the wall at arm's length and the one-handed phone.

Assumed:

- A month cell stays one button that drills to the day (no nested target); the mark opens the sheet from the agenda's day header. The grid shows the car glyph and the red flag only.
- The pattern editor lives on a new Rides page in the sidebar.
- A weekend or any day with no runs and no drives shows no mark.
- The sample week on the board is invented around Zach's real Tuesday.

## Implements

—

## Deliverable

A decision board with three choices (the sheet, the pattern editor, setting a drive) and one question (a day with no school), each previewed with Zach's Tuesday on the real tokens. Board: https://claude.ai/artifact/1fQd1nRPivomZysk8Jj1Qr (source `docs/artifacts/03d-rides-mark-sheet-pattern.html`).

## Options

`sheet`: A the side drawer (the existing `Drawer`; covers the agenda on a phone) · B unfolds in the day (a sunken panel under the heading; pushes events down) · C a popover on the mark (breaks convention: a new primitive; cramped one-handed).

`pattern`: A one grid for the week (rows = runs, columns = school days; tight on a phone) · B one kid at a time (tabs; can't compare the parents' load) · C set it by doing (no editor; "Every Tuesday" on claim or swap saves to the week; setup takes a pass through the week).

`drive`: A in the event drawer ("Who drives" + Every week; the calendar hosts another plugin's field) · B from the day's rides ("+ Add a drive" lists undriven activities; two trips for a new activity).

`noschool` (question): "No school" in the day's rides clears its runs · clear each run by hand · runs stay.

## Exit criteria

A pick for each of the three choices and an answer on no-school days. At lock-in: a D-### each in `docs/decisions.md`, and the rides section of `docs/design-system.md` and `docs/architecture.md` for 3e–3f.

## Outcome

Round 1, 2026-11-17 · Sent 2026-11-17 10:47 · Back 2026-11-17 11:04

Sheet B, unfolds in the day, "It's fine" (D-091). Pattern B, one kid at a time (D-092). Drive B, from the day's rides (D-093). No school: clear each run by hand (D-094). No comments. A board bug (each option card is a label, so clicks inside a preview picked that option) saved picks before Zach chose; they were cleared once, the bug persisted, and Zach confirmed all three B. Kit note logged. Files: `docs/decisions.md`, `docs/design-system.md` (day marks: the rides exception), `docs/architecture.md` (day-mark contract: rides). Carried to 3e: how the calendar hosts the unfolded runs without importing `rides` (a richer mark payload plus rides' claim endpoint, or a federated slot).
