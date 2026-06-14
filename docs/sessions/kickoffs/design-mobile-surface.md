# Kickoff — Design: Mobile Surface

**Type:** Design
**Branch:** `dev/mobile-surface-design` (produces Storybook stories + design-system.md updates)
**Story spec:** referenced in `docs/modules/platform/stories/pwa-installable.md` Out scope
**Origin:** Deferred explicitly from pwa-installable story ("mobile-specific nav or layout: deferred design session")

---

## Pre-session reads

- [ ] `CLAUDE.md`
- [ ] `docs/design-system.md` — full read: Surfaces (especially "Other Surfaces" section), Tablet Nav Layout, Typography, Elevation; note what's settled vs. still TBD for mobile
- [ ] `docs/modules/platform/stories/pwa-installable.md` — context on what's already shipped (manifest, SW, standalone mode)
- [ ] ADR 022 (widget/nav layout — the tablet layout this session must adapt, not contradict)
- [ ] ADR 003 (tier model — tier-gated nav must hold on mobile too)
- [ ] `apps/shell/src/components/Sidebar.tsx` — understand the tablet sidebar structure before designing the mobile alternative

## Session scope

Define the mobile nav pattern and layout system for the PWA — the structure that makes Family OS feel intentional on a phone, not a shrunk tablet.

## Surfaces in scope

Mobile (PWA, `display: standalone`). The tablet layout is already settled in ADR 022 and must not be disrupted. Decisions here must be statable so future TV/Pi surface work can inherit them.

## Constraints coming in

- **ADR 022** — sidebar nav (220px, profile chip at top, widget grid) is the tablet pattern. Mobile gets a different nav structure; the sidebar must not appear on narrow viewports.
- **ADR 003** — tier-filtered nav holds on all surfaces. Whatever the mobile nav pattern, it must support hiding nav items by `minTier`.
- **Design system (elevation)** — `--card` + `--shadow-raised` for elevated surfaces; `--background` for the page; no ad-hoc Tailwind shadows.
- **Motion** — no new tokens; use the settled motion system.
- **PWA standalone** — no browser chrome. The design must account for safe-area insets (notch, home indicator). Use CSS `env(safe-area-inset-*)`.
- **Responsive breakpoint** — the shell already uses Tailwind; define a canonical breakpoint (suggest `md: 768px`) as the tablet/mobile split. This becomes a settled convention.

## Decisions to make

### 1. Mobile nav pattern

Options:

- **A. Bottom tab bar** — 4–5 icon tabs at the bottom. Standard mobile pattern, thumb-friendly, always visible. Limited to ~5 destinations; overflow into a "More" tab.
- **B. Hamburger drawer** — top-left menu button reveals a side drawer with full nav. More nav items possible; less discoverable; adds tap to access any page.
- **C. Top navigation bar** — nav lives above content in a compact bar. Works for simple apps; competes with content; harder to reach on tall phones.

Recommendation: **A** — bottom tab bar. Family OS's primary surfaces (Home, Feed, Chores, Calendar) fit within 4–5 tabs. It matches the "pick up and glance" use case of a shared family app.

For each decision: confirm it holds at all tier levels (a tier 2 child's tab bar has fewer items than a tier 4 parent's).

### 2. Breakpoint

Define and document the canonical mobile/tablet breakpoint. Suggest `768px` (`md:` in Tailwind). Below this, sidebar is hidden; bottom tab bar appears.

### 3. Profile chip placement

Tablet: profile chip is at the top of the sidebar. Mobile: the sidebar is gone.
Options:

- Tab bar includes a profile avatar tab (rightmost)
- Profile chip moves to a top-right header area
- Profile switching is behind a long-press or a dedicated route

Recommendation: **Profile avatar as the rightmost tab** — visible at all times, consistent with iOS/Android conventions, no top header needed.

### 4. Widget grid on mobile

The home widget grid (React Grid Layout) is tablet-first. On mobile:

- Option A: single-column stack (widgets reflow to full width, ordered by tier-default priority)
- Option B: horizontal scroll carousel of widget cards

Recommendation: **A — single-column stack**. Carousels add cognitive load; a simple top-to-bottom priority order is predictable.

### 5. Safe-area insets

Bottom tab bar must account for `env(safe-area-inset-bottom)` (home indicator on iPhone). Document the pattern so every mobile surface uses it.

## Exploration

Build a Storybook viewport story showing the mobile nav at 375px width with:

- Frame A: bottom tab bar with 4 tabs (Home, Feed, + placeholder for Chores/Calendar)
- Frame B: hamburger drawer

Use real shell components where they exist. Label frames clearly.

---

## Outputs (required before closing)

- [ ] All 5 decisions made and recorded
- [ ] UX exploration (Frame A vs. B nav) built as Storybook story; selected frame noted in log
- [ ] `docs/design-system.md` updated — new "Mobile Surface" section covering: nav pattern, breakpoint, profile chip placement, widget grid reflow, safe-area handling
- [ ] Any new ADR if the mobile nav pattern constrains future plugin development (likely: ADR for mobile nav contract)
- [ ] Session log committed to `docs/sessions/logs/YYYY-MM-DD-design-mobile-surface.md`
- [ ] `CLAUDE.md` current status updated
- [ ] `docs/sessions/queue.md` updated

## Session log format

```
## What was decided (one entry per decision)
## UX frame chosen and rationale
## What was produced
## New ADRs written
## Open questions raised
## What the next session needs to know
```
