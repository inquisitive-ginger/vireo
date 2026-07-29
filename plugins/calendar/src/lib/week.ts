import { addDays, dayDiff, isSameDay, startOfDay } from '@family-os/ui'
import type { CalendarEvent } from '../types'
import { formatChipTime, isMultiDay, spanEndDate } from './grid'
import { daySetLabel, dailySeriesReps, isDailyWindow, windowWeekdays } from './series'

/* The `calendar.up-next` week model. Pure (no React, no hue) so it unit-tests
   cleanly — the rendering lives in `widgets/UpNextView.tsx`.

   This replaces the widget's old use of `upcomingByDay`, which bucketed every
   event by every day it TOUCHES. A week-long camp therefore claimed a row on all
   five of its days and swamped the actual appointments (and, since each day
   re-emitted the same event id, produced duplicate React keys). Here a multi-day
   event leaves the day list entirely and is stated once, as standing context. */

/** Today + 6. The widget looks one week ahead, not the agenda's 42 days — a
 *  deeper window only ever produced a "+40 more" line that read as a backlog. */
export const WEEK_WINDOW_DAYS = 7

export interface WeekDay {
  date: Date
  /** Single-day events starting on this date. Spans never appear here. */
  events: CalendarEvent[]
  /** Spans / daily series that BEGIN here — stated once, on their start day
   *  (design gate 4, 2026-07-28: a camp starting Monday is Monday's news). */
  starting: CalendarEvent[]
}

export interface WeekModel {
  /** The next single-day event still live — the hero. Spans are never the hero:
   *  "FISW Camp, day 3 of 5" is not what's happening next. */
  hero: CalendarEvent | null
  /** Multi-day events / daily series already RUNNING — the "all week" band's
   *  feed. One that starts later in the window is not "all week": it states
   *  itself once in its start day's `starting` list instead (gate 4 — the same
   *  rule the agenda has always followed). */
  spans: CalendarEvent[]
  /** Every day in the window, including the empty ones: an empty weekday is
   *  news ("nothing else scheduled"), not nothing. */
  days: WeekDay[]
  /** Live appointments starting past the window's edge — the honest "+N more". */
  beyond: number
}

/** When an event stops being current — its end, end-of-day for a bare all-day
 *  event, or its start for a zero-length one. (Mirrors `grid.ts`'s private
 *  `eventEnd`; kept local so this module stays independent of it.) */
function eventEnd(e: CalendarEvent): Date {
  if (e.endsAt) return new Date(e.endsAt)
  if (e.allDay) return addDays(new Date(e.startsAt), 1)
  return new Date(e.startsAt)
}

/* A daily time-window series (ADR 057) is a condition AND an appointment: it is
   STATED once — its rep joins the spans band with the day-set·window·bound label —
   and never repeats in the day rows, but TODAY's occurrence is hero-eligible, so
   the 8:45 glance still says "in 45 min" (design gate 3, 2026-07-28). Occurrences
   on later days are the band's business, not the list's. */

/** Split the forward window into spans + timed days. */
export function buildWeek(
  events: CalendarEvent[],
  now: Date,
  windowDays: number = WEEK_WINDOW_DAYS
): WeekModel {
  const first = startOfDay(now)
  const lastExclusive = addDays(first, windowDays)

  // Spans overlapping the window (including one that started before today and is
  // still running) + one representative occurrence per daily series — then split
  // by whether they are already under way. Only the running ones wear the band.
  const standing = [
    ...events
      .filter(isMultiDay)
      .filter((e) => spanEndDate(e) >= first && new Date(e.startsAt) < lastExclusive),
    ...dailySeriesReps(events),
  ].sort((a, b) => a.startsAt.localeCompare(b.startsAt))
  const spans = standing.filter((e) => startOfDay(new Date(e.startsAt)) <= first)
  const upcoming = standing.filter((e) => startOfDay(new Date(e.startsAt)) > first)

  const live = events
    .filter((e) => !isMultiDay(e))
    .filter((e) => !isDailyWindow(e) || isSameDay(new Date(e.startsAt), now))
    .filter((e) => eventEnd(e) >= now)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))

  const hero = live[0] ?? null

  const listable = live.filter((e) => !isDailyWindow(e))
  const days: WeekDay[] = Array.from({ length: windowDays }, (_, i) => {
    const date = addDays(first, i)
    return {
      date,
      events: listable.filter((e) => e.id !== hero?.id && isSameDay(new Date(e.startsAt), date)),
      starting: upcoming.filter((e) => isSameDay(new Date(e.startsAt), date)),
    }
  })

  const beyond = listable.filter((e) => new Date(e.startsAt) >= lastExclusive).length
  return { hero, spans, days, beyond }
}

/* "Mon 13". Composed rather than handed to `toLocaleDateString({weekday, day})`,
   which orders the parts by locale ("13 Mon" in en-US) — the weekday has to lead
   for the range to scan. */
const shortDay = (d: Date) =>
  `${d.toLocaleDateString(undefined, { weekday: 'short' })} ${d.getDate()}`

const monthDay = (d: Date) =>
  `${d.toLocaleDateString(undefined, { month: 'short' })} ${d.getDate()}`

/** A date within the next seven days of `now` (today included) keeps the weekday
 *  form ("Fri 31"); anything past that takes the month ("Aug 21") — bare
 *  day-of-month across a month boundary made the reader do month arithmetic
 *  (gate 4). Never both grammars in one label: `rangeLabel` decides once for
 *  both ends. */
