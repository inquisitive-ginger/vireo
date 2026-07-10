/* Date-only helpers shared across widgets and pages. All operate on the LOCAL
   calendar day (the family runs in one timezone; this is what a glancer expects)
   and are pure so they unit-test cleanly. Callers that need month-grid layout
   still reach for the calendar plugin's `grid.ts`, which re-exports these. */

/** Midnight (local) on the same day — the canonical date-only value for a day. */
export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
}

export function isSameDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() === startOfDay(b).getTime()
}

/** Whole local days from `a` to `b` (b − a), date-only. */
export function dayDiff(a: Date, b: Date): number {
  return Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / 86_400_000)
}

export interface RelativeDayLabelOptions {
  /** Which side of `now` gets the weekday name for dates within a week. `forward`
   *  (default) names near-future days ("Tuesday" three days out); `backward` names
   *  near-past days. The other side falls straight to the month/day form. */
  direction?: 'forward' | 'backward'
  /** How dates a week or more away render the `lead`: `date` (default) collapses to
   *  a month/day string; `weekday` keeps the weekday name (pair with `sub` to carry
   *  the numeric date). */
  distant?: 'date' | 'weekday'
  /** Month style for the month/day form. */
  month?: 'short' | 'long'
  /** Also return a secondary month/day `sub` alongside a word/weekday `lead`. */
  sub?: boolean
}

export interface RelativeDayLabel {
  lead: string
  sub?: string
}

/** A relative day label: "Today" / "Tomorrow" / "Yesterday" / weekday / month-day.
 *  Returns `{ lead, sub }` so callers can render a bold lead over a muted date, or
 *  read `.lead` alone for a single string. The window that earns a weekday name and
 *  the far-out form are parameterised (see options) so every caller reproduces its
 *  own strings. */
export function relativeDayLabel(
  date: Date,
  now: Date = new Date(),
  options: RelativeDayLabelOptions = {}
): RelativeDayLabel {
  const { direction = 'forward', distant = 'date', month = 'short', sub = false } = options
  const days = dayDiff(startOfDay(now), startOfDay(date))
  const monthDay = () => date.toLocaleDateString(undefined, { month, day: 'numeric' })
  const weekday = () => date.toLocaleDateString(undefined, { weekday: 'long' })
  const withSub = (lead: string): RelativeDayLabel => (sub ? { lead, sub: monthDay() } : { lead })

  if (days === 0) return withSub('Today')
  if (days === 1) return withSub('Tomorrow')
  if (days === -1) return withSub('Yesterday')

  const nearWeekday = direction === 'forward' ? days > 1 && days < 7 : days < -1 && days > -7
  if (nearWeekday) return withSub(weekday())

  return distant === 'weekday' ? withSub(weekday()) : { lead: monthDay() }
}
