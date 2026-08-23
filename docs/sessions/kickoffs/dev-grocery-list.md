# Kickoff — M5/6 · Dev: The Grocery List (rework on PR #127)

**Type:** Development · **Modules:** `ui` + `meals` · **Branch:** `dev/meals-grocery-list` (PR #127, open)
**Depends on:** M5/2 ✅ · design gate closed 2026-08-23 · ADR 067

## Pre-session checklist

- [ ] Read `CLAUDE.md`, then **`docs/sessions/artifacts/2026-08-23-grocery-list-handoff.md`
      — that spec is the contract**. Build from it, not from `design.md` §M5/6 and not
      from the exploration HTML beside it.
- [ ] Read **ADR 067** (list = its own subject, tier 4 to create), **ADR 063**
      (`ListRow` beside `ItemCard`), **ADR 064** (no identity chrome on groceries),
      **ADR 018** (registry + why a tier read is not a gate)
- [ ] Read your own branch: `plugins/meals/src/pages/GroceriesPage(View).tsx`,
      `apps/api/src/plugins/groceries.ts`, `plugins/meals/prisma/schema.prisma`
- [ ] `docs/modules/meals/spec.md` §Permissions — and note the two drifts logged there
- [ ] Worktree: copy `.env` in or `turbo dev` dies

## Session scope

_One sentence:_ Rework PR #127 above the data layer into an **index of lists plus a
per-list view**, add the list row to the data model and the permission registry, and
fix the one tier-read gate — up to but not including shop context, sync, or offline.

## What survives on #127, unchanged

The aisle dictionary, the Zod schemas, the API routes, the migrations, and the tests
**stand**. Aisle grouping survives **inside a store** — walk order is still the
grouping inside one list. This is a rework above the data layer, not a restart.

## What changes

1. **The page becomes two surfaces.** An index of lists (tap enters one full-screen)
   plus a per-list view. Permanent lists stay visible and dim at zero; runtime lists
   appear only while they hold items. Inside a list the destination is implied — no
   store picker; only the index needs `Add to…`. Same structure on the wall tablet,
   larger type, **no columns**.
2. **`grocery_items` needs a list reference.** The model today has neither a store nor
   a list column — a list is its own row with its own producer, and the item points at
   it. New migration; the existing ones stay.
3. **`design-system.md`'s 44-line `ListRow` entry is replaced**, not appended to. It
   records an ungated call; the gate's outcome supersedes it.
4. **`ListRow` itself needs no change.** It already takes a generic `leading` slot
   rather than owning a check ring — that was ADR 063's open question and the gate kept
   the answer. Quantity goes in `children` beside the `min-w-0 flex-1` wrapper. **Do not
   redesign the primitive.**
5. **One concrete defect.** `plugins/meals/src/pages/GroceriesPage.tsx:26` reads
   `const canCorrect = tier >= 4`. Per ADR 018 a raw tier comparison is a `TierGate` — a
   structural ceiling the override system cannot reach — and a parent handing a shopping
   teen the correction is exactly what overrides are for. It must be
   `ability.can('manage', 'meals.GroceryItem')`. The tier is right; the mechanism is
   wrong. **The server route is already correct** — this is client-side only.
6. **ADR 067's new registry key.** `meals.grocery-list.create` ("Create a shopping
   list"), subject `meals.GroceryList`, action `create`, baseline tier 4 via
   `manage all`, grantable per profile. Reading a list is **not** separately gated —
   `view meals.GroceryItem` covers the index. Adding to an existing list is unchanged.

## Settled — not decisions for this session

- **Needs-pushed items arrive as plain items.** There is no note line, so the original
  **AC6 and AC7 are superseded**: the week page's `N things needed` link still
  comma-splits `needs` into items, it just does not mark them with their meal. Do not
  quietly reintroduce the note.
- **Row content** is name plus quantity, right-aligned and tabular when set.
- **Typing** is inline ghost completion in the field — nothing appears, nothing moves;
  Tab or right-arrow accepts. Not a suggestion sheet, not a pill strip.
- Rejected directions and their reasons are in the handoff spec. Read them before
  proposing an alternative.

## Constraints coming in

- **A list is its own row, never a column on the item. The list carries its producer.
  Aisle grouping is a property of the list, not of the app.** A cross-plugin shopping
  list (Home Depot, Michaels) is explicitly **not being built** — but the model must not
  preclude it. Subject names stay namespaced to the producing plugin (ADR 067): a
  subject rename is a data migration on live `platform.permission_overrides` rows.
- The remaining ACs from `design.md` §M5/6 stand as written: items file themselves via
  the shipped dictionary, unknown words land in **Other** with an in-place
  `Which aisle?` row (never a layout jump), a correction teaches a per-family override,
  and a just-added item flashes in place in its aisle.
- Standard: server data via TanStack Query with a shared `meals/groceries` key prefix,
  validation through `@family-os/schemas` (`safeParse` → 400 flatten), grocery routes
  stay in their own `groceries.ts`, `prisma generate` commits only schema-derived files.
- **Wave-2 neighbours:** M5/7 builds on this branch. Do not start the store.

## Non-goals

Whole-row checking, cleared-aisle collapse, the progress track, shopper sync, presence,
the wall's own layout, offline — all M5/7.

## Outputs (required before closing)

- [ ] **Live-app review** at phone width **and** on the fridge tablet — the only user
      gate this session owes. The design gate is closed; do not re-run it.
- [ ] Tests: dictionary + override filing (unit), routes (`fastify.inject()`), RTL for
      add / correct / needs-push and the index → list drill-in
- [ ] `docs/design-system.md` — the `ListRow` entry **replaced** by the gate's outcome
- [ ] `pnpm typecheck` + `pnpm test` clean; progress row ✅, session log, `CLAUDE.md`,
      queue, PR #127 updated; delete this kickoff
