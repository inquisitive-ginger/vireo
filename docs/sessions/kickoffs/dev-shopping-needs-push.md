# Kickoff — M5.5/3 · Dev: the needs-push contract

**Type:** Development · **Branch:** `dev/shopping-needs-push` (off `main`) → PR to `main`
**Modules:** `meals`, `shopping`, `packages/platform` (the bus)
**Depends on:** M5.5/2 merged

## Pre-session reads

- [ ] `CLAUDE.md` — **Standing Engineering Conventions**, all of them
- [ ] `docs/modules/shopping/spec.md` (§Boundary rules, §Events) + **`design.md`**
- [ ] **`docs/sessions/artifacts/2026-09-03-shopping-surface-explorations.html`**, read _with_
      design.md. This session ships no new surface, but the `for Thursday` note line in
      **frame S1**'s rows is what a pushed need renders as — build to that, not to prose.
- [ ] ADRs **069** (§3 and §4 — the contract _is_ this session), **050** (the provider
      precedent this copies), **067**, **018**, **013**, **022**
- [ ] `docs/modules/shopping/salvage.md` — the `push-needs` row
- [ ] `logs/2026-09-03-product-shopping-boundary.md` §"The only real coupling"
- [ ] `logs/2026-08-23-dev-calendar-day-marks.md` — how ADR 050's contract came out in code
- [ ] Worktree: copy `.env` in or `turbo dev` dies at `node: ../../.env: not found`

## Scope

Move `push-needs` off a direct table write and onto the bus: `meals` publishes a planned
meal's `needs`, `shopping` consumes and files them. Backend and the meals-side affordance
only — no new shopping surface.

## Acceptance criteria

1. **`meals` no longer writes shopping rows.** It does not import `shopping`'s Prisma
   client and holds no reference to `shopping.items` (ADR 069 §3). Grep proves it.
2. **`shopping` does not read `planned_meals`** — the meal's identity arrives in the
   payload, not by a join.
3. **The contract is an event**, `module.noun.verb` and kebab-case (`meals.needs.pushed`
   or equivalent — name it in the log). Registered on the bus; the bus enforces the shape.
4. **Filing is unchanged at the seam.** A pushed need goes through the same
   `fileAisle`/`normalizeItemName` path a manual add does — one source of truth, filed at
   write time. A push that lands under the wrong aisle is correctable by the same
   tier-4-grantable `shopping.item.manage` correction.
5. **Dedupe holds.** Pushing the same meal twice does not double rows; the key is the
   normalized name, same shape the dictionary and the overrides use.
6. **The pushed item carries its provenance** so `ListRow`'s note line can say
   `for Thursday` (design.md §Anatomy 5, artifact frame S1). Text facts only — **no
   identity chrome, no hue, no avatar** (ADR 064).
7. **The meals affordance still works** — the week page's "N things needed" link fires the
   push and reports the outcome. It reports failure too: **no blind `catch {}`**, and a
   push that did not land says so where the person who tapped it is looking.
8. Permissions via `ability.can` on `shopping.item.add` — never a `tier >= n` read.
9. `pnpm typecheck` + `pnpm test` clean. Route tests via `fastify.inject()`; the
   dedupe/filing seam unit-tested; a bus test double from `packages/test-utils`.

## Constraints

- **Do not re-litigate ADR 069.** The boundary is settled; this session implements it.
- The salvaged `push-needs` route (`apps/api/src/plugins/groceries.ts:372` on
  `dev/meals-grocery-list`, with `GroceryPushNeedsSchema` in `packages/schemas`) is the
  behaviour to preserve, **not** the wiring to preserve — it is exactly the direct write
  ADR 069 §4 forbids.
- Validation through a shared Zod schema in `@family-os/schemas` (`safeParse` → 400
  flatten). Do not hand-roll a body check.
- **`db:reset` defaults to the DEV database** and destroys the `seed-parent-1` /
  `seed-child-1` fixtures the API suite needs — set `DATABASE_URL`, re-seed after.
- **`familyos_test` rejects `migrate deploy` (P3009)** — hand-apply any new migration's SQL.
- A platform-owned list registry stays **deferred** (ADR 069's alternatives; spec.md
  §Explicitly deferred). Meals is the first producer, not the general case.

## Known trap, and one owed item you may pick up

- **`plugins/meals/src/pages/MealsPage.tsx:35` reads `const canManage = tier >= 4`** — the
  `TierGate` defect ADR 018 forbids, in a file this session is already in. It is in no
  story's scope. **Fixing it here is in scope if it stays a one-line `ability.can` swap**;
  if it grows, leave it and queue it. Either way, say which in the log.

## Outputs

- [ ] **Live-app review in the real shell with the user before any close-out task** — push
      a real meal's needs and watch the rows arrive filed, with their note line
- [ ] Standing-conventions pass · `pnpm typecheck` + `pnpm test` clean
- [ ] `progress.md` → ✅ · session log · PR to `main` · delete this kickoff
