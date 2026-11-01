# ADR 057 — Daily Time-Window Recurrence (Calendar)

**Status:** Decided — 2026-07-28 · Amends ADR 038

## Decision

The calendar gains a third event shape: a **repeating time window** — a date range, a weekday
set, and one clock window per day ("Girls Rock Math, M–F 9:30–3:30, Aug 3–21", auto-bug #77).
Stored the way ADR 038 stores weekly recurrence: **one canonical `events` row, occurrences
computed on read.** Still no materialized occurrences table.

- `recurrence` widens from the `'weekly'` literal to `'weekly' | 'daily'`.
- A `'daily'` row steps occurrences **one day at a time** from `starts_at`, keeping each
  occurrence's clock window (`starts_at`→`ends_at` are the first day's window; `ends_at` is
  required and `all_day` must be false).
- A new **`recurrence_day_offsets Int[]`** column carries the weekday set as **day offsets
  from the series start's weekday, modulo 7** — candidate day `k` is an occurrence iff `k % 7
∈ recurrence_day_offsets`. Non-empty is required for `'daily'`, ignored for `'weekly'`.
- `recurrence_until` keeps its inclusive-date meaning; the drawer writes the range picker's
  last day into it.
- The **exceptions overlay and the reminder ledger work unchanged** — both key by occurrence
  date, and a daily occurrence has one. "No camp Wednesday" is the existing `cancelled`
  exception; the delete route's `?occurrence=` gate relaxes from weekly-only to any recurring
  row. Reminders fire per occurrence through the same scheduler tick.
- Read expansion is **one shared module** (`apps/api/src/lib/recurrence.ts`) for both the
  events route and the reminder scheduler. The scheduler previously carried a hand-mirrored
  copy of `expandWeekly`, so a new recurrence kind would have had to be taught to both.
- `is_activity` stays **weekly-only**: a bounded camp is not a standing weekly commitment,
  and the Activities lens derives weekday + time assuming weekly.

### Why offsets, not weekdays

The obvious column — absolute weekdays `[1..5]` for M–F — needs someone to answer "which
weekday is this timestamp?", and the server could not: timestamps are stored UTC and an
evening event's UTC weekday is not its local weekday. _Amended 2026-11-01: the api now runs in
the household TZ (see limitations); offsets were left as they are, still correct._

Offsets sidestep the question: membership is `k % 7`, pure arithmetic on the step count, with
**no weekday computed anywhere on the server**. The client, which knows local time, maps
picked weekdays to offsets on write (`(picked − startWeekday + 7) % 7`) and back on read;
both maps live in `plugins/calendar/src/lib/series.ts` beside their tests. A series starting
on an excluded day (range starts Sunday, set is M–F) needs no normalization: `k = 0` simply
isn't a member, and the first occurrence is Monday.

### Known limitations, inherited on purpose

- ~~DST wall-clock drift~~ and ~~late-evening `recurrence_until` clipping~~ — **fixed
  2026-11-01** (auto-bug #147, PR #150): both kinds step in household-local calendar days,
  `recurrence_until` cuts off at local end-of-day, and the api runs in the household zone (`TZ`
  in `docker-compose.prod.yml`). Residual: occurrence keys are still UTC dates.

## Rendering (design gates, 2026-07-28 — all taken as recommended)

- **Form:** "Multiple days" keeps the Time field and its All-day toggle (default on, so the
  existing span flow is untouched). Toggling All day off reveals the window, the weekday
  chips, the reminder, and a summary line stating the semantics ("Every weekday, Aug 3 – 21 ·
  15 days").
- **Month grid:** the series renders in the **span lanes** as bars over the days it covers —
  contiguous occurrence runs, so a skipped day is a visible hole and weekends are bare. Cells
  keep their chip slots for one-offs; the clock lives one tap down, where a span's dates do.
- **Widget / agenda:** the series is **stated once**, grammar _day-set · window · bound_
  ("Weekdays 9:30 – 3:30 · through Fri 21"); day rows never repeat it, and **only today's
  occurrence is hero-eligible**, so the 8:45 fridge glance reads "in 45 min". Live review
  added a fourth gate (2026-07-28): the band holds only what is **running** — an upcoming
  span/series states itself once on its **start day**, the widget adopting the agenda's rule
  so the two surfaces share one — and date labels take the **month** once a date leaves the
  coming week ("Aug 3 – 7", "through Aug 21"), weekday form inside it.
- **Day drill-in / week view:** an occurrence is a normal timed row.

## Alternatives considered

- **Store clock times on the span shape** (the report's literal ask). A span with times is one
  continuous multi-day block — wrong for reminders, conflict reads, and any surface treating
  `starts_at→ends_at` as busy. The gap was a recurrence kind, not two fields.
- **Materialize occurrences.** ADR 038's rejection stands: the rule is uniform per series,
  compute-on-read extends in ~20 lines, and the ledgers already speak occurrence dates.
- **Absolute weekday storage** (`[1,2,3,4,5]`) — more readable in the database, correct only
  with a server-side notion of local weekday.
- **Full RRULE.** Monthly-nth and intervals nobody has asked for, at the cost of an expansion
  library and a wire contract far past the household's needs.

## Do not revisit unless

The same triggers as ADR 038 (per-occurrence field edits, profiling), **or** a
household-timezone setting lands (revisit the offset encoding alongside the DST fix — fired
2026-11-01 via the api's `TZ`; offsets kept), **or** a
third recurrence kind appears (every-other-week, monthly-nth) — at which point RRULE-shaped
storage earns its complexity and this column folds into it.
