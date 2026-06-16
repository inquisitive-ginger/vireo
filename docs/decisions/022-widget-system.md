# 022 — Widget System

**Status:** Decided — default layout definitions filled in by ADR 028

**Decision:** The shell home surface is a composable widget grid driven by React Grid
Layout. Plugins register home screen widgets in their `manifest.json`. The shell filters
widget visibility by tier and permission, then renders a per-user layout stored in the
platform DB. Six named slot sizes compose on a 4-column grid. Implementation is M1.

---

## Widget manifest shape

Plugins declare home screen widgets in `manifest.json` (extends ADR 007 and ADR 014):

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

**Field rules:**

| Field                | Required | Rules                                                                |
| -------------------- | -------- | -------------------------------------------------------------------- |
| `id`                 | Yes      | Globally unique; namespaced by plugin ID (`pluginId.widgetName`)     |
| `displayName`        | Yes      | Shown in the widget picker UI                                        |
| `component`          | Yes      | Module Federation export path within the plugin's remote             |
| `defaultSize`        | Yes      | One of the six named sizes; must appear in `supportedSizes`          |
| `supportedSizes`     | Yes      | Non-empty subset of the six named sizes                              |
| `minTier`            | No       | Numeric 1–4; defaults to 1 if omitted                                |
| `requiredPermission` | No       | Permission string (`module.noun`); omit if no permission gate needed |
| `description`        | Yes      | Plain text; used in the widget picker UI                             |

The `widgets` field is optional — plugins that only add routes do not need it.

Widgets do not declare event subscriptions in the manifest. Events are a plugin-service
concern. Widgets react to data changes through TanStack Query cache invalidation driven
by the shell's WebSocket event handler.

---

## Grid engine

**Library:** React Grid Layout (`react-grid-layout`)

Layout is stored per user as `{ widgetId, x, y, w, h }[]` — React Grid Layout's native
serialization format. M1 ships with static rendering (`isDraggable: false`,
`isResizable: false`). Drag-and-drop configuration UI is M1+.

**Grid config:** `cols: 4`, `rowHeight: 180`, `gap: 16`. The four columns fill the main
content area (~1060px) after the 220px sidebar at 1280px viewport.

---

## Widget slot taxonomy

Six named sizes map directly to React Grid Layout `{ w, h }` values:

| Named size | `w` | `h` | ~Dimensions |
| ---------- | --- | --- | ----------- |
| `compact`  | 1   | 1   | 253×180px   |
| `standard` | 2   | 1   | 522×180px   |
| `tall`     | 1   | 2   | 253×376px   |
| `large`    | 2   | 2   | 522×376px   |
| `banner`   | 4   | 1   | 1060×180px  |
| `full`     | 4   | 4   | 1060×760px  |

Plugin manifests use named sizes. The shell translates to `{ w, h }` for React Grid Layout.
Freeform sizing is not supported.

---

## Role-aware composition model

Two levels of visibility gating, both evaluated at render time using the active profile:

1. **Shell level — manifest gates:** Widget is excluded from the layout if either condition
   fails:
   - `minTier > activeProfile.tier`
   - `requiredPermission` is set and `can(requiredPermission)` is false

2. **Widget level — internal rendering:** Widget component handles tier-appropriate content
   using `useTier()` / `PermissionGate`. The shell does not inspect widget internals.

If a widget in a saved layout fails a gate (e.g., permission revoked), the slot is skipped
at render time and the grid re-flows. The layout record is preserved — the widget returns
to its saved position if the gate is later satisfied.

---

## Layout persistence

Layout is per-user, stored in the platform DB as `{ widgetId, x, y, w, h }[]`. Exact
schema and API are deferred to the M1 implementation session.

**Edit rights:**

| Tier | Can edit own layout | Can edit others' layouts |
| ---- | ------------------- | ------------------------ |
| 1–2  | No                  | No                       |
| 3    | Yes                 | No                       |
| 4    | Yes                 | Any family member        |

New users are seeded with a tier-appropriate default layout defined in platform config —
not hardcoded in the shell. Layout is not automatically rearranged when a user's tier
changes; a parent edits it intentionally.

---

## Why

React Grid Layout's `{ x, y, w, h }` serialization is the correct layout format from
day one — shipping M1 with a simpler format and migrating later is unnecessary risk.
Running in static mode costs nothing; drag-and-drop is additive in M1+.

Named sizes keep plugin widget composition predictable. Plugins from different authors
compose on the same grid without negotiation. The six-size taxonomy covers all reasonable
home screen widget shapes on a landscape tablet, including full-screen takeover for
content-rich widgets like a calendar.

The two-level role model cleanly separates concerns: the shell controls visibility, the
widget controls its internal rendering.

---

## Alternatives considered

**Roll our own CSS Grid layout engine** — sufficient for static rendering but reinvents
layout serialization, collision detection, and drag-and-drop. React Grid Layout solves
these as a unit; switching later would require a layout format migration.

**GridStack** — mature and feature-rich but a jQuery-era library with a React wrapper
bolted on. React Grid Layout is the React-native equivalent and better fits this stack.

**Permission gate only (no `minTier` in manifest)** — cleaner interface, but `minTier`
provides a fast coarse filter before CASL evaluation. Also allows the widget picker to
surface tier-appropriate widgets without computing full CASL abilities for each entry.

**Freeform sizing** — maximum flexibility, but unpredictable composition across plugins
and no clear contract for plugin authors. Named sizes can support drag-resize in a later
iteration without changing the manifest shape.

---

## Do not revisit unless

The six-size taxonomy proves inadequate for real plugin widgets after M1 build-out, or
React Grid Layout introduces a breaking change that cannot be absorbed without a layout
format migration.
