# ADR 031 — Interaction State Language

**Status** — Decided (2026-06-13, shell-chrome-interaction-states design session) ·
**Amended** (2026-07-11, sidebar-refresh session)

## Decision

`--primary` owns "active" across the app; `--accent` is locked to module identity. This binds
every plugin's nav and interactive-state treatment.

- **Active state** — a nav item, tab or shell control at the user's current location or
  selection: `bg-primary/10 text-primary font-medium`. Never `--accent`, anywhere.
- **Hover state** — nav items and chip controls take one step, `hover:bg-secondary/70`.
- **Profile chip open** (grid visible) — lifts to `--shadow-raised`, signalling "panel open"
  without claiming a selected destination.
- **Sidebar surface** — `--background`, with hairline separators; see the Amendment.
- **Accent scope** — `--accent` (sage-teal) is reserved for module identity: widget identity
  headers (icon + `text-section-label`), feed day markers, `section-label` on a module
  surface, and the notification badge (success/info). It **must not appear on nav state.**

The first four clauses were amended 2026-07-11; their original values are in the Amendment.
The core principle is unchanged.

## Why

Four problems existed simultaneously in `Sidebar.tsx`:

1. **Surface mismatch** — the sidebar used `bg-background` with only a `border-r` between it
   and content. The design doc said `--secondary`; the code said `--background`.
2. **Accent overload** — active nav used `bg-accent text-accent-foreground`, but `--accent`
   already meant module identity (widget headers, feed day markers, section-labels,
   notification badges). Two semantics in one token is a maintenance trap.
3. **Two competing "active" cues** — a `--primary` ring on the active profile avatar against
   an `--accent` fill on the active nav item. The token table already gave `--primary` the
   active states; the nav wasn't following it.
4. **Inconsistent hover** — chip hover `bg-muted`, chip open and nav hover `bg-secondary`:
   two near-identical tokens used interchangeably with no semantic distinction.

Unifying on `--primary/N` for all nav state gives a directional signal — the closer to full
primary, the more "selected". The avatar ring (circular) and the nav fill (rectangular) are
distinct shapes of one token, so they do not conflict at any viewing distance. Eliminating
hairlines inside the sidebar followed the principle that depth, not lines, creates hierarchy.

## Amendment (2026-07-11) — the sidebar sheds its coloured wall

**Why now.** ADR 039's elevation ladder made the home widgets float as `--card`+shadow
surfaces on `--background`. Against that canvas the `--secondary` sidebar became a
full-height _coloured wall_ — a second content surface competing for attention rather than
recessive chrome. Dropping it lets the rail recede and the cards own the page, but not
seamlessly: a live review found the bare rail too dissolved, so the "Hairline Rail" fallback
was adopted during the session.

- **Sidebar surface** — **`--background`** (was `--secondary`), no coloured fill. A
  **`border-r border-border/60`** hairline restores the rail↔content seam the `--secondary`
  lightness delta used to provide, and an inset **`border-t border-border/60`** separates the
  bottom utility group (bell + settings) from the nav. Group and divider render **only when
  populated** (tier 2+), so the family pseudo-profile gets no stray rule.
- **Responsive fold** — below `xl` (<1280px) the rail is a slim **`w-sidebar-rail`** (96px)
  label-under-icon band at **`text-xs-body`** (11px); at `xl`+ it is **`w-sidebar`** (220px)
  label-beside at **`text-sm`** (14px). The item flex flips `col`→`row` so icons hold
  position and labels swing from under to beside. The nav scrolls internally so the pinned
  utility group survives short viewports and long nav lists. (Font-size lives on the label
  _span_, never beside a `text-align` class — tailwind-merge silently drops non-standard
  tokens like `text-xs-body` there.)
- **Profile chip** — **elevated** into a `--card` chip (`border` + `--shadow-card`, lifting
  to `--shadow-raised` on hover/open) so it reads as a header control, not a fourth nav item,
  joining the ADR-039 ladder. **Avatar-only** below `xl`. Its switch menu is a dropdown below
  the chip (`top-full`), edge-aligned at `xl`, a `w-64` overhang in the slim rail. (Was:
  `bg-primary/15` when open.)
- **Active state fill** — softened to **`bg-primary/10`** from `/20`. On the lighter
  `--background` plane `/10` carries "you are here"; `/20` read heavy once the wall was gone.
- **Hover state** — **`hover:bg-secondary/70`**, from `hover:bg-primary/10`. The retired
  `--secondary` surface becomes the transient hover wash: a neutral step clearly distinct
  from the now primary-tinted active state, which a `primary/10` hover would have collided
  with.

**Do not revisit unless** the hairline rail still lacks definition on ultrawide displays — a
heavier divider or faint surface tint is the lever, **not** restoring the `--secondary` wall
this amendment exists to remove.

## Alternatives considered

- **A left bar indicator for active** — a 3px `--primary` inset bar reads cleanly on desktop,
  but is harder to implement inside `mx-1 rounded-md` without absolute positioning, and the
  fill is more legible at tablet viewing distance.
- **Keep `--accent` for nav active** — accent already has four module-identity uses; a fifth
  semantic fractures the token.
- **`--muted` / `--secondary` hover** — near-identical in value (≈0.93 L both, light mode);
  one token was more legible and semantically consistent.

## Do not revisit unless

A plugin introduces a secondary nav level (plugin-internal tabs or sub-nav) where one active
token is ambiguous between shell and plugin nav. The resolution is a scoped active token for
plugin nav, not reopening the shell decision.
