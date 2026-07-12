# 039 — Widget Prominence (Elevation Ladder)

**Status:** Decided (2026-07-10, Home Dashboard hierarchy)
**Amends:** ADR 022 (widget system) · ADR 028 (home default layouts)

---

## Decision

Every home-surface widget slot renders at one of three **prominence rungs** —
`feature` · `card` · `quiet` — applied by the shell's `WidgetSlot` (chrome per
`design-system.md` §Widget prominence). Prominence is a property of the **layout
composition**, not the widget manifest: the same widget features for one profile
and recedes for another (kid → chores features; family wall → feed features).

**At most one `feature` per surface — and a surface may have none.**

**Wiring:** prominence is defined alongside `{x,y,w,h}` in the default-layout
composition (`packages/platform/src/home-layout.ts` — the single definition, shared
by the API, the shell and the Prisma seed) and **resolved on read** — the
`GET /home/layout` response carries a `prominence` field per item
(`prominenceFor(layoutKey, widgetId)`, defaulting to `card`). It is **not** a
`widget_layouts` column: prominence is derived from the composition, never stored.
Client `WidgetLayoutItem` gains an optional `prominence`; `WidgetGrid` passes it to
`WidgetSlot`. A `flat` slot (placeholder / error) still overrides prominence.

**Reading order carries the same claim as elevation.** Within a column the higher
rung sits above the lower one. A `quiet` widget stacked above a `card` one is a
bug: position and elevation both answer "how much does this matter", so they must
not disagree.

---

## Amendment (2026-07-11) — `feature` is optional; parents have none

The original decision required _exactly_ one `feature` per surface. Relaxed to **at
most one**, and `default_layout_tier_3_4` (parents / teens) now ships with **no
feature at all** — calendar, chores and feed sit at `card`/`card`/`quiet`.

The ladder exists to express _dominance_ — "on this surface, this one thing is what
you came for." That claim is true for a kid (today's chores) and for the unattended
wall (the feed banner, read across a room). It is not true for a parent: they open
the dashboard to **triage**, and the calendar, the chores and the feed are all live
answers to "what needs me". Forcing a feature there manufactured a hierarchy the
surface doesn't actually have, and spending the ladder's loudest rung on a claim
that isn't true devalues it everywhere else.

A surface with no feature is not a surface with no hierarchy: the calendar still
holds the 2×2 slot and the leading column, and the feed still recedes to `quiet`.
Size and position carry the ranking; elevation simply declines to overstate it.

---

## Why

- **Prominence varies by profile, so it can't live on the manifest.** A manifest
  field is per-widget-static; the whole point of the ladder is that the _same_
  widget re-ranks per viewer. That is a composition decision, exactly like `{x,y,w,h}`.
- **Deriving on read avoids a migration** and keeps the change small: no schema
  change, existing seeded rows keep working, and the response shape is already
  forward-compatible if a persisted override column is added later.
- **One source of truth.** `packages/platform/src/home-layout.ts` holds geometry +
  prominence + the `default_layout_key` mapping, consumed by the seeder, the family
  reset, and the layout endpoint alike (this also fixed the never-seeded
  `default_layout_family`).

  > **Amended 2026-07-11.** This was only half true: the Prisma seed kept its own
  > hand-maintained copy of the layouts, and the API took _geometry_ from the DB while
  > deriving _prominence_ from code. When the composition was re-ranked, the copies
  > drifted and the endpoint served new rungs on old positions. The definition now
  > lives in `@family-os/platform` and the seed imports it — there is exactly one.
  > `GET /home/layout` also **no longer freezes** the default into `widget_layouts` on
  > first read, which used to make a corrected default unreachable for any existing
  > profile.

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
