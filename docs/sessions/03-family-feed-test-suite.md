# Session 03 — Family feed: test suite

Type: build · Approver: Zach · Status: locked · Started: 2026-11-14 15:07 · Ended: 2026-11-14 16:53

## Goal

`plugins/family-feed` gets real tests: its `test` script runs RTL behaviour tests over the post card, the feed page and the widget instead of passing on zero files.

## Inputs

F-011; D-003 (tier gates posting), D-013 (Query, shared key prefix), D-022 (widgets), D-026 (test conventions: RTL behaviour, no snapshots), D-042 (spine carries identity, avatar the face), D-044 (assigned hue). The API side already has 15 tests (`apps/api/src/plugins/family-feed.test.ts`); this session is the plugin's UI. Assumed: tests only, no behaviour changes; anything a test shows to be wrong is a question for Zach, not a fix. Zach chose to fix the one it found here (a failed post wiped its text silently).

## Implements

D-003, D-013, D-042, D-044 as they apply to F-011 (tests protecting existing behaviour).

## Deliverable

Branch `session-03-family-feed-test-suite` as a PR: vitest + jsdom config for the plugin and its test files. Board: https://claude.ai/artifact/GUhbYwJzQ2jRuUQucMmdNe (source `docs/artifacts/03-family-feed-test-suite.html`): the suite and the failed-post fix as two approve items, the test run inline. No checklist: every check is automated (13 tests in `plugins/family-feed/src/**/*.test.tsx`, names cite D-003, D-013, D-022, D-042, D-044, F-011).

## Options

—

## Exit criteria

`pnpm --filter family-feed test` runs the new files green, `pnpm test` green, PR merged.

## Outcome

Round 1, 2026-11-14 · Sent 2026-11-14 16:42 · Back 2026-11-14 16:53

Both items approved, no comments: the suite, and the failed-post fix with its wording. D-081. PR #157 merged; CI ran all 117 test files. Files: `plugins/family-feed/` (vitest config, setup, 4 test files, `test-posts.ts`, `FeedPage.tsx`), `packages/ui/src/components/compose-form.tsx` (`error` prop; a rejected submit keeps the text and logs), `vitest.workspace.ts`. Carried forward: `ComposeForm` now swallows a rejected `onSubmit` after logging it, so a future caller that wants the rejection must show `error` itself.
