# Session Log — Platform Architecture

![Type](https://img.shields.io/badge/Type-Architecture-blue) ![Date](https://img.shields.io/badge/Date-2026--05--24-lightgrey) ![Milestone](https://img.shields.io/badge/Milestone-M0-informational) ![Status](https://img.shields.io/badge/Status-Complete-brightgreen) ![ADRs](https://img.shields.io/badge/ADRs-006–010-blue)

---

## What Was Decided

| Decision                                                                                | ADR |
| --------------------------------------------------------------------------------------- | --- |
| TypeScript end-to-end — React shell, Node.js/Fastify plugin services                    | 006 |
| Vite Module Federation for plugin loading                                               | 007 |
| In-process EventEmitter + @fastify/websocket bridge; MQTT bridge deferred to M2+        | 008 |
| PostgreSQL (single Docker instance, per-plugin schemas, JSONB for semi-structured data) | 009 |
| PWA (Android) + Web Push; no native app                                                 | 010 |

Hardware and hosting context established (not an ADR — operational, not architectural):

- Primary server: repurposed x86 laptop, Ubuntu Server 24.04 LTS, Docker Compose
- Raspberry Pi(s): edge / peripheral role in M2+ (room displays, GPIO, sensor agents)
- Microcontrollers (ESP32, Arduino): MQTT → Mosquitto → event bus in M2+
- Multi-arch Docker images (amd64 + arm64) from day one

Key nuances recorded:

- socket.io rejected in favour of @fastify/websocket (`ws`) — leaner, no proprietary protocol
- Read-only clients (Pi displays) will use SSE rather than full WebSocket
- NoSQL rejected — plugin data is relational; ADR 005 ledger requires ACID; PostgreSQL JSONB covers semi-structured needs
- PWA case strengthened by both parents being on Android (full Web Push support since 2015)

## What Was Produced

- ADRs 006–010
- `docs/architecture.md` fully populated (was a stub)
- `docs/sessions/templates/architecture.md` created (first architecture session)

## Open Questions Raised

- None blocking M0

## What the Next Session Needs to Know

- The tech stack is locked: TypeScript / React / Fastify / Vite Module Federation / PostgreSQL / PWA
- The plugin contract shape (manifest.json, Platform API SDK) needs to be fully specified —
  this is the primary output of the M0 Architecture session
- Auth / identity model is explicitly deferred — flag this early in M0 Product because
  tier enforcement (ADR 003) touches every module's story acceptance criteria
- MQTT / hardware integration is not M0 scope but the extension point is designed in;
  no rework needed when M2+ picks it up
