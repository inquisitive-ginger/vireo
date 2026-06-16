# Session Log — Design: Mobile Surface

**Date:** 2026-06-14
**Type:** Design
**Story:** Mobile Surface (M1)

---

## What was decided

### 1. Mobile nav pattern — bottom tab bar (Frame A)

4 module tabs (Home, Feed, Chores, Calendar) + profile avatar as the rightmost (5th) tab. Frame B (hamburger drawer) was explored and rejected. The drawer does scale better to many modules — it's a scrollable list with no overflow ceiling — but at M1 we have exactly 4 modules, so Frame A wins on the basis of 1 tap vs 2 taps to reach any destination.

Overflow (when installed modules exceed 4 tabs) is deferred to M8+. At that point Frame A will need a "More" tab and a tab-pinning management UI.

### 2. Breakpoint — `md:` (768px)

Canonical tablet/mobile split. Below this threshold: sidebar hidden, bottom tab bar shown. Above: sidebar visible, no tab bar. Settled shell convention for all responsive work.

### 3. Profile chip placement — rightmost tab

Profile avatar as the 5th tab. Tapping opens the profile grid overlay (same `ProfileGrid` component as tablet). No top header bar on mobile in M1.

### 4. Widget grid on mobile — single-column stack

Full viewport width, ordered by tier-default priority. No carousel. CSS container queries handle the full-width reflow — no mobile-specific widget code needed.

### 5. Safe-area insets — `env(safe-area-inset-bottom)`

Bottom tab bar applies `padding-bottom: env(safe-area-inset-bottom)`. Page content uses `padding-bottom: calc(56px + env(safe-area-inset-bottom))` to avoid tab bar overlap. All mobile layout primitives must respect safe-area insets.

---

## UX frame chosen

**Frame A — bottom tab bar.** Selected over Frame B (hamburger drawer).

Rationale: Frame A delivers 1-tap navigation to all primary surfaces. Frame B's advantage (unlimited scrollable nav items) is not needed at M1 with 4 modules. Frame B's cost (2 taps per navigation) is always present. For a family display that's picked up, glanced at, and put down, friction-per-tap matters.

Storybook story: `Platform/Mobile Nav` — see "Frame comparison" story for the side-by-side. Stories include parent tier, child tier, active tab variants, and an interactive Frame B for comparison.

---

## What was produced

- `apps/shell/src/components/MobileNav.stories.tsx` — exploration story (6 stories: frame comparison, tier variants, active tab states, interactive Frame B)
- `docs/design-system.md` — new "Mobile Surface" section; "Other Surfaces" note updated; "To Be Defined" table updated (mobile row removed)
- `docs/decisions/033-mobile-nav-pattern.md` — ADR for mobile nav pattern, breakpoint, profile chip, widget reflow, safe-area insets, overflow ceiling

---

## New ADRs written

- **ADR 033** — Mobile Nav Pattern

---

## Open questions raised

- **Notification bell on mobile** — the sidebar bell is gone. Likely moves to a per-page top area (page title row) or is surfaced via the profile tab. Deferred to the mobile dev session.
- **Page transition animations on mobile** — the M1 prohibition list bans page slides (written for tablet context). Mobile users have a stronger expectation of slide transitions between tabs. Deferred to the mobile dev session.

---

## What the next session needs to know

The mobile nav pattern (ADR 033) and the `md:` breakpoint are now settled constraints. The mobile dev session should:

1. Add `md:hidden` to `Sidebar` and `md:flex` to a new `BottomTabBar` component (or equivalent responsive class strategy)
2. Decide notification bell placement and implement it
3. Decide page transition animation stance for mobile
4. Implement single-column widget stack below `md:`
5. Verify safe-area insets on a real device (iPhone home indicator)
