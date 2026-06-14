# Kickoff — Design: Widget slot non-content states

**Type:** Design
**Proposed branch:** `dev/widget-slot-states`
**Origin:** 2026-06-12 visual-language coherence audit (Gap 3)

> Driving doc for the session. Follows `docs/sessions/templates/design.md`.
> Created by the audit, not yet run.

## Pre-session checklist

- [ ] Read `CLAUDE.md`
- [ ] Read `docs/vision.md`
- [ ] Read `docs/architecture.md`
- [ ] Read ADR 003 (tier model)
- [ ] Read `docs/design-system.md` — Surfaces/Elevation, Home Surface (placeholder),
      Error States, Widget identity header
- [ ] Read ADR 028 (home-surface layouts) and ADR 030 (member identity colors)
- [ ] Read `packages/ui/src/components/widget-slot.tsx`, `placeholder-card.tsx`, and
      `plugins/family-feed/src/widgets/FeedWidgetView.tsx` / `components/FeedPostCard.tsx`

## Session scope

_One sentence:_ Define how non-live content renders inside the widget grid — placeholder
(not installed), error (failed to load), and how member identity expresses in dense widget
slots — so these states read as intentional rather than broken beside live `--card` widgets.

## Surfaces in scope

Tablet. The placeholder/error rules apply to every widget slot the grid can render.

## Constraints coming in

- **Surface Elevation** (design-system.md) — placeholder and error cards are specified as
  "flat — structural chrome is never elevated." But `WidgetSlot` always applies
  `--card` + `--shadow-card` + border.
- **Home Surface → Placeholder state** / **ADR 028** — muted bg, `--muted-foreground`
  name, one-line description, small Lucide icon, no install CTA.
- **Error States Level 2** — muted bg, `AlertTriangle`, "[Module] couldn't load," retry;
  visually calm, distinguished from placeholder by the warning icon.
- **ADR 030 / "people are color"** — identity hue is meant to appear everywhere, incl. the
  feed post spine.
- **Widget identity header** convention — accent icon (13px) + `section-label` in `--accent`.

## Findings feeding the session (from the 2026-06-12 audit)

1. **Placeholders fight the slot.** Every grid child is wrapped in `WidgetSlot`, which
   _always_ renders `bg-card` + `--shadow-card` + border (`widget-grid.tsx`,
   `widget-slot.tsx`). `PlaceholderCard` then paints `bg-muted` edge-to-edge inside it
   with its own nested `rounded-xl` (`placeholder-card.tsx:24`). Result: a flat beige
   block that is nonetheless **elevated** — it carries the slot's shadow and border,
   contradicting the "flat" spec, and reads as broken/unstyled beside white live widgets.
2. **Error card, same conflict.** The Level-2 error card (muted bg) inherits the slot's
   elevation the same way.
3. **Identity drops out where it matters most.** `FeedWidgetView` renders posts with
   `variant="plain"` (no identity spine); the spine appears only on the feed _page_. The
   widget is the glance-from-across-the-room surface, yet it's where "people are color"
   weakens to avatar-only.

## Decisions to make

1. **Escaping the elevated slot** — how placeholder/error cards become genuinely flat:
   a `WidgetSlot` flat/inset variant, the slot not wrapping non-content states, or a
   dedicated container. This touches the slot contract, so capture any structural
   consequence as a note for the dev follow-on (or a short ADR if the contract changes).
2. **Three distinguishable states** — "not installed," live widget, and "couldn't load"
   must each read as intentional and mutually distinct; none should look broken. Decide the
   treatment (inset well / dashed outline / reduced-contrast card / etc.).
3. **Identity in dense surfaces** — whether the identity spine (or another identity cue)
   persists in the feed widget, and set the rule generally so Chores/Calendar widgets
   express member identity consistently.
4. **Identity header on non-content states** — whether placeholder/error keep or drop the
   widget identity header.

For each: confirm it holds at all trust tiers and reads at a glance.

## Outputs (required before closing)

- [ ] `docs/design-system.md` — Placeholder state, Error Level 2, and Widget identity
      header sections updated with the flat-inside-slot resolution and the
      identity-in-widget rule; **Last updated** bumped
- [ ] `WidgetSlot` variant / contract decision recorded (note to dev, or short ADR if the
      slot contract changes)
- [ ] `placeholder-card.stories` / `widget-slot.stories` updated to show the resolved
      states, or a dev follow-on noted in the queue
- [ ] Session log `docs/sessions/logs/YYYY-MM-DD-design-widget-slot-states.md`
- [ ] `CLAUDE.md` current status updated

## Session log format

```
## What was decided
## What was produced
## Open questions raised
## What the next session needs to know
```
