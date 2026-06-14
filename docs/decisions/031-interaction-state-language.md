# ADR 031 — Interaction State Language

**Status** — Decided (2026-06-13, shell-chrome-interaction-states design session)

## Decision

`--primary` owns "active" across the entire app. `--accent` is locked to module identity. This is a system-wide constraint that binds every plugin's nav and interactive-state treatment.

### Active state

A nav item, tab, or shell control representing the user's current location or selection:

- **Fill**: `bg-primary/20 text-primary font-medium`
- Never `--accent` for active state anywhere in the app

### Hover state

All nav items and chip-style controls use one hover step:

- `hover:bg-primary/10 hover:text-foreground`
- Applies to the profile chip (hover), nav items (hover), and any future nav-style control

### Profile chip expanded

When the profile chip is open (profile grid visible):

- `bg-primary/15` — between hover and active density; signals "panel open" without claiming a selected destination

### Sidebar surface

The sidebar renders on `--secondary`. No `border-r` separator between sidebar and main content area — the lightness delta (`--secondary` at 0.93 L vs. `--background` at 0.985 L in light mode) creates the seam. No internal hairlines.

### Accent scope

`--accent` (sage-teal) is reserved for module identity:

- Widget identity headers (icon + `text-section-label`)
- Feed day markers
- `section-label` when labeling a module surface
- Notification badge (success/info severity)

`--accent` must not appear on navigation state.

## Why

Four problems existed simultaneously in `Sidebar.tsx`:

1. **Surface mismatch** — the sidebar used `bg-background` (same as the content area); only a `border-r` separated them. The design doc said `--secondary`; the code said `--background`. Fixed.
2. **Accent overload** — active nav used `bg-accent text-accent-foreground`, but `--accent` already meant module identity (widget headers, feed day markers, section-labels, notification badges). Two semantics from one token is a maintenance trap.
3. **Two competing "active" cues** — `--primary` ring on the active profile avatar vs. `--accent` fill on the active nav item. The token table already assigned `--primary` to "active states" — the nav just wasn't following it.
4. **Inconsistent hover** — chip hover was `bg-muted`, chip open was `bg-secondary`, nav hover was `bg-secondary`. Two nearly-identical tokens used interchangeably across the same column with no semantic distinction.

Unifying on `--primary/N` for all nav state gives a directional signal: the closer to full primary, the more "selected" the element. The avatar ring (circular, avatar-shaped) and the nav fill (rectangular, item-level) are visually distinct shapes of the same token — no conflict at any viewing distance.

Eliminating hairlines inside the sidebar is consistent with the "depth, not lines, creates hierarchy" principle already applied everywhere else.

## Alternatives considered

- **Left bar indicator for active** — a 3px `--primary` inset bar on the active item. Reads cleanly on desktop; harder to implement inside `mx-1 rounded-md` without absolute positioning, and the fill approach is more legible at tablet viewing distance.
- **Keep `--accent` for nav active** — rejected: accent is already defined as module identity with four existing uses. Allowing a fifth semantic fractures the token's meaning.
- **`--muted` / `--secondary` hover** — already used and near-identical in value (≈0.93 L vs 0.93 L in light mode). Replacing both with `bg-primary/10` is more legible and semantically consistent.

## Do not revisit unless

A plugin introduces a secondary nav level (plugin-internal tabs or sub-nav) where the single active token creates ambiguity between shell nav and plugin-level nav. In that case, a scoped active token for plugin nav is the resolution — not reopening the shell decision.
