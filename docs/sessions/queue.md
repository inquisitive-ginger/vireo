# Session Queue

> Owned by planning sessions. Updated at the end of every planning
> session. All other session types read but don't modify this file.
>
> Each queued session has a kickoff doc in `docs/sessions/kickoffs/` that
> pre-loads context, constraints, and decisions-to-make. Open the kickoff
> before starting work — don't fill out a template live.

---

## Up Next

### M2 Dev: Completion Flow

**Type:** development
**Kickoff:** [kickoffs/dev-chores-completion.md](kickoffs/dev-chores-completion.md)
**Reads:** `docs/modules/chores/stories/completion-flow.md`, `docs/modules/chores/design.md` §2 (XP flight), design-chores-ux session log, dev-chores-task-model session log
**Produces:** `PATCH /api/chores/tasks/:id/complete` route; `chores.task.completed` event; completion button + optimistic UI; route tests + E2E test
**Depends on:** M2 Dev: Task Model + Creation

---

### M2 Dev: XP Award + Parent Notification

**Type:** development
**Kickoff:** [kickoffs/dev-chores-xp-and-notification.md](kickoffs/dev-chores-xp-and-notification.md)
**Reads:** `docs/modules/chores/stories/xp-award.md`, `docs/modules/chores/stories/parent-notification.md`, `docs/modules/chores/design.md` (XP score plate), dev-chores-completion session log
**Produces:** `xp_balances` table; XP event subscriber; `GET /api/chores/xp` route; XP display in chores view; parent notification event subscriber; tests for both stories
**Depends on:** M2 Dev: Completion Flow

---

### M2 Dev: Today Widget

**Type:** development
**Kickoff:** [kickoffs/dev-chores-today-widget.md](kickoffs/dev-chores-today-widget.md)
**Reads:** `docs/modules/chores/stories/today-widget.md`, `docs/modules/chores/design.md` §4 (widget), design-chores-ux session log, dev-chores-task-model session log
**Produces:** `chores.today-summary` widget — read-only tap-through; taskee + family framings (standard + large; compact taskee); fills reserved home screen slot; Storybook stories under a `Chores/` category
**Depends on:** M2 Dev: Task Model + Creation; M2 Design: Chores

---

## Deferred — Platform v2

These sessions were scoped for M1 but don't map to M1's done-when criteria. Kickoff docs exist but should be reviewed for staleness before scheduling.

### M1 Design+Dev: Family Profile Notifications

**Type:** design + development
**Kickoff:** [kickoffs/design-family-profile-notifications.md](kickoffs/design-family-profile-notifications.md)
**Reads:** `docs/modules/platform/stories/family-profile-notifications.md`, ADR 029, notification-design-audit log
**Produces:** design decision on surface shape; `FamilyNotificationStrip` component; ADR 029 amended with `audience` field
**Depends on:** notification-infrastructure ✅, family-feed-read ✅

---

### M1 Dev: Push Multi-Profile Device

**Type:** development
**Kickoff:** [kickoffs/dev-push-multi-profile-device.md](kickoffs/dev-push-multi-profile-device.md)
**Reads:** `docs/modules/platform/stories/push-multi-profile-device.md`, web-push session log
**Produces:** schema migration (composite key); updated subscribe/unsubscribe/410 routes; updated tests
**Depends on:** web-push ✅

---

## Recently Completed

