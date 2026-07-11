# 039 — Widget Prominence (Elevation Ladder)

**Status:** Decided (2026-07-10, Home Dashboard hierarchy)
**Amends:** ADR 022 (widget system) · ADR 028 (home default layouts)

---

## Decision

Every home-surface widget slot renders at one of three **prominence rungs** —
`feature` · `card` · `quiet` — applied by the shell's `WidgetSlot` (chrome per
`design-system.md` §Widget prominence). Prominence is a property of the **layout
composition**, not the widget manifest: the same widget features for one profile
and recedes for another (parent → calendar features; kid → chores features; family
wall → feed features). Exactly one `feature` per surface.

**Wiring:** prominence is defined alongside `{x,y,w,h}` in the default-layout
composition (`apps/api/src/lib/default-layouts.ts`) and **resolved on read** — the
`GET /home/layout` response carries a `prominence` field per item
(`prominenceFor(layoutKey, widgetId)`, defaulting to `card`). It is **not** a
`widget_layouts` column: geometry persists per profile, prominence is derived from
the composition. Client `WidgetLayoutItem` gains an optional `prominence`;
`WidgetGrid` passes it to `WidgetSlot`. A `flat` slot (placeholder / error) still
overrides prominence.

---

## Why

- **Prominence varies by profile, so it can't live on the manifest.** A manifest
  field is per-widget-static; the whole point of the ladder is that the _same_
  widget re-ranks per viewer. That is a composition decision, exactly like `{x,y,w,h}`.
- **Deriving on read avoids a migration** and keeps the change small: no schema
  change, existing seeded rows keep working, and the response shape is already
  forward-compatible if a persisted override column is added later.
- **One source of truth.** `default-layouts.ts` holds geometry + prominence + the
  `default_layout_key` mapping, consumed by the seeder, the family reset, and the
  layout endpoint alike (this also fixed the never-seeded `default_layout_family`).

---

## Alternatives considered

- **`prominence` on the widget manifest** — rejected: a widget can't declare a
  single weight when it features for parents and recedes for kids.
- **A `prominence` column on `widget_layouts` now** — deferred (YAGNI): layout
  editing is static in M1 (ADR 022), so there's nothing yet to persist a per-profile
  override _against_. Add the column when the layout editor ships and a user can
  re-rank their own widgets.
- **Derive prominence from size/position** (e.g. the 2×2 is the feature) — rejected:
  implicit and fragile; two same-size widgets can't both be non-features, and it
  couples elevation to geometry.

---

## Do not revisit unless

The layout-editing UI (ADR 022, M1+) ships and users need to override prominence
per profile — then promote it to a persisted `widget_layouts` column (the response
shape already carries it, so the client is unaffected).
