# Story: Event Bus

**Module:** platform
**Status:** ✅ Done

## User story

As a plugin developer, I can publish typed events to the platform event bus and have subscribers receive them in real time so that plugins can react to activity in other parts of the system.

## Scope

**In:** In-process Node.js EventEmitter with typed event channels; `@fastify/websocket` bridge so browser clients receive events over WebSocket; event naming convention enforced at publish time (`module.noun.verb`); typed event bus API exported from `@family-os/platform`; demonstrated with at least one event flowing end-to-end

**Out:** MQTT bridge (M4+); SSE for Pi displays (M4+); Web Push for mobile (M1); cross-plugin event subscription authorization; event persistence or replay

## Acceptance criteria

1. A Fastify plugin service can emit a typed event using the event bus API from `@family-os/platform`
2. The shell receives the event via WebSocket within 500ms of publication on a local network
3. Publishing an event with a name that does not match `module.noun.verb` is rejected with an error at call time
4. The TypeScript types for the event bus are exported from `@family-os/platform` and used by both the publisher and the shell subscriber without `any` casts
5. When the WebSocket connection is lost and re-established, the shell reconnects without requiring a page refresh
6. At least one real event flows end-to-end: emitted by `apps/api`, received by `apps/shell`, and reflected in the shell's UI

## Dependencies

- dev-environment

## Notes

The EventEmitter is in-process on the API server; the WebSocket bridge (`@fastify/websocket`) fans events out to connected browser clients. This story runs after Shell Skeleton — the end-to-end AC (criterion 6) requires the shell to have at least a minimal WebSocket listener, so shell-skeleton should be complete before starting this story.
