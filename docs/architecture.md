# Architecture

> Last updated: 2026-09-07 — settled-decisions table extended through ADR 074; the Platform API section re-read against `packages/platform` (the bus, the exports, the manifest, the schema tables).

---

## Contents

- [Topology](#topology)
- [Settled Decisions](#settled-decisions)
- [Plugin System](#plugin-system)
  - [Loading](#loading)
  - [Plugin Contract](#plugin-contract)
  - [Plugin Manifest](#plugin-manifest-shape)
  - [Day-mark Provider Contract](#day-mark-provider-contract-adr-050-adr-066)
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
  subgraph Server["Primary Server — Raspberry Pi 5, Docker Compose"]
    Shell["Shell\nReact / Vite"]
    Plugins["Plugin Services\nNode.js / Fastify"]
    Bus["Event Bus\nEventEmitter + WebSocket bridge"]
    PG["PostgreSQL\nper-plugin schemas"]
    MQTT["MQTT Bridge\nM6+"]
  end

  subgraph Edge["Edge Devices — M6+"]
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

| ADR | Decision                                                                                                                                                                                                                                          |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 001 | Plugin-native micro-frontend — first-party and community plugins share the same API and load path                                                                                                                                                 |
| 002 | Two-layer currency — XP (gamification, never converts) and P-Bucks (earnable, redeemable, real-money path)                                                                                                                                        |
| 003 | Age-tiered agency — four trust levels, parent-assigned, capability rules bound to levels not names                                                                                                                                                |
| 004 | WebSocket-first internally; Web Push for mobile parents; polling for external APIs                                                                                                                                                                |
| 005 | Allowance as ledger — system tracks balances, never moves real money; cashout is a parent-confirmed event                                                                                                                                         |
| 006 | TypeScript end-to-end — React shell, Node.js/Fastify plugin services                                                                                                                                                                              |
| 007 | Vite Module Federation for plugin loading — each plugin publishes a remoteEntry.js and manifest                                                                                                                                                   |
| 008 | In-process EventEmitter + @fastify/websocket bridge; MQTT bridge is a defined extension point for M6+                                                                                                                                             |
| 009 | PostgreSQL (Docker), single instance, per-plugin schemas; JSONB for semi-structured config                                                                                                                                                        |
| 010 | PWA for mobile (Android); Web Push for out-of-home notifications; no native app planned                                                                                                                                                           |
| 011 | Shell home surface is a composable, role-aware widget grid; M0 must not foreclose this model; implementation deferred to M1                                                                                                                       |
| 012 | shadcn/ui + Tailwind CSS v4 — component library and styling                                                                                                                                                                                       |
| 013 | State in layers: React Context (auth/tier), Zustand (shell), TanStack Query (server/plugin data)                                                                                                                                                  |
| 014 | Plugin design contract is import-based from `@family-os/ui` and `@family-os/platform`                                                                                                                                                             |
| 015 | Permissions layer on top of tier: effective permissions = tier baseline + grants − revocations; `TierGate` for coarse gating, `PermissionGate` for fine-grained                                                                                   |
| 016 | Monorepo tooling: pnpm workspaces + Turborepo; `apps/` for runnable services, `packages/` for shared libraries                                                                                                                                    |
| 017 | Auth session mechanism: `@fastify/session` + `connect-pg-simple`; cookie-based, server-side sessions; session stores active `profileId`                                                                                                           |
| 018 | CASL `(action, subject)` model for permission checks (extends ADR 015); `PERMISSION_REGISTRY` const for compile-time types + runtime enumeration; `@casl/prisma` `accessibleBy()` for row-level DB filtering                                      |
| 019 | ORM: Prisma; per-plugin `schema.prisma` files; `accessibleBy()` drives automatic row-level filtering in every module route                                                                                                                        |
| 020 | Plugin dev toolchain: Turborepo generator (`pnpm turbo gen plugin`); per-plugin Vite dev servers; no custom CLI                                                                                                                                   |
| 021 | Global family PIN stored in `system_config` (`key = 'family_pin_hash'`); family pseudo-profile is unattended default state                                                                                                                        |
| 022 | Widget system: React Grid Layout, six named sizes, widget manifest extends ADR 007/014, two-level role model (shell + widget), per-user layout as `{widgetId, x, y, w, h}[]`                                                                      |
| 023 | Test runner: Vitest (shares Vite pipeline); component tests: `@testing-library/react` + jsdom; route tests: `fastify.inject()`                                                                                                                    |
| 024 | E2E: Playwright; deferred to M0 shell-skeleton story; lives in `packages/e2e`                                                                                                                                                                     |
| 025 | Component catalog: Storybook 10 in `packages/ui`; ships in M0 dev-environment story                                                                                                                                                               |
| 026 | Test conventions: colocated test files; no enforced coverage thresholds; real PostgreSQL for integration tests (`familyos_test` DB separate from dev); shared test utils in `packages/test-utils`                                                 |
| 027 | Environment configuration: `.env` files at repo root; `NODE_OPTIONS --env-file` for dev server; Vitest `envDir` for tests; `familyos` / `familyos_test` database separation                                                                       |
| 028 | Home surface default layouts: three tier-appropriate defaults (family pseudo-profile, tiers 1–2, tiers 3–4); Family Feed, Chores, Calendar are reserved modules; absent reserved slots render a placeholder card                                  |
| 029 | All notifications flow through `platform.notify()`; platform routes to toast, tray, or Web Push based on priority and active profile tier; plugins never render their own toasts or push payloads                                                 |
| 030 | Member identity colors — six fixed palette hues; every family member maps to one hue used everywhere; `getIdentityHue` / `identityToken` / `identityColor` helpers; plugins never invent member colors                                            |
| 031 | Interaction-state language — `--primary` owns active/hover/selected across the app; `--accent` locked to module identity only; sidebar uses lightness delta, no hairlines                                                                         |
| 032 | Plugin nav-item registration — plugins declare a `navItem` (`label`, `route`, `icon`, `minTier`) in `manifest.json`; the sidebar renders tier-filtered nav from the registry                                                                      |
| 033 | Mobile nav pattern — nav-only bottom tab bar below `md:` (avatar/bell live in ADR 034's top bar); capped at 5 tabs since 2026-08-17 — Home + three pinned + a **More** sheet; single-column widget reflow; `env(safe-area-inset-*)`               |
| 034 | Mobile brand top bar — avatar · wordmark · bell on mobile; bottom bar is nav-only. Supersedes the "profile chip on mobile" / no-top-bar clauses of ADR 033                                                                                        |
| 035 | Plugin styling — first-party plugins styled utility-first like the shell; shell `@source`-scans `plugins/*/src`. Third-party per-plugin build deferred (Option 2)                                                                                 |
| 036 | Focus Mode — per-profile `focus_mode` setting (null = derive from tier) selects the chores taskee variant                                                                                                                                         |
| 037 | Date inputs — react-day-picker v10 themed by token; `Calendar`/`Popover`/`DatePicker`/`DateRangePicker` in `@family-os/ui`                                                                                                                        |
| 038 | Calendar recurrence storage — one canonical event row; weekly and daily time-window (ADR 057) expansion computed on read; per-occurrence skip via `event_exceptions`; attendees via join; `is_activity` derived (widened 2026-08-19)              |
| 039 | Widget prominence — three elevation rungs (feature/card/quiet) resolved on read per profile (`GET /home/layout` carries `prominence`); at most one feature per surface; not a persisted column                                                    |
| 040 | Sunken surface plane — `--surface-sunken` + `--shadow-inset` as the one step down; only inside a card, near-achromatic so it never reads as an identity fill                                                                                      |
| 041 | Family identity hue — reserved `family` ("Hearth") entry excluded from `IDENTITY_HUES`; `--secondary` is chrome again; `huesForEvent([])` → `[FAMILY_HUE]`                                                                                        |
| 042 | Avatar images — a photo is a face, not an identity token; avatar wears no hue ring, chrome beside it carries identity; client-side crop→WebP, bytes in `platform.profile_images`. Amends ADR 030                                                  |
| 043 | Identity takes the edge, status takes the field — on a multi-person row the spine is always the identity hue; status moves to the row's field. `ItemCard` owns row affordances (AdminBoard exception withdrawn)                                   |
| 044 | Member hue is assigned, not derived — persisted `Profile.identityHue`, unique across the family (palette size caps household size); `resolveHue` canonical, `getIdentityHue` a fallback; palette grows to eight. Amends ADR 030                   |
| 045 | Reminder scheduling — a 60s in-process poll computes due reminders ON READ and dedupes via a sparse `calendar.reminder_log` ledger (a record of the past, never a materialized future), holding ADR 038's no-occurrences-table invariant          |
| 046 | In-situ bug reporting — a report is a CAPTURE (route, build hash, viewport, UA, error ring), not a complaint; every tier reports, so below tier 2 the control takes the bell's slot; the `auto-bug` bridge is best-effort; only `deployed` pings  |
| 047 | The P-Bucks ledger is append-only and the balance is a derived cache — corrections are compensating entries, `(source_type, source_id)` is UNIQUE so idempotency lives in the schema                                                              |
| 048 | Earning is contributed, not owned — `rewards` never imports another plugin; the earner owns the amount (`coinReward`), `rewards` owns the ledger, and an earn source is a manifest line plus a handler                                            |
| 049 | Punch cards are a `rewards` primitive, not a `meals` one — template → per-profile card → punches, payout in P-Bucks or a catalog reward, and the kid punches their own card                                                                       |
| 050 | A day mark is a property of a day, not an event — dinner has no time a family can honour to ±30 min, so a provider returns at most one small mark per day; plugins never write `calendar.events`                                                  |
| 051 | The coin belongs to the currency that buys things — P-Bucks takes gold, the disc and the coin glyph; XP demotes to a quiet star. Coin gold moves to brass, and separation from a member's hue rests on FORM (one struck disc)                     |
| 052 | The economy is priced from a weekly earn rate (~10 P-Bucks/week) — chores opt IN to paying (`coinReward` default 0), small reward ≈1 week, big ≈1 month; repricing after launch is a household event, never a silent re-basing                    |
| 053 | A balance belongs to a person — the `family` pseudo-profile never holds P-Bucks (a household pot is a second balance by another name), and tier 1 holds a wallet, narrowing the tier table's "no financial data" to the household's money (M8)    |
| 054 | The currency is named **Pritchett Bucks** — the coin bears a struck **P-mark**, replacing ADR 051's placeholder glyph, and the name has four registers (mark · `P$` · `P-Bucks` · `Pritchett Bucks`), one per medium, chosen by naming an export  |
| 055 | A redemption is a ticket — buy debits the wallet once with no parent gate; the ticket waits in the kid's pocket; `requiresApproval` gates USE, not purchase; a decline is "not now"; tier-4 revoke-and-refund is the administrative exception     |
| 056 | XP is derived from P-Bucks — `xp = 5 + coinReward × 10`, server-derived on create and every edit (client `xpReward` ignored); the XP picker is gone, legacy values drain rather than migrate. Not conversion (ADR 002 holds). Amends ADR 052      |
| 057 | Daily time-window recurrence — a third event shape (date range + weekday set + one clock window a day) stored ADR 038's way: one row, occurrences computed on read via `recurrence_day_offsets`; one expansion module serves both callers         |
| 058 | Chore routines materialize real tasks — a `chores.routines` row holds the rule; occurrences are ordinary `Task` rows spawned lazily on read (no scheduler), at most one open row per routine, `(routine_id, due_date)` unique so it is idempotent |
| 059 | Up-for-grabs chores are claimed, then done — a null-assignee chore belongs to the household (Hearth identity) until a claim makes it an ordinary assigned task; completing an unclaimed task is refused so the economy learns no new earner       |
| 060 | The network is the boundary for the family pseudo-profile — the unauthenticated dashboard stays as ADR 021 designed it, with no app-side gating by source network; exposure is home LAN + enrolled tailnet, verified rather than code-gated       |
| 061 | The XP sink is a companion — a per-kid critter hatched once, grown by XP earned since hatch (unlock, never spend), dressed by 1-of-3 milestone picks; a new `companion` plugin owns it and never touches the `rewards` ledger                     |
| 062 | Companion art is a generated, curated library — image-model output at build time, human-curated, shipped as static plugin assets; bodies are grayscale, hued at runtime by the owner's identity triplet; the kid loop calls no generation API     |
| 063 | `ListRow` joins `ItemCard` — cards when items are independent objects with several actions, rows when items are a set you scan and act on one way; "never hand-roll a row" now means compose one of the two primitives                            |
| 064 | Identity hue appears where the person is the answer to the surface's question — meals keep spines (an unclaimed day renders a dashed one), groceries carry no identity chrome (text notes instead); narrows the application of ADR 043/044        |
| 065 | `--primary` and `--ring` are deep olive, and the warm neutrals rotate with them — the palette is **Olive & Teal**; identity hues, `--accent`, coin brass and the status colours are unchanged                                                     |
| 066 | Day-mark visibility belongs to the provider — the surface gate (`calendar.event.view`) and the provider's own `(action, subject)` apply conjunctively, and a provider the caller cannot see is skipped before `fetch` runs. Extends ADR 050       |
| 067 | A list is its own subject, not an item — creating one is a separate action and key, but reading one is covered by reading its items. Superseded in part by ADR 069, which moved the subjects to `shopping`                                        |
| 068 | Row height belongs to the primitive — `ItemCard` 64px (`--spacing-card-touch`), `ListRow` 56px (`--spacing-list-touch`); you pick a primitive by ADR 063's rule and never pick a number. Refines ADR 063                                          |
| 069 | Groceries leaves `meals` and becomes the `shopping` plugin — own schema, nav entry and API routes; subjects are `shopping.List` / `shopping.Item`; `meals` is a producer that pushes `needs` across a contract, never a shared table              |
| 070 | `CaptureField` joins `ComposeForm` — compose when the thing is **authored** (an author, a second draft, submitting ends the act); capture when it is **caught** (one noun, no author worth showing, submitting leaves you ready for the next)     |
| 071 | Checking an item off is its own action — `shopping.Item` carries four actions (`view`/`create`/`check`/`file`) plus `manage`; `check` is baseline tier 2 so a kid can shop without being able to file                                             |
| 072 | The wall adds as the house — `added_by` holds the requesting profile id, `'family'` from the wall; the profile-referencing columns are `text`, not `uuid`, to match `platform.profiles.id`                                                        |
| 073 | You can take back your own add — `retract shopping.Item` scoped by CASL condition to `addedBy: profile.id`, for fifteen minutes from `added_at`, checked in the route; a stale client's 403 must be shown, never swallowed                        |
| 074 | The frame insets, the header leads — `PageContainer` budgets for no content it cannot see and steps once at `md:`; `PageHeader` owns the air on both sides of its title, and `SectionLabel` the space around a group label                        |

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
  "remoteEntry": "http://localhost:3012/assets/remoteEntry.js",
  "exposes": ["./Plugin", "./widgets/TodaySummary"],
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
  ],
  "navItem": {
    "label": "Chores",
    "route": "/chores",
    "icon": "check-square",
    "minTier": 1
  }
}
```

The `widgets` field is optional — plugins that only add routes do not need it. See ADR 022 for full widget manifest field rules, slot taxonomy, and role-aware composition model. `navItem` is the plugin's one sidebar entry (ADR 032); its `icon` is a string resolved through the shell's `ICON_MAP`.

### Day-mark provider contract (ADR 050, ADR 066)

A second, narrower extension point alongside the widget/event mechanisms above: a
**day mark** is a date-scoped fact (an optional owner, a glyph, a short label) a
plugin contributes to the calendar **at read time**, without ever writing
`calendar.Event`. No start time, no duration, no span — that's an event.

```typescript
// @family-os/platform/server
export type DayMarkProvider = {
  name: string
  action: string // CASL action, e.g. "view"
  subject: string // CASL subject, e.g. "meals.PlannedMeal" — required, no default
  fetch(from: string, to: string, ability: AppAbility): Promise<DayMark[]>
}
export function createDayMarkRegistry(): DayMarkRegistry // { register, list }
```

- **Registered on the calendar plugin**, the surface that owns the read:
  `fastify.dayMarks.register({ name, action, subject, fetch })` (`meals.ts` does
  this in one block). `plugins/calendar` (the frontend) never imports a provider
  package — a provider names its `glyph` as a **string** (e.g. `'utensils'`),
  resolved to an icon by a small map local to `plugins/calendar`.
- **`GET /calendar/day-marks?from=&to=`** aggregates: `calendar.event.view` gates
  the surface first (403s exactly like `/calendar/events`); each provider's own
  `(action, subject)` gates its own marks (ADR 066) — a provider the caller
  cannot see is skipped before `fetch` ever runs, so a mark never crosses the
  wire to a caller who can't see the underlying fact.
- **Caps apply after filtering, not before**: one mark per provider per day, two
  marks per day overall, tie-broken by **registration order** — a caller never
  loses a mark they can see to one they can't.
- meals is the first consumer (`view meals.PlannedMeal`, glyph `'utensils'`); M7
  School is the second, intended to register with no code changes to
  `plugins/calendar` or the aggregator.

---

## Event Bus

### Internal flow

```mermaid
flowchart LR
  P["Plugin Service"] --> EB["EventEmitter\n(typed channels)"]
  EB -->|"@fastify/websocket"| B["Browser Clients"]
  EB -->|SSE| R["Read-only Clients\nPi displays, M6+"]
  EB --> MB["MQTT Bridge\nM6+"]
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

- **Runtime:** Docker Compose on Raspberry Pi OS Lite (64-bit, Debian 13 trixie)
- **Hardware:** Raspberry Pi 5 (4 GB) at `192.168.0.42` — eth0 `88:a2:9e:d4:e7:33`, address pinned statically in NetworkManager (2026-09-02, no router reservation in effect); SD-card boot, data on a USB SSD (ext4, `/mnt/data`). Runbook: `docs/deployment.md`
- **Images:** multi-arch (`linux/amd64` + `linux/arm64`) from day one so dev machines and the Pi pull the same images
- **Networking:** wired Ethernet preferred; server exposed on local network only

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
// AuthUser: id, name, tier, avatarUrl, identityHue, darkMode, focusMode,
// pushEnabled, familyName — resolved from /auth/me, not just the session triple.
export function useAuth(): AuthUser
export function useTier(): TierLevel
export function usePermissions(): AppAbility
export function useNotify(): (payload: NotifyPayload) => void
export function usePushSubscription(): PushSubscriptionState
export function AuthProvider(props: { children: ReactNode }): ReactElement
export { AuthContext, MockAuthProvider } // MockAuthProvider is for tests

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

// TanStack Query is re-exported through this entry point on purpose (ADR 013):
// plugins import the hooks from here so they share the shell's QueryClient
// rather than resolving a second copy of react-query.
export { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
export { QueryClient, QueryClientProvider } from '@tanstack/react-query'
```

`createAbility` and `PERMISSION_REGISTRY` are re-exported here too, so a plugin
never reaches past the entry point for them.

### Server exports (`@family-os/platform/server`)

```typescript
export function createEventBus(): EventBus
export function createAbility(profile: Profile, overrides: PermissionOverride[]): AppAbility
export function createDayMarkRegistry(): DayMarkRegistry
export { prisma } // the platform-schema Prisma client

export type EventBus = {
  emit(event: EventName, payload: unknown): void
  /** ADR 069 §4 — dispatches like `emit`, then awaits every handler and hands
      back what each returned, so a producer whose user is standing there can
      say what the consumer did. Notifications keep `emit`: a failed XP award
      must never fail the chore completion that triggered it. */
  emitAndAwait(event: EventName, payload: unknown): Promise<unknown[]>
  on(event: EventName, handler: (payload: unknown) => unknown): () => void
  onAny(handler: (message: BusMessage) => void): () => void
}
```

**The bus is wired by the API, not by this package.** `apps/api` registers its own
`plugins/event-bus` (the WebSocket bridge) and decorates the instance as
`app.eventBus`; `@family-os/platform/server` supplies the implementation and the
type. There is no `createEventBusPlugin` and no `getEventBus`.

### Shared types (`@family-os/platform/types`)

```typescript
export type TierLevel = 1 | 2 | 3 | 4
export type EventName = `${string}.${string}.${string}`

export const FAMILY_PROFILE_ID = 'family' // ADR 021 — the reserved pseudo-profile id
export function resolveFocusMode(focusMode: boolean | null | undefined, tier: number): boolean

export const PERMISSION_REGISTRY = { ... } as const
export type PermissionString = keyof typeof PERMISSION_REGISTRY

export type PluginManifest = {
  name: string
  version: string
  remoteEntry: string
  exposes: string[]
  routes: string[]
  schema: string
  events: { publishes: EventName[]; subscribes: EventName[] }
  widgets?: unknown[]
  navItem?: NavItemManifest // ADR 032 — one sidebar nav entry per plugin
}
```

**`PERMISSION_REGISTRY` is not reproduced here.** It is one `as const` literal in
`packages/platform/src/types.ts` and it grows with every module — read it there.
Its shape is `{ label, module, action, subject }` per key, and a module contributes
keys under its own name: `platform` (profile view/switch/avatar/colour, plugin view,
bug-report create), `family-feed`, `chores`, `rewards`, `calendar`, `meals`, and
`shopping`. Adding a key is ADR 018's registration step, not a doc edit.

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
- **Login UX:** profile grid + single global family PIN (ADR 021); shipped in M1 auth-and-profiles

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
  reporter_id         text                 -- NO FK by design: the household pseudo-profile ('family') is the DEFAULT profile (it has had a profiles row everywhere since the 2026-07-29 backfill, PR #87); resolved at read time with a fallback
  description         text                 -- the reporter's own words
  context             jsonb                -- the capture: route, build hash, viewport, UA, console errors. Schemaless on purpose — evidence, not queryable data
  status              text  default 'new'  -- new | triaged | fixing | deployed | wont_fix
  github_issue_number integer  nullable    -- null when the bridge is unconfigured or failed; never blocks the report
  resolution          text     nullable    -- replaces the default 'Fixed and live' notification body
  created_at          timestamptz
  updated_at          timestamptz

push_subscriptions                        -- Web Push endpoints, one row per device (M1 web-push)
  id           uuid  PK
  profile_id   uuid  FK → profiles.id (ON DELETE CASCADE)
  endpoint     text  UNIQUE
  p256dh       text
  auth         text
  created_at   timestamptz

notifications                             -- the tray's backing store (ADR 029)
  id           uuid  PK
  profile_id   uuid  FK → profiles.id (ON DELETE CASCADE)
  title        text
  body         text     nullable
  variant      text                       -- success | info | warning | error
  priority     text                       -- info | alert
  is_read      boolean  default false
  created_at   timestamptz

sessions                                  -- connect-pg-simple's table (ADR 017)
  sid          text  PK
  sess         jsonb
  expire       timestamptz

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
| `plugins/[name]/package.json`         | Workspace manifest — name, port, scripts                                                 |
| `plugins/[name]/vite.config.ts`       | Module Federation config; `@family-os/ui` and `@family-os/platform` as shared singletons |
| `plugins/[name]/public/manifest.json` | Stub matching `PluginManifest` type; served at `/manifest.json` by Vite                  |
| `plugins/[name]/tsconfig.json`        | Extends workspace root config                                                            |
| `plugins/[name]/src/index.ts`         | Barrel — exposes the plugin module                                                       |
| `plugins/[name]/src/Plugin.tsx`       | Minimal example using platform hooks                                                     |

The generator also appends the plugin to `plugins.json` (name + dev `baseUrl`) so the shell Vite config picks it up. `pnpm-workspace.yaml` is updated automatically. Each plugin runs its own Vite dev server; `pnpm dev` starts everything in parallel via Turborepo's task graph.

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
- **MQTT bridge design** — deferred to M6+ (Smart Home)
