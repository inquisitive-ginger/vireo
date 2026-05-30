# 008 — Event Bus Implementation

**Status:** Decided

**Decision:** The event bus is a typed Node.js EventEmitter running
in the platform API server process. A native WebSocket layer
(@fastify/websocket, backed by the `ws` package) bridges internal
events to connected browsers (satisfying ADR 004). Read-only clients
(e.g. future Pi room displays) may use Server-Sent Events (SSE)
instead of a full WebSocket connection. An MQTT bridge module is a
defined extension point — it will subscribe to Mosquitto and publish
into the same EventEmitter — but is not built until microcontroller /
Pi integration is active (M4 Smart Home or later). No external message broker is
introduced in M0.

**Why:** An in-process EventEmitter is sufficient for M0 — all plugin
services run on the same server, so cross-process messaging is not
needed yet. Keeping the broker internal avoids standing up and
operating Redis, NATS, or similar in M0. @fastify/websocket is chosen
over socket.io because it is lean (ws is ~7KB vs socket.io's ~40KB+
client bundle), uses the standard WebSocket protocol with no
proprietary framing, and integrates natively with Fastify. The MQTT
bridge is a defined extension point (not an afterthought) because
physical hardware integration is a planned milestone — no EventEmitter
consumers need to change when MQTT is added.

**Alternatives considered:** socket.io (battle-tested but bloated —
proprietary protocol layer, large client bundle, unnecessary for a
controlled local-network deployment); Redis Pub/Sub as the broker from
day one (operationally correct long-term but unnecessary for a
single-server M0); uWebSockets.js (fastest available, but C++ native
binding is fragile across Node versions and the performance ceiling of
`ws` is not a real constraint for a family-scale deployment).

**Do not revisit unless:** Plugin services are split across multiple
server processes or machines, at which point an external broker
(Redis Pub/Sub or NATS) should replace the in-process emitter.
