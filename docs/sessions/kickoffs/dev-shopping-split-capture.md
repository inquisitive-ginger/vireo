# Kickoff — M5.5/2 · Dev: the plugin split + the capture surface

**Type:** Development · **Branch:** `dev/shopping-split-capture` (off `main`) → PR to `main`
**Modules:** `shopping` (new), `meals`, `packages/{ui,schemas,platform}`, `apps/shell`
**Depends on:** M5.5/1 ✅

## Pre-session reads

- [ ] `CLAUDE.md` — **Standing Engineering Conventions**, all of them
- [ ] `docs/modules/shopping/spec.md` + **`design.md`** + `salvage.md`
- [ ] **`docs/sessions/artifacts/2026-09-03-shopping-surface-explorations.html`**, read _with_
      design.md. **Frames S1 (at rest) and S2 (typing)** are this session's surface. The
      artifact is an input, not an appendix — the proportion lives there.
- [ ] ADRs **069** (split), **070** (`CaptureField`), **063** (`ListRow`), **064** (no identity
      chrome here), **067** (tiers), **032**, **033**, **013**, **018**, **012**, **035**
- [ ] `logs/2026-09-03-{design-shopping-surface,product-shopping-boundary}.md`
- [ ] `plugins/family-feed/` — the structure a new plugin mirrors
- [ ] Worktree: copy `.env` in or `turbo dev` dies at `node: ../../.env: not found`

## Scope

Stand up the `shopping` plugin and ship the phone surface at rest. No shop context, no
wall, no widget, no offline, no needs-push.

## Acceptance criteria

1. **Plugin loads through the shell** — `plugins/shopping/` mirroring `family-feed`, port
   `3016`, own `shopping` schema, `apps/api/src/plugins/shopping.ts`. Four of the five
   registration points: `plugins.json`, `apps/shell/src/lib/load-plugin.ts`,
   `apps/shell/src/federation.d.ts`, `ICON_MAP` in `apps/shell/src/main.tsx`. **`Home.tsx`
   WIDGET_META is deliberately NOT touched — M5.5/5 owns it with the widget.** Say so in the
   log so the fifth point is never assumed done.
2. **Four models move** (ADR 069 §1) as `Item`, `List`, `Entry`, `AisleOverride` → tables
   `shopping.{items,lists,entries,aisle_overrides}`. `meals` keeps `PlannedMeal` +
   `DinnerNudgeLog` and declares no grocery model.
3. **Subjects renamespace** to `shopping.List` / `shopping.Item`; registry keys are exactly
   spec.md's three — `shopping.list.create` (4), `shopping.item.add` (1+),
   `shopping.item.manage` (4, grantable). Gates are `ability.can`, never `tier >= n`.
   `view shopping.Item` is an ability grant at tier 1+, **not** a registry key (spec.md:
   reading is not separately gated); the branch's `meals.grocery.view` key does not carry.
4. **`ListRow` + ADR 068 land on `main`** — both branch-only today, with the
   `--spacing-row-touch` → `--spacing-card-touch` rename and the new `--spacing-list-touch`
   (`--spacing-row-touch` is read by nothing on `main`). **ADR number 068 is reserved for
   that file** — do not renumber, do not reuse.
5. **`CaptureField` in `@family-os/ui`** per ADR 070: single-line, always-open, Enter
   submits, **stays open with its value cleared**, trailing scope slot, no avatar, no hue.
   Autofocus is a prop the _surface_ sets — `/shopping` on a phone does **not** autofocus.
   Storybook story required.
6. **`/shopping` renders S1/S2** in `PageContainer width="list"`: title row + muted count
   strip; 56 px `CaptureField` with the destination chip trailing; the **filing echo**
   (`Enter to add · files under Pantry`) as one `sm` line, stating the aisle **before** the
   commit; destination `Chip` pills with counts that swap the list **in place**; `ListRow`
   per item under `section-label` aisle headers in walk order. No spine, hue or avatar
   (ADR 064), no index of lists, no drill-in.
7. **`plugins.json` reordered** so the phone reads `Home · Calendar · Meals · Shopping ·
More` — `shopping` precedes `chores`, `chores` moves into More (ADR 033's 5-tab cap;
   settled at the M5.5/1 gate, not this session's call). Verify Chores is still reachable on
   a phone viewport.
8. **Needs-push does not 500 in transit** — move or stub `meals`' `push-needs`; the contract
   is M5.5/3. Whichever you do is explicit in the log.
9. TanStack Query throughout (ADR 013), profile-scoped keys under a shared **prefix**
   (`['shopping/list', …]`) that M5.5/5's widget reuses so one invalidation refreshes both.
10. `pnpm typecheck` + `pnpm test` clean — routes via `fastify.inject()`, RTL over the
    capture field and pill filter, the salvaged filing tests carried.

## Constraints

- **Do not re-litigate** ADR 069/070 or the settled surface. Flag in the log; don't override.
- **Never hand-roll a row or page frame** — `ListRow` + `PageContainer`; padding is not a prop.
- **No blind `catch {}`** on a path a family member reaches: `console.error` the reason and
  surface it where a user is waiting.
- Walk order is fixed (Produce → Bakery → Meat → Dairy → Pantry → Frozen → Other);
  per-family reorder is a named non-goal.
- **`db:reset` defaults to the DEV database** and destroys the `seed-parent-1` /
  `seed-child-1` fixtures the API suite needs — set `DATABASE_URL`, re-seed after.
- **`familyos_test` rejects `migrate deploy` (P3009)** — hand-apply each new migration's SQL.
- The `Entry` table moves (ADR 069 §1) but **design.md has no completion UI — don't build one.**

## Salvage — PR #127 (closed), branch `dev/meals-grocery-list`

**Full inventory, file by file: `docs/modules/shopping/salvage.md` — read it first.** Take
with `git show dev/meals-grocery-list:<path>`; do not check the branch out. This session
takes its whole "Take" table **except** the `:id/check` route (M5.5/4) and `push-needs`
(M5.5/3). Its "Do not take" list is the rejected index-and-drill-in surface — do not
resurrect any of it.

## Outputs

- [ ] **Live-app review in the real shell with the user before any close-out task**, phone
      viewport included for the tab reorder
- [ ] Standing-conventions pass · `pnpm typecheck` + `pnpm test` clean
- [ ] `progress.md` → ✅ · session log · PR to `main` · delete this kickoff
