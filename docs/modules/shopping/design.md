# Shopping — the settled surface

**Settled** 2026-09-03, M5.5/1. Gate answered by Zach against
`docs/sessions/artifacts/2026-09-03-shopping-surface-explorations.html`, which is the
picture this document describes — read the two together. **The artifact is an input to
M5.5/2, not an appendix**; sections S1–S3 and W2 are the surface.

Governing decisions: **ADR 069** (own plugin), **ADR 063** (`ListRow`), **ADR 064** (no
identity chrome), **ADR 032** (one nav entry), **ADR 070** (`CaptureField`).

## The answer to the axis

> **You are about to add something, into a list that is already in walk order.**

The capture field is the hero at rest; the aisle-ordered list is the page. The field is
not a mode and the list is not a mode — the field scrolls away under the thumb when you
are in a shop, and nothing switches. Three directions were rejected and are drawn in the
artifact with their costs: shop-first alone (wrong posture for the common open),
needs-first (one stream, three aisle vocabularies), trip-first (a run is ceremony, and
reverse-chronological is the worst order in an aisle).

**The rejected shape stays rejected.** There is no index of lists and no drill-in.

## Anatomy — `/shopping`

`PageContainer width="list"`. Top to bottom:

1. **Title row** — `PageHeader`-shaped: `Shopping` (page-title) with the count strip
   (`14 to get`) on the trailing edge. The count is `sm` and muted; it never shouts.
2. **The capture field** — `CaptureField` (ADR 070), 56 px, the first thing under the
   title. Live on arrival on the wall and on the Home widget; on the phone it does **not**
   autofocus (an unrequested keyboard on a route you opened to read is hostile). Trailing
   slot carries the **destination chip** (`Grocery ▾`).
3. **The filing echo** — one `sm` line under the field while composing:
   `Enter to add · files under Pantry`. The aisle is stated **before** the commit, so a
   mis-file is caught by the person who caused it. On submit the field clears and stays
   open; the new row appears in its aisle.
4. **The destination strip** — `Chip` pills, one per list, with counts
   (`Grocery 14 · Costco 3 · Hardware 2`). Selecting one **swaps the list in place**.
   It is a filter. It is never a screen you land on.
5. **The list** — `ListRow` per item (ADR 063/068: hairline, 56 px floor, leading slot).
   The leading slot is the check ring; the whole row is the tap target. Name is
   `card-title`; the note line is `sm` and carries **producer words only** — why the row
   exists, not who put it there: `for Thursday`. **No spine, no hue, no avatar**
   (ADR 064). Most rows have no note line at all, which is the resting state, not a gap.

   **Who added a row is never shown** (live review, 2026-09-03). `added_by` is still
   stored — permissions and audit need it — but a shared list does not answer "whose
   milk is this", and `Emma added` on thirty rows is noise between the shopper and the
   next word they have to read. This retires the earlier anatomy's `Emma added` /
   `Sam added · just now`, and with it the family profile's rendered attribution
   (ADR 072 §3, amended).

   **Aisle grouping follows the list's own flag**, `group_by_aisle` — it is a property of
   the destination, not of the app. Grocery groups under `section-label` aisle headers in
   walk order; a warehouse club or a hardware run renders **flat, in the order things were
   added**, because imposing a grocery walk on a shop that has none is an order its
   shopper cannot see. Costco ships `false`.

### In a shop

The same screen scrolled. Above the fold once the hero has gone: a compacted status line
(`Grocery · 6 of 14` + the destination chip) and the **progress meter**
(`--spacing-meter`, `--primary` on `--muted`). A **cleared aisle collapses** to one muted
summary row (`Produce · 3 in the cart ›`) so the walk keeps moving. Checked rows dim to
`0.66` with a strikethrough on the name.

### The one rule that keeps it out of the rejected shape

