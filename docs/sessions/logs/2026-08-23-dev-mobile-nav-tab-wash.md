# 2026-08-23 — Dev: mobile nav active-tab wash (auto-bug #123)

**Type:** development (bug fix, ad-hoc) · **PR:** #126 (merged) · **Issue:** #123
**Report id:** `f6423b36-cc6b-4294-af66-2cbe5ccff4e2` — Dad (tier 4), route `/`,
426×860, Android Chrome, build `DkSZmYJd`

## What was reported

> Pill wash should cover the icon and label.in mobile nav

## What was wrong

`TabItem` in `packages/ui/src/components/bottom-tab-bar.tsx` put the
`bg-primary/13` active wash on a `grid h-6 place-items-center rounded-full px-4`
span that held the icon alone. The label sat outside it as a sibling of the
button's flex column, so an active tab's label carried `--primary` and semibold
weight but no ground — which is what read as unfinished on a phone. The desktop
`Sidebar` had washed its whole active row since ADR 031, so the two breakpoints
had been quietly disagreeing.

## What was decided

Two shapes were live-gated with the user against a rendered comparison — today's
bar plus both candidates at 426px in Vireo's own tokens, light and dark:
`https://claude.ai/code/artifact/c74c942c-5c9e-4926-b9b6-b93958012a61`.

**Chosen: `rounded-panel` (12px), not a full-round lozenge.** The full-round pill
is the more literal reading of the report, but it makes the wash a discrete
floating object and leaves the sidebar's active row as a second, unrelated
recipe. 12px corners give the shell **one active-nav treatment across both
breakpoints**.

## What was built

One component change: the wash moved from the icon span onto a `flex flex-col
items-center gap-0.5 rounded-panel px-3 py-1` stack wrapping icon **and** label.
`gap-0.5` moved off the button onto that stack; `min-h-tab-bar`, the tier filter,
the 5-tab cap and the `More` sheet are untouched.

`design-system.md` §"Nav pattern — top bar + bottom tab bar" updated: the
active-tab line specified the old icon-only pill and now specifies the
icon+label `rounded-panel` wash.

## Verification

Measured in the running app (Playwright, 426×860, real plugin registry — Home /
Calendar / Chores / Meals / More), not only in tests:

- Active wash **67.7 × 38px** inside an **85.2px** tab with the longest pinned
  label (`Calendar`) — 8.7px clearance per side, no clipping.
- Bar height **56px + border**, unchanged. The wash is inset decoration; the hit
  area is still the full-height `flex-1` button.
- Reads correctly on both grounds.
- Reviewer (independent): pass, no findings. 198/198 `@family-os/ui` tests,
  `pnpm typecheck` 11/11, eslint + prettier clean. It also worked out that the
  five tabs' min-content widths total 279.4px, so `flex-1` cannot push the bar
  past the viewport even at 320px — only `Calendar` clamps there, and the tabs go
  slightly uneven. Worth knowing before a sixth pinned tab is ever considered.

## Notes for the next session

- **No new test assertion.** `bottom-tab-bar.test.tsx` covers behaviour and
  passes unchanged through the new nesting; a class assertion on the wash would
  only re-encode the diff.
- **No ADR.** 033 and 034 settle the bar's slots and cap, 065 the primary value
  and its second-channel requirement (the semibold label still satisfies it).
  None of them settle the active treatment — that detail belongs to
  `design-system.md`, and it now says so.
- **Closed the loop the same day.** Verified in the deployed app at 426×860 —
  computed radius 12px, wash 67.7 × 38px in an 85.2 × 56px button, both themes —
  and the reporter was notified by hand. The `deployed` flip still needs a prod
  session cookie, which is why #116–118 have been sitting unnotified since
  2026-08-20; that is a real gap in the loop, not a chore.
