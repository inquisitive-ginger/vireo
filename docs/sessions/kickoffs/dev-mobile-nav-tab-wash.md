# Kickoff — Dev: mobile nav active-tab wash (auto-bug #123)

**Type:** development (bug fix, ad-hoc) · **Reported:** 2026-08-23 in-app by Dad
(tier 4), route `/`, 426×860, Android Chrome · **Report id**
`f6423b36-cc6b-4294-af66-2cbe5ccff4e2`

## The report

> Pill wash should cover the icon and label.in mobile nav

## Pre-session reads

- `packages/ui/src/components/bottom-tab-bar.tsx` — `TabItem`
- `docs/design-system.md` §"Nav pattern — top bar + bottom tab bar"
- `apps/shell/src/components/Sidebar.tsx` — the desktop active row, for the recipe
- ADR 033 / 034 (bar shape and slots — neither settles the active treatment)

## Scope

The `bg-primary/13` wash sits on a `h-6 px-4 rounded-full` span holding the icon
alone; the label sits outside it. Move the wash to a stack wrapping both.

**Shape gated with the user 2026-08-23** (artifact
`https://claude.ai/code/artifact/c74c942c-5c9e-4926-b9b6-b93958012a61`, three bars
at 426px in real tokens, light + dark): **Option B — `rounded-panel` (12px)**,
matching the sidebar's active row, over a full-round lozenge. One active-nav
recipe across both breakpoints.

## ACs

1. The active tab's wash covers icon and label; inactive tabs render no wash.
2. Radius is `rounded-panel`; box is `px-3 py-1`, icon→label gap unchanged (`gap-0.5`).
3. The bar still clears 56px minimum touch height and the `More` tab is unaffected.
4. `Calendar` (the longest pinned label) does not overflow its tab at 426px.
5. `design-system.md` §Nav pattern describes the new active treatment.

## Constraints

- No ADR is in the way; do not open one. This is a treatment detail the
  design-system doc owns.
- `bottom-tab-bar.test.tsx` asserts behaviour, not the wash markup — keep it that way.

## Required outputs

- PR against `main`, no merge without the diff shown.
- Report `f6423b36…` → `deployed` with a resolution once it is live.
