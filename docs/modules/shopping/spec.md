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
2. Subjects are `shopping.List` and `shopping.Item`. The keys are the seven in
   §Permissions namespace below (ADR 071 completed the set; ADR 073 added
   `retract`).
3. `meals` does not import `shopping`'s Prisma client, and `shopping` does not
   read `planned_meals`. Needs-pushing is a contract (ADR 050 precedent).
4. Aisle filing — the dictionary, `fileAisle`, `normalizeItemName`, and the
   override table — belongs to `shopping`.

## Permissions namespace

The complete key set (ADR 071, 073). Nothing outside this table is gated:

| Key                     | Subject / action        | Baseline | Grantable |
| ----------------------- | ----------------------- | -------- | --------- |
| `shopping.list.create`  | `create shopping.List`  | Tier 4   | Yes       |
| `shopping.item.view`    | `view shopping.Item`    | Tier 1   | Yes       |
| `shopping.item.add`     | `create shopping.Item`  | Tier 1   | Yes       |
| `shopping.item.check`   | `check shopping.Item`   | Tier 2   | Yes       |
| `shopping.item.retract` | `retract shopping.Item` | Tier 1   | Yes       |
| `shopping.item.file`    | `file shopping.Item`    | Tier 4   | Yes       |
| `shopping.item.manage`  | `manage shopping.Item`  | Tier 4   | Yes       |

**Checking off is `check`, and unchecking is the same key** (ADR 071) — a toggle,
not a one-way door, so the person who mis-taps in an aisle can undo it there.
Tier 2 keeps the youngest adder off it while leaving the partner shopper and the
kid sent down an aisle able to work.

**The aisle correction is `file`, not `manage`** (ADR 071). The tier is unchanged
from ADR 067/069 — it writes a family-wide override that refiles every future add
of that name — but it is its own action so that granting it to a shopping teen does
not also grant delete and rename.

**Taking back your own add is `retract`, tier 1, for fifteen minutes** (ADR 073).
Scoped by CASL condition to `{ addedBy: profile.id }` and by an `added_at` window
checked in the route; it hard-deletes the row and does not un-teach `Entry`, so a
retracted typo stays in the name dictionary. Removing anything else — anyone else's,
or older than the window — stays `manage`, tier 4. On the wall every add is
`added_by = 'family'`, so anyone standing there can retract what the wall added in the
window. The route checks `addedBy` itself: a permission override replays as
`can(action, subject)` with no conditions, so a regrant would arrive unscoped.

**The wall rides `shopping.item.add`** (ADR 072) — the family pseudo-profile is
tier 1, so it already holds the key, and the wall gets no key of its own. A house
that does not want anonymous wall adds revokes `shopping.item.add` for the
`family` profile.

Reading is `shopping.item.view` and covers the list itself — there is no separate
list-read key (ADR 067, namespace updated by 069, enumerated by 071). Gates are
`ability.can`, never a `tier >=` read: a raw tier comparison is a structural ceiling the override system cannot
reach (ADR 018), and a parent handing a shopping teen the correction is exactly
what overrides are for.

## Events namespace

`shopping.item.added` · `shopping.item.checked` · `shopping.item.removed` ·
`shopping.item.renamed` · `shopping.list.created`

**A wall add emits the same `shopping.item.added`** (ADR 072), distinguished by
`addedBy === 'family'` in the payload rather than by a second event name.

**Unchecking emits the same `shopping.item.checked`**, carrying
`status: 'needed' | 'got'` (settled M5.5/4). There is no `shopping.item.unchecked`.
The three candidates were a second event name, one event carrying the state, and
nothing at all:

- **A second name** loses to the rule ADR 072 §5 already set for the wall add — a
  consumer that cares tests the value, and a second name makes every consumer
  subscribe twice and eventually forget one. It would also split what ADR 071 §2
  deliberately joined: unchecking is not a second capability, it is the same key
  in the other direction.
- **Nothing** was the tempting one, and it is wrong for the reason this session
  exists: the second shopper's screen is driven off this event, so an unchecked
  row would silently stay struck through on the other phone until something else
  happened to invalidate it.

Only a real transition is announced — re-asserting a state a row is already in
writes nothing and emits nothing, so the other phone is not asked to refetch for
a change that did not happen.

**A retract and a tier-4 delete both emit `shopping.item.removed`** (ADR 073) —
`{ itemId, listId, name, by, reason }`, `reason: 'retracted' | 'managed'`. One
transition, one name; `name` rides along because the row is gone by the time a
consumer reads it.

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
