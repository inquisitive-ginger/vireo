# Session Log — 2026-07-10 — Dev: Calendar Up Next Widget (story 7)

**PR #33** · branch `dev/calendar-up-next-widget` → `main` (squash `2241d8c`)

## What was built

`calendar.up-next` — the widget that fills the reserved Calendar home slot.

- **Design gate first.** Tidied the pre-primitives exploration and explored **3 frames** in a throwaway playground (A Refined Agenda · B Time Rail · C Next Hero). Chose **Frame C — "Next Hero"** after several live iterations.
- **`UpNextView`** (pure view) — a washed, dominant `NextEventHero` over a quiet, fill-less **day-grouped agenda** of what's after it. Ships all three sizes and **self-sizes via CSS container queries** (shell renders `<Widget />` with no size prop). **Height-aware fit:** a measuring pass caches block bottom-offsets, then clamps the agenda to whole rows + a **"+N more"** line (no partial rows, no scroll); `ResizeObserver` re-clamps on resize.
- **`UpNext`** (container) — TanStack Query events (forward window, key `['calendar/events','widget',id]` sharing the page's prefix) + profiles for `membersById`; framing from the active profile.
- **`NextEventHero`** — extracted the mobile agenda's hero into a shared component (`AgendaView` now reuses it); `showSoloOwner` drops the hero owner name in Mine framing. Added **`relativeWhen()`** to `lib/grid`.
- **Slot rename** `calendar.today` → `calendar.up-next` in `seed.ts`, `dev.ts`, and the two API layout tests; existing dev profiles migrated in place via SQL (metadata only, no data loss).

## Acceptance criteria status

All 7 pass. AC7 tests: framings, three sizes, empty, tap-through (66 calendar green). The "+N more" overflow needs real layout (jsdom has none) — verified in Storybook + the live shell, not unit tests.

## Decisions made

- **UX frame: C ("Next Hero").** Calendar's value is _what's next + how soon_, so lead with one washed hero (countdown in the eyebrow, title dominant, meta = **time → place → owner**) over a light agenda; the hero is the only element with weight.
- **Height-aware over CSS clip.** Chores clips with priority order; an agenda with day headings clipping mid-row reads worse, so the widget measures and shows "+N more".
- **Day headings = mobile treatment** (bold lead + muted date, no colour); **day-group divider rhythm aligned to the family-feed widget** (`my-[22px]`).
- Widget hero uses the shared `NextEventHero` **compact** variant across all sizes; mobile agenda keeps the full variant (unchanged).

## Scope additions

- **Drive-by fix:** `FeedPostCard` (family-feed) timestamp alignment — the content column wasn't `flex-1`, so "Xd ago" aligned to the post body's width. Pre-existing bug found during live review; fixed in a separate commit in this PR.

## New stories created

None.

## Open questions raised

None.

## What the next session needs to know

- **M3 MVP is one story from done:** only **#6 Event Reminders** remains (gated by the reminder-scheduling owed ADR — resolve first). #8 Suggested Events Inbox is the deferred north star.
- `NextEventHero`, `relativeWhen()`, and the height-aware `ThenAgenda` measuring pattern are reusable if future widgets need a "fit N whole rows + overflow" list.
- `WidgetEventRow` (muted pill + inset spine) was a noted abstraction candidate for `@family-os/ui`; Frame C uses fill-less rows instead, so it wasn't promoted — revisit only if another widget needs the dense pill row.
