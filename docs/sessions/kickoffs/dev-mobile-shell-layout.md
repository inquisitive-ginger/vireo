# Kickoff — Dev: Mobile App-Shell Layout (scroll + sticky chrome)

**Type:** development (+ `design-system.md` entry — establishes a standard)
**Origin:** Post-M2 chores live review (2026-06-19), mobile/tunnel testing.

## Problem

On mobile, the Home page **doesn't scroll** — the title bar (`MobileBrandTopBar`)
and bottom nav (`BottomTabBar`) should be **sticky** while the page body scrolls
underneath; instead the content is **cut off**. This is an app-shell layout
issue, not a Home-specific one.

## Scope

Fix the mobile sticky-chrome + scrollable-body layout, then **standardize the
pattern and apply it throughout** — any view rendered inside the app shell should
get a correctly-scrolling body under fixed top/bottom chrome (safe-area insets
respected). Document the pattern in `design-system.md` so future surfaces inherit it.

## Pre-session reads

- `apps/shell/src/App.tsx` (shell layout: `Sidebar` + `MobileBrandTopBar` + `main` + `BottomTabBar`)
- `apps/shell/src/components/MobileBrandTopBar.tsx`, `packages/ui/src/components/bottom-tab-bar.tsx`
- `apps/shell/src/pages/Home.tsx` (current overflow/`pb-[…]` handling)
- `docs/design-system.md` (add the layout pattern)

## Required outputs

- Mobile home (and other shell views) scroll correctly with sticky top + bottom chrome; nothing cut off; safe-area insets respected
- The pattern documented in `design-system.md` and applied app-wide
- Live-app review on a real mobile viewport / device
  **Related:** Settings mobile layout (#3) is queued in the Bug Bash — apply this pattern there too where relevant.
