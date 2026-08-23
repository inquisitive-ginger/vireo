# Kickoff — M5/7 · Dev: Shop Context, Sync + Offline, the Wall

**Type:** Development · **Modules:** `meals` + `shell` (service worker)
**Branch:** `dev/meals-grocery-shop` · **Depends on:** M5/6 (`ListRow`, the grocery
tables, the list surface) — **genuinely serial, this is the same surface**

## Pre-session checklist

- [ ] Read `CLAUDE.md`, `docs/modules/meals/design.md` §M5/7, `spec.md` §"Build mode
      and shop mode" (design for **shop**; dim in place, never vanish — as amended)
- [ ] Read `apps/shell/public/sw.js` — `/api/` and `/events` are **network-first by
      design**, so today the list fails in the exact place it is used
- [ ] Read `logs/2026-07-19-dev-sw-cache-strategy.md` — the SW has bitten twice; know
      what it cost before touching it
- [ ] Read M5/6's shipped grocery routes, query keys, and `ListRow`
- [ ] Worktree: copy `.env` in or `turbo dev` dies

## Session scope

_One sentence:_ Make the list survive the store — whole-row checks, cleared-aisle
collapse, a progress track, two shoppers seeing each other, the three-column wall —
and make it work with no signal.

**Two reviewable chunks. Land them as separate commits:** (A) shop context + sync +
the wall, (B) offline. B is the one that can take the shell down.

## Acceptance criteria

1. **Whole-row tap toggles** got/needed; tap again undoes; nothing on a row is
   destructive. Checked rows **dim in place** (0.46 opacity + strikethrough) and keep
   their position.
2. **A fully cleared aisle collapses** to a stated row — `✓ Bakery · all 2 in the
cart`, tap to reopen. Individual checked items still never vanish.
3. **Progress is structure:** `2 in the cart · 8 to go` + a filled track under the page
   title, on every surface.
4. **Partner sync renders as text** (ADR 064): a row the other shopper checked reads
   `Sam got it` in the note line — no avatar, no spine, no identity chrome.
5. **The wall** (fridge iPad, ~1060px content): aisles as three balanced columns, whole
   list visible without scrolling, groups never split (`break-inside: avoid`). Header
   carries **"Sam is at the store right now"** with a green pulse dot, derived from
   check activity — **no new tables**. Add bar moves to the top with staples beside it.
6. **Offline:** the list renders, checks apply optimistically and replay when signal
   returns, and a quiet pill sits under the title — `Offline — checks will sync`. Not a
   banner, not amber; offline is expected, not exceptional.
7. A deploy still lands immediately on every device — whatever the SW change is, it
   does not stale the app shell or `/api`.

## Constraints coming in

- **Fixed walk order** (Produce → Bakery → Meat → Dairy → Pantry → Frozen → Other).
  Per-family reorder is a **named non-goal**; revisit only if the fixed order
  demonstrably annoys.
- The SW's network-first `/api` rule exists for deploy correctness. Any exception is
  narrow, explicit, and justified in the log — do not flip the default.
- No blind `catch {}` on a replay path: a check that silently failed to sync is a
  person standing in an aisle with wrong information.
- **Check column re-flow after add/clear on the physical fridge before closing** —
  M5/1 accepted the re-flow pending exactly that check.
- **Parallel run:** wave 2, alongside M5/5. You own `apps/shell/public/sw.js` and the
  grocery surfaces; you share `apps/api/src/plugins/meals.ts` and
  `plugins/meals/prisma/` with M5/5 — rebase and `prisma generate` before merging.

## Decisions to make

1. **The offline mechanism.** A SW write queue (Background Sync) vs. client-side
   optimistic mutations with a persisted TanStack Query cache and replay on
   reconnect. Pick one and say why in the log; the second is the smaller blast radius
   and keeps the SW's rules intact.
2. **Which reads get an offline copy** and how they are revalidated without weakening
   AC7.
3. **Conflict rule** when two shoppers — or one replaying queue — touch the same item.
   Status is last-write-wins or `got_by` is first-writer-wins; they are different
   answers to "who got it", and AC4's text depends on which.
4. **Sync transport** — the existing `/events` stream vs. a poll while a shop is
   active. The stream is exactly what is missing when offline.
5. **Presence window** — how recent a check makes someone "at the store right now",
   and when the line disappears.
6. **Column balance** — CSS multi-column with `break-inside: avoid`, or an explicit
   three-way partition that keeps the columns even.

## Outputs (required before closing)

- [ ] Design gate for the wall + shop surfaces: playground → sign-off → Storybook
- [ ] Live-app review **in the store conditions that matter**: phone with the network
      throttled to offline, checks applied, signal restored, checks landed; then the
      real fridge tablet for the wall
- [ ] Tests: conflict + replay logic (unit), routes (`fastify.inject()`), RTL over
      check/collapse/offline pill
- [ ] `pnpm typecheck` + `pnpm test` clean; progress row ✅ for both grocery stories if
      M5 closes here, session log, `CLAUDE.md`, queue, PR; delete this kickoff
