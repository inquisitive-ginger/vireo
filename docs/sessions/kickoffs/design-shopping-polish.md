# Kickoff — Shopping polish · Design critique

**Type:** Design (critique pass, with design-system decisions) · **Runs first** — the dev
session `kickoffs/dev-shopping-polish.md` builds what this one settles.
**Surfaces:** phone (the list), wall/desktop (the wide capture layout, `/shopping/lists`), the
Home dashboard tile. **Depends on:** M5.5/4 + /5 merged.

## Scope

Judge the shipped Shopping surface as a whole, rendered, before the family sees it, and settle
the corrections the build sessions deferred. Output is a decision set the dev session executes.

**Zach adds items during this session, in concert with the critique** (his words). The list below
is **what the critique already knows about, not its scope** — don't work it as tickets. Render the
whole surface, judge it, and let the known items take their place in what you find.

## Pre-session reads

- [ ] `CLAUDE.md` — the **Standing Engineering Conventions**
- [ ] `docs/modules/shopping/design.md` **with**
      `artifacts/2026-09-03-shopping-surface-explorations.html` — the settled surface and its
      picture; frames S1–S3 and W2 are still the reference
- [ ] `logs/2026-09-04-dev-shopping-shop-context.md` + `-capture-surfaces.md` — **both**; they
      carry the diagnosis behind every item below
- [ ] `docs/design-system.md` — the type scale, `section-label` / `-lg`, the colour tokens
- [ ] ADRs **063** · **064** · **068** (row height is the primitive's) · **069**–**073** ·
      **003** (tiers)

## Decisions to make

**Two carry past shopping and are the reason this session exists.**

1. **The check ring fails WCAG 1.4.11** — **1.29:1 light, 1.55:1 dark** against a 3:1 floor. It
   is `--border` on `--background`, so `CompletionToggle` and **every chores surface fail
   identically**; deciding this changes a shared token. The correction glyph beside it reads
   4.0:1 — the control pressed thirty times a shop is three times fainter than the one pressed
   roughly zero. **Dimming the glyph cannot fix it** (4.0:1 has about a point of headroom over
   the floor), so the ring has to come up. Decide the token, in all theme blocks, and judge it
   **on chores as well as shopping** — chores is the blast radius, not a side effect.
2. **The Home tile is 2×2 and the dashboard pays for it.** `ListRow`'s 56px floor is not
   overridable (ADR 068), so no whole row fits a 2×1 — the tile grew `DEFAULT_LAYOUTS` by two
   rows at every tier and made the desktop dashboard scroll. It returns the moment the widget is
   announced. Two levers: **displace a settled widget** (an elevation-ladder decision — whose
   cell does Shopping take, and why does it outrank what was there) or **revisit what a 2×1
   holds**. Not a dev call, and not "override the row floor".

**Three more, placed here because each is a judgement about what a rendered surface says:**

3. **The colliding `14`s.** The title strip is **cumulative across every destination**; the
   meter is **per-list**; in today's data both print `14`, so two correct numbers read as one
   number used two ways. Neither is wrong — they are indistinguishable **by coincidence**, which
   is worse than a wrong number because nobody thinks to check. Fix by labelling, placement or
   scope; deleting one is a last resort (design.md §Anatomy 1 says why the cumulative one exists).
4. **A failed add is erased by the next success.** "milk" fails, "eggs" succeeds, and the record
   that milk was lost is gone. Decide whether failures **queue or replace**, and what the strip
   looks like holding two. The wide capture layout is the one surface designed for four words in
   a row, so decide it there. (Dev owns the wiring: `lib/use-ambient-capture.ts:73`, and the
   copies at `pages/ShoppingPage.tsx:193/357`.)
5. **`section-label` has no block-spacing rule** — its own queue entry. The token sets size,
   weight, tracking and colour and says nothing about the space around it, so four call sites
   hand-roll four answers (`ui/widget-header.tsx`, `family-feed/FeedPage.tsx`,
   `meals/TonightView.tsx`, `shopping/ShoppingPageView.tsx`). Survey the four, decide what the token owns vs. the
   surface, and **say in the log whether that queue entry closes here**.

## Constraints

- **Render options inside the real components, in the real page, at real density** — an
  exploration comparing only its own options cannot see redundancy with what exists.
- **Gate every major visual decision with Zach** — rendered options, both live, explicit pick.
  Never picture-vs-prose. Three options where the axis supports three, and name the axis.
- **ADR 064** — per-row attribution renders in neither direction. **ADR 070** — nothing
  autofocuses.
- The **no-mode principle is scoped to narrow** (design.md §"One surface, two layouts"). The
  wide capture-only layout is not a violation; do not re-derive that objection.
- Corrections and their tokens. A change to **what the surface does** is a story for `product`.
- Shopping is **announced nowhere** (`e4052b0`) — both routes answer by typed URL. Critique it
  there; turning it on belongs to the dev session. A dev server answering 200 proves _some_
  worktree is serving, not this one.

## Outputs

- [ ] **A written decision set** the dev session builds from — each decision, its options, why
      the winner won. Rejected options named as rejected.
- [ ] **Artifact in `docs/sessions/artifacts/`** with the losers in it — an **input** to the dev
      session, never an appendix. `design-critic` pass on it before handoff.
- [ ] `docs/design-system.md` updated (the ring token, `section-label` spacing if it closes
      here), **Last updated** bumped. An ADR if a decision needs one — 068 and the elevation
      ladder are the candidates.
- [ ] Exploration route deleted · session log · queue updated with what dev now owes ·
      **delete this kickoff**
