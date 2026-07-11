# Session Log — Design + Dev: Sidebar Refresh (drop the colored wall)

**Date:** 2026-07-11 · **Type:** design + dev (ad-hoc) · **PR:** #35 (merged)
**Surface:** `apps/shell` sidebar nav + `@family-os/ui` BellBadge

## The problem

Post–elevation-ladder (ADR 039), the home widgets float as `--card`+shadow surfaces
on `--background`. Against that canvas the `--secondary` sidebar read as a **colored
wall** competing for attention rather than receding chrome. A dashboard mockup hinted
at a fresher rail that drops the bg color and adds breathing room.

## What was decided

- **Direction: Quiet Rail** — the rail recedes on `--background`; separation comes from
  the content cards' own elevation, not a colored surface. Chosen from a rendered
  four-direction Storybook exploration (`Platform/Sidebar/Exploration`: Quiet Rail ·
  Hairline Rail · Lifted Marker · Inset Field), shown in context beside a mock dashboard.
- **Responsive fold** — one rail that folds: slim `w-sidebar-rail` (96px)
  **label-under-icon, centered** below `xl`; full `w-sidebar` (220px) **label-beside** at
  `xl`+. Item flex flips `col`→`row` at the breakpoint.
- **Not fully seamless** — a live review found the bare rail too dissolved, so the
  ADR-031 **"Hairline Rail" fallback was adopted**: `border-r` seam + inset `border-t`
  above the utility group. (This is the sanctioned fallback, not a reversal.)
- **Profile chip elevated** — a `--card` chip (border + `--shadow-card` → `--shadow-raised`
  on hover/open), so it reads as a header control, not a fourth nav item. Avatar-only when
  slim. Its switch menu opens as a **floating dropdown below the chip**, edge-aligned to
  the chip at `xl`, fixed `w-64` overhang in the slim rail.
- **Labels** — reduced on collapse: `text-xs-body` (11px) slim / `text-sm` (14px) expanded.
- **"Family Feed" wraps** in the slim rail (accepted); **profile has no label** when slim.

## What was built

- **`Sidebar.tsx`** — seamless `--background` rail + hairlines + responsive fold + elevated
  card chip + repositioned popover. Active `bg-primary/10`, hover `bg-secondary/70`. Nav
  `overflow-y-auto` (min-h-0) so the pinned utility group survives short viewports / long
  nav lists. Utility group (bell + settings) **and its divider** render only at tier 2+
  (no stray rule for the family profile).
- **`bell-badge.tsx`** — new `fold` layout (icon-over-label slim → beside expanded;
  "Alerts"/"Notifications" dual label; corner→inline count).
- **`NotificationBell.tsx`** — threads `fold`.
- **`styles.css`** — `--spacing-sidebar-rail` (96px) token.
- **Docs** — ADR 031 amendment; design-system.md §Tablet Nav Layout, §Sidebar surface,
  nav-state table, elevation table.
- Exploration Storybook playground removed post-approval.

## Gotcha worth remembering

Responsive font-size (`text-xs-body xl:text-sm`) must live on the label **span**, never on
the `<a>` beside a `text-align` class — `cn()`'s tailwind-merge silently drops non-standard
tokens like `text-xs-body` when they sit next to `text-center`/`text-left`. First attempt
put it on the `<a>` and the size never applied (fell back to inherited 16px).

## Verification

Live-reviewed in the real shell (Playwright screenshots) across breakpoints, member vs.
family profiles, short viewports, and the open profile popover. `tsc` + lint clean;
ui + shell tests green (bell-badge 7/7). PR-review fix: stale "no border" surface comment
corrected (8ff120d).

## Open follow-ups

- **Family-wall feed typography** (owed from the elevation-ladder session) still queued —
  needs widget-prominence context. Untouched here.
- Hairline rail edge definition on ultrawide displays is the documented lever if it ever
  needs more (per ADR 031 amendment) — not restoring the colored wall.

## Next session

Unchanged: **M3 Dev — Event Reminders (story 6)**, the last M3 MVP story (resolve the owed
reminder-scheduling ADR first).
