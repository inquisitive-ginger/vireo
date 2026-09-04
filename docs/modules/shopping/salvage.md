# Shopping — the salvage inventory from PR #127

PR **#127 is closed unmerged**; its branch `dev/meals-grocery-list` still exists locally.
Read it with `git show dev/meals-grocery-list:<path>` — **do not check it out** (it is also
live in a worktree).

Everything below the data layer is salvage. Everything above it is the **superseded
index-and-drill-in shape** and is not carried over (ADR 069, `design.md`).

## Take

| Path on `dev/meals-grocery-list`                                               | Lines | What it is                                                                                                                                                                                                                 | Lands in                             |
| ------------------------------------------------------------------------------ | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| `plugins/meals/src/lib/aisle-dictionary.ts`                                    | 373   | The dictionary, `normalizeItemName`, `lookupDictionaryAisle`. Longest-key-first whole-word matching. Take verbatim.                                                                                                        | M5.5/2                               |
| `plugins/meals/src/lib/grocery-filing.ts`                                      | 23    | `fileAisle` (override → dictionary → `Other`) and `aisleSortIndex`. Pure, DB-free.                                                                                                                                         | M5.5/2                               |
| `plugins/meals/src/lib/grocery-filing.test.ts`                                 | 71    | Filing + override tests                                                                                                                                                                                                    | M5.5/2                               |
| `packages/schemas/src/index.ts`                                                | +63   | `GROCERY_AISLES`, `GroceryAisleSchema`, and `GroceryItemCreateSchema` · `GroceryAisleCorrectionSchema` · `GroceryListCreateSchema` · `GroceryCheckSchema` · `GroceryPushNeedsSchema`. Drop the `Grocery` prefix on rename. | M5.5/2 (check → /4, push-needs → /3) |
| `apps/api/src/plugins/groceries.ts`                                            | 457   | Eight routes: `GET/POST /groceries/lists`, `GET /groceries/lists/:id`, `GET /groceries/entries`, `POST /groceries/lists/:id/items`, `POST /groceries/:id/aisle`, `POST /groceries/:id/check`, `POST /groceries/push-needs` | M5.5/2 (check → /4, push-needs → /3) |
| `apps/api/src/plugins/groceries.test.ts`                                       | 762   | The route suite, `fastify.inject()` throughout                                                                                                                                                                             | with its routes                      |
| `plugins/meals/prisma/schema.prisma`                                           | +77   | `GroceryItem`, `GroceryList`, `GroceryEntry`, `GroceryAisleOverride` and their reasoning comments                                                                                                                          | M5.5/2                               |
| `plugins/meals/prisma/migrations/20260822120000_grocery_list/migration.sql`    | 39    | items table                                                                                                                                                                                                                | re-authored against `shopping`       |
| `plugins/meals/prisma/migrations/20260822120100_seed_staples/migration.sql`    | 16    | seed                                                                                                                                                                                                                       | re-authored                          |
| `plugins/meals/prisma/migrations/20260823120000_grocery_lists/migration.sql`   | 42    | lists table + the two permanent lists                                                                                                                                                                                      | re-authored                          |
| `plugins/meals/prisma/migrations/20260823150000_grocery_entries/migration.sql` | 48    | entries + aisle overrides                                                                                                                                                                                                  | re-authored                          |
| `packages/ui/src/components/list-row.tsx`                                      | 86    | The `ListRow` primitive (ADR 063). **Not on `main`.** Keep ADR 068's `inset-y-[3.5px]` derivation and the after-`className` `min-h` ordering — both are load-bearing and commented.                                        | M5.5/2                               |
| `packages/ui/src/components/list-row.stories.tsx`                              | 94    | Storybook                                                                                                                                                                                                                  | M5.5/2                               |
| `packages/ui/src/components/row-primitives.test.tsx`                           | 84    | Height-floor tests for both primitives                                                                                                                                                                                     | M5.5/2                               |
| `packages/ui/src/styles.css`                                                   | +16   | `--spacing-row-touch` → `--spacing-card-touch`, plus `--spacing-list-touch: 56px`                                                                                                                                          | M5.5/2                               |
| `packages/ui/src/lib/utils.ts`                                                 | +1    | one `cn` helper tweak                                                                                                                                                                                                      | M5.5/2                               |
| `docs/decisions/068-row-height-belongs-to-the-primitive.md`                    | 105   | **Branch-only.** ADR number 068 is reserved for this file — `docs/decisions/` on `main` skips 067 → 069. Port as-is; do not renumber, do not reuse the number.                                                             | M5.5/2                               |
| `docs/design-system.md`                                                        | +105  | The card-row primitive section and the two floors                                                                                                                                                                          | M5.5/2                               |
| `packages/platform/src/types.ts`                                               | +30   | Four `PERMISSION_REGISTRY` rows — **shape only.** Keys renamespace to spec.md's three.                                                                                                                                     | M5.5/2                               |
| `packages/platform/src/ability.ts`                                             | +13   | The per-tier grants — **shape only.** The branch's `check` action is an open question, see below.                                                                                                                          | M5.5/2 / M5.5/4                      |

## Do not take

The rejected surface: `plugins/meals/src/pages/GroceriesIndexPage.tsx`,
`GroceriesIndexPageView.tsx`, `GroceriesIndexPageView.test.tsx`, `GroceryListPage.tsx`,
`GroceryListPageView.tsx`, `GroceryListPageView.test.tsx`, and
`plugins/meals/src/components/{GroceryListCard,GroceryRow,GroceryCompletionField}.tsx`.

Also superseded and banner-marked: `docs/sessions/artifacts/2026-08-23-grocery-list-handoff.md`
and `2026-08-23-grocery-list-devready.html`.

`GroceryCompletionField.tsx` is the ghost-completion field. The `Entry` model **does** move
(ADR 069 §1 names it) but `design.md`'s anatomy has **no completion UI** — do not build one
back from this file.

## The one thing the branch has that the docs do not

The branch added a **`check` action** on `meals.GroceryItem`, granted at **tier 2+** and
registered as `meals.grocery.check`. Neither ADR 067, ADR 069 §3, nor `spec.md`'s
permission table carries it: under the docs as written, checking an item off falls under
`manage shopping.Item`, which is **tier 4**. That would stop a tier-2/3 partner shopper
from checking anything in an aisle. **M5.5/4 owns the decision and must flag it rather
than improvise one** — it is a namespace question, so it goes back to the architect.
