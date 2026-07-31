import type { TaskRoutineRef } from '../types'

/* Row + form language for routines. Weekday numbers are local `getDay()` values,
   Sunday 0 — a chore day is a date key, so absolute weekdays are safe (no ADR 057
   offsets). */

export const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const

const SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

/** One letter per weekday for the picker chips, Sunday-first. */
export const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const

const WEEKDAYS = [1, 2, 3, 4, 5]

/** "Every day" · "Weekdays" · "Thursdays" · "Mon & Thu" · "Mon, Wed & Fri". */
export function daySetLabel(days: number[]): string {
  const set = [...new Set(days)].sort((a, b) => a - b)
  if (set.length === 7) return 'Every day'
  if (set.length === 5 && WEEKDAYS.every((d) => set.includes(d))) return 'Weekdays'
  if (set.length === 1) return `${DAY_NAMES[set[0]]}s`
  const names = set.map((d) => SHORT[d])
  return `${names.slice(0, -1).join(', ')} & ${names[names.length - 1]}`
}

/** The ↻ status-line tail: "Mon & Thu" for a days routine, the standing promise
    for an ongoing one. */
export function routineStatusLabel(routine: TaskRoutineRef): string {
  return routine.kind === 'ongoing' ? "Whenever it's needed" : daySetLabel(routine.repeatDays)
}

/** Form-summary lead: "Every day" · "Every weekday" · "Every Thursday" · "Every Mon & Thu". */
export function daySetSummary(days: number[]): string {
  const set = [...new Set(days)].sort((a, b) => a - b)
  if (set.length === 0) return 'Pick the days it repeats'
  if (set.length === 7) return 'Every day'
  if (set.length === 5 && WEEKDAYS.every((d) => set.includes(d))) return 'Every weekday'
  if (set.length === 1) return `Every ${DAY_NAMES[set[0]]}`
  const names = set.map((d) => SHORT[d])
  return `Every ${names.slice(0, -1).join(', ')} & ${names[names.length - 1]}`
}
