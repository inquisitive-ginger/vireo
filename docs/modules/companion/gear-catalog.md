# Companion — V1 Gear Catalog

**Status: v1 shipped 2026-08-08 (M4.5/2, user-curated) — 15 items live, 4
parked.** Banded to the draft 8-level curve (final curve is M4.5/3's; bands
shift free of this doc). Late band deliberately skews aspirational-cool —
stage 3 + late gear is the "older version of you" read. Cape was cut (needed a
behind-body compositing layer ADR 062 doesn't define); wizard hat demoted to
early-silly; headphones became wireless earbuds (then parked, see below).

Assets: `docs/modules/companion/assets/gear/` (parked here until the plugin
exists — move to `plugins/companion/public/` in M4.5/4). Naming: shared items
`gear-{slug}-{anchor}.webp`; per-species items
`gear-{slug}-{species}-{anchor}.webp` (the `variant` field in
`assets/anchors.json` says which; fits are per species × stage).

Slots: **worn** head / face / neck · **props** beside / beneath (ADR 061;
scenes deferred). Anchor-fit JSON (per-item, per-species × per-stage offsets)
is produced with the gear batches and ships beside the assets.

**Parked (M4.5/2): body-conforming worn items — knit scarf, bandana, beanie, wireless earbuds.**
A single front-composited layer cannot read as "truly worn" when the item must
conform to the body's contour: wraps pass behind the silhouette; fitted hats
must hug the crown line. Unlocks to explore at end-of-session triage:
two-layer assets (front + behind-body piece, a renderer z-order extension),
per-species conforming variants, or the cartoon "perch" (item sits atop the
crown, no contour contact). Front-mounted (bow tie) and perched items are
unaffected. Rescued at triage: monster horns regenerated band-less as
per-species variant pairs. Earbuds (headphones' replacement) tried shared and
per-species pairs and still didn't sit right — the paired-piece spread wants
true dual placement (one bud asset placed twice, mirrored), another renderer
extension for the same triage pile as the two-layer wraps.

| id                     | Name             | Slot    | Band        | Personality     | Anchor-fit notes                                    |
| ---------------------- | ---------------- | ------- | ----------- | --------------- | --------------------------------------------------- |
| `gear-knit-scarf`      | Knit scarf       | neck    | early Lv1–3 | cozy            | spans `neckW`; tassel hangs right                   |
| `gear-ball-cap`        | Ball cap         | head    | early       | sporty          | sits on `headY`, brim forward                       |
| `gear-round-specs`     | Round specs      | face    | early       | silly / smart   | centers on eye pair; frame must not swamp the eyes  |
| `gear-daisy-clip`      | Daisy clip       | head    | early       | cozy / cute     | offset right of crown; on Wisp rides the flame curl |
| `gear-beanie`          | Beanie           | head    | early       | skater / cozy   | hugs crown; overhang ≤12 units                      |
| `gear-bow-tie`         | Bow tie          | neck    | early       | silly / fancy   | centered on `neckY`                                 |
| `gear-soccer-ball`     | Soccer ball      | beside  | early       | sporty          | ground line, side zone                              |
| `gear-wizard-hat`      | Wizard hat       | head    | early       | silly / magic   | tall — allowed >12-unit overhang as the one outlier |
| `gear-earbuds`         | Wireless earbuds | head    | mid Lv4–6   | rockstar / cool | pair flanks the head at eye height; no band         |
| `gear-bandana`         | Bandana          | neck    | mid         | skater          | triangle fold, knot at side                         |
| `gear-star-shades`     | Star shades      | face    | mid         | rockstar        | covers eyes — mood must still read from mouth       |
| `gear-monster-horns`   | Monster horns    | head    | mid         | monster-ish     | band-less floating pair flanking the crown          |
| `gear-skateboard`      | Skateboard       | beneath | mid         | skater          | under footprint; Wisp: under hover point            |
| `gear-boombox`         | Boombox          | beside  | mid         | rockstar/skater | ground line, side zone                              |
| `gear-drum-kit`        | Drum kit         | beside  | late Lv7–8  | rockstar        | widest prop; owns most of the side zone             |
| `gear-tiny-crown`      | Tiny crown       | head    | late        | fancy           | centered; on Wisp floats at the flame tip           |
| `gear-electric-guitar` | Electric guitar  | beside  | late        | rockstar        | leans toward the body edge in the side zone         |
| `gear-bmx-bike`        | BMX bike         | beside  | late        | skater / sporty | wide prop, parked; side zone                        |
| `gear-propeller-cap`   | Propeller cap    | head    | spare band  | silly           | held back for curve slack (M4.5/3)                  |
