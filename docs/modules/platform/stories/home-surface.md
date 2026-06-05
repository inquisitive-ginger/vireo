# Story: Home Surface

**Module:** platform
**Status:** ⬜ Not Started

## User story
As any user, I can see a tier-appropriate widget grid on the home screen so the platform presents the right content from first load.

## Scope
**In:**
- React Grid Layout (`react-grid-layout`) installed and configured: `cols: 4`, `rowHeight: 180`, `gap: 16`
- Static mode (`isDraggable: false`, `isResizable: false`)
- Platform config seeded with three default layouts per ADR 028 (family pseudo-profile, tiers 1–2, tiers 3–4)
- Per-user layout stored in platform DB as `{ widgetId, x, y, w, h }[]` in a new `widget_layouts` table; seed tier-appropriate default layout on first home-screen load if no layout record exists for the active profile
- Shell checks plugin registry at render time; renders placeholder card for any absent reserved module
- Placeholder card: `--muted` background, `--muted-foreground` module name, Lucide icon, one-line description, no interactive affordances
- Motion tokens (`--duration-fast: 100ms`, `--duration-normal: 200ms`, `--duration-slow: 300ms`; `--ease-out`, `--ease-in`, `--ease-in-out`) added to `packages/ui/src/styles.css`
- Manual dark mode toggle accessible to all tiers in display preferences; preference stored per-profile; overrides `prefers-color-scheme`; family pseudo-profile follows `prefers-color-scheme`
- Playwright smoke test added to `packages/e2e` (created in shell-skeleton/M0): test loads `/` and asserts the widget grid container is present in the DOM
- `WidgetGrid`, `WidgetSlot`, and `PlaceholderCard` exported from `packages/ui` with Storybook stories

**Out:** Drag-and-drop layout editing; widget configuration UI; mobile layout; actual Chores or Calendar plugins (those slots render placeholders in M1)

## Acceptance criteria
1. Family pseudo-profile home screen renders: Family Feed placeholder (banner, 4×1), Chores placeholder (2×1), Calendar placeholder (2×1)
2. Tier 1–2 home screen renders: Chores placeholder large (2×2), Family Feed placeholder (2×1), Calendar placeholder (2×1)
3. Tier 3–4 home screen renders: Calendar placeholder large (2×2), Family Feed placeholder (2×1), Chores placeholder (2×1)
4. A placeholder card for an absent reserved module shows `--muted` background, `--muted-foreground` module name, a Lucide icon, and a one-line description with no interactive affordances
5. When the Family Feed plugin is installed, its reserved slot renders the widget component instead of the placeholder card
6. No entrance animations occur on initial widget grid render
7. Motion tokens are defined in `packages/ui/src/styles.css` and available to plugin stylesheets
8. Any profile can toggle dark mode in display preferences; the preference is stored per-profile and applied on load; the family pseudo-profile follows `prefers-color-scheme`
9. The Playwright smoke test added to `packages/e2e` passes: loads `/` and asserts the widget grid container is present in the DOM
10. `WidgetGrid`, `WidgetSlot`, and `PlaceholderCard` are exported from `packages/ui` with Storybook stories covering their key states

## Dependencies
- none

## Notes
`widget_layouts` table schema: `{ id uuid PK, profile_id uuid FK → platform.profiles, widget_id text, x int, y int, w int, h int }`. Seed the tier-appropriate default layout on first home-screen load if no layout record exists for the active profile. The Family Feed widget slot will render a placeholder until the family-feed-read story is complete.
