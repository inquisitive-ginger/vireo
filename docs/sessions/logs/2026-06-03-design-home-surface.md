# Session Log — Home Surface Design
**Date:** 2026-06-03
**Type:** Design

---

## What was decided

### Reserved modules
Family Feed, Chores, and Calendar are the three reserved modules in M1 default
layouts. Finance and Smart Home excluded — too far out to be useful as early
placeholders.

### Default layouts — three tier buckets
Dominant slot swaps by tier; the rest of the layout mirrors:

- **Family pseudo-profile:** Family Feed banner (full-width), Chores + Calendar
  standard below as equal peers — optimized for legibility at a distance.
- **Tiers 1–2 (kids):** Chores large (dominant, top-left), Family Feed + Calendar
  standard stacked right — chores-first.
- **Tiers 3–4 (parents/teens):** Calendar large (dominant, top-left), Family Feed
  + Chores standard stacked right — calendar-first.

Marked as initial defaults; expected to be tuned post-M1 once real content and
interactions are established.

### Placeholder state
Reserved slots whose module isn't installed render a muted informational card:
`--muted` background, `--muted-foreground` label, Lucide icon, one-line description.
No install CTA (marketplace is M8). Shell-level concern — plugins don't handle their
own absent state.

### Family Feed widget spec (MVP)
Supports `standard`, `large`, `banner`. Content is latest-post strip at 1-row sizes;
2–3 stacked posts at `large`. Text posts only — images/reactions/aggregation are v2.
Empty state shows compose button only for profiles with write permission.
Widget components use CSS container queries for responsive sizing within their slot.

---

## What was produced

- `docs/design-system.md` — Home Surface section added; Widget Composition System
  layout persistence note updated to reference ADR 028
- `docs/decisions/028-home-surface-default-layouts.md` — amendment to ADR 022
- `docs/modules/family-feed/spec.md` — Family Feed module spec stub
- ADR 022 status implicitly amended (ADR 028 fills the deferred sections)

---

## Open questions raised

- None blocking M1. Default layouts are explicitly marked as tunable.

---

## What the next session needs to know

- The `widgetId` values (`family-feed.feed`, `chores.today-summary`, `calendar.today`)
  are now the canonical IDs — plugin manifests must use these exact strings for the
  default layouts to seed correctly.
- Widget components must use CSS container queries, not media queries, for internal
  layout adaptation.
- Placeholder card is a shell component, not a per-plugin responsibility.
- **Notification & States Design** is next — it now includes motion/animation scope
  (folded in during pre-session audit).
