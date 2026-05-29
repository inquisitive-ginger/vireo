# Design System

> Last updated: 2026-05-29 — Widget Composition Design session.

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
- [Login / Profile Switch](#login--profile-switch)
- [Tablet Nav Layout](#tablet-nav-layout)
- [Widget Composition System](#widget-composition-system)
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

**Shell layout:** Left sidebar (220px) + main content area (flex-1).
No top header bar — the profile chip lives at the top of the sidebar.
See [Tablet Nav Layout](#tablet-nav-layout) and [Widget Composition System](#widget-composition-system).

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

## Login / Profile Switch

**Settled** — see ADR 017, ADR 021, and the 2026-05-29 design session.

### Family Dashboard

The tablet's default state when no family member is active. A `family` pseudo-profile
(tier 1, all writes removed via CASL) is permanently seeded and serves as the active
profile. Modules render tier-appropriate content normally — no special null-auth code
path.

The family dashboard is **not a lock screen.** The tablet remains functional and
informative in the unattended state. Intended content is module-owned; the rule is:
anything visible at tier 1 is eligible for the family dashboard.

**Contextual auth:** Write actions on the family dashboard intercept the tap and
surface the profile picker inline. The action completes after profile selection.
The CASL model enforces this naturally — the family pseudo-profile has no write
permissions.

### Entry Points

| Trigger | Behavior |
|---------|----------|
| **Corner chip** (shell header) | Always visible. Shows current active profile (avatar + name). Tap opens profile grid overlay. |
| **Inactivity timeout** | Deactivates personal profile, returns to family dashboard. Next interaction uses family dashboard or switches via chip. |

There is no lock screen. The tablet does not gate access; it offers personalization.

### Profile Grid

A centered grid of circular avatars. Presented full-screen on inactivity transition;
floating overlay from corner chip tap. Same component, `mode: 'fullscreen' | 'overlay'`.

- Avatar: 80px minimum diameter
- Tap target: 48px minimum (see touch targets in Surfaces)
- Name label below each avatar
- Avatar fallback: initials or emoji if no image set
- Current active profile: highlighted ring, non-interactive
- Family pseudo-profile: **not shown** in the picker — it is the default, not a choice

### PIN Entry

Triggered when switching to a profile at a higher tier than the current active profile.

- **Single global family PIN** — one PIN for the whole family. Not per-profile.
  Stored in `platform.system_config`. Any tier-4 profile can set or reset it.
- **UI:** Full-screen overlay; large circular digit buttons; 4-digit PIN;
  dot progress indicator
- **Copy:** "Enter family PIN" — no attribution to a specific parent
- **No PIN set:** Returns 423; upward switching is blocked until a tier-4 profile
  completes first-run PIN setup
- **Failed attempt:** Wrong-PIN message shown inline. Rate-limiting deferred to M1.

### Future — Biometrics

Touch ID / Face ID would replace PIN entry as the verification pathway on
`POST /auth/verify-pin`. The session/switch model is unchanged — it is a
UI-layer swap. No architectural accommodation needed now.

---

## Tablet Nav Layout

**Settled** — see ADR 022.

Left sidebar, always visible, 220px wide. No top header bar.

```
┌──────────┬────────────────────────────────────┐
│ Sidebar  │                                    │
│  220px   │         Main content area          │
│          │                                    │
│          │                                    │
└──────────┴────────────────────────────────────┘
```

### Sidebar structure (top to bottom)

1. **Profile chip** — avatar + active profile name. Tap opens the profile grid overlay
   (per ADR 021). Always visible. This is what ADR 021 calls the "corner chip in the
   shell header" — functionally identical, repositioned to the sidebar top.
2. **Nav items** — icon + label. Tier-filtered: items the active profile can't access
   are hidden. Minimum 48px touch target height per item.
3. **Settings** — bottom of sidebar. Visible to tier 4 only.

### Nav item visibility

Nav items are filtered by the active profile's tier. Plugins register nav routes in
their `manifest.json` with a `minTier` field (same pattern as widget registration).
The sidebar renders only the routes the current user can access.

The family pseudo-profile (tier 1, no writes) sees only tier-1-appropriate nav items.

---

## Widget Composition System

**Settled** — see ADR 022. Implementation is M1.

### Grid

React Grid Layout (`react-grid-layout`). Config: `cols: 4`, `rowHeight: 180`,
`gap: 16`. The four columns fill the main content area (~1060px after sidebar at 1280px).

M1 ships in static mode (`isDraggable: false`, `isResizable: false`).
Drag-and-drop configuration UI is M1+.

### Widget slot taxonomy

Six named sizes. Plugin manifests declare these by name; the shell translates to
React Grid Layout `{ w, h }` values internally.

| Named size | `w` | `h` | ~Dimensions |
|------------|-----|-----|-------------|
| `compact` | 1 | 1 | 253×180px |
| `standard` | 2 | 1 | 522×180px |
| `tall` | 1 | 2 | 253×376px |
| `large` | 2 | 2 | 522×376px |
| `banner` | 4 | 1 | 1060×180px |
| `full` | 4 | 4 | 1060×760px |

### Widget registration

Plugins declare widgets in `manifest.json`. See ADR 022 for the full field spec.
Key fields:

```json
{
  "id": "chores.today-summary",
  "displayName": "Today's Chores",
  "component": "./widgets/TodaySummary",
  "defaultSize": "standard",
  "supportedSizes": ["compact", "standard"],
  "minTier": 1,
  "requiredPermission": "chores.view",
  "description": "Shows the current user's tasks due today."
}
```

### Role-aware composition

Two levels:

1. **Shell — manifest gate:** Widget excluded from the layout if
   `minTier > activeProfile.tier` or `requiredPermission` fails `can()`.
   Skipped widgets are removed from the rendered grid; the layout re-flows.
   The saved layout record is preserved — the widget returns if the gate
   is later satisfied.

2. **Widget — internal rendering:** Widget component uses `useTier()` and
   `PermissionGate` to adapt its content within the slot.

### Layout persistence

Per-user layout stored in the platform DB as `{ widgetId, x, y, w, h }[]`.
Exact schema deferred to the M1 implementation session.

**Edit rights:**

| Tier | Own layout | Others' layouts |
|------|-----------|-----------------|
| 1–2 | No | No |
| 3 | Yes | No |
| 4 | Yes | Any family member |

New users seeded with a tier-appropriate default layout from platform config.
Layout is not auto-rearranged on tier changes — a parent edits it intentionally.

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
| Tablet nav layout (sidebar style, positioning) | **Settled** — see [Tablet Nav Layout](#tablet-nav-layout) |
| Widget composition system | **Settled** — see [Widget Composition System](#widget-composition-system) and ADR 022 |
| Mobile surface layout | M1+ design session |
| TV ambient layout | M2+ design session |
| Pi room display layout | M2+ design session |
| Notification and alert patterns | M1 design session |
| Error and empty states | M1 design session |
| Permission string registry (full enumeration) | M0 Architecture session |
