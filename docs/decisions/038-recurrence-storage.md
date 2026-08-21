# ADR 038 — Recurrence Storage Model (Calendar)

**Status:** Decided — 2026-06-23 · Amended by ADR 057 (2026-07-28, daily
time-window recurrence) · Amended 2026-08-19 (`is_activity` includes shared
events — issue #114)

## Decision

A recurring calendar event is stored as a **single canonical `events` row**
carrying the recurrence rule (`recurrence = 'weekly'`, `recurrence_until`). Its
weekly occurrences are **computed on read**: `GET /calendar/events?from=&to=`
expands the series into one occurrence per week that overlaps the queried range,
never past `recurrence_until`. There is **no materialized `occurrences` table**.

Per-occurrence **cancellation/skip** ("gymnastics is off this week") is supported
via a thin **exceptions overlay**: an `event_exceptions(event_id, occurrence_date,
kind)` table where a `kind = 'cancelled'` row suppresses exactly one occurrence at
read-expansion time. Un-skip deletes the exception row.

**Attendees** are modeled by an `event_attendees(event_id, profile_id)` join — the
**single source of truth** for ownership; there is **no `owner_id` column** on
`events`. Zero rows = Family event · one = solo (that member's hue) · 2+ = shared
(split fill). The published-event payload's `ownerId` is derived: the single
attendee id when there is exactly one, else `null`.

### Read-expansion contract

- A non-recurring event returns as itself when it overlaps `[from, to]`.
- A recurring event yields a synthetic occurrence per week in range; each occurrence
  carries a stable **synthetic id** `"{eventId}:{YYYY-MM-DD}"` (the occurrence's
  start date), so the month view and widget get keyable, drill-inable rows without
  re-implementing the rule.
- An occurrence whose date matches a `cancelled` exception is omitted.
- `is_activity` is **derived on write**: `recurrence === 'weekly' && attendeeIds
.length >= 1`. (Family/un-owned/one-off recurring events stay false.) Originally
  `=== 1`; amended 2026-08-19 after a real household case — weekly swim lessons
  shared by two kids is a standing commitment for both (issue #114). A shared
  activity appears in **each** attendee's roster group.

### Mutation contract

- `PATCH /calendar/events/:id` and `DELETE /calendar/events/:id` (no params) act on
  the **whole series** (the canonical row). MVP has no per-occurrence field edits.
- `DELETE /calendar/events/:id?occurrence=YYYY-MM-DD` writes a `cancelled`
  exception — skips one occurrence, leaves the series intact. Idempotent.
- Deleting the canonical row cascades its `event_attendees` and `event_exceptions`.

## Why

- **MVP recurrence is uniform** (weekly, optional end). Computing occurrences from
  the rule + range is less code, has no canonical/derived sync problem, and never
  needs a backfill job when a rule changes. Materializing rows buys nothing until
  recurrence gets complex (RRULE, monthly-nth) — explicitly deferred.
- **Cancel-one is a real MVP need** but does not justify materialization. The
  canonical-row-plus-exceptions overlay is the standard recurrence-with-exceptions
  shape; a `cancelled` row is the minimal overlay and leaves the door open for a
  future `kind = 'moved'` (per-occurrence edit) without a schema rethink.
- **Join-only attendees** avoids the dual-write/which-is-truth ambiguity a
  denormalized `owner_id` shortcut would introduce; the 0/1/2+ fill logic reads
  cleanly off attendee count, and the event payload still exposes `ownerId` for the
  existing published-event contract (M5 School subscriber).

## Alternatives considered

- **Materialized `occurrences` table** (one row per week, generated on create/edit).
  Rejected: needs regeneration on every rule edit and on the rolling horizon, and a
  skip becomes a row delete that a rule-edit would resurrect — more moving parts for
  no MVP benefit.
- **Denormalized `owner_id` + join.** Rejected: two sources of truth for the solo
  case; every write must keep them consistent.
- **Per-occurrence override rows carrying full field values** (to support "move just
  this week" now). Deferred: only `cancelled` is in MVP scope; the `kind` column
  leaves room to add `moved` later.

## Do not revisit unless

- Recurrence grows beyond uniform weekly (every-other-week, monthly-nth-weekday,
  full RRULE), **or** per-occurrence field edits (not just skips) enter scope, **or**
  read-expansion cost shows up in profiling at family-calendar scale (it won't at
  these row counts). Any of these reopens the materialization question.
