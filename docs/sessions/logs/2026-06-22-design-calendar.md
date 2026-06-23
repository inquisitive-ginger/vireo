# Session Log — M3 Design: Calendar

**Date:** 2026-06-22
**Type:** Design
**Kickoff:** `docs/sessions/kickoffs/design-m3-calendar.md` (deleted on close — content lives here)

Locked the Calendar UX across all M3 surfaces via an interactive Storybook
playground (`Calendar Exploration/…`), built and iterated against the **real
design system** (tokens, identity hues, type scale) rather than ASCII — at the
user's request after the first ASCII gate. Ran the standing visual gate on every
major call.

## What was decided

**Month view (hero, story #2)** — **filled hue pills** (the highlighter analog;
spine-row and dot alternatives dropped). **Multi-day spans** = continuous bars in a
lane above the chips, flush edges + `←/→` across weeks. **Today** = filled
`--primary` date circle only (cell wash/ring/bar dropped). **Past** = `dim-events`
(number + pills recede; grid uniform). **Density** = first few + `+N more` → drill
to day/week. Across-the-room legibility is carried by **colour, not text** (month
chips are `xs`; titles are approach-read) — an explicit exception to the 18px
viewing-distance floor.

**Multi-person events — PULLED INTO M3** (was deferred at planning). 2+ owners →
**split fill** (hard-stop tint segments; gradient/dots compared on the real grid
and rejected). Recorded in `spec.md`; needs an `event_attendees` join (folded into
the owed recurrence-storage ADR). Cross-cutting treatment added to `design-system.md`.

**Event create/edit drawer (stories #3/#4)** — one reused right Drawer; the flow
reshaped so **each modifier sits on the field it changes** (after the user found a
flat field-list "jumbled"): **For** = multi-select members + Family (required, no
default — owner is never defaulted to Family, to protect the colour glance); **Date**
has an inline **Multiple days** toggle that turns the field into a **range picker**;
**Time** has an inline **All day** toggle, end time **auto-follows start +60 min**;
**Repeat weekly** shows **"(Every Tuesday)"** inline + optional Until. **Reminder
defaults to 30 min** (capture-once-and-remind is the point of retiring Google).
Edit mode keeps **Remove** in the footer.

**Date picker — ADR 037.** Adopted **react-day-picker v10**, themed by token, as
shared `@family-os/ui` components (`Calendar`, `Popover`, `DatePicker`,
`DateRangePicker`); the chores due-date field retrofits onto it. Time stays native
for now.

**Activities surface (story #5) — refined into a _load lens_.** An Activity =
a person's **standing seasonal commitment** (Vision Therapy, T&T), not just a
recurring event; **derived, not categorized** (`is_activity` from weekly-recurring

- person-owned). Surface = grouped-by-owner roster + a per-kid **weekday-load
  strip** + a family **season timeline** (answers "is X overbooked / what frees up in
  November?"). Connects to the owed member-capacity ADR (its first consumer).

**`calendar.up-next` widget (story #7)** — `chores.today-summary` precedent: two
framings (Family color-by-owner / Mine), three sizes, owner-hue **spine per row**
(split for shared, neutral for Family), agenda-shaped (not a big metric),
day-grouped at `large` (full weekday names), tap-through to `/calendar`,
all-clear empty ("Nothing scheduled" / body at large only).

## What was produced

- `docs/modules/calendar/design.md` — the dev-facing UX spec (all six surfaces).
- `docs/design-system.md` — multi-person split-fill + Family neutral added to the
  identity palette; react-day-picker added to the stack; **Last updated** bumped.
- `docs/decisions/037-date-picker-library.md` — the picker decision.
- `docs/modules/calendar/spec.md` — multi-person moved into scope; Activity =
  load-lens definition + derive rule.
- **Shipped to `@family-os/ui`** (real, not throwaway): `Calendar`, `Popover`,
  `DatePicker`, `DateRangePicker` (+ `Primitives/DatePicker` story).
- **Two engineering fixes shipped:** (1) `cn` registers `text-*-token` utilities as
  font-size classes in tailwind-merge (a token size + `text-{color}` in one `cn()`
  was silently dropping the size); (2) `.storybook/preview-styles.css` now
  `@source`-scans `../src` so ui's own novel utilities emit reliably.
- Storybook playground retained as the visual reference: `Calendar Exploration/`
  **Month Grid · Event Drawer · Activities · Up Next Widget**.

## Open questions raised

- **Multi-person model** — the `event_attendees` join shape (and whether a
  solo-case `owner_id` shortcut is kept) is folded into the owed **recurrence-storage
  ADR** (gates Event Model #1).
- **Reminder firing** — the 30-min default needs the owed **reminder-scheduling
  ADR** (gates #6) to actually fire.
- **Member capacity** — Activities' load lens is the first consumer of the owed
  capacity ADR; the MVP visuals don't need it, but a real capacity number would.
- **Time picker** — native for MVP; stepped picker is optional polish.

## What the next session needs to know

- **M3 dev is unblocked.** Stories #2 (Tablet Month View), #3 (Event Create/Edit),
  #5 (Recurring Activities), #7 (Up Next Widget) have their UX locked here; build
  against `design.md` + the `Calendar Exploration/` stories, and **delete the
  explorations** once the real components land.
- **Resolve each story's owed ADR first** (recurrence storage for #1; reminder
  scheduling for #6).
- **Multi-person is now MVP** — Event Model (#1) must ship the attendees join, and
  Event Create/Edit (#3) the multi-select owner picker.
- The shared date-picker components already exist in `@family-os/ui`; #3 wires them
  in and retrofits the chores due-date field (ADR 037).
