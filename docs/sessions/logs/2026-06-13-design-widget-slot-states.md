# Session Log — Design: Widget Slot Non-Content States

**Date:** 2026-06-13
**Type:** Design
**Story:** widget-slot-states

---

## What was decided

### 1. WidgetSlot flat/elevated contract

`WidgetSlot` now accepts a `flat` boolean prop. When `true`, card chrome (`bg-card border border-border shadow-[var(--shadow-card)]`) is removed; the slot retains only shape and clip (`rounded-xl overflow-hidden`). The flat/elevated distinction is the **primary visual signal** separating non-content states from live widgets.

- `flat=false` (default): live widgets — elevated, white card, subtle warm shadow
- `flat=true`: placeholder and error slots — flush with background, no elevation, muted fill

`WidgetGrid` accepts `flatSlots?: string[]` — widget IDs to render in flat slots. The shell passes this from its placeholder/error detection logic.

### 2. Three-state visual language

| State          | Slot               | Background                  | Icon                                                   | Copy                             | CTA                  |
| -------------- | ------------------ | --------------------------- | ------------------------------------------------------ | -------------------------------- | -------------------- |
| Live widget    | Elevated (default) | `--card`                    | Widget identity header (`--accent`)                    | Widget content                   | —                    |
| Not installed  | Flat               | Transparent + dashed border | Module Lucide icon, 20px, `--muted-foreground/10` well | Module name + 1-line description | None                 |
| Failed to load | Flat               | `--muted`                   | `AlertTriangle` 24px, `--muted-foreground`             | "[Module] couldn't load"         | Retry (ghost, muted) |

All three states use the same `rounded-xl` shape. Elevation is the tier-one distinguisher; icon anatomy distinguishes the two flat states.

No widget identity header on placeholder or error cards — they carry their own anatomy and do not label an active module surface.

### 3. Identity in widget slots

The feed widget was using `variant="plain"` on `FeedPostCard`, which dropped the identity spine entirely. This violates "people are color" (ADR 030) on the glance-from-across-the-room surface.

Resolution: `FeedPostCard` gains a `variant="widget"` — renders a **4px left spine** in the author's identity hue (`identityColor()`), with `border-radius: 2px`, via a `position: relative` container. No card chrome. `FeedWidgetView` switches from `variant="plain"` to `variant="widget"`.

**General rule for all content widgets:** when a row is authored by or assigned to a specific family member, it carries a 4px left spine in that member's identity hue. This applies to Chores and Calendar widgets when they ship. No spine on unassigned or multi-person rows.

The three `FeedPostCard` variants are now documented:

- `note` — elevated card + spine (feed page)
- `widget` — spine only, no card chrome (widget slots)
- `plain` — no chrome, no spine (surfaces that manage their own chrome)

---

## What was produced

- `packages/ui/src/components/widget-slot.tsx` — `flat` prop added
- `packages/ui/src/components/widget-grid.tsx` — `flatSlots?: string[]` prop; `flat` passed through to `WidgetSlot` per slot
- `packages/ui/src/components/placeholder-card.tsx` — transparent background; inline SVG `<rect>` dashed border (`strokeWidth="1.5"`, `strokeDasharray="10 6"`, `rx="10.5"`, `--muted-foreground/30`). SVG used over CSS `border-dashed` for dash/gap size control. Shell wiring added: `apps/shell/src/pages/Home.tsx` now collects flat slot IDs and passes `flatSlots` to `WidgetGrid`.
- `packages/ui/src/components/error-card.tsx` — new `ErrorCard` component (Level-2 error state)
- `packages/ui/src/index.ts` — `ErrorCard` and `ErrorCardProps` exported
- `plugins/family-feed/src/components/FeedPostCard.tsx` — `variant="widget"` added
- `plugins/family-feed/src/widgets/FeedWidgetView.tsx` — switched to `variant="widget"`
- `packages/ui/src/components/widget-slot.stories.tsx` — rewritten: `AllStates` story shows live/placeholder/error side by side; individual stories use `flat` correctly
- `packages/ui/src/components/placeholder-card.stories.tsx` — all stories now wrap in `<WidgetSlot flat>`
- `docs/design-system.md` — Placeholder state, Error state (slot level), WidgetSlot contract, and Identity in widget slots sections added/updated; Level 2 error state cross-referenced; Last updated bumped

---

## Open questions raised

None. All four decisions from the kickoff were resolved.

---

## What the next session needs to know

- **Shell wiring complete:** `apps/shell/src/pages/Home.tsx` passes `flatSlots` to `WidgetGrid` for all uninstalled module slots.
- **`ErrorCard` not yet wired to error boundaries:** the component exists and is exported, but no widget error boundary currently renders it. This is also a dev follow-on.
- **Chores / Calendar widget identity spines:** the general rule is settled (4px spine per assigned row), but implementation waits for those widget implementations.
