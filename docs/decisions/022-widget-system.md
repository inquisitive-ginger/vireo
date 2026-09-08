# 022 — Widget System

**Status:** Decided — default layout definitions filled in by ADR 028

**Decision:** The shell home surface is a composable widget grid driven by React Grid Layout.
Plugins register home-screen widgets in `manifest.json`; the shell filters visibility by tier
and permission, then renders a per-user layout stored in the platform DB. Six named slot
sizes compose on a 4-column grid. Implementation is M1.

## Widget manifest shape

Declared in `manifest.json` (extends ADR 007 and ADR 014):

```json
"widgets": [
  {
    "id": "chores.today-summary",
    "displayName": "Today's Chores",
    "component": "./widgets/TodaySummary",
    "defaultSize": "standard",
    "supportedSizes": ["compact", "standard"],
    "minTier": 1,
    "requiredPermission": "chores.view",
    "description": "Shows the current user's tasks due today."
  }
]
```

| Field                | Req | Rules                                                        |
| -------------------- | --- | ------------------------------------------------------------ |
| `id`                 | Yes | Globally unique, namespaced (`pluginId.widgetName`)          |
| `displayName`        | Yes | Shown in the widget picker                                   |
| `component`          | Yes | Module Federation export path within the plugin's remote     |
| `defaultSize`        | Yes | One of the six named sizes; must be in `supportedSizes`      |
| `supportedSizes`     | Yes | Non-empty subset of the six named sizes                      |
| `minTier`            | No  | 1–4; defaults to 1                                           |
| `requiredPermission` | No  | Permission string (`module.noun`); omit if no gate is needed |
| `description`        | Yes | Plain text; used in the widget picker                        |

The `widgets` field is optional — plugins that only add routes do not need it.

Widgets do not declare event subscriptions: events are a plugin-service concern, and widgets
react to data changes through TanStack Query cache invalidation driven by the shell's
WebSocket event handler.

## Grid engine

**React Grid Layout** (`react-grid-layout`), storing layout per user as
`{ widgetId, x, y, w, h }[]` — its native serialization. M1 ships static (`isDraggable:
false`, `isResizable: false`); the drag-and-drop UI is M1+. **Grid config:** `cols: 4`,
`rowHeight: 180`, `gap: 16` — four columns filling the ~1060px content area after the 220px
sidebar at a 1280px viewport.

## Widget slot taxonomy

Six named sizes map directly to `{ w, h }`:

| Named size | `w` | `h` | ~Dimensions |
| ---------- | --- | --- | ----------- |
| `compact`  | 1   | 1   | 253×180px   |
| `standard` | 2   | 1   | 522×180px   |
| `tall`     | 1   | 2   | 253×376px   |
| `large`    | 2   | 2   | 522×376px   |
| `banner`   | 4   | 1   | 1060×180px  |
| `full`     | 4   | 4   | 1060×760px  |

Manifests use named sizes; the shell translates. Freeform sizing is not supported.

## Role-aware composition model

Two levels of gating, both evaluated at render time against the active profile:

1. **Shell level — manifest gates.** Excluded if `minTier > activeProfile.tier`, or if
   `requiredPermission` is set and `can(requiredPermission)` is false.
2. **Widget level — internal rendering.** The component handles tier-appropriate content with
   `useTier()` / `PermissionGate`. The shell does not inspect widget internals.

If a widget in a saved layout fails a gate (a revoked permission, say), the slot is skipped
and the grid re-flows. The layout record is preserved, so the widget returns to its saved
position if the gate is satisfied again.

## Layout persistence

Per user, in the platform DB as `{ widgetId, x, y, w, h }[]`. Exact schema and API are
deferred to the M1 implementation session.

| Tier | Can edit own layout | Can edit others' layouts |
| ---- | ------------------- | ------------------------ |
| 1–2  | No                  | No                       |
| 3    | Yes                 | No                       |
| 4    | Yes                 | Any family member        |

New users are seeded with a tier-appropriate default layout defined in platform config, not
hardcoded in the shell. A layout is not rearranged when a user's tier changes; a parent edits
it intentionally.

## Why

React Grid Layout's `{ x, y, w, h }` serialization is the correct format from day one:
shipping M1 with a simpler one and migrating later is unnecessary risk, running in static
mode costs nothing, and drag-and-drop stays additive.

Named sizes keep composition predictable — plugins from different authors compose on one grid
without negotiation, and six sizes cover every reasonable home-screen shape on a landscape
tablet, including full-screen takeover for content-rich widgets like a calendar.

The two-level role model separates concerns: the shell controls visibility, the widget
controls its internal rendering.

## Alternatives considered

**Roll our own CSS Grid engine** — enough for static rendering, but it reinvents layout
serialization, collision detection and drag-and-drop, which React Grid Layout solves as a
unit. Switching later would force a layout-format migration.

**GridStack** — mature, but a jQuery-era library with a React wrapper bolted on. React Grid
Layout is the React-native equivalent and fits this stack.

**Permission gate only, no `minTier`** — cleaner, but `minTier` is a fast coarse filter
before CASL evaluation and lets the widget picker surface tier-appropriate widgets without
computing full abilities per entry.

**Freeform sizing** — maximum flexibility, unpredictable composition across plugins, no clear
contract for authors. Named sizes can support drag-resize later without changing the manifest
shape.

## Do not revisit unless

The six-size taxonomy proves inadequate for real plugin widgets after M1 build-out, or React
Grid Layout breaks in a way that cannot be absorbed without a layout-format migration.
