# Session 03c — Feature: Who drives the kids

Type: feature · Approver: Zach · Status: locked · Started: 2026-11-17 07:05 · Ended: 2026-11-17 10:03

## Goal

Zach decides which capabilities a "who's dropping off / picking up" feature adds, how it shows on the calendar, and the sessions that build it.

## Inputs

Intake (Zach, via /feature, 2026-11-17): a dedicated answer to "who's dropping off / picking up child X/Y today". The main case is school drop-off in the morning and pickup after school. Some days add a pickup from an after-school activity (yarn club) and a drive to an evening one (gymnastics), which matters less. It shows on the calendar, less intrusively than an event chip. Assignments are a standing weekly pattern plus one-tap claims or swaps for a day. Notifications: the driver is reminded at chosen lead times before; parents are nudged when a run is unclaimed; the kid hears only of a same-day swap.

Builds on: F-024 and D-050 / D-066 (day marks: a provider plugin, at most one mark per day per provider, no time, no reminder, permission is the provider's), F-031 / F-032 (meals: claim dinner in a tap, the afternoon nudge, the dinner day mark), D-045 (reminder scheduling), D-029 (notifications), D-003 (tiers), D-044 / D-064 (identity hue where the person is the answer), D-001 / D-014 (a new module is a plugin).

Assumed: a run is a property of a kid's day, not a calendar event, so it never writes `calendar.events`. A run's time is a default per kind (drop-off, pickup), adjustable per pattern.

## Implements

—

## Deliverable

A feature board: the new F-IDs with priorities, the approach, Touches, and the proposed sessions. Board: https://claude.ai/artifact/TH2aAR7Ey3Fpz7VBiuQqYT (source `docs/artifacts/03c-who-drives-the-kids.html`). Priorities seeded as drafts: F-041 must, F-042 must, F-043 should.

## Options

Features: F-041 a parent sets each kid's usual runs for the week; F-042 the family sees today's runs on the calendar and claims or swaps one in a tap; F-043 the driver is reminded, parents hear of an open run, a kid hears of a swap.

`approach`, round 1:

- A · One day mark: runs are a day-mark provider like dinner (car glyph + drivers' avatars); times and kids one tap down. Gives up: one mark per day can't say which run or when.
- B · A runs line: one pill per run under each day heading (driver, time, kids); a hairline tick per run in the month cell. Gives up: a new calendar surface, reopens D-050's two-mark cap.

Sessions proposed: 7 decide (how runs read and swap), 8 build (patterns and today's runs), 9 build (reminders and nudges), after the Companion sessions.

Round 2: school runs (pattern) split from drives to an activity (hang off the event, stored by `rides` against event + date). F-041 narrowed to school runs; F-042 is one rides mark per day opening a sheet; new F-044 an activity says who drives (draft should); F-043 covers both. `approach-r2`, both one mark with no initials:

- A · Covered or not: "School runs covered · 4" or "1 school run open". Gives up: never names a driver.
- B · The next run: "4:30 pm · Hallie picks up Teddy", red flag when any run is open. Gives up: changes through the day.

Sessions proposed: 7 decide (mark, sheet, pattern editor), 8 build (school runs and the mark), 9 build (drives on activities), 10 build (reminders and nudges).

## Exit criteria

Each proposed F-ID added or not, its priority set, an approach picked, and the sessions approved. At lock-in: the F-IDs in `docs/idea.md`, a D-### per added feature, the sessions in `docs/roadmap.md`.

## Outcome

Round 1, 2026-11-17 · Sent 2026-11-17 07:25 · Back 2026-11-17 09:16

F-041/F-042/F-043 added at must/must/should; approach B "not quite". Zach: one entry point on agenda and grid; the H/Z initials carry no information; pills are too much on a six-ride Tuesday; drop-off/pickup and driving a kid to an activity are two distinct things, and the latter may hang off the event. Sessions and notes unanswered. Zach chose to hold everything for round 2; nothing locked.

Round 2, 2026-11-17 · Sent 2026-11-17 09:21 · Back 2026-11-17 10:03

All added: F-041 must (D-086), F-042 must with approach B, the mark names the next run (D-087), F-043 should (D-088), F-044 should (D-089). Sessions: choice blank, comment "put it before companion and mark companion as held until I revive it." So 3d–3g go next and Companion 4–6 are held (D-090). No features declined. Files: `docs/decisions.md`, `docs/idea.md`, `docs/roadmap.md`. Carried to 3d: the sheet's look, the pattern editor, where a drive's driver is set on an event, the mark on a day with no school (weekends, holidays).
