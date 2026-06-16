# Session Log — Dev: Mobile Brand Top Bar

**Date:** 2026-06-15
**Type:** Development (design-decision + wiring; ad-hoc follow-on to dev-mobile-surface)
**Branch:** `main`

---

## Context

The 2026-06-14 mobile-surface session shipped an interim floating bell (`fixed top-3 right-3`) and left two open questions from ADR 033 — bell placement and whether mobile gets a top bar. The floating bell sat over content with dead space to its left, and the profile lived as a bottom-tab slot. A 4-option UX playground (`Platform/Mobile UX Playground`) was built to settle placement.

## What was decided

### Option 1 — Brand top bar (chosen) → ADR 034

A persistent mobile top bar with three slots: **profile avatar (left) · Family OS wordmark (center) · notification bell (right)**. The bottom tab bar drops its profile slot and becomes **nav-only**. Top bar shares the bottom bar's `--secondary` material so the two chrome strips bookend the content.

- **Bell:** always visible (ambient badge awareness — the value the badge exists for).
- **Profile:** avatar opens the existing `ProfileGrid` as a top-anchored dropdown beneath the bar (switch rows → Family view → Settings). Trigger moved to the top, so the menu drops from the trigger.
- **Wordmark:** DM Sans (`--font-ui`), not Lora — Lora is reserved for the one display moment per route (the page title); two stacked serifs would compete.
- **Rejected:** Option 2 (bell in profile sheet — count 2 taps deep; kept as fallback), Option 3 (in-page bell — placement varies per page, Home has no header, every plugin re-implements it), Option 4 (bell slot in tab bar — 6 items breaks the 5-slot bar / iOS-Material ≤5 guidance).

## What was built

### `ADR 034 — Mobile Brand Top Bar` (new)

Records the decision, the four alternatives, wordmark typography rationale, and safe-area handling. **Supersedes** the "Profile chip on mobile" and "no top header bar on mobile in M1" clauses of ADR 033 (annotated in place; 033's bottom-bar / breakpoint / widget-reflow / safe-area decisions still stand). The deferred "bell placement" open question in 033 is marked resolved.

### `App.tsx` — brand top bar

`<header>` with `grid grid-cols-[1fr_auto_1fr]`, `md:hidden`, `--secondary`, `padding-top: env(safe-area-inset-top)`: avatar button (opens `ProfileGrid`) · `Family OS` wordmark · `NotificationBell` (compact). Removed the floating `fixed top-3 right-3` bell. `ProfileGrid` re-anchored to `fixed top-[calc(52px+env(safe-area-inset-top))] left-0 right-0` (top dropdown under the bar).

### `BottomTabBar` — nav-only

Removed `ProfileTabItem` and the `profileName` / `onProfileClick` / `profileActive` props (and the now-unused `ProfileAvatar` import). Bar is now hard-coded Home + tier-filtered plugin tabs only.

### Stories / tests

- `bottom-tab-bar.stories.tsx`: added component doc + `autodocs` + an "In a mobile viewport" story (bar pinned beneath content in a phone frame) — the permanent visual home now that the playground is gone.
- `bottom-tab-bar.test.tsx`: swapped the two profile-tab tests for one asserting no profile tab renders. 9 tests pass.
- `MobileUXPlayground.stories.tsx`: **deleted** (sign-off complete; decision captured in ADR 034).

## Verification

- typecheck clean (`@family-os/ui`, `@family-os/shell`); full suites pass (28 ui, 2 shell).
- Verified live in Storybook: playground Frame 1 (top bar layout) + the updated nav-only `BottomTabBar` story (headless-Chrome screenshots).
- **Not** booted end-to-end in the running shell app (needs platform server/DB). Frame 1 is a faithful replica of the shipped `App.tsx` markup, but a live smoke test of the real mobile shell is an open follow-up.

## Repo note

Lint is broken repo-wide: the eslint config is missing browser/React env globals, so `no-undef` fires on `fetch`, `setTimeout`, `ResizeObserver`, `React`, etc. across many untouched files (28 in ui, 67 in shell). Pre-existing; this diff adds no new pattern. Worth a dedicated fix (add `env: browser` / React settings).

## What the next session needs to know

- The mobile shell is now: brand top bar (`App.tsx`, `md:hidden`) + nav-only `BottomTabBar` + top-anchored `ProfileGrid` dropdown. Tablet path (Sidebar `ProfileChip` + its own `ProfileGrid`) is unchanged.
- Open follow-ups: (1) live smoke test of the real mobile shell; (2) repo-wide eslint env fix; (3) page transition animations on mobile — still deferred per ADR 033.
- Next queued: **M2 Product Planning** (`kickoffs/product-m2.md`).
