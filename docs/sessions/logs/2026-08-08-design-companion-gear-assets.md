# 2026-08-08 — Design: Gear taxonomy + v1 asset library (M4.5/2)

**Type:** design (content production) · **Module:** `companion` · Executes the
second half of ADR 062 · Direct to main.

## What shipped

- **Bodies: complete.** 20 assets (3 species × 3 stages × 2 moods + egg
  idle/hatch-ready), user-curated, 336px lossless WebP in
  `docs/modules/companion/assets/bodies/` (move to `plugins/companion/public/`
  in M4.5/4).
- **Gear: 15 of the catalog's items live**, 4 parked. 14 shared assets + monster
  horns as per-species variant pairs, in `assets/gear/`. Per-item, per-species ×
  per-stage fit data in `assets/anchors.json` (with `stageScale` retired — fits
  are explicit per stage).
- **Catalog:** `docs/modules/companion/gear-catalog.md` — late band re-skewed
  aspirational-cool (guitar, BMX added; cape cut; wizard hat demoted to
  early-silly; headphones → earbuds, then parked).
- **Tools committed:** `scripts/companion-art/` — `build_bodies_jobs.py`, all
  jobs files, `matte_gear.py` (7-pass gear matte), `gear-fit-playground.html`
  (drag/resize fit tool, per species × stage, emits the anchors JSON).

## Decisions & findings (full detail in the style-bible addenda)

1. **Stages read as ages** — hatchling · kid · teen, carried by size/carriage/
   expression, species markers secondary. At the draft curve: s1 ≈ wk 0–2,
   s2 ≈ wk 2–8, s3 ≈ wk 8 on. Sparkles/celebration decor is renderer-drawn, not
   in-asset.
2. **Enumerated-edits prompting** is the variant contract; resting conditions on
   the accepted perky sibling. Some deltas are un-promptable (four-legged
   Skitter → bible amended: six legs all stages).
3. **The fit problem is real and structural.** One frame-filling raster + one
   offset per species doesn't survive contact with the bodies. Resolution
   ladder: per-stage fits (all items) → per-species variants (proportion-
   referencing items: horns) → **parked** where a front layer can't ever read
   as worn.
4. **Parked (4):** knit scarf, bandana, beanie — body-conforming, need a
   two-layer (front + behind-body) compositing extension; earbuds — paired
   pieces need dual mirrored placement of a single-bud asset. Both are renderer
   extensions for M4.5/4+ triage; the generated scarf/earbud variants and their
   jobs are committed for that day.
5. Curation rounds fixed: inverted skitter eyes/teeth in dark theme (single
   specular, upper-left, both eyes), sprout cross-eyes, missing sprout feet in
   resting (condition on the sibling, not the master), berry-pink drift, thin
   fringe vs chroma key (chunky outlined details only).

## What M4.5/3 needs to know

- Judge UX on the real assets: `assets/{bodies,gear}` + `anchors.json` is the
  full render input. Fits assume the 120-unit canvas, 170 prop viewBox.
- Catalog volume for the curve: 15 items, one spare band held (propeller cap).
  If the curve needs 16+, the parked four are the backlog, gated on the
  renderer extensions.
- Gemini throughput degraded to ~3 min/image late in the session (rate limit
  suspected, ~70 generations) — plan batch time accordingly.
