# Session Queue

> Owned by planning sessions. Updated at the end of every planning
> session. All other session types read but don't modify this file.

---

## Up Next

1. **M1 Design: widget-slot-states** ![Type](https://img.shields.io/badge/Type-Design-blueviolet)
   Define how non-live content renders in the widget grid — placeholder (not installed), error (failed to load), and member-identity expression in dense slots — so these states read as intentional, not broken, beside live `--card` widgets. Resolves placeholder/error cards inheriting the slot's elevation despite the "flat" spec, and the identity spine dropping out of the feed widget. From the 2026-06-12 visual-language audit.
   _Reads:_ `docs/sessions/kickoffs/design-widget-slot-states.md` (driving doc), `docs/design-system.md` (Elevation, Home Surface placeholder, Error States, Widget identity header), ADR 028, ADR 030, `packages/ui/src/components/widget-slot.tsx` + `placeholder-card.tsx`, `plugins/family-feed/src/widgets/FeedWidgetView.tsx`
   _Produces:_ Non-content slot-state spec + identity-in-widget rule in `docs/design-system.md`; `WidgetSlot` variant/contract decision (note to dev or short ADR); updated stories

2. **M1 Dev: appearance-preference-gate** ![Type](https://img.shields.io/badge/Type-Development-orange)
   Add `platform.preferences.appearance` to `PERMISSION_REGISTRY`; wrap the dark mode toggle in Settings with `PermissionGate` so parents can revoke appearance control for tier 2–3 profiles. Small addendum to the settings-permissions + permission-overrides work.
   _Reads:_ `docs/modules/platform/stories/appearance-preference-gate.md`
   _Produces:_ `platform.preferences.appearance` in `PERMISSION_REGISTRY`; Settings dark mode toggle gated by `PermissionGate`

3. **M1 Design+Dev: family-profile-notifications** ![Type](https://img.shields.io/badge/Type-Design-blueviolet)
   Shared-device notification surface for the family profile (tier 1). The family profile is always-on on kitchen tablets and Pi displays but receives no persistent notification history. Design and implement an ambient notification surface appropriate for shared household devices.
   _Reads:_ `docs/modules/platform/stories/family-profile-notifications.md`, ADR 029
   _Produces:_ Design decision on surface shape + implementation; amendment to ADR 029 if broadcast/audience model is introduced

4. **Mobile Surface Design** ![Type](https://img.shields.io/badge/Type-Design-blueviolet)
   Mobile layout and nav design for the PWA. Deferred from M1 design sessions — required before mobile surface implementation can begin.
   _Reads:_ `docs/design-system.md` (Surfaces — Other Surfaces), `docs/modules/platform/stories/pwa-installable.md`
   _Produces:_ Updated `docs/design-system.md` with mobile surface spec

5. **M1 Dev: push-multi-profile-device** ![Type](https://img.shields.io/badge/Type-Development-orange)
   Allow multiple profiles to hold subscriptions for the same endpoint. Currently `endpoint` is unique — the last profile to subscribe on a shared device displaces the previous one. Migrate to `(profile_id, endpoint)` composite key; update 410 cleanup to delete by endpoint across all profiles.
   _Reads:_ `docs/modules/platform/stories/push-multi-profile-device.md`
   _Produces:_ Schema migration; updated subscribe/unsubscribe/410-cleanup logic; updated tests

---

## Recently Completed

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
