# Kickoff — M4.5/1 · Design: Style Bible + duotone proof

**Type:** Design (art direction) · **Module:** `companion`

## Pre-session checklist

- [ ] Read `CLAUDE.md`, `docs/modules/companion/spec.md`
- [ ] Read ADR 061 (the companion), ADR 062 (art pipeline — this session executes its first half)
- [ ] Open `docs/sessions/artifacts/2026-08-07-xp-sink-direction.html` — the three
      species' silhouettes, proportions, and gear anchors are drawn there as
      parametric SVG; the bible replaces the rendering, not the character design
- [ ] Read `docs/design-system.md` §Currency marks (what brass/gold may never be),
      identity token layers in `packages/ui/src/styles.css` (the tint/base/ink
      triplets duotone maps onto, light + dark)

## Session scope

_One sentence:_ Lock the reference look for all companion art — the style bible an
image model generates against — and prove the grayscale→identity-hue duotone
pipeline on real generated samples at product sizes.

## Constraints coming in

- Sticker-flat/cel with flat tonal regions is settled (ADR 062) — the bible's job
  is to make it **specific**: proportion rules, outline weight, shading band
  count, eye language, silhouette rules per species (Whisp curl, Skitter's six
  legs + freckle-dots + buck teeth, Sprout's leaf stages).
- Bodies generate in **neutral grayscale**; tonal bands must map cleanly to
  tint/base/ink in **both themes**. Gear generates in the ADR 062 pigment lane
  (clear of the 8 identity hues, brass, error red).
- Anchor spec: gear must fit all three species via shared anchor points (head
  crown, eye line, neck, prop ground) — the artifact's SVG anchors are the
  starting numbers.

## Decisions to make

1. The reference sheet itself — generate candidates, **gate the pick with the
   user**, iterate until one is signed off.
2. The generation prompt scaffold + negative constraints that reproduce the look
   reliably (this is the repeatability contract M4.5/2 depends on).
3. Duotone mechanism — SVG filter (`feComponentTransfer`) vs canvas LUT vs CSS —
   proven on generated samples at 84px / 104px / 168px, light and dark, all 8 hues
   spot-checked. **ADR 062's "do not revisit unless" triggers here if it fails.**
4. Asset format + resolution (transparent WebP/PNG, export size, @2x policy).

## Outputs (required before closing)

- [ ] `docs/modules/companion/style-bible.md` — the rules, the prompt scaffold,
      the anchor spec, embedded/linked reference sheets
- [ ] Signed-off reference images committed under `docs/modules/companion/reference/`
- [ ] Working duotone prototype (throwaway HTML or a snippet the dev session lifts)
- [ ] Session log + progress row + queue update; delete this kickoff