- **2026-06-16 — M2 Dev: Task Model + Creation** ![Type](https://img.shields.io/badge/Type-Development-orange)
  First chores story shipped. `chore-engine` plugin scaffolded (`turbo gen` + extended to the family-feed structure) and registered (port 3012). `chore_engine.tasks` table; `POST /api/chores/tasks` (tier-4 create, validates title/assignee, emits `chores.task.created`) + `GET /api/chores/tasks`. **List scope (settled in live review):** tiers 1–3 see own tasks; tier 4 (admin) **and the family pseudo-profile** see all (explicit tier filter, **not** `accessibleBy` — namespaced subjects don't map). `/chores` view: **tier-4 admin board** (by-assignee lanes, workload meter, per-lane add, right-drawer create) / **tiers 1–3 taskee** status-encoded list (Agency variant; Focus deferred) / **family dashboard** = read-only board. `chores.task.{view,create,complete}` in `PERMISSION_REGISTRY` (`complete` rule deferred to Completion Flow). `check-square` icon; Playground deleted; real `Chores/…` stories. **Live-review fixes:** family-dashboard 500, shell `load-plugin`/federation wiring, profile-switch refetch, "Family" filtered from assignees. **Reusable `EmptyState`** added to `packages/ui` and applied across chores / family-feed / notifications tray. `db:reset --module chore-engine`. Dev session template gained a **live-app review gate** before close-out. 203 tests green. **Open:** `turbo gen plugin` generator bug; admin-completion question carried to Completion Flow.
  _See:_ `docs/sessions/logs/2026-06-16-dev-chores-task-model.md`

- **2026-06-15 — M2 Design: Chores** ![Type](https://img.shields.io/badge/Type-Design-blueviolet)
  Full chores UX locked across 4 groups via an interactive Storybook playground. **Page layout:** two taskee variants (Focus / Agency, by a per-profile "Focus mode" setting defaulting from tier) + admin grouped-by-assignee lanes with workload meter, scope/hide-completed/pulse-filter controls. **Completion:** the "XP flight" — the gold badge lifts off the chore and arcs to the lifetime score plate (count-up on landing); `pending → inFlight → done+banked` sequencing keeps the points tethered to their chore. **Create/assign:** right drawer, one form for create / per-person prefill / edit+remove (gold reward presets). **Widget:** `chores.today-summary` read-only tap-through (inline-complete = 1.5), standard+large for taskee & family (+ compact taskee), completion surfaced in the family summary. New cross-cutting conventions added to `design-system.md` (gold/XP "treasure" semantic; status-vs-identity colour rule). Dev-facing spec in `docs/modules/chores/design.md`. Playground retained as the visual reference until real components ship. **Owed:** ADR on member capacity (gates 1.5 capacity-aware load meter).
  _See:_ `docs/sessions/logs/2026-06-15-design-chores-ux.md`

- **2026-06-15 — M2 Product Planning** ![Type](https://img.shields.io/badge/Type-Planning-orange)
  5 stories defined across the `chores` module. `docs/modules/chores/` created (spec, progress board, 5 story specs). Open questions resolved: one-shot tasks only (no recurrence), XP as running total (no levels), auto-accept completion (no approval step), one assignee per task (tier 4 assigns). XP Award + Parent Notification combined into one dev session. M2 Design: Chores queued ahead of all dev sessions.
  _See:_ `docs/sessions/logs/2026-06-15-product-m2.md`

- **2026-06-15 — M1 Dev: mobile-brand-top-bar** ![Type](https://img.shields.io/badge/Type-Development-orange)
  Settled the mobile bell/profile placement left open by ADR 033. Built a 4-option UX playground, chose **Option 1 — brand top bar** (avatar · Family OS wordmark · bell), and wired it into `App.tsx` (`grid`, `safe-area-inset-top`; floating bell removed; `ProfileGrid` re-anchored as a top dropdown). `BottomTabBar` is now nav-only (profile slot + props removed). ADR 034 added; ADR 033 superseded clauses annotated. Story gains autodocs + mobile-frame variant; tests updated; playground deleted. typecheck + 30 tests green.
  _See:_ `docs/sessions/logs/2026-06-15-dev-mobile-brand-top-bar.md`

- **2026-06-14 — M1 Dev: mobile-surface** ![Type](https://img.shields.io/badge/Type-Development-orange)
  `BottomTabBar` in `packages/ui` (tier filtering, profile avatar tab, safe-area insets, 10 RTL tests). Sidebar hidden `md:`. Mobile top bar (`flex md:hidden`) with page title + bell. Shell layout restructured (flex column for mobile top bar + main). Bell=Option A (top bar, always visible). Page transitions: no slide, same cross-fade as tablet. `design-system.md` updated. `MobileNav.stories.tsx` deleted; `BottomTabBar` has permanent story in `packages/ui`.
  _See:_ `docs/sessions/logs/2026-06-14-dev-mobile-surface.md`

- **2026-06-14 — M1 Design: mobile-surface** ![Type](https://img.shields.io/badge/Type-Design-blueviolet)
  Bottom tab bar pattern settled (Frame A over hamburger drawer). `md:` (768px) as canonical tablet/mobile breakpoint. Profile avatar as rightmost tab. Single-column widget stack on mobile. `env(safe-area-inset-bottom)` on tab bar. ADR 033. Open: bell placement + page slide animations deferred to mobile dev session.
  _See:_ `docs/sessions/logs/2026-06-14-design-mobile-surface.md`

- **2026-06-13 — M1 Design: widget-slot-states** ![Type](https://img.shields.io/badge/Type-Design-blueviolet)
  `WidgetSlot flat` prop strips card chrome for non-content slots. `ErrorCard` component (Level-2 error state). `FeedPostCard variant="widget"` adds identity spine without card chrome; `FeedWidgetView` switched to it. Three-state visual language settled: elevated (live), flat muted (not installed), flat muted + AlertTriangle (error). Identity-in-widget rule documented for all future content widgets. Shell wiring (`flatSlots`) and error boundary hookup are dev follow-ons.
  _See:_ `docs/sessions/logs/2026-06-13-design-widget-slot-states.md`

- **2026-06-13 — M1 Design: shell-chrome-interaction-states** ![Type](https://img.shields.io/badge/Type-Design-blueviolet)
  Sidebar surface → `--secondary` (bug fix; was `--background`). Active nav → `bg-primary/20 text-primary`. Hover unified → `bg-primary/10`. `--accent` locked to module identity only. All sidebar hairlines removed. ADR 031. Design-system.md updated; color-tokens story reconciled; Sidebar.tsx updated.
  _See:_ `docs/sessions/logs/2026-06-13-design-shell-chrome-interaction-states.md`

- **2026-06-07 — M1 Dev: family-feed-read** ![Type](https://img.shields.io/badge/Type-Development-orange)
  Family Feed plugin scaffold. `family_feed.posts` Prisma schema + `db push`. `GET /api/family-feed/posts` with cursor pagination + platform profile join. `FeedWidget` (CSS container queries, Frame A — dividers). `FeedPage` with load-more. `FeedPostCard`, `FeedEmptyState` in plugin. Unified Storybook glob covers plugin stories. Shell wired: `getLazyWidget`, `Suspense` fallback, `family-feed` in `plugins.json`. 8 API unit tests.
  _See:_ `docs/sessions/logs/2026-06-07-dev-family-feed-read.md`

- **2026-06-07 — M1 Dev: web-push** ![Type](https://img.shields.io/badge/Type-Development-orange)
  VAPID key lifecycle. `push_subscriptions` table. Subscribe/unsubscribe routes. `sendPushToProfile()` hooked into `POST /notifications` for `priority: 'alert'`. Service worker push event handler. `usePushSubscription` hook in `@family-os/platform`. Push Notifications toggle in Settings (tier 3+ via `TierGate`). 12 API unit tests + 5 E2E tests.
  _See:_ `docs/sessions/logs/2026-06-07-dev-web-push.md`

- **2026-06-06 — M1 Dev: pwa-installable** ![Type](https://img.shields.io/badge/Type-Development-orange)
  `manifest.webmanifest` (name, icons, standalone, start*url, theme/background colors). Manual service worker (cache-first for shell assets, network-first for `/api/`, `/events`, `/plugins/`). 192px + 512px PNG icons. SW registration in `main.tsx`. 3 Playwright tests (manifest fields, icons, SW registration). Chose manual SW over `vite-plugin-pwa` to avoid Module Federation build conflicts.
  \_See:* `docs/sessions/logs/2026-06-06-dev-pwa-installable.md`

- **2026-06-06 — M1 Dev: notification-infrastructure** ![Type](https://img.shields.io/badge/Type-Development-orange)
  `useNotify()` hook exported from `@family-os/platform`. Sonner toast (variant timing, max 3 visible). `notifications` DB table with 50-item pruning. Four API routes (POST/GET/GET-unread/POST-read). `Toast`, `BellBadge`, `NotificationItem`, `NotificationTray` in `packages/ui`. Bell integrated in Sidebar (tier 2+). 17 API + 14 UI tests. Storybook stories for all components.
  _See:_ `docs/sessions/logs/2026-06-06-dev-notification-infrastructure.md`

- **2026-06-06 — M1 Dev: accessibility-radix-audit** ![Type](https://img.shields.io/badge/Type-Development-orange)
  `ConfirmDialog` replaced with `@radix-ui/react-alert-dialog` (focus trap, Escape dismiss, scroll lock). Full audit confirmed `Drawer` and `Switch` were already on Radix. `PinInput` documented as Radix-exempt (numeric input mask, no open/closed/expanded state). `BackdropDismiss` story replaced with `EscapeKeyDismiss`.
  _See:_ `docs/sessions/logs/2026-06-06-dev-accessibility-radix-audit.md`

- **2026-06-06 — M1 Dev: permission-overrides** ![Type](https://img.shields.io/badge/Type-Development-orange)
  Drawer-based profile edit (autosave name, role buttons). `GET/POST/DELETE` override routes with CASL baseline merge. `Switch`, `Drawer`, `PermissionToggleItem`, `PermissionToggleList` in `packages/ui`. Last-admin guard (409). Tier change atomically clears overrides. React.memo + pendingKey fix for switch re-render. 79 API unit tests + 8 E2E tests. `dev/reset` now seeds layout config + family profile layout.
  _See:_ `docs/sessions/logs/2026-06-06-dev-permission-overrides.md`

- **2026-06-06 — M1 Dev: profile-management-tests** ![Type](https://img.shields.io/badge/Type-Development-orange)
  Written as part of the profile-management session. 11 E2E tests (route guard, family name, profile CRUD, PIN reset) in `profile-management.spec.ts`; API integration tests covering `GET /auth/pin-exists`, `POST /auth/pin/check`, `PATCH /settings/family-name` in `profiles.test.ts`. All 62 API tests and 11 E2E tests passing.
  _See:_ `docs/sessions/logs/2026-06-06-dev-profile-management.md`

- **2026-06-09 — M1 Dev: settings-permissions** ![Type](https://img.shields.io/badge/Type-Development-orange)
  Lowered `/settings` route guard to tier 2+. Wrapped admin sections (Family, Profiles, Security) with `TierGate min={4}` inside the page. Settings nav item visible for tier 2+. 15 new E2E tests. Fixed 4 pre-existing E2E failures (shell-skeleton settings assertion, demo-plugin profile selector, profile-management partial match + dialog text). Fixed `ProfileAvatar` CSS shorthand/longhand React warning. Fixed E2E test DB: `packages/e2e` now loads `.env.test` (`familyos_test`) via `node --env-file`.
  _See:_ `docs/sessions/logs/2026-06-09-dev-settings-permissions.md`

- **2026-06-08 — M1 Design: typography-scale** ![Type](https://img.shields.io/badge/Type-Design-blueviolet)
  11-token major 2nd scale (base 16px, ratio 1.125). Lora for `page-title`, `display-lg`, `display-xl`; DM Sans for all other tokens. All tokens defined as `@utility` classes in `styles.css`. `h1–h6` blanket Lora rule removed; 5 components updated to token classes.
  _See:_ `docs/sessions/logs/2026-06-08-design-typography-scale.md`

- **2026-06-06 — M1 Dev: family-onboarding tests** ![Type](https://img.shields.io/badge/Type-Development-orange)
  Setup + auth unit tests (28 passing), onboarding E2E spec, `POST /api/dev/reset` endpoint. Fixed test DB (missing migration + seed) and vitest parallelism race (singleFork). Playwright project dependencies for onboarding-first ordering.
  _See:_ `docs/sessions/logs/2026-06-06-dev-family-onboarding-tests.md`

- **2026-06-06 — M1 Dev: family-onboarding** ![Type](https://img.shields.io/badge/Type-Development-orange)
  3-step onboarding flow (family name + parent, add members, PIN). `packages/schemas` with shared Zod v4 schemas. `ProfileAvatar`, `Input`, `Label`, `Badge`, `ghost-destructive` Button variant in `packages/ui`. `RequireSetup` route guard. `db:reset` script. PIN gate narrowed to tier < 4 → tier 4 only. Husky + lint-staged pre-commit formatting hook.
  _See:_ `docs/sessions/logs/2026-06-06-dev-family-onboarding.md`

- **2026-06-05 — M1 Dev: home-surface** ![Type](https://img.shields.io/badge/Type-Development-orange)
  Widget grid live end-to-end: `WidgetGrid`, `WidgetSlot`, `PlaceholderCard` in `packages/ui`; layout API with per-tier seeding; dark mode toggle in Settings; 18 E2E tests passing.
  _See:_ `docs/sessions/logs/2026-06-05-dev-home-surface.md`

- **2026-06-04 — M1 Product Planning** ![Type](https://img.shields.io/badge/Type-Planning-orange)
  9 stories defined across `platform` and `family-feed` modules. Form library settled: React Hook Form + Zod with `packages/schemas` for shared schemas. Dark mode toggle scoped to all tiers. Queue updated with M1 implementation sessions.
  _See:_ `docs/sessions/logs/2026-06-04-product-m1.md`

- **2026-06-04 — Notification & States Design** ![Type](https://img.shields.io/badge/Type-Design-blueviolet)
  Notification and alert patterns (toast + tray model, bell badge severity, `platform.notify()` API), error states (three levels), empty states (anatomy + tier-aware copy tone), and motion tokens (duration + easing tokens, M1 prohibition list).
  _See:_ `docs/sessions/logs/2026-06-04-design-notifications-states.md`

- **2026-06-03 — Home Surface Design** ![Type](https://img.shields.io/badge/Type-Design-blueviolet)
  Three-bucket default layouts (family pseudo-profile, tiers 1–2, tiers 3–4) with Chores/Calendar as the dominant widget per tier. Family Feed, Chores, Calendar reserved in all layouts; uninstalled slots render a muted placeholder card. Family Feed widget spec: `standard`/`large`/`banner`, text-only MVP, compose gated by write permission.
  _See:_ `docs/sessions/logs/2026-06-03-design-home-surface.md`

- **2026-06-02 — Visual Language Design** ![Type](https://img.shields.io/badge/Type-Design-blueviolet)
  Typography: Lora (display) + DM Sans (UI). Palette: Terracotta & Teal — burnt orange primary, teal accent. Dark mode: warm clay background via `prefers-color-scheme: dark`. Tokens committed to `styles.css`, fonts loaded in `index.html`.
  _See:_ `docs/sessions/logs/2026-06-02-design-visual-language.md`

- **2026-06-01 — M0 Implementation** ![Type](https://img.shields.io/badge/Type-Frontend-orange) ![Type](https://img.shields.io/badge/Type-Backend-red)
  All six M0 stories complete: dev-environment, shell-skeleton, event-bus, auth-and-profiles, plugin-loader, demo-plugin. Full plugin contract exercised end-to-end on the tablet. M0 done definition satisfied.

- **2026-05-30 — Development: event-bus** ![Type](https://img.shields.io/badge/Type-Backend-red)
  Typed `EventBus` (in-process `EventEmitter` + runtime `module.noun.verb` validation). `@fastify/websocket` bridge fans all events to connected browser clients. `useEventBus` hook with exponential-backoff reconnect. `POST /trigger-event` demo + live event log in shell. 17 tests passing.
  _See:_ `docs/sessions/logs/2026-05-30-dev-event-bus.md`

- **2026-05-30 — Architecture: Testing Strategy** ![Type](https://img.shields.io/badge/Type-Architecture-blue)
  Vitest (shares Vite pipeline) + RTL + jsdom for unit/component tests. `fastify.inject()` for route tests. Playwright for E2E (deferred to M1). Storybook 10 in `packages/ui` (ships in M0). Test conventions: colocated files, no coverage thresholds, real PostgreSQL for integration tests, `packages/test-utils` for shared factories. ADRs 023–026. Architecture template amended to require story spec updates as an output.
  _See:_ `docs/sessions/logs/2026-05-30-architecture-testing-strategy.md`

- **2026-05-29 — Widget Composition Design** ![Type](https://img.shields.io/badge/Type-Design-blueviolet)
  Left sidebar nav (220px, profile chip at top). React Grid Layout, static mode in M1, drag-and-drop M1+. Six named widget sizes (compact → full). Widget manifest shape settled (extends ADR 007/014). Two-level role model: shell filters by minTier + requiredPermission; widget handles internal rendering. Per-user layout stored as {widgetId, x, y, w, h}[]; tier-gated edit rights; parent override. ADR 022.
  _See:_ `docs/sessions/logs/2026-05-29-design-widget-composition.md`

- **2026-05-29 — Login / Profile-Switch UX Design** ![Type](https://img.shields.io/badge/Type-Design-blueviolet)
  Family dashboard as default unattended state (pseudo-profile, tier 1 read-only). Corner chip + inactivity as entry points to the profile grid. Single global family PIN (not per-profile) — amends ADR 017. Contextual auth pattern: write actions on the family dashboard trigger profile selection inline. ADR 021.
  _See:_ `docs/sessions/logs/2026-05-29-design-profile-switcher.md`

- **2026-05-28 — M0 Architecture** ![Type](https://img.shields.io/badge/Type-Architecture-blue)
  Auth mechanism (`@fastify/session` + `connect-pg-simple`), CASL permission model (replaces flat strings, enables `accessibleBy()` row-level filtering), Prisma ORM, Turborepo plugin generator. ADRs 017–020. Auth-and-profiles story unblocked.
  _See:_ `docs/sessions/logs/2026-05-28-architecture-m0.md`

- **2026-05-25 — M0 Product** ![Type](https://img.shields.io/badge/Type-Product-green)
  M0 broken into 6 stories: dev-environment, shell-skeleton, event-bus,
  auth-and-profiles, plugin-loader, demo-plugin. Monorepo tooling settled:
  pnpm + Turborepo (ADR 016). Bulletin board deferred to M1. Login/profile-switch
  UX flagged as a required design session before auth implementation.
  _See:_ `docs/sessions/logs/2026-05-25-product-m0.md`

- **2026-05-25 — System Design** ![Type](https://img.shields.io/badge/Type-Design-blueviolet)
  Component library (shadcn/ui + Tailwind CSS v4), typography direction
  (two fonts, warmer feel — specific fonts deferred), shell composition
  model (role-aware widget grid, M0 home screen is placeholder), state
  management (Context + Zustand + TanStack Query), permission layer
  (tier baseline + grants/revocations, TierGate + PermissionGate),
  plugin design contract (import-based). ADRs 011–015.
  _See:_ `docs/sessions/logs/2026-05-25-design-system.md`

- **2026-05-24 — Platform Architecture** ![Type](https://img.shields.io/badge/Type-Architecture-blue)
  Tech stack (TS/React/Fastify), Vite Module Federation, EventEmitter + @fastify/websocket
  event bus, PostgreSQL with plugin schemas, PWA mobile strategy. Hardware topology
  established: x86 laptop primary server, Pi(s) as M2+ edge devices, MQTT bridge designed
  as extension point.
  _See:_ `docs/sessions/logs/2026-05-24-architecture-platform.md`

- **2026-05-23 — Initial Vision** ![Type](https://img.shields.io/badge/Type-Planning-orange)
  Established vision, core modules, plugin architecture, currency
  model, agency model, real-time strategy, workspace structure,
  milestone roadmap, and ADRs 001–005.
  _See:_ `docs/sessions/logs/2026-05-23-planning-initial.md`
