# M3 Dev: Calendar — Event Create / Edit (story 3)

**Date:** 2026-06-23 · **Type:** development · **Module:** calendar · **PR:** #30 (merged)

## What was built

The reused right **Drawer** that creates / edits / per-day-prefills calendar
events, wired to the story-1 CRUD API and the month view's (previously inert)
"Add event" CTA. **Tier 4 only.**

- **`CreateEventDrawer`** (`@family-os/plugin-calendar`) — design §2 field order:
  title; **multi-select** owner chips + a mutually-exclusive **Family** chip (≥1
  required, split-color hint at 2+); **Date** with an inline **"Multiple days"**
  toggle → `DateRangePicker` (drops times + repeat); **Time** with an inline **"All
  day"** toggle (native `<input type=time>`, end auto-follows start +60m until
  touched); **Repeat weekly** + "(Every <weekday>)" + a panelled optional **Until**;
  **Reminder** presets (default 30m, timed events only); Location, Notes. Footer:
  full-width CTA; edit mode adds a ghost-destructive **Remove**.
- **`CalendarPage` wiring** — tier-4 gating (`useAuth`), enabled "Add event" CTA
  (today-prefilled), and optimistic create/edit/delete `useMutation`s that
  invalidate the shared `['calendar/events']` prefix (page + future up-next widget
  refresh together).
- **Edit from the agenda** (gated decision) — month chips keep drilling to the day
  agenda (story-2 behavior unchanged); agenda `EventRow`s are tap-to-edit (hover
  affordance + chevron + `aria-label`); a per-day **"+ Add"** prefills that date.
- **Month-cell quick-add** (follow-up ask) — a "+" revealed on cell hover
  (`[@media(hover:hover)]` — hover-capable devices only) opens create prefilled to
  that day; touch never renders it (reaches the same add via tap → agenda → "+
  Add", no hidden long-press/double-tap gesture — right call for the technophobe
  tablet user).
- **Recurring Remove offers a choice** (gated decision) — for a recurring event the
  confirm offers **"Just this week"** (`DELETE ?occurrence=`) vs **"All events"**
  (delete series); non-recurring → a single Remove. Built by extending the shared
  `ConfirmDialog` with an optional secondary action (lifted to `z-[60]` so it sits
  above the open drawer).
- **Chores due-date retrofit (ADR 037)** — `CreateTaskDrawer`'s stripped-native
  `<input type=date>` replaced by the shared `DatePicker`.

## Gated decisions

1. **Edit from the agenda**, not the month chips — avoids re-litigating the locked
   story-2 month interaction.
2. **Recurring Remove = this-week vs whole-series** — uses the story-1
   `?occurrence=` support.
3. **Tablet quick-add = tap-through** (no new gesture); desktop gets a hover "+".

## Sent back / PR-review course-corrections (all addressed in PR #30)

Five reviewer comments, all folded into this PR (commit `40d949a` + `db207cd`):

- **Centralize `FAMILY_PROFILE_ID`** → now lives once in `@family-os/platform/types`
  (React-free; imported by plugins **and** the API). Removed 7 per-file
  redefinitions + raw `'family'` literals in the shell (`Sidebar`/`Settings`/
  `ProfileGrid`) and API (`dev`/`preferences`).
- **Extract shared primitives** → base selectable **`Chip`**, identity
  **`MemberChip`**, and **`FieldLabel`** in `@family-os/ui` (stories + tests).
  Retrofit both drawers — calendar `OwnerChip`→`MemberChip`, `Family`/`Reminder`→
  `Chip`; chores `AssigneeChip`→`MemberChip`, `XpChip`→`Chip`; shared `FieldLabel`.
- **React Hook Form** → both drawers converted to **RHF + zodResolver** (the shell's
  Onboarding/Settings standard), replacing hand-rolled `useState`. UI-shaped form
  schemas; `Controller` for the custom controls; submit transforms to the wire body
  (the API still re-validates via the shared `EventInputSchema`). chores' earlier
  miss of this standard is fixed too.
- **Toggle render bug + Until treatment** (earlier review pass) → swapped the
  hand-rolled inline toggle for the shared `Switch` (`aria-label` forwarded); Until
  field panelled (`bg-secondary/50`) per the locked exploration.
- **Typography** → the "Shows as a split color" + end-time hints moved off
  `text-xs-token` (10px/600 micro-label) to `text-sm-token` (the sentence-helper
  token).
- **End-before-start warning regression** → the RHF rewrite kept the submit gate
  but dropped the visible "End time must be after the start." message; restored
  (derived `endBeforeStart`) + a regression test.

## Implementation notes / known limitation

- **Edit operates on the series** (`seriesId`). Editing a recurring event from an
  occurrence re-anchors `startsAt` to that occurrence's date on save (weekday/time
  preserved; earlier occurrences trim). Per-occurrence field edits remain out of
  scope (story scope).
- **Date↔datetime:** all-day/multi-day use local-midnight via `lib/grid`; a span's
  `endsAt` is the exclusive bound (`startOfDay(end + 1 day)`); `recurrenceUntil`
  sent as `YYYY-MM-DD`.
- **RHF disabled state** is derived synchronously from watched values (mirrors the
  schema) because `zodResolver` updates `isValid` a tick late; the resolver remains
  the authoritative gate at submit.
- **Test infra:** added a jsdom `ResizeObserver` stub to the calendar test setup
  (the date picker reaches for it on mount under RHF).

## Verification

typecheck + lint clean across platform / ui / api / shell / calendar / chores;
**ui 52, calendar 38, API 200** green; plugin builds green. Live-reviewed in the
real shell (create one-off / all-day / multi-day span / weekly; edit + remove;
month-cell quick-add; chores date-picker retrofit) and signed off before merge.

## What the next session needs

**Story 4 — Mobile Event Creation.** The `CreateEventDrawer` is the reused form;
story 4 brings it to the mobile PWA as a full-width sheet + a mobile read surface.
The form, validation (RHF + zod), and mutations are all in place — story 4 is the
mobile surface + entry points.

## Follow-ups still queued

- **Validation audit** (align remaining API routes to shared Zod) — chores' API
  route still hand-rolls validation; unchanged here.
- The standing reminder-scheduling ADR (gates story 6) and external-ingest ADR
  (gates story 8) remain owed.
