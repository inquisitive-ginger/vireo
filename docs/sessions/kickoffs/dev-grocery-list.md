# Kickoff — M5/6 · Dev: The Grocery List (rework on PR #127)

**Type:** Development · **Branch:** `dev/meals-grocery-list` (PR #127, open)
**Depends on:** M5/2 ✅ · design gate closed 2026-08-23 · ADR 067

## Pre-session checklist

- [ ] Read `CLAUDE.md`, then **`artifacts/2026-08-23-grocery-list-handoff.md` (the
      contract) and `artifacts/2026-08-23-grocery-list-diverge.html` (the visual
      reference) — both**. Its rejected directions are why; read them first. The
      index of lists is the subject of that page; the composer is secondary.
- [ ] **ADR 067** (list = its own subject, tier 4 to create), **063** (`ListRow`),
      **064** (no identity chrome on groceries), **018** (registry; a tier read is not
      a gate)
- [ ] Your branch: `plugins/meals/src/pages/GroceriesPage(View).tsx`,
      `apps/api/src/plugins/groceries.ts`, `plugins/meals/prisma/schema.prisma`
- [ ] `spec.md` §Permissions — the `meals.grocery-list.create` row is written already

## Session scope

_One sentence:_ Rework PR #127 above the data layer into an **index of lists plus a
per-list view**, add the list row to the data model and the permission registry, and
fix the one tier-read gate — up to but not including shop context, sync, or offline.

## You are amending #127, not opening a new PR

Push to the branch — it is rebased onto main (post-#124) and mergeable. The
aisle dictionary, Zod schemas, API routes, existing migrations and tests **stand**;
aisle grouping survives _inside_ a store. So does the reviewer send-back already on the
branch (error placement, persisted `hasOverride`, `Leave it`, fixed add bar) — the
tier-4 fix below changes its **mechanism**, not the outcome the reviewer asked for.
The PR body still says "provenance is the note line"; update it before closing.

## What changes

1. **The page becomes two surfaces.** An index of lists (tap enters one full-screen)
   plus a per-list view. Permanent lists stay visible and dim at zero; runtime lists
   appear only while they hold items. Inside a list the destination is implied — no
   store picker; only the index needs `Add to…`. Same on the wall, larger type, **no
   columns**.
2. **`grocery_items` needs a list reference** — a list table plus `list_id`, in a
   **new** migration; the branch's `20260822120000` is applied in dev DBs, so editing it
   breaks replay. Seed the permanent lists like `20260822120100_seed_staples`, backfill
   existing rows onto one, then `NOT NULL`. `familyos_test` rejects `migrate deploy`
   (P3009) — hand-apply the SQL there.
3. **The gate at `GroceriesPage.tsx:26`.** `const canCorrect = tier >= 4` becomes
   `ability.can('manage', 'meals.GroceryItem')` — the tier is right, the mechanism is a
   `TierGate` overrides cannot reach (ADR 018/067). The correction **route** is already
   correct (`groceries.ts:180`); this is client-side only.
4. **ADR 067's registry key**, in `packages/platform/src/types.ts`:
   `meals.grocery-list.create` ("Create a shopping list"), subject `meals.GroceryList`,
   action `create`; add that subject to `ability.ts`'s `Subjects` union. Tier 4 reaches
   it via `manage all` — no tier branch changes. The create-list route gates on it and
   **does not exist yet**. Reading is not separately gated (`view meals.GroceryItem`).
5. **`ListRow` itself needs no change.** Its generic `leading` slot was ADR 063's open
   question and the gate kept the answer. Quantity goes in `children` beside the
   `min-w-0 flex-1` wrapper. **Do not redesign the primitive.** Its `design-system.md`
   entry is replaced by the gate's outcome ("a fact in the note line" is the false part).

## Decisions this session makes

- **How the drill-in is addressed.** The shell registers manifest routes exactly
  (`main.tsx:125`), so `/groceries/:id` hits the shell catch-all and renders nothing.
  Declare `/groceries/*` in the manifest, or keep the drill-in in component state.
- **Whether `GroceryItem.note` survives** the note line's removal. M5/7's "Sam got it"
  assumes it; the gate cut the surface it rendered on.

## Constraints coming in

- **Needs-pushed items arrive as plain items**, so `design.md`'s **AC6 and AC7 are
  superseded**: the week page's `N things needed` link still comma-splits `needs` into
  items, it just does not mark them with their meal. Do not reintroduce the note.
- **A list is its own row, never a column on the item; it carries its producer; aisle
  grouping is a property of the list, not of the app.** A cross-plugin list (Home Depot)
  is **not being built**, but the model must not preclude it. Subjects stay namespaced
  to the producing plugin — a rename is a data migration on live override rows.
- The remaining `design.md` §M5/6 ACs stand: items file themselves via the dictionary,
  unknown words land in **Other** with an in-place `Which aisle?` row (never a layout
  jump), a correction teaches a per-family override, a just-added item flashes in place.
- Standard: TanStack Query on a shared `meals/groceries` key prefix, validation through
  `@family-os/schemas`, grocery routes stay in `groceries.ts`, `prisma generate` commits
  only schema-derived files.
- **Non-goals — all M5/7:** whole-row checking, cleared-aisle collapse, the progress
  track, shopper sync, presence, the wall's own layout, offline. It builds on this
  branch; its kickoff's wall-columns and note-line ACs are amended to the gate.

## Outputs (required before closing)

- [ ] **Live-app review** at phone width **and** on the fridge tablet — the only user
      gate this session owes. The design gate is closed; do not re-run it.
- [ ] Tests: dictionary + override filing (unit), routes (`fastify.inject()`), RTL for
      add / correct / needs-push and the drill-in
- [ ] `docs/design-system.md` — the `ListRow` entry **replaced** by the gate's outcome
- [ ] `pnpm typecheck` + `pnpm test` clean; progress row ✅, session log, `CLAUDE.md`,
      queue, PR #127 updated; delete this kickoff
