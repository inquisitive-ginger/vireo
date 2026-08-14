# 2026-08-13 — dev, meals/ipad-tweaks (ad-hoc, post-M5/2)

**Shipped:** PR #106 — the fridge-iPad review round on the just-deployed M5/2,
plus a real `useFitRows` bug the round surfaced.

**The widget:**

- **NEXT UP obeys fits-its-slot** — the third day was shearing off. Headline
  drops the 36px hero rung (display-lg everywhere but compact — it was the
  loudest thing on the wall), groove padding trimmed, bands compress to
  `min-h-12`, whole-row clamp + "+N more day(s)" as the backstop.
- **The `useFitRows` bug (primitive, affects chores too):** rows measured via
  `offsetTop` — relative to the nearest _positioned_ ancestor, which only
  calendar's call site controlled with `relative` on its box. Chores' summary
  measured from the page; meals' groove measured from its overlay-link root
  and clamped to **zero** rows. Fixed in the primitive: list-anchored rect
  math + 1px subpixel tolerance — call sites can no longer get it wrong.
  Meals also measures natural band heights (not flex-stretched) and keys its
  rows on the date string (`Tonight.tsx` makes a fresh `Date` per render;
  unstable identity forced a re-measure every pass).
- **Post-dinner tense:** `DINNER_DONE_HOUR` (20:00, client-local) — verbs go
  past ("You cooked", "we went out", "we ordered in"), the escalation window
  is now [16:00, 20:00), unclaimed reads "planned — nobody claimed it". The
  week page's today-row flips too. Per-family dinner time is M5/3 scope.
- **Try-bite chip rides the sides/status line's right edge** — one stack level
  shallower; the card's right half stops being dead air.

**Takeout owner is optional** (gated in-session): ownerless takeout is covered
— "we're ordering in", family dot, transparent spine, never escalates, never
counts toward "days need a cook". `isCovered()` stays the one predicate.

**The drawer goes kind-first** (gated in-session; amends M5/1's title-first
order, which was designed around cooking): "How's it happening?" leads and the
form reshapes — cooked keeps the full menu-card grammar; takeout = "Where
from?" + optional "Who's ordering?" (null chip: "Nobody in particular");
leftovers = "What's on deck?" + "Who's reheating?"; out = "Where to?" alone.
Unused fields submit null; switching kind after typing can't smuggle a cooking
plate onto a restaurant. No schema change.

**Verification:** ui 192 / meals 26 / calendar 129 / chores 113; typecheck,
lint, full turbo build green.

**Next session needs to know:** groove-alignment polish (calendar/meals sunken
tops near-miss) still queued; M5/5 teal-chip note stands.
