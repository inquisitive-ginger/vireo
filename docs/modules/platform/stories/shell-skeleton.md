# Story: Shell Skeleton

**Module:** platform
**Status:** ⬜ Not Started

## User story
As a family member, I can open the tablet and see the Family OS shell with a content slot that plugins render into so that there is a consistent entry point for all family features.

## Scope
**In:** React shell renders on the tablet; nav structure with at least one content slot for plugins; home screen as a named placeholder (explicitly not the widget grid — see ADR 011); Tailwind CSS v4 configured; shadcn/ui installed and usable; system font CSS variables in place (placeholder — specific fonts deferred); 48px minimum touch targets on all nav elements

**Out:** Widget grid and role-aware composition (ADR 011 — M1 Widget Composition design session); specific nav style/positioning (Widget Composition design session); color palette and tokens (Visual Language design session); mobile, TV, and Pi surfaces; any real content or module UI

## Acceptance criteria
1. Shell renders at 1280×800 in a Chromium browser without console errors
2. A home screen placeholder is visible and labeled (e.g. "Home")
3. The shell has a nav element with at least one route that maps to a content slot
4. Navigating to a registered plugin's route renders content in the content slot
5. All interactive nav elements are minimum 48×48px
6. Tailwind CSS v4 is configured — utility classes apply correctly
7. At least one shadcn/ui component renders in the shell without errors
8. CSS custom properties `--font-ui` and `--font-display` are defined (system font values per design-system.md)

## Dependencies
- dev-environment

## Notes
The content slot is a React Router `<Outlet />` or equivalent. The nav layout (sidebar vs. top bar, exact positioning) is explicitly not decided here — the shell needs a nav structure but its visual design is deferred to the Widget Composition design session. Use a minimal layout that doesn't bake in assumptions.
