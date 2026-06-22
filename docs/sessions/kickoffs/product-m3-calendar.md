# Kickoff — M3 Product Planning: Calendar

**Type:** Product (planning)
**Origin:** 2026-06-21 queue rework — M2 Chores closed; M3 — Calendar opened as the next active milestone.

> Driving doc for the session. Follows `docs/sessions/templates/product.md`.
> Created during the queue rework, not yet run. Delete after the session closes
> (its content lives in the session log).

## Pre-session checklist

- [ ] Read `CLAUDE.md`
- [ ] Read `docs/vision.md`
- [ ] Read `docs/roadmap.md` — M3 scope and done definition
- [ ] Read `docs/architecture.md` — settled architectural constraints (plugin/schema/event/widget contracts)
- [ ] Read `docs/modules/chores/` — spec, progress board, and a couple of story specs as the **template** for a feature module's shape
- [ ] Read M5 — School roadmap entry (M3 is a dependency: school events surface into the family calendar)

## Session scope

_One sentence:_ Break **M3 — Calendar** into ordered, dependency-resolved stories and stand up `docs/modules/calendar/` (spec + progress board + story specs).

## Done definition (from roadmap)

> **Done when:** Family stops using a separate calendar for day-to-day scheduling.

Roadmap M3 line items: family calendar view on tablet · event creation from mobile · activity tracking. Every story defined here must trace to the done-when.

## Constraints coming in

- **New plugin → mirror the existing plugin structure** (CLAUDE.md standing conventions): db export, prisma config, federation singletons, manifest; register in `plugins.json`, `load-plugin.ts`, `federation.d.ts`, shell `ICON_MAP`. Calendar is a new feature module like `chores`.
- **Events → `module.noun.verb`** (`calendar.event.created`, etc.); **widgets → manifest + Query cache invalidation** (ADR 022).
- **Server/plugin data → TanStack Query** (ADR 013); **UI → `@family-os/ui` + tokens, utility-first** (ADR 012/035); **permissions → CASL namespaced subjects + `PERMISSION_REGISTRY`** (ADR 018); **member colors → identity palette helpers** (ADR 030).
- **Tier model** (ADR 003) bounds who can view/create/edit events.

## Open questions to resolve

Resolve each (or defer with a reason) before closing — the M2 planning session settled the analogous chores questions up front:

1. **Recurrence** — does M3 MVP support recurring events, or one-shot only (as chores chose)? If recurring, what model (RRULE-lite vs. simple repeat)?
2. **Event model** — all-day vs. timed; single vs. multi-day spanning events; does an event have one owner or multiple attendees?
3. **Authorship & tier** — who can create/edit/delete events at which tier? Can kids create their own events, or propose them?
4. **Whose calendar / visibility** — one shared family calendar, or per-member calendars composited into a family view? How does member identity color express?
5. **Activity tracking** — what does the roadmap's "activity tracking" line actually mean for MVP (a feed/log of who-did-what, recurring activities like practices, or attendance)? Scope it concretely or split it out.
6. **Mobile event creation** — is the mobile create path a distinct story or an AC on the create-event story?
7. **Calendar widget** — define the home-screen `calendar.*` widget framing(s) (today/up-next, taskee vs. family) at the story level so Design has a target.

## Stories to define

To be enumerated during the session (order by dependency — schema/model story first, then view, then create-from-mobile, then widget, then activity tracking). This list grows as stories emerge.

## Outputs (required before closing)

- [ ] `docs/modules/calendar/spec.md` + `progress.md` created
- [ ] Story specs written to `docs/modules/calendar/stories/[slug].md`
- [ ] Any unsettled architectural question logged as an **owed ADR** in the queue (don't improvise architecture in a product session)
- [ ] `docs/sessions/queue.md` updated — M3 dev sessions added; **M3 Design: Calendar** kickoff scope tightened against the defined stories
- [ ] Session log committed to `docs/sessions/logs/2026-MM-DD-product-m3.md`
- [ ] `CLAUDE.md` current status updated

## Session log format

```
## What was decided
## Stories defined
## Open questions raised
## What the next session needs to know
```
