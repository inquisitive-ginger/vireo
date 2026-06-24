import type { CalendarEvent } from '../types'

/* Month-grid layout math, ported from the locked `calendar-month.stories.tsx`
   exploration and adapted from fixed day-of-month integers to real `Date`s + the
   wire event shape. All functions here are pure (no React, no identity/hue) so
   they unit-test cleanly; hue resolution lives in `hues.ts` and rendering in the
   components. Events are bucketed by the LOCAL calendar day of their start time
   (the family runs in one timezone; this is what a glancer expects). */

export const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// ─── Date helpers ────────────────────────────────────────────────────────────

const pad = (n: number) => String(n).padStart(2, '0')

/** `YYYY-MM-DD` from a date's LOCAL components (not UTC — avoids day-shift). */
export function localDateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** Midnight (local) on the same day — the canonical date-only value for a day. */
export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
}

export function isSameDay(a: Date, b: Date): boolean {
  return localDateKey(a) === localDateKey(b)
}

/** Whole local days from `a` to `b` (b − a), date-only. */
export function dayDiff(a: Date, b: Date): number {
  return Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / 86_400_000)
}

// ─── Span detection ──────────────────────────────────────────────────────────

/** The inclusive last day an event covers. An end at exactly local midnight is
 *  treated as the prior day (exclusive bound) so a 6pm→midnight event stays
 *  single-day. */
export function spanEndDate(event: CalendarEvent): Date {
  const start = new Date(event.startsAt)
  if (!event.endsAt) return start
  let end = new Date(event.endsAt)
  if (
    end.getHours() === 0 &&
    end.getMinutes() === 0 &&
    end.getSeconds() === 0 &&
    end.getMilliseconds() === 0 &&
    end.getTime() > start.getTime()
  ) {
    end = new Date(end.getTime() - 1)
  }
  return end
}

/** Multi-day = covers 2+ distinct local calendar days → renders as a span bar. */
export function isMultiDay(event: CalendarEvent): boolean {
  if (!event.endsAt) return false
  return !isSameDay(new Date(event.startsAt), spanEndDate(event))
}

// ─── Grid build ──────────────────────────────────────────────────────────────

export interface DayCell {
  date: Date
  inMonth: boolean
}

/** A Sunday-start month grid (whole weeks) covering `month`, including the
 *  leading/trailing spillover days of the adjacent months. */
export function buildMonthWeeks(year: number, month: number): DayCell[][] {
  const startOffset = new Date(year, month, 1).getDay() // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const weekCount = Math.ceil((startOffset + daysInMonth) / 7)
  const weeks: DayCell[][] = []
  for (let w = 0; w < weekCount; w++) {
    const week: DayCell[] = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(year, month, 1 - startOffset + w * 7 + d)
      week.push({ date, inMonth: date.getMonth() === month })
    }
    weeks.push(week)
  }
  return weeks
}

/** The Sunday-start week (7 days) containing `date`. */
export function buildWeek(date: Date): Date[] {
  const sunday = addDays(date, -date.getDay())
  return Array.from({ length: 7 }, (_, i) => addDays(sunday, i))
}

// ─── Layout ──────────────────────────────────────────────────────────────────

export interface PlacedSpan {
  event: CalendarEvent
  startCol: number
  endCol: number
  openStart: boolean // span continues before this week → flush left + ←
  openEnd: boolean // span continues after this week → flush right + →
  lane: number
}

export interface LaidOutCell {
  date: Date
  inMonth: boolean
  events: CalendarEvent[] // single-day events on this cell, time-sorted
}

export interface LaidOutWeek {
  cells: LaidOutCell[]
  spans: PlacedSpan[]
  laneCount: number
}

const byStart = (a: CalendarEvent, b: CalendarEvent) => a.startsAt.localeCompare(b.startsAt)

/** Single-day events whose local start day falls on `date`, time-sorted. */
export function eventsOnDay(events: CalendarEvent[], date: Date): CalendarEvent[] {
  const key = localDateKey(date)
  return events
    .filter((e) => !isMultiDay(e) && localDateKey(new Date(e.startsAt)) === key)
    .sort(byStart)
}

/** Place the multi-day spans intersecting one week into lanes (greedy first-fit),
 *  clipped to the week's columns. Mirrors the exploration's `spansForWeek`. */
