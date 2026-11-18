# Session 03e — Rides: school runs and the day mark

Type: build · Approver: Zach · Status: locked · Started: 2026-11-17 11:15 · Ended: 2026-11-17 19:41

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

D-086, D-087, D-091, D-094, as amended by 3h: D-095 (a car line in the calendar widget unfolds today's runs; no Rides page or nav), D-096 (the month cell shows the next driver's disc beside the car), D-097 (seed a week in a drawer from the day's runs, a tab per kid; it copies forward every Sunday night, swaps included, "Not needed today" excluded), D-098 (no open runs: a driver is required, no Claim, no red dot), D-099 (Clear becomes "Not needed today").

## Deliverable

The dev server on the LAN (http://192.168.0.6:5173/calendar, branch `session-03e-rides-school-runs`, worktree `../vireo-3e`) plus an acceptance board: https://claude.ai/artifact/KHmBN7tXS9ADkYWYbVs6hD (source `docs/artifacts/03e-rides-school-runs-day-mark.html`). Suite: 1582 passed, 0 failed (was 1548). Code review (high): 10 findings, 9 fixed — the mark never showed in the app (the provider read the calendar's range instants as dates), impossible dates rolled over, the family profile counted as a kid, claim could hand a run to another parent, retry skipped profiles, a dead invalidation, rides wording in the generic calendar, a hand-rolled row (now `ListRow`), no hue on the editing drivers. Not fixed: `formatMinutes` lives in both plugins (the calendar can't import rides). Open on the board: whether a fully cleared day keeps its mark (built: it does, to allow Restore; D-094 reads otherwise).

## Options

Round 2 calls (Zach, 2026-11-17, at the restart): the seed editor stays in the rides plugin at `/rides/week` with no nav item, opened full-screen from "Set the week" in the day's runs and from the widget for a first setup. Copy-forward (D-097) needs no job: a swap or a seed edit takes effect from its day onward; "Not needed today" stays on its day.

—

## Exit criteria

Every acceptance check passes on the board and in the suite; the branch merges by PR and the deploy check passes.

## Outcome

Round 1, 2026-11-17 · Sent 2026-11-17 11:44 · Back 2026-11-17 18:04

Not accepted. Checks: 12 pass, "changing a driver shows on that weekday's mark" fail (reason not given). Fully cleared day: keep the mark, as built. Walkthrough: changes. Zach, verbatim:

> This needs some work, some items I'm mulling over:
>
> - On IPad and Desktop there is no entry point on the calendar widget and I need 3 taps: Menu > Month Grid Cell > Mark in header to see what the rides are for the day.
> - Don't think the empty glyph is super useful on the month cell. Maybe it' has the next run's driver next.
> - I don't think a dedicated Rides nav / page is adding anything here. I'd rather a entry point from the calendar widget and calendar itself. I should be able to set a week for this initial "seed" and then each week it should copy to the next and the mechanism to update becomes add new runs and swaps. Not sure if I want this to happen automatically or a "review drivers" nudge at the end of the week to copy things over.
> - Don't really get what the clear mechanism is for
> - There shouldn't be a "open" state for runs after the initial seed and subsequent clones to the next week. if a new one-off activity with a run is added it needs to have a driver added to get through.

This reopens D-087 (grid cell), D-088 (open-run nudge), D-091 (entry point), D-092 (Rides page) and D-094 (clear). Zach chose a new decide session, 3h, before rebuilding; the branch `session-03e-rides-school-runs` (worktree `../vireo-3e`) stays unmerged. Kept from this round: the API, the day-mark lines contract, marks in the iPad day and week views.

Round 2, 2026-11-17 · Sent 2026-11-17 19:06 · Back 2026-11-17 19:27

Rebuilt from D-095–D-099 on the same branch. Suite: 1597 passed, 0 failed. Code review (high): 10 findings, all fixed — the widget's unfolded runs squeezed on an empty week, no way back to the editor once every run ended, a frozen widget clock (a swap could land on yesterday and carry forward), Swap with one parent did nothing, re-removing a run could bring it back, a look-alike date made a 500, arrow keys fired a POST each and fell out of step, an editor change lost to later swaps, the permission label still said Claim (now `rides.run.swap`), and the mark provider read every run ever made.

Round 2 back: all 13 checks pass; walkthrough "changes". Zach: "Some minor tweaks needed on mobile to keep views from collapsing." and "Almost there. Fix the collapsing UI on mobile and also re-open D-097 switch it to swaps only affecting that day, otherwise the "default" runs set in set week are what propagate each week." Screenshots: the widget's unfolded runs squeeze the run text to one word per line; the agenda's day heading wraps its date under the marks. D-100 records the reversal; both go into round 3 on the branch.

Round 3, 2026-11-17 · Sent 2026-11-17 19:33 · Back 2026-11-17 19:41

D-100 (a swap changes its day only; the set week carries forward) and the phone layout (run actions wrap under the text; a day heading keeps its date on one line). Suite: 1598 passed, 0 failed.

Round 3 back: approved, all 4 checks pass. Zach: "last thing: run marks and dinner marks should only show on the month grid for the current week. go ahead an lock and carry it into the next build." Accepted as D-101; the month-grid change is D-102, queued for 3f. Merged by PR #161.

Deployed 2026-11-17: `scripts/deploy-check.sh` passed ("deployed 502b211, vireohome.app answers"), and Zach confirmed it live on his phone.
