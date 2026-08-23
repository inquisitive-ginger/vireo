# 2026-08-23 — Design: the grocery list (M5/6)

Ran the design gate PR #127 skipped. Spec is
`artifacts/2026-08-23-grocery-list-handoff.md`; options and rejected directions
are `artifacts/2026-08-23-grocery-list-diverge.html`.

## What was decided

The list replaces a shared Google Keep list, and that reframed the story. Keep
groups by **where you shop** — Grocery Store, Costco, Farmers Market — not by
aisle. So each store is its **own list**, not a heading inside one; you should
not see Costco while standing in the grocery store.

Store became a container rather than a grouping, which **rescued the aisle
dictionary** rather than killing it: inside one store, aisle order is walk
order. It was only wrong because it was being asked to sort three shops at once.

Settled: home is an index of lists, tap to enter one full-screen; permanent
lists (Grocery, Costco) stay visible and dim at zero while runtime lists appear
only while they hold items; tier 4 creates lists; typing gets inline ghost
completion, not a suggestion sheet or a pill strip; a row is name plus
right-aligned quantity with **no note line**; the wall tablet gets the same
structure as the phone, no columns.

## What was sent back and why

Nothing was sent back to a dev agent — the first diverge pass was thrown away
whole. It was run as a cloud routine against a brief that let the **agent choose
the axis**, and it chose "where does the check control sit," which is an
implementation question in design clothes. It also built the options inside the
shell, one import from `ListRow`, which produces developer-shaped design no
matter what the prompt says.

Both causes were in the definition, not the agent. `dev.md`, `reviewer.md`,
`design.md` and the design template were amended the same day — see
`3ad428b` and `23ce304`.

## What the ungated build got right

`ListRow` **needs no change.** It already takes a generic `leading` slot rather
than owning a check ring, which was ADR 063's open question. The design pass
validated the primitive and replaced everything above it. Worth remembering the
next time a gate feels like overhead: it wasn't the primitive that was wrong.

## Amendments

- **AC6 and AC7 are superseded.** Needs-pushed items arrive as **plain items**.
  A meal pushing three items is exactly the duplication the note line was cut
  for, and aisle grouping guarantees those items are never adjacent. The week
  page's `N things needed` link still creates them; it just doesn't mark them.
  This also supersedes design.md's "provenance is one grammar" for groceries.
- **ADR 067** settles list permissions: subject `meals.GroceryList`, one action
  `create`, key `meals.grocery-list.create`, tier-4 baseline and grantable.

## Open questions raised

- **`grocery_items` needs a list reference**, not a bare store value. The PR's
  model has neither column. This is the single schema change the gate forces,
  and it decides whether cross-plugin lists are possible later or a rewrite.
- **A cross-plugin shopping list is coming** — a Home Depot or Michaels run is
  the same need and is not meals' business. Explicitly **not built**. ADR 050's
  day-mark provider contract is the precedent when it lands. Three things must
  not preclude it: a list is its own row, the list carries its producer, and
  aisle grouping is a property of the list rather than of the app.

## What the next session needs to know

The build kickoff (`dev-grocery-list.md`) is rewritten against this spec and
carries no design gate — per the amended `dev.md`, a kickoff listing a design
gate is a kickoff whose design session hasn't happened.

One concrete defect for the build: `plugins/meals/src/pages/GroceriesPage.tsx:26`
reads `const canCorrect = tier >= 4`. Per ADR 018 a raw tier comparison is a
`TierGate` — a structural ceiling the override system cannot reach — so a parent
can never grant a shopping teenager the correction. It must be
`ability.can('manage', 'meals.GroceryItem')`. The server route is already right;
two reviewers read this as "matches spec" without noticing the mechanism.

Also fixed in passing: `spec.md` §Permissions named `meals.Meal` in four places.
That subject has never existed — the code uses `meals.PlannedMeal`, and claim is
`update` narrowed by the route.
