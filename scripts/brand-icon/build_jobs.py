#!/usr/bin/env python3
"""Compose the Vireo app-icon exploration batch.

Runs through scripts/companion-art/gen.py (same Gemini call, same retry/skip
semantics) — only the prompt discipline differs. Companion bodies generate in
neutral grayscale because a runtime LUT recolours them per member; an app icon
is stamped once and never recoloured, so these generate directly in the brand
hexes and skip the matte step.

Usage: build_jobs.py > jobs/directions.json
"""
import json

# Brand tokens, sRGB. Theme-invariant by design — an app icon never reads the
# viewer's theme. Derived from packages/ui/src/styles.css; olive matches the
# manifest's existing theme_color exactly.
OLIVE, CREAM, HEARTH, HEARTH_DEEP, HOLLOW, SHADE = (
    "#596C17", "#FBFAF4", "#E7A045", "#B76B27", "#242A0A", "#E5E0CE")

PALETTE = (
    f"Strict five-colour palette, no other colours anywhere: deep olive green {OLIVE}, "
    f"warm off-white {CREAM}, warm amber {HEARTH}, burnt amber {HEARTH_DEEP}, "
    f"very dark olive-black {HOLLOW}. ")

FRAME = (
    "Square app icon artwork. The background is one solid perfectly uniform flat colour "
    "filling the entire square edge to edge — no border, no frame, no rounded corners, no "
    "vignette, no grain, no mottling, no texture whatsoever in the background. One single "
    "mark, centred and optically balanced. CRITICAL: the mark must be small in the frame "
    "and must never touch or approach the edges — leave a wide band of empty flat "
    "background at least one fifth of the image width clear on all four sides. ")

CRAFT = (
    "Professional brand identity work — the quality of a top-tier app icon: confident "
    "geometry, consistent corner radii, generous optical spacing, every shape "
    "deliberate. Crisp vector-clean edges, no raster fuzz. Reduced to essential shapes "
    "so it stays legible at 32 pixels. ")

NEG = (
    "Negative constraints: no text, no letters, no numbers, no watermark, no signature, "
    "no logo lockup, no multiple icons, no grid of variations, no sheet of options, no "
    "device mockup, no phone frame, no presentation background, no photorealism, no 3d "
    "render, no clay, no bevel, no emboss, no glossy plastic, no chrome, no lens flare, "
    "no gradient mesh, no noise, no paper texture, no hand-drawn sketchiness, no "
    "cropping of the mark, no sticker die-cut edge, no white outline around the canvas, "
    "no cast shadow outside the mark, no extra decorative elements, no stars, no "
    "sparkles, no leaves, no clouds, no sun.")

# ── Style treatments ──────────────────────────────────────────────────────────
S_FLAT = (
    "Style: perfectly flat geometric vector. Every region is one solid unmodulated "
    "colour meeting the next at a crisp edge. No shading of any kind, no gradients, no "
    "highlights, no shadows, no outlines around shapes. Shapes are built from circles, "
    "capsules and soft-cornered polygons. ")

S_SOFT = (
    "Style: modern soft-dimensional flat. Mostly flat solid regions, but each major "
    "plane carries one very subtle soft shadow where it overlaps the plane behind it, "
    "and one gentle warm light falling from above. The depth is understated — layers of "
    "paper lit softly, never a 3d render, never a bevel, never a glossy highlight. ")

S_PAPER = (
    "Style: layered paper-cut craft. The mark is built from distinct stacked planes of "
    "flat matte cardstock, each plane casting a small soft diffuse shadow onto the one "
    "beneath. Warm, tactile and handmade in feel but geometrically precise. No visible "
    "paper fibre or texture — the shadows alone carry the layering. ")

S_LINE = (
    "Style: precise monoline linework. The mark is drawn with a single uniform stroke "
    "weight throughout, rounded caps and rounded joins, no fills except one solid shape "
    "for the entry hole. Open, airy and architectural. ")

