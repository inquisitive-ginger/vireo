# Session Log — Platform Architecture: Plugin Styling (inline-vs-Tailwind)

**Date:** 2026-06-18
**Type:** Architecture (ADR) + enabling change + reconciliation
**Branch:** `arch/plugin-styling`
**ADR:** [035 — Plugin Styling: Shell Scans Plugin Source](../../decisions/035-plugin-styling.md)

---

## What was decided

**ADR 035 — first-party plugins are styled utility-first, exactly like the shell.**
The shell's stylesheet gains one Tailwind `@source` directive scanning plugin
source, so utilities used in a plugin emit CSS:

```css
@source "../../../plugins/*/src/**/*.{ts,tsx}";
```

This is **Option 1** of the three the kickoff posed. Rationale:

- **Matches the distribution model we actually have.** Every plugin today is
  first-party and in the monorepo build tree — the standard practice there is a
  single centrally-built stylesheet that scans all first-party source (like a
  Turborepo app scanning `apps/*` + `packages/*`).
- **Removes an inconsistency rather than adding coupling.** Storybook's
  `preview-styles.css` already scanned `plugins/*/src`; the shell did not — so the
  chores completion circles rendered in a story but no-op'd in the real shell. The
  change brings the shell to parity with the Tailwind context that already worked.
- **Lowest churn, fully additive.** One line. Existing inline `var(--token)` keeps
  working; new plugin UI is authored utility-first from day one.

**Third-party / community plugins → deferred Option 2.** Option 1 only styles
plugins in the shell's build tree. When community distribution (pre-built remotes
the shell never compiled) is actually scoped, the **recommended path is a per-plugin
Tailwind build** shipping the plugin's own utilities-only CSS with the remote — a
separate ADR to write then, named in ADR 035 but **not** built now (it'd tax every
first-party plugin today for a use case that doesn't exist yet). Settled with the
user during the session.

**Tokens unchanged.** Colors/fonts still flow through tokens (`bg-primary`,
`var(--token)`); hardcoded values stay banned. Genuinely dynamic values (identity
hues, gold "treasure" gradients, animation rects, `container-type: size`) and
off-scale one-offs remain inline — explicitly fine per ADR 035.

## What was built

**Enabling change**

- `apps/shell/src/styles.css`: added `@source "../../../plugins/*/src/**/*.{ts,tsx}"`
  with a sync comment pointing at the matching Storybook `@source`.

**Reconciliation** (done **in this session** at the user's request — the kickoff had
scoped it as a fast-follow, but the user opted to migrate now). Migrated the
existing plugin components from inline `var(--token)` chrome to Tailwind utilities,
preserving exact visual parity:

- **chore-engine** (9 components): `TaskCard`, `TaskeeView`, `ScorePlate`,
  `FlightChip`, `XpPill`, `AdminBoard`, `CreateTaskDrawer`, `ChoresPage(View)`.
  Static layout/structure/color → utilities; dynamic spine/identity/gold/animation
  values stayed inline. Notably the `ScorePlate` icon's `grid`/`place-items-center`
  — the exact classes that silently no-op'd before — now emit. Updated the
  now-stale "inline is the convention" comments in `TaskCard`.
- **family-feed** (5 components): `FeedPostCard`, `FeedPageView`, `FeedPage`,
  `FeedWidget`, `FeedWidgetView`. Identity spine + asymmetric widget paddings +
  `container-type: size` left inline.
- Out of scope: `demo-plugin` (M0 throwaway demo; still uses hardcoded hex — noted,
  not migrated).

**Docs**

- `CLAUDE.md` Standing Engineering Conventions: the plugin-Tailwind bullet rewritten
  to "plugins styled utility-first, shell `@source`-scans `plugins/*/src`" (ADR 035).
- `design-system.md` Plugin Design Contract: replaced the stale (and never-wired)
  "first-party plugins `@import 'tailwindcss'`" setup with the utility-first
  standard + the deferred community/Option-2 path.

## Verification

- **Enabling change proven end-to-end.** Canary `h-64` (used only in plugin source,
  absent from shell/ui): the shell build emits `.h-64{height:calc(var(--spacing)*64)}`
  **with** the `@source` and **nothing without it** (negative test). The isolated
  build (Storybook) already scanned plugins.
- **Migrated utilities all emit** in the shell build — spot-checked the arbitrary
  ones (`rounded-[14px]`, `shadow-[var(--shadow-card)]`, `min-h-[54px]`,
  `max-w-[680px]`, `duration-[320ms]`, `min-w-[44px]`, `pl-[18px]`, letter-spacing
  `.04em`).
- `typecheck` + `lint` clean across both plugins + shell; both plugin remotes build
  (JS-only, no CSS asset — confirming they depend on the shell's stylesheet).
- **Live review:** user confirmed visual parity on `/chores` (taskee + admin) and
  `/family-feed` in the real shell — "looks good" (2026-06-18). No regressions.
- Tests: no API change (149 API tests not rerun — backend untouched). The
  `chores-completion` E2E selectors are decoupled from the styling (button
  aria-label + `✓ +10 XP` text, both unchanged) and the live review already
  exercised the restyled components + the XP flight; E2E not rerun.

## Open questions / what the next session needs to know

- **Community-plugin styling (Option 2) is owed** when third-party distribution is
  scoped — per-plugin utilities-only Tailwind build + federated CSS injection +
  scoped resets/Shadow DOM. Named in ADR 035; no kickoff yet.
- The shell `@source` and Storybook `@source` must stay in sync (both carry a
  comment). A divergence reintroduces the "works in Storybook, breaks in the shell"
  footgun.
- `demo-plugin` still uses hardcoded hex — harmless (M0 demo), but it'd fail the
  token rule if ever promoted to a real surface.

## Outputs

- ADR 035 ✅
- Enabling change (`@source`) implemented + verified (shell build + isolated) ✅
- chore-engine + family-feed reconciled to utility-first (done now, not deferred) ✅
- `CLAUDE.md` + `design-system.md` updated ✅
- Session log; kickoff deleted ✅
