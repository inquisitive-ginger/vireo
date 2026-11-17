const MINUTE_MS = 60 * 1000
const DAY_MS = 24 * 60 * MINUTE_MS
const MAX_OCCURRENCES = 520 // hard guard against runaway expansion (~10y weekly, ~17mo daily)

/* THE one recurrence expansion (ADR 038, ADR 082). Both consumers — the
   /calendar/events read route and the reminder scheduler — compute occurrences
   from this module, so a frequency is taught here once. Compute-on-read holds:
   nothing here materializes the future.

   The rule (ADR 082): 'daily' steps one day and keeps the days whose local
   weekday is in `recurrenceWeekdays`; 'weekly' steps 7 × `recurrenceInterval`
   days; 'monthly' steps a calendar month, on the start's date or, with
   `recurrenceMonthWeek`, on its weekday in that week of the month (-1 = last);
   'yearly' steps twelve. A date a month lacks (the 31st, Feb 29) is skipped, not
   moved. Steps are server-local calendar days, so an occurrence keeps its wall
   clock across DST and "local weekday" means the household's — which holds only
   while the api process runs in that zone (`TZ` in docker-compose.prod.yml). */

export type RecurringEventFields = {
  startsAt: Date
  recurrence: string | null
  recurrenceInterval?: number
  recurrenceWeekdays?: number[]
  recurrenceMonthWeek?: number | null
  recurrenceUntil: Date | null
  exceptions?: { occurrenceDate: Date; kind: string }[]
}

/** Occurrence dates are keyed by their UTC date string — the convention the
 *  exceptions overlay, the reminder ledger, and synthetic occurrence ids share. */
export const occurrenceDateKey = (d: Date) => d.toISOString().slice(0, 10)

const addLocalDays = (ms: number, days: number) => {
  const d = new Date(ms)
  return d.setDate(d.getDate() + days)
}

const FREQUENCIES = new Set(['daily', 'weekly', 'monthly', 'yearly'])

export const isRecurring = (e: { recurrence: string | null }) =>
  e.recurrence !== null && FREQUENCIES.has(e.recurrence)

/** The start `months` calendar months on from `base`, or null when that month
 *  has no such day. */
function monthStep(base: Date, months: number, monthWeek: number | null): number | null {
  const y = base.getFullYear()
  const m = base.getMonth() + months
  const at = (day: number) =>
    new Date(
      y,
      m,
      day,
      base.getHours(),
      base.getMinutes(),
      base.getSeconds(),
      base.getMilliseconds()
    )
  if (monthWeek === null) {
    const c = at(base.getDate())
    return c.getDate() === base.getDate() ? c.getTime() : null
  }
  const weekday = base.getDay()
  if (monthWeek === -1) {
    const last = new Date(y, m + 1, 0)
    return at(last.getDate() - ((last.getDay() - weekday + 7) % 7)).getTime()
  }
  const firstWeekday = new Date(y, m, 1).getDay()
  return at(1 + ((weekday - firstWeekday + 7) % 7) + (monthWeek - 1) * 7).getTime()
}

const monthsBetween = (a: Date, b: Date) =>
  (b.getFullYear() - a.getFullYear()) * 12 + b.getMonth() - a.getMonth()

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

  const freq = event.recurrence
  const interval = event.recurrenceInterval ?? 1
  const weekdays = freq === 'daily' ? new Set(event.recurrenceWeekdays ?? []) : null
  const monthWeek = freq === 'monthly' ? (event.recurrenceMonthWeek ?? null) : null
  const until = event.recurrenceUntil
  const untilMs = until
    ? new Date(until.getUTCFullYear(), until.getUTCMonth(), until.getUTCDate() + 1).getTime()
    : Infinity
  const cancelled = new Set(
    (event.exceptions ?? [])
      .filter((e) => e.kind === 'cancelled')
      .map((e) => occurrenceDateKey(e.occurrenceDate))
  )

  const byMonth = freq === 'monthly' || freq === 'yearly'
  const stepMonths = freq === 'yearly' ? 12 : 1
  const stepDays = freq === 'daily' ? 1 : 7 * interval
  const candidate = (k: number) =>
    byMonth
      ? monthStep(event.startsAt, k * stepMonths, monthWeek)
      : addLocalDays(base, k * stepDays)

  // Skip ahead to the first candidate that could still overlap `fromMs`.
  let k = 0
  if (fromMs - durationMs > base) {
    k = byMonth
      ? Math.max(
          0,
          Math.floor(monthsBetween(event.startsAt, new Date(fromMs - durationMs)) / stepMonths) - 1
        )
      : Math.max(0, Math.floor((fromMs - durationMs - base) / (stepDays * DAY_MS)))
  }

  const out: number[] = []
  for (let i = 0; i < MAX_OCCURRENCES; i++, k++) {
    const startMs = candidate(k)
    if (startMs === null) continue
    if (startMs > toMs || startMs >= untilMs) break
    if (startMs < base) continue
    if (weekdays && !weekdays.has(new Date(startMs).getDay())) continue
    if (startMs + durationMs < fromMs) continue
    if (cancelled.has(occurrenceDateKey(new Date(startMs)))) continue
    out.push(startMs)
  }
  return out
}