# ── Concepts ──────────────────────────────────────────────────────────────────
NEST = (
    f"Subject: a birdhouse seen straight on, with a small round songbird looking out of "
    f"its entry hole. The house is warm off-white {CREAM} — a pitched gable roof with a "
    f"slight eave overhang. The roof is ONE solid unbroken filled triangle, never an "
    f"outline and never a doubled line, sitting directly on a solid filled soft-cornered "
    f"box. A large circular entry hole is cut "
    f"into the box; the inside of the hole is very dark olive-black {HOLLOW} so it reads "
    f"as real depth, ringed by a thin warm amber {HEARTH} rim of light. Filling the lower "
    f"half of that opening is the head and shoulders of a chubby round songbird in warm "
    f"off-white, with a small stout amber beak in profile pointing left and one small "
    f"dark round eye. The dark upper part of the hole stays empty. Background solid deep "
    f"olive green {OLIVE}. ")

APERTURE = (
    f"Subject: a birdhouse seen straight on, with nobody home but the lights on. Warm "
    f"off-white {CREAM} pitched gable roof with a slight eave overhang — ONE solid "
    f"unbroken filled triangle, never an outline and never a doubled line — sitting "
    f"directly on a solid filled soft-cornered box. One large circular entry hole cut into the box, its interior "
    f"very dark olive-black {HOLLOW} ringed by a warm amber {HEARTH} halo of light "
    f"spilling out. A short burnt-amber {HEARTH_DEEP} dowel perch sits just below the "
    f"hole. No bird. Background solid deep olive green {OLIVE}. ")

SONGBIRD = (
    f"Subject: a single plump little songbird — a vireo — perched in profile facing left "
    f"on a short horizontal dowel. Big rounded head, short neck, stout conical amber "
    f"{HEARTH} beak, one small dark round eye, compact body, one folded wing, short "
    f"tapered tail angled down and back, two sturdy legs. The bird is warm off-white "
    f"{CREAM}; the folded wing is one flat region of slightly darker warm grey {SHADE}. "
    f"Background solid deep olive green {OLIVE}. ")

LINEWORK = (
    f"Subject: a birdhouse drawn in outline only — two vertical walls, a floor, and a "
    f"pitched gable roofline with eave overhang above them, plus a short perch line. The "
    f"stroke is deep olive green {OLIVE}. The one filled shape is the circular entry "
    f"hole, solid warm amber {HEARTH}. Background solid warm off-white {CREAM}. ")

CONTINUOUS = (
    f"Subject: a clever minimal brand mark where a birdhouse and a bird are the same "
    f"shape. One solid warm off-white {CREAM} silhouette of a pitched-roof birdhouse; "
    f"the circular entry hole is cut clean through to the background, and the negative "
    f"space of that hole simultaneously forms the profile of a small bird's head with a "
    f"beak. Witty, extremely reduced, geometric. Background solid deep olive green "
    f"{OLIVE}. ")

ROOST = (
    f"Subject: a small round songbird perched on the peak of a birdhouse roof, seen "
    f"straight on. Only the top of the birdhouse is shown — a wide warm off-white "
    f"{CREAM} gable roof rising from the lower edge of the composition, with a dark "
    f"olive-black {HOLLOW} circular entry hole and a warm amber {HEARTH} rim just below "
    f"the peak. The bird sits on the ridge above it in warm off-white with an amber "
    f"beak, facing left. Background solid deep olive green {OLIVE}. ")

GABLE = (
    f"Subject: an abstract geometric monogram in which a birdhouse gable and a bird's "
    f"wing are the same form. A bold chevron roofline in warm off-white {CREAM} over a "
    f"solid circular warm amber {HEARTH} aperture, with a single sweeping wing-like "
    f"shape resolving out of the right side of the chevron. Systematic, confident, "
    f"reads instantly at small size. Background solid deep olive green {OLIVE}. ")

BATCH = [
    ("nest-flat", NEST, S_FLAT),
    ("nest-soft", NEST, S_SOFT),
    ("nest-paper", NEST, S_PAPER),
    ("aperture-flat", APERTURE, S_FLAT),
    ("aperture-soft", APERTURE, S_SOFT),
    ("aperture-paper", APERTURE, S_PAPER),
    ("songbird-flat", SONGBIRD, S_FLAT),
    ("songbird-soft", SONGBIRD, S_SOFT),
    ("linework-line", LINEWORK, S_LINE),
    ("continuous-flat", CONTINUOUS, S_FLAT),
    ("roost-soft", ROOST, S_SOFT),
    ("gable-flat", GABLE, S_FLAT),
]

print(json.dumps(
    [{"name": n, "prompt": subj + style + PALETTE + FRAME + CRAFT + NEG}
     for n, subj, style in BATCH], indent=2))
