# Story: Event Create / Edit

**Module:** calendar
**Status:** ⬜ Not Started

## User story

As a parent (tier 4), I can add a new event or edit an existing one from one simple
form — choosing who it's for, when, whether it repeats weekly, and whether it spans
days — so keeping the family calendar current takes seconds.

## Scope

**In:**

- One **reused drawer form** for create and edit (chores pattern: "Add event" /
  "Edit event" / "Save changes")
- Fields: title; **owner** picker (each family member by identity hue, plus a
  **Family** option); date(s); **all-day toggle**; start/end **time** when not
  all-day; **multi-day** (end date later than start); **repeat weekly** toggle +
  optional "until" end date; location (optional); description (optional)
- Entry points: a primary "Add event" affordance on the month view, and a day-cell
  add (prefills that day); tapping an existing event opens the form in edit mode
- **Remove** action in the edit form (confirm), tier 4
- Optimistic create/edit/delete via TanStack `useMutation`; invalidates the shared
  `['calendar/events']` key prefix (page + widget refresh together)
- Validation via shared Zod schema in `packages/schemas`
- 44px touch targets; works on the tablet (mobile-specific entry is story #4)

**Out:** Mobile-specific create surface (#4 — though the form is reused there);
the Activity-management surface (#5); reminder configuration UI beyond a simple
`reminder_minutes` field if design includes it; per-occurrence ("just this week")
editing of a recurring series.

## Acceptance criteria

1. "Add event" opens the drawer; submitting `{ title, date }` creates an event and
   it appears on the month view without a reload (optimistic + invalidation)
2. The owner picker offers each member (identity hue) **and** Family; choosing
   Family creates an `ownerId: null` event rendered in the Family treatment
3. All-day toggle hides the time fields; a timed event captures start/end times
4. Setting an end date later than the start creates a multi-day event that renders
   as a span on the month view
5. "Repeat weekly" + an "until" date creates a recurring event that appears on each
   weekly occurrence up to the end date
6. Tapping an existing event opens the form pre-filled in edit mode; saving updates
   it in place; **Remove** (after confirm) deletes it and clears it from the view
7. Tier 3 and below never see create/edit/remove affordances (gated by
   `calendar.event.create` / tier-4 manage)
8. Component tests: create (minimal), Family vs owned, all-day, multi-day, weekly
   repeat, edit-in-place, remove-with-confirm, tier gating

## Dependencies

**Event Model** (#1, CRUD API) and **Tablet Month View** (#2, the surface the form
launches from and writes back to). **M3 Design: Calendar** must have locked the
create/edit surface (drawer vs. dialog) and the owner/Family picker.

## Notes

- Reuse one form for create + edit + per-day prefill, exactly as chores did — it's
  the lowest-friction path and keeps the validation in one Zod schema.
- A `reminder_minutes` control may live here or in story #6 depending on the design
  session; if here, it only sets the field — the firing mechanism is #6.
