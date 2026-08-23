# Kickoff — M5/6 · Design: `ListRow` + the grocery list

**Type:** Design · **Modules:** `ui` + `meals`
**Branch:** explore on top of `dev/meals-grocery-list` (PR #127, open)

> **Why this exists.** #127 built the whole story and skipped its gate rather than
> deferring it: Storybook, full integration, and a 44-line `design-system.md`
> `ListRow` entry all shipped with no rendered options and no sign-off. The
> non-visual half is reviewed, green, and **stays** — API routes, aisle dictionary,
> Zod schemas, migrations, tests. What is unsettled is `ListRow`'s anatomy and the
> groceries page's visual treatment.

## Pre-session checklist

- [ ] Read `CLAUDE.md`, **ADR 003** (tiers), **ADR 063** (the card/row rule — the
      rule is settled, the primitive's anatomy is not), **ADR 064** (no identity
      chrome on groceries)
- [ ] Read `docs/modules/meals/design.md` §M5/6 — the behaviour the design serves
- [ ] Read `kickoffs/dev-grocery-list.md` ACs 2–4 and 6 (density, add bar, the
      one-time `Which aisle?` prompt, the note-line grammar)
- [ ] Read what shipped, to argue with it: `packages/ui/src/components/list-row.tsx`,
      `plugins/meals/src/pages/GroceriesPageView.tsx`,
      `packages/ui/src/components/item-card.tsx` (the sibling you sit beside)
- [ ] Worktree: copy `.env` in or `turbo dev` dies

## Session scope

_One sentence:_ Gate `ListRow`'s anatomy and the groceries page's treatment against
rendered options at real density, and replace the ungated `design-system.md` entry
with the outcome.

## Surfaces in scope

Phone (390px — the add bar is in the thumb zone) and the fridge tablet at `md:`.
Not TV, not the Pi display.

## Constraints coming in

- **ADR 063's rule is not open**: rows for the grocery list, cards for the week
  plan. What is open is what a row is made of.
- **ADR 064**: no spine, no avatar on a grocery row. Provenance is the note line.
- **Real density is ~30 items across 7 aisles**, phone-width. An option that only
  looks right at 6 items has not been tested. Fixed walk order: Produce → Bakery →
  Meat → Dairy → Pantry → Frozen → Other.
- **The `Which aisle?` correction stays tier-4 only.** A correction teaches a
  family-wide override, and `spec.md` §Permissions already makes
  `manage meals.GroceryItem` a tier-4 baseline — this is settled policy, not a
  decision for this session. Tier 1–3 see the item filed under Other with no
  prompt. Design the prompt's presence and absence; do not redesign who gets it. If
  the exploration makes a case for widening it, that goes to `architect` as an
  amendment, not into a design frame.
- Everything M5/7 (whole-row checks, cleared-aisle collapse, progress track, sync,
  the wall, offline) is out of scope to **build** — but decision 1 binds it, so
  render it to think with.

## How to explore

**An ephemeral playground route on the branch, never Storybook.** Two passes:

1. **Diverge** — unanchored from the current primitives, bounded only by tokens and
   a phone in a kitchen. Name the axis the options disagree on; require one option
   that breaks a house convention and says which. **Three options, not two.**
2. **Converge** — survivors rendered in the real groceries page, at ~30 items,
   beside the week plan's `ItemCard`s so the two primitives are judged together.

The playground route is deleted before the session closes.

## Decisions to make

1. **Does `ListRow` own the check ring, or take a generic leading slot?** ADR 063
   left this open and #127 answered it ungated (generic slot). Everything downstream
   inherits the answer — M5/7's whole-row check, and any future scanned list.
   Decide for the primitive, with M5/7's row rendered in front of you.
2. **Row anatomy** — name and note lines, the type ramp against `ItemCard`'s
   (#127 chose `text-list-title` 17px/500 vs. the card's 16px/600), row height, and
   where the hairline sits relative to the leading slot.
3. **Group treatment** — the aisle head (13px bold + `2 left` count, sticky, rule
   beneath) and how a group reads as one object at scan speed.
4. **The two moments of feedback** — the just-added flash in place, and the
   `Which aisle?` prompt rendered on the row without a layout jump.

Each decision: state the options and tradeoffs, check it holds on both surfaces and
at every tier, gate it with rendered options and an explicit pick, then record it.

## Outputs (required before closing)

- [ ] The 44-line `### The scanned-list primitive — ListRow` entry in
      `design-system.md` is **replaced** by the outcome, not appended to — it
      currently records an ungated decision as house convention. **Last updated**
      header set to today.
- [ ] `docs/sessions/artifacts/2026-08-2X-grocery-listrow.html` (or screenshots) —
      the options considered, **losers included**, and which won and why
- [ ] Playground route deleted; nothing ephemeral left on the branch
- [ ] `list-row.tsx`, its Storybook story, and `GroceriesPageView` updated to the
      decision; PR #127 rebased and re-reviewed rather than a second PR
- [ ] A new ADR only if a decision creates an architectural constraint (decision 1
      might); otherwise amend ADR 063 by pointer, don't re-decide it
- [ ] `pnpm typecheck` + `pnpm test` clean; live-app review on a phone-width
      viewport **and** the fridge tablet before any closeout task
- [ ] Session log `logs/YYYY-MM-DD-design-grocery-listrow.md`; `CLAUDE.md` status;
      queue entry; delete this kickoff
