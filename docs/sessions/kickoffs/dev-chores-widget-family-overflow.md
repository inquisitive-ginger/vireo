# Kickoff — Dev: Chores widget clips the family list (auto-bug #70)

**Type:** development (ad-hoc, bug) · **Branch/worktree:** `fix-chores-widget-overflow`

## The report

auto-bug #70, filed in-app by Zach (tier 4) from `/` at **1112×814**:

> The chores widget cuts off on the iPad an you can't see the 4th identity row …
> could move up "pending item" to same line as numeral to get some space back

## Pre-session reads

- `plugins/chores/src/widgets/TodaySummaryView.tsx` — `FamilyLarge` / `PersonTile` / `HeroCount`
- `packages/platform/src/home-layout.ts` — tier-3/4 default puts chores in a **2×1** slot
- `packages/ui/src/components/widget-grid.tsx` — row height is derived from the
  container (`MIN_ROW_HEIGHT` 180 … `MAX_ROW_HEIGHT` 400), so the slot height is a
  function of the viewport, not a fixed number
- `packages/ui/src/lib/widget-breakpoints.ts` — a ≥300px-tall slot renders `large`

## Scope

The **family framing** of `chores.today-summary` only. Taskee/Focus framings and the
chores page are out of scope.

## ACs

1. At the reported geometry (1112×814, tier 4) every member with tasks today is
   readable — no tile clipped mid-row.
2. The widget degrades honestly when the household genuinely outgrows the slot: the
   overflow is **stated**, not silently cropped.
3. The hero reads as one line (`N pending today`) — the reporter's own suggestion,
   and the cheapest space back.
4. Taskee / Focus framings unchanged.

## Constraints coming in

- ADR 042/043 — the tile's spine carries identity, the avatar carries the face;
  don't trade the spine away for space.
- ADR 044 — the household caps at 8 members, so "fits every family" is bounded.
- Design-system: a widget is read-only and tap-through; it must not scroll.
- Existing chip language (`AllDoneChip` / `OverduePill` / `CountChip`) stays.

## Required outputs

- [ ] Fix + tests in `TodaySummaryView.test.tsx`
- [ ] Live review at 1112×814 before close-out
- [ ] PR, then close #70 (moving it to `deployed` notifies the reporter in-app)
- [ ] Session log, queue/CLAUDE.md update, delete this kickoff
