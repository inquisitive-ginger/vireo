# 068 — Row Height Belongs to the Primitive, and Targets Do Not Touch

**Status:** Decided (2026-08-26, M5/6 live review) · Refines ADR 063 (the two row
primitives); does not change which primitive a surface picks · §3's arithmetic
corrected the same day, after measuring it

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

The two floors are not a compromise: 64px on a 30-item list is the density failure
ADR 063 exists to fix. `--spacing-touch` (48px) is unchanged.

**2. The primitive applies its own floor; a caller cannot lower it.** Both
components emit `min-h-[var(--spacing-*-touch)]` **after** `className` in `cn()`,
so `tailwind-merge` drops a consumer's competing `min-h-*` rather than honouring
it. The arbitrary-value form is load-bearing: `tailwind-merge` does not recognise
the named utility (`min-h-card-touch`) as a `min-h`, so it passes both classes
through and leaves the winner to CSS source order — verified 2026-08-26. A row
that needs to be taller gets there through content or padding, as both primitives
already grow. `ItemCard`'s floor binds when the card is interactive
(`onActivate`); `ListRow`'s is unconditional — list rhythm wants it too.

This is the general answer to token-vs-component: **the token is authoritative,
and the primitive is the only thing allowed to read it.** A number that appears in
a consumer, a story spec, or an AC is a copy, and copies drift.

**3. Adjacent activation targets need ≥8px of dead space between them. Chrome gaps
count; hairlines do not.** `ListRow`'s overlay becomes
`inset-x-0 inset-y-[3.5px]`, giving **48px live, 8px dead** on a 56px row.
`ItemCard` keeps `inset-0`; cards are laid out with real gaps, so their targets
are already separated. **The hairline does not move** — it is the row's own
`border-b`, not the target's edge, so density and grouping are untouched.

The half-pixel is not a fudge, it is the hairline. Under `border-box` an
absolutely-positioned overlay is laid out against the **padding** box, and the
border sits outside it: a 56px row with a 1px hairline offers the target only
55px. So the gutter is `(56 − 1 − 48) / 2 = 3.5px`, and the dead band is
`3.5 + 1 + 3.5 = 8`. The two invariants are **live ≥ `--spacing-touch` (48px)**
and **dead ≥ 8px**; the inset is derived from them and the hairline, and is
re-derived — never nudged — if any of the three changes. The bracket-arbitrary
`[3.5px]` is allowed by the exemption the spacing rules already grant
component-internal geometry, which is exactly what this is.

**56px stands.** The hairline is internal to `ListRow`, so its pixel is absorbed
internally. Raising the token to 57px instead would export a border-box artifact
into the number ADR 063, the specs, and every consumer read.

A tap in the dead band does nothing. That is the point: a no-op costs one more
tap, a mis-toggle corrupts the list you are standing in a shop reading.

**4. M5/6's "56px min" AC is ratified in value, retired in form.** 56px was right;
the AC is not where it belongs. The AC becomes "rows are `ListRow`", full stop.
**Superseded outright:** `GroceryRow`'s `min-h-11` (44px) override — under the
house's own 48px control minimum, on the one surface where every row is a target
and the user is one-handed and moving.

## Why

- The house had a declared minimum (64px) that one of its two row primitives
  ignored, a spec contradicting the token, and a consumer undercutting both.
  Nothing said which was right, so each layer picked a number in good faith.
- Whole-row checking landed in M5/6, so a grocery row went from a thing you read
  to a thing you tap, ~30 times, in a shop. Flush `inset-0` targets on 44px rows
  put a boundary every 44px with no margin for a thumb.
- Writing the floor down was already tried: `design-system.md` has said "list
  items minimum 64px" since M0, and prose did not stop a hardcoded `min-h-14`.
  Ordering inside `cn()` will.

## Alternatives considered

- **One floor for both primitives.** 64px everywhere re-creates the density
  failure; 56px everywhere thins cards for no reason. The primitives differ
  because their jobs differ — so do their floors.
- **Lint or a CI grep for `min-h-` on a row.** Brittle across multi-line JSX, and
  it reports after the fact. Making the override impossible beats catching it.
- **A gap between rows instead of an inset.** Gaps break the hairline grouping the
  aisle heads depend on and cost ~8px per row. The inset separates the targets
  while the rows stay visually continuous.
- **Let the nearer row win a boundary tap.** Still guesses, and guesses wrong half
  the time, with a destructive-feeling result.
- **Ship the 47px live / 9px dead** a whole-pixel `inset-y-1` actually yields,
  and call the hairline paid out of the target. One pixel is no usability defect
  — but 48px has been declared in five places since the 2026-07-10 token audit,
  and "close enough" against a declared minimum is how the 44px override happened.
- **`--spacing-list-touch: 57px`**, so `inset-y-1` lands on 48/8. Whole numbers,
  but it puts a border-box artifact in ADR 063's stated height, and 57 reads as a
  typo to every future reader.

## Do not revisit unless

A third row primitive appears (it earns its own token by the same rule), or a
surface wants a row target under 48px — which means it wants a different
primitive, not a smaller floor.
