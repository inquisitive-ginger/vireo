# Design System

> Last updated: 2026-06-14 — Mobile Surface section added (nav pattern, breakpoint, profile chip, widget reflow, safe-area insets).

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
- [Home Surface](#home-surface)
- [Notification System](#notification-system)
- [Error States](#error-states)
- [Empty States](#empty-states)
- [Motion & Animation](#motion--animation)
- [Plugin Design Contract](#plugin-design-contract)
- [Mobile Surface](#mobile-surface)
- [To Be Defined](#to-be-defined)

---

## Principles

Every design decision should be checkable against these. They flow
directly from the project vision.

| Principle                             | What it means in practice                                                                             |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| **Kids are participants**             | Kid-facing views are first-class UI, not simplified adult UI                                          |
| **Legible at a glance**               | Tablet is often across a room — key info must read without approaching                                |
| **Tier-appropriate, not age-locked**  | UI adapts to trust tier, not birth year                                                               |
| **Calm by default**                   | No unnecessary motion, badges, or urgency cues                                                        |
| **Touch-first, pointer-friendly**     | Tablet and mobile are touch surfaces; mouse/keyboard work but are secondary                           |
| **Plugins feel native**               | Community-built plugins use the same component library and tokens as first-party modules              |
| **No AI aesthetic**                   | Family OS should have its own visual character — avoid the generic Inter/Geist/hyper-minimal look     |
| **People are color**                  | Every family member maps to a stable identity hue, used consistently across all modules               |
| **The family voice is serif**         | User-authored words (posts, notes) render in Lora via `prose`; UI chrome stays DM Sans                |
| **Surfaces lift, backgrounds recede** | Content cards float on the warm background via elevation tokens — depth, not lines, creates hierarchy |

---

## Technology Stack

**Settled** — see ADR 012.

| Layer                | Choice                                           |
| -------------------- | ------------------------------------------------ |
| Component primitives | Radix UI (via shadcn/ui)                         |
| Component library    | shadcn/ui — copy-paste model, owned by this repo |
| Styling              | Tailwind CSS v4 — CSS variable tokens            |
| Icons                | Lucide                                           |

Components live in `packages/ui/` once the monorepo is scaffolded.
Adding a component means running the shadcn CLI and editing the
output — not upgrading a dependency.

---

## Typography

**Settled** — fonts: Visual Language session 2026-06-02; scale locked 2026-06-08.

### Font families

| Role                                        | Font        | Fallback                            |
| ------------------------------------------- | ----------- | ----------------------------------- |
| Display — page titles and emotional moments | **Lora**    | Georgia, 'Times New Roman', serif   |
| UI — all other text                         | **DM Sans** | 'Helvetica Neue', Arial, sans-serif |

**Pairing rationale:** Lora gives page titles and narrative moments warmth and editorial character. DM Sans keeps UI text clean and legible without the generic Inter/Geist feel.

**Lora scope:** `page-title`, `display-lg`, `display-xl`, and `prose` (user-authored content — see below). All other tokens — including `heading`, `card-title`, `section-label` — use DM Sans. Structural headings that don't carry emotional weight stay in DM Sans.

```css
--font-display: 'Lora', Georgia, 'Times New Roman', serif;
--font-ui: 'DM Sans', 'Helvetica Neue', Arial, sans-serif;
```

Loaded from Google Fonts in `apps/shell/index.html`. Plugins must use `var(--font-display)` and `var(--font-ui)` — never hardcode a font family.

### Type scale

Major second ratio (1.125), base 16px. 11 tokens.

**Viewing distance rule:** UI chrome (sidebar, settings, dialogs, forms) reads close-up — tokens up to `card-title` are appropriate. Widget and content areas may be glanced from across the table — `body` (18px) is the minimum for primary content text.

All tokens are defined as CSS utilities in `packages/ui/src/styles.css` and are available as Tailwind classes throughout the codebase. Use the utility name — never raw pixel values.

| Token           | Utility class        | px  | Weight | Line-height | Tracking | Font                       |
| --------------- | -------------------- | --- | ------ | ----------- | -------- | -------------------------- |
| `xs`            | `text-xs-token`      | 10  | 600    | 1.4         | 0        | DM Sans                    |
| `section-label` | `text-section-label` | 11  | 700    | 1.4         | 0.1em    | DM Sans · always uppercase |
| `sm`            | `text-sm-token`      | 13  | 400    | 1.5         | 0        | DM Sans                    |
| `base`          | `text-base-token`    | 14  | 400    | 1.5         | 0        | DM Sans                    |
| `card-title`    | `text-card-title`    | 16  | 600    | 1.3         | 0        | DM Sans                    |
| `body`          | `text-body`          | 18  | 400    | 1.6         | 0        | DM Sans                    |
| `prose`         | `text-prose`         | 18  | 400    | 1.65        | 0        | **Lora**                   |
| `heading`       | `text-heading`       | 20  | 600    | 1.2         | −0.01em  | DM Sans                    |
| `page-title`    | `text-page-title`    | 26  | 600    | 1.2         | −0.02em  | **Lora**                   |
| `display-lg`    | `text-display-lg`    | 29  | 600    | 1.2         | −0.01em  | **Lora**                   |
| `metric`        | `text-metric`        | 32  | 700    | 1.0         | −0.01em  | DM Sans                    |
| `display-xl`    | `text-display-xl`    | 36  | 400    | 1.15        | −0.01em  | **Lora**                   |

**Usage notes:**

- `section-label` — `--muted-foreground` by default; `--accent` when naming a module surface (widget identity headers, feed day markers); uppercase is baked into the utility
- `prose` — user-authored content only (feed posts, notes, messages). The family's own words get the warmth of the display face; text _about_ the UI never does. Same 18px viewing-distance floor as `body`
- `page-title` — one per route; renders in Lora
- `display-lg` — empty state headings, error page headings
- `display-xl` — greeting text ("Good morning, Zach"), hero moments
- `metric` — widget key numbers and counts (XP, task count, etc.)

---

## Color & Tokens

**Settled** — Visual Language design session, 2026-06-02.

**Palette: Terracotta & Teal.** A warm burnt-orange primary paired
with a muted sage-teal accent — earthy warmth balanced by a calm
complement. Deliberately two distinct hues rather than a single-hue
scale.

Theming is cascade-based via CSS custom properties defined in
`packages/ui/src/styles.css`. No JavaScript overhead. Plugins consume
semantic tokens only — never raw oklch values.

### Core tokens — light mode

| Token                    | Value                   | Role                                                                   |
| ------------------------ | ----------------------- | ---------------------------------------------------------------------- |
| `--background`           | `oklch(0.985 0.008 75)` | Page background — warm off-white                                       |
| `--foreground`           | `oklch(0.18 0.04 50)`   | Primary text                                                           |
| `--primary`              | `oklch(0.57 0.14 35)`   | Terracotta — main actions, active states                               |
| `--primary-foreground`   | `oklch(0.99 0 0)`       | Text on primary                                                        |
| `--secondary`            | `oklch(0.93 0.022 72)`  | Inset / structural surfaces — sidebar, grouped rows, settings sections |
| `--secondary-foreground` | `oklch(0.28 0.05 50)`   | Text on secondary                                                      |
| `--muted`                | `oklch(0.93 0.016 72)`  | Subtle backgrounds                                                     |
| `--muted-foreground`     | `oklch(0.52 0.04 58)`   | Subdued labels, timestamps                                             |
| `--accent`               | `oklch(0.47 0.07 185)`  | Muted sage-teal — module identity only (see Accent scope below)        |
| `--accent-foreground`    | `oklch(0.99 0 0)`       | Text on accent                                                         |
| `--border` / `--input`   | `oklch(0.88 0.022 75)`  | Borders and input outlines                                             |
| `--ring`                 | `oklch(0.57 0.14 35)`   | Focus ring (matches primary)                                           |

### Surface elevation

**Settled** — Family Feed visual language session, 2026-06-11.

The original token set had no depth layer — `--secondary` (oklch 0.93) on
`--background` (oklch 0.985) read as nearly flat, which made every surface
look like the same beige. Elevation now carries surface hierarchy:

| Token               | Light                   | Dark                   | Role                                     |
| ------------------- | ----------------------- | ---------------------- | ---------------------------------------- |
| `--card`            | `oklch(0.999 0.004 80)` | `oklch(0.21 0.022 47)` | Content cards — lifts _above_ background |
| `--card-foreground` | `var(--foreground)`     | `var(--foreground)`    | Text on cards                            |
| `--shadow-card`     | warm-tinted, subtle     | deep black, subtle     | Resting cards, widget slots              |
| `--shadow-raised`   | warm-tinted, pronounced | deep black, pronounced | Compose forms, overlays, pickers         |

Rules:

- Light-mode shadows are **warm-tinted** (`oklch(0.35 0.06 50 / …)`), never
  neutral gray — gray shadows go cold against the warm palette
- `--card` is _lighter_ than `--background` in light mode (lift toward white);
  in dark mode it is lighter than the clay background by ~0.06 L
- `--secondary` remains for inset/structural surfaces (sidebar, grouped
  settings rows); content that "sits on the table" uses `--card` + shadow
- Never hardcode `box-shadow` values — use the two shadow tokens
- `WidgetSlot` renders `--card` + `--shadow-card`; widgets get elevation
  for free and must not add their own card chrome at the slot level

Where each level applies:

| Level             | Surfaces                                                                                                              |
| ----------------- | --------------------------------------------------------------------------------------------------------------------- |
| `--shadow-card`   | Live widget slots, feed post cards, settings sections — content at rest                                               |
| `--shadow-raised` | Compose forms, notification tray, drawers, dialogs, toasts, profile picker, onboarding card — surfaces above the page |
| No shadow (flat)  | Sidebar, nav, inset rows, placeholder slots, error slots — structural chrome is never elevated                        |

### Member identity palette

**Settled** — see ADR 030. Helpers: `getIdentityHue`, `identityToken`,
`identityColor` from `@family-os/ui`.

Six fixed hues harmonized with Terracotta & Teal. Every family member maps
to one hue and keeps it **everywhere** — avatar fill, feed post spine,
calendar chips, chore assignments. Three layers per hue, light + dark aware:

| Layer | Token pattern           | Use                                |
| ----- | ----------------------- | ---------------------------------- |
| base  | `--identity-{hue}`      | Spines, rings, markers, indicators |
| tint  | `--identity-{hue}-tint` | Avatar fill, soft backgrounds      |
| ink   | `--identity-{hue}-ink`  | Initials/text on tint              |

Hues: `terracotta` · `marigold` · `sage` · `teal` · `sky` · `plum`

Assignment is currently a name hash (collisions possible); explicit
per-profile assignment is the planned evolution (ADR 030). Components
accept an explicit hue (`ProfileAvatar identity` prop) so the upgrade is
non-breaking. Plugins must never invent member colors outside this palette.

### Semantic status tokens — light mode

Each token has a paired `-foreground`. `--destructive` is a CSS alias
for `--error` so shadcn components keep working without a separate
value to maintain.

| Token                      | Value                     | Role                                                      |
| -------------------------- | ------------------------- | --------------------------------------------------------- |
| `--info`                   | `oklch(0.45 0.09 200)`    | Informational banners and badges                          |
| `--success`                | `oklch(0.44 0.10 148)`    | Completion, confirmed states                              |
| `--warning`                | `oklch(0.69 0.12 78)`     | Attention needed, soft alerts                             |
| `--error`                  | `oklch(0.50 0.17 12)`     | Failures, validation errors                               |
| `--destructive`            | `var(--error)`            | shadcn alias — do not use directly in new code            |
| `--destructive-foreground` | `var(--error-foreground)` | shadcn alias (paired) — text/icon on destructive surfaces |

### Dark mode

Triggered by `prefers-color-scheme: dark` — no JavaScript required,
cascade-based. The dark background is a **warm clay** (`oklch(0.15 0.022 45)`)
rather than the cold blue-black common in most apps. Primaries lighten
to maintain contrast against dark surfaces.

| Token                  | Light                   | Dark                   |
| ---------------------- | ----------------------- | ---------------------- |
| `--background`         | `oklch(0.985 0.008 75)` | `oklch(0.15 0.022 45)` |
| `--foreground`         | `oklch(0.18 0.04 50)`   | `oklch(0.92 0.012 75)` |
| `--primary`            | `oklch(0.57 0.14 35)`   | `oklch(0.66 0.14 35)`  |
| `--accent`             | `oklch(0.47 0.07 185)`  | `oklch(0.56 0.08 185)` |
| `--secondary`          | `oklch(0.93 0.022 72)`  | `oklch(0.22 0.020 48)` |
| `--muted`              | `oklch(0.93 0.016 72)`  | `oklch(0.20 0.016 48)` |
| `--muted-foreground`   | `oklch(0.52 0.04 58)`   | `oklch(0.56 0.022 60)` |
| `--border` / `--input` | `oklch(0.88 0.022 75)`  | `oklch(0.30 0.022 48)` |
| `--error`              | `oklch(0.50 0.17 12)`   | `oklch(0.62 0.17 12)`  |

A manual dark mode toggle is available to all tiers in display preferences.
The preference is stored per-profile and overrides `prefers-color-scheme` on
load. The family pseudo-profile always follows `prefers-color-scheme`.
Implemented in the M1 home-surface story.

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

Mobile surface layout is settled — see [Mobile Surface](#mobile-surface) and ADR 033.
TV and Pi room display layouts are deferred to their respective design sessions. See `docs/sessions/queue.md`.

---

## Role-Aware Rendering

**Settled** — see ADR 013 (state management) and ADR 015
(permission layer).

### Model

Tier defines the baseline permission set. Individual permissions
can be granted above or revoked below that baseline by a parent.
All capability checks operate on the _effective_ permission set.

```
effective permissions = tier_baseline ∪ granted − revoked
```

### Hooks

```ts
// Primary hook — full user object including tier
const { user } = useAuth()

// Tier level only
const { tier } = useTier() // 1 | 2 | 3 | 4

// Effective permissions — tier baseline + grants − revocations
const { can } = usePermissions()
can('create', 'chores.Task') // → boolean
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
<PermissionGate action="create" subject="chores.Task">
  <NewTaskButton />
</PermissionGate>

// Both support a fallback
<PermissionGate action="create" subject="finance.Transaction" fallback={<LockedState />}>
  <SpendingControls />
</PermissionGate>
```

`min` is always a numeric level (1–4), never a display name string.
Permission strings follow `module.noun.verb` convention.

### Tier rendering intent

| Tier       | General intent                                                                |
| ---------- | ----------------------------------------------------------------------------- |
| 1          | Simplified vocabulary, large targets, no financial data, task completion only |
| 2          | Earning progress visible, full task detail, no management UI                  |
| 3          | Family schedule visible, can propose/create tasks, light management UI        |
| 4 (parent) | Full management, approval queues, all financial data, system settings         |

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

| Trigger                        | Behavior                                                                                                                |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| **Corner chip** (shell header) | Always visible. Shows current active profile (avatar + name). Tap opens profile grid overlay.                           |
| **Inactivity timeout**         | Deactivates personal profile, returns to family dashboard. Next interaction uses family dashboard or switches via chip. |

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

### Sidebar surface

**Settled** — shell-chrome-interaction-states design session, 2026-06-13.

The sidebar renders on `--secondary`. No `border-r` separator between sidebar and main
content — the lightness delta (`--secondary` 0.93 L vs. `--background` 0.985 L in light
mode; 0.22 vs. 0.15 in dark mode) creates the seam naturally. This applies the "depth,
not lines, creates hierarchy" principle to the nav rail as much as to content cards.

No internal hairlines within the sidebar. Vertical spacing groups the profile chip, nav
items, notification bell, and settings entry.

### Interaction states

**Settled** — ADR 031, shell-chrome-interaction-states design session, 2026-06-13.

`--primary` owns "active" across the entire app. `--accent` is locked to module identity
and must never appear on navigation state (active, hover, selected).

#### Accent scope

`--accent` (sage-teal) is reserved for module identity surfaces only:

- Widget identity headers (icon + `text-section-label`)
- Feed day markers
- `section-label` when naming a module surface
- Notification badge for success/info severity

#### Nav state classes

| State              | Classes                                     | Notes                                        |
| ------------------ | ------------------------------------------- | -------------------------------------------- |
| Active nav item    | `bg-primary/20 text-primary font-medium`    | "You are here" — warm terracotta tint + text |
| Nav hover          | `hover:bg-primary/10 hover:text-foreground` | Directional hint toward active               |
| Profile chip hover | `hover:bg-primary/10`                       | Matches nav hover                            |
| Profile chip open  | `bg-primary/15`                             | Expanded / profile grid open                 |

The active profile avatar uses a `--primary` ring (ADR 030). Ring (circular, avatar-level)
and fill (rectangular, item-level) are visually distinct shapes of the same
"primary = selected" signal — no conflict.

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
| ---------- | --- | --- | ----------- |
| `compact`  | 1   | 1   | 253×180px   |
| `standard` | 2   | 1   | 522×180px   |
| `tall`     | 1   | 2   | 253×376px   |
| `large`    | 2   | 2   | 522×376px   |
| `banner`   | 4   | 1   | 1060×180px  |
| `full`     | 4   | 4   | 1060×760px  |

### Widget registration

Plugins declare widgets in `manifest.json`. See ADR 022 for the full field spec.
Key fields:

```json
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
```

### Widget identity header

**Settled** — Family Feed visual language session, 2026-06-11.

Every content widget opens with an identity header so the module is legible
at a glance (the tablet is often viewed across a room, and an unlabeled
widget is anonymous):

```
[icon 13px, --accent]  MODULE NAME        ← text-section-label, --accent
```

- Lucide icon representing the module, 13px, `--accent`
- Label: `text-section-label` in `--accent` (the sanctioned accent use of
  section-label — see Typography usage notes)
- Placeholder cards and error cards are exempt (they carry their own anatomy and
  do not label an active module surface)

### Identity in widget slots

**Settled** — widget-slot-states design session, 2026-06-13.

"People are color" (ADR 030) must hold in widget slots, not just on full-page views.
In the feed widget, each post row carries a **4px left spine** in the author's identity
hue (`--identity-{hue}`), with `border-radius: 2px`, using a `position: relative`
container wrapper (not a card border — no card chrome in widget context).

**General rule for all content widgets:** when a widget row is authored by or
assigned to a specific family member, it expresses that member's identity hue as
a left spine on the row. The spine is always `4px wide`, `border-radius: 2px`.
Chores widget: assignee hue on each task row. Calendar widget: organizer/assignee
hue on each event row. The spine does not appear on unassigned or multi-person items.

`FeedPostCard` ships three variants:

| Variant  | Chrome                                                      | Identity       | Use                                   |
| -------- | ----------------------------------------------------------- | -------------- | ------------------------------------- |
| `note`   | `--card` bg + border + `--shadow-card` + `overflow: hidden` | 4px left spine | Feed page — standalone elevated cards |
| `widget` | None                                                        | 4px left spine | Feed widget — dense list rows         |
| `plain`  | None                                                        | None           | Surfaces that manage their own chrome |

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

| Tier | Own layout | Others' layouts   |
| ---- | ---------- | ----------------- |
| 1–2  | No         | No                |
| 3    | Yes        | No                |
| 4    | Yes        | Any family member |

New users seeded with a tier-appropriate default layout from platform config.
See [Home Surface](#home-surface) for the actual default layout definitions (ADR 028).
Layout is not auto-rearranged on tier changes — a parent edits it intentionally.

---

## Home Surface

**Settled** — see ADR 028. Implementation is M1.

The home surface is the primary view when the shell loads. It renders the widget grid
per the Widget Composition System. This section defines the default layout seeded for
new users and the reserved slot behavior for core modules.

### Default layouts

Three tier-appropriate default layouts are seeded from platform config. All slot
dimensions reference the 1280×800 viewport; widget components use CSS container
queries to adapt to their actual rendered size.

**Family pseudo-profile** (unattended tablet — shared family display):

```
┌─────────────────────────────────────────────┐
│           Family Feed        [banner 4×1]   │
├──────────────────────┬──────────────────────┤
│  Chores  [standard]  │  Calendar [standard] │
└──────────────────────┴──────────────────────┘
```

| `widgetId`             | x   | y   | w   | h   |
| ---------------------- | --- | --- | --- | --- |
| `family-feed.feed`     | 0   | 0   | 4   | 1   |
| `chores.today-summary` | 0   | 1   | 2   | 1   |
| `calendar.today`       | 2   | 1   | 2   | 1   |

**Tiers 1–2** (child profiles — chores-first):

```
┌──────────────────┬───────────────────────────┐
│                  │  Family Feed  [standard]  │
│  Chores  [large] ├───────────────────────────┤
│                  │  Calendar     [standard]  │
└──────────────────┴───────────────────────────┘
```

| `widgetId`             | x   | y   | w   | h   |
| ---------------------- | --- | --- | --- | --- |
| `chores.today-summary` | 0   | 0   | 2   | 2   |
| `family-feed.feed`     | 2   | 0   | 2   | 1   |
| `calendar.today`       | 2   | 1   | 2   | 1   |

**Tiers 3–4** (parent/teen profiles — calendar-first):

```
┌──────────────────┬───────────────────────────┐
│                  │  Family Feed  [standard]  │
│ Calendar [large] ├───────────────────────────┤
│                  │  Chores       [standard]  │
└──────────────────┴───────────────────────────┘
```

| `widgetId`             | x   | y   | w   | h   |
| ---------------------- | --- | --- | --- | --- |
| `calendar.today`       | 0   | 0   | 2   | 2   |
| `family-feed.feed`     | 2   | 0   | 2   | 1   |
| `chores.today-summary` | 2   | 1   | 2   | 1   |

These are initial defaults, expected to be tuned once real content is rendering and
interaction patterns are established post-M1 build-out.

### Core module reservation

Family Feed, Chores, and Calendar are **reserved modules** — they hold positions in
every default layout regardless of whether their plugin is installed. When a reserved
module's plugin is absent from the registry, the slot renders a **placeholder card**
rather than being removed from the grid.

The shell checks plugin registry presence at render time. This is a shell concern —
plugins do not need to handle their own absent state.

### Placeholder state

**Settled** — widget-slot-states design session, 2026-06-13 (visual resolution of the flat/elevated conflict).

A reserved slot whose module is not installed renders in a **flat slot** (`WidgetSlot flat`):

- Slot chrome: none — no `--card` background, no border, no shadow
- Slot shape: `rounded-xl overflow-hidden` (same as live slots — only the elevation is removed)
- Background: transparent (page background shows through)
- Border: SVG `<rect>` dashed outline — `strokeWidth 1.5px`, `strokeDasharray 10 6`,
  `--muted-foreground/30`, `rx` matching the slot corner radius. CSS `border-dashed` is
  not used — SVG provides dash/gap size control that CSS cannot.
- Module icon: Lucide icon representing the module, 20px, `--muted-foreground`, inside a
  `--muted-foreground/10` rounded icon well
- Module name: 13px, medium weight, `--muted-foreground`
- One-line description: 11px, `--muted-foreground/70`
- No install CTA (marketplace pathway is M8)
- No widget identity header (exempt — the placeholder carries its own anatomy)

The flat/elevated contrast between placeholder slots and live widget slots is the primary
state signal: live widgets lift off the page; non-content slots recede into the background.
`PlaceholderCard` (`@family-os/ui`) implements this anatomy.

### Error state (slot level)

**Settled** — widget-slot-states design session, 2026-06-13.

When a widget's error boundary catches or a plugin's remote entry fails to load, the slot
renders an `ErrorCard` in the same `{ w, h }` — also in a **flat slot**:

- Slot chrome: none (same flat treatment as placeholder)
- Background: `--muted`
- Icon: Lucide `AlertTriangle`, 24px, `--muted-foreground`
- Copy: "[Module Name] couldn't load"
- Retry button: ghost variant, `--muted-foreground`, triggers a remount
- Visually calm — no red on the home surface
- No widget identity header (exempt)

Distinguished from the placeholder (not-installed) state by the warning icon and the retry
affordance. Both are flat — the absence of elevation is the shared "non-content" signal.
`ErrorCard` (`@family-os/ui`) implements this anatomy.

### WidgetSlot contract

**Settled** — widget-slot-states design session, 2026-06-13.

`WidgetSlot` accepts a `flat` boolean prop:

| `flat`            | Chrome                                                     | Use                          |
| ----------------- | ---------------------------------------------------------- | ---------------------------- |
| `false` (default) | `bg-card border border-border shadow-[var(--shadow-card)]` | Live widgets                 |
| `true`            | None — shape only (`rounded-xl overflow-hidden`)           | Placeholder and error states |

`WidgetGrid` accepts `flatSlots?: string[]` — a list of widget IDs that should render
flat. The shell passes this when it determines a slot holds a non-content state.

---

## Notification System

**Settled** — see ADR 029. Implementation is M1.

### Delivery model

All notifications flow through `platform.notify()`. Plugins never render
their own toasts, trays, or push payloads. The platform routes each
notification to the appropriate channel based on `priority` and the
active profile's tier.

```typescript
platform.notify({
  title: string,
  body?: string,
  variant: 'success' | 'info' | 'warning' | 'error',
  priority?: 'info' | 'alert',  // default: 'info'
  actions?: Array<{ label: string; href: string }>
})
```

### Toast

- Component: Sonner (shadcn/ui toast primitive)
- Position: bottom-right on tablet
- Max 3 visible simultaneously; additional notifications queue
- Anatomy: icon + title + optional body + optional action link + dismiss button

| Variant   | Auto-dismiss | Notes                        |
| --------- | ------------ | ---------------------------- |
| `success` | 3s           |                              |
| `info`    | 5s           |                              |
| `warning` | 8s           | User-dismissable             |
| `error`   | Persistent   | Must be explicitly dismissed |

All tiers receive toasts for modules they can access.

### Notification tray

A bell icon in the sidebar, between the nav items and the Settings entry.
Tapping it opens a panel that slides in from the right as an overlay —
the main content dims behind it; the layout does not shift.

- **Visible to:** tier 2+ only (tier 1 has no notification history to review)
- **Badge:** unread count pill on the bell icon
- **Badge color:** `max(severity)` across all unread notifications:

| Max unread severity | Badge color                          |
| ------------------- | ------------------------------------ |
| `success` or `info` | `--accent` (teal) — all calm         |
| `warning`           | `--warning` (amber) — attention soon |
| `error` / `alert`   | `--error` (red) — act now            |

Badge color re-evaluates whenever the unread set changes. **Closing** the
tray marks all items as read and resets the badge (not opening — so the
unread visual state is visible while reviewing).

- **Tray panel:** notification list, newest first.
- **History:** last 50 notifications retained per user; older items pruned.

### NotificationItem (Frame B)

Each item in the tray uses the following layout:

```
[icon]  Title text (bold if unread)          2m ago  [×]
        Optional body text (muted, 2-line clamp)
```

- **Left border:** 3px `--accent` (teal) when unread; transparent when read
- **Title weight:** 600 (unread) · 400 (read)
- **Icon opacity:** 1 (unread) · 0.45 (read)
- **Timestamp:** right-aligned on the title row (not below body)
- **Hover × button** (mouse only): `Button variant="ghost" size="icon-sm"`,
  appears on `mouseEnter`, calls `onDelete` — does not affect other profiles

### Per-item delete

Two mechanisms, both call `DELETE /notifications/:id`:

| Surface     | Mechanism                                                                                                                                                                            |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Touch / pen | Swipe left — `@use-gesture/react` with `axis: 'x'`, `pointer: { mouse: false }`. Reveals red backdrop. Auto-dismisses past 100px or on flick (velocity > 0.5). Snaps back otherwise. |
| Mouse       | × button visible on hover (top-right of item)                                                                                                                                        |

### Clear all

"Clear all" text button in the tray header (right side), visible only when
the notification list is non-empty. Calls `DELETE /notifications` (bulk).
Optimistic: list empties immediately in the UI before server confirms.

### Web Push routing

| Tier     | Behavior                                                     |
| -------- | ------------------------------------------------------------ |
| Tier 4   | Web Push on by default for `priority: 'alert'` notifications |
| Tier 3   | Web Push opt-in per profile; `priority: 'alert'` only        |
| Tier 1–2 | No Web Push                                                  |

`priority: 'info'` never triggers Web Push regardless of tier.
Opt-in preference stored as a boolean per profile in platform settings.

---

## Error States

**Settled** — Notification & States design session, 2026-06-04.

### Level 1 — Inline (form / field validation)

- `--error`-colored text below the input field, DM Sans 14px
- Lucide `CircleAlert` (14px) inline-start of the error text
- Input border and ring shift to `--error`
- Never use error color text alone without the icon (accessibility)

### Level 2 — Component (widget / section error boundary)

When a widget's error boundary catches or a plugin's remote entry fails to load,
the slot renders `ErrorCard` in a flat `WidgetSlot`. See [Error state (slot level)](#error-state-slot-level)
in the Home Surface section for the full spec. `ErrorCard` is exported from `@family-os/ui`.

### Level 3 — Page / route error (404, 500)

Centered in the main content area. Not full-screen red.

- Icon: Lucide icon appropriate to the error type, 40px, `--muted-foreground`
- Heading: Lora — "Page not found" / "Something went wrong"
- Body: DM Sans, `--muted-foreground`, one line
- Action: Back button (404) or Retry link (500)

---

## Empty States

**Settled** — Notification & States design session, 2026-06-04.

### Anatomy

All empty states share the same structure:

```
     [Lucide icon — 36px, --muted-foreground, opacity 0.4]

       Nothing scheduled today          ← text-display-lg (Lora), --foreground
     Your calendar is clear.            ← text-body (DM Sans), --muted-foreground
                                          optional, max 2 lines

         [ + Add Event ]                ← PermissionGate-wrapped
                                          omitted entirely if can() = false
```

**Icon:** 36px, `color: var(--muted-foreground)`, `opacity: 0.4`. The reduced opacity reads as "absence" without adding visual weight.

**Heading:** `text-display-lg` (Lora, 29px). Empty state headings are the primary signal — they deserve the display weight.

**Body:** `text-body` (DM Sans, 18px), `--muted-foreground`. Single sentence max; matches widget viewing-distance minimum.

### Copy tone

| Tier | Tone                | Example (no chores)            |
| ---- | ------------------- | ------------------------------ |
| 1    | Warm, encouraging   | "All done!" / "Nothing today!" |
| 2+   | Neutral, functional | "No tasks scheduled"           |

Modules write two copy variants — one for tier 1, one for tier 2+.
The CTA is always wrapped in `PermissionGate` — if the profile cannot
create, the button is absent entirely (no locked/disabled state).

### Compact variant — widget slots

Inside 1-row widget slots (~180px) the full anatomy doesn't fit. Widgets
use a compact variant: heading drops to `card-title` (DM Sans), body to
`sm`, icon omitted. The CTA rule is unchanged (PermissionGate-wrapped or
absent).

### Rules

- Empty states are informational, never apologetic
- The icon must represent the module/category — not a generic empty box
- No animated illustrations in M1

---

## Motion & Animation

**Settled** — Notification & States design session, 2026-06-04.

### Principle

Motion should orient, confirm, or communicate — never decorate. If
removing an animation would not confuse the user, it should not be there.

`prefers-reduced-motion: reduce` disables all transitions and animations.
This is non-negotiable — every animated property must be wrapped in a
`@media (prefers-reduced-motion: no-preference)` guard or equivalent.

### Duration tokens

```css
--duration-fast: 100ms; /* micro-interactions: button press, toggle */
--duration-normal: 200ms; /* standard transitions: toast, fade, badge */
--duration-slow: 300ms; /* larger surfaces: tray panel, profile overlay */
```

### Easing tokens

```css
--ease-out: cubic-bezier(0, 0, 0.2, 1); /* elements appearing */
--ease-in: cubic-bezier(0.4, 0, 1, 1); /* elements leaving */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1); /* position/size transforms */
```

### Transition patterns

| Pattern                      | Duration            | Easing          | Notes                               |
| ---------------------------- | ------------------- | --------------- | ----------------------------------- |
| Button press                 | `--duration-fast`   | `--ease-out`    | Scale 0.97, color unchanged         |
| Toggle / checkbox            | `--duration-fast`   | `--ease-out`    | Color/fill only                     |
| Toast appear                 | `--duration-normal` | `--ease-out`    | Slide up + fade in                  |
| Toast dismiss                | `--duration-fast`   | `--ease-in`     | Fade out only, no slide             |
| Notification tray open/close | `--duration-slow`   | `--ease-in-out` | Slide in from right                 |
| Profile grid overlay         | `--duration-slow`   | `--ease-out`    | Fade in + backdrop blur             |
| Route transition             | `--duration-normal` | `--ease-in-out` | Fade only, no slide                 |
| Bell badge update            | `--duration-fast`   | `--ease-out`    | Scale pulse 1.0→1.15→1.0            |
| Widget mount (M1)            | None                | —               | No animation on initial grid render |

### Prohibition list — M1

- No page slide animations (applies to both tablet and mobile — see Mobile Surface section)
- No spring physics
- No stagger animations on list items
- No entrance animations on initial widget grid render
- No parallax or decorative movement

Plugins must use the duration and easing tokens above — never hardcode
timing values.

---

## Plugin Design Contract

**Settled** — see ADR 014.

```ts
// Plugins import from shared platform packages only
import { Button, Card, TierGate, PermissionGate } from '@family-os/ui'
import { useAuth, useTier, usePermissions } from '@family-os/platform'
```

Plugins must not:

- Import from the shell or other plugins directly
- Hardcode color values — use CSS custom property tokens
- Use media queries for layout — use CSS container queries

**Styling first-party plugins** (monorepo) — **settled by ADR 035.** First-party
plugins are authored **utility-first, exactly like the shell**. Plugins emit
JavaScript only (no CSS build of their own); the shell owns the single stylesheet
and `@source`-scans `plugins/*/src`, so any `className` utility, `hover:`/`focus:`
variant, or container query used in a plugin emits CSS. **No per-plugin CSS setup
is required** — a plugin does not import `tailwindcss` or `styles.css`.

```tsx
// Plugin component — same authoring model as the shell
<div className="grid place-items-center bg-primary hover:bg-primary/10 rounded-lg">
```

Colors and fonts still flow through **tokens** (`bg-primary`, `var(--primary)`,
`var(--font-display)`) — utilities resolve to tokens, and inline `var(--token)` is
fine for one-off values. Hardcoded hex/px color and font values stay banned.

> The shell `@source` and the Storybook `@source`
> (`packages/ui/.storybook/preview-styles.css`) must point at the same plugin glob
> — a divergence reintroduces "works in Storybook, breaks in the shell." Both carry
> a sync comment.

**Community / third-party plugins** (future): CSS custom-property tokens are
inherited from the shell's `:root` at runtime, so `var(--primary)` etc. work with
no import. But a third-party plugin distributed as a pre-built remote is **not** in
the shell's build tree, so its utility classes would not be scanned. That
distribution model isn't supported yet; when it is, the recommended path is a
**per-plugin Tailwind build** (ADR 035, Option 2) shipping the plugin's own
utilities-only CSS with the remote. Until then, community plugins should use
`var(--token)` inline styles or their own CSS rather than scanned utilities.

The `@family-os/ui` surface starts minimal and grows deliberately.
Every export is a commitment plugins can depend on.

---

## Mobile Surface

**Settled** — design-mobile-surface session, 2026-06-14. See ADR 033.

### Breakpoint

`md:` (768px) is the canonical tablet/mobile split. Below this threshold the sidebar is hidden and the bottom tab bar appears. This is a settled shell convention — all responsive work keys off this breakpoint.

### Nav pattern — bottom tab bar

4 module tabs (Home, Feed, Chores, Calendar) + profile avatar as the rightmost (5th) tab. Always visible, thumb-friendly, 1 tap to any primary destination.

```
┌─────────────────────────────────────┐
│         [page content]              │
│                                     │
├──────┬──────┬──────┬──────┬────────┤
│ Home │ Feed │Chores│ Cal  │ Avatar │
└──────┴──────┴──────┴──────┴────────┘
```

- **Tab height:** 56px minimum touch target
- **Active tab:** icon + label in `--primary`
- **Inactive tab:** icon + label in `--muted-foreground`
- **Tier filtering:** all M1 core tabs have `minTier: 1` — every profile sees the same 4 tabs. Future tier-gated modules are filtered at the tab level using the same `minTier` convention as the sidebar.
- **Overflow:** deferred to M8+ (marketplace). When installed modules exceed 4 a "More" tab and tab-pinning UI will be required — separate design session.

### Profile chip on mobile

The profile avatar is the rightmost tab. Tapping it opens the `ProfileGrid` overlay, anchored above the tab bar. No top header bar on mobile — the `MobileTopBar` carries the page title and bell instead.

### Notification bell on mobile

**Settled** — dev-mobile-surface session, 2026-06-14. **Option A: bell in the mobile top bar.**

A minimal top bar (`min-h-[48px]`) renders on mobile only (`flex md:hidden`) with the current page title on the left and the `NotificationBell` on the right. The bell badge (unread count + severity) stays in peripheral vision on every page — same tier-2+ gate as the sidebar bell. The top bar disappears on tablet; the sidebar bell takes over.

Why Option A over Option B (bell in profile sheet): the badge is the primary value of the notification bell — it delivers ambient awareness. Hiding it behind 2 taps defeats that.

### Widget grid on mobile

Widgets reflow to a **single-column stack** — full viewport width, ordered by tier-default priority. No carousel. Widget components use CSS container queries to adapt to their full-width rendered size; no mobile-specific widget code needed.

### Safe-area insets

The bottom tab bar applies `padding-bottom: env(safe-area-inset-bottom)` to clear the iPhone home indicator. All mobile layout primitives must use safe-area insets — never assume the bottom of the viewport is usable.

```css
/* Bottom tab bar */
padding-bottom: env(safe-area-inset-bottom);

/* Page content — avoid tab bar overlap */
padding-bottom: calc(56px + env(safe-area-inset-bottom));
```

### Page transitions on mobile

**Settled** — dev-mobile-surface session, 2026-06-14. **No slide animations — same rule as tablet.**

The M1 prohibition list (no page slide animations) extends to mobile. Tab-to-tab transitions use the same cross-fade (`--duration-normal`, `--ease-in-out`) as all other route changes. Reasoning: slide transitions add cognitive overhead on a shared family device and require careful direction logic (back vs. forward) that isn't worth the complexity at M1. Reconsider if user testing shows disorientation navigating between tabs.

---

## Reward / XP — the "gold" semantic

**Settled** — M2 Design: Chores (2026-06-15).

XP (and reward/treasure cues generally) use a dedicated **gold** treatment built
on the marigold/`--warning` hue family (≈ hue 78), kept well clear of error-red
(hue 12) so a reward never reads as an alarm.

| Layer     | Value (light)          | Use                              |
| --------- | ---------------------- | -------------------------------- |
| gold      | `oklch(0.74 0.13 80)`  | coin gradient mid, chip borders  |
| gold-hi   | `oklch(0.88 0.09 86)`  | coin highlight (top-left)        |
| gold-deep | `oklch(0.55 0.12 66)`  | gold numerals / deep edge        |
| gold-tint | `oklch(0.95 0.045 86)` | soft gold chip / pill background |
| gold-ink  | `oklch(0.45 0.1 70)`   | gold text on tint                |

> Currently inline constants in the chores surfaces; promote to `--reward-*`
> tokens (light + dark) when a second module needs them.

**Rules:**

- **Gold is reserved for XP/reward only.** Status never uses gold; XP never uses
  red/green.
- **XP numerals are DM Sans** (`text-metric`), not Lora — the gold treatment
  carries the warmth, the type scale stays compliant.
- The **lifetime total** reads as a minted "score plate" (coin + numeral +
  `XP / TOTAL`); **daily earned** is a lighter momentum stat (TrendingUp icon,
  gold-ink text) — distinct in weight/icon so the two don't read at one level.

## Status vs identity colour

**Settled** — M2 Design: Chores (2026-06-15).

When a surface shows **one person's own items**, the identity hue carries no
information (everything is that person) — so **colour encodes status**, not
identity: neutral default, **red only for overdue**, green for done. Flooding
such a surface with the owner's identity tint is both meaningless and a false
alarm (e.g. a terracotta owner makes every row read red-ish).

When a surface shows **multiple people** (admin / family / cross-member views),
the identity hue **does** carry meaning — use it for per-person lanes, dots, and
avatars.

> Corollary: **red is reserved for overdue/error**, never identity. The
> terracotta identity hue ≠ the error red.

## To Be Defined

| Item                   | Deferred to        |
| ---------------------- | ------------------ |
| TV ambient layout      | M4+ design session |
| Pi room display layout | M4+ design session |
