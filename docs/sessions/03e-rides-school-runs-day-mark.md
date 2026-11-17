# Session 03e — Rides: school runs and the day mark

Type: build · Approver: Zach · Status: in progress · Started: 2026-11-17 11:15 · Ended: —

## Goal

Parents set each kid's usual school runs on a Rides page, and the calendar's rides mark names the next run and unfolds the day's runs for a parent to claim, swap or clear.

## Inputs

F-041, F-042. D-086, D-087, D-091, D-092, D-094; D-050 / D-066 (day-mark contract), D-003 (tiers), D-044 (driver hue + second channel), D-013 (TanStack Query), D-018 (CASL), D-026 (tests), D-001 / D-014 (a plugin). Board: https://claude.ai/artifact/1fQd1nRPivomZysk8Jj1Qr (sheet B, pattern B).

Zach's calls at the start of 3e:

- The calendar draws the unfolded rides from richer day-mark data (lines plus a provider endpoint for claim, swap and clear); it never imports `rides`.
- Tier 4 edits the usual week and claims, swaps or clears a day. Everyone else sees the mark and the runs, read-only.

Assumed:

- Kids are the profiles below tier 4 (not the family profile); drivers are tier 4 profiles.
- A run: kid, weekday, kind (drop-off or pickup), place (school or a named club), time, driver (nullable = open). A day override per run: a different driver, open, or cleared (D-094).
- Drives (F-044) are 3f; the unfolded panel has no Drives section yet.

## Implements

D-086, D-087, D-091, D-092, D-094.

## Deliverable

The dev server on the LAN (http://192.168.0.6:5173/calendar, branch `session-03e-rides-school-runs`, worktree `../vireo-3e`) plus an acceptance board: https://claude.ai/artifact/KHmBN7tXS9ADkYWYbVs6hD (source `docs/artifacts/03e-rides-school-runs-day-mark.html`). Suite: 1582 passed, 0 failed (was 1548). Code review (high): 10 findings, 9 fixed — the mark never showed in the app (the provider read the calendar's range instants as dates), impossible dates rolled over, the family profile counted as a kid, claim could hand a run to another parent, retry skipped profiles, a dead invalidation, rides wording in the generic calendar, a hand-rolled row (now `ListRow`), no hue on the editing drivers. Not fixed: `formatMinutes` lives in both plugins (the calendar can't import rides). Open on the board: whether a fully cleared day keeps its mark (built: it does, to allow Restore; D-094 reads otherwise).

## Options

—

## Exit criteria

Every acceptance check passes on the board and in the suite; the branch merges by PR and the deploy check passes.

## Outcome

Round 1, 2026-11-17 · Sent 2026-11-17 11:44
