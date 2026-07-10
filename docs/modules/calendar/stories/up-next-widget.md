# Story: Up Next Widget

**Module:** calendar
**Status:** ✅ Done

## User story

As a family member glancing at the home screen, I see what's coming up today and
next — for the whole family on the shared tablet, or just mine on my own profile —
so the calendar is present without opening it.

## Scope

**In:**

- `calendar.up-next` widget filling the reserved Calendar home-surface slot (ADR 028)
- Two framings (mirrors the chores widget pattern):
  - **Family** framing (shared tablet / family pseudo-profile): the family's next
    events across all members, color-by-owner
  - **Mine** framing (a member's own profile / mobile): the active member's own +
    Family events
- Sizes `compact` / `standard` / `large` with sensible content per size (e.g.
  compact = next 1–2; large = today + a short horizon); self-sizes via CSS
  container queries like the existing widgets
- Events colored by owner identity hue (ADR 030); Family events in the neutral
  treatment; times shown; tap-through to `/calendar`
- Reads via TanStack Query with key `['calendar/events', 'widget']`, sharing the
  `['calendar/events']` prefix with the page so one mutation refreshes both
- **Empty / all-clear state** ("Nothing scheduled" / "You're all clear") per the
  design system tone

**Out:** Inline event creation from the widget (tap-through to the page instead);
reminders (#6); configuring which framing shows (derived from active profile).

## Acceptance criteria

1. The `calendar.up-next` widget renders in the reserved Calendar slot for tier 1+
   profiles holding `calendar.event.view`
2. On the shared tablet / family profile it shows the **family's** upcoming events
   (color-by-owner); on a member profile it shows **that member's** own + Family
   events
3. `compact` / `standard` / `large` each render appropriate content and self-size
   via container queries without layout breakage
4. Events show their time and owner hue; tapping the widget (or an event) navigates
   to `/calendar`
5. Creating/editing an event elsewhere refreshes the widget without reload (shared
   query-key invalidation)
6. With no upcoming events, the widget shows its all-clear empty state
7. Component tests: family vs. mine framing; the three sizes; empty state;
   tap-through; refresh-on-mutation

## Dependencies

**Event Model** (#1) and ideally **Tablet Month View** (#2) for the shared query
layer and the tap-through target. **M3 Design: Calendar** must have specified the
widget framings, sizes, and empty states.

## Notes

- Follows the `chores.today-summary` precedent (two framings, container-query
  self-sizing, read-only tap-through). Reuse that shape; don't reinvent.
- **Rename the seeded home slot** `calendar.today` → `calendar.up-next` in
  `packages/platform/prisma/seed.ts` **and** `apps/api/src/plugins/dev.ts` (both
  default layouts). The Event Model story (#1) shipped the widget id as
  `calendar.up-next` (per spec/manifest), but the layout seeds still reference the
  legacy ADR-028 placeholder id `calendar.today`, so the reserved Calendar slot
  renders the placeholder card until this rename lands. A re-seed updates existing
  profiles.
