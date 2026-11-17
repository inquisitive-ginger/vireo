# Session 03d — Rides: the mark, the sheet and the pattern editor

Type: decide · Approver: Zach · Status: in progress · Started: 2026-11-17 10:44 · Ended: —

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

A decision board with three choices (the sheet, the pattern editor, setting a drive) and one question (a day with no school), each previewed with Zach's Tuesday on the real tokens.

## Options

## Exit criteria

A pick for each of the three choices and an answer on no-school days. At lock-in: a D-### each in `docs/decisions.md`, and the rides section of `docs/design-system.md` and `docs/architecture.md` for 3e–3f.

## Outcome
