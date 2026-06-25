# Story: Mobile Event Creation

**Module:** calendar
**Status:** ✅ Done — 2026-06-24 (PR #31)

## User story

As a parent away from home, I can add an event from my phone in a few taps so I
stop duplicating appointments into Google just to capture them — capture happens
once, in Family OS.

## Scope

**In:**

- The event create/edit form (#3) adapted to the **mobile PWA** surface: full-width,
  thumb-reachable, 44px targets, native date/time pickers, `env(safe-area-inset-*)`
- A mobile entry point to "Add event" consistent with the mobile shell (bottom tab
  bar + brand top bar — ADR 033/034)
- A **mobile read surface** sufficient to confirm the add landed: at minimum an
  agenda/list of upcoming events (the full month grid is a tablet affordance; the
  design session decides how much month view mobile gets)
- Same TanStack mutation + `['calendar/events']` invalidation as the tablet path —
  a mobile-created event shows on the wall tablet in realtime

**Out:** A bespoke mobile month-grid interaction (reuse/simplify per design); offline
event capture/queueing; reminders (#6); the widget (#7).

## Acceptance criteria

1. From the mobile PWA, "Add event" opens the create form sized for a phone; native
   date/time pickers work; the form submits and the event persists
2. A mobile-created event appears on the tablet month view in realtime (shared
   query key invalidation / event bus), confirming unified capture
3. The mobile create form honors tier gating (only tier 4 sees it) and the same Zod
   validation as the tablet
4. A mobile read surface (agenda/list at minimum) shows upcoming events so the user
   can confirm the add without walking to the tablet
5. Touch targets ≥44px; safe-area insets respected; no horizontal overflow on a
   phone viewport
6. Tests: mobile-form submit creates an event; mobile agenda renders upcoming
   events; tier gating on the mobile entry point

## Dependencies

**Event Create / Edit** (#3 — reuses the form) and the **Tablet Month View** (#2)
for the shared query layer. Relies on the existing mobile shell (ADR 033/034).

## Notes

- This is the rung that, together with **Event Reminders** (#6), actually retires
  Google. Capture-once is the behavior change; the brainstorm flagged that
  notification-capture is _why_ the family duplicates today.
- Don't fork the form — adapt the #3 form responsively (utility-first, ADR 035).
