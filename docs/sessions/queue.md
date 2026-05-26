# Session Queue

> Owned by planning sessions. Updated at the end of every planning
> session. All other session types read but don't modify this file.

---

## Up Next

1. **M0 Architecture** ![Type](https://img.shields.io/badge/Type-Architecture-blue)
   Validate M0 stories against architecture, resolve conflicts, confirm
   nothing was missed. Closes: auth identity model (JWT vs. Lucia),
   permission string registry, Platform API surface, plugin dev toolchain.
   _Reads:_ `docs/architecture.md`, `docs/modules/platform/`, ADRs 011–016
   _Produces:_ Updated `docs/architecture.md`, any new ADRs

2. **Login / Profile-Switch UX Design** ![Type](https://img.shields.io/badge/Type-Design-blueviolet)
   Design how family members identify themselves on the tablet. The
   mechanism is open (switcher, PIN, QR, proximity, etc.) — this session
   explores and decides. Must complete before auth-and-profiles story is
   implemented.
   _Reads:_ `docs/design-system.md`, ADR 003 (tier model), auth story spec
   _Produces:_ Login/profile-switch UX spec, updated `docs/design-system.md`

3. **Widget Composition Design** ![Type](https://img.shields.io/badge/Type-Design-blueviolet)
   Design the shell home surface: widget system, role-aware slot
   composition, plugin widget registration, tablet nav layout.
   Must happen before M1 implementation begins.
   _Reads:_ ADR 011, `docs/design-system.md`, M0 story specs
   _Produces:_ Updated `docs/design-system.md`, widget system spec

4. **Visual Language Design** ![Type](https://img.shields.io/badge/Type-Design-blueviolet)
   Typography (specific fonts), color palette, design tokens,
   motion/animation, dark mode strategy. Schedule once real M0 UI
   exists to evaluate candidates against.
   _Reads:_ `docs/design-system.md`, running M0 shell
   _Produces:_ Updated `docs/design-system.md` with full token system

---

## Blocked / Waiting
_None yet._

---

## Recently Completed

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
