# Architecture

> Last updated: 2026-07-21 — settled-decisions table extended through ADR 046; `bug_reports` added to the platform schema (ADR 046).

---

## Contents

- [Topology](#topology)
- [Settled Decisions](#settled-decisions)
- [Plugin System](#plugin-system)
  - [Loading](#loading)
  - [Plugin Contract](#plugin-contract)
  - [Plugin Manifest](#plugin-manifest-shape)
- [Event Bus](#event-bus)
  - [Internal Flow](#internal-flow)
  - [Event Naming Convention](#event-naming-convention)
- [Data Storage](#data-storage)
- [Hosting](#hosting)
- [Platform API](#platform-api)
  - [Client Exports](#client-exports-family-osplatform)
  - [Server Exports](#server-exports-family-osplatformserver)
  - [Shared Types](#shared-types-family-osplatformtypes)
  - [Fastify Plugin Scoping](#fastify-plugin-scoping)
- [Auth](#auth)
- [Plugin Dev Toolchain](#plugin-dev-toolchain)
- [Testing](#testing)
  - [Stack](#stack)
  - [Conventions](#conventions)
  - [Package Layout](#package-layout)
- [To Be Defined](#to-be-defined)

---

## Topology

```mermaid
graph TD
  subgraph Server["Primary Server — Ubuntu Server LTS, Docker Compose"]
    Shell["Shell\nReact / Vite"]
    Plugins["Plugin Services\nNode.js / Fastify"]
    Bus["Event Bus\nEventEmitter + WebSocket bridge"]
    PG["PostgreSQL\nper-plugin schemas"]
    MQTT["MQTT Bridge\nM4+"]
  end

  subgraph Edge["Edge Devices — M4+"]
    Pi["Pi Room Display\nSSE, thin agent"]
    MCU["Microcontrollers\nESP32 / Arduino via MQTT"]
  end

  Mobile["Mobile\nAndroid PWA + Web Push"]

  Shell -->|"@fastify/websocket"| Bus
  Plugins --> Bus
  Plugins --> PG
  Bus -->|WebSocket| Shell
  Bus -->|SSE| Pi
  Bus --> MQTT
  MQTT -->|Mosquitto| MCU
  Bus -->|Web Push| Mobile
```

---

## Settled Decisions

All decisions below are locked. See `docs/decisions/` for full
rationale. Do not re-litigate — flag in session notes if revisit
is warranted.

| ADR | Decision                                                                                                                                                                                                                                                                                                                                     |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 001 | Plugin-native micro-frontend — first-party and community plugins share the same API and load path                                                                                                                                                                                                                                            |
| 002 | Two-layer currency — XP (gamification, never converts) and F$ (earnable, redeemable, real-money path)                                                                                                                                                                                                                                        |
| 003 | Age-tiered agency — four trust levels, parent-assigned, capability rules bound to levels not names                                                                                                                                                                                                                                           |
| 004 | WebSocket-first internally; Web Push for mobile parents; polling for external APIs                                                                                                                                                                                                                                                           |
| 005 | Allowance as ledger — system tracks balances, never moves real money; cashout is a parent-confirmed event                                                                                                                                                                                                                                    |
| 006 | TypeScript end-to-end — React shell, Node.js/Fastify plugin services                                                                                                                                                                                                                                                                         |
| 007 | Vite Module Federation for plugin loading — each plugin publishes a remoteEntry.js and manifest                                                                                                                                                                                                                                              |
| 008 | In-process EventEmitter + @fastify/websocket bridge; MQTT bridge is a defined extension point for M4+                                                                                                                                                                                                                                        |
| 009 | PostgreSQL (Docker), single instance, per-plugin schemas; JSONB for semi-structured config                                                                                                                                                                                                                                                   |
| 010 | PWA for mobile (Android); Web Push for out-of-home notifications; no native app planned                                                                                                                                                                                                                                                      |
| 011 | Shell home surface is a composable, role-aware widget grid; M0 must not foreclose this model; implementation deferred to M1                                                                                                                                                                                                                  |
| 012 | shadcn/ui + Tailwind CSS v4 — component library and styling                                                                                                                                                                                                                                                                                  |
| 013 | State in layers: React Context (auth/tier), Zustand (shell), TanStack Query (server/plugin data)                                                                                                                                                                                                                                             |
| 014 | Plugin design contract is import-based from `@family-os/ui` and `@family-os/platform`                                                                                                                                                                                                                                                        |
| 015 | Permissions layer on top of tier: effective permissions = tier baseline + grants − revocations; `TierGate` for coarse gating, `PermissionGate` for fine-grained                                                                                                                                                                              |
| 016 | Monorepo tooling: pnpm workspaces + Turborepo; `apps/` for runnable services, `packages/` for shared libraries                                                                                                                                                                                                                               |
| 017 | Auth session mechanism: `@fastify/session` + `connect-pg-simple`; cookie-based, server-side sessions; session stores active `profileId`                                                                                                                                                                                                      |
| 018 | CASL `(action, subject)` model for permission checks (extends ADR 015); `PERMISSION_REGISTRY` const for compile-time types + runtime enumeration; `@casl/prisma` `accessibleBy()` for row-level DB filtering                                                                                                                                 |
| 019 | ORM: Prisma; per-plugin `schema.prisma` files; `accessibleBy()` drives automatic row-level filtering in every module route                                                                                                                                                                                                                   |
| 020 | Plugin dev toolchain: Turborepo generator (`pnpm turbo gen plugin`); per-plugin Vite dev servers; no custom CLI                                                                                                                                                                                                                              |
| 021 | Global family PIN stored in `system_config` (`key = 'family_pin_hash'`); family pseudo-profile is unattended default state                                                                                                                                                                                                                   |
| 022 | Widget system: React Grid Layout, six named sizes, widget manifest extends ADR 007/014, two-level role model (shell + widget), per-user layout as `{widgetId, x, y, w, h}[]`                                                                                                                                                                 |
| 023 | Test runner: Vitest (shares Vite pipeline); component tests: `@testing-library/react` + jsdom; route tests: `fastify.inject()`                                                                                                                                                                                                               |
| 024 | E2E: Playwright; deferred to M0 shell-skeleton story; lives in `packages/e2e`                                                                                                                                                                                                                                                                |
| 025 | Component catalog: Storybook 10 in `packages/ui`; ships in M0 dev-environment story                                                                                                                                                                                                                                                          |
| 026 | Test conventions: colocated test files; no enforced coverage thresholds; real PostgreSQL for integration tests (`familyos_test` DB separate from dev); shared test utils in `packages/test-utils`                                                                                                                                            |
| 027 | Environment configuration: `.env` files at repo root; `NODE_OPTIONS --env-file` for dev server; Vitest `envDir` for tests; `familyos` / `familyos_test` database separation                                                                                                                                                                  |
| 028 | Home surface default layouts: three tier-appropriate defaults (family pseudo-profile, tiers 1–2, tiers 3–4); Family Feed, Chores, Calendar are reserved modules; absent reserved slots render a placeholder card                                                                                                                             |
| 029 | All notifications flow through `platform.notify()`; platform routes to toast, tray, or Web Push based on priority and active profile tier; plugins never render their own toasts or push payloads                                                                                                                                            |
| 030 | Member identity colors — six fixed palette hues; every family member maps to one hue used everywhere; `getIdentityHue` / `identityToken` / `identityColor` helpers; plugins never invent member colors                                                                                                                                       |
| 031 | Interaction-state language — `--primary` owns active/hover/selected across the app; `--accent` locked to module identity only; sidebar uses lightness delta, no hairlines                                                                                                                                                                    |
| 032 | Plugin nav-item registration — plugins declare a `navItem` (`label`, `route`, `icon`, `minTier`) in `manifest.json`; the sidebar renders tier-filtered nav from the registry                                                                                                                                                                 |
| 033 | Mobile nav pattern — bottom tab bar (4 module tabs + profile) below the `md:` breakpoint; single-column widget reflow; `env(safe-area-inset-*)`. Profile/top-bar clauses superseded by ADR 034                                                                                                                                               |
| 034 | Mobile brand top bar — avatar · wordmark · bell on mobile; bottom bar is nav-only. Supersedes the "profile chip on mobile" / no-top-bar clauses of ADR 033                                                                                                                                                                                   |
| 035 | Plugin styling — first-party plugins styled utility-first like the shell; shell `@source`-scans `plugins/*/src`. Third-party per-plugin build deferred (Option 2)                                                                                                                                                                            |
| 036 | Focus Mode — per-profile `focus_mode` setting (null = derive from tier) selects the chores taskee variant                                                                                                                                                                                                                                    |
| 037 | Date inputs — react-day-picker v10 themed by token; `Calendar`/`Popover`/`DatePicker`/`DateRangePicker` in `@family-os/ui`                                                                                                                                                                                                                   |
| 038 | Calendar recurrence storage — one canonical event row, weekly expansion computed-on-read; per-occurrence skip via `event_exceptions`; attendees via join; `is_activity` derived                                                                                                                                                              |
| 039 | Widget prominence — three elevation rungs (feature/card/quiet) resolved on read per profile (`GET /home/layout` carries `prominence`); at most one feature per surface; not a persisted column                                                                                                                                               |
| 040 | Sunken surface plane — `--surface-sunken` + `--shadow-inset` as the one step down; only inside a card, near-achromatic so it never reads as an identity fill                                                                                                                                                                                 |
| 041 | Family identity hue — reserved `family` ("Hearth") entry excluded from `IDENTITY_HUES`; `--secondary` is chrome again; `huesForEvent([])` → `[FAMILY_HUE]`                                                                                                                                                                                   |
| 042 | Avatar images — a photo is a face, not an identity token; avatar wears no hue ring, chrome beside it carries identity; client-side crop→WebP, bytes in `platform.profile_images`. Amends ADR 030                                                                                                                                             |
| 043 | Identity takes the edge, status takes the field — on a multi-person row the spine is always the identity hue; status moves to the row's field. `ItemCard` owns row affordances (AdminBoard exception withdrawn)                                                                                                                              |
| 044 | Member hue is assigned, not derived — persisted `Profile.identityHue`, unique across the family (palette size caps household size); `resolveHue` canonical, `getIdentityHue` a fallback; palette grows to eight. Amends ADR 030                                                                                                              |
| 045 | Reminder scheduling — a 60s in-process poll computes due reminders ON READ and dedupes via a sparse `calendar.reminder_log` ledger (a record of the past, never a materialized future), so ADR 038's no-occurrences-table invariant holds                                                                                                    |
| 046 | In-situ bug reporting — a report is a CAPTURE (route, build hash, viewport, UA, error ring) not a complaint; every tier reports, so below tier 2 the control takes the bell's slot; the `auto-bug` GitHub issue is a best-effort bridge; only `deployed` pings. `reporterId` carries no FK — the household pseudo-profile has no row in prod |
| 047 | The F$ ledger is append-only and the balance is a derived cache — corrections are compensating entries, `(source_type, source_id)` is UNIQUE so idempotency lives in the schema                                                                                                                                                              |
| 048 | Earning is contributed, not owned — `rewards` never imports another plugin; the earner owns the amount (`coinReward`), `rewards` owns the ledger, and an earn source is a manifest line plus a handler                                                                                                                                       |
| 049 | Punch cards are a `rewards` primitive, not a `meals` one — template → per-profile card → punches, payout in F$ or a catalog reward, and the kid punches their own card                                                                                                                                                                       |
| 050 | A day mark is a property of a day, not an event — dinner has no time a family can honour to ±30 min, so a provider returns at most one small mark per day; plugins never write `calendar.events`                                                                                                                                             |
| 051 | The coin belongs to the currency that buys things — F$ takes gold, the disc and the coin glyph; XP demotes to a quiet star. Coin gold moves off `--identity-marigold` to brass, and separation from a member's hue rests on FORM (one struck disc: never a disc-in-a-ring, never milled)                                                     |
| 052 | The economy is priced from a weekly earn rate (~10 F$/week) — chores opt IN to paying (`coinReward` default 0), small reward ≈1 week, big ≈1 month; repricing after launch is a household event, never a silent re-basing                                                                                                                    |
| 053 | A balance belongs to a person — the `family` pseudo-profile never holds F$ (a household pot is a second balance by another name), and tier 1 holds a wallet, amending the tier table's "no financial data" to mean the household's money (M8)                                                                                                |

---

## Plugin System

### Loading

Each plugin publishes two files at a stable URL:

```
remoteEntry.js   — Vite Module Federation entry point
manifest.json    — plugin identity, schema ownership, routes, permissions
```

The shell reads the plugin registry at boot and lazy-loads each
plugin's remote module when the user navigates to its route.

### Plugin Contract

Plugins communicate with the platform exclusively via the **Platform
API** — a typed SDK injected at mount time. Plugins may not:

- Import from the shell or other plugins directly
- Read or write outside their declared Postgres schema
- Publish events outside their declared event namespace

### Plugin Manifest (shape)

```json
{
  "name": "chores",
  "version": "1.0.0",
  "remoteEntry": "http://localhost:3012/remoteEntry.js",
  "exposes": ["./ChoreModule"],
  "routes": ["/chores"],
  "schema": "chores",
  "events": {
    "publishes": ["chores.task.completed", "chores.task.created"],
    "subscribes": ["calendar.event.added"]
  },
  "widgets": [
    {
      "id": "chores.today-summary",
      "displayName": "Today's Chores",
      "component": "./widgets/TodaySummary",
      "defaultSize": "standard",
      "supportedSizes": ["compact", "standard", "large"],
      "minTier": 1,
      "requiredPermission": "chores.task.view",
      "description": "Shows the current user's tasks due today."
    }
  ]
}
```

The `widgets` field is optional — plugins that only add routes do not need it. See ADR 022 for full widget manifest field rules, slot taxonomy, and role-aware composition model.

---

## Event Bus

### Internal flow

```mermaid
flowchart LR
  P["Plugin Service"] --> EB["EventEmitter\n(typed channels)"]
  EB -->|"@fastify/websocket"| B["Browser Clients"]
  EB -->|SSE| R["Read-only Clients\nPi displays, M4+"]
  EB --> MB["MQTT Bridge\nM4+"]
  MB -->|Mosquitto| MCU["Microcontrollers"]
```

### Event naming convention

`module.noun.verb` — e.g. `chores.task.completed`, `finance.dollar.credited`

---

## Data Storage

- **Primary store:** PostgreSQL 16, Docker container
- **Schema isolation:** each plugin owns one schema; cross-schema reads/writes are forbidden
- **Semi-structured data:** JSONB columns within plugin schemas — no separate document store
- **Backups:** single `pg_dump` covers all plugin data
- **ORM:** Prisma (ADR 019); per-plugin `schema.prisma` files; `@casl/prisma` `accessibleBy()` for row-level filtering

---

## Hosting

- **Runtime:** Docker Compose on Ubuntu Server 24.04 LTS
- **Hardware:** repurposed x86 laptop (8GB+ RAM, SSD recommended)
- **Images:** multi-arch (`linux/amd64` + `linux/arm64`) from day one so Pi agents can pull the same images
- **Networking:** wired Ethernet preferred; server exposed on local network only
- **Future edge devices:** Raspberry Pi(s) running lightweight agents or SSE-connected displays

---

## Platform API

`packages/platform` uses subpath exports to serve browser and server consumers without cross-environment leakage:

| Subpath                      | Consumer          | What it exports                                               |
| ---------------------------- | ----------------- | ------------------------------------------------------------- |
| `@family-os/platform`        | Browser / plugins | React hooks, gate components, event bus hook                  |
| `@family-os/platform/server` | Node.js / Fastify | Fastify plugin factory, `EventBus` interface, `createAbility` |
| `@family-os/platform/types`  | Both              | Shared types only — no runtime code                           |

### Client exports (`@family-os/platform`)

```typescript
export function useAuth(): { id: string; name: string; tier: TierLevel }
export function useTier(): TierLevel
export function usePermissions(): AppAbility
export function AuthProvider(props: { children: ReactNode }): ReactElement

export function TierGate(props: {
  min: TierLevel
  fallback?: ReactNode
  children: ReactNode
}): ReactElement | null
export function PermissionGate(props: {
  action: string
  subject: string
  fallback?: ReactNode
  children: ReactNode
}): ReactElement | null

export function useEventBus(): {
  publish(event: EventName, payload: unknown): void
  subscribe(event: EventName, handler: (payload: unknown) => void): () => void
}
// Note: currently a callback-based dev hook in apps/shell. Promoted to
// @family-os/platform with this publish/subscribe shape in auth-and-profiles.
```

### Server exports (`@family-os/platform/server`)

```typescript
export function createEventBusPlugin(): FastifyPlugin
export function getEventBus(fastify: FastifyInstance): EventBus
export function createAbility(profile: Profile, overrides: PermissionOverride[]): AppAbility

export interface EventBus {
  emit(event: EventName, payload: unknown): void
  on(event: EventName, handler: (payload: unknown) => void): void
}
```

### Shared types (`@family-os/platform/types`)

```typescript
export type TierLevel = 1 | 2 | 3 | 4
export type EventName = `${string}.${string}.${string}`

export const PERMISSION_REGISTRY = {
  'platform.profile.view': {
    label: 'View profiles',
    module: 'platform',
    action: 'view',
    subject: 'platform.Profile',
  },
  'platform.profile.switch': {
    label: 'Switch active profile',
    module: 'platform',
    action: 'switch',
    subject: 'platform.Profile',
  },
  'platform.plugin.view': {
    label: 'Use plugins',
    module: 'platform',
    action: 'view',
    subject: 'platform.Plugin',
  },
  // Plugin modules extend the registry. Chores (M2 Task Model + Creation):
  'chores.task.view': {
    label: 'View chores',
    module: 'chores',
    action: 'view',
    subject: 'chores.Task',
  },
  'chores.task.create': {
    label: 'Create and assign chores',
    module: 'chores',
    action: 'create',
    subject: 'chores.Task',
  },
  'chores.task.complete': {
    label: 'Complete chores',
    module: 'chores',
    action: 'complete',
    subject: 'chores.Task',
  },
} as const

export type PermissionString = keyof typeof PERMISSION_REGISTRY

export interface PluginManifest {
  name: string
  version: string
  remoteEntry: string
  exposes: string[]
  routes: string[]
  schema: string
  events: { publishes: EventName[]; subscribes: EventName[] }
  widgets?: WidgetManifest[]
}
```

### Fastify plugin scoping

All HTTP routes are registered under the `/api` prefix via a scoped sub-plugin. The WebSocket `/events` endpoint lives at root:

```typescript
await app.register(eventBusPlugin)           // /events — root, no prefix

await app.register(async (api) => {
  await api.register(authPlugin)             // /api/auth/*
  api.get('/health', ...)                    // /api/health
}, { prefix: '/api' })
```

**Gotcha:** plugins wrapped with `fastify-plugin` (e.g. `@fastify/session`, `@fastify/cookie`) break encapsulation — they apply globally regardless of which scoped sub-plugin registers them. This is intentional for decorators that must be visible everywhere (session, cookie), but means those plugins should be registered on the root `app`, not inside the `/api` scope, if their decorators are needed by multiple scopes. Route-only sub-plugins that do not use `fastify-plugin` stay properly scoped.

The Vite dev proxy maps these to the API server:

```typescript
proxy: {
  '/events': { target: 'ws://localhost:3000', ws: true },
  '/api':    { target: 'http://localhost:3000' },
}
```

---

## Auth

- **Mechanism:** `@fastify/session` + `connect-pg-simple` — server-side sessions in PostgreSQL (ADR 017)
- **Session payload:** `{ activeProfileId: string }` — resolved to a full `Profile` object by auth middleware on each request
- **Profile switching:** `POST /auth/switch { targetProfileId }` — unblocked if target tier ≤ current tier; 403 if target tier > current tier (requires `POST /auth/verify-pin { pin, targetProfileId }` first)
- **Reactive updates:** `AuthProvider` queries `/api/auth/me` via TanStack Query with key `['api/auth/me']`; `queryClient.invalidateQueries({ queryKey: ['api/auth/me'] })` on a successful switch re-renders all `TierGate` and `PermissionGate` trees without a page reload
- **M0 dev mechanism:** query-parameter or UI selector — real login/profile-switch UX is a separate design session (see queue)

**`platform` schema tables:**

```
profiles
  id           uuid  PK
  name         text
  tier         integer (1–4)
  avatar_url   text     nullable
  identity_hue text     nullable UNIQUE   -- assigned member hue (ADR 044); unique so "colour = person" holds; null = getIdentityHue fallback / family profile
  dark_mode    boolean  nullable          -- display pref; null = follow prefers-color-scheme (M1 home-surface)
  focus_mode   boolean  nullable          -- chores taskee variant; null = derive from tier (ADR 036)
  push_enabled boolean  default false     -- Web Push opt-in (M1 web-push)
  created_at   timestamptz

profile_images                            -- avatar photo bytes (ADR 042); served immutable at /api/profiles/:id/avatar?v={hash}
  profile_id   uuid  PK  FK → profiles.id (ON DELETE CASCADE)
  bytes        bytea
  mime_type    text                       -- server-derived; JPEG/PNG/WebP only, whitelisted by magic bytes
  hash         text                       -- cache-buster in the avatar URL
  updated_at   timestamptz

bug_reports                               -- in-app problem reports (ADR 046)
  id                  uuid  PK
  reporter_id         text                 -- NO FK: the household pseudo-profile ('family') has no profiles row on prod and is the DEFAULT profile; resolved at read time with a fallback
  description         text                 -- the reporter's own words
  context             jsonb                -- the capture: route, build hash, viewport, UA, console errors. Schemaless on purpose — evidence, not queryable data
  status              text  default 'new'  -- new | triaged | fixing | deployed | wont_fix
  github_issue_number integer  nullable    -- null when the bridge is unconfigured or failed; never blocks the report
  resolution          text     nullable    -- replaces the default 'Fixed and live' notification body
  created_at          timestamptz
  updated_at          timestamptz

permission_overrides
  id           uuid  PK
  profile_id   uuid  FK → profiles.id
  action       text
  subject      text
  type         text  ('grant' | 'revocation')
  granted_by   uuid  FK → profiles.id nullable
  created_at   timestamptz

widget_layouts
  id           uuid  PK
  profile_id   uuid  FK → profiles.id
  widget_id    text
  x            int
  y            int
  w            int
  h            int

system_config
  key          text  PK
  value        jsonb
  updated_by   uuid  FK → profiles.id nullable
  updated_at   timestamptz
```

The family PIN is stored in `system_config` as `key = 'family_pin_hash'` (ADR 021). Other platform-wide settings (e.g. default widget layouts per tier) live here without requiring schema migrations.

Effective ability = `createAbility(profile, overrides)` — tier baseline rules + grant rows − revocation rows, built by `@family-os/platform/server`.

---

## Plugin Dev Toolchain

`pnpm turbo gen plugin` — Turborepo generator scaffolds new plugins (ADR 020). No custom CLI.

**What it generates:**

| File                                  | Purpose                                                                                  |
| ------------------------------------- | ---------------------------------------------------------------------------------------- |
| `plugins/[name]/vite.config.ts`       | Module Federation config; `@family-os/ui` and `@family-os/platform` as shared singletons |
| `plugins/[name]/public/manifest.json` | Stub matching `PluginManifest` type; served at `/manifest.json` by Vite                  |
| `plugins/[name]/tsconfig.json`        | Extends workspace root config                                                            |
| `plugins/[name]/src/index.ts`         | Barrel — exposes the plugin module                                                       |
| `plugins/[name]/src/Plugin.tsx`       | Minimal example using platform hooks                                                     |

`pnpm-workspace.yaml` is updated automatically. Each plugin runs its own Vite dev server; `pnpm dev` starts everything in parallel via Turborepo's task graph.

---

## Testing

### Stack

| Layer             | Tool                             | Notes                                                    |
| ----------------- | -------------------------------- | -------------------------------------------------------- |
| Test runner       | Vitest                           | Shares Vite pipeline; ESM-native; Turborepo-cacheable    |
| Component tests   | `@testing-library/react` + jsdom | Behavior-first; no snapshot tests                        |
| Route tests       | `fastify.inject()`               | Full request pipeline; no real HTTP                      |
| E2E               | Playwright                       | Scaffolded in M0 shell-skeleton; lives in `packages/e2e` |
| Component catalog | Storybook 10                     | In `packages/ui`; dev-only; not in build pipeline        |

### Conventions

- **Test files:** colocated with source (`Component.test.tsx`, `util.test.ts`)
- **Coverage:** no thresholds enforced — `packages/platform` and permission logic are high-priority targets by convention
- **Database:** real PostgreSQL for any test touching Prisma; tests run against a separate `familyos_test` database (never the dev `familyos` DB); `beforeEach` truncates test-relevant tables between runs (ADR 026, ADR 027)
- **Shared utilities:** `packages/test-utils` — custom RTL render with providers, profile factories per tier, synchronous event bus double

### Package layout

```
packages/
  schemas/        — shared Zod v4 schemas; consumed by shell, API, and plugins
  test-utils/     — shared test helpers, factories, doubles
  e2e/            — Playwright specs (created in M0 shell-skeleton)
  ui/
    .storybook/   — Storybook config
    src/**/*.stories.tsx
apps/
  shell/
    .storybook/   — shell-specific stories (not in packages/ui)
```

---

## To Be Defined

Deferred to later sessions:

- **External integrations** — Monarch, Greenlight, calendar sync (per module)
- **MQTT bridge design** — deferred to M4+ (Smart Home)
