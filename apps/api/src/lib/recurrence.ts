const MINUTE_MS = 60 * 1000
const DAY_MS = 24 * 60 * MINUTE_MS
const MAX_OCCURRENCES = 520 // hard guard against runaway expansion (~10y weekly, ~17mo daily)

/* THE one recurrence expansion (ADR 038, ADR 057). Both consumers — the
   /calendar/events read route and the reminder scheduler — compute occurrences
   from this module; before it existed the scheduler carried a hand-mirrored copy
   of `expandWeekly`, and a new recurrence kind would have had to be taught to
   both. Compute-on-read holds: nothing here materializes the future.

   A 'weekly' series steps 7 calendar days from `startsAt`, a 'daily' series one,
   and candidate day k is an occurrence iff `k % 7` is in `recurrenceDayOffsets` —
   day OFFSETS from the start's weekday, not absolute weekdays (ADR 057). Steps are
   server-local calendar days, not fixed milliseconds, so an occurrence keeps its
   wall-clock time across DST — which holds only while the api process runs in the
   household's timezone (`TZ` in docker-compose.prod.yml). */

export type RecurringEventFields = {
  startsAt: Date
  recurrence: string | null
  recurrenceUntil: Date | null
  recurrenceDayOffsets?: number[]
  exceptions?: { occurrenceDate: Date; kind: string }[]
}

/** Occurrence dates are keyed by their UTC date string — the convention the
 *  exceptions overlay, the reminder ledger, and synthetic occurrence ids share. */
export const occurrenceDateKey = (d: Date) => d.toISOString().slice(0, 10)

const addLocalDays = (ms: number, days: number) => {
  const d = new Date(ms)
  return d.setDate(d.getDate() + days)
}

export const isRecurring = (e: { recurrence: string | null }) =>
  e.recurrence === 'weekly' || e.recurrence === 'daily'

/** Occurrence starts (epoch ms) whose occurrence, padded by `durationMs`,
 *  overlaps the inclusive window `[fromMs, toMs]` — skipping `cancelled`
 *  exceptions and stopping at `recurrenceUntil` (an inclusive date: any
 *  occurrence starting before the day after it survives). A non-recurring event
 *  yields its own start when it overlaps. */
export function occurrenceStarts(
  event: RecurringEventFields,
  fromMs: number,
  toMs: number,
  durationMs = 0
): number[] {
  const base = event.startsAt.getTime()
  if (!isRecurring(event)) {
    return base + durationMs >= fromMs && base <= toMs ? [base] : []
  }

  const stepDays = event.recurrence === 'daily' ? 1 : 7
  const stepMs = stepDays * DAY_MS
  const offsets = event.recurrence === 'daily' ? new Set(event.recurrenceDayOffsets ?? []) : null
  const until = event.recurrenceUntil
  const untilMs = until
    ? new Date(until.getUTCFullYear(), until.getUTCMonth(), until.getUTCDate() + 1).getTime()
    : Infinity
  const cancelled = new Set(
    (event.exceptions ?? [])
      .filter((e) => e.kind === 'cancelled')
      .map((e) => occurrenceDateKey(e.occurrenceDate))
  )

  // Skip ahead to the first candidate that could still overlap `fromMs`.
  let k = 0
  if (fromMs - durationMs > base) {
    k = Math.max(0, Math.floor((fromMs - durationMs - base) / stepMs))
  }

  const out: number[] = []
  for (let i = 0; i < MAX_OCCURRENCES; i++, k++) {
    const startMs = addLocalDays(base, k * stepDays)
    if (startMs > toMs || startMs >= untilMs) break
    if (offsets && !offsets.has(k % 7)) continue
    if (startMs + durationMs < fromMs) continue
    if (cancelled.has(occurrenceDateKey(new Date(startMs)))) continue
    out.push(startMs)
  }
  return out
}
