# 2026-09-03 — Design: the shopping surface (M5.5/1)

**Type:** design · **Module:** `shopping` · **Kickoff:** `design-shopping-surface.md` (deleted)
**Artifact:** `artifacts/2026-09-03-shopping-surface-explorations.html`
**Outputs:** `docs/modules/shopping/design.md` · **ADR 070** · design-system.md §Capture primitives

## What was decided

**The axis is answered: "you are about to add something, into a list that is already in
walk order."**

Four directions were drawn as real screens, not described: **A** capture-first, **B**
shop-first, **C** needs-first (store as a row tag), **D** trip-first (a stream at rest, a
live run when someone goes). Fifteen phone frames and two wall frames, in the real
primitives. Zach took **A on B** — A's capture field as the hero, B's aisle-ordered list
as the page, destination pills as an in-place filter, no mode. Drawn as S1–S3.

Also settled at the gate:

- **The wall is W2 — it only takes things in.** A giant capture field, a short "just
  added" memory, a count strip, a link out. Nobody shops from a wall tablet; what it is
  good at is the moment you are holding the empty carton.
- **Shopping is pinned to the mobile tab bar and `chores` moves into More.** See below.

## The finding the brief did not carry

The mobile bottom tab bar caps at **5** (ADR 033 as amended 2026-08-17): Home + the first
three tier-visible plugins in `plugins.json` order + More. `shopping` is a **sixth**
plugin, so by default it ships **inside the More sheet** — two taps and a sheet, against
an acceptance bar that is literally "slower than Google Keep means unused". The surface
design would have lost before it got a vote, and nothing in the module docs would have
said so.

Zach pinned Shopping over **chores** (not meals, which was the recommendation). The phone
now reads `Home · Calendar · Meals · Shopping · More`. **M5.5/2 executes the
`plugins.json` reorder** — it is the one decision here that lives outside the module.

## Why the other three lost

Each cost is drawn in the artifact rather than argued, which is what made the gate quick:

- **B alone** — opens in shopping posture for the ~90 % of opens that are one person
  adding one thing at the fridge, and its pill strip is a soft index that regrows the
  rejected shape past about five destinations.
- **C** — frame C3 exists to show the cost: aisle order is _walk order in one shop_
  (ADR 069 §5), so merging three shops into one stream puts a Costco salmon under
  _Frozen_ and _Fasteners_ between _Pantry_ and _Other_. The narrowing is therefore
  mandatory, which makes the default screen the one nobody ever shops from.
- **D** — most distinctive, most expensive: a run is a new object with a lifecycle, live
  state and a finish. Forget to start one and you are shopping from a reverse-chronological
  log — the worst order in an aisle, and bad at "is milk already on here?".

The hybrid's own giveaways are written into `design.md` so they are not re-discovered as
bugs: **no live run** (the house can't see someone is at the store) and **no whole-house
glance** (three pill counts, not one list). Both are additive later.

## ADR 070 — and the redundancy check that produced it

The capture field was first drawn as "a `ComposeForm` but smaller" — how a primitive
quietly grows a variant prop meaning "be a different component". Checked against what
`@family-os/ui` already has, the seam is the **lifecycle**, not the size: `ComposeForm`
opens → submits → closes and shows the author's avatar and hue; the shopping field never
closes, has no author, and carries a **scope slot** a compose form has no analogue for.
So: a second primitive with a rule for choosing, in ADR 063's shape — **authored** vs
**caught**.

Two rules came out of it that are not shopping's alone and live in design-system.md:
autofocus is a _surface_ decision (focus on the wall and in a widget, never on a route the
user navigated to), and a capture that files derives must **state the filing before the
commit** (`Enter to add · files under Pantry`).

## Critique pass — what the render changed

Run against the rendered artifact before the gate, and the fixes are in the file:

- The `ListRow` name line was 16 px/**500**, which is not on the type scale. Moved to
  `card-title` (16/600); notes are `sm`.
- Frame A1 was captioned "the default state" while showing a post-add confirmation echo —
  a transient state presented as the resting one. Echo removed; A2's pre-commit hint
  carries the point.
- The bottom scrim sat 9 px inside the pinned add bar (10 + 48 + 12 + 1 = 71 px).
- The wall frames had an invented 13 px aisle label. Reverted to the real 11 px
  `section-label` token so the deficit shows, and the deficit is now a **recorded
  finding**: _the across-room surface has no structural-label size that clears the
  distance_. The distance rule floors **primary content** and is silent on labels, so a
  wall whose legibility depends on grouping has unreadable group names. W2 mostly dodges
  it (no aisle headers) but `Just added` and the count strip inherit it — `design.md`
  records it as owed by whoever builds the wall.

Run in-session rather than by the `design-critic` agent, per the standing instruction in
this environment not to spawn agents unrequested.

## What the next session needs to know

`design.md` + the artifact are read **together** — S1–S3 and W2 are the surface, and the
artifact is an input to M5.5/2, not an appendix. M5.5/2 now owes, beyond the scaffold and
the schema move: `CaptureField` in `@family-os/ui` (ADR 070), the destination-pill filter,
the filing echo, and the `plugins.json` reorder. `ListRow` is still **not on `main`** —
it and ADR 068 are branch-only, so M5.5/2 lands the primitive too.

The kickoff for M5.5/4 (`dev-grocery-shop-offline.md`) still describes the superseded
index-and-drill-in world and **must be rewritten against this design** before it runs.
