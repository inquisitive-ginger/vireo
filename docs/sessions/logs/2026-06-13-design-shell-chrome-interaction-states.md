# Session Log — Design: Shell Chrome & Interaction States

**Date:** 2026-06-13
**Type:** Design
**Branch:** `dev/shell-chrome-interaction-states`
**Origin:** 2026-06-12 visual-language coherence audit (Gaps 1 & 2 of 3)

---

## What was decided

### 1. Sidebar surface plane — `--secondary`

The sidebar renders on `--secondary`, not `--background`. The code bug (`bg-background` on the `<aside>`) is fixed. The lightness delta between `--secondary` (0.93 L) and `--background` (0.985 L) creates the visual seam without a `border-r` hairline. Dark mode also reads clearly (0.22 vs. 0.15 L). The "depth, not lines" principle now applies to the nav rail as it does everywhere else.

No `border-r` between sidebar and content. No internal hairlines (`border-b` under chip, `border-t` before bell and settings). Vertical spacing creates grouping.

### 2. Active state ownership — `--primary`

`--primary` owns "active" across the entire application. Active nav items use `bg-primary/20 text-primary font-medium` — a warm terracotta fill tint that reads clearly at tablet viewing distance.

The active profile avatar already uses a `--primary` ring (ADR 030). Ring (circular, avatar-level) and fill (rectangular, item-level) are distinct shapes of the same signal. No conflict.

### 3. Hover step — one token

One hover token for all nav-style controls: `hover:bg-primary/10 hover:text-foreground`. Applied to both the profile chip and nav items — the muted/secondary split is gone.

Profile chip "open" state uses `bg-primary/15` — between hover and active, signals "panel expanded" without claiming a route.

### 4. Accent scope — locked to module identity

`--accent` is locked to module identity only:

- Widget identity headers
- Feed day markers
- `section-label` when labeling a module surface
- Notification badge (success/info severity)

`--accent` must not appear on navigation state anywhere in the app. This is a system-wide constraint documented in ADR 031.

### 5. Hairlines — eliminated from sidebar

All four hairlines removed: `border-r`, `border-b` under chip, `border-t` before bell, `border-t` before settings. Surface distinction + spacing is sufficient.

---

## What was produced

- `apps/shell/src/components/Sidebar.tsx` — surface fix + state classes + hairline removal
- `docs/design-system.md` — Color & Tokens table updated (`--secondary`, `--accent` roles); Tablet Nav Layout section extended with "Sidebar surface" and "Interaction states" subsections including accent scope and nav state class table
- `docs/decisions/031-interaction-state-language.md` — new ADR: active = `--primary`, accent = module-identity-only, sidebar surface, hover unification
- `packages/ui/src/components/color-tokens.stories.tsx` — `--secondary` and `--accent` role text reconciled with decisions; resolves the mid-flight uncommitted edit from the visual-language session
- `docs/sessions/queue.md` — this session removed from Up Next

---

## Open questions raised

None. All five decisions from the kickoff are settled without ambiguity.

---

## What the next session needs to know

**Next up: M1 Design: widget-slot-states**

The widget-slot-states session can proceed with a clean color contract:

- `--accent` = module identity only (widget headers use it correctly already)
- `--card` + `--shadow-card` = content widgets at rest
- No shadow (flat) = placeholder cards and error cards
- `--muted` = placeholder/error card background

The identity spine question in the feed widget (mentioned in the audit) is within scope of the next session — the spine uses identity tokens, not accent, so there is no conflict with today's decisions.
