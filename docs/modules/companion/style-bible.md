# Companion Style Bible

**Status: Settled — reference sheet signed off 2026-08-07 (M4.5/1, round 2
candidate A2).** Governs every generated asset batch (ADR 062). The character
designs it renders are ADR 061's — the bible replaces the rendering, never the
design.

**The reference sheet:** `reference/{wisp,skitter,sprout}.png` (matted,
contract-conformant, 512px) with raw generation masters in
`reference/generated/*-1024.png`. Batches condition on the raw masters — they
are what the model actually produces before the matte step.

---

## The look

**Sticker-flat / cel.** Every asset obeys all of these; any one violation fails
curation:

1. **Flat tonal regions only** — no gradients, no airbrush, no texture, no
   paper grain, no noise. A region is one gray until it meets a line.
2. **One confident outline** around the silhouette and major interior shapes —
   uniform weight, rounded joins and caps, no sketchy double-strokes, no
   tapering calligraphy.
3. **Minimal shading: at most ONE accent band** (belly patch, cheek blush,
   inner-ear) sitting between fill and line grays. Never a cast shadow, never a
   core shadow, never rim light.
4. **No ground shadow in the asset.** The renderer draws the soft ellipse
   itself, in a neutral it controls per theme.
5. **Rounded everything** — the vocabulary is circles, capsules, and soft
   teardrops. No hard corners on a body part.
6. **Big head, small everything else** — toy proportions, eye line in the lower
   half of the face mass.
7. **Whole character in frame, centered, ~10% margin**, facing the viewer,
   symmetric pose (props may break symmetry, bodies may not).

## Tonal band contract

Bodies generate in **neutral grayscale** (true R=G=B). Four bands, one optional
accent. The runtime LUT maps them to the owner's identity triplet
(`tint`/`base`/`ink` — three theme blocks, ADR 044) with linear OKLCh
interpolation between stops, so antialiased edges land between the mapped
colors gracefully.

| Band        | Gray     | Used for                               | Maps to (light / dark) |
| ----------- | -------- | -------------------------------------- | ---------------------- |
| **paper**   | **1.00** | eye specular, sclera, teeth            | near-white 0.99 / 0.97 |
| **fill**    | **0.80** | body mass                              | `tint`                 |
| _accent_    | _≈0.68_  | belly patch, cheeks, inner-ear         | tint→base blend        |
| **line**    | **0.55** | outline, limbs, markings, leaf/antenna | `base`                 |
| **feature** | **0.12** | eyes, mouth, freckle-dots              | `ink`                  |

- The mapping is **role, not lightness**: in dark theme `line` (0.7) comes out
  _lighter_ than `fill` (0.35) — chalk-on-blackboard, exactly how the direction
  artifact rendered. The line band is the _identity_ stroke, not a shadow.
- Dark paper sits at **0.97, not ink's 0.9** — the specular and the teeth must
  stay separable from ink-mapped features on a dark ground. This only works
  because features are small (see the eye rule); a large feature mass maps to a
  pale slab in dark theme, which is exactly what the eye-size cap prevents.
- Grays must land within **±0.04** of the contract values or the batch is
  regenerated/levels-corrected before curation — the LUT keys off these stops.

## Species rules

All three share: canvas-relative outline weight **2.5% of body-canvas height**
(3 units on the 120 reference canvas), limb strokes ~4%, face line-work ~2%;
**small** round ink eyes — diameter ≤ **9% of canvas height** — with one paper
specular dot each, upper-outer quadrant (big glossy anime orbs fail curation:
in dark theme a large feature mass maps to a pale slab); cheek accents flanking
the mouth; mood variants change **only** eyes/mouth/sparkle decor, never
silhouette.

| Species     | Silhouette invariants                                                                                                                                                                                                                                                                     | Stage progression (1 → 2 → 3)                                                             |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Wisp**    | Floating ghost-flame, wavy pointed tip curling right at the crown, soft trailing wisp-tails at the lower sides; **no limbs, never touches ground**; **must never read as a water drop** (no smooth round-bottomed droplet silhouette — the tip is flame-wavy, not surface-tension-smooth) | small single curl → belly accent + second tail-wisp → taller flame-curl, three tail-wisps |
| **Skitter** | Dome bug, wider than tall; **six legs** at stage 2+ (four at stage 1), stubby and rounded — spider-adjacent, never creepy; three short lash-tufts on the crown; **buck teeth** (paper) under the mouth; freckle-dots (feature) on the cheeks at stage 2+                                  | 4 legs → 6 legs + freckles → bigger dome, back speckle accents                            |
| **Sprout**  | Round-bottomed pot-bellied seedling, grounded; leaf crown in **line** gray sprouting from the crown; body slightly pear                                                                                                                                                                   | one leaf → two asymmetric leaves → three-leaf spray + belly accent                        |

Silhouettes must be tellable-apart **as black shapes at 84px** — species is the
second identity channel in the flock strip (ADR 044: hue is never the only
channel).

## Anchor spec

Normalized to the **120-unit body canvas** (multiply by `size/120`; the
generation canvas is 1024 → ×8.53). Gear is authored against anchors, not
against a species — one gear asset must sit on all three bodies.

| Anchor              | Wisp  | Skitter | Sprout |
| ------------------- | ----- | ------- | ------ |
| `headX` (center)    | 60    | 60      | 60     |
| `headY` (crown top) | 34    | 43      | 46     |
| `eyeY`              | 72    | 68      | 71     |
| `eyeX1` / `eyeX2`   | 51/69 | 50/70   | 50/70  |
| `neckY`             | 88    | 89      | 88     |
| `neckW`             | 40    | 50      | 46     |
| prop ground line    | 104   | 104     | 104    |

