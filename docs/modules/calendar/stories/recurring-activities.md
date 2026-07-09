# Story: Recurring Activities (first-class)

**Module:** calendar
**Status:** ✅ Done — 2026-07-09 (PR #32)

## User story

As a parent, I can set up a child's standing activity once — "Tuesdays, T&T at
5:15, for the season" — and have the calendar treat it as a named, owned commitment
rather than a pile of identical rows, so the recurring backbone of our week is
first-class.

## Scope

**In:**

- An **Activity** concept layered on weekly-recurring events (`is_activity = true`
  on the `events` row — same table, no new schema): a named series with an owner
  (identity hue), a weekly day + time, and a season/`recurrence_until` end
- A lightweight **Activities management surface** (reached from the calendar): list
  the family's standing activities grouped/colored by owner; create, edit (time/day/
  owner/season), and end/remove an activity
- Activity occurrences render on the month view exactly like other events, but the
  series is **managed as one thing** (edit the activity → all future occurrences
  update; per-occurrence edits remain deferred)
- Creating an activity reuses the create form (#3) with "repeat weekly" implied and
  the activity framing surfaced

**Out:** Per-occurrence attendance/streak tracking (the antibiotics-checkmark
pattern — explicitly out of M3 MVP); per-occurrence edits/skips ("no practice this
week"); activity categories/templates; linking activities to school (M5).

## Acceptance criteria

1. A parent can create an Activity (name, owner, weekly day + time, optional season
   end) and it persists as a weekly-recurring event with `is_activity = true`
2. The Activities surface lists standing activities grouped/colored by owner and
   offers create/edit/end
3. Editing an activity's day/time/owner updates **all future occurrences** on the
   month view; ending it stops occurrences after the chosen date
4. Activity occurrences are visually consistent with other owned events on the month
   view (identity hue), and the family's weekly backbone reads as standing
   commitments
5. Removing an activity clears its future occurrences
6. Tier 4 only; tiers 1–3 see activities on the calendar but cannot manage them
7. Tests: create activity → weekly occurrences appear; edit propagates to future
   occurrences; end/remove stops occurrences; tier gating

## Dependencies

**Event Model** (#1, the `is_activity` column + weekly recurrence) and **Event
Create / Edit** (#3, the reused form). Benefits from **Tablet Month View** (#2) to
verify occurrence rendering.

## Notes

- This is the roadmap's "activity tracking" line, scoped (per the brainstorm) as
  **recurring activities as a first-class thing** — _not_ per-occurrence
  attendance. If attendance/streaks are wanted later, they layer on top of this.
- Whether activities ever warrant their own table (vs. the `is_activity` flag) is
  folded into the owed **recurrence-storage ADR** — start with the flag.
