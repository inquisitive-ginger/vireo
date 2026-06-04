# Session Queue

> Owned by planning sessions. Updated at the end of every planning
> session. All other session types read but don't modify this file.

---

## Up Next

1. **Notification & States Design** ![Type](https://img.shields.io/badge/Type-Design-blueviolet)
   Notification and alert patterns (Web Push, in-app toasts, badge counts),
   error states, empty states, and motion/animation (transitions, timing, easing — per
   "calm by default" principle). Required before M2 Chores implementation.
   _Reads:_ `docs/design-system.md` (post Visual Language), running M0 shell
   _Produces:_ Updated `docs/design-system.md` with notification, error, empty state, and motion specs

2. **M1 Product Planning** ![Type](https://img.shields.io/badge/Type-Planning-orange)
   Break M1 roadmap scope into implementation stories. Blocked on item 1
   (notification/states/motion design must be settled first).
   _Reads:_ `docs/roadmap.md`, `docs/design-system.md` (post items 1–2), `docs/architecture.md`,
   `docs/modules/platform/progress.md`, all completed session logs
   _Produces:_ `docs/modules/platform/progress.md` updated for M1, M1 story specs under
   `docs/modules/platform/stories/`

---

## Recently Completed

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
