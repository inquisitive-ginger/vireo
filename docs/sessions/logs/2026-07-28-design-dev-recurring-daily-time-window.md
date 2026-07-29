# 2026-07-28 — Design + Dev: Recurring Daily Time-Window Events (ADR 057, PR #83)

> From auto-bug #77 (Zach, tier 4): "Span events should have the ability to add a
> start and end time to them. ie Girls Rock Math is M-F from 9:30 am to 3:30 pm."

## What was decided

- **ADR 057 (amends ADR 038):** a third event shape — the repeating time window.
  `recurrence` widens to `'weekly' | 'daily'`; a `'daily'` row steps a day at a
  time, occurrences still computed on read (no materialization). The weekday set
  is stored as **`recurrence_day_offsets`** — offsets from the series start's
  weekday mod 7, never absolute weekdays: the server stores UTC timestamps and has
  no timezone in which to resolve a weekday, so membership is pure `k % 7`
  arithmetic and both local↔offset maps live client-side
  (`plugins/calendar/src/lib/series.ts`). Exceptions overlay + reminder ledger
  work unchanged (both key by occurrence date). `isActivity` stays weekly-only.
- **Four design gates, all frames taken as recommended** (hi-fi token-accurate
  artifact, real household fixtures:
  https://claude.ai/code/artifact/8971dd05-83cd-4f11-baad-f3ccc26f2679):
  1. **Form — "the span learns time":** Multiple-days keeps its Time field; All
     day defaults on (span flow untouched); off reveals window + weekday chips +
     reminder + a semantics summary line ("Weekdays · Aug 3 – 21 · 15 days").
  2. **Month grid — weekday bars, not chips:** occurrences fold into
     consecutive-day runs in the existing span lanes; a skipped day splits the
     bar; cells keep their 3 chip slots for one-offs.
  3. **Widget/agenda — stated once + today's hero:** the series takes the grammar
     **day-set · window · bound** ("Weekdays 9:30 – 3:30 · through Fri 21"); day
     rows never repeat it; only TODAY's occurrence is hero-eligible.
  4. **Live-review addendum — the band states only what is RUNNING.** The real
     summer week put five rows in the widget's All-week band, two of them next
     week's camps, with month-less dates across a month boundary ("Through Fri
     31" beside "Mon 3 – Fri 7"). The widget adopted the agenda's rule — running
     things in the band, upcoming ones stated once on their start day (a day-list
     row whose time slot carries the range) — and **date labels take the month
     the moment a date leaves the coming week**, weekday form inside it, never
     both grammars in one label.

## What was built

- Shared expansion module `apps/api/src/lib/recurrence.ts` — used by BOTH the
  events route and the reminder scheduler, retiring the scheduler's hand-mirrored
  `expandWeekly` copy (a new recurrence kind now has one home).
- Schema: `EventInputSchema` enum + `recurrenceDayOffsets` (daily requires ≥1 day,
  `endsAt`, `allDay: false`); calendar migration
  `20260728120000_daily_time_window_recurrence` (authored by hand + `migrate
resolve --applied` — `migrate dev` refuses on the shared dev DB, the known
  cross-package `_prisma_migrations` quirk); hand-applied to `familyos_test`.
- Wire: `serializeEvent` adds `recurrenceDayOffsets` + **`seriesStartsAt`** — the
  canonical anchor, so editing week three of a camp can't rebase the range and
  delete weeks one and two. Delete `?occurrence=` relaxed to any recurring kind;
  confirm copy gains "Just this day".
- Client: `series.ts` (offset maps, `daySetLabel`, series reps), `week.ts`
  (band/hero/day-list model + the distance-based date grammar), `grid.ts`
  (`dailyRuns` → span-lane placement), drawer Frame A, widget `starting` rows.
- Docs: ADR 057, `design-system.md` §Daily time-window series + the revised
  span-statement/grammar rules.

## Acceptance criteria status

- Model + expansion + reminders + skip-one-day: **pass** (API tests + live).
- Form capture / edit round-trip: **pass** (RTL + live review).
- Month bars / widget / agenda: **pass** (model tests + live review, gate 4
  reworked mid-review).
- Issue #77: closed by the PR; **triage-board move to `deployed` still needs a
  tier-4 parent in-app** (joins the #73/#76/#78 batch).

## Verification

- api **360** (+9) · calendar **129** (+24) · typecheck/lint/prettier clean.
- Server path verified live through the running API against the dev DB: the
  reported event seeded (Zoë, M–F 9:30–3:30, Aug 3–21) → 15 occurrences, weekends
  excluded, window preserved per-day; Aug 12 exception → 14. **Found while
  seeding:** the dev DB already held two all-day spans named "Girls Rock Math"
  (created 2026-07-15) — the household's workaround for exactly this gap; left.
- **User reviewed live** (own browser against the worktree stack) and caught two
  real things: the band overload that became gate 4, and lowercased range labels
  ("aug 3 – 7" — the row's clock-label lowercasing swallowed a month name; the
  lowercase is now scoped to clock labels). Signed off; merged `b9138b4`.

## Open questions raised

- **Weekly edit-rebase (pre-existing, fixed in passing):** editing a weekly
  occurrence used to write the tapped occurrence's date as the new series anchor,
  silently discarding earlier weeks. `editDefaults` now anchors on
  `seriesStartsAt` for all recurring kinds — the drawer therefore shows the
  series' original start date when opened from a later occurrence, which is
  honest ("this edits every week") but may surprise; watch for a report.
- DST wall-clock drift + late-evening until-clipping are inherited weekly
  limitations, documented in ADR 057; both fix together if a household timezone
  setting ever lands.
- An open-ended daily series (school) is expressible in the schema but not the
  form (a range always ends). Fine until a term without a known end date shows up.
- A daily-window bar and an all-day span bar look identical at month altitude
  (title-only). Variant B′ (a "9:30" clock prefix on the bar) was sketched and
  can be added without a new gate if the ambiguity bites.

## What the next session needs to know

- Dev worktrees need `.env` + `plugins/chores/.env.local` copied from the main
  checkout (gitignored, not shared into worktrees).
- Dev DB keeps the review fixtures: the seeded daily series (with the Aug 12
  skip) + the household's two workaround spans. The user's own live-created
  series from the review are theirs — don't clean them.
