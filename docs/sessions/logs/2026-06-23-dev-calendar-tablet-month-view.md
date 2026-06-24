# M3 Dev: Calendar — Tablet Month View (story 2)

**Date:** 2026-06-23
**Type:** development
**Story:** [tablet-month-view](../../modules/calendar/stories/tablet-month-view.md) (M3 story 2)
**PR:** #28 (merged) · follow-up close-out direct to main
**Depends on:** #1 Event Model ✅ (PR #27) + M3 Design: Calendar ✅

---

## What was built

The hero glanceable `/calendar` **month view** — the real, data-wired version of
the locked `Calendar Exploration/Month Grid`, rendering the pre-expanded
occurrences from `GET /api/calendar/events?from=&to=` (story 1). \*\*Read + navigate

- drill only\*\* (create is #3, the widget is #7).

* **Month grid** (`MonthGrid`): 7-col Sunday-start, color-by-owner filled pills;
  **split fill** for shared (2+) events; **neutral + `Users` glyph** for Family;
  **continuous multi-day span bars** (lane-packed, flush `←/→` week-wrap caps);
  today = filled `--primary` circle; past days dim. Layout/lane math ported from
  the exploration into pure helpers (`lib/grid.ts`).
* **Density + drill-in:** first 3 chips then `+N more`; tapping a day or `+N more`
  opens a day/week agenda (`DetailView` + `EventRow`). Drill-in is internal
  **view state** (`month | week | day` + cursor) — no nested routes, keeping the
  single `Plugin` component shape.
* **Data:** TanStack Query keyed `['calendar/events', { from, to }]` driven by the
  visible grid range; `/api/profiles` → identity-hue map (`getIdentityHue(name)`,
  the same path chores uses). Loading **skeleton**, empty-month note, error state.
* **Add-event CTA** rendered **inert** (disabled) — wired in #3.

## Decisions

- **Gate (pre-build):** ported the locked exploration into real components rather
  than rebuilding UX; **multi-day detection derived from data** (start day ≠ end
  day; an end at exact midnight is treated as the prior day, exclusive); **drill-in
  = internal view state**, not routes; **query the full 6-week grid range**.
- **Tests = RTL (user's call):** stood up the **first plugin DOM-test infra**
  (`vitest.config.ts` + `test.setup.ts`, jsdom + `@testing-library/react`),
  mirroring `packages/ui`. Pure layout/hue helpers also extracted and unit-tested.
  **22 tests** (grid math, hue/fill resolution, RTL: hue render, span bar,
  `+N more` drill, month-nav refetch).
- **Add-event CTA inert (user's call):** rendered to match the chrome, disabled
  until #3.
- `platform` now re-exports `QueryClient`/`QueryClientProvider` from the singleton
  path so plugin tests wrap with the identical react-query instance the hooks use.

## PR review course-corrections (all addressed in-PR)

- **Spine:** `EventRow` had hand-rolled the leading bar; design-system.md mandates
  the shared `<Spine>` primitive. Switched to `<Spine color={background} />` (the
  split-fill gradient passes straight through).
- **Duplicated type:** dropped the local `FamilyMember`; calendar uses platform's
  existing `Profile` (`@family-os/platform/types`). **Chores migrated too** — its
  `FamilyMember` removed across `ChoresPage` / `CreateTaskDrawer` / `sample-tasks`.
- **Real stories:** the deleted exploration was replaced with real `Calendar/…`
  component stories (`Month Grid` + empty; `Detail View` day/week/empty) on a
  shared June-2026 fixture (`components/fixtures.ts`).

## Deferred → queued

- **Shared `ItemCard` + `SegmentedControl` primitive** (PR #28 review): three
  surfaces (`FeedPostCard`, `TaskCard`, `EventRow`) hand-roll the same
  spine-+-card-chrome skeleton, and the month view-switch is a hand-rolled
  segmented control. Extract `ItemCard` (composing `Spine`) + `SegmentedControl`
  to `@family-os/ui`, retrofit chores/feed/calendar. Cross-cutting → its own
  session with a visual-parity + live-review gate. Queued.

## Verification

- 22 calendar tests green; calendar + chores typecheck/lint/federation build clean.
- **Live review:** ran in the real shell (5173) against 17 seeded demo events
  (34 expanded June occurrences) via `scripts/seed-calendar-demo.sql`; month grid
  - day drill-in screenshots reviewed and signed off. No backend change → API/E2E
    unaffected (not rerun).
- Seed is reversible: `DELETE FROM calendar.events WHERE source='demo-review';`.

## What the next session needs to know

- **Story 3 (Event Create / Edit)** is next: the reused drawer wires the inert
  "Add event" CTA, multi-select owner picker, inline span/all-day/weekly,
  react-day-picker (ADR 037), 30-min reminder; optimistic mutations invalidate the
  shared `['calendar/events']` prefix (the month view already reads it, so creates
  refresh it live).
- The `Calendar Exploration/` stories for **Event Drawer / Activities / Up Next**
  remain until #3/#5/#7 ship; only the **Month Grid** exploration was deleted.
- Demo-seed timestamps were authored at `-04` (render in browser-local tz).
