import type { CalendarEvent } from '../types'

/* The repeat rule as the client reads and writes it (ADR 082). A recurring series
   arrives from the API pre-expanded into one occurrence per date; these helpers
   are how the client reads the series THROUGH its occurrences — its weekday set,
   the one statement per series, and the words a rule is said in. */

export const isDailyWindow = (e: Pick<CalendarEvent, 'recurrence'>) => e.recurrence === 'daily'

/** A daily series meeting 4+ days a week is a condition: it states itself once in
 *  the All week band and the agenda's Ongoing panel. One meeting 1–3 days a week
 *  is a set of appointments, listed on its days (D-083). */
export const isConditionSeries = (e: CalendarEvent) =>
  isDailyWindow(e) && e.recurrenceWeekdays.length >= 4

const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/** The day-set half of the series grammar (design gate 3): "Every day" /
 *  "Weekdays" / "Weekends" / "Mon · Wed · Fri". Input is local weekdays. */
export function daySetLabel(weekdays: number[]): string {
  const set = new Set(weekdays)
  if (set.size >= 7) return 'Every day'
  if (set.size === 5 && [1, 2, 3, 4, 5].every((d) => set.has(d))) return 'Weekdays'
  if (set.size === 2 && set.has(0) && set.has(6)) return 'Weekends'
  return [...set]
    .sort((a, b) => a - b)
    .map((d) => DAY_SHORT[d])
    .join(' · ')
}

/** One representative occurrence per condition series — the earliest in range —
 *  for the surfaces that state a series exactly once (the All week band, the
 *  agenda's Ongoing panel). */
export function conditionSeriesReps(events: CalendarEvent[]): CalendarEvent[] {
  const bySeries = new Map<string, CalendarEvent>()
  for (const e of events) {
    if (!isConditionSeries(e)) continue
    const held = bySeries.get(e.seriesId)
    if (!held || e.startsAt < held.startsAt) bySeries.set(e.seriesId, e)
  }
  return [...bySeries.values()].sort((a, b) => a.startsAt.localeCompare(b.startsAt))
}

// ── the Repeats list ────────────────────────────────────────────────────────

export type RepeatChoice =
  | 'none'
  | 'week'
  | 'other-week'
  | 'month-date'
  | 'month-week'
  | 'month-last'
  | 'year'

export interface RepeatRule {
  recurrence: 'weekly' | 'monthly' | 'yearly' | null
  recurrenceInterval: number
  recurrenceMonthWeek: number | null
}

const ORDINAL = ['1st', '2nd', '3rd', '4th']
const dateOrdinal = (n: number) => {
  if (n >= 11 && n <= 13) return `${n}th`
  return `${n}${['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'}`
}
const daysInMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()

/** Which of its weekday the date is in its month: 1–5. */
const weekOfMonth = (d: Date) => Math.ceil(d.getDate() / 7)
const isLastWeekday = (d: Date) => d.getDate() + 7 > daysInMonth(d)

/** The choices the drawer offers, worded from the event's own date (ADR 082). A
 *  5th weekday has no "5th" choice (most months lack one), only "last". */
export function repeatChoices(date: Date): { value: RepeatChoice; label: string }[] {
  const weekday = DAY_NAMES[date.getDay()]
  const nth = weekOfMonth(date)
  return [
    { value: 'none', label: 'Doesn’t repeat' },
    { value: 'week', label: `Every week on ${weekday}` },
    { value: 'other-week', label: `Every other week on ${weekday}` },
    { value: 'month-date', label: `Every month on the ${dateOrdinal(date.getDate())}` },
    ...(nth <= 4
      ? [
          {
            value: 'month-week' as const,
            label: `Every month on the ${ORDINAL[nth - 1]} ${weekday}`,
          },
        ]
      : []),
    ...(isLastWeekday(date)
      ? [{ value: 'month-last' as const, label: `Every month on the last ${weekday}` }]
      : []),
    {
      value: 'year',
      label: `Every year on ${date.toLocaleDateString(undefined, { month: 'short' })} ${date.getDate()}`,
    },
  ]
}

/** The stored rule for a choice. The week of the month comes from the date, so a
 *  moved date carries "3rd Tuesday" to its own week; a 5th weekday becomes "last". */
