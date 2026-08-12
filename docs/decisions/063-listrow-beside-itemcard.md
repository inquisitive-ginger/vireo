# 063 — `ListRow` joins `ItemCard`, with a rule for choosing

**Status:** Decided (2026-08-11, M5/1 Meals & Groceries design)
**Amends:** the "never hand-roll a row" convention (design-system §ItemCard, ADR 043 adjacency)

## Decision

`@family-os/ui` gains a second row primitive, **`ListRow`**: hairline-separated
rows (no per-row border/shadow/radius), 56px minimum height, leading control
slot, name + note lines, whole-row activation. `ItemCard` is unchanged.

**The rule, written down:**

> **Cards** when items are independent objects with several actions.
> **Rows** when items are a set you scan and act on one way.

First consumers, both the rule applied rather than exceptions to it:

- **Grocery list → `ListRow`.** Thirty items you scan and check — one action.
  As cards, five items fit a phone screen and every shadow fights the aisle
  grouping the surface exists for.
- **Meals week plan → `ItemCard`.** Seven days, each with edit, claim, and
  needs-push — several actions on an independent object, and consistent with
  chores and calendar.

"Never hand-roll a row" still holds — it now means _compose one of the two
primitives_; the ban is on ad-hoc row scaffolds, not on having exactly one
primitive.

## Why

- The grocery density failure was real: 64px card + gap ≈ 5 visible items on a
  390px phone against a ~30-item real list, and discrete floating objects are
  the wrong metaphor for entries that must cohere under an aisle heading.
- One primitive was already creaking: `ItemCard`'s chrome exists to make a row
  self-sufficient, which is exactly wrong for rows whose meaning comes from
  their group.
- Surfaced by an external design critique of the M5/1 gate; adopted with the
  scope narrowed (the critique proposed `ListRow` for the week plan too, which
  its own rule contradicts).

## Alternatives considered

- **`ItemCard chrome="bare"` for dense lists** — bare removes chrome but keeps
  the card's contract (spine, trailing, per-row activation semantics); it
  doesn't model group membership, hairlines, or a leading control slot, and
  overloading it buries the card/row distinction the rule makes legible.
- **Hold the line on one primitive** — re-rendering groceries as cards brings
  the density failure straight back.

## Do not revisit unless

A third row shape appears that neither primitive models — then decide whether
it's a variant or the taxonomy is wrong, in an ADR, not a component prop.
