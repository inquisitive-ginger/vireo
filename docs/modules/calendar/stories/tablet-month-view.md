# Story: Tablet Month View

**Module:** calendar
**Status:** ⬜ Not Started

## User story

As a family member glancing at the wall tablet, I see the whole month at once —
color-coded by who each event is for, just like the paper calendar — so the tablet
twin is as readable from across the room as the analog one it augments.

## Scope

**In:**

- `/calendar` full-page **month view** as the tablet default: a 7-column weekday
  grid, current month, with month navigation (prev/next/today)
- Each day cell renders its events as compact chips in the **owner's identity hue**
  (ADR 030); **Family** events render in the neutral/multi treatment the design
  session specifies
- **Multi-day spans** render as continuous bars across the days they cover (the
  paper "→" arrows), not duplicated per-day chips
- **Density handling:** crowded days truncate to a few chips + a `+N more`
  affordance; tapping a day (or `+N more`) **drills into a day/week detail** view
  showing all of that day's events with times
- Week and day framings reachable from the month view (the secondary frames behind
  the month default)
- Reads via TanStack Query, key `['calendar/events', { from, to }]`; the visible
  month's range drives the query; invalidated by create/edit/delete mutations
- Empty state (a month with no events) per the design system's tone

**Out:** Creating/editing events (#3 — this view is read + navigate + drill only);
the home-surface widget (#7); per-occurrence editing; drag-to-reschedule.

## Acceptance criteria

1. `/calendar` opens on the **current month** in a 7-column grid; prev/next/today
   navigation changes the displayed month and refetches the range
2. Events render as chips colored by **owner identity hue**; Family events use the
   neutral/multi treatment from the design spec; recurring occurrences appear on
   each recurring day
3. A multi-day event renders as a single continuous bar across its days, not one
   chip per day
4. A day with more events than fit shows the first few + `+N more`; tapping the day
   or `+N more` drills into the day/week detail listing all events with times
5. Week and day framings are reachable and render the same events at higher density
6. The view reads exclusively via TanStack Query with the shared
   `['calendar/events', …]` key prefix; no raw `fetch`
7. An empty month shows the empty state; loading shows a non-janky skeleton
8. Component tests: month grid renders events in owner hues; multi-day span bar;
   `+N more` truncation + drill-in; month navigation refetch

## Dependencies

**Event Model + Plugin Scaffold** (#1 — needs the `GET …?from=&to=` API with
weekly expansion). **M3 Design: Calendar** must have locked the month-cell layout,
identity-on-events treatment, multi-day bar, and density/overlap rules first.

## Notes

- This is the **hero** of M3 — the "glanceable tablet mirror." Optimize for
  across-the-room legibility (the main user is a self-described technophobe; the
  paper wins on glance, so the twin must match it).
- Carry the chores **status-vs-identity color rule** forward (design session owns
  the exact reconciliation): identity hue is the event's color; don't let any
  status treatment fight it.
