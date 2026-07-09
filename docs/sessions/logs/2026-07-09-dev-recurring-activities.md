# M3 Dev: Calendar Recurring Activities (story 5) — 2026-07-09

**PR #32** (merged). Branch `dev/calendar-recurring-activities`.

## What was built

A first-class **Activities lens** — standing commitments (weekly-recurring + single
owner, the derived `is_activity`) surfaced/managed as named activities, grouped by owner.

- **`GET /calendar/activities`** — each activity as its canonical **series** (no
  occurrence expansion); shared-calendar view rule (tier 1+). No schema change —
  `is_activity` already derived on write (ADR 038).
- **`ActivitiesView`** (calendar plugin) — a `[Roster · Seasons]` sub-switch:
  **Roster** = owner-grouped list (color = person) + per-kid **weekday-load strip**,
  tier-4 per-person **+ Add** / row **edit·remove**; **Seasons** = schematic Gantt to
  each activity's end. Empty + read-only states.
- **Two-tier chrome** — a primary **`Calendar ⇄ Activities`** tier over Month/Week/Day,
  on **tablet and mobile** (lazy `['calendar/activities']` query, `enabled` on the lens).
- **Reused `CreateEventDrawer`** with activity framing — repeat-weekly implied,
  per-person owner prefill, `event → activity` copy. Edit/remove reuse the story-1
  series PATCH/DELETE (activity remove = series-only confirm).

## Acceptance criteria — all ✅

1 create→persists weekly+`is_activity` · 2 owner-grouped surface w/ CRUD · 3 edit
propagates (edit→`Until` = "end") · 4 occurrences render as owned events · 5 remove
clears future occurrences · 6 tier-4 manage / 1–3 view · 7 tests (API + RTL).

## Decisions made

- **UX gate:** co-existence = **Frame B (two-tier tabs)** (over 4th-segment / separate
  destination); Roster vs Seasons = **sub-tabs**. Presented as live playground frames +
  ASCII previews; approved before build.
- **New primitive `TabBar`** (`@family-os/ui`) — underline ARIA tablist, roving
  tabindex + arrow-key nav + `tabpanel` association (story + 7 tests). Extracted rather
  than hand-rolled, mirroring the `SegmentedControl` precedent. Kept **custom, not
  `@radix-ui/react-tabs`** (repo installs Radix only where it earns it; house style is
  custom switch controls).

## Scope additions (folded in — surfaced during live review)

- **Activities reachable on mobile** (not tablet-only) — same tab tier + responsive
  roster header (weekday-load strip wraps to its own row below `sm:`).
- **Convention alignments:** `cursor-pointer` on `TabBar` **and** `SegmentedControl`
  (was the lone control missing it); **44px** `ghost`/`ghost-destructive` row actions
  (pencil hidden on mobile, tap-row edits — the AdminBoard idiom); Activities row now
  composes **`ItemCard`** (was hand-rolling the spine+chrome recipe).
- Deleted the superseded **Activities exploration** story (`Calendar Exploration/
Activities`) — real component shipped (same lifecycle as the Month Grid / Event Drawer
  explorations). Only the **Up Next** exploration remains.

## New stories created

None.

## Open questions / next session

- **Seasons timeline on mobile** keeps its fixed label gutter → compact (~28px/month).
  Usable; a responsive axis is an easy polish if wanted (not queued).
- **"End activity"** is edit → set `Until`; trash = series remove. No separate End button.
- **Next:** story 6 **Event Reminders** (gated by the owed reminder-scheduling ADR) or
  story 7 **Up Next Widget**. Activities is the first consumer of the owed
  member-capacity ADR (weekday-load doesn't need it for MVP).

## Verification

typecheck (10 pkgs) + lint clean; API calendar **26** (incl. 2 new activities-endpoint
tests) · calendar plugin **58** · `@family-os/ui` incl. `TabBar` **7** green;
live-reviewed on tablet + narrow viewport, signed off.
