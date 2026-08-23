# Kickoff — M5/6 · Dev: The Grocery List (capture + filing)

**Type:** Development · **Modules:** `ui` + `meals` · **Branch:** `dev/meals-grocery-list`
**Depends on:** M5/2 ✅ (`needs` ships on the meal)

## Pre-session checklist

- [ ] Read `CLAUDE.md`, `docs/modules/meals/design.md` §M5/6 (build to it — the mode
      split is retired), `spec.md` §"Database schema" + §Permissions
- [ ] Read **ADR 063** (`ListRow` beside `ItemCard`, and the rule for choosing) and
      **ADR 064** (no identity chrome on groceries)
- [ ] Read `packages/ui/src/components/item-card.tsx` + `row-actions.tsx` +
      `row-primitives.test.tsx` — the sibling primitive you are matching, and what
      `ListRow` must **not** inherit
- [ ] Read `plugins/meals/src/pages/MealsPageView.tsx` (the needs-push link lands
      here) and `apps/api/src/plugins/meals.ts` (route + Zod + event conventions)
- [ ] Worktree: copy `.env` in or `turbo dev` dies

## Session scope

_One sentence:_ Build `ListRow` in `@family-os/ui`, then the one aisle-grouped grocery
list on top of it — adds that file themselves, staples, a `needs` push from the week
plan — up to but not including shop context, sync, or offline.

## Acceptance criteria

1. **`ListRow` in `@family-os/ui`** per ADR 063: hairline-separated (no per-row
   border/shadow/radius), 56px minimum, leading control slot, name + note lines,
   whole-row activation. Storybook story + tests beside `ItemCard`'s.
2. One aisle-grouped list, **no Build/Shop toggle**. Aisle heads: 13px bold + count
   (`2 left`), full-width hairline under, sticky within the scroll context. Fixed walk
   order: Produce → Bakery → Meat → Dairy → Pantry → Frozen → Other.
3. **Add bar at the bottom on the phone** (thumb zone); the chip strip above it shows
   **staples at rest, typeahead while typing**. A new item **flashes primary-tint in
   place, in its aisle** — that is the answer to "did my add land?".
4. **Items file themselves:** the shipped aisle dictionary assigns `category` on add;
   an unknown word lands in **Other** with a one-time `Which aisle?` chip row rendered
   **on the row, in place** — never a layout jump above the list.
5. **A correction teaches a per-family override**, and re-filing an item updates it.
6. Provenance is the **note line**, one grammar: `for Sunday's rigatoni` (needs push),
   `Emma added these` (manual). Never a chip in the name line, never an avatar or a
   spine (ADR 064).
7. **Needs push:** the week page's `3 things needed` **text link** (never a bordered
   button) comma-splits `needs` into items, each noted with its meal; dedupe by name
   against open items, and re-adding an existing checked item unchecks it.
8. Tier 1+ can view and add; tier 4 manages. A kid adding is deliberate — do not gate
   it up.

## Constraints coming in

- ADR 063's rule, applied not re-litigated: rows here, cards on the week plan. Forty
  bordered cards was the density failure the M5/1 critique caught.
- `grocery_items` / `staples` columns are specified in `spec.md` — build them, don't
  redesign them. Validation through a `@family-os/schemas` Zod schema, `safeParse` →
  400 flatten. Server data via TanStack Query, profile-scoped keys, shared prefix
  between the list and anything else reading it.
- **Parallel run:** wave 1 alongside M5/3 and M5/4, and you are the biggest of the
  three — land first if the choice is yours. You own `packages/ui/**` and the new
  grocery surfaces; you share `apps/api/src/plugins/meals.ts` and
  `plugins/meals/prisma/` with M5/3. Put the grocery routes in their own file rather
  than appending to the meals plugin body, and `prisma generate` + commit only
  schema-derived generated files.

## Decisions to make

1. **Route shape** — `/groceries` as a second route in the `meals` plugin, or a tab
   inside `/meals`. The manifest carries one route and one nav item today; a second
   route means the manifest, `plugins.json`, the shell `ICON_MAP`, and the nav.
2. **Where filing happens** — the dictionary on the server at `POST` time (one source
   of truth, works for the needs push) or on the client (instant chip). The override
   table's key shape (normalized name) follows from this.
3. **`ListRow`'s API** — does it own the check ring, or take a generic leading slot
   that M5/7 fills? Decide for the primitive, not for this one consumer.
4. **Dedupe rule** for AC7 — normalized name match, and what "open" means.

## Non-goals

Whole-row checking, cleared-aisle collapse, the progress track, shopper sync,
presence, the wall, offline — all M5/7. Ship the list; do not start the store.

## Outputs (required before closing)

- [ ] Design gate: playground frames → sign-off → Storybook → integration; playground
      deleted
- [ ] Live-app review on a phone-width viewport **and** the fridge tablet
- [ ] Tests: dictionary + override filing (unit), routes (`fastify.inject()`), RTL for
      add / correct / needs-push; `ListRow` tests in `packages/ui`
- [ ] `docs/design-system.md` gains the `ListRow` entry and the card/row rule
- [ ] `pnpm typecheck` + `pnpm test` clean; progress row ✅, session log, `CLAUDE.md`,
      queue, PR; delete this kickoff
