# Design + Dev — The app icon set

**Date:** 2026-08-22 · **Type:** design + dev · **PR:** #122 (merged `ff37279`)
**Artifact:** https://claude.ai/code/artifact/e6a5e466-f073-4520-a945-b2c65ae1379f

Ad-hoc session — no kickoff was written first, contrary to rule 2.

---

## Shipped

Two adult vireos and two young looking out of a lit birdhouse. Full ladder
16→512, both maskables, a notification stencil, `favicon.ico` with true per-size
frames, four SVG masters. The manifest needed no change — `theme_color` was
already `#596C17`, the ground the new mark uses. `packages/ui` untouched.

## The three decisions

**Generated, not hand-drawn.** The first pass was hand-authored SVG and was
crude — correctly rejected. It went through the companion pipeline
(`companion-art/gen.py`) instead: 44 candidates over six rounds.

**Flat won outright — a finding, not a preference.** Round one tested four style
treatments across seven subjects. Every soft-dimensional and paper-cut candidate
carried gradients, drop shadows or grain that fight the design system; all cut.
Do not re-test them.

**The bird is olive-green because it never touches the ground.** The objection —
green mark on green icon — does not apply: the bird sits inside the near-black
aperture and is read against that. It reads _better_ small than the white bird it
replaced, which sat on a white house with almost no internal contrast.

## The vireo green

`#92AA54` is `--primary` lifted to L 0.70 at the **same hue, 122** — the bird is
made of the brand colour. That clears ADR 044 for free: 122 is not a member hue,
so no argument about a member's colour doing a second job. The same reasoning
moved the icon's warm accent off `--identity-marigold` (78) to hue 70.

**These are not tokens and must not become tokens.** An icon is stamped once and
never recoloured, so the palette is theme-invariant and lives only in
`scripts/brand-icon/`, like the coin metal (ADR 051).

## The notification square

`badge` pointed at `icon-192.png`. Android keeps only a badge's **alpha channel**
and tints the result, so an opaque PNG masks to a square. iOS ignores `badge`
entirely — hence Android-only.

The stencil is _derived_: ground marks what is outside the mark, near-black marks
the inside of the opening, so `build_svgs.py` reads both off the icon and knocks
opening, eyes and perch back out. It cannot drift from the icon.

## What the model would not do

Enforced after the fact in `normalize.py` rather than prompted for: **margin**
(it ignored every framing instruction — mark is bounding-boxed and recomposited
at 74 % of canvas) and **flatness** (grain and soft gradients — flat regions snap
hard to the palette, edge pixels left alone so antialiasing survives; 96–99 %
on-palette). A third — tails spilling onto the white house — needed no prompt
fix: containment is a clip in the vector.

## Why there is a tracer

`trace.py` walks the pixel lattice rather than curve-fitting. The art is already
quantized to flat colours, so boundaries sit exactly on the lattice and can be
walked instead of guessed — the vector is the art, not an interpretation.
Fidelity: **mean abs diff 0.95/255**.

Two traps, both handled:

- Nearest-palette assignment is wrong at edges — an antialiased cream-over-olive
  pixel passes close to the pale grey, growing phantom regions. Only confident
  pixels claim a colour; the ambiguous band floods outward from them.
- `#E5E0CE` looked like fringe and is not: it is the birds' **throats, breasts
  and eye-rings**. A half-step off the house white stops them merging with it.

All four masters come from one trace so they cannot drift. Only the favicon
substitutes geometry, and only for the aperture — it keeps the traced house and
perch but redraws the opening as circles, since dropping the birds from the
traced opening leaves bird-shaped holes onto the ground.

## Verified

Trace fidelity 0.95/255 · `maskable-512` **0** pixels outside the 80 % safe
circle · `badge-72` **67 %** transparent · every path in manifest, `index.html`
and `sw.js` resolves · `favicon.ico` has true 16/32/48 frames.

## Open

**The e2e suite was never run.** The new `pwa.spec.ts` badge test typechecks and
is Prettier-clean but is **unrun** — the assertion was verified directly against
the PNG instead. CI runs typecheck, lint, test, build — **not** e2e — so the
merge did not cover it. Run `pnpm e2e` when the test DB and three servers are up.

**Nobody has seen it on a real phone.** Install the PWA on Android and confirm
the status-bar badge draws the birdhouse, not a square.

## Next

Pipeline reuses for any brand raster: `run.sh` → `normalize.py` → `trace.py` →
`build_svgs.py` → `rasterize.mjs`. Needs `GEMINI_API_KEY` from
`~/.secrets/artgen.env`. Running `rasterize.mjs` in a worktree needs
`pnpm install` there first — it resolves Playwright out of `packages/e2e`.
