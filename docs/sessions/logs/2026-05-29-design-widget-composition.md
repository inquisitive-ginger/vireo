# Session Log — Widget Composition Design

**Date:** 2026-05-29
**Type:** Design
**Story:** Widget Composition (pre-M1)

---

## What was decided

### Tablet nav layout

Left sidebar, 220px, always visible in landscape. No top header bar. Profile chip
(ADR 021 "corner chip") moves to the top of the sidebar — functionally identical,
better placement without a header. Nav items are icon + label, tier-filtered, 48px
minimum touch target. Settings pinned to the bottom, tier 4 only.

### Widget grid

React Grid Layout (`react-grid-layout`). `cols: 4`, `rowHeight: 180`, `gap: 16`.
M1 ships in static mode; drag-and-drop configuration UI is M1+. Data model (`{ x, y, w, h }[]`)
is correct from day one so no migration is needed when customization lands.

GridStack was considered — rejected because it's a jQuery-era library with a React
wrapper; React Grid Layout is the React-native equivalent.

### Widget slot taxonomy

Six named sizes: `compact` (1×1), `standard` (2×1), `tall` (1×2), `large` (2×2),
`banner` (4×1), `full` (4×4). `full` added to handle calendar-style widgets that
take the entire content area. Plugin manifests use named sizes; shell translates to
React Grid Layout `{ w, h }` internally.

### Widget manifest shape

Plugins declare widgets in `manifest.json` (extends ADR 007 / ADR 014). Fields:
`id` (namespaced `pluginId.widgetName`), `displayName`, `component` (MF export path),
`defaultSize`, `supportedSizes`, `minTier` (defaults 1), optional `requiredPermission`,
`description`. No `maxTier` — upper visibility is a layout decision, not a gate.
Widgets do not declare event subscriptions — that is a plugin-service concern.

### Role-aware composition

Two-level model: shell filters by `minTier` and `requiredPermission` (manifest gates);
widget handles internal rendering via `useTier()` / `PermissionGate`. Revoked-permission
widgets are skipped at render time; layout record preserved for restoration.

### Layout persistence user model

Per-user `{ widgetId, x, y, w, h }[]` in platform DB. Tier 1–2: no edit rights.
Tier 3: own layout. Tier 4: any family member. New users seeded from tier-appropriate
platform config. Layout not auto-rearranged on tier changes.

---

## What was produced

- `docs/decisions/022-widget-system.md` — new ADR
- `docs/design-system.md` — Tablet Nav Layout section + Widget Composition System section added; To Be Defined table updated

---

## Open questions raised

None. All five decisions closed cleanly.

---

## What the next session needs to know

- React Grid Layout is the settled grid engine. M1 implementation wires it up in static mode.
- Widget manifest shape is stable — plugin authors can depend on it.
- Layout persistence schema (DB table, API endpoints) is deferred to the M1 implementation session.
- Drag-and-drop configuration UI (widget picker, rearrange, resize) is M1+, not M1.
- The profile chip is at the top of the sidebar — shell-skeleton story should not build a top header bar.
