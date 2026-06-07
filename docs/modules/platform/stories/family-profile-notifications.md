# Story: Family Profile Notifications

**Module:** platform
**Type:** Design + Development
**Status:** ⬜ Not Started

---

## Goal

The family profile (pseudo-profile, tier 1) is the always-on state for
shared household devices — a tablet mounted in the kitchen, a Pi-connected
TV display. These devices are the highest-traffic notification surfaces in
the home, yet they currently receive no persistent notification history
(toasts only, no tray).

Design and implement a notification surface appropriate for shared devices
that operates without a per-user session context.

---

## Background

Settled in the notification-design-audit session (2026-06-07):

- The tier 2+ tray gate is correct for per-user trays — don't remove it
- The family profile is not a user reviewing a personal history
- Toasts already work for tier 1 (correct, no change needed)
- A shared notification surface is a distinct open question

The family profile has no authenticated session state — it's a public-facing
display mode. Any notification surface here must be:

- Readable without switching to a personal profile
- Not leaking per-user private notification content
- Appropriate for ambient viewing (across-the-room legibility)

---

## Open questions to resolve in design session

1. **What notifications should appear?** Only family-wide or broadcast
   notifications? Or also module-level events (chore deadlines, calendar
   events) that are naturally shared?

2. **What is the surface shape?**
   - Persistent in-page feed (bottom strip, ambient display area)?
   - Floating badge on the family dashboard?
   - A separate "family announcements" concept distinct from personal
     notification tray?

3. **Persistence model:** In-memory session log (lost on page reload)
   or persisted to a shared `family_notifications` table?

4. **Legibility at distance:** Tablet is often viewed from across the room.
   Font sizing and contrast requirements may differ from per-user tray.

5. **Interaction model:** Does someone need to dismiss/clear items, or is
   this purely ambient (auto-expires)?

---

## Constraints

- Must not expose per-profile notification content (no personal tray for
  family profile)
- ADR 003: tier model — tier 1 is family profile, not age-locked
- ADR 029: `platform.notify()` is the single notification entry point;
  any family-profile notification surface must be fed from the same source

---

## Suggested approach (to be validated in design session)

A **family broadcast channel**: a subset of notifications explicitly
flagged as family-visible (new field on `platform.notify()` payload, e.g.
`audience: 'family' | 'profile'`). These appear in a persistent strip
or ambient overlay on the family dashboard. Personal notifications (default)
remain tier 2+ tray only.

This would require:

- ADR or amendment to ADR 029 (broadcast/audience model)
- New DB table or column for family-visible notifications
- New UI component for the family notification surface
- Integration with the home surface layout

---

## Dependencies

- notification-design-audit ✅ Done
- family-feed-read (may inform ambient display patterns)
