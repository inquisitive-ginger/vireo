# Kickoff — M3 Design: Calendar

**Type:** Design
**Origin:** 2026-06-21 queue rework — M3 — Calendar opened.

> Driving doc for the session. Follows `docs/sessions/templates/design.md`.
> **Stub** — precise decisions firm up once **M3 Product Planning: Calendar**
> defines the stories. Tighten this kickoff at the end of the planning session
> before scheduling. Delete after the session closes.

## Pre-session checklist

- [ ] Read `CLAUDE.md`
- [ ] Read `docs/vision.md`
- [ ] Read `docs/architecture.md`
- [ ] Read ADR 003 (tier model) — role-aware rendering depends on it
- [ ] Read ADR 030 (member identity colors) + `design-system.md` "people are color"
- [ ] Read `docs/modules/calendar/` — the spec + stories produced by M3 planning
- [ ] Read `docs/modules/chores/design.md` as the reference for a feature module's design doc + the XP-flight gate pattern

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

_Confirmed against the stories once planning lands. Expected set:_

1. **Calendar framing** — month / week / day (and/or agenda list); which is the tablet default; how the others are reached.
2. **Event create/edit surface** — drawer vs. dialog vs. dedicated page; one form reused for create/edit (as chores did); the mobile create path.
3. **Identity on events** — how member identity color reads on an event block without fighting status/category color (carry the chores status-vs-identity rule forward).
4. **Density & overlap** — how concurrent/overlapping events render; all-day vs. timed rows; multi-day spans.
5. **`calendar.*` widget** — today/up-next framing(s), taskee vs. family, sizes, empty + all-clear states.

For each: confirm it holds across the surfaces in scope and at all trust tiers, and reads at a glance.

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
