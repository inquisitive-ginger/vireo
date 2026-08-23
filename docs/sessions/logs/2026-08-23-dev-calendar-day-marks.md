# 2026-08-23 — dev (platform), calendar/day-marks (M5/4)

**Shipped:** PR #125, merged `53996a1`. ADR 050's read-time day-mark provider
contract at platform level, with `meals` as its first consumer. Branch
`dev/platform-day-marks`.

## What was built

- `packages/platform/src/day-marks.ts` — `DayMarkProvider { name, action,
subject, fetch }` + a per-process registry, decorated onto Fastify by the
  calendar plugin (the surface that owns the read). `action`/`subject` are loose
  `string`s, not the app's closed CASL unions, so a plugin whose subject doesn't
  exist yet (M7 School) can still register.
- ADR 066's two gates, conjunctively: the range endpoint 403s exactly as
  `GET /calendar/events` does, and the aggregator checks
  `ability.can(action, subject)` **server-side before calling `fetch`**; `fetch`
  still receives the caller's `ability` for its own row conditions. Cap applied
  after filtering.
- `plugins/calendar` imports nothing from meals: a provider sends the string
  `'utensils'` and `lib/day-mark-glyphs.ts` is the only place a glyph name
  resolves to a component. M7 School adds an entry there, not an import.
- Month cell: identity-**tint** disc + owner initial + glyph. Agenda day header:
  _"Zach's got dinner"_, attribution only.

## Acceptance criteria status

All 7 pass — **but AC3 and AC7 no longer describe what shipped.** Read the next
section, not the ACs, for the layout that exists.

## Three rounds of user feedback; the last two changed the design

1. **Marks moved out of the cell flow to the date row.** In the flow with the
   event chips they got lost.
2. **Marks are today-forward only.** Past days render none — _"don't really care
   that I made dinner last Tuesday at a glance."_ Implemented as a render-level
   filter in `MonthGrid`, deliberately **not** in the provider contract, the
   aggregator, or the range endpoint, so M7 School's range survives unharmed. The
   dead `isPast && opacity-60` on the marks group was removed; AC7's recession
   still applies to the cell and its event chips.
3. **The mark is left-packed beside the date number**, not across from it.

## The finding that outlives this session

Left-packing did **not** create room to stack. Min-content measures 83px in both
layouts against ~77px available at the 768px breakpoint — two marks overflow by
~35px either way. `shrink-0` on the date span means the deficit now lands on the
quick-add button (24→18px) instead of deforming the today circle.

**Stacking and reveal are explicitly deferred by the user.** When a second
provider lands (M7 School), the space has to come from a real decision: drop the
quick-add below some width, wrap, or shrink the glyph. Carried in the queue as a
known constraint on M7.

## Decisions made

1. **Cap tie-break: registration order** — first registered, first kept.
2. **Glyph is an icon name** resolved by the calendar's own map, not a
   provider-supplied node. That is what keeps AC2 true.

## What the next session needs to know

- The today-forward filter lives in `MonthGrid` only. Anything reading marks
  through the endpoint (a range view, an export, School) gets the full range.
- Two marks on one date row do not fit at 768px today. See above.
