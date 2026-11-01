# 2026-11-01 — Fix: meal drag-swap, DST recurrence

**Type:** fix (ad-hoc, no kickoff) · **Story:** none · **PRs #149, #150**
**Outcome:** two fixes shipped (#146, #147), three stale issues closed, one report kept open.

## Triage

**#140, #141, #142 were already fixed by PR #143** (2026-09-05) and their reports already
`deployed`. The issues stayed open only because #143 said "#140", not "Fixes #140". Closed
citing #143. A casing-sweep PR #148 beyond #142 was dropped at Zach's direction.

**Lesson:** a fix PR says `Fixes #N` or the issue outlives the fix.

## #146 — move a dinner to another day (Dad, `/meals`, PR #149)

Drag a week row's grip onto another day: empty day → **move**, occupied → **swap**. Past days
are neither source nor target. Design gated with Zach: drag, not a "Move to…" menu; swap,
not insert-and-shift.

- `POST /meals/plan/:id/move`, Zod `MealMoveSchema`, `manage` permission, one Prisma
  interactive `$transaction`. The swap parks the other meal on `slot = <its own uuid>` to dodge
  the non-deferrable `UNIQUE(date, slot)`. No migration.
- Emits `meals.dinner.planned` per changed meal; the client refetches `['meals/plan']` and
  `['calendar/day-marks']`.
- `@dnd-kit/core@6.3.1`, bundled in the meals plugin — **not** a federation singleton.
- Mouse + Touch (150ms hold, 5px tolerance) + Keyboard sensors. Pointer would swallow scroll.

**Accepted deviations:** the grip is 28px (`w-7`) below `sm`, under the 44px target rule, so
titles don't truncate at 390px. Shopping items already pushed keep their old "for <weekday>"
note after a move — same as a PATCH date change today.

Reviewed live by Zach in the dev shell before merge.

## #147 — recurring events an hour early after fall-back (Dad, `/`, PR #150)

**Root cause:** `apps/api/src/lib/recurrence.ts` stepped occurrences by fixed 24h/7d ms from
the UTC start, so every occurrence after fall-back landed an hour early — an all-day
recurring event slid to 11pm the day before. The prod api container had no `TZ` and ran UTC.

**Fix:** step in server-local calendar days; `recurrenceUntil` cuts off at local end-of-day;
`TZ: ${TZ:-America/Los_Angeles}` on the api service in `docker-compose.prod.yml`. The
household zone is **assumed, not on record** — Zach accepted. The same `TZ` corrects the
meals-nudge hour and new-event notification times.

One-offs and storage were never wrong; no data migration. The pre-deploy query for orphaned
future cancellations on prod returned 0 rows. New `recurrence.test.ts` crosses 2026-11-01
and 2026-03-08.

This was ADR 057's own named revisit trigger. ADR 057 amended (dated, Status unchanged): both
limitations marked fixed, offsets kept; the `recurrenceDayOffsets` schema comment follows.

**Known residual:** occurrence keys are still UTC dates.

## #145 — not a bug (Mom, `/calendar`)

A timed "Multiple days" event is a daily repeating window (ADR 057), so end-after-start is
checked within one day. Mom wanted one continuous Fri 6pm → Sun 10am event — a shape ADR 057
rejected. Issue kept open; Zach checks with Mom, then a dedicated session. Report 71114625
stays `triaged`. Queued.

## Verification

API 599/599 on each branch, meals 48/48, calendar 147/147, typecheck clean, CI green on both.

## Owed

Flip reports **d7d5701a** (#146) and **b79ebbce** (#147) to `deployed` with resolutions
after deploy — Zach, through Settings → Reported problems (the flip notifies the reporter;
`psql` would not).
