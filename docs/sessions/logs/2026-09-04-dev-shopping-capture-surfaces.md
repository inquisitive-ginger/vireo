# 2026-09-04 — Dev: the capture surface, the widget, and taking back an add (M5.5/5)

**Shipped:** PR #134, merged `55d60cc`. Branch `dev/shopping-capture-surfaces`.
One route, two layouts picked by viewport; the fifth registration point landed;
ADR 070 amended and ADR 073 written.

## What was built

- `/shopping` renders one of two layouts by viewport. **Wide opens on capture
  only**, with a `Show lists` control that routes to `/shopping/lists` — a route,
  not a reveal. **Narrow is the list.**
- The Home widget, and with it `Home.tsx` `WIDGET_META` — the fifth registration
  point M5.5/2 left open.
- **ADR 073 — retract at tier 1**, with a route-side ownership check.
- `section-label-lg` (14px), plus the rewards extraction that unblocked it:
  `design-system.md` 119,825 → 109,949 bytes.

## The no-mode rule is the phone's

The route went `/shopping/wall` → viewport-branching → capture-only-with-a-control
across three live reviews. The wide layout does not violate the no-mode principle:
design.md §"The answer to the axis" answers the axis **for a thumb**, and W2 was
always capture-only at its own route. Merging the two onto one route put both under
one document, and the phone's rule got read as governing a layout it was never
about. Recorded so the next reader does not re-derive the objection.

## Autofocus was firing on neither surface, and every test passed

React 19 renders `autoFocus` as a DOM attribute, which browsers honour **only
during parse** — and every federated remote mounts after parse. Underneath that,
focusing a disabled input is a silent no-op, and the field is disabled while its
first read is in flight. Two independent reasons, one invisible outcome.

Fixing it made the phone's yank real and measurable — `scrollTop: 1272` — which is
what decided Zach on removing autofocus entirely rather than tuning it. **ADR 070
amended: nothing autofocuses.** The prop came off `CaptureField` so TypeScript
rejects it at every call site; a rule that only lives in an ADR gets reintroduced.

## The live review collapsed two controls into one

The selected pill is now both _what you are looking at_ and _where an add lands_.
That coupling is recorded in `design.md` §Anatomy 4: the pill's two jobs **cannot
be separated later** without invalidating M5.5/4's aisle-open key.

The collapse also exposed the gap ADR 073 fixes. Adding is tier 1 and removing was
tier 4, so the fridge could add a typo and never take it back — demonstrated live
(zero remove controls on the family profile), not predicted.

## Two error-handling bugs, one framing

TanStack keeps `data` and still reports `error` on a failed **background**
refetch, which every add triggers via `invalidateQueries`. A wifi blip therefore
blanked a surface that was holding a good list. The framing that fixed both: ask
**"do I have anything true to show"**, not "did the last fetch fail".

## Three instances of one defect, reported as two

Conditionally mounting something above content that reflows. The sweep that missed
the third searched for `useFitRows` consumers — the wrong search. The defect is
named for the mechanism so the next sweep greps the right thing.

## Open, deliberately

- **The `Entry` asymmetry** — a retracted typo stays in the name dictionary. Real
  but **harmless today**: nothing reads `shopping.entry`. `remember()`'s upsert is
  destructive, so un-teaching is not delete-with-care, it is **not expressible**;
  the fix needs a per-name count and its own ADR. Do not patch it inline.

## What the next session needs to know

- `/shopping` and the widget ship **live** here; M5.5/4 disables both afterwards.
- The pill is one control with two jobs. Read §Anatomy 4 before touching it.
- `section-label` still has no block-spacing rule — queued separately.
