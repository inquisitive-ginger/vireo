# ADR 031 — Interaction State Language

**Status** — Decided (2026-06-13, shell-chrome-interaction-states design session) ·
**Amended** (2026-07-11, sidebar-refresh session — §Sidebar surface, §Active state fill,
§Hover state, + profile chip; see Amendment below)

## Amendment (2026-07-11) — the sidebar sheds its colored wall

The **Sidebar surface**, **Active state fill**, **Hover state**, and profile-chip clauses
below are superseded by this amendment. The core principle is **unchanged**: `--primary`
owns active everywhere; `--accent` stays locked to module identity; no left-bar indicator.
What changed is the sidebar's ground plane.

**Why now.** ADR 039 (elevation ladder) made the home widgets float as `--card`+shadow
surfaces on `--background`. Against that canvas, the `--secondary` sidebar became a
full-height _colored wall_ that read as a second content surface competing for attention,
rather than recessive chrome. Dropping the wall lets the rail recede and the cards own the
page. It went off `--secondary` — but not fully seamless: a live review found the bare
rail too dissolved, so the "Hairline Rail" fallback was adopted during the session (see
below). The rail recedes; hairlines give it just enough edge.

**What changed:**

- **Sidebar surface** — renders on **`--background`** (the content plane), no colored
  fill. A single **`border-r border-border/60`** hairline restores the rail↔content seam
  (the `--secondary` lightness delta no longer provides it), and an inset
  **`border-t border-border/60`** separates the bottom utility group (bell + settings)
  from the nav. The utility group and its divider render **only when populated** (tier 2+);
  the family pseudo-profile gets neither, so no stray rule.
- **Responsive fold** — the rail folds. Below `xl` (<1280px) it is a slim
  **`w-sidebar-rail`** (96px) **label-under-icon** rail, every item centered in the band,
  with labels at **`text-xs-body`** (11px); at `xl`+ it expands to the full **`w-sidebar`**
  (220px) **label-beside** rail at **`text-sm`** (14px). The item flex flips `col`→`row` at
  the breakpoint so icons hold position and labels swing from under to beside. The nav
  scrolls internally (`overflow-y-auto`) so the pinned utility group survives short
  viewports and long nav lists. (Font-size lives on the label _span_, never beside a
  `text-align` class on the same element — tailwind-merge silently drops non-standard
  tokens like `text-xs-body` in that position.)
- **Profile chip** — **elevated** into a `--card` chip (`border` + `--shadow-card`, lifting
  to `--shadow-raised` on hover/open) so it reads as a header control, not a fourth nav
  item — joining the ADR-039 ladder. **Avatar-only** below `xl` (no name/chevron). Its
  profile-switch menu opens as a **floating dropdown just below the chip** (`top-full`),
  **edge-aligned to the chip** at `xl` and a fixed `w-64` overhang in the slim rail.
- **Active state fill** — softened to **`bg-primary/10 text-primary font-medium`** (from
  `/20`). On the lighter `--background` plane `/10` carries "you are here" without
  shouting; `/20` read heavy once the surrounding wall was gone.
- **Hover state** — nav/chip hover becomes **`hover:bg-secondary/70`** (from
  `hover:bg-primary/10`). The retired `--secondary` surface is **reused as the transient
  hover wash** — a neutral step that stays clearly distinct from the now primary-tinted
  active state (a `primary/10` hover would collide with a `primary/10` active). Profile
  chip open lifts to `--shadow-raised`.

**Do not revisit unless** the hairline rail still lacks definition on ultrawide displays
(a heavier divider or a faint surface tint would be the lever) — **not** by restoring the
full `--secondary` colored wall, which is what this amendment exists to remove.

---

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
