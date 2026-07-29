import { addDays, dayDiff, isSameDay, relativeDayLabel, startOfDay } from '@family-os/ui'
import type { CalendarEvent } from '../types'
import { isDailyWindow } from './series'

/* Month-grid layout math, ported from the locked `calendar-month.stories.tsx`
   exploration and adapted from fixed day-of-month integers to real `Date`s + the
   wire event shape. All functions here are pure (no React, no identity/hue) so
   they unit-test cleanly; hue resolution lives in `hues.ts` and rendering in the
   components. Events are bucketed by the LOCAL calendar day of their start time
   (the family runs in one timezone; this is what a glancer expects). */

export const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Date helpers

// The date-only primitives live in `@family-os/ui`; re-exported so calendar's many
// `../lib/grid` importers keep a single import site.
export { addDays, dayDiff, isSameDay, startOfDay }

const pad = (n: number) => String(n).padStart(2, '0')

/** `YYYY-MM-DD` from a date's LOCAL components (not UTC — avoids day-shift). */
export function localDateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

// Span detection

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

// Grid build

interface DayCell {
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

// Layout

export interface PlacedSpan {
  event: CalendarEvent
  startCol: number
  endCol: number
  openStart: boolean // span continues before this week → flush left + ←
  openEnd: boolean // span continues after this week → flush right + →
  lane: number
}

interface LaidOutCell {
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

/** Single-day events whose local start day falls on `date`, time-sorted. A daily
 *  series' occurrences render as span-lane bars, never as chips (design gate 2). */
export function eventsOnDay(events: CalendarEvent[], date: Date): CalendarEvent[] {
  const key = localDateKey(date)
  return events
    .filter(
      (e) => !isMultiDay(e) && !isDailyWindow(e) && localDateKey(new Date(e.startsAt)) === key
    )
    .sort(byStart)
}

/** A daily series' occurrences, folded into runs of CONSECUTIVE days — the month
 *  grid's bar unit (ADR 057). Weekend gaps and cancelled days end a run, so a
 *  skipped Wednesday is a visible hole in the bar, not painted over. */
function dailyRuns(events: CalendarEvent[]): { event: CalendarEvent; start: Date; end: Date }[] {
  const bySeries = new Map<string, CalendarEvent[]>()
  for (const e of events) {
    if (!isDailyWindow(e)) continue
    const list = bySeries.get(e.seriesId)
    if (list) list.push(e)
    else bySeries.set(e.seriesId, [e])
  }
  const runs: { event: CalendarEvent; start: Date; end: Date }[] = []
  for (const occurrences of bySeries.values()) {
    occurrences.sort(byStart)
    let run: { event: CalendarEvent; start: Date; end: Date } | null = null
    for (const occ of occurrences) {
      const day = startOfDay(new Date(occ.startsAt))
      if (run && dayDiff(run.end, day) === 1) {
        run.end = day
      } else {
        run = { event: occ, start: day, end: day }
        runs.push(run)
      }
    }
  }
  return runs
}

/** Place the multi-day spans and daily-series runs intersecting one week into
 *  lanes (greedy first-fit), clipped to the week's columns. Mirrors the
 *  exploration's `spansForWeek`. */
export function spansForWeek(events: CalendarEvent[], week: Date[]): PlacedSpan[] {
  const weekStart = week[0]
  const spans = [
    ...events
      .filter(isMultiDay)
      .map((event) => ({ event, start: new Date(event.startsAt), end: spanEndDate(event) })),
    ...dailyRuns(events),
  ]
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

// Agenda (mobile forward-looking list)

interface AgendaDay {
  date: Date
  events: CalendarEvent[]
}

/** Inclusive `[from, to]` for the mobile agenda — start of today through `days`
 *  ahead — driving the same `['calendar/events', { from, to }]` query the tablet
 *  surfaces use. */
export function agendaRange(from: Date, days = 42): { from: string; to: string } {
  const first = startOfDay(from)
  const lastExclusive = addDays(first, days)
  return { from: first.toISOString(), to: new Date(lastExclusive.getTime() - 1).toISOString() }
}

/** Forward day buckets from `from`: each day in `[from, from + horizon)` that has
 *  at least one event, date-ordered, events sorted by start. */
export function upcomingByDay(events: CalendarEvent[], from: Date, horizon = 42): AgendaDay[] {
  const out: AgendaDay[] = []
  for (let i = 0; i < horizon; i++) {
    const date = addDays(startOfDay(from), i)
    const dayEvents = eventsForDay(events, date)
    if (dayEvents.length) out.push({ date, events: dayEvents })
  }
  return out
}

/** When an event stops being "current" — its end, or end-of-day for a bare
 *  all-day event, or its start for a zero-length one. */
function eventEnd(e: CalendarEvent): Date {
  if (e.endsAt) return new Date(e.endsAt)
  if (e.allDay) return addDays(new Date(e.startsAt), 1)
  return new Date(e.startsAt)
}

/** The next event still relevant at `now` (hasn't ended) across the forward
 *  buckets — the agenda hero. Falls back to the first upcoming event. */
export function pickNextUp(days: AgendaDay[], now: Date): CalendarEvent | null {
  for (const { events } of days) {
    for (const e of events) {
      if (eventEnd(e).getTime() >= now.getTime()) return e
    }
  }
  return days[0]?.events[0] ?? null
}

// Time / range formatting

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

/** The agenda's "when" label: `All day` / `Until <date>` (span) / `h:mm AM/PM`. */
export function agendaWhenLabel(event: CalendarEvent): string {
  if (event.allDay && !isMultiDay(event)) return 'All day'
  if (isMultiDay(event))
    return `Until ${spanEndDate(event).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
  return formatTime(event.startsAt)
}

/** How soon a same-day event starts — the value a family actually wants from a
 *  glance. Only meaningful within the day; past that, *which day* is the fact. */
function countdown(start: Date, now: Date): string {
  const mins = Math.round((start.getTime() - now.getTime()) / 60_000)
  if (mins < 60) return `in ${mins} min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m ? `in ${h}h ${m}m` : `in ${h} hr`
}

/* The hero's "when", split into the two facts it renders on two different lines:
   the proximity clause rides the eyebrow, the clock rides the meta. They have to
   come apart, because collapsing them into one string is exactly what let the
   widget announce a bare "5:15 PM" for an event that was actually tomorrow —
   the eyebrow spent its slot re-printing the clock the meta line already showed,
   and the day went unsaid. */
export interface HeroWhen {
  /** The proximity clause. Today: `Now` / `in 30 min`. Any later day: *which day*
   *  (`Tomorrow` · `Saturday` · `Jul 22`) — never a clock, which says nothing a
   *  glancer can place. */
  when: string
  /** The wall clock, or `All day` / `Until Jul 18` when the event hasn't got one.
   *  Always renderable — an all-day hero used to show no time at all. */
  clock: string
  /** The event starts on a later calendar day than `now`. Since the hero is the
   *  first event still live, this means nothing single-day is left today — the
   *  boundary the hero has to announce rather than quietly step over. */
  future: boolean
}

export function heroWhen(event: CalendarEvent, now: Date): HeroWhen {
  const start = new Date(event.startsAt)
  const clock = agendaWhenLabel(event)
  // Under way — beats any day label, and it's why `future` can't just be `start > now`.
  if (now >= start && now < eventEnd(event)) return { when: 'Now', clock, future: false }
  if (isSameDay(start, now)) return { when: countdown(start, now), clock, future: false }
  return { when: relativeDayLabel(start, now).lead, clock, future: true }
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
