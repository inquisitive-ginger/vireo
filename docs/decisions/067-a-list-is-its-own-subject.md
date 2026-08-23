# 067 — A List Is Its Own Subject, and Creating One Is Tier 4

**Status:** Decided (2026-08-23) · Applies ADR 018 (CASL subjects +
`PERMISSION_REGISTRY`) to the M5/6 grocery list

## Decision

**1. Creating a list is a new subject and a new key.** A list is not an item, so it
does not borrow `meals.GroceryItem`:

- New subject `meals.GroceryList`, one new action on it — `create`.
- One new registry key, `meals.grocery-list.create` ("Create a shopping list"),
  baseline **tier 4** (via `manage all`), grantable per profile like
  `chores.task.create` and `calendar.event.create` already are.
- **Reading a list is not separately gated.** The index shows the lists whose items
  the caller can already read, so `view meals.GroceryItem` covers it. No
  `view meals.GroceryList`, no second key that would never be revoked alone.
- Adding to an **existing** list is unchanged: `create meals.GroceryItem`, tier 1+
  (`spec.md` §Permissions). Renaming, deleting and reordering lists stay inside
  tier 4's `manage all`; runtime lists disappear by emptying, not by a delete action.

**2. The `Which aisle?` correction is settled policy, not a new decision.** The
correction writes `meals.grocery_aisle_overrides`, a family-wide row that refiles
every future add of that name. `spec.md` §Permissions already makes
`manage meals.GroceryItem` a tier-4 baseline, so AC4's silence on tier is not a gap —
the baseline applies. What this ADR does settle is the **mechanism**: the gate is
`ability.can('manage', 'meals.GroceryItem')`, not a `tier >= 4` read. A raw tier
comparison is a `TierGate` (ADR 018: a structural ceiling, not overridable), and a
parent handing a shopping teen the correction is exactly what the override system is
for.

**The naming rule this fixes for later.** The subject names the **list** and is
namespaced to the plugin that **produces** it. A future non-food list (Home Depot,
Michaels) is a second producer with its own subject, not a rename of this one; if a
platform-owned list registry ever lands, it owns merge and read the way ADR 050's
day-mark provider does, and the permission stays with the producer (ADR 066). The
tier rule is stated about **lists**, not about groceries, so a second producer
inherits it instead of inventing its own.

## Why

- **`meals.GroceryItem` cannot express it.** Its `create` is tier 1+ on purpose —
  the whole point of kids adding to the list. Overloading it to also mean "makes a
  new list" would either lift list creation to tier 1 or drop item-adding to tier 4;
  both break something already decided.
- **A list is a row, not a column** (design gate, 2026-08-23). The permission model
  should say the same thing the data model says, or the two drift.
- **The tier answer is the trip.** A list is a shopping trip someone commits to
  making; a spurious "Trader Joe's" list a kid invents costs a real person a real
  detour. Adding an onion to a trip already planned costs nothing.
- **Namespacing by producer is what makes the cross-plugin case additive.**
  Overrides are stored as `(action, subject)` strings in
  `platform.permission_overrides`; a subject rename is a data migration on live rows.
  A subject that never has to move is worth choosing now, and costs nothing to choose.

## Alternatives considered

- **Reuse `meals.GroceryItem` with a `create` on a list-shaped payload.** No new
  strings, and no way to gate the two independently. Rejected above.
- **`platform.ShoppingList` now, meals as the first producer.** Correct destination,
  wrong time — it names a platform-owned thing the platform does not own, and asks
  for a registry the gate explicitly did not build. The producer-namespaced subject
  reaches the same place additively.
- **Any tier creates a list; tier 4 deletes.** Matches "anyone can add," and it makes
  the index a scratchpad — the empty-runtime-list rule already exists so the index
  stays a set of real trips.
- **`meals.Store` or `meals.Aisle` as the subject.** Both name the grocery-specific
  framing the design gate moved away from; a non-food list has neither and would need
  a new subject on day one.

## Do not revisit unless

Lists become platform-owned with plugins as producers — at which point this stays as
`meals`' own lists and the new registry gets its own subject, or a third producer
needs a tier rule different from tier 4, which is a baseline change, not a redesign.
