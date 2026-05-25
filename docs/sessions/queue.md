# Session Queue

> Owned by planning sessions. Updated at the end of every planning
> session. All other session types read but don't modify this file.

---

## Up Next

1. **System Design** ![Type](https://img.shields.io/badge/Type-Design-blueviolet)
   Design system, component library conventions, surface layouts
   (tablet, mobile, TV), role-aware rendering patterns.
   _Reads:_ `docs/vision.md`, ADR 003 (tier model), `docs/architecture.md`
   _Produces:_ `docs/design-system.md`

2. **M0 Product** ![Type](https://img.shields.io/badge/Type-Product-green)
   Break M0 Foundation into stories, write specs and acceptance
   criteria for each.
   _Reads:_ `docs/roadmap.md`, `docs/architecture.md`
   _Produces:_ `docs/modules/platform/progress.md`, story specs

3. **M0 Architecture** ![Type](https://img.shields.io/badge/Type-Architecture-blue)
   Validate M0 stories against architecture, resolve conflicts,
   confirm nothing was missed.
   _Reads:_ `docs/architecture.md`, M0 story specs
   _Produces:_ Updated `docs/architecture.md`, any new ADRs

---

## Blocked / Waiting
_None yet._

---

## Recently Completed

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
