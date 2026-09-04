# 2026-09-04 — Dev: shop context, shopper sync, the aisle correction (M5.5/4)

**Shipped:** PR #136, merged `08d8e51`. Branch `dev/shopping-shop-context`.
Frame S3 — whole-row checks both directions, cleared-aisle collapse, a progress
meter, two shoppers converging over the existing `/events` socket — plus the aisle
correction UI (AC9), which had no owning session until this one.
**Ships with the Shopping nav item and Home widget disabled** (commit `e4052b0`,
one revertable commit), pending the polish session.

## Decisions

**The uncheck event is one `shopping.item.checked` carrying `status`** (ADR 072
§5). Emitting nothing on an uncheck was rejected: the second shopper's screen is
driven off that event, so a silent uncheck strands them on a stale row.

**Convergence is a conditional `updateMany` guarded on the opposite status.**
`status` is last-write-wins; `got_by` is first-writer-wins; the loser's tap is a
true no-op that emits nothing. No lock, no version column.

**The meter is gated on data (`got > 0`), not on scroll** — a deliberate
divergence from artifact S1. `design-critic` found the stronger reason: mid-shop is
when the page is **shortest**, because every cleared aisle folds to one row, so a
scroll-gated hero would vanish exactly when the meter starts to matter.

## Sent back twice by review

Worst finding: **the check ring was a dead hole.** `pointer-events-none` on the
ring does not pass the tap through, because `ListRow` lifts its leading wrapper
above the overlay — 24px dead centre on the primary affordance, on every row, and
invisible to jsdom. A test suite that cannot see stacking order cannot cover a tap
target; the live pass is what caught it.

## ADR 064 amended — narrowed, not weakened

Per-row attribution is **not rendered in either direction**: not who added it, not
who got it. The original bullet reached the right answer by the wrong step — it
ruled out hue and reached for text as the cheaper channel, which leaves standing
the premise that the fact belongs on the row at all. The amendment removes the
premise. This **narrows what 064 governs** rather than weakening it; every other
surface it covers is unchanged.

## The rebase onto /5 caught a silent deletion

`main` still filtered checked rows out of the list — correct before checking
existed, and after the rebase it would have removed **this story's AC2** while the
whole suite stayed green. A conflict-free rebase is not a semantic merge; the
behaviour a prior story assumed can be exactly the behaviour this one adds.

## The nav disable, and the shell bug it exposed

`WidgetGrid` received the full layout and sized itself from `maxRow`, so a widget
the shell could not render **still reserved a cell** and grew the dashboard by two
rows — an empty bordered region, worse than the placeholder it was avoiding. Fixed
by dropping unrenderable entries from the **layout**, not just the children. That
also covers a **persisted per-profile layout** outliving its widget, which editing
the three defaults would not have. The revert stays one commit.

## Known and recorded, not fixed

**The check ring fails WCAG 1.4.11 at 1.29:1 light / 1.55:1 dark**, while the
correction glyph beside it reads 4.0:1 — the control pressed thirty times a trip is
three times fainter than the one pressed roughly zero. It is `--border` on
`--background`, so `CompletionToggle` and **every chores surface fail identically**.
Dimming the glyph cannot fix it; the ring has to come up. That is a design-system
decision, not a shopping one — queued with the polish session.

## What the next session needs to know

- **Shopping is built, reachable by URL, and announced nowhere.** The polish
  session owns `git revert e4052b0` plus the polish; nothing else re-enables it.
- The two-row grid growth returns with that revert — the grid fix stopped the
  _empty_ cell reserving space, not a real widget occupying it.
- M5.5/6 (offline) is the last story in the milestone and depends on this one.
