# Session Log — 2026-05-25 — System Design

**Type:** Design
**Produces:** `docs/design-system.md`, ADRs 011–015

---

## What was decided

### Component library and styling (ADR 012)
shadcn/ui + Tailwind CSS v4. Copy-paste model — components are owned
by the repo, not versioned through a dependency. Enables a "start
opinionated, evolve to custom" trajectory without fighting a
framework. DaisyUI was the main alternative considered; ruled out
due to lack of accessibility primitives for complex interactions.

### Typography
Direction settled: two font families, warmer feel, deliberately not
the Inter/Geist AI-era default. Specific fonts deferred to the Visual
Language design session — needs real UI to evaluate candidates
against. M0 ships with the system font stack as a placeholder.

### Color, tokens, motion, dark mode
All deferred to the Visual Language design session for the same
reason as typography — these decisions benefit from real UI context.
The token structure will use CSS custom properties (cascade-based
theming, no JS overhead).

### Shell composition model (ADR 011)
The shell home surface is a composable, role-aware widget grid —
kids and parents see different primary surfaces. M0 explicitly does
not implement this; the home screen is a named placeholder. M0's
plugin loading mechanism must not assume a single plugin fills the
whole screen. Implementation deferred to M1 (Widget Composition
design session).

M0 definition of done revised: "The shell renders, nav works, one
plugin loads into the content slot via Module Federation. The home
screen is an explicit placeholder."

### State management (ADR 013)
Layered by state type:
- React Context (`AuthProvider`) for auth and tier — changes rarely,
  global reach
- Zustand for shell client state — no extra provider, selective
  subscriptions
- TanStack Query for server/plugin data — fetching, caching,
  real-time via WebSocket cache invalidation
- `useState` / `useReducer` for plugin-local UI state

### Role-aware rendering (ADR 015 extends ADR 003)
Tier defines a baseline permission set. Parents can grant permissions
above the tier (trial keys) or revoke them below it (consequences).
All checks operate on effective permissions.

Two rendering primitives:
- `<TierGate min={n}>` — coarse structural gating
- `<PermissionGate permission="module.noun.verb">` — fine-grained
  capability gating; respects grants and revocations

Permission strings follow the existing `module.noun.verb` convention.

### Plugin design contract (ADR 014)
Import-based. Plugins import from `@family-os/ui` and
`@family-os/platform`. Vite Module Federation config declares shared
packages as singletons. Injection-based contract deferred until M7
Marketplace requires stricter third-party plugin isolation.

---

## What was produced

- `docs/design-system.md` — settled decisions + explicit deferred items
- `docs/sessions/templates/design.md` — design session template
- `docs/decisions/011-shell-composition-model.md`
- `docs/decisions/012-design-technology-stack.md`
- `docs/decisions/013-state-management.md`
- `docs/decisions/014-plugin-design-contract.md`
- `docs/decisions/015-permission-layer.md`
- `docs/architecture.md` — ADRs 011–015 added to settled decisions
  table; shell composition model added to To Be Defined

---

## Open questions raised

- **Permission string registry** — the full enumeration of permission
  strings across all modules needs to be defined. Deferred to M0
  Architecture session.
- **Auth identity model** — JWT vs. Lucia for session management on
  Fastify. Affects `AuthProvider` implementation. Deferred to M0
  Architecture session.
- **Widget composition design** — how plugins register widgets, what
  slot types exist, how role-aware composition works in practice.
  Needs its own design session before M1 implementation begins.

---

## What the next session needs to know

- **M0 Product session** is next. The revised M0 done definition
  (plugin loads into a content slot; home screen is a placeholder)
  should inform how stories are written.
- The Widget Composition design session must happen before M1
  implementation begins — add it to the queue between M0 Architecture
  and M1.
- The Visual Language design session should be scheduled once there
  is real UI to evaluate font and color choices against — likely
  after M0 implementation is underway.
- ADR 003 is extended by ADR 015, not superseded. Both remain active.
