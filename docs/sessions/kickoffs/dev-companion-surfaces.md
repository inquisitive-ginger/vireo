# Kickoff — M4.5/5 · Dev: Companion surfaces

**Type:** Development · **Module:** `companion` · **Proposed branch:**
`dev/companion-surfaces` · **Depends on:** M4.5/4

## Pre-session checklist

- [ ] Read `CLAUDE.md`, `docs/modules/companion/spec.md`
- [ ] Read ADR 061 (placement + flock), the M4.5/3 artifact (the build target)
      and its recorded constants
- [ ] Read `packages/platform/src/home-layout.ts` (`DEFAULT_LAYOUTS` — this
      session changes all affected tier keys) and ADR 028/039
- [ ] Read `plugins/chores/src/lib/use-xp-flight.ts` (`onFlightDone` — the
      widget-reaction hook) and `plugins/rewards` Modal picker / prize-pick
      components (the milestone-pick interaction precedent)
- [ ] Read `packages/ui` `widget-slot.tsx`, `widget-breakpoints.ts`, `useFitRows`

## Session scope

_One sentence:_ Build every companion surface on the M4.5/4 foundation — the
widget (all sizes + reactions), the home-layout change, the flock strip, the
wardrobe drawer, the milestone pick flow, and notifications — to the gated
M4.5/3 design.

## Constraints coming in

- Widget: feature/card/quiet-safe, `compact`/`standard` per the gated design;
  manifest + Query cache invalidation per ADR 022; the widget and page share a
  key prefix (one invalidation refreshes both).
- Home layout: companion takes tier 1–2 feature, wallet steps to card (ADR 061
  amending ADR 028); family layout gains the flock widget; **the family
  pseudo-profile never gets a personal companion widget.**
- Flock needs a read endpoint for all hatched companions —
  `GET /api/chores/xp` is active-profile-only, so the companion API exposes its
  own family-visible read (tier rules per ADR 061); remember prod has no
  `family` profiles row gotchas (memory `project-prod-no-family-profile-row`).
- Milestone pick: offers come persisted from the server (M4.5/4); the UI is the
  punch-card prize-pick pattern with previews composited on the kid's critter.
- No blind `catch {}` anywhere a family member can reach (standing convention).
- Tests mirror chores/calendar RTL suites; run per-package (memory
  `project-running-tests`).

## Outputs (required before closing)

- [ ] All surfaces live in the real shell — **live review + sign-off before
      close-out**; fridge-distance check on the widget
- [ ] This PR is the launch: hatch prompt reaches the kids' dashboards on deploy
- [ ] PR per convention; session log + progress row + queue update; delete this
      kickoff. **M4.5 closes here** — update `docs/roadmap.md` and the module
      progress board.
