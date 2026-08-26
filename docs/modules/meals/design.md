# Meals & Groceries — UX Design Spec

> Locked in **M5/1 Design: Meals & Groceries** (2026-08-09 → 2026-08-11, three
> rounds + an external design critique). The dev-facing distillation of
> `docs/sessions/logs/2026-08-11-design-meals-groceries.md`. Visual reference:
> `docs/sessions/artifacts/2026-08-11-meals-groceries-final.html` (the decision
> record; the earlier gate doc with the option history is
> `2026-08-09-meals-groceries-ux.html`). New system rules this session minted:
> **ADR 063** (`ListRow` beside `ItemCard`) and **ADR 064** (hue where the person
> answers the surface's question).

---

## Shared language (applies everywhere)

- **The menu-card grammar.** A meal renders as _main + sides + rail_: the `title`
  is the headline, `sides` ride beneath in italic Lora at lower affordance, and
  owner/try-bite share one bottom rail. The **kind lives in the verb**, never a
  chip: cooked → "Zach **is cooking**" · takeout → "**is calling it in**" ·
  leftovers → "**is reheating**" · out → "**we're going out**".
- **Headline face:** Lora at display scale (the type scale has no sans rung
  above 20px; `text-metric` is numerals-only). The same meal name in a **row**
  is 16px DM Sans like every other row title.
- **Escalation is localised, never a wash.** A widget that needs to shout gets
  an amber **badge** in its sides slot + a solid action button; the card surface
  stays `--card`. Rationale: dashboards must stay diagnosable — several widgets
  washing amber at 5pm is a screen that reads as broken. (Design-system entry.)
- **Two flavours of empty, everywhere:** _nothing planned_ (no meal) vs
  _unclaimed_ (meal exists, `owner_id` null). Never conflate them.
- **No identity chrome on groceries** (ADR 064). "Sam got it" / "Emma added
  these" are text notes. Meals surfaces keep identity spines — there the person
  is the answer.

---

## M5/2 — Week Plan + Tonight's Dinner

### `meals.tonight` widget (as shipped — v3 rework, 2026-08-12 live review)

**Two audiences, one card:** the kid zone above a hairline (headline, then
sides with the **try-bite chip on the line's right edge**), the adult
logistics rail below (avatar + kind verb, **second person when the viewer owns
tonight**, past tense after `DINNER_DONE_HOUR` 20:00 — "You cooked", and the
escalation window is [16:00, 20:00)). Headline is **display-lg** everywhere
but compact (page-title) — the 36px hero rung read as the loudest thing on the
wall (iPad review, 2026-08-13); it **wraps to two lines** before ellipsizing.
The **whole tile deep-links to `/meals`** (overlay link, controls z-lifted).

| State                | Headline                  | Below the headline                            | Rail                                         |
| -------------------- | ------------------------- | --------------------------------------------- | -------------------------------------------- |
| Claimed              | title                     | sides italic · try-bite chip                  | owner avatar + verb                          |
| Going out            | title                     | —                                             | Hearth `HandPlatter` dot · "we're going out" |
| Unclaimed (pre-4pm)  | title                     | _"planned — nobody's on it yet"_              | hollow dashed ring · ghost **I've got it**   |
| Unclaimed (post-4pm) | title                     | **amber badge** _"Still needs a cook · 4:30"_ | solid **I've got it**                        |
| Nothing planned      | _"Nothing planned"_ muted | _"the week's still open"_ ¹                   | solid **Plan it**                            |

¹ Fast-follow (was not free in M5/2): the history prompt — _"last Thursday you
did tacos"_. Do **not** build history infra for it.

- **Going out — and ownerless takeout — are covered, not unclaimed**
  (`isCovered()`): takeout's owner is optional (iPad review, 2026-08-13);
  ownerless reads "we're ordering in" with the Hearth dot — no claim, no
  escalation, doesn't count as needing a cook.
- **Large:** **NEXT UP** replaces the seven-chip week strip — the next 3 days in
  a full-bleed sunken groove, equal flex bands, per-row store flag (`N to buy`,
  comma count of `needs`; renders nothing when empty — blank is never
  "everything's in the house"). The groove **fits its slot** (`useFitRows`,
  whole rows + "+N more day(s)"). The widget fetches a rolling today→+3 window.
- Widget escalation hour = the ADR 045 poll hour (one message, two channels);
  the window closes at `DINNER_DONE_HOUR` — after dinner the card records, it
  doesn't shout.

### `/meals` week page (as shipped — 2026-08-13 review rounds)

- `PageContainer width="list"`. Header is the **calendar week view's grammar**:
  the range as the Lora title ("August 9 – 15"), nav pinned right (**This week**
  reset innermost — always visible — then the chevrons outermost, so the cluster
  never moves with the title's width). The cook count is the subline: semibold
  **primary** when >0 (the ask speaks in the action colour, never amber), muted
  regular at zero, hidden for past weeks.
- **Seven `ItemCard` rows** (ADR 063), **equal height** (`min-h-14` content
  column — day slots, not rows that shrink with their state). Spine = owner
  identity hue; **unclaimed/empty rows get a dashed spine** — identity's
  absence, rendered; empty day additionally drops to dashed card chrome;
  **covered-but-ownerless (going out, ownerless takeout) has no spine**
  (transparent — it names nobody; reversed the Hearth-spine call, 2026-08-13).
- **Past days recede:** dimmed, past-tense verbs ("Zach cooked"), **no actions
  at all behind today** — an unplanned past day states "No dinner was planned".
  The page records history; today forward it acts. Today's own verbs flip past
  after `DINNER_DONE_HOUR`.
- Row anatomy: day column (DOW + date, primary-coloured on today) · title 16px
  DM Sans + `· sides` muted inline · meta line (avatar + verb, `· try bite: …`)
  · trailing. **Needs-push** ("3 things needed", a text link, never a bordered
  button) lands with M5/6 — deliberately absent until the list exists.
- Row actions: nothing-planned → **Plan it** only (one-tap "I've got it" on an
  unplanned day needs M5/3's semantics); unclaimed → single ghost **I've got
  it**. Remove lives in `RowActions` and **the page confirms** (`ConfirmDialog`).
- The page is **calm** — no amber ever. The widget and the nudge do the shouting.

### The editor drawer (440px, RHF + Zod)

**Kind-first** (iPad review 2026-08-13, amending M5/1's title-first order —
it was designed around cooking): _"How's it happening?"_ leads and the form
reshapes per kind. Unused fields submit null; the schema is unchanged. No P$:
a paid dinner is a dedicated chore in the chores module.

| Kind      | Title field          | Then                                                        |
| --------- | -------------------- | ----------------------------------------------------------- |
| Cooking   | "What's for dinner?" | sides → try bite → needs → "Who's got it?"                  |
| Takeout   | "Where from?"        | "Who's ordering?" (optional — null: "Nobody in particular") |
| Leftovers | "What's on deck?"    | "Who's reheating?"                                          |
| Going out | "Where to?"          | —                                                           |

- Cooking title: placeholder `Rigatoni`, standing helper _"The headline — name
  it like you'd say it to the kids."_ (helper survives typing; a placeholder
  dies at the first keystroke).
- Try bite (optional): placeholder `the veggies`, helper _"One small thing to
  try — it punches their card."_
- The title/sides split does most of the anti-ambush teaching structurally; the
  helper does the rest.

### Schema

`planned_meals` gains `sides text nullable`. `try_bite` unchanged — sides
describe the plate, the try bite is the ask.

---

## M5/3 — Who's Got Dinner

- Claim = set `owner_id` (one tap from widget rail or week row; no drawer).
- The afternoon poll (ADR 045 precedent) fires at **4:00**: owner nudge (carries
  title + try bite), tier-4 nudge if unclaimed. At the same hour the widget
  flips to its escalated state — badge + solid claim.
- Kind verbs (shared language above) are the only kind rendering anywhere.
- ~~Optional `coinReward`~~ — **retired 2026-08-13** (column dropped in M5/2):
  a paid dinner is a dedicated chore; meals is not an earn source.

---

## M5/4 — Calendar Day Marks (platform, ADR 050)

- **Month cell mark:** 16px identity-**tint** disc carrying the owner's initial
  (`aria-hidden`; owner name in the cell's accessible text) + utensils glyph at
  a **3px** gap, glyph at ~75% muted so the pair reads as **one object**. Max
  two marks per cell (school will be the second consumer).
- Never hue-only (ADR 044): the initial is the required second channel. A photo
  avatar is **not** used at 16px — it carries neither hue nor letter at distance.
- **Agenda day header label:** _"Zach's got dinner"_ — the module's own voice,
  right-aligned (avatar 16px + text), attribution only, **never the meal name**.
- **Unclaimed days make no mark.** An ownerless mark has no who, and the who is
  the entire payload. The calendar records; the widget and nudge pressure.

---

## M5/5 — Try Bites

- On meals surfaces the try bite is a quiet **accent chip**: `Try bite · the
veggies` (accent at 12% wash, accent ink). No gold — gold is XP/reward only.
- The **stamp/punch vocabulary** (dashed square, sunken plane, slam animation)
  belongs to the table-time surface where the kid actually taps — design it in
  this story against the chores punch wall, not on the widget.

---

## M5/6 — The Grocery List (capture + filing)

> The build/shop **mode split is retired**. One aisle-grouped list everywhere;
> "build" and "shop" are contexts, not arrangements. What flat-capture-order
> existed for — "did my add land?" — is answered by the **just-added flash**
> (the row flashes primary-tint in place, in its aisle). What shop mode was —
> big targets, dim-in-place, offline — is how the list always behaves.

- **Rows are `ListRow`** (ADR 063): hairline-separated, leading check ring, name
  17px, note line 13px muted. Height is the primitive's, never restated here
  (ADR 068). No cards — forty bordered cards
  was the density failure the critique caught.
- **Aisle heads govern their group:** 13px bold + count (`2 left`), full-width
  hairline under, sticky within scroll contexts.
- **Add bar at the bottom on the phone** (thumb zone; the top is for reading).
  The chip strip above it shows **staples at rest, typeahead while typing**.
  On the wall the add bar sits top with staples beside it — the width exists
  there and reach doesn't constrain.
- **Items file themselves:** aisle dictionary (~200 keywords shipping) assigns
  `category` on add; unknown words land in **Other** with a one-time
  `Which aisle?` chip row rendered **on the row, in place** — never a layout
  jump above the list. **Corrections teach a per-family override** (one small
  table); re-filing an item updates it.
- Provenance is one grammar: the **note line** — `for Sunday's rigatoni` (needs
  push), `Emma added these` (manual), `Sam got it` (checked). Never a chip in
  the name line.
- Meal `needs` push: comma-split into items, each noted with its meal; dedupe
  by name against open items (re-adding an existing checked item unchecks it).

---

## M5/7 — Shop Context, Sync + Offline, the Wall

- **Whole-row tap toggles** got/needed; tap again undoes; nothing on a row is
  destructive. Checked rows **dim in place** (0.46 opacity + strikethrough) and
  keep position.
- **A fully cleared aisle collapses** to a stated row — `✓ Bakery · all 2 in
the cart`, tap to reopen. This is the sanctioned reading of "dim in place,
  never vanish" (spec.md amended): the rule answers _"did I already get
  that?"_, and the stated row answers it better than dimmed lines. Individual
  checked items still never vanish.
- **Progress is structure:** `2 in the cart · 8 to go` + a filled track under
  the page title, on every surface. Completion is a real moment — the track
  fills, aisles collapse, the list physically shrinks as the store is walked.
- **Fixed walk order:** Produce → Bakery → Meat → Dairy → Pantry → Frozen →
  Other. Per-family reorder is a **named non-goal** (revisit only if the fixed
  order demonstrably annoys).
- **Partner sync renders as text**, not identity chrome (ADR 064): a row checked
  by the other shopper reads `Sam got it` in the note line.
- **Offline:** quiet pill under the title — `Offline — checks will sync`. Not a
  banner, not amber; offline is expected, not exceptional. (The SW work itself
  is this story's other half; see queue.)
- **The wall (fridge iPad, ~1060px content):** aisles as **three balanced
  columns** — the whole list visible, no scrolling, groups never split across
  columns (`break-inside: avoid`). Header carries the one fact only the wall
  can: **"Sam is at the store right now"** (green pulse dot), derived from
  check activity — no new tables. Column re-flow after add/clear is accepted
  pending a check on the physical fridge before this story closes.

---

## Decision provenance

The full gate-by-gate record (16 gates: origin v2 / critique / pushback) lives
in the final artifact's decision table. The three held pushbacks: the wall is
the 1060px fridge iPad, not a 24" panel; the week plan stays on `ItemCard` by
ADR 063's own rule; the empty-state history prompt is gated behind "free in
M5/2", not shipped.