const withinWeek = (d: Date, now: Date) => {
  const diff = dayDiff(startOfDay(now), startOfDay(d))
  return diff >= 0 && diff < 7
}

const dayLabel = (d: Date, now: Date) => (withinWeek(d, now) ? shortDay(d) : monthDay(d))

function rangeLabel(start: Date, end: Date, now: Date): string {
  if (withinWeek(start, now) && withinWeek(end, now)) return `${shortDay(start)} – ${shortDay(end)}`
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${monthDay(start)} – ${end.getDate()}`
  }
  return `${monthDay(start)} – ${monthDay(end)}`
}

// ── the mobile agenda ───────────────────────────────────────────────────────

export interface AgendaDay {
  date: Date
  /** Single-day events starting on this date. */
  timed: CalendarEvent[]
  /** Spans that START here — stated once, on the day they begin. */
  startingSpans: CalendarEvent[]
}

export interface AgendaModel {
  hero: CalendarEvent | null
  /** Spans already under way — pinned in a band, because their start day is in the
   *  past and there is no upcoming section left to state them in. */
  running: CalendarEvent[]
  days: AgendaDay[]
}

/* The agenda is a six-week SCROLL, not a week — so the widget's "pin every span in
   an All-week band" rule doesn't transfer: a camp three weeks out is not "all
   week", and pinning it at the top would be a lie about when it matters.

   The rule that does transfer is the one that mattered: STATE A SPAN EXACTLY ONCE.
   Here that means — pinned at the top if it is already running (its start day has
   passed, so no section below can carry it), otherwise inline, once, in the day it
   begins. Either way it never repeats across the days it covers, which is the bug
   this replaces. */
export function buildAgenda(events: CalendarEvent[], now: Date, horizon: number = 42): AgendaModel {
  const first = startOfDay(now)
  const lastExclusive = addDays(first, horizon)

  // Daily series take the span rule (stated once): a series already under way —
  // or whose first visible occurrence is today — pins in Ongoing; one starting on
  // a later day is stated inline, once, in the day it begins.
  const reps = dailySeriesReps(events)
  const spans = events
    .filter(isMultiDay)
    .filter((e) => spanEndDate(e) >= first && new Date(e.startsAt) < lastExclusive)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))

  const running = [...spans, ...reps]
    .filter((e) => startOfDay(new Date(e.startsAt)) <= first)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
  const upcoming = [...spans, ...reps].filter((e) => startOfDay(new Date(e.startsAt)) > first)

  const live = events
    .filter((e) => !isMultiDay(e))
    .filter((e) => !isDailyWindow(e) || isSameDay(new Date(e.startsAt), now))
    .filter((e) => eventEnd(e) >= now)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))

  const hero = live[0] ?? null

  const listable = live.filter((e) => !isDailyWindow(e))
  const days: AgendaDay[] = []
  for (let i = 0; i < horizon; i++) {
    const date = addDays(first, i)
    const timed = listable.filter((e) => e.id !== hero?.id && isSameDay(new Date(e.startsAt), date))
    const startingSpans = upcoming.filter((e) => isSameDay(new Date(e.startsAt), date))
    if (timed.length || startingSpans.length) days.push({ date, timed, startingSpans })
  }

  return { hero, running, days }
}

/** A span's "when" — a date range, never a clock. Once it's already running the
 *  start date is dead weight, so it collapses to "Through Fri 17". "All day" is
 *  implied by a multi-day event; saying it is noise.
 *
 *  A daily time-window series takes its own grammar instead (design gate 3):
 *  day-set · window · bound — "Weekdays 9:30 – 3:30 · through Fri 21". */
export function spanWhenLabel(event: CalendarEvent, now: Date): string {
  if (isDailyWindow(event)) return windowWhenLabel(event, now)
  const start = new Date(event.startsAt)
  const end = spanEndDate(event)
  return dayDiff(startOfDay(now), start) < 0
    ? `Through ${dayLabel(end, now)}`
    : rangeLabel(start, end, now)
}

/** `YYYY-MM-DD` → a local Date (how `recurrenceUntil` is serialized). */
const parseDateKey = (key: string) => {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** The time-slot label for a `starting` day-list row (gate 4): the thing's date
 *  range — "Aug 3 – 7" for a span, "Aug 3 – 21" for a daily series. The full
 *  window grammar waits for the band, where it has room, once the series runs. */
export function startingWhenLabel(event: CalendarEvent, now: Date): string {
  if (isDailyWindow(event)) {
    const start = new Date(event.startsAt)
    const end = event.recurrenceUntil ? parseDateKey(event.recurrenceUntil) : start
    return rangeLabel(start, end, now)
  }
  return spanWhenLabel(event, now)
}

function windowWhenLabel(event: CalendarEvent, now: Date): string {
  const days = daySetLabel(windowWeekdays(event))
  const clock = event.endsAt
    ? `${formatChipTime(event.startsAt)} – ${formatChipTime(event.endsAt)}`
    : formatChipTime(event.startsAt)
  const bound = event.recurrenceUntil
    ? ` · through ${dayLabel(parseDateKey(event.recurrenceUntil), now)}`
    : ''
  return `${days} ${clock}${bound}`
}
