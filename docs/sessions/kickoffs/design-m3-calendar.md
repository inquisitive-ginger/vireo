# Kickoff — M3 Design: Calendar

**Type:** Design
**Origin:** 2026-06-21 queue rework — M3 — Calendar opened.

> Driving doc for the session. Follows `docs/sessions/templates/design.md`.
> **Tightened 2026-06-21** against the stories defined in M3 Product Planning.
> Delete after the session closes.

## Product constraints locked in planning (do NOT re-open)

The product session settled these via interactive gates — they bound the design
space; design works within them, it does not revisit them:

- **One shared family calendar** (not per-member composited).
- **One owner per event** (owner's identity hue colors it) **or a Family tag**
  (neutral/multi). This is the design's central color problem to solve.
- **Simple weekly recurrence** only (per-occurrence edits deferred).
- **Recurring activities are first-class** — a named "Activity" surface to design.
- **Tablet month view is the default** (the hero); week/day are drill-ins.
- **Tier 4 creates/edits**; tiers 1–3 view (teen propose-flow deferred).
- **Email/newsletter parsing is the deferred north star** — design need only leave
  room for a future `suggested` event treatment, not design the inbox now.
- The hero bar is **across-the-room legibility** of the month mirror — the main
  user prefers paper and is a self-described technophobe; the twin must out-glance
  nothing and match the paper's at-a-glance quality.

## Pre-session checklist

- [ ] Read `CLAUDE.md`
- [ ] Read `docs/vision.md`
- [ ] Read `docs/architecture.md`
- [ ] Read ADR 003 (tier model) — role-aware rendering depends on it
- [ ] Read ADR 030 (member identity colors) + `design-system.md` "people are color"
- [ ] Read ADR 028 (reserved home slots — Calendar slot already exists)
- [ ] Read `docs/modules/calendar/` — the spec + 8 stories produced by M3 planning
- [ ] Read `docs/modules/chores/design.md` as the reference for a feature module's design doc, the status-vs-identity color rule, and the two-framing widget pattern

## Session scope

_One sentence:_ Lock the Calendar UX — the tablet calendar view, the event create/edit surface (incl. mobile creation), member-identity expression on events, and the home-screen `calendar.*` widget.

## Surfaces in scope

Tablet (primary calendar view) · mobile (event creation) · home-screen widget. (TV/Pi out of scope for M3.)

## Constraints coming in

- **Design gate (standing):** present ASCII wireframe options via an interactive Storybook playground and get user sign-off **before** finalizing any major UX decision — same gate M2 Design: Chores ran.
- **`@family-os/ui` + design tokens, utility-first** (ADR 012/035); typography tokens, never raw px; identity hues via `identityColor` (ADR 030), never invented.
- **Widget** follows the manifest + Query-invalidation contract (ADR 022); share a key prefix across the calendar page and its widget.
- Whatever the planning session settled re: recurrence, event model, visibility, and tiers bounds the design space — do not re-open those product calls here.

## Decisions to make

_Confirmed against the defined stories. The framing (month default) and surfaces
are settled — these are the UX calls within them:_

1. **Month-cell layout** (story #2) — how a day cell renders its event chips; the
   `+N more` truncation + the drill-into-day/week detail; month navigation chrome.
2. **Identity on events** (#2) — how the owner identity hue reads on an event chip,
   and how a **Family** event reads distinctly without inventing a hue; carry the
   chores status-vs-identity rule forward.
3. **Density, overlap & multi-day spans** (#2) — concurrent/overlapping events;
   all-day vs. timed; the continuous **multi-day span bar** (the paper "→" arrows).
4. **Event create/edit drawer** (#3) — one reused drawer for create/edit/per-day
   prefill (as chores did): owner/Family picker, all-day toggle, start/end time,
   weekly-repeat + until, multi-day. Plus the **mobile** adaptation of the same form (#4).
5. **Activities surface** (#5) — how standing recurring activities are listed and
   managed (grouped/colored by owner) as first-class commitments.
6. **`calendar.up-next` widget** (#7) — the **family** vs. **mine** framings, the
   three sizes, tap-through, and the empty/all-clear state. Follow the
   `chores.today-summary` two-framing precedent.

For each: confirm it holds across tablet + mobile and at all trust tiers, and
**reads at a glance from across the room** (the hero bar).

## Outputs (required before closing)

- [ ] `docs/design-system.md` updated with calendar decisions; **Last updated** bumped
- [ ] `docs/modules/calendar/design.md` dev-facing spec written
- [ ] Any new ADR if a structural constraint emerges
- [ ] Storybook playground (gate) retained as the visual reference until real components ship, or a dev follow-on noted in the queue
- [ ] Session log committed to `docs/sessions/logs/2026-MM-DD-design-calendar.md`
- [ ] `CLAUDE.md` current status updated

## Session log format

```
## What was decided
## What was produced
## Open questions raised
## What the next session needs to know
```
