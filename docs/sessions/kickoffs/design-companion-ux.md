# Kickoff — M4.5/3 · Design: Feature UX

**Type:** Design · **Module:** `companion` ·
**Depends on:** M4.5/2 (layout is judged on the real art)

## Pre-session checklist

- [ ] Read `CLAUDE.md`, `docs/modules/companion/spec.md`
- [ ] Read ADR 061 (every surface decision it already makes: feature slot, flock,
      mood, milestone-choice), ADR 028 + `packages/platform/src/home-layout.ts`
      (the layout this session amends), ADR 039 (prominence), ADR 029
      (notification levels)
- [ ] Open the direction artifact — it is the wireframe layer this session
      finishes: widget, hatch, milestone pick, wardrobe drawer, flock
- [ ] Read `docs/design-system.md` §Rewards surfaces (Modal picker + prize-pick
      precedents), §Currency marks (registers the milestone notification copy
      must respect)
- [ ] Skim `packages/ui/src/components/widget-slot.tsx` + `widget-breakpoints.ts`
      (container-query thresholds the widget must fit) and `useFitRows`

## Session scope

_One sentence:_ Take every companion surface from direction-mock to gated,
buildable design on the real generated art — widget states and sizes, hatch,
milestone pick, wardrobe, flock, notifications, celebrations — and finalize the
level curve.

## Constraints coming in

- The direction artifact is signed off as **direction**; layout, sizes, copy, and
  motion are this session's to finish and gate (visual option gates via
  AskUserQuestion per standing feedback).
- Widget must define `compact`/`standard` behavior, not just the feature render;
  the flock strip must survive `useFitRows` clamping on the family dashboard.
- Level curve: pace against ~175 XP/week baseline (see ADR 056 economy) and the
  actual M4.5/2 catalog volume; stage-ups stay on the track. Record the final
  constants — they are M4.5/4's `economy.ts` equivalent.
- Milestone notification is an `alert` (Web Push) to the kid; decide parent
  visibility (tray-only vs none) inside ADR 029's levels.
- Celebration moments reuse existing motion vocabulary where it fits
  (`stamp-slam`, `confetti-fall`, `breathe`, the XP flight's `onFlightDone` hook).

## Decisions to make

1. Widget anatomy per size + the reaction moment (what "the critter noticed"
   looks like without a care loop).
2. Hatch flow final form (where it interrupts, skip/later behavior for tier 4).
3. Wardrobe drawer vs sheet on mobile; equip interaction.
4. Flock strip density + unhatched presentation.
5. Final level curve + mood thresholds (perky/resting windows).
6. Home-layout amendment specifics (all three tier keys, family layout).

## Outputs (required before closing)

- [ ] Gated hi-fi artifact (v4) on real assets — committed to
      `docs/sessions/artifacts/`
- [ ] `docs/design-system.md` §Companion section (surface rules, registers)
- [ ] Final curve + mood constants recorded (log or short ADR if they harden)
- [ ] Session log + progress row + queue update; delete this kickoff
