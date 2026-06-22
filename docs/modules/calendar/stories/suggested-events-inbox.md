# Story: Suggested Events Inbox (north star — deferred build)

**Module:** calendar
**Status:** ⬜ Deferred (model lands in #1; build is post-MVP)

## User story

As a parent, when a school newsletter or a provider sends a reminder, the system
parses it and surfaces a **suggested event** I can confirm with one tap — so things
that used to fall through the cracks land on the calendar without manual entry.

## Why this is its own (deferred) story

This is the brainstorm's **north star**, not M3 MVP. The data model is reserved
**now** (story #1 ships the `status` = `confirmed | suggested` and `source` fields
on `events`), so the calendar can render and confirm suggested events the moment an
ingest source exists. The ingest + extraction work — email auth, parsing, and LLM
extraction into structured events — is deliberately out of the MVP and scheduled
later, once the core calendar (view, capture, remind) is in daily use.

## Scope (when picked up)

**In:**

- An **ingest source** (e.g. a watched mailbox / forwarding address) and an
  extraction step that turns a message into one or more `status: 'suggested'`
  events with a `source` provenance
- A **suggestions surface** (an inbox/review queue, and/or `suggested` events shown
  distinctly on the month view) where a parent **confirms** (→ `confirmed`),
  **edits-then-confirms**, or **dismisses** a suggestion
- Confirming a suggestion emits `calendar.event.created` (or a status-change event)
  so it behaves like any other event thereafter
- Provenance shown on a suggested event (where it came from) for trust

**Out (even when built):** Fully automatic event creation with no confirm step
(suggestions are always reviewed); calendars other than email as the first source;
two-way external sync (that attaches to the same external-ingest extension point
later).

## Acceptance criteria (when picked up)

_To be written when the story is scheduled and the owed external-ingest ADR is
settled. At minimum: a parsed message produces a reviewable `suggested` event;
confirm/edit/dismiss work; a confirmed suggestion is indistinguishable from a
manually-created event afterward; provenance is visible._

## Dependencies

**Event Model** (#1 — the `status` / `source` fields). **Gated by the owed
external-ingest / suggested-events ADR**, which defines the contract by which
external sources land events (and is where future iCal/Google sync will attach).
The full M3 MVP (view, capture, remind) should be shipping/shipped before this
opens.

## Notes

- Keep the human-in-the-loop confirm step — the value is _surfacing_ potential
  events, not silently writing the family's calendar.
- The same `suggested`/`source` model is the seam for later external calendar sync;
  don't design it email-only.
