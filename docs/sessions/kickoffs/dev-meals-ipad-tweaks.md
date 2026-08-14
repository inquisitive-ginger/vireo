# Kickoff — Meals: iPad review tweaks (ad-hoc, post-M5/2)

**Type:** development · **Branch:** `dev/meals-ipad-tweaks` · Follows PR #105;
Zach's live iPad (fridge wall) review, 2026-08-13. Decisions gated in-session.

## Scope (all decided)

1. **NEXT UP third row cut off** — the tile violated "a widget list fits its
   slot": headline down to display-lg, groove padding trimmed, bands compress
   to `min-h-12`, and `useFitRows` as the whole-row backstop (+N more).
2. **Headline no longer the loudest thing** — hero rung (36px) retired; the
   widget headline is display-lg everywhere but compact.
3. **Takeout owner is optional** — ownerless takeout is covered ("we're
   ordering in"), never escalates, never counts as needing a cook.
   `isCovered()` is the one predicate; spine transparent like going out.
4. **Drawer goes kind-first** — "How's it happening?" leads and the form
   reshapes: cooked keeps the full menu-card grammar; takeout = "Where from?"
   - optional owner; leftovers = "What's on deck?" + owner; out = "Where to?"
     only. No schema change — unused fields null on submit. Amends the M5/1
     field-order call (it was designed around cooking).
5. **Post-dinner tense** — `DINNER_DONE_HOUR` (20:00, client-local beside
   `ESCALATION_HOUR`): verbs flip past ("You cooked"), the escalation window
   closes (16:00–20:00). Real per-family dinner time is M5/3 scope.

## Found during review

- **`useFitRows` measured with `offsetTop`** — relative to the nearest
  positioned ancestor, which only calendar's call site controlled (`relative`
  on the box). Chores' summary measured from the page; meals' groove measured
  from the overlay-link root and clamped to zero rows. Fixed in the primitive:
  list-anchored rect math + 1px subpixel tolerance; meals also measures
  natural band heights (not flex-stretched) and keys its rows on the date
  string (a fresh `Date` per render forced perpetual re-measure).
- **Try-bite chip rides the sides/status line's right edge** — one stack level
  shallower; the card's right half stops being dead air.

## Close-out

Amend design.md §M5/2 (headline tokens, drawer shape, takeout coverage,
escalation window); session log; queue note. Groove-alignment polish stays
queued separately.
