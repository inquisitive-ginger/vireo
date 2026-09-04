# Kickoff — M5.5/4 · Dev: shop context + shopper sync

**Type:** Development · **Branch:** `dev/shopping-shop-context` (off `main`) → PR to `main`
**Modules:** `shopping`, `packages/platform`
**Depends on:** M5.5/2 merged (the surface, `ListRow`, the routes)

## Pre-session reads

- [ ] `CLAUDE.md` — **Standing Engineering Conventions**, all of them
- [ ] `docs/modules/shopping/spec.md` + **`design.md` §"In a shop"**
- [ ] **`docs/sessions/artifacts/2026-09-03-shopping-surface-explorations.html`**, read _with_
      design.md. **Frame S3 — "in the aisle"** is this session's surface. The artifact is an
      input, not an appendix; the compacted status line, the meter and the collapsed-aisle
      row are drawn there, and the proportion lives in the drawing.
- [ ] ADRs **064** (sync renders as **text**, never identity chrome), **063**/**068**
      (`ListRow`, the 48-live/8-dead target band), **018**, **013**, **012**, **022**
- [ ] `docs/modules/shopping/salvage.md` — the `:id/check` route row **and the closing
      section**, which names the permission gap this session owns
- [ ] `logs/2026-09-03-design-shopping-surface.md`
- [ ] Worktree: copy `.env` in or `turbo dev` dies at `node: ../../.env: not found`

## Scope

Make the same screen survive a shop: whole-row checks, cleared-aisle collapse, the progress
meter, and two shoppers seeing each other's checks. **Offline is M5.5/6 — not here.**

## Acceptance criteria

1. **Whole-row tap toggles** got/needed and tap again undoes it; nothing on a row is
   destructive. The whole row is the target via `ListRow`'s `onActivate` — **do not
   hand-roll a row or re-derive the inset**; ADR 068's `inset-y-[3.5px]` is already correct.
2. **Checked rows dim in place** to `0.66` with a strikethrough on the name and **keep
   their position** — an item never vanishes from under a thumb.
3. **A fully cleared aisle collapses** to one muted summary row (`Produce · 3 in the cart ›`),
   tappable to reopen. Individually checked items still never disappear.
4. **The progress meter** — `--spacing-meter`, `--primary` on `--muted` — with the compacted
   status line (`Grocery · 6 of 14` + the destination chip) above the fold once the capture
   hero has scrolled away. The hero **scrolls away; it does not switch off.** There is no
   shop mode and no toggle.
5. **Two phones on the same list converge.** The check route names the **target state**, not
   a toggle verb, so two people tapping the same row settle on the same answer instead of
   racing. Decide the transport (the existing `/events` stream vs. a poll) and the conflict
   rule (`status` last-write-wins vs. `got_by` first-writer-wins) and say why in the log.
6. **Partner presence renders as text** — `Sam got it`, `Sam added · just now` on the note
   line. **No spine, no hue, no avatar** (ADR 064). No new tables for presence.
7. Query keys share the `['shopping/list', …]` prefix M5.5/2 established so one
   invalidation refreshes the page and (later) the widget.
8. **No blind `catch {}`.** A check that failed to reach the server is a person standing in
   an aisle holding wrong information — `console.error` the reason **and** surface it.
9. `pnpm typecheck` + `pnpm test` clean — route tests via `fastify.inject()`, RTL over
   check/undo/collapse, the conflict rule unit-tested.

## The permission keys — settled, use them

**ADR 071** closed the gap this session was going to hit: under `spec.md`'s original three
keys, checking fell to `manage shopping.Item` = tier 4 and AC5 was unbuildable. Settled:

- **`shopping.item.check`, baseline tier 2, grantable.** The check ring and the whole-row
  tap gate on `ability.can('check', 'shopping.Item')`.
- **Unchecking is the same key** — one gate for both directions. No `uncheck` action, no
  `checkedById` row condition; a mis-tap is undone by whoever is standing in the aisle.
- **`shopping.item.file`** (tier 4) is the aisle correction, split out of `manage` — if you
  touch `POST /:id/aisle`, gate on `file`, not `manage`.

Never a `tier >=` read (ADR 018). M5.5/2 lands the registry and ability rules; if a key or
grant is missing when you arrive, add it to match ADR 071's table rather than re-deciding it.

**Left open, and yours to settle:** `spec.md`'s events namespace lists `shopping.item.checked`
and nothing for the reverse. Decide whether an uncheck emits an event — a second event, the
same event carrying state, or nothing — and write the answer into `spec.md`. Do not leave it
to whoever reads the bus next.

## Constraints

- **Do not re-litigate** ADR 069/070 or the settled surface. Flag in the log; don't override.
- **Never hand-roll a row or page frame** — `ListRow` + `PageContainer`; padding is not a prop.
- Walk order stays fixed; a per-family reorder is a named non-goal.
- **A live run (direction D) and the whole-house glance (direction C) are deliberately not
  built** (design.md §"Deliberately not designed here"). Presence is derived from check
  activity; it is not a run object with a lifecycle. Do not grow one.
- **`db:reset` defaults to the DEV database** and destroys the `seed-parent-1` /
  `seed-child-1` fixtures the API suite needs — set `DATABASE_URL`, re-seed after.
- **`familyos_test` rejects `migrate deploy` (P3009)** — hand-apply any new migration's SQL.

## Outputs

- [ ] **Live-app review in the real shell with the user before any close-out task** — on a
      phone viewport, scrolled into shop posture, with a second client checking rows
- [ ] Standing-conventions pass · `pnpm typecheck` + `pnpm test` clean
- [ ] `progress.md` → ✅ · session log (record the transport + conflict rule) · PR · delete this kickoff
