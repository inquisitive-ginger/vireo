# 045 — Reminder Scheduling

**Status:** Decided

## Decision

Event reminders fire from a **60-second in-process poll** in the API server. Each
tick computes which reminders have come due **on read** — the same stance ADR 038
takes for occurrences — and dedupes with a sparse `calendar.reminder_log` ledger.

- **Firing primitive.** A `setInterval` (60s) started in the calendar plugin's
  registration, stopped on `onClose`. It is _not_ started under `NODE_ENV=test`
  (tests drive `runReminderTick(now)` directly with a mocked clock). The event bus
  (ADR 008) has no timer; this is that missing primitive, kept in-process (no cron,
  no broker).
- **Due computation.** For each event with `reminderMinutes`, the tick expands the
  occurrences whose **start ∈ `(now, now + reminderMinutes]`** — equivalently
  `startsAt − reminderMinutes ≤ now` while the occurrence is still in the future.
  Weekly series are expanded exactly as `calendar.ts` does (`recurrenceUntil` bound,
  `cancelled` exceptions skipped). **The future is never materialized.**
- **Exactly-once.** `reminder_log(event_id, occurrence_date)` is the **dual of
  `event_exceptions`**: a sparse record of the _past_ ("this occurrence's reminder
  fired"), not a materialized future. Its composite PK is the claim — the tick
  inserts the row before dispatch; a unique violation means already-fired → skip. A
  failed dispatch deletes the claim so the next tick retries.
- **Audience.** An owned/shared event reminds its attendees **∪ every tier-4 parent**;
  a Family event (no attendees) reminds everyone. `notify()` (ADR 029) applies the
  tier-2+/push gate, so tier-1 members receive nothing. Priority **`alert`** so the
  reminder reaches Web Push — the point of the story is to retire Google's push.

## Why

- **Restart-durable (AC6) for free.** The tick is stateless: due-ness is recomputed
  from `events` + the clock each run, dedup from the ledger. A still-future reminder
  fires on the next tick regardless of restarts — no timer state to rebuild.
- **Edit/delete need zero bookkeeping (AC5).** There is no pending-reminder object.
  Moving an event's time or deleting it changes what the next tick computes; the
  deleted event's ledger rows cascade away. Nothing to cancel or reschedule.
- **Honors ADR 038.** Materializing occurrence rows to schedule from is exactly the
  occurrences table ADR 038 rejected. Compute-on-read + a past-only ledger keeps that
  invariant intact.
- **60s granularity is invisible** for minute-scale reminders, and it sidesteps the
  Node `setTimeout` ~24.8-day ceiling and far-future-timer fragility.

## Alternatives considered

- **Per-event `setTimeout`.** Timer ceiling; every edit reschedules; recurring series
  need continuous re-arming; restart must rebuild every timer; no natural dedup. More
  moving parts for strictly worse durability.
- **Materialized reminder-queue rows** (precompute `fire_at` per occurrence). Rebuilds
  the occurrences table ADR 038 rejected — a weekly series becomes a rolling window of
  future rows to top up, coupling reminder correctness to a backfill job.
- **External cron / Redis queue (BullMQ).** ADR 008 keeps messaging in-process until
  services split across machines; standing up Redis for family-scale scheduling is
  operational cost with no benefit.

## Do not revisit unless

Reminders need sub-minute precision, or the platform grows a general scheduled-job
need beyond calendar (then promote the poll to a platform `scheduler` primitive rather
than duplicating it), or ADR 008's in-process assumption is lifted (services split
across processes → an external queue replaces the interval).
