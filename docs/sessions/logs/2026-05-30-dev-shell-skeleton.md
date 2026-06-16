# Session Log — Development: shell-skeleton

**Date:** 2026-05-30
**Type:** Development
**Story:** platform/shell-skeleton

---

## What was built

- **`apps/shell/src/App.tsx`** — shell layout component: `<Sidebar />` + `<main><Outlet /></main>` (React Router v6 pathless layout route pattern)
- **`apps/shell/src/main.tsx`** — React Router setup with pathless layout route, named child routes (`/` → Home, `/demo` → DemoPage), and `path="*"` catch-all so the layout always renders
- **`apps/shell/src/components/Sidebar.tsx`** — 220px sidebar: profile chip area (min-h-[48px]), nav section with `<NavLink>` items (min-h-[48px] each), Settings link pinned to the bottom via border-t
- **`apps/shell/src/components/ui/button.tsx`** — shadcn/ui Button component (new-york style, CVA variants, `@radix-ui/react-slot` support)
- **`apps/shell/src/lib/utils.ts`** — `cn()` helper (clsx + tailwind-merge)
- **`apps/shell/src/pages/Home.tsx`** — home placeholder with `<Button variant="outline">` (satisfies shadcn AC)
- **`apps/shell/src/pages/DemoPage.tsx`** — plugin content slot placeholder route (satisfies AC5)
- **`apps/shell/src/styles.css`** — Tailwind v4 `@theme inline` bridging CSS vars to utility classes; `@layer base` defining `--font-ui`, `--font-display` (system-ui M0 placeholders), and shadcn color tokens using oklch
- **`apps/shell/tsconfig.json`** — added `@/` path alias (`baseUrl` + `paths`)
- **`apps/shell/vite.config.ts`** — added `resolve.alias` for `@/`
- **`apps/shell/vitest.config.ts`** — added `passWithNoTests: true` (prevents false CI failure when no unit tests exist in the shell)
- **`packages/e2e/`** — Playwright E2E scaffold (ADR 024 trigger: created at shell-skeleton)
  - `playwright.config.ts` — Chromium at 1280×800, `webServer` auto-starts shell on port 5173
  - `tests/shell-skeleton.spec.ts` — 12 tests covering all 10 story ACs plus routing robustness

Dependencies added to `apps/shell`: `react-router-dom`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `@radix-ui/react-slot`, `@types/node`

---

## Acceptance criteria status

| AC                                                  | Status  | Notes                                                   |
| --------------------------------------------------- | ------- | ------------------------------------------------------- |
| 1. Renders at 1280×800 without console errors       | ✅ Pass | Verified via Playwright                                 |
| 2. Home screen placeholder visible and labeled      | ✅ Pass | `<h1>Home</h1>` in main content                         |
| 3. Left sidebar 220px, profile chip, nav section    | ✅ Pass | Exact 220px measured; chip at top, nav below            |
| 4. Main content area fills remaining width          | ✅ Pass | 1060px (1280 − 220)                                     |
| 5. Navigating to a plugin route renders in the slot | ✅ Pass | `/demo` route renders DemoPage in `<Outlet />`          |
| 6. Settings entry visible at bottom of sidebar      | ✅ Pass | Pinned via border-t at bottom of sidebar                |
| 7. All interactive elements ≥ 48×48px               | ✅ Pass | All `<NavLink>` elements measured at exactly 48px       |
| 8. Tailwind CSS v4 configured                       | ✅ Pass | `@theme inline` wiring confirmed, utility classes apply |
| 9. At least one shadcn/ui component renders         | ✅ Pass | `<Button>` on Home page, native `BUTTON` element        |
| 10. `--font-ui` and `--font-display` defined        | ✅ Pass | `system-ui, sans-serif` on `:root`                      |

---

## Scope additions (missing requirements folded in)

- **`passWithNoTests: true`** in `apps/shell/vitest.config.ts` — should have been set in dev-environment but wasn't; causes false CI failure.
- **`packages/e2e/` scaffold** — ADR 024 explicitly names shell-skeleton as the trigger for creating this package. The story spec didn't list it as an AC, but it is a settled requirement.
- **`path="*"` catch-all child route** — discovered during verification that React Router v6 `path="/"` is an exact match, not a prefix. A pathless layout route only renders when a child matches. Added `<Route path="*" element={null} />` to ensure the shell layout always renders regardless of URL. Would have broken auth-and-profiles when `/settings` becomes a real route.

---

## New stories created

None. The event-bus story already exists and is up next.

---

## Open questions raised

None. All ACs resolved cleanly.

---

## What the next session needs to know

- The shell is running and testable. `pnpm --filter @family-os/shell dev` starts it on port 5173.
- E2E tests run with `pnpm --filter @family-os/e2e e2e` — Playwright auto-starts the shell if port 5173 is free, or reuses an existing server.
- Nav visual styling (colors, active-state treatment, sidebar background) is still deliberately unstyled — deferred to Visual Language design session per story scope.
- Tier-based nav item filtering is not wired — deferred to auth-and-profiles per story scope.
- The `/demo` route is a static placeholder demonstrating the `<Outlet />` slot. It will be replaced by real plugin routes from the plugin-loader story.
- The `event-bus` story is fully independent — it's server-side (Fastify + EventEmitter + WebSocket). AC6 of event-bus requires a WebSocket listener in the shell; when that's wired, the shell's `main.tsx` will need a `useEffect` hook connecting to the event bus.
