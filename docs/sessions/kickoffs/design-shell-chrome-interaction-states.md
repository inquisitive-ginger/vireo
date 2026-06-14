# Kickoff — Design: Shell chrome & interaction-state system

**Type:** Design
**Proposed branch:** `dev/shell-chrome-interaction-states`
**Origin:** 2026-06-12 visual-language coherence audit (Gaps 1 & 2 of 3)

> Driving doc for the session. Follows `docs/sessions/templates/design.md`.
> Created by the audit, not yet run.

## Pre-session checklist

- [ ] Read `CLAUDE.md`
- [ ] Read `docs/vision.md`
- [ ] Read `docs/architecture.md`
- [ ] Read ADR 003 (tier model)
- [ ] Read `docs/design-system.md` — Color & Tokens, Surfaces, Tablet Nav Layout
- [ ] Read ADR 022 (widget/nav layout) and ADR 030 (member identity colors)
- [ ] Read `apps/shell/src/components/Sidebar.tsx` and `packages/ui/src/components/elevation.stories.tsx`

## Session scope

_One sentence:_ Define a single coherent interaction-state language (active / hover /
selected) and settle the sidebar's surface plane, so the navigation chrome reads as a
distinct, calm surface and "active" means one thing across the whole app.

## Surfaces in scope

Tablet (the only M0 surface). The decision must be stated so mobile can inherit it later.

## Constraints coming in

- **ADR 022** — sidebar is 220px, profile chip at top, no top bar. Layout is fixed; this
  session changes surface + state treatment, not structure.
- **Color & Tokens** (design-system.md) — token roles already assign `--primary` =
  "main actions, **active states**"; `--accent` = "highlights, indicators." The
  Surface Elevation section lists the sidebar as flat `--secondary` and states
  "depth, not lines, creates hierarchy."
- **ADR 030** — the active profile avatar already uses a `--primary` ring.
- **Calm by default** principle; hold the Terracotta & Teal palette (no new base hues).
- **Motion & Animation** tokens are fixed — no new motion in this session.

## Findings feeding the session (from the 2026-06-12 audit)

1. **Sidebar surface ≠ doc.** `Sidebar.tsx:12` renders the aside as `bg-background` —
   the _same_ token as the main content area; only a `border-r` separates them. The
   design-system doc and the Elevation story both say the sidebar should be flat
   `--secondary`. The uncommitted edit to `color-tokens.stories.tsx` already pulls
   "sidebar" out of `--secondary`'s role — the intent is mid-flux and must be settled.
2. **Accent is overloaded.** Active nav uses `bg-accent text-accent-foreground`
   (`Sidebar.tsx:170`), but `--accent` already means module identity (widget identity
   headers, feed day markers, `section-label`) and the notification badge. The token
   table says active belongs to `--primary`.
3. **Two "active" colors in one column** — `--primary` ring on the active profile
   avatar vs. `--accent` fill on the active nav item.
4. **Hover is inconsistent.** Profile chip hovers to `bg-muted`, opens to `bg-secondary`
   (`Sidebar.tsx:35`); nav items hover to `bg-secondary` (`Sidebar.tsx:171`). `--muted`
   and `--secondary` are near-identical (~0.93) and faint against a 0.985 sidebar — the
   same gesture uses two tokens and barely reads.
5. **Lines, not depth.** The sidebar is built from four hairlines (`border-b` under the
   chip, two `border-t`, `border-r`) — the lines-for-hierarchy approach the rest of the
   system abandoned.

## Decisions to make

1. **Sidebar surface plane** — `--secondary` inset vs. a distinct elevated rail vs.
   background + one deliberate seam. Must read clearly distinct from content, stay calm,
   and hold in light + dark.
2. **Active state ownership** — which token owns "active" (recommend `--primary`, per the
   table), its shape (fill / ring / left bar), and how it differs from the active-profile
   ring so the column doesn't carry two competing "active" cues.
3. **Hover step** — one token and a defined delta for hover, applied consistently to chip
   and nav; resolve the `--muted` vs. `--secondary` split.
4. **Accent scope** — lock `--accent` to "module identity" and remove it from nav state,
   or explicitly sanction a second use. Update the section-label/accent rule if affected.
5. **Hairlines** — whether the surface decision replaces the internal borders (grouping by
   inset/spacing rather than 1px lines).

For each: confirm it holds at all trust tiers (tier-filtered nav) and reads from across
the room (legible-at-a-glance principle).

## Outputs (required before closing)

- [ ] `docs/design-system.md` — Tablet Nav Layout + Color/Surfaces updated with the state
      language and sidebar plane; **Last updated** bumped
- [ ] New ADR if "active = `--primary`, accent = identity-only" becomes a system-wide
      constraint (it binds every plugin's nav/active treatment)
- [ ] Reconcile `elevation.stories.tsx` and `color-tokens.stories.tsx` `--secondary` role
      text with the decision (and the pending uncommitted edit)
- [ ] `Sidebar.tsx` updated to match, or a dev follow-on noted in the queue
- [ ] Session log `docs/sessions/logs/YYYY-MM-DD-design-shell-chrome-interaction-states.md`
- [ ] `CLAUDE.md` current status updated

## Session log format

```
## What was decided
## What was produced
## Open questions raised
## What the next session needs to know
```
