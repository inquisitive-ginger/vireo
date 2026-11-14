# Session 03 — Family feed: test suite

Type: build · Approver: Zach · Status: in progress · Started: 2026-11-14 15:07 · Ended: —

## Goal

`plugins/family-feed` gets real tests: its `test` script runs RTL behaviour tests over the post card, the feed page and the widget instead of passing on zero files.

## Inputs

F-011; D-003 (tier gates posting), D-013 (Query, shared key prefix), D-022 (widgets), D-026 (test conventions: RTL behaviour, no snapshots), D-042 (spine carries identity, avatar the face), D-044 (assigned hue). The API side already has 15 tests (`apps/api/src/plugins/family-feed.test.ts`); this session is the plugin's UI. Assumed: tests only, no behaviour changes; anything a test shows to be wrong is a question for Zach, not a fix.

## Implements

D-003, D-013, D-042, D-044 as they apply to F-011 (tests protecting existing behaviour).

## Deliverable

Branch `session-03-family-feed-test-suite` as a PR: vitest + jsdom config for the plugin and its test files. Board: the test run and the checks each test covers.

## Options

—

## Exit criteria

`pnpm --filter family-feed test` runs the new files green, `pnpm test` green, PR merged.

## Outcome
