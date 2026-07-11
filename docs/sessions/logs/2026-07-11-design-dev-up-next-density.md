# Design + Dev: Up Next — Density Rework (PR #36)

**Date:** 2026-07-11
**Type:** design + development (ad-hoc — no kickoff doc; scope came from a live
critique of the shipped widget plus a reference mock)
**Shipped:** PR #36 (merged) — `[calendar/up-next] Density rework — three zones,
and the sunken surface plane (ADR 040)`

---

## The problem

The `calendar.up-next` widget bucketed every event by **every day it touched**
(`upcomingByDay` → `eventsForDay`). A week-long camp therefore claimed a row on
all five of its days and swamped the actual appointments. Two things fell out of
that, both found during the exploration:

- **A latent bug.** Each day re-emitted the same event id, so a multi-day event
  produced **duplicate React keys**. It had never been caught because the widget's
  story fixtures contained no multi-day events at all — spans were never really
  designed into that list.
- The 42-day query window closed the tile on a **"+40 more"** CTA that read as a
  backlog rather than an offer.

---

## What was decided

### The shape — three zones, three ranks

Multi-day events leave the day list entirely for a dedicated band, and the window
is capped at **one week** (today + 6). The tile is a hierarchy, not a list, and
each zone wears a **different surface** so none reads as a peer of the others:

| Zone          | Surface      | What it is                                                      |
| ------------- | ------------ | --------------------------------------------------------------- |
| Hero          | **raised**   | the next event, washed in its owner's hue — a _moment_          |
| All-week band | **recessed** | spans, cut into the tile as a full-bleed groove — a _condition_ |
| Day list      | **flat**     | appointments in a day gutter — a _sequence_                     |

The band is the **only element that touches both edges** — which is exactly what a
multi-day event does to a day-by-day view: it runs past the frame. Content
justifying form.

**Why the earlier passes failed** (worth recording, because it took four): the
span band kept **borrowing its grammar from a neighbour**. As a filled card it
borrowed the hero's and read as a second hero; folded into the day gutter it
borrowed the list's and got lost among the days. It had no material of its own.
The axis that finally resolved it was **material, not position**.

Rejected along the way, each rendered rather than argued: a **marquee** (identity-
washed full-bleed stripes — but colour is the hero's weapon), a **status line**
(hierarchy by compression — too quiet, the failure we'd just had), a **plinth**
under the hero (liked, but it binds spans to the hero rather than the tile), and a
**seven-cell extent track** leading each span row. The track died on a good
question — _"what do the small pills represent?"_ — which is the answer: it was a
chart with no legend, implying a week grid the widget draws nowhere else, restating
a date range the row already spells out in words.

### ADR 040 — the sunken surface plane

The groove needed a surface meaning _below the card_, and **the system had none**:
the elevation ladder only ever climbed (`--background` → `--card` → shadows). The
single candidate, `--secondary`, **already carries a second meaning** — under the
identity palette it is the **Family fill**, the wash a no-owner event wears. So a
Family-owned hero sat directly on a band of the _identical beige_, one surface
saying "belongs to everyone" and the other "sits underneath", with no seam. `--muted`
could not rescue it (a near-duplicate: 0.93 L against 0.93).

`--surface-sunken` is deliberately **near-achromatic** — chroma `0.006` against
`--secondary`'s `0.022`. **That property is load-bearing, not taste:** every
identity fill is chromatic by construction (ADR 030), so a desaturated plane can
never be mistaken for one, whichever member's hue lands beside it. It ships paired
with **`--shadow-inset`** — the tint alone is a grey rectangle; the inner shadow is
what makes it a groove. Both tokens carry light + dark values; folded into
`Foundation/Elevation` (new **"The sunken plane"** story, which renders the
`--secondary` collision beside the fix) and `design-system.md` §Surface elevation.

> **`--secondary` carrying two meanings is a live fault line.** It bit **three
> separate times** this session: the band, the hero-vs-band seam, and the Family
> owner pill dissolving into its own hero. Each was patched locally. The ADR names
> the real fix — **re-home the Family fill off `--secondary`** — and leaves that
> door explicitly open. **Queued as a follow-up.**

---

## What else shipped

- **`WIDGET_INSET`** (`@family-os/ui`, beside `WIDGET_CQ`) — `WidgetSlot`
  contributes **no padding** (it is chrome only), so every widget owned its own
  inset and they had drifted. Now one scale: **16 / 20 / 24** by size variant. One
  value can't serve every slot — a 1×1 has ~148px of content height, so the 24px
  that lets the 2×2 feature tile breathe would cost the small tile an eighth of its
  height. Applied to calendar, chores (6 of 11 sites; compacts stay at 16), and
  family-feed — retiring its hand-rolled `14px 18px 16px`, an off-grid value the
  2026-07-10 spacing rule already banned. Documented in `design-system.md` §Spacing.
- **Owners as avatars, not names.** The avatar is a **strict superset** of the
  spine — same identity hue, plus the initial that disambiguates it — so a row needs
  only one of the two markers. Shared events are where they diverge: two overlapping
  avatars beat a split bar you have to decode.
- **`lib/week.ts`** — `buildWeek()` splits the window into spans + timed days
  instead of bucketing by touched day. 11 tests, incl. the span that started before
  today and is still running, and the window edge (`beyond`).
- **Hero tidy** — dropped the identity dot (**invisible** on a Family wash, and
  silently indenting the eyebrow **14px** off the title's edge), unified the meta
  line to one type size (owner pills 10px→13px, matching the location beside them),
  and **ringed the Family pill** so it stops dissolving into its own hero.

---

## Gotchas worth carrying forward

- **`leading-tight` is silently dead on `text-*-token`.** Those utilities bake
  their own line-height and win the cascade, so the class does nothing. This cost
  three attempts at the gutter alignment: the inset was being computed against a
  17.5px line box that never existed (it's 21px). **The fix that worked was to stop
  computing and _mirror_ the row's geometry** — same inset, same 28px band, same
  centring — so alignment holds by construction and survives a line-height change.
  This is the same family as the sidebar session's `text-xs-body` trap: **a token
  class that looks applied and isn't.**
- **A full-bleed child must negate the widget's inset** (`-mx-6` under `p-6`). If
  the inset scale ever moves, the groove's bleed has to move with it.
- **`min-height` is border-box.** A `min-h-7` floor with `py-2.5` leaves an 8px
  content band, not 28 — which is how rows without avatars collapsed and let the
  day label drift.

---

## Open questions / owed

- **Day-list titles are 14px**, under `design-system.md`'s own **18px
  "across-the-table" floor** for widget content. The shipped widget already broke
  this; raising it costs real rows-per-tile, so it was flagged rather than smuggled
  in. **Queued.**
- **Chores and family-feed have no test files at all** — their padding change rests
  on typecheck and visual review. Worth knowing before the next change lands there.
- The **mobile `AgendaView`** still lists a multi-day event on every day it covers
  (same `eventsForDay` path). It doesn't produce duplicate keys there (separate
  per-day lists), but it is the same density problem on a different surface.

---

## Testing

`ui 85 · calendar 81 · api 206 · shell 3` — green, plus lint + typecheck across 20
turbo tasks. Live-reviewed in the running shell across profiles and slot sizes;
signed off before close-out. The four-direction Storybook exploration
(`Calendar Exploration/Up Next — Density`) was **removed post-approval**, per the
established playground lifecycle.
