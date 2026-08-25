# 2026-08-23 — Design: critique of the dev-ready artifact (M5/6)

Ad-hoc pass, no kickoff. Critiqued and rebuilt
`artifacts/2026-08-23-grocery-list-devready.html`, then made the pass a lane:
`.claude/agents/design-critic.md`. Commit `382c20f`.

## Why the artifact needed a pass at all

Every decision in it was already right. It had come out of the closed design
gate the same day, and its content survived the critique untouched — the words,
the frames, and the rejected directions are all as `96cf1ee` left them. What it
failed at was hierarchy, and the failures were mechanical rather than a matter
of taste:

- The document had **no voice above its own artwork** — `h1` at 31px against
  phone titles at 26px.
- Mockups sat on a ground **3% off their own background** (`--page-bg` 0.955 vs
  `--background` 0.985) under a 0.06-alpha shadow, so the frames read as pale
  rectangles rather than devices.
- The delta block — the one thing a build must not skip — was **styled as body
  copy**, with "new" and "unchanged" fused into one grey box.
- `--accent` was **declared and never spent**; the whole page greyed out.
- Section numbers were inline grey digits at heading size: decoration, not
  structure. Nothing separated the three sheets of drawings from the four
  sheets of contract.

## What rendering caught that reading would not

`.lcard .add` carries `gap: 9px`, and the typed text, the caret, and the ghost
remainder were three separate flex items. The mockup for ghost completion
rendered `but   ter` with a 9px hole in it — **the drawing was showing the exact
failure its own spec forbids.** Fixed by wrapping the run in one `.typing` span.

The phones also did not share a baseline: `align-items: start` let a longer
caption push its frame down, so the three states could not be compared row to
row. Now `grid-template-rows: subgrid`.

Neither is visible in the source. Both are obvious in a screenshot. That is the
whole argument for the lane.

## What changed, and what was not allowed to

House tokens are untouched — Lora/DM Sans, olive primary, blue-grey chrome, all
still read verbatim from `packages/ui/src/styles.css`. A critique that repaints
an artifact has substituted its own taste for the design system, so
`design-critic.md` forbids it.

Structure only: a sheet rail carrying each section number in the margin, banded
**DRAWING** (01–03) or **SPEC** (04–07); a sunken tray behind each mockup group
so the screen is always brighter than its surround in both themes; state chips
on the frame captions; the delta block split with an olive spine on the new
half; the do-not list re-set as a two-column ledger; §7's `<table>` with no
`<th>` replaced by real checkboxes. Plus keyboard focus rings,
`prefers-reduced-motion`, and one caret blink — the only motion on the page, and
it argues for inline completion.

## The lane

`design-critic` renders before it judges, names the mechanism rather than the
feeling, and may not touch house tokens. It runs before an artifact reaches a
build session and before a dev session reports a surface as done —
`dev.md` and `templates/design.md` were amended to route through it.

## What the next session needs to know

M5/6 is still the next runnable session and the artifact is now the input the
kickoff already said it was. `queue.md`'s contract line named only the handoff
`.md`; corrected here, because a kickoff regenerated from that line would have
dropped the rendered artifact and left the build reading prose alone.
