# 2026-07-11 — Design + Dev: Family Fill Re-home, Span Primitive, Type Floor (PR #37)

**Type:** Design + Development
**Scope:** the three follow-ups owed by the up-next density session (`2026-07-11-design-dev-up-next-density.md`)
**Outcome:** shipped, merged as PR #37

---

## What was asked

Three follow-ups, carried into their own session:

1. What should the Family fill re-home to? (ADR 040 named the fault line and left the door open.)
2. "I think 14px is fine for the widget — is that just an ADR / design-system doc update?"
3. Apply the first-class multi-day primitive to the mobile agenda too.

Two more bugs surfaced during live review and were fixed here rather than queued.

---

## 1. The Family fill re-homes off `--secondary` — ADR 041

`--secondary` carried **two meanings** — structural chrome _and_ the Family fill — and
they collided three times in a single session (the invisible hero dot, the dissolving
Family pill, and the band needing a recessed neutral that was already spoken for).
ADR 040 patched the third symptom; this is the root fix.

**Decision: a reserved seventh identity entry — `family`, "Hearth", a warm stone.**

- Excluded from `IDENTITY_HUES` (the rotation the name hash draws from), so
  `getIdentityHue()` can never hand the household's colour to a person. Surfaces that
  can hold either accept the wider `OwnerHue` (`IdentityHue | 'family'`).
- `huesForEvent([])` now returns `[FAMILY_HUE]`, not `[]`. Fills, spines, pills and
  avatars take **one path**; the "no owner" branch is gone.
- `--secondary` means one thing again: chrome.

### The mistake worth remembering

The first values shipped at chroma **0.035**, justified against the members' **base**
layer (0.09–0.13), where anything that low looks comfortably recessive. **But fills
don't use the base layer — they use the tint**, and there the six run **0.035–0.05**.
At 0.038, Hearth's tint was a _peer_ of terracotta's 0.04 and only 25° from it in hue:
on screen the Family hero and a terracotta member's chore row were the same pale peach.
That is exactly the "colour = person" violation ADR 041 exists to prevent, relocated
rather than fixed.

Caught by **measuring the computed background**, not by looking at a swatch — the
palette _looked_ fine in isolation. Corrected to a tint of **0.018**, roughly half the
least-saturated member tint.

Chroma had no room to also separate Hearth from `--secondary` (0.022) — the gap between
chrome and the members is too narrow — so it separates from chrome on **lightness**
instead (0.90 vs 0.93 light; 0.285 vs 0.22 dark). **Two axes, two different neighbours.**

Hearth must stay **chromatic**: ADR 040's guarantee (a desaturated plane can never be
mistaken for an identity fill) holds only while every identity fill has colour in it. A
grey Family would have broken ADR 040 retroactively — which is why the "Ghost / no
colour" option was rejected despite its clean logic.

### Also found

The shell hashed the **family's own name** into a member hue for its avatar (sidebar
chip, profile grid, mobile top bar) — the household wearing a sibling's colour.
`ProfileAvatar`'s `identity` prop widened to `OwnerHue`; the household passes
`FAMILY_HUE`.

---

## 2. The multi-day primitive reaches the mobile agenda

New **`SpanBand`** — one anatomy, **two containers**, chosen by the ground underneath:

| Container | Surface                             | Treatment                                        |
| --------- | ----------------------------------- | ------------------------------------------------ |
| `groove`  | inside a card (the up-next widget)  | full-bleed `--surface-sunken` + `--shadow-inset` |
| `panel`   | directly on `--background` (agenda) | resting `--card` + hairline + `--shadow-card`    |

The `panel` exists _because_ of ADR 040: a recess is illegal on `--background` (a groove
needs something to be recessed **into**), so the same rows get an elevated container
rather than a sunken one. Same primitive, different claim about depth.

**The window decides where a span is stated.** A one-week view can pin them all ("All
week"). A six-week scroll cannot — a camp three weeks out is not "all week" — so the
agenda pins only what is **already running** ("Ongoing") and states the rest **inline,
once, on the day they begin**. New `buildAgenda()` in `lib/week.ts`.

The agenda had the same `eventsForDay` density bug the widget just fixed: a week-long
camp claimed a row on all five of its days.

### Fallout caught by tests

- Delegating to the shared band **lost the widget's "mine" framing rule** (member avatars
  are suppressed there). Fixed by threading `showMembers`, and by extracting the
  duplicated owner marker into one `EventOwners`.
- A `CalendarPage` fixture pinned an event to **noon absolutely**, so it had quietly
  become a _past_ event — the test passed or failed depending on the wall clock. Made
  relative to `now`.

---

## 3. Type floor — docs only, as suspected

The viewing-distance rule named **widgets** as the across-the-room category. That's too
broad: **a widget is a container, not a distance.** The same up-next tile is read at
arm's length on a laptop and from six feet away on the kitchen wall.

