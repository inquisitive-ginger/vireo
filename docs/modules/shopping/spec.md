# Shopping — Module Spec

**Status:** Originated 2026-09-03 (product session on the groceries boundary).
Split out of `meals` by **ADR 069**. Nothing has shipped — PR #127 was closed
unmerged, and its work below the data layer is salvage, not a baseline.

## What it is

The shared list you actually shop from. It replaces a Google Keep list the family
already keeps, which is the bar: if it is slower than Keep it will not be used.

Shopping is **not** dinner planning. Meals is one producer of things to buy; a
hardware-store run is another. The module is named for the activity, not for the
groceries that happen to be its first content (ADR 069 §2).

## Scope

- **Lists** — a list is its own row and carries its producer. Permanent lists
  (Grocery, Costco) persist; runtime lists exist while they hold items.
- **Capture** — adding a thing takes one gesture from anywhere in the house.
- **Filing** — items sort themselves into aisle/walk order **inside one list**.
  Unknown words land in Other and a correction teaches a family-wide override.
- **Shopping** — the surface you hold one-handed in a shop, offline, while moving.
- **Producers** — `meals` pushes a planned meal's `needs` across a contract.

## Explicitly deferred

- **A platform-owned list registry.** ADR 067 called it the right destination and
  ADR 069 kept it deferred. Build it when a second producer exists.
- **Spend tracking → Monarch.** Depends on M8.
- **Pantry / leftovers / "we have this already".** Meals v2.

## Boundary rules (ADR 069)

1. `shopping` owns the `shopping` Postgres schema. `meals` owns `meals`.
2. Subjects are `shopping.List` and `shopping.Item`. Keys are
   `shopping.list.create`, `shopping.item.add`, `shopping.item.manage`.
3. `meals` does not import `shopping`'s Prisma client, and `shopping` does not
   read `planned_meals`. Needs-pushing is a contract (ADR 050 precedent).
4. Aisle filing — the dictionary, `fileAisle`, `normalizeItemName`, and the
   override table — belongs to `shopping`.

## Permissions namespace

| Key                    | Subject / action       | Baseline | Grantable |
| ---------------------- | ---------------------- | -------- | --------- |
| `shopping.list.create` | `create shopping.List` | Tier 4   | Yes       |
| `shopping.item.add`    | `create shopping.Item` | Tier 1   | Yes       |
| `shopping.item.manage` | `manage shopping.Item` | Tier 4   | Yes       |

Reading a list is not separately gated — `view shopping.Item` covers the index
(ADR 067, namespace updated by 069). Gates are `ability.can`, never a `tier >=`
read: a raw tier comparison is a structural ceiling the override system cannot
reach (ADR 018), and a parent handing a shopping teen the correction is exactly
what overrides are for.

## Events namespace

`shopping.item.added` · `shopping.item.checked` · `shopping.list.created`

Replaces `meals.grocery.added`. Meals' needs-push is the first cross-plugin
consumer of the contract.

## What is carried over from the closed PR #127

Salvage, pending the design exploration:

- The **aisle dictionary** (~373 lines) and its filing/override tests. Aisle order
  is walk order regardless of what the surface looks like or where it lives.
- The **Zod schemas**, the **API routes**, and the **migrations** — all need
  renamespacing to `shopping`, none need rethinking.
- **ADR 068** and the `ListRow` primitive it governs — both branch-only. Neither
  `list-row.tsx` nor ADR 068 is on `main`, so ADR number 068 is reserved, not free.
  Whether the primitive survives is M5.5/1's call.

**Not carried over:** the index-of-lists surface, the drill-in shape, and the
`2026-08-23-grocery-list-handoff.md` contract. Those are superseded and are the
subject of a fresh design exploration.