export function spansForWeek(events: CalendarEvent[], week: Date[]): PlacedSpan[] {
  const weekStart = week[0]
  const spans = events
    .filter(isMultiDay)
    .map((event) => ({ event, start: new Date(event.startsAt), end: spanEndDate(event) }))
    .filter((s) => dayDiff(s.end, weekStart) <= 0 && dayDiff(weekStart, s.start) <= 6)
    .sort((a, b) => a.start.getTime() - b.start.getTime() || b.end.getTime() - a.end.getTime())

  const placed: PlacedSpan[] = []
  const laneEnds: number[] = []
  for (const s of spans) {
    const startCol = Math.max(0, Math.min(6, dayDiff(weekStart, s.start)))
    const endCol = Math.max(0, Math.min(6, dayDiff(weekStart, s.end)))
    let lane = laneEnds.findIndex((end) => end < startCol)
    if (lane === -1) {
      lane = laneEnds.length
      laneEnds.push(endCol)
    } else {
      laneEnds[lane] = endCol
    }
    placed.push({
      event: s.event,
      startCol,
      endCol,
      openStart: dayDiff(weekStart, s.start) < 0,
      openEnd: dayDiff(weekStart, s.end) > 6,
      lane,
    })
  }
  return placed
}

/** Full month layout: weeks of cells (single-day events) + lane-packed spans. */
export function layoutMonth(events: CalendarEvent[], year: number, month: number): LaidOutWeek[] {
  return buildMonthWeeks(year, month).map((week) => {
    const dates = week.map((c) => c.date)
    const spans = spansForWeek(events, dates)
    return {
      cells: week.map((c) => ({
        date: c.date,
        inMonth: c.inMonth,
        events: eventsOnDay(events, c.date),
      })),
      spans,
      laneCount: spans.reduce((m, s) => Math.max(m, s.lane + 1), 0),
    }
  })
}

/** Every event touching `date` (single-day on it, or a span covering it),
 *  time-sorted — the drill-in day agenda. */
export function eventsForDay(events: CalendarEvent[], date: Date): CalendarEvent[] {
  return events
    .filter((e) => {
      const start = new Date(e.startsAt)
      if (!isMultiDay(e)) return isSameDay(start, date)
      return dayDiff(start, date) >= 0 && dayDiff(date, spanEndDate(e)) >= 0
    })
    .sort(byStart)
}

// ─── Time / range formatting ─────────────────────────────────────────────────

/** Terse `h:mm` (12-hour, no meridiem) for month chips — matches the locked
 *  exploration's across-the-room density. */
export function formatChipTime(iso: string): string {
  const d = new Date(iso)
  let h = d.getHours() % 12
  if (h === 0) h = 12
  return `${h}:${pad(d.getMinutes())}`
}

/** Full `h:mm AM/PM` for drill-in agendas where there's room. */
export function formatTime(iso: string): string {
  const d = new Date(iso)
  const meridiem = d.getHours() < 12 ? 'AM' : 'PM'
  let h = d.getHours() % 12
  if (h === 0) h = 12
  return `${h}:${pad(d.getMinutes())} ${meridiem}`
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const monthTitle = (year: number, month: number) => `${MONTHS[month]} ${year}`

export const dayTitle = (d: Date) =>
  `${WEEKDAY_LABELS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`

export function weekTitle(week: Date[]): string {
  const a = week[0]
  const b = week[6]
  if (a.getMonth() === b.getMonth()) {
    return `${MONTHS[a.getMonth()]} ${a.getDate()} – ${b.getDate()}`
  }
  return `${MONTHS[a.getMonth()]} ${a.getDate()} – ${MONTHS[b.getMonth()]} ${b.getDate()}`
}

/** Inclusive `[from, to]` covering the visible range for a view + cursor, as ISO
 *  strings — drives the `['calendar/events', { from, to }]` query. */
export function rangeFor(
  view: 'month' | 'week' | 'day',
  cursor: Date
): { from: string; to: string } {
  let first: Date
  let lastExclusive: Date
  if (view === 'month') {
    const weeks = buildMonthWeeks(cursor.getFullYear(), cursor.getMonth())
    first = weeks[0][0].date
    lastExclusive = addDays(weeks[weeks.length - 1][6].date, 1)
  } else if (view === 'week') {
    const week = buildWeek(cursor)
    first = week[0]
    lastExclusive = addDays(week[6], 1)
  } else {
    first = startOfDay(cursor)
    lastExclusive = addDays(first, 1)
  }
  return { from: first.toISOString(), to: new Date(lastExclusive.getTime() - 1).toISOString() }
}
