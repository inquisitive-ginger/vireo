# 068 — Row Height Belongs to the Primitive, and Targets Do Not Touch

**Status:** Decided (2026-08-26, M5/6 live review) · Refines ADR 063 (the two row
primitives); does not change which primitive a surface picks

## Decision

**1. Two floors, one per primitive, and you never choose a number.** You choose a
primitive by ADR 063's rule — cards for independent objects, rows for a scanned
set — and the primitive brings its height:

| Primitive  | Floor | Token                  |
| ---------- | ----- | ---------------------- |
| `ItemCard` | 64px  | `--spacing-card-touch` |
| `ListRow`  | 56px  | `--spacing-list-touch` |

`--spacing-row-touch` is **renamed** to `--spacing-card-touch`. "Row" was the
ambiguous word: it named the card floor while a row primitive existed with a
different one, which is how 64/56/44 all came to be true at once.

The two floors are not a compromise — 64px on a 30-item list is the density
failure ADR 063 exists to fix, and 56px on a self-sufficient card is thinner than
its own padding wants. `--spacing-touch` (48px) is unchanged and still binds every
control that is not a row.

**2. The primitive applies its own floor; a caller cannot lower it.** Both
components emit `min-h-[var(--spacing-*-touch)]` **after** `className` in `cn()`,
so `tailwind-merge` drops a consumer's competing `min-h-*` rather than honouring
it. The arbitrary-value form is load-bearing: `tailwind-merge` does not recognise
the named utility (`min-h-card-touch`) as a `min-h`, so it lets both classes
through and leaves the winner to CSS source order — verified 2026-08-26. A row that needs to be taller gets there through content or padding, which is
how both primitives already grow. `ItemCard`'s floor binds when the card is
interactive (`onActivate`); `ListRow`'s is unconditional, because even list rhythm
wants it.

This is the general answer to token-vs-component: **the token is authoritative,
and the primitive is the only thing allowed to read it.** A number that appears in
a consumer, a story spec, or an AC is a copy, and copies drift.

**3. Adjacent activation targets need ≥8px of dead space between them. Chrome gaps
count; hairlines do not.** `ListRow`'s overlay becomes `inset-x-0 inset-y-1`: a
4px dead band at each edge, 8px between neighbours, and a 48px live target on a
56px row — the floor is defined as `--spacing-touch` + 2×4px, and must stay so.
`ItemCard` keeps `inset-0`; cards are laid out with real gaps, so their targets
are already separated. **The hairline does not move** — it is the row's own
`border-b`, not the target's edge, so density and grouping are untouched.

A tap in the dead band does nothing. That is the point: a silent no-op costs one
more tap, a mis-toggle silently corrupts the list you are standing in a shop
reading.

**4. M5/6's "56px min" AC is ratified in value and retired in form.** 56px was the
right number; the AC should not be the place it is written. The AC becomes "rows
are `ListRow`", full stop. **Superseded outright:** `GroceryRow`'s `min-h-11`
(44px) override — below the house's own 48px control minimum, on the one surface
where every row is a target and the user is one-handed and moving.

## Why

- The house had a declared minimum (64px) that one of its two row primitives
  ignored, a spec that contradicted the token, and a consumer that undercut both.
  Nothing said which was right, so each layer picked a number in good faith.
- Whole-row checking landed in M5/6, so a grocery row went from a thing you read
  to a thing you tap, ~30 times, in a shop. Flush `inset-0` targets on 44px rows
  put a boundary every 44px with no margin for a thumb.
- Writing the floor down was already tried — `design-system.md` has said "list
  items minimum 64px" since M0. Prose did not stop a hardcoded `min-h-14`, and
  will not stop the next one. Ordering inside `cn()` will.

## Alternatives considered

- **One floor for both primitives.** 64px everywhere re-creates the density
  failure; 56px everywhere thins cards for no reason. The primitives differ
  because their jobs differ — so do their floors.
- **Lint or a CI grep for `min-h-` on a row.** Brittle across multi-line JSX, and
  it fails after the fact. Making the override impossible beats reporting it.
- **A gap between rows instead of an inset.** Gaps break the hairline grouping the
  aisle heads depend on and cost ~8px of vertical per row. The inset separates the
  targets while the rows stay visually continuous.
- **Let the nearer row win a boundary tap.** Still guesses, and guesses wrong half
  the time, with a destructive-feeling result.

## Do not revisit unless

A third row primitive appears (then it earns its own token by the same rule), or a
surface needs a row target smaller than 48px — which is a signal the surface wants
a different primitive, not a smaller floor.
