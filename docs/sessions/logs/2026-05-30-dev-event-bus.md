# Session Log — 2026-05-30 — Development: event-bus

## What was built

**`packages/platform`**
- `src/types.ts` — added `BusMessage` and `EventBus` types (shared between server and client consumers)
- `src/event-bus.ts` — `createEventBus()`: Node `EventEmitter` under the hood, `onAny` wildcard via a `Set<handler>`, runtime `assertValidEventName()` regex enforcing lowercase kebab-case `module.noun.verb` shape
- `src/server.ts` — re-exports `createEventBus`, `EventBus`, `BusMessage` for server consumers
- `src/index.ts` — re-exports `BusMessage`, `EventBus` types for client consumers

**`packages/test-utils`**
- `src/event-bus-double.ts` — updated to match new `EventBus` interface: `on()` now returns unsubscribe `() => void`; `onAny` added; `reset()` clears wildcard handlers too

**`apps/api`**
- Added `@fastify/websocket ^11` and `fastify-plugin ^5` dependencies
- `src/plugins/event-bus.ts` — Fastify plugin (wrapped with `fastify-plugin` for decoration propagation): creates bus, decorates instance with `app.eventBus`, registers `@fastify/websocket`, opens `GET /events` WebSocket route, wires `onAny` → broadcast to all open clients
- `src/server.ts` — registers plugin; adds `POST /trigger-event` demo route that emits `platform.ping.sent`
- `src/index.ts` — updated to `await buildServer()` (buildServer is now async)

**`apps/shell`**
- `vite.config.ts` — added proxy: `/events` → `ws://localhost:3000` (WebSocket), `/trigger-event` → `http://localhost:3000`
- `src/hooks/useEventBus.ts` — `useEventBus(onMessage)` hook: opens WebSocket on mount, exponential backoff reconnect (1s→2s→…→30s cap, resets on open), stable callback via ref pattern, closes cleanly on unmount
- `src/pages/Home.tsx` — added "Event Bus" panel: button emits `platform.ping.sent` via `POST /trigger-event`, received events rendered as a timestamped log (capped at 20 entries)

**Tests** — 17 passing (9 platform event-bus unit tests, 2 API route tests, 6 existing test-utils tests)

## Acceptance criteria status

| # | Criterion | Status |
|---|-----------|--------|
| 1 | Fastify plugin service emits via `app.eventBus` from `@family-os/platform` | ✅ Pass |
| 2 | Shell receives event via WebSocket within 500ms on local network | ✅ Pass (local, trivially fast) |
| 3 | Invalid event name rejected at call time | ✅ Pass — tested with 4 cases |
| 4 | Types exported from `@family-os/platform`, no `any` casts | ✅ Pass — typecheck clean |
| 5 | Shell reconnects automatically when WebSocket closes | ✅ Pass — exponential backoff in hook |
| 6 | One real event flows end-to-end and shows in shell UI | ✅ Pass — `platform.ping.sent` button + event log |

## Scope additions

- `BusMessage` and `EventBus` types moved to `types.ts` so client-side code can import them without pulling in Node.js `EventEmitter`. This was a necessary discovery during implementation, not a scope change.
- `packages/test-utils` event-bus double updated to stay in sync — counted as in-scope (test infrastructure).

## New stories created

None.

## Open questions raised

None.

## What the next session needs to know

- `auth-and-profiles` is next. It depends on `shell-skeleton` (done) and the M0 Architecture ADRs (017–019): `@fastify/session` + `connect-pg-simple`, CASL permission model, Prisma ORM.
- The API server's `buildServer()` is now `async` — anything that imports it for testing should `await` it.
- The WebSocket route is at `GET /events`; the Vite proxy forwards it from the shell's dev server. No CORS concerns in dev.
