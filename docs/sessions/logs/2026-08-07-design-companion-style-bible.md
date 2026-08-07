# 2026-08-07 — Design: Companion Style Bible + duotone proof (M4.5/1)

**Type:** design (art direction) · **Module:** `companion` · **ADRs touched:**
061 (spelling only), 062 executed (first half) · Docs only, direct to main.

## What was decided

1. **Reference look locked** (two gated rounds, candidate A2): sticker-flat/cel,
   thick uniform outline, big-head toy proportions, **small** round ink eyes.
   Signed-off sheets: `docs/modules/companion/reference/` (matted 512px + raw
   1024px masters for batch conditioning).
2. **Duotone mechanism: canvas LUT** (piecewise OKLCh between band stops).
   SVG `feComponentTransfer` proven equivalent (max ΔEok 0.006) as fallback;
   CSS blend rejected — cannot produce the dark-theme role mapping. ADR 062's
   fallback clause did **not** trigger.
3. **Tonal band contract:** paper 1.0 · fill 0.80 · line 0.55 · feature 0.12
   (±0.04), one optional accent ≈0.68. Role-based mapping (line = identity
   stroke, chalk-style light outline on dark). Dark paper stop is 0.97, not
   ink's 0.9 — speculars/teeth must stay separable, which only works with the
   small-feature rule.
4. **Asset format:** generate 1024 PNG on magenta (Gemini has no transparency)
   → matte (chroma-key + band snap + border peel) → ship 336px lossless WebP
   @2x under `plugins/companion/public/`.
5. **Generation:** Gemini API, `gemini-3-pro-image` (user's pick; API billing
   enabled this session — the key is free-tier-zero for image models without
   it). Scripts committed to `docs/modules/companion/pipeline/`.

## Iteration findings worth keeping

- "Teardrop" in a prompt produces a literal water drop — Wisp is described as a
  ghost-flame, never a droplet (species also **respelled Wisp**, per Zach;
  ADR 061 roster line updated).
- Big glossy anime eyes break dark theme structurally: a large feature mass
  maps to a pale slab. The eye-size cap (≤9% canvas height) is a duotone
  constraint, not just taste.
- Negative prompts do not reliably suppress die-cut sticker borders; the matte
  step peels them deterministically instead.

## Outputs

- `docs/modules/companion/style-bible.md` (settled) · `reference/` sheets ·
  `pipeline/{gen,matte}.py` · proof artifact
  `docs/sessions/artifacts/2026-08-07-duotone-proof.html` (drop-zone re-runs
  everything on any future sample; band-stop sliders for recalibration).

## What M4.5/2 needs to know

- Condition every batch on `reference/generated/*-1024.png` + the bible
  scaffold. Curate against the bible's acceptance list; run keepers through the
  proof page (both themes) before committing.
- Gear pigments are painted, not duotoned — check items on marigold-light and
  teal-dark fills.
- `~/.secrets/artgen.env` holds the key locally; never commit it.
