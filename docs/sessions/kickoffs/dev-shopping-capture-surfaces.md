# Kickoff — M5.5/5 · Dev: the wall and the Home widget

**Type:** Development · **Branch:** `dev/shopping-capture-surfaces` (off `main`) → PR to `main`
**Modules:** `shopping`, `packages/ui`, `apps/shell`
**Depends on:** M5.5/2 merged (`CaptureField`, the routes, the query-key prefix)

## Pre-session reads

- [ ] `CLAUDE.md` — **Standing Engineering Conventions**, all of them
- [ ] `docs/modules/shopping/spec.md` + **`design.md` §"The wall tablet — W2"** and
      §"Adding from anywhere in the house"
- [ ] **`docs/sessions/artifacts/2026-09-03-shopping-surface-explorations.html`**, read _with_
      design.md. **Frame W2** is the wall; the "Adding from anywhere" section is the widget.
      The artifact is an input, not an appendix — W1 is drawn there as the **rejected** wall
      (the phone surface at across-the-room size) and stays rejected.
- [ ] ADRs **070** (`CaptureField`; autofocus is a _surface_ decision), **064**, **063**,
      **022** (widget manifest + cache invalidation), **013**, **039** (widget prominence),
      **012**, **035**
- [ ] `docs/design-system.md` §"Member identity palette" and the **across-room distance
      rule** — the 18 px floor and what it is silent about
- [ ] `plugins/family-feed/src/widgets/` — the widget shape to mirror
- [ ] Worktree: copy `.env` in or `turbo dev` dies at `node: ../../.env: not found`

## Scope

The two capture surfaces that are not the `/shopping` page: the wall (W2) and the Home
dashboard widget. Both ship the same `CaptureField`. Neither shops.

## Acceptance criteria

1. **The wall is W2 and only takes things in.** `What do we need?` at `display-xl`, a **76 px
   `CaptureField` below it, autofocused**, a **Hold to speak** affordance reserved in the
   trailing slot (**voice is not M5.5 scope — the slot is reserved, nothing implements it**),
   a **Just added** strip of the last few items as chips with who added them, a count strip
   (`19 things waiting · Grocery 14 · Costco 3 · Hardware 2`), and one `See the lists` link
   out. **No checking, no aisles, no shopping on the wall.**
2. **The Home widget captures with zero navigation** — a capture line plus the newest rows.
   It **fits its slot and does not crop**: `useFitRows` (whole rows + `+N more`), which is
   height-based and needs a height-constrained flex child. It autofocuses (a widget is a
   surface you did not navigate to — ADR 070's rule).
3. **The fifth registration point lands** — the widget entry in `plugins/shopping/public/
manifest.json` **and `WIDGET_META` in `apps/shell/src/pages/Home.tsx`**. M5.5/2
   deliberately left both untouched; **a widget silently drops without the WIDGET_META
   entry.** Verify it renders on the real dashboard, not just in Storybook.
4. **One invalidation refreshes both** — the widget reuses M5.5/2's `['shopping/list', …]`
   key prefix so an add anywhere refreshes the page and the widget (ADR 013/022).
5. **The filing echo appears on both surfaces.** A capture that files derives must state the
   filing **before** the commit (ADR 070) — `files under Pantry`, wherever the field lives.
6. **No identity chrome anywhere here** (ADR 064). `Just added` shows who added a thing as
   **text**, on a chip; `CaptureField` carries no author avatar and no hue by construction.
7. **No blind `catch {}`** — an add that failed on a wall tablet with no devtools is
   invisible; `console.error` the reason and surface it where the person is waiting.
8. `pnpm typecheck` + `pnpm test` clean — RTL over both surfaces' capture and the `+N more`
   fit behaviour.

## The decision this session owes

**The wall's structural labels do not clear the distance floor.** `section-label` is 11 px
uppercase — unreadable at six feet — while the rows beside it clear the 18 px across-the-room
floor. The distance rule floors **primary content** and is **silent on structural labels**,
which is why the deficit survived. W2 mostly dodges it by having no aisle headers, but
**`Just added` and the count strip inherit it.**

`design.md` records this as **owed by whoever builds the wall — that is this session.**
Either add a distance variant of `section-label` or promote those labels to `heading` on the
wall. It changes a shared token's family, so **write the answer into `docs/design-system.md`,
not into a component.** If it turns out to need an ADR, flag it rather than deciding it in a
component file.

## Constraints

- **Do not re-litigate** ADR 069/070 or the settled surface. **W1 stays rejected** — the wall
  is not the phone at larger type.
- **Never hand-roll a row or page frame** — `ListRow` + `PageContainer`; padding is not a prop.
- No raw px sizes or hardcoded colours — tokens and `@family-os/ui` only (ADR 012/035).
  The 76 px wall field is a token decision, not a literal sprinkled in a plugin.
- **`db:reset` defaults to the DEV database** and destroys the `seed-parent-1` /
  `seed-child-1` fixtures the API suite needs — set `DATABASE_URL`, re-seed after.
- Never JS-import a stylesheet inside `@family-os/ui` — route it via `ui/styles.css` or it
  orphans in the federated build and is unstyled in prod only.

## Outputs

- [ ] **Live-app review in the real shell with the user before any close-out task** — the
      widget on the real dashboard, and the wall **on the actual fridge tablet at distance**,
      which is the only place AC on the label decision can be judged
- [ ] Standing-conventions pass · `pnpm typecheck` + `pnpm test` clean
- [ ] `docs/design-system.md` updated with the distance-label answer
- [ ] `progress.md` → ✅ · session log · PR to `main` · delete this kickoff