The destination strip degrades. Three pills is a strip; seven is an index wearing a
costume. **If a sixth destination ever appears, that is a design question**, not a
horizontal-scroll affordance.

## One surface, two layouts

**Settled 2026-09-04, live review.** `/shopping` is a single route. Which layout it
draws is chosen by the **viewport**, at the shell's canonical `md:` (768 px) split —
never by the profile, and never by a control on screen.

- **Tablet and up — capture.** `What do we need?` at `display-xl`, a 76 px
  `CaptureField` below it (**autofocused** — this is a screen you walked up to in
  order to type), a **Hold to speak** affordance reserved in the trailing slot
  (**voice is not M5.5 scope** — the slot is reserved, nothing implements it), a
  **Just added** strip of the last few items as chips naming **what** was added, never
  who (§Anatomy 5; ADR 072 §3/§4 withdrawn), and a rule stating the total
  (`19 things waiting`). Then the same aisle list, directly beneath.
- **Below tablet — the list.** §Anatomy exactly as shipped: compact title row,
  56 px field, destination strip, aisle list. It does **not** autofocus.

**Neither layout is a mode**, which is the same rule §"The answer to the axis" states
for the field and the list. Nothing toggles: the capture block is simply the size it
should be on a screen you stand in front of, and the list follows it down the page the
way it does on a phone. There is no second route, no switch, and no way to be in the
"wrong" one — resizing a window moves between them, which is also how they are
reviewed.

**Why not a separate surface.** It was built once as its own route (`/shopping/wall`)
and rejected on sight: nothing linked to it, so the first question anyone asked was how
to reach it, and its one exit was one-way. Branching on `FAMILY_PROFILE_ID` instead
would have made it unreachable from any other device, and so unreviewable. The
wall-mounted tablet is a **device** in the house — ADR 072 is about how that device's
adds are attributed, and is unaffected — but the surface it shows has no separate
identity and carries no separate name.

**The per-destination counts are not repeated under the hero.** They live one block
down in the destination strip, where they are tappable rather than merely stated.

**The distance-label decision this surface owed is settled** (2026-09-04): structural
labels get a distance variant, `section-label-lg`, rather than promotion to `heading` —
see `design-system.md` §Type scale. `Just added` uses it.

## Adding from anywhere in the house

The fastest add is the one that never navigates. Three paths, all shipping the same
`CaptureField`:

| Path             | Cost to the user    | Notes                                                                                                      |
| ---------------- | ------------------- | ---------------------------------------------------------------------------------------------------------- |
| Home widget      | **zero navigation** | The dashboard is the first screen after login. Capture line + the newest rows + `+N more` via `useFitRows` |
| The Shopping tab | one tap             | Requires the pin below                                                                                     |
| The wall         | walk up to it       | The W2 surface                                                                                             |

### The tab pin — a decision M5.5/2 must execute

The mobile bottom tab bar caps at **5** (ADR 033, amended 2026-08-17): Home + the first
three tier-visible plugins by `plugins.json` order + More. `shopping` is a sixth plugin,
so **by default it lands inside the More sheet** — two taps and a sheet, which loses to
Keep before the surface design gets a vote.

**Settled at the gate: Shopping is pinned and `chores` moves into More.** The phone reads
`Home · Calendar · Meals · Shopping · More`. Reorder `plugins.json` so `shopping` precedes
`chores`; the sidebar on tablet is unaffected (it lists everything).

## Deliberately not designed here

Additive later; neither is a bug when it is missing.

- **A live run** (direction D) — the house cannot see that someone is at the store, and
  "anything else while I'm here?" stays a text message.
- **A whole-house glance** (direction C) — "do we need anything anywhere?" means reading
  three pill counts, not one list.
- **Voice capture** — the wall reserves the slot; nothing implements it.
- **Offline** — M5.5/4, and it is real: the SW is network-first for `/api`, so the list
  fails where it is used. Nothing above assumes a live connection to be _legible_.
