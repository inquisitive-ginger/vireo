# Kickoff — M4.5/2 · Design: Gear taxonomy + asset library

**Type:** Design (content production) · **Module:** `companion` ·
**Depends on:** M4.5/1 (the style bible is the generation contract)

## Pre-session checklist

- [ ] Read `CLAUDE.md`, `docs/modules/companion/spec.md`
- [ ] Read ADR 061 (milestone-choice mechanics: 1-of-3 offers, returns of
      unchosen items), ADR 062 (pipeline, storage, pigment lane)
- [ ] Read `docs/modules/companion/style-bible.md` — **the contract; do not
      generate outside it**
- [ ] Skim the direction artifact's milestone-pick + wardrobe sections for how
      items present (previewed on the critter, slot chips)

## Session scope

_One sentence:_ Decide the v1 gear catalog — slots, items, milestone banding —
then generate and curate the complete v1 asset library through the style-bible
pipeline.

## Constraints coming in

- Slots: **worn** (head / face / neck) + **props** (beside / beneath). Scenes are
  deferred (spec §Deferred).
- Catalog volume must serve the draft curve: 8 levels × 3 offered items, with
  unchosen items returning — roughly **14–18 distinct items** covers v1 without
  repeats feeling thin. Final curve is M4.5/3's call; leave one spare band.
- Item spread is the personality axis (ADR 061): rockstar, skater, cozy, sporty,
  silly, monster-ish — every temperament findable in gear, since species no
  longer carry it.
- Bodies: 3 species × 3 stages × 2 moods, neutral grayscale, per the bible's
  anchor spec. Plus the egg (idle + hatch-ready) and celebration bits.

## Decisions to make

1. The item list itself (names, slots, milestone band per item) — **gate with the
   user**; kid input encouraged (they picked the species roster).
2. Per-item anchor fit data (offsets per species where the shared anchors need a
   nudge) — this becomes a JSON the renderer consumes.
3. Curation bar: reject/regenerate policy for off-bible outputs; who signs off a
   batch (the user does, in-session).

## Outputs (required before closing)

- [ ] `docs/modules/companion/gear-catalog.md` — table: id · name · slot ·
      milestone band · anchor-fit notes
- [ ] The curated v1 asset set committed (target path per ADR 062:
      `plugins/companion/public/…`; the plugin may not exist yet — park under
      `docs/modules/companion/assets/` and note the move for M4.5/4 if so)
- [ ] The generation scripts/prompts committed beside the assets (repeatability —
      content drops and custom gear both replay this pipeline)
- [ ] Session log + progress row + queue update; delete this kickoff