Rescoped by **distance**: close-up surfaces (phone, laptop, home dashboard) go down to
`base` (14px) for primary content; the across-the-room wall tablet keeps the 18px floor.
This _sharpens_ the family-profile surface rather than softening it — it's now the named
place the floor applies, which supports (rather than contradicts) the queued family-wall
typography item.

---

## Two bugs found in live review

### The sunken plane was broken in toggled dark mode

`styles.css` has **three** theme blocks: `:root`, the `prefers-color-scheme: dark` media
query, and `[data-theme='dark']` (the in-app toggle). ADR 040 shipped
`--surface-sunken` / `--shadow-inset` into the first two **but not the third** — so under
the toggle they silently fell back to the **light** values. A near-white groove with
`--foreground` text on it.

**A token missing from a theme block doesn't fail — it inherits.** And it only affects
users who _toggled_ the theme rather than inheriting it from the OS, so every
OS-preference screenshot (including mine) looked correct. Audited all three blocks for
the same class of drift; parity is now exact. Written up in `design-system.md` §Dark mode.

### The home dashboard served new rungs on stale geometry

Reported by the user: chores (`card`) rendered **below** the feed (`quiet`) for a parent —
a lower elevation rung stacked above a higher one.

Two causes:

- **Six copies of the composition, drifted.** The API's `default-layouts.ts` and the DB's
  `system_config` were correct; the Prisma seed and two test files kept their own stale
  copies (feed above chores). The API took **geometry** from the DB while deriving
  **prominence** from code — so it served the new rungs on the old positions.
- **The layout was frozen.** `GET /home/layout` copied the default into `widget_layouts`
  on a profile's first page load (as did profile creation), and those rows won every later
  read. With no layout-editing UI, they recorded **no user intent** — a cache of a default
  that had since changed, and no correction could ever reach an existing profile.

Fixed:

- The composition moves to **`packages/platform/src/home-layout.ts`** — one definition,
  imported by the API, the seed and the tests. `prominence` is stripped before writing
  `system_config` (it is derived, and must never be stored).
- **The default is served, not persisted.** `seed-layout.ts` and its four call sites are
  gone. A persisted layout still _wins_ if one exists — the hook a future customization UI
  writes through — but nothing writes one until the user actually customizes. A migration
  drops the stale rows.
- **The route had no test at all**, which is why this survived review. Added `home.test.ts`
  (6), including the two that would have caught it: _a higher rung never sits below a lower
  one in a column_, and _a changed default reaches an existing profile instead of being
  pinned_.

---

## ADR 039 amended — `feature` is optional, and parents have none

Decided mid-session (user's call): `default_layout_tier_3_4` ships with **no feature
widget**. The invariant relaxes from _exactly_ one per surface to **at most** one.

The rung claims _"this is the one thing you came for."_ That's true for a kid (today's
chores) and for the unattended wall (the feed banner, read across a room). It is **not**
true for a parent, who opens the dashboard to **triage** — calendar, chores and feed are
all live answers to "what needs me". Forcing a feature there manufactured a hierarchy the
surface doesn't have, and spending the ladder's loudest rung on a claim that isn't true
devalues it everywhere it _is_ true.

A surface with no feature is not a surface with no hierarchy: the calendar still holds the
2×2 and the leading column. Size and position carry the ranking; elevation declines to
overstate it.

---

## Decisions

- **ADR 041** — the Family identity hue (Hearth). Amends 030, 040, 031.
- **ADR 040 amended** — the door it left open has been walked through; the sunken plane
  still stands (a recess must not borrow the hover surface either).
- **ADR 039 amended** — `feature` optional; parents have none; reading order must agree
  with elevation.
- **`design-system.md`** — identity palette (the reserved family hue), the multi-day span
  primitive, the type-scale viewing-distance rescope, the three-theme-block dark-mode trap.

## Gotchas for the next session

- **Judge a colour on the layer that renders it.** Member hues are compared at `base`, but
  fills use `tint`, where every hue is already desaturated. A chroma that looks recessive
  against the base layer can be a _peer_ at the tint layer.
- **A token missing from `[data-theme='dark']` inherits the light value silently.** It
  won't error, and OS-preference testing won't catch it. Grep all three blocks.
- **`GET /home/layout` no longer persists.** Don't reintroduce a write on read — that's
  what froze the defaults.

## What the next session needs to know

- Green: ui 85 · platform 33 · shell 3 · api 208 · calendar 89. Typecheck + lint clean.
- Live-reviewed: tablet + mobile, light + dark (OS preference **and** toggle), family and
  member profiles.
- **M3 is still one story from MVP-complete** — Event Reminders (story 6) is the last one,
  and it is still gated by the owed reminder-scheduling ADR.
