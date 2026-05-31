# Story: Shell Skeleton

**Module:** platform
**Status:** ✅ Done

## User story
As a family member, I can open the tablet and see the Family OS shell with a content slot that plugins render into so that there is a consistent entry point for all family features.

## Scope
**In:** React shell renders on the tablet; left sidebar layout (220px wide, profile chip at top, nav items below, Settings entry at bottom — see ADR 022); main content area (`flex-1`) with a plugin content slot; home screen as a named placeholder (explicitly not the widget grid — see ADR 011); Tailwind CSS v4 configured; shadcn/ui installed and usable; system font CSS variables in place (placeholder — specific fonts deferred); 48px minimum touch targets on all nav and sidebar elements

**Out:** Widget grid and role-aware composition (ADR 011 — M1); nav visual styling — colors, typography, active states (Visual Language design session); color palette and tokens (Visual Language design session); mobile, TV, and Pi surfaces; any real content or module UI; tier-filtering of nav items (auth-and-profiles story)

## Acceptance criteria
1. Shell renders at 1280×800 in a Chromium browser without console errors
2. A home screen placeholder is visible and labeled (e.g. "Home")
3. The shell has a left sidebar (220px wide) with a profile chip area at the top and a nav section below it
4. The shell has a main content area that fills the remaining width
5. Navigating to a registered plugin's route renders content in the main content slot
6. A Settings entry is visible at the bottom of the sidebar (visibility gating by tier is handled in auth-and-profiles, not here)
7. All interactive sidebar and nav elements are minimum 48×48px
8. Tailwind CSS v4 is configured — utility classes apply correctly
9. At least one shadcn/ui component renders in the shell without errors
10. CSS custom properties `--font-ui` and `--font-display` are defined (system font values per design-system.md)

## Dependencies
- dev-environment

## Notes
The content slot is a React Router `<Outlet />` or equivalent. The sidebar structure (left sidebar, 220px, profile chip at top) is settled in ADR 022 — implement it here. Nav *visual styling* (colors, active state treatment, sidebar background) is still deferred to the Visual Language design session; use unstyled or minimally styled placeholders. Tier-based nav item filtering is wired in the auth-and-profiles story, not here — render all nav items unconditionally for now.
