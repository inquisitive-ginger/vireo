# Kickoff — M5.5/1 · Design: the shopping surface

**Type:** Design · **Module:** `shopping` (new) · **Depends on:** ADR 069 — nothing else
**Branch:** fresh off `main`. `dev/meals-grocery-list` is closed history, not a base.

## Why this session exists

The surface was built once and rejected on sight. PR #127 shipped an index of lists
with a drill-in, and the reaction to it in the live app was that it is **not fresh** —
a list of lists reads as filing, not as shopping. The boundary question underneath it
was answered separately (ADR 069: shopping is its own plugin), which frees this session
from meals' framing entirely.

This is an exploration, not a revision. **Do not open with the index-of-lists shape and
adjust it.**

## Pre-session reads

- [ ] `CLAUDE.md`, then `docs/modules/shopping/spec.md` — the module, one page
- [ ] **ADR 069** (the split, and what it hands this session), **ADR 063** (`ListRow`
      beside `ItemCard`), **ADR 064** (no identity chrome on shopping), **ADR 032**
      (one nav entry per plugin — shopping now has its own)
- [ ] `docs/design-system.md` — tokens, `ListRow`, `PageContainer`

**Read as history, not as input:**
`artifacts/2026-08-23-grocery-list-handoff.md` and
`artifacts/2026-08-23-grocery-list-devready.html` are banner-marked SUPERSEDED. Read
them **after** you have your own directions, to check you have not re-derived a
rejected one — not before, as a starting point. Same for
`artifacts/2026-08-23-grocery-list-diverge.html`.

## The axis — set here, not by the agent

The last diverge pass was thrown away whole because the agent picked its own axis
("where does the check control sit"), which is an implementation question wearing
design clothes. The axis for this session is:

> **What is the primary object on screen when you open Shopping — and what does the
> app think you are about to do?**

Every direction must answer that differently. An index of lists answers "you are about
to choose a list", which is the answer that got rejected. Directions worth drawing
answer it as: you are about to **add** something · you are about to **shop** one
specific trip · you are about to see **what the house needs**, lists being a detail of
where it gets bought · something the brief has not thought of.

## Fixed — do not spend the session here

- **A list is its own row and carries its producer**; aisle grouping is a property of
  the list (ADR 069, carried from ADR 067). This constrains the model, **not** the
  surface — it does not mean the UI must show a list of lists.
- **Shopping owns its nav entry.** There is no meals header link to design around.
- **Rows are `ListRow`, and height belongs to the primitive** (ADR 063/068). Do not
  redesign the primitive; do not restate a pixel height in an AC.
- **No identity chrome on shopping rows** (ADR 064). Who added a thing is text.
- **Offline is real and is M5.5/4**, but the surface must not assume a live connection
  to be legible.

## Decisions this session owes

1. The primary object and the opening screen (the axis above).
2. How a thing gets **added** — from this surface and from anywhere in the house.
   Capture speed is the bar: slower than Google Keep means unused.
3. How multiple destinations (Grocery, Costco, a hardware run) are expressed, given
   they exist in the model. Showing them is a choice, not a requirement.
4. What **shopping** looks like versus what **adding** looks like — one surface or two.
   (M5/1 retired the build/shop mode split for a one-list world; a plugin with its own
   nav is a different world, so this is genuinely open again.)
5. The wall tablet: same structure at larger type, or its own thing.

## Gate — required before anything is written down

Render the directions as **real, comparable options in one artifact** and put them to
Zach with `AskUserQuestion`. Rules that have bitten before:

- **Render every live option.** Never picture-vs-prose — an option described in words
  loses to an option that is drawn, regardless of merit.
- **Build the options inside the real components**, not against each other. An
  exploration one import away from `ListRow` produces developer-shaped design; an
  exploration that compares only its own options cannot see redundancy with what the
  app already has.
- Expect an external critique pasted mid-gate. Leave room to revise rather than
  defending the first draft.
- A **design-critic pass on the rendered artifact** before it is handed onward.

## Outputs (required before closing)

- [ ] The exploration artifact in `docs/sessions/artifacts/`, critiqued
- [ ] `docs/modules/shopping/design.md` — the settled surface
- [ ] `docs/design-system.md` — only if a new pattern is genuinely established
- [ ] An ADR **only** if something cross-cutting is settled; otherwise the design doc
- [ ] Session log; queue updated; progress row; delete this kickoff
