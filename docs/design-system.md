# Design System

> Last updated: 2026-05-25 — System Design session.

This document records settled design decisions. Deferred items are
explicitly marked — do not treat absence of a spec as a free choice.

---

## Contents

- [Principles](#principles)
- [Technology Stack](#technology-stack)
- [Typography](#typography)
- [Color & Tokens](#color--tokens)
- [Surfaces](#surfaces)
- [Role-Aware Rendering](#role-aware-rendering)
- [Plugin Design Contract](#plugin-design-contract)
- [To Be Defined](#to-be-defined)

---

## Principles

Every design decision should be checkable against these. They flow
directly from the project vision.

| Principle | What it means in practice |
|-----------|--------------------------|
| **Kids are participants** | Kid-facing views are first-class UI, not simplified adult UI |
| **Legible at a glance** | Tablet is often across a room — key info must read without approaching |
| **Tier-appropriate, not age-locked** | UI adapts to trust tier, not birth year |
| **Calm by default** | No unnecessary motion, badges, or urgency cues |
| **Touch-first, pointer-friendly** | Tablet and mobile are touch surfaces; mouse/keyboard work but are secondary |
| **Plugins feel native** | Community-built plugins use the same component library and tokens as first-party modules |
| **No AI aesthetic** | Family OS should have its own visual character — avoid the generic Inter/Geist/hyper-minimal look |

---

## Technology Stack

**Settled** — see ADR 012.

| Layer | Choice |
|-------|--------|
| Component primitives | Radix UI (via shadcn/ui) |
| Component library | shadcn/ui — copy-paste model, owned by this repo |
| Styling | Tailwind CSS v4 — CSS variable tokens |
| Icons | Lucide |

Components live in `packages/ui/` once the monorepo is scaffolded.
Adding a component means running the shadcn CLI and editing the
output — not upgrading a dependency.

---

## Typography

**Direction settled. Specific fonts deferred** — see To Be Defined.

- **Two font families** — a UI workhorse and a warmer display font
- **Warmer feel** — rounded, approachable; deliberately not the
  Inter/Geist default aesthetic
- **M0 placeholder** — ship with the system font stack; no font
  decision baked in, nothing to undo later

```css
/* M0 placeholder — replaced when fonts are chosen */
--font-ui:      system-ui, sans-serif;
--font-display: system-ui, sans-serif;
```

Specific font choices require real UI to evaluate against. Deferred
to the Visual Language design session.

---

## Color & Tokens

**Deferred** — to the Visual Language design session. Real UI is
needed before palette decisions can be made well.

The token structure will use CSS custom properties so theming
(light/dark, tier variants) is cascade-based with no JavaScript
overhead. Semantic tokens (e.g. `--background`, `--accent`) will
sit on top of a raw palette — plugins consume semantic tokens only.

---

## Surfaces

**Tablet is the only M0 surface.** All others are deferred.

### Tablet — Primary Hub

The family's central display. Always-on, landscape, touch-first.
Target: 10–13" touchscreen, 1280×800 minimum.

**Shell layout:** A nav structure with a main content slot that
plugins render into. The specific nav layout (sidebar style,
positioning) is not locked — it will be resolved in the Widget
Composition design session alongside the home screen design
(see ADR 011).

**Home screen:** A named placeholder in M0. It explicitly does not
define the final composition surface — that is the widget system,
designed in M1. See ADR 011.

**Touch targets:** All interactive elements minimum 48px. Cards and
list items minimum 64px tall.

**Viewing distance:** Primary readable content minimum 18px. Status
counts and key values minimum 20px.

### Other Surfaces

Mobile, TV, and Pi room display layouts are deferred to their
respective design sessions. See `docs/sessions/queue.md`.

---

## Role-Aware Rendering

**Settled** — see ADR 013 (state management) and ADR 015
(permission layer).

### Model

Tier defines the baseline permission set. Individual permissions
can be granted above or revoked below that baseline by a parent.
All capability checks operate on the *effective* permission set.

```
effective permissions = tier_baseline ∪ granted − revoked
```

### Hooks

```ts
// Primary hook — full user object including tier
const { user } = useAuth();

// Tier level only
const { tier } = useTier();  // 1 | 2 | 3 | 4

// Effective permissions — tier baseline + grants − revocations
const { can } = usePermissions();
can('tasks.create');  // → boolean
```

All three imported from `@family-os/platform`.

### Rendering Primitives

```tsx
// TierGate — coarse structural gating
// Use for broad sections (admin nav, management areas)
<TierGate min={3}>
  <AdminPanel />
</TierGate>

// PermissionGate — fine-grained capability gating
// Use for specific actions that can be granted/revoked independently
<PermissionGate permission="tasks.create">
  <NewTaskButton />
</PermissionGate>

// Both support a fallback
<PermissionGate permission="finance.spend.request" fallback={<LockedState />}>
  <SpendingControls />
</PermissionGate>
```

`min` is always a numeric level (1–4), never a display name string.
Permission strings follow `module.noun.verb` convention.

### Tier rendering intent

| Tier | General intent |
|------|---------------|
| 1 | Simplified vocabulary, large targets, no financial data, task completion only |
| 2 | Earning progress visible, full task detail, no management UI |
| 3 | Family schedule visible, can propose/create tasks, light management UI |
| 4 (parent) | Full management, approval queues, all financial data, system settings |

Specific capability rules per module are defined in module specs,
not here. Individual grants and revocations are managed at runtime
by parents — not hardcoded.

---

## Plugin Design Contract

**Settled** — see ADR 014.

```ts
// Plugins import from shared platform packages only
import { Button, Card, TierGate, PermissionGate } from '@family-os/ui';
import { useAuth, useTier, usePermissions }        from '@family-os/platform';
```

Plugins must not:
- Import from the shell or other plugins directly
- Hardcode color values — use CSS custom property tokens
- Use media queries for layout — use CSS container queries
- Import Tailwind directly — the platform stylesheet is injected

The `@family-os/ui` surface starts minimal and grows deliberately.
Every export is a commitment plugins can depend on.

---

## To Be Defined

| Item | Deferred to |
|------|------------|
| Specific font choices | Visual Language design session |
| Color palette and tokens | Visual Language design session |
| Motion and animation | Visual Language design session |
| Dark mode strategy | Visual Language design session |
| Tablet nav layout (sidebar style, positioning) | Widget Composition design session |
| Widget composition system | Widget Composition design session — see ADR 011 |
| Mobile surface layout | M1+ design session |
| TV ambient layout | M2+ design session |
| Pi room display layout | M2+ design session |
| Notification and alert patterns | M1 design session |
| Error and empty states | M1 design session |
| Login / profile switcher UI | M0 Architecture session |
| Permission string registry (full enumeration) | M0 Architecture session |
