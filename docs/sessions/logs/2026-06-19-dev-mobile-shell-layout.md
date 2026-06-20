# Session — Dev: Mobile App-Shell Layout (scroll + sticky chrome)

**Date:** 2026-06-19
**Type:** development (+ `design-system.md` standard)
**Origin:** Post-M2 chores live review (2026-06-19), mobile/tunnel testing.

## Problem

On mobile the Home page didn't scroll — content was cut off — and the top bar
and bottom nav looked broken (perceived as "not sticky"). Reported as an
app-shell layout issue.

## What was decided / found

The shell chrome was **already structurally correct**:

- The mobile top bar (`MobileBrandTopBar`) is a `shrink-0` sibling rendered
  **above** `<main>`, outside the scroll flow — so it stays put.
- `<main>` (`flex-1 overflow-auto` with `pb-[calc(56px+env(safe-area-inset-bottom))]
md:pb-0`) is the single scroll container.
- The bottom tab bar is `fixed bottom-0` with `padding-bottom: env(safe-area-inset-bottom)`.

**Root cause was `Home.tsx`**, not the chrome: it pinned itself to a bare
`h-full` with `flex-1 min-h-0` on the widget grid. On mobile the single-column
widget stack has fixed per-widget heights (≥180px each) that exceed the viewport,
so it overflowed a height-constrained box and got **clipped instead of letting
`<main>` scroll**. Other pages (e.g. Settings via `SettingsLayout`, `p-8 max-w-2xl`)
already flow naturally and scrolled fine — so this was Home-specific, surfaced
as a shell problem.

## What was built

1. **`apps/shell/src/pages/Home.tsx`** — `h-full` → `md:h-full`; widget grid
   `flex-1 min-h-0` → `md:flex-1 md:min-h-0`. Below `md:` the page flows
   naturally and `<main>` scrolls; at `md:`+ it fills the frame and the grid
   scales `rowHeight` to fit (unchanged desktop/tablet behaviour).
2. **`apps/shell/src/App.tsx`** — outer shell frame `h-screen` → `h-dvh`
   (dynamic viewport height) so mobile browser chrome (URL bar) never truncates
   the layout.
3. **`docs/design-system.md`** — new **"App-shell scroll model"** subsection under
   Mobile Surface documenting the standard: single `<main>` scroll container,
   sticky chrome outside it, `h-dvh` frame, `<main>` bottom padding to clear the
   fixed tab bar, and the `md:h-full` opt-in (never a bare `h-full`) for
   fill-the-viewport views. "Last updated" header bumped to 2026-06-19.

## Verification

- `pnpm typecheck` ✅, `pnpm lint` ✅.
- **Live mobile-viewport review** (Playwright, iPhone 13, against the running dev
  shell at :5173): `<main>` scrollable (scrollHeight 676 > clientHeight 612),
  scrolled the full range (scrollTop 0 → 64); top bar (`top: 0`) and bottom tab
  bar (`top: 607`) stayed fixed across the scroll. Screenshots confirmed the
  Calendar placeholder — previously cut off — is fully revealed above the tab
  bar after scrolling. User signed off.

## What the next session needs to know

- **Bug Bash (#3 Settings mobile layout)** is the related follow-up. `SettingsLayout`
  already flows naturally (no `h-full`), so it inherits the scroll fix for free;
  #3 is about its mobile padding/width polish, not scroll.
- The documented standard means any new full-shell view must use `md:h-full`
  (not bare `h-full`) if it wants to fill the viewport — check against the
  App-shell scroll model section.

## Open questions

None.
