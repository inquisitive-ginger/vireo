# 2026-08-07 — Design: XP Sink direction (M4/9 → M4.5 Companion)

**Type:** scoping + product + design direction · **ADRs:** 061, 062 · **Docs
only, no PR** (committed direct to main per closeout convention).

## What was decided

Everything durable is in **ADR 061** (the companion: ownership, fresh-start
levels, milestone choice, roster, placement, mood, flock) and **ADR 062** (the
art pipeline: build-time generated library, style bible, duotone-to-hue, no
runtime generation in the kid loop). Direction artifact — every surface mocked
in real app tokens, both themes:
`docs/sessions/artifacts/2026-08-07-xp-sink-direction.html`.

Decision path, for the record of _why_ (each step gated via AskUserQuestion):

1. Direction: companion (affection loop) over den (expression) and trophy
   (status); milestone choice over fixed ladder / mystery reveal.
2. Presence: widget + moment reactions; gentle non-punitive mood; family flock.
3. Architecture: new `companion` plugin; fresh start at hatch; companion takes
   the tier 1–2 feature slot (wallet → card); feature name deferred to the
   dinner table.
4. Art pivot (user push): parametric SVG → generative-AI library. Elements
   roster (v2) was **overruled by kid research** — final roster Whisp · Skitter
   · Sprout; gear (worn + props) carries personality, not species.

## What was produced

- ADR 061 + ADR 062
- `docs/modules/companion/spec.md` (overview + five-session plan) + `progress.md`
- Five kickoffs: `design-companion-style-bible` → `design-companion-gear-assets`
  → `design-companion-ux` → `dev-companion-foundation` → `dev-companion-surfaces`
- Roadmap: **M4.5 — Companion** inserted (fractional to avoid a third
  renumbering); queue rewritten for the five-session track
- The direction artifact (v3), committed

## Open questions raised

- Duotone at product sizes is unproven — the spike is M4.5/1's first job, with
  ADR 062's recorded fallback (canonical colors) if it fails.
- Level-curve numbers are drafts until M4.5/3 paces them against the real gear
  catalog.

## What the next session needs to know

M4.5/1 (style bible) is next and self-contained. The exploration report on XP's
code surfaces (award path, `xp_balances`, render sites, tokens) informed ADR
061's boundary choices — the dev kickoffs point at the primary sources rather
than the report. This session's kickoff (`design-xp-sink.md`) was written
ad-hoc at session start and is deleted per rule 6.
