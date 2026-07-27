# 2026-07-26 — Dev: the chores widget's "today" never checked the date (auto-bug #73, PR #74)

**Type:** development (ad-hoc, bug) · **Merged:** `a3a8d57`

> Chores widget shows all of the XP as accumulating that day, or the chores
> completed "today" even though they were completed (and XP was awarded) on
> different days.
>
> — auto-bug #73, filed in-app by Zoë (tier 3) from `/` at 1792×998

## What was wrong

`chores.today-summary`'s "today" was never actually today. `todayCompleted()`
(`TodaySummaryView.tsx`) and the widget's daily-XP sum (`TodaySummary.tsx`) both
filtered on `status === 'completed'` alone — no check against `completedAt`.
Chores have no archive or daily reset (`GET /chores/tasks` returns every task a
profile has ever had), so the moment a family accumulated completed chores from
more than one day, the widget summed **all of them** as "+N today" and "X done
today," forever. A chore finished last week read as finished today on every
subsequent visit.

The bug reached three places, not one: the daily-XP number, the "done today"
count feeding every progress bar, and — in `TaskeeLarge` specifically — the row
list itself (`[...tasks].sort(byUrgency)` rendered a profile's entire completed
history alongside today's pending work).

It also silently multiplied a second bug: the family framings
(`FamilyCompact`/`Standard`/`Large`) derived `pending` as `total - done`. Once
`done` is fixed to mean "completed today," that subtraction would have started
reading every **historically** completed task as still pending — fixing the
numerator alone would have broken the denominator's meaning worse than before.

## The fix

Added `isToday(iso)` to `plugins/chores/src/lib/dates.ts` (wraps `@family-os/ui`'s
existing `isSameDay`, which the file already imports from for `isOverdue`).
`todayCompleted()` now filters on `status === 'completed' && isToday(completedAt)`,
and every `total` denominator across the six size×framing variants was rederived
as `pending + doneToday` instead of `tasks.length` — not just the numerator, so
the "X of Y" ratio and the `total === 0` empty-state check both mean what their
labels say. `TaskeeLarge`'s row list is now `[...todayPending(tasks),
...todayCompleted(tasks)]` — today's working set, not all-time history. The
family framings' `pending` is now `todayPending(tasks).length` directly rather
than a subtraction that assumed `done` meant "completed ever."

The lifetime XP fallback in `TodaySummary.tsx` (used only until `GET
/chores/xp` resolves) was deliberately **not** date-scoped — it's approximating
an all-time total, so it keeps summing every completed task regardless of date.

## Verification

Typecheck + lint clean. 4 new tests (3 in `TodaySummaryView.test.tsx`, 1 in a
new `TodaySummary.test.tsx` exercising the real `useQuery`/`useAuth` container
via `MockAuthProvider` + a stubbed `fetch`) reproduce the exact reported
symptom — a task completed on a prior day is excluded from "done today," its
daily XP, and the row list, while a task completed earlier the same day still
counts. Full chores suite: **63 passed** (was 59; 3 pre-existing tests broke on
a hardcoded `completedAt` fixture from a past date and were switched to a
dynamic "just now" timestamp so they don't fight the fix they're adjacent to).

**No live browser walkthrough this session** — this environment has no browser
automation tool available, unlike the design-gate sessions that render options
in a real window. Verification instead leaned on the DOM-rendering component
tests above (they exercise the actual component tree, not a shallow mock) plus
confirming the deployed build hash changed and CI stayed green. Flagged here
per the standing live-review rule rather than silently skipping it.

## Shipped

`release` built `a3a8d57`; `deploy` pinned it and recreated the stack —
confirmed live (fresh entry-script hash, different from the report's captured
`D8jn4xGC`).

**Report #73 is not yet moved to `deployed`.** That transition
(`PATCH /bug-reports/:id`) requires a tier-4 authenticated session — there's no
CLI/API path available without those credentials, so it's left for a parent to
do on the triage board, which will notify Zoë in-app per ADR 046 once it
happens.

## What the next session needs to know

- **A widget's "today" needs a date check, not just a status check.** This is
  the same class of bug as auto-bug #70 (a list that doesn't fit its slot) —
  a comment asserted the invariant ("today's completed-task rewards") and
  nothing in the code enforced it. Worth a sweep: any other widget/page that
  says "today" without filtering on a timestamp.
- **Fixing one derived value can invert another.** The family framings'
  `pending = total - done` was correct only because the old, buggy `done` and
  `total` grew in lockstep (both summed all-time history). Changing one without
  checking what depends on it would have shipped a worse bug than the one being
  fixed.
