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
  - Glyph is **14px at `strokeWidth` 2.5** (was 12px / 2, corrected 2026-09-08).
    A lucide stroke scales with its box: at 12px the 24-unit viewBox's stroke-2
    renders as a 1 CSS px hairline on fractional coordinates, which a **1x
    (non-HiDPI) display** antialiases across two pixels before the 75% mute
    fades it again — the mark read as missing on ordinary 1080p/1440p monitors.
    Any glyph added here inherits this: small stroked icons need a _relatively_
    thicker stroke, not the same ratio.
- Never hue-only (ADR 044): the initial is the required second channel. A photo
  avatar is **not** used at 16px — it carries neither hue nor letter at distance.
- **Agenda day header label:** _"Zach's got dinner"_ — the module's own voice,
  right-aligned (avatar 16px + text), attribution only, **never the meal name**.
- **Unclaimed days make no mark.** An ownerless mark has no who, and the who is
  the entire payload. The calendar records; the widget and nudge pressure.

---

## M5/6 + M5/7 — moved to `shopping`

> **Both sections were removed 2026-09-03 (ADR 069).** Groceries left `meals` and
> became the `shopping` plugin, so its UX spec is no longer meals' to hold —
> see `docs/modules/shopping/spec.md`.
>
> They were **already twice-stale** when they moved: the 2026-08-23 design gate
> killed the note line, the chip strip and the three-column wall that the text
> described, and ADR 069 then superseded the gate's own index-of-lists outcome.
> The surviving reasoning — aisle order is walk order, the just-added flash
> answers "did my add land?", corrections teach a family-wide override — is
> carried into the shopping spec. The layout decisions are carried nowhere; they
> are the subject of a fresh design exploration.
>
> Git history has the removed text if it is ever wanted:
> `git log -p -- docs/modules/meals/design.md`.

---

## Decision provenance

The full gate-by-gate record (16 gates: origin v2 / critique / pushback) lives
in the final artifact's decision table. The three held pushbacks: the wall is
the 1060px fridge iPad, not a 24" panel; the week plan stays on `ItemCard` by
ADR 063's own rule; the empty-state history prompt is gated behind "free in
M5/2", not shipped.
