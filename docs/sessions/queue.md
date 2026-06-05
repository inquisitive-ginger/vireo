# Session Queue

> Owned by planning sessions. Updated at the end of every planning
> session. All other session types read but don't modify this file.

---

## Up Next

1. **M1 Dev: home-surface** ![Type](https://img.shields.io/badge/Type-Development-orange)
   Widget grid implementation: React Grid Layout static mode, default layouts seeded per tier, reserved slot placeholder cards, motion tokens, dark mode toggle, E2E scaffold.
   _Reads:_ `docs/modules/platform/stories/home-surface.md`, `docs/design-system.md` (Widget Composition System, Home Surface)
   _Produces:_ Working widget grid on home screen; `packages/e2e` scaffold; `WidgetGrid`, `WidgetSlot`, `PlaceholderCard` in `packages/ui`

2. **M1 Dev: family-onboarding** ![Type](https://img.shields.io/badge/Type-Development-orange)
   First-run setup flow: create profiles, set family PIN, `db:reset` script.
   _Reads:_ `docs/modules/platform/stories/family-onboarding.md`, `docs/design-system.md` (Login / Profile Switch, PIN Entry)
   _Produces:_ `/onboarding` route; `packages/schemas` scaffold; `ProfileAvatar` in `packages/ui`

3. **M1 Dev: profile-management** ![Type](https://img.shields.io/badge/Type-Development-orange)
   Settings page for profile CRUD and family PIN reset.
   _Reads:_ `docs/modules/platform/stories/profile-management.md`
   _Produces:_ Settings route; `SettingsLayout`, `ProfileListItem`, `ConfirmDialog` in `packages/ui`

4. **M1 Dev: permission-overrides** ![Type](https://img.shields.io/badge/Type-Development-orange)
   Per-profile capability grants and revocations.
   _Reads:_ `docs/modules/platform/stories/permission-overrides.md`
   _Produces:_ Capabilities panel; `PermissionToggleList`, `PermissionToggleItem` in `packages/ui`

5. **M1 Dev: notification-infrastructure** ![Type](https://img.shields.io/badge/Type-Development-orange)
   `platform.notify()` API, Sonner toast, notification tray, bell badge.
   _Reads:_ `docs/modules/platform/stories/notification-infrastructure.md`, `docs/design-system.md` (Notification System)
   _Produces:_ `platform.notify()` in `@family-os/platform`; `Toast`, `NotificationTray`, `NotificationItem`, `BellBadge` in `packages/ui`

6. **M1 Dev: pwa-installable** ![Type](https://img.shields.io/badge/Type-Development-orange)
   Web app manifest, service worker, installable PWA.
   _Reads:_ `docs/modules/platform/stories/pwa-installable.md`
   _Produces:_ Installable PWA on Android Chrome

7. **M1 Dev: web-push** ![Type](https://img.shields.io/badge/Type-Development-orange)
   Web Push subscription and delivery from `platform.notify()`.
   _Reads:_ `docs/modules/platform/stories/web-push.md`
   _Produces:_ Push notification delivery for tier 3–4 profiles

8. **M1 Dev: family-feed-read** ![Type](https://img.shields.io/badge/Type-Development-orange)
   Family Feed plugin: scaffold, data model, read API, widget, feed view.
   _Reads:_ `docs/modules/family-feed/stories/family-feed-read.md`, `docs/modules/family-feed/spec.md`
   _Produces:_ Family Feed plugin installed and rendering; `FeedPostCard`, `FeedEmptyState` in `packages/ui`

9. **M1 Dev: family-feed-compose** ![Type](https://img.shields.io/badge/Type-Development-orange)
   Compose form, create post API, permission registration.
   _Reads:_ `docs/modules/family-feed/stories/family-feed-compose.md`
   _Produces:_ Post creation flow; `ComposeForm` in `packages/ui`; `family-feed.post.create` in `PERMISSION_REGISTRY`

10. **Mobile Surface Design** ![Type](https://img.shields.io/badge/Type-Design-blueviolet)
    Mobile layout and nav design for the PWA. Deferred from M1 design sessions — required before mobile surface implementation can begin.
    _Reads:_ `docs/design-system.md` (Surfaces — Other Surfaces), `docs/modules/platform/stories/pwa-installable.md`
    _Produces:_ Updated `docs/design-system.md` with mobile surface spec

---

## Recently Completed

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
  Vitest (shares Vite pipeline) + RTL + jsdom for unit/component tests. `fastify.inject()` for route tests. Playwright for E2E (deferred to M1). Storybook 8 in `packages/ui` (ships in M0). Test conventions: colocated files, no coverage thresholds, real PostgreSQL for integration tests, `packages/test-utils` for shared factories. ADRs 023–026. Architecture template amended to require story spec updates as an output.
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
