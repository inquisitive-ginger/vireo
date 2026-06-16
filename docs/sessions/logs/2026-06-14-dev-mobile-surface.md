# Session Log — Dev: Mobile Surface

**Date:** 2026-06-14
**Type:** Development
**Branch:** `dev/mobile-surface`

---

## What was built

### `BottomTabBar` — `packages/ui/src/components/bottom-tab-bar.tsx`

Exported from `@family-os/ui`. Router-agnostic — accepts `navItems: TabBarItem[]`, `tier`, `activeRoute: string`, `onNavigate: (to: string) => void`, `profileName`, `onProfileClick`, `profileActive`. Home tab is hard-coded as the first tab (matching Sidebar convention). `fixed bottom-0 left-0 right-0 flex md:hidden` — invisible on tablet, floats above content on mobile. `env(safe-area-inset-bottom)` on the container. Tier filtering identical to Sidebar.

Storybook stories in `bottom-tab-bar.stories.tsx`. 10 RTL tests in `bottom-tab-bar.test.tsx` (tier filtering, active state classes, aria-current, navigation callbacks, profile click).

### Sidebar hidden on mobile

`Sidebar`'s `<aside>` changed to `hidden md:flex` — fully invisible below `md:` (768px), fully functional above it. No regressions on tablet.

### `NotificationBell` extracted — `apps/shell/src/components/NotificationBell.tsx`

The `NotificationBell` component was extracted from `Sidebar.tsx` into its own file, accepting an optional `className` prop. Sidebar imports it at `className="px-1 py-1"` — no behavior change on tablet. Mobile top bar imports it at `className="ml-auto"`.

### Mobile top bar in `App.tsx`

`div.flex.md:hidden` in the shell layout renders above `<main>` on mobile only. Shows the current page title (derived from `pathname` + `pluginNavItems`) on the left and `NotificationBell` on the right. Title is omitted when the route doesn't match a known label (e.g. catch-all `*`). Top bar is 48px min-height.

### Shell layout restructured — `App.tsx`

```
flex h-screen w-screen overflow-hidden
├── Sidebar (hidden md:flex, 220px)
└── flex-1 flex flex-col overflow-hidden
    ├── MobileTopBar (flex md:hidden, 48px)
    └── main (flex-1 overflow-auto, pb-[calc(56px+env(...))] md:pb-0)
BottomTabBar (fixed bottom-0, flex md:hidden)
ProfileGrid (mobile: fixed bottom-[calc(56px+env(...))], opened from tab bar)
Toast
```

`ProfileGrid` received a `className` prop so callers can override positioning. Mobile tab bar opens it from `bottom-[calc(56px+env(safe-area-inset-bottom))]` as a bottom-anchored sheet.

### Profile tab — implementation choice

Opens `ProfileGrid` as a fixed overlay anchored above the tab bar (`bottom-[calc(56px+env(safe-area-inset-bottom))]`). Simpler than navigating to `/profile` (no stub route needed) and reuses the existing component.

### Widget grid — single-column reflow (pre-existing)

`WidgetGrid` already implements the mobile stack at `STACK_BREAKPOINT = 768` — `flex flex-col gap-[16px]` with `react-grid-layout` disabled. No changes needed; AC #4 was already satisfied.

### `MobileNav.stories.tsx` — deleted

The design exploration file (Frame A / Frame B comparison) was deleted. `BottomTabBar` now has a permanent story in `packages/ui`.

---

## Decisions resolved

### Bell placement — Option A: top bar bell

Bell icon + badge in a minimal mobile top bar, visible on every page. Rejected Option B (bell in profile sheet) because the badge's ambient awareness value requires it to be in peripheral vision, not hidden behind 2 taps.

### Page transitions — no slide animations, same as tablet

The M1 prohibition list (no page slide animations) extends to mobile. Tab-to-tab transitions use the same cross-fade (`--duration-normal`, `--ease-in-out`) as all route changes on tablet. `design-system.md` updated to note both decisions; prohibition list updated to say "applies to both tablet and mobile."

---

## What the next session needs to know

- `BottomTabBar` has no active indicator (no left accent bar like the sidebar) — this is by design for a bottom tab bar, but worth noting for future visual polish
- The mobile top bar title is derived from `pluginNavItems` — if a shell-native page (e.g. `/settings`) is added without a matching nav item, it won't show a title. Settings is not a primary tab, so this is fine for M1; no action needed.
- `ProfileGrid` uses `className` for positioning override — the prop was added minimally; no other callers are affected.
