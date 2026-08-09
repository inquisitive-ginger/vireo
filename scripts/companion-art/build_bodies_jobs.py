#!/usr/bin/env python3
"""Compose the bodies batch jobs (M4.5/2) from the enumerated-edits template.

The pilot proved conditioning is edit-resistant: describe-the-stage prompts get
copied or drift off-style; the working pattern is "redraw exactly, with ONLY
these changes". Sparkle/celebration decor is renderer-owned — every prompt
strips it. wisp-s3-perky is excluded (pilot keeper, jobs/bodies-pilot-d.json).

Usage: build_bodies_jobs.py > jobs/bodies.json
"""
import json

REF = "docs/modules/companion/reference/generated/{species}-1024.png"

HEAD = ("Redraw the exact character from the reference image, same art style, "
        "same big-head cute toy proportions, same pose, with ONLY these "
        "specific changes: ")
PERKY = ("The face is friendly and happy: relaxed open round eyes with white "
         "specular dot, NO eyebrows, a gentle confident closed-mouth smile. ")
RESTING = ("The face is calm and content: the eyes are gently closed, drawn as "
           "two soft downward-curved lid lines, tiny relaxed neutral mouth — "
           "peaceful, not sad, not asleep. ")
KEEP = ("Keep everything else identical to the reference: sticker-flat cel "
        "style, thick uniform rounded outline, flat tonal regions, NEUTRAL "
        "GRAYSCALE only, white highlights, light gray (#cccccc) body fill, mid "
        "gray (#8c8c8c) outline, near-black (#1f1f1f) round eyes, cheek blush "
        "in soft gray. ")
FRAME = ("Whole character centered, facing viewer, 10% margin, on a plain "
         "solid magenta (#ff00ff) background, no ground shadow. ")
NEG = ("Negative constraints: no color on the character, no gradients, no "
       "texture, no stipple, no halftone, no watercolor, no 3d render, no "
       "clay, no cast shadow, no drop shadow, no background scenery, no "
       "outline sketchiness, no extra limbs, no accessories, no eyebrows, no "
       "angry expression, no floating sparkles, no stars, no text, no "
       "watermark, no sticker border, no die-cut white edge, no big anime "
       "eyes, no glossy oversized eyes.")

BABY = "the whole body about 15 percent smaller, squatter and extra round — a baby version"
BABY_EYES = "eyes very slightly larger and rounder — innocent baby face"
NO_SPARKLE = "remove the floating sparkles"
BELLY = ("the soft belly patch becomes one flat solid region of slightly "
         "darker gray (#adadad), perfectly smooth")

EDITS = {
    "wisp": {
        1: [BABY, "only ONE small stubby crown curl at the top",
            "only ONE short soft wisp-tail, on the lower right",
            "no belly patch", BABY_EYES, NO_SPARKLE],
        2: [BELLY, NO_SPARKLE],
        3: ["the flame body about 15 percent taller and very slightly slimmer, standing proud",
            "add a third soft wisp-tail curling out on the lower LEFT side, balancing the tails on the right",
            "the crown flame-curl at the top taller and more sweeping",
            BELLY, NO_SPARKLE],
    },
    "skitter": {
        1: [BABY, "only FOUR stubby legs instead of six",
            "remove the cheek freckle dots",
            "the buck teeth become two tiny tooth buds", BABY_EYES, NO_SPARKLE],
        2: [NO_SPARKLE],
        3: ["the dome body about 15 percent bigger and carried slightly higher on the legs",
            "add three small flat solid slightly-darker-gray (#adadad) speckle spots across the top of the dome",
            NO_SPARKLE],
    },
    "sprout": {
        1: [BABY, "only ONE tiny leaf sprig on the crown", BABY_EYES, NO_SPARKLE],
        2: [NO_SPARKLE],
        3: ["the body about 15 percent taller and slightly leaner pear shape, standing proud",
            "the crown becomes a three-leaf spray, like styled hair",
            "add a soft belly patch as one flat solid region of slightly darker gray (#adadad), perfectly smooth",
            NO_SPARKLE],
    },
}

EGG_BASE = ("Using the reference image ONLY for the art style — line weight, "
            "flat grayscale bands, cel sticker look — draw a cute plain egg: "
            "smooth rounded egg shape, light gray (#cccccc) fill, thick "
            "uniform mid gray (#8c8c8c) outline, three small flat slightly "
            "darker gray (#adadad) speckle dots on the shell, no face, no "
            "limbs, not a character, just the egg. ")
EGG_CRACK = ("A friendly zigzag crack line across the upper shell in mid gray "
             "and one small crack on the side — about to hatch, still intact, "
             "cheerful. ")

jobs = []
for species, stages in EDITS.items():
    for stage, edits in stages.items():
        for mood in ("perky", "resting"):
            if species == "wisp" and stage == 3 and mood == "perky":
                continue
            numbered = "; ".join(f"({i + 1}) {e}" for i, e in enumerate(edits))
            face = PERKY if mood == "perky" else RESTING
            neg = NEG.replace("no extra limbs", "no extra limbs, no arms") if species == "wisp" else NEG
            jobs.append({
                "name": f"body-{species}-s{stage}-{mood}",
                "refs": [REF.format(species=species)],
                "prompt": HEAD + numbered + ". " + face + KEEP + FRAME + neg,
            })

for name, extra in (("egg-idle", ""), ("egg-hatch-ready", EGG_CRACK)):
    jobs.append({
        "name": name,
        "refs": [REF.format(species="wisp")],
        "prompt": EGG_BASE + extra +
                  "Whole egg centered, 10% margin, on a plain solid magenta (#ff00ff) background, no ground shadow. " + NEG,
    })

print(json.dumps(jobs, indent=2))
