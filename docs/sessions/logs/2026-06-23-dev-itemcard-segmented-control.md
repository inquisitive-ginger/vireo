# 2026-06-23 — Design+Dev: Shared `ItemCard` + `SegmentedControl` primitives

**Type:** design + development · **PR:** #29 (squash-merged to main) · **Origin:** PR #28 (Tablet Month View) review.

Extracted the two cross-cutting UI patterns that feed, chores, and calendar each
hand-rolled — the card-row skeleton and the Month/Week/Day view switch — into
`@family-os/ui` primitives, standardizing the radius/padding drift the month-view
review surfaced.

## Decided (gated with the user before building)

1. **Canonical card radius → 8px**, introduced as a **`--radius-card`** token
   (Tailwind `rounded-card`). Feed + chores had drifted to `rounded-[14px]`,
   calendar to `rounded-lg`. Chose calendar's tighter 8px and tokenized it.
2. **Padding → single fixed `px-4 py-3`** for card chrome (no `density` prop). Bare
   chrome (feed widget/plain) stays padding-free — the slot owns its spacing.
3. **SegmentedControl → custom lightweight** (not Radix Tabs): Tabs' panel semantics
   don't fit a view switch, and a generic value-driven control is simpler. No new dep.
4. **Calendar agenda spines → the `base` identity layer**, not the soft `tint` the
   wide month pills use. (Mid-review correction: the tint read washed-out; `base`
   (`--identity-{hue}`) is the documented spine/marker layer per design-system.md.)

## Built

- **`--radius-card: 0.5rem`** in `packages/ui/src/styles.css` (`@theme` → `rounded-card`).
- **`ItemCard`** (`packages/ui/src/components/item-card.tsx`) — composes `<Spine>` +
  card chrome. Props: `spine` (color | color[] | omit), `chrome` (card | bare),
  `align` (stretch | center), `dimmed`, `trailing`, `as`. Caller supplies its own
  `min-w-0 flex-1` content column.
- **`SegmentedControl`** (`segmented-control.tsx`) — generic over a string-union
  value; a `radiogroup` with roving `tabindex` + arrow-key navigation. Bordered
  track (`p-1`), active segment fills `bg-primary`.
- **`Spine` extension** — `color` now `string | string[]`; multiple colors paint a
  **vertical hard-stop split** (one band per member), mirroring the month-grid lane
  geometry. Single color / one-element array → solid.
- **Retrofits:** `FeedPostCard` (note → `ItemCard as="article"`, widget → `chrome="bare"`,
  plain → unchanged inner), `TaskCard` (`align="center"` + `trailing` toggle +
  `dimmed`, keeps `transition-opacity`), `EventRow` (split spine via new
  `spineColorsForEvent` in `lib/hues.ts`), and `CalendarPage` view switch →
  `SegmentedControl`.
- **Docs:** `design-system.md` gained the ItemCard recipe + `--radius-card`,
  SegmentedControl, and split-spine notes (under _Identity in widget slots_).
- **Tests/stories:** ItemCard + SegmentedControl + Spine RTL tests and stories;
  `spineColorsForEvent` added to the calendar hues test.

## Verification

- **UI 46 tests, calendar 25 tests** green; typecheck + lint clean across
  ui/calendar/chores/family-feed.
- **Live-reviewed** in the real shell (Playwright screenshots): home, feed page,
  chores, calendar month + day; SegmentedControl `aria-checked` flips on click;
  split spine renders at full identity strength (blue/green for a Zoë·Teddy event).
  Two mid-review course-corrections applied and re-verified: SegmentedControl
  **container** padding (not the buttons) and the spine `tint → base` layer.

## Notes for next sessions

- **Story #3 (Event Create / Edit) is next** and is the first consumer of these
  primitives downstream — it also retrofits the chores due-date field onto the
  shared react-day-picker (ADR 037). The drawer can lean on `ItemCard`/`SegmentedControl`.
- `ItemCard.spine` accepting `string[]` is the standard way to render multi-member
  rows now — reach for it instead of hand-building a gradient string.
- Not visually exercised live: `TaskCard`'s taskee (kid) view (trailing toggle +
  completed-dimmed) — it only renders under a child profile; covered by stories +
  tests + typecheck, and the parent chores page rendered clean.
- The month-grid pills/spans still use `fillForHues` (`tint`) — unchanged and
  correct; only the 4px agenda spines moved to `base`.