- **Worn gear** (head / face / neck) renders centered on its anchor; headwear
  sits on `headY` and may overhang the crown by ≤12 units; face gear centers on
  the eye pair; neck gear spans `neckW`.
- **Props** (beside / beneath) sit on the ground line in a side zone
  (x 118–160 on the 170-wide prop viewBox); beneath-props (skateboard) slide
  under the body's footprint. Wisp floats — its beneath-props still sit on the
  ground line, under the hover point.

## Gear

Gear does **not** duotone — it generates in the **pigment lane**, flat colors
clear of the 8 identity hues at UI distance, brass (the coin's, ADR 051), and
error red:

| Pigment | Value                  |
| ------- | ---------------------- |
| berry   | `oklch(0.5 0.16 15)`   |
| cream   | `oklch(0.92 0.045 85)` |
| pine    | `oklch(0.48 0.09 165)` |
| cocoa   | `oklch(0.42 0.06 55)`  |
| denim   | `oklch(0.45 0.07 250)` |

Same cel rules as bodies (flat regions, one outline in a darkened self-color,
no shadow). Gear carries personality; it must read against both a light `tint`
and a dark `tint` body — check every item on the lightest (marigold) and
darkest (teal) dark-theme fills before curation.

## Generation prompt scaffold

The repeatability contract for M4.5/2's batches. Generate at **1024×1024 on
solid magenta `#ff00ff`** — Gemini image models have no native transparency, so
the matte step chroma-keys the background, snaps grays toward the band
contract, and **flood-peels any die-cut sticker border** (near-white reachable
from the transparent outside; interior paper is sealed behind the outline —
negatives alone did not stop the border in either session round). Scripts:
`scripts/companion-art/gen.py` (Gemini API, `GEMINI_API_KEY`, model `gemini-3-pro-image`) ·
`scripts/companion-art/matte.py`. Every batch conditions on the signed-off raw masters
(image reference + this scaffold); prompt-only generation was for this
session's candidate rounds only.

**Body scaffold:**

> Cute {species descriptor} mascot character, sticker-flat cel style, thick
> uniform rounded outline, flat tonal regions, NEUTRAL GRAYSCALE only: white
> highlights, light gray (#cccccc) body fill, mid gray (#8c8c8c) outline and
> limbs, near-black (#1f1f1f) round eyes with white specular dot, small smile,
> cheek blush in soft gray. {stage descriptor}. {mood descriptor}. Whole
> character centered, facing viewer, symmetric, 10% margin, transparent
> background, no ground shadow.

**Negative constraints (append always):**

> no color, no gradients, no texture, no watercolor, no 3d render, no clay, no
> cast shadow, no drop shadow, no background, no outline sketchiness, no extra
> limbs, no accessories, no text, no watermark, no sticker border, no die-cut
> white edge, no big anime eyes, no glossy oversized eyes

**Species descriptors** — Wisp: "a little ghost-flame wisp spirit, flame-shaped
floating body, wavy pointed tip curling right at the top, soft trailing wisp
tails at the lower sides, hovering, no limbs, not a water drop". Skitter:
"round six-legged bug, stubby rounded legs, buck teeth, freckles, three tiny
hair tufts". Sprout: "round sprout seedling with leaf on top, grounded,
pear-shaped".

**Gear scaffold:** swap the grayscale clause for "flat colors limited to
{pigment list}, self-colored darker outline", name the anchor ("a knit scarf
alone, laid as if around a neck 50 units wide", …), keep the same negatives.

**Acceptance per generated image:** bands within contract (±0.04) · silhouette
reads at 84px · anchors within ±4 units of spec · passes the duotone proof page
in both themes. A human curates every image that ships (ADR 062).

## Duotone pipeline (decision 3 — settled, proven on the signed-off references)

**Canvas LUT is the mechanism.** 256-entry LUT per (hue × theme), built from
the tokens at runtime, piecewise-linear in OKLCh between the band stops; applied
once per asset via `getImageData`, cached. Exact by construction (per-band
ΔEok ≈ 0), theme/hue changes are a re-run, and the output is a plain canvas.

- **Fallback proven equivalent:** SVG `feColorMatrix(saturate 0)` +
  `feComponentTransfer` 33-entry tables off the same LUT — mean ΔEok 0.0024,
  max 0.0060 vs canvas on a full sprite. Use it if a surface can't take canvas.
- **CSS blend rejected:** two-stop only, and structurally cannot produce the
  dark-theme mapping (line/feature lighter than fill — a blend can only darken).
- Proof + liftable snippet (`buildLut`/`applyLut`, color math):
  `docs/sessions/artifacts/2026-08-07-duotone-proof.html`. Verified on the
  signed-off references: user-gated at 84/104px in both themes (sky/plum/teal),
  all 8 hues spot-checked light + dark, per-band ΔEok ≈ 0 by construction.

## Asset format (decision 4 — settled)

- **Generation masters:** 1024×1024 transparent PNG. Signed-off references live
  in `docs/modules/companion/reference/`; masters for shipped assets are not
  committed (the reference sheet + scaffold regenerate the look).
- **Shipped assets:** 336×336 lossless **WebP** with alpha under
  `plugins/companion/public/` — @2x of the largest product surface (168px), so
  every surface (84/104/168) downscales from one file. No @1x variants.
- **Naming:** `body-{species}-s{stage}-{mood}.webp` ·
  `gear-{slug}-{anchor}.webp`.
