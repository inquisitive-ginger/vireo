# Session — Design: Meals & Groceries (M5/1)

**Dates:** 2026-08-09 → 2026-08-11 · **Type:** design · **Kickoff:** written
ad-hoc at start (queue had it "to be written"), deleted at close.

## What was decided

Everything. The full 16-gate record with per-gate provenance is the final
artifact's decision table; the dev-facing distillation is
`docs/modules/meals/design.md`. Headlines:

- **The menu-card grammar** for a meal: main headline (Lora display — the scale
  has no sans rung above 20px), `sides` in italic beneath, owner + try bite on
  one rail, **kind carried by the verb** ("Sam is calling it in"), never a chip.
- **Schema:** `planned_meals.sides text nullable` (Zach's main+sides ask, round 2) — it also structurally solves most of the title-phrasing teaching problem.
- **Escalation is localised** (badge + solid claim at the 4pm nudge hour),
  never a full-card wash — dashboards must stay diagnosable. New design-system
  pattern.
- **The grocery mode split is retired:** one aisle-grouped `ListRow` list
  everywhere; just-added flash answers capture; aisle dictionary (+ learned
  per-family overrides) files items; add bar bottom on phone; progress as a
  filled track; cleared aisles collapse to a stated row (spec.md's dim-in-place
  rule amended, explicitly); "Sam got it" as text.
- **The wall** (fridge iPad, ~1060px — not the critique's 24" panel) renders
  groceries as three balanced columns, whole list visible, plus the
  "Sam is at the store" presence line derived from check activity.
- **ADR 063** — `ListRow` joins `ItemCard` with a written rule (cards =
  independent objects with several actions; rows = a set you scan and act on
  one way). **ADR 064** — hue appears where the person answers the surface's
  question (narrows ADR 043's trigger; groceries loses all identity chrome).
- Day marks per ADR 050: initial-in-tint + glyph as one tight object,
  "Zach's got dinner" agenda voice, **no mark for unclaimed days**.

## How it went (process, worth keeping)

Three rounds, gated through the artifact as Zach required. Round 1: 15 gates,
options rendered at true slot geometry in real tokens. Round 2 (Zach's
feedback): whitespace, the Lora-vs-convention challenge (answered: the type
scale itself routes >20px through Lora; made an explicit rendered gate), and
main+sides. Round 3: **an external design critique** Zach ran produced a
two-part counter-proposal; most of it was accepted (its part-2 HTML + later the
raw text — the text carried three things the HTML didn't: bottom add bar,
progress-as-structure on the phone, the learning dictionary). Three pushbacks
held, argued in the final artifact: the wall's real width, week plan stays on
`ItemCard` (by the critique's own card/row rule), history prompt gated not
shipped.

The critique's meta-finding stands for future design sessions: **don't gate a
live option as picture-vs-prose** — render both or record why not.

## Artifacts

- `artifacts/2026-08-11-meals-groceries-final.html` — **the decision record**
- `artifacts/2026-08-09-meals-groceries-ux.html` — the gate doc (option history)
- The critique's interactive counter-mocks live outside the repo
  (`~/Downloads/2026-08-11-groceries-meals-wall.html` + a part 1 not reviewed
  in-session); their conclusions are reconciled into the final.

## What the next sessions need to know

- **M5/2** builds from `design.md` §M5/2: four widget states, week page on
  `ItemCard`, drawer field order, `sides` migration. The nothing-planned
  history prompt only if the lookback is free — do not build history infra.
- **M5/6/7**: `ListRow` primitive lands with ADR 063 (build it in `@family-os/ui`
  first); aisle dictionary ~200 keywords + corrections table; wall column
  re-flow needs a check on the physical fridge before M5/7 closes.
- The try-bite **stamp** vocabulary is deliberately deferred to M5/5's
  table-time surface.

## Open questions

None blocking. Watch-items: wall column re-flow on the real panel (M5/7), and
whether "2 days need a cook" phrasing survives contact with the family.
