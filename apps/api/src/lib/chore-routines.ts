/* Date-key arithmetic for chore routines. A chore day is a local calendar date
   ('YYYY-MM-DD') supplied by the client, never a server timestamp — a date key has
   an unambiguous weekday, so absolute weekdays work here and none of ADR 057's
   offset encoding is needed. Comparisons are plain string compares (the key format
   sorts lexically). */

export const DATE_KEY_RE = /^\d{4}-\d{2}-\d{2}$/

const pad = (n: number) => String(n).padStart(2, '0')

export function weekdayOfKey(key: string): number {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d).getDay()
}

export function addDaysKey(key: string, days: number): string {
  const [y, m, d] = key.split('-').map(Number)
  const dt = new Date(y, m - 1, d + days)
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`
}

/** The most recent scheduled day on or before `todayKey`; null when the set is empty. */
export function latestScheduledOnOrBefore(todayKey: string, repeatDays: number[]): string | null {
  if (repeatDays.length === 0) return null
  for (let back = 0; back < 7; back++) {
    const key = addDaysKey(todayKey, -back)
    if (repeatDays.includes(weekdayOfKey(key))) return key
  }
  return null
}

/** The next scheduled day on or after `todayKey`; null when the set is empty. */
export function nextScheduledOnOrAfter(todayKey: string, repeatDays: number[]): string | null {
  if (repeatDays.length === 0) return null
  for (let fwd = 0; fwd < 7; fwd++) {
    const key = addDaysKey(todayKey, fwd)
    if (repeatDays.includes(weekdayOfKey(key))) return key
  }
  return null
}