export function ruleForChoice(choice: RepeatChoice, date: Date): RepeatRule {
  const rule = (
    recurrence: RepeatRule['recurrence'],
    recurrenceInterval = 1,
    recurrenceMonthWeek: number | null = null
  ) => ({ recurrence, recurrenceInterval, recurrenceMonthWeek })
  switch (choice) {
    case 'week':
      return rule('weekly')
    case 'other-week':
      return rule('weekly', 2)
    case 'month-date':
      return rule('monthly')
    case 'month-week':
      return rule('monthly', 1, weekOfMonth(date) <= 4 ? weekOfMonth(date) : -1)
    case 'month-last':
      return rule('monthly', 1, -1)
    case 'year':
      return rule('yearly')
    default:
      return rule(null)
  }
}

export function choiceForEvent(event: CalendarEvent): RepeatChoice {
  switch (event.recurrence) {
    case 'weekly':
      return event.recurrenceInterval === 2 ? 'other-week' : 'week'
    case 'monthly':
      if (event.recurrenceMonthWeek === -1) return 'month-last'
      return event.recurrenceMonthWeek ? 'month-week' : 'month-date'
    case 'yearly':
      return 'year'
    default:
      return 'none'
  }
}

/** A series' rule in words, from its own start: "Every month on the 3rd Tuesday",
 *  "Tue · Thu". Null for a one-off. */
export function repeatRuleLabel(event: CalendarEvent): string | null {
  if (!event.recurrence) return null
  if (isDailyWindow(event)) return daySetLabel(event.recurrenceWeekdays)
  const start = new Date(event.seriesStartsAt)
  const choice = choiceForEvent(event)
  if (choice === 'month-week') {
    return `Every month on the ${ORDINAL[event.recurrenceMonthWeek! - 1]} ${DAY_NAMES[start.getDay()]}`
  }
  if (choice === 'month-last') return `Every month on the last ${DAY_NAMES[start.getDay()]}`
  return repeatChoices(start).find((c) => c.value === choice)?.label ?? null
}

/** The repeat glyph's spoken label: "Repeats every month on the 3rd Tuesday",
 *  "Repeats Tue · Thu". */
export function repeatsAriaLabel(event: CalendarEvent): string | null {
  const rule = repeatRuleLabel(event)
  if (!rule) return null
  return rule.startsWith('Every ')
    ? `Repeats ${rule.charAt(0).toLowerCase()}${rule.slice(1)}`
    : `Repeats ${rule}`
}

/** The choice to show for a date: a monthly pick the date no longer offers
 *  ("3rd" on a 5th weekday, "last" off the last week) falls to the one it does. */
export function choiceForDate(choice: RepeatChoice, date: Date): RepeatChoice {
  const offered = new Set(repeatChoices(date).map((c) => c.value))
  if (offered.has(choice)) return choice
  return choice === 'month-week' ? 'month-last' : choice === 'month-last' ? 'month-week' : choice
}

/** The next `count` dates after `after` (default: the start) that a choice lands
 *  on, through `until` — the drawer's "Next:" line. Mirrors the api's expansion
 *  (`apps/api/src/lib/recurrence.ts`) for the rules the drawer writes; the api
 *  stays the one that places occurrences. */
export function nextDates(
  choice: RepeatChoice,
  date: Date,
  { count = 3, after = date, until }: { count?: number; after?: Date; until?: Date } = {}
): Date[] {
  const { recurrence, recurrenceInterval, recurrenceMonthWeek } = ruleForChoice(choice, date)
  if (!recurrence) return []
  const y = date.getFullYear()
  const candidate = (k: number): Date | null => {
    if (recurrence === 'weekly') {
      return new Date(y, date.getMonth(), date.getDate() + 7 * recurrenceInterval * k)
    }
    const m = date.getMonth() + (recurrence === 'yearly' ? 12 * k : k)
    if (recurrenceMonthWeek === null) {
      const c = new Date(y, m, date.getDate())
      return c.getDate() === date.getDate() ? c : null
    }
    if (recurrenceMonthWeek === -1) {
      const last = new Date(y, m + 1, 0)
      return new Date(y, m, last.getDate() - ((last.getDay() - date.getDay() + 7) % 7))
    }
    const first = new Date(y, m, 1).getDay()
    return new Date(y, m, 1 + ((date.getDay() - first + 7) % 7) + (recurrenceMonthWeek - 1) * 7)
  }
  const out: Date[] = []
  for (let k = 1; out.length < count && k < 600; k++) {
    const c = candidate(k)
    if (!c) continue
    if (until && c > until) break
    if (c > after) out.push(c)
  }
  return out
}
