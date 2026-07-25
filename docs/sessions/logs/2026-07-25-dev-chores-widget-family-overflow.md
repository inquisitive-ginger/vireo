# 2026-07-25 — Dev: the chores widget clipped its family list (auto-bug #70, PR #72)

**Type:** development (ad-hoc, bug) · **Merged:** `3a6e213`

The first bug reported through ADR 046's bridge to be fixed end-to-end from the
issue it filed.

> The chores widget cuts off on the iPad an you can't see the 4th identity row …
> could move up "pending item" to same line as numeral to get some space back
>
> — auto-bug #70, filed in-app by Zach (tier 4) from `/` at 1112×814

## What was wrong

**The report's geometry was reproducible on paper, exactly.** `main` is the full
814px (no top bar at `md`), less `PageContainer`'s `pt-6`/`pb-12` → 742px of grid
over the tier-3/4 layout's two rows → a **363px** slot. `FamilyLarge` spent 178px
of that on furniture and left **185px** for the member list — three 48px tiles
plus two thirds of a fourth. The arithmetic predicted "three visible, the fourth
sliced" before anything was opened, which is what the report described.

Two faults, and only one of them is the one that was reported.

**1. The aggregate outweighed the subject.** A stacked hero (numeral over label),
then the meter, then the meter's own `{done} of {total} done today` caption:
three lines restating a total that the per-person tiles already carry, on a tile
whose subject _is_ the list. The reporter's instinct — put the label on the
numeral's line — was right, and worth more than it looks: the aggregate is now
**one** line (inline hero left, done-count right, bare meter under), which is
**~46px back, one whole member tile**.

**2. A clipped list cannot say that it clipped.** This is the fault nobody
reported and the one that actually matters. `overflow: hidden` cuts the last row
through the middle, and **a half-rendered tile and a broken widget look the
same** — the reader has no way to tell "there is more" from "this is broken."
Fixing only the spacing would have bought exactly one member and reproduced the
identical bug for a family of five.

## What was built

**`useFitRows` — `packages/ui/src/lib/use-fit-rows.ts` (new).** Renders every row
once to cache its bottom offset, then shows only the **whole** rows that fit,
reserving a line for the remainder; a `ResizeObserver` re-clamps from the cache.

**It was not written for this bug — it was already in the repo.** Calendar's
up-next `DayList` had solved this problem inline months earlier. Finding that is
what set the shape of the fix: the chores widget did not need a clever new
approach, it needed the one the codebase had already settled on. `DayList` is
ported onto the extracted hook (105 calendar tests unchanged, which is the port's
proof), so the two cannot drift the way `ActivityRow`/`AdminRow` did.

**Applied to all four chores lists, not just the reported one.** The taskee
standard/large lists clip identically once a kid has enough chores — and a
silently dropped chore is worse there than a dropped face, because the kid never
learns they owed it.

Also: `HeroCount` gains `inline`, `ProgressBar` gains `caption`, `MoreLine` gains
a label. `FamilyCompact` is deliberately untouched — a short slot has no list to
make room for, so the stacked hero stays.

**A gotcha the extraction created:** `useFitRows` re-measures on array identity,
so a `[...tasks].sort()` in the render body never settles. Every list source is
`useMemo`'d, and the comment at each site says why rather than leaving the next
reader to find out by hanging the tab.

**One thing caught by writing it out:** inline, the all-done case read
`0 🎉 all done today`. The stacked version had the same bare `0` and it had never
looked wrong. `FamilyLarge` now uses the celebration treatment **this same file
already defines** for `TaskeeLarge`, rather than a new one.

## Result at the reported geometry

|                             | before                      | after                       |
| --------------------------- | --------------------------- | --------------------------- |
| aggregate block             | 3 lines, ~92px              | 1 line + bare meter, ~46px  |
| list room in a 363px slot   | 185px → 3 tiles, 4th sliced | 231px → 4 tiles, 21px spare |
| when it genuinely overflows | silent mid-tile crop        | whole tiles + `+N more`     |

Urgent-first ordering already decided who survives a clamp, so the members the
tile drops are the ones with the least outstanding.

## Verification

Live-reviewed in the running app at 1112×814 against four seeded members
(tier 4), signed off by the user; the seeded rows were deleted afterwards. New
Storybook story `Family — more members than the slot` covers the overflow path.

ui **181** (+3 — the clamp, under stubbed jsdom layout) · chores **59** (+3) ·
calendar **105** (unchanged). Typecheck + lint clean across all three.

## Shipped, and the twenty minutes after

`release` built `3a6e213`, `deploy` pinned that tag and recreated the stack —
green at 20:34 UTC. The iPad still showed the old widget, and **that is the
expected state, not a broken pipeline.** The service worker is network-first for
navigations, but **an installed iOS PWA in standalone mode never issues one on
resume** — it restores the existing page, and standalone has no reload control.
Quitting the app from the app switcher fixed it.

The generalizable part is the order of the check: **verify the server before
touching the device.** Prod's entry script was `D8jn4xGC` against the report's
`CU0XRQue`, and the deployed chores chunk grepped positive for markup only the
new code emits (`items-baseline justify-between`) and negative for the old
(`mt-2 mb-3 flex items-end`). That settles "did it deploy" in one command and
leaves only the client to explain. Written up in `docs/deployment.md` Part D.

Report #70 was then moved to `deployed` on the triage board, which notified the
reporter in-app — **ADR 046's loop closed end to end for the first time**:
in-app report → GitHub issue → fix → deploy → notification back to the person
who filed it.

## What the next session needs to know

- **`useFitRows` is now the standing answer for a home-widget list.** Any list
  rendering into a `WidgetGrid` slot has a height it cannot know at author time;
  `overflow: hidden` is not a strategy, it is a silent failure. Family-feed's
  widget has not been checked against this.
- The whole diagnosis came from the report's **capture** — route, viewport, tier.
  ADR 046 was built on the argument that a family member cannot be asked to find
  those; this is the first fix that was located by them rather than by staging
  the failure through a person holding a device.
