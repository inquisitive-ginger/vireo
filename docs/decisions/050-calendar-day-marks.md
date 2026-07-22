# 050 — A Day Mark Is a Property of a Day, Not an Event

**Status:** Decided

## Decision

Plugins contribute **day marks** to the calendar through a **read-time provider**. They
never write `calendar.events`.

- **A day mark is:** a date, an optional owner, a glyph, and a short label. It has
  **no start time, no duration, no overlap behaviour, and no reminder.** Anything that
  needs one of those is an **event** and belongs in calendar proper.
- **The provider is read-only.** For a date range, a plugin returns **at most one mark
  per day**. Calendar merges at render; the contributing plugin keeps its own table and
  remains the single source of truth.
- **A month cell renders at most two marks.** Fixed now, before the first provider
  ships — the fridge grid is the constraint, not the data.
- **Two densities, one payload.** The month cell renders **avatar/initial + glyph only**
  (no words survive the across-the-room 18px floor); the agenda day header renders the
  label.
- **An owner-bearing mark is never hue-only** (ADR 044) — the avatar or initial is the
  required second channel.

## Why

- **Dinner has no time.** A family with a full schedule and traffic lands within maybe
  ±30 minutes of anything, so an all-day or fixed-time event claims a precision the
  fact does not have — and takes an event slot to say something that is really a
  property of the day.
- **The valuable fact is _who is responsible_**, cooking or calling in takeout. That is
  attribution, and attribution renders as a mark.
- **Two known consumers, and neither wants events.** Meals ("who's got dinner") and M7
  School ("no school Monday", half day, teacher inservice) are both day-level facts.
- **One source of truth.** Read-time contribution means the meal is edited in `meals`
  and nowhere else; no reconciliation, no orphan rows, no delete cascade to chase.
- **The surface area is small** — no timeline positioning, no span logic, no reminder
  path — which is why this is cheaper than the alternative it replaces.

## Alternatives considered

- **`meals` writes `calendar.events` with `source: 'meals'`.** Free leverage (month
  grid, agenda, Up Next, reminders all light up), but two writers to one table, the meal
  editable from two places, and — decisively — **the shape is wrong**: it is not an
  event. The reserved `source` column stays for _ingested events_, which really are
  events.
- **A full "plugins contribute items to the calendar" extension point.** Solves a
  problem nobody has yet: positioning, overlap, spans, and reminders for foreign items.
  Day marks are the subset that two consumers actually need.
- **`meals` renders its own strip beside the calendar.** Two calendars on one screen.

## Do not revisit unless

A contributed item genuinely needs a time and a reminder — in which case it **is** an
event, and the answer is the owed external-ingest contract, not widening day marks. Or a
third consumer needs more than one mark per day, which is a cap change, not a redesign.
