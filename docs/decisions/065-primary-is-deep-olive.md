# 065 — Primary is deep olive

**Status:** Decided (2026-08-22)

## Decision

`--primary` and `--ring` move from terracotta to **deep olive**:
`oklch(0.5 0.11 122)` light, `oklch(0.62 0.11 122)` dark. theme-color is
`#596C17` in both `index.html` and the manifest; the icon set's ground and perch
follow. The palette is now named **Olive & Teal**, and the warm neutrals rotate
with it: every neutral token keeps its lightness and roughly its chroma while
the hue moves from the terracotta family (45–80°) to the olive doorstep
(100–105°) — clay becomes oat in light, loam in dark, and the tinted light-mode
shadows follow. The active-nav wash rises from `bg-primary/10` to `/13` (nav
only; chips, hovers, and icon tiles keep `/10`). The eight identity hues,
`--accent`, coin brass, and the status colors are unchanged.

## Why

The app is now Vireo, and vireos are olive-green birds; terracotta was the
placeholder identity's color. Deep olive was chosen over two candidates on the
same hue arc (hi-fi comp: session artifact "Vireo in Olive"):

- It reads as olive, not lawn — L 0.5 / C 0.11 sits below and quieter than
  `--identity-moss` (117°), so a moss member's spine never coincides with a
  button. Terracotta primary sat ΔEok 0.03–0.04 from the terracotta member's
  spine; olive primary sits 0.09–0.15 from its nearest members (moss, sage) —
  more separation than the system had, not less.
- Best text contrast of any candidate including the terracotta it replaces:
  white-on-primary 5.8:1 light / 3.5:1 dark (was 4.8 / 3.3).
- 32° from coin brass (90°), so F$ chips and buttons stay different families.
- It vacates the reserved error band's doorstep — terracotta's 35° sat at the
  edge of the ~335°–30° red reservation; 122° is nowhere near it.
- The neutral rotation came out of live review: the clay neutrals were cut for
  an _analogous_ primary, so terracotta's washes read as warmer cream — but a
  10% olive wash over hue-72 cream landed in the muddy in-between, and the
  active nav pill read stained rather than chosen. Rotating the ground toward
  olive restores the original ground-leans-toward-primary relationship.

The "harmonized with primary" role flips: terracotta and marigold members are
now the most vivid against the brand color; moss and sage are the quiet
neighbors.

## Alternatives considered

- **Moss straight port** — terracotta's exact L/C on moss's hue
  (`oklch(0.57 0.14 117)`). Most principled swap, but vivid to the point of
  lawn-green, and it recreates the primary-coincides-with-a-member-spine
  overlap on Milo instead of retiring it.
- **Golden olive** (`oklch(0.55 0.12 108)`) — closest to literal olive-drab,
  but 18° from coin brass; buttons and F$ chips started reading as one family.
- **For the neutrals:** a stronger wash on unchanged clay (16%) treated the
  symptom on one surface while the ground kept leaning away from every other
  olive wash; bone desaturation (neutral chroma halved) was the cleanest
  ground but surrendered the warmth the app has had since day one.

## Watch

`--success` (148°) is now the same color family as primary — ΔEok 0.07, ~2×
the gap the old palette lived with, and they never style the same element
(primary owns actions/selection; success owns the done state in the field, ADR
043). If a primary button next to a success check ever reads muddy, nudge
success cooler toward ~158°; do not move primary.

## Do not revisit unless

The app is renamed again, or the success-green adjacency above fails in
practice on a real surface.
