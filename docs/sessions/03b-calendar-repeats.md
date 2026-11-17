# Session 03b — Calendar: repeats (#152, #153)

Type: build · Approver: Zach · Status: in progress · Started: 2026-11-16 19:45 · Ended: —

## Goal

A recurring event stores one repeat rule, the drawer offers the Repeats list including monthly (#152), and the All week band holds only conditions, decided by shape (#153).

## Inputs

F-021 (activities repeat), F-023 (Up Next widget); D-082 / ADR 082 (one repeat rule), D-083 (band holds conditions by shape), D-038 / ADR 038 and D-057 / ADR 057 (read expansion, exceptions, attendees, `is_activity` unchanged). Session 03a board picks: `monthly` C, `band` B. Reports #152, #153.

Assumed: the household zone is the api process zone (ADR 057, amended 2026-11-01), so the server may resolve local weekdays and the migration may convert offsets to weekdays in that zone. "Every other week" and "yearly" ship in this session because D-082 lists them in the Repeats list. #145 stays out of scope.

## Implements

D-082, D-083.

## Deliverable

Branch `session-03b-calendar-repeats`: the rule columns and migration, the shared expansion stepping every frequency, the drawer's Repeats list, the band rule, and the surfaces stating a monthly or yearly event. A live walkthrough on the wall iPad and a phone from the session worktree's dev server, and an acceptance board.

## Options

—

## Exit criteria

Every acceptance check passes, machine-observable ones as tests citing D-082 / D-083 / #152 / #153; `loop.build` and `loop.test` green; Zach approves the walkthrough. At lock-in: ADR 082's "Left to 3b" closes, `docs/architecture.md` and `docs/design-system.md` match, PR says `Fixes #152` and `Fixes #153`.

## Outcome
