import { addDays, dayDiff, isSameDay, startOfDay } from '@family-os/ui'
import type { CalendarEvent } from '../types'
import { formatChipTime, isMultiDay, localDateKey, spanEndDate } from './grid'
import { conditionSeriesReps, daySetLabel, isConditionSeries, isDailyWindow } from './series'

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
  /** Appointments starting on this date, plus a 1–2-day span on its first day
   *  (D-083). Conditions never appear here. */
  events: CalendarEvent[]
  /** Conditions that BEGIN here — stated once, on their start day (design gate 4,
   *  2026-07-28: a camp starting Monday is Monday's news). */
  starting: CalendarEvent[]
  /** Things on their last day, stated once as "last day" (D-083): a condition
   *  leaving the band today, or a 1–2-day span's final day. */
  ending: CalendarEvent[]
}

export interface WeekModel {
  /** The next appointment still live — the hero. Spans are never the hero:
   *  "FISW Camp, day 3 of 5" is not what's happening next. */
  hero: CalendarEvent | null
  /** Conditions already RUNNING — the "all week" band's feed (D-083). One that
   *  starts later in the window is not "all week": it states itself once in its
   *  start day's `starting` list instead (gate 4 — the agenda's rule too). */
  spans: CalendarEvent[]
  /** Every day in the window, including the empty ones: an empty weekday is
   *  news ("nothing else scheduled"), not nothing. */
  days: WeekDay[]
  /** Live appointments starting past the window's edge — the honest "+N more". */
  beyond: number
}

export const LAST_DAY_LABEL = 'Last day'

/** When an event stops being current — its end, end-of-day for a bare all-day
 *  event, or its start for a zero-length one. (Mirrors `grid.ts`'s private
 *  `eventEnd`; kept local so this module stays independent of it.) */
function eventEnd(e: CalendarEvent): Date {
  if (e.endsAt) return new Date(e.endsAt)
  if (e.allDay) return addDays(new Date(e.startsAt), 1)
  return new Date(e.startsAt)
}

/* What earns the band is the thing's shape, not where the window sits (D-083): a
   span of 3+ days, or a daily series meeting 4+ days a week, is a CONDITION —
   stated once, in the band while it runs, and never repeated in the day rows. A
   condition series is still an appointment today, so today's occurrence is
   hero-eligible and the 8:45 glance says "in 45 min" (design gate 3). A 1–3-day
   series is just appointments, and a 1–2-day span lists on each of its days. On
   its last day a condition leaves the band and shows once as "last day". */

const spanDays = (e: CalendarEvent) =>
  dayDiff(startOfDay(new Date(e.startsAt)), startOfDay(spanEndDate(e))) + 1

export const isConditionSpan = (e: CalendarEvent) => isMultiDay(e) && spanDays(e) >= 3

interface Classified {
  hero: CalendarEvent | null
  running: CalendarEvent[]
  upcoming: CalendarEvent[]
  listable: CalendarEvent[]
  shortSpans: CalendarEvent[]
  endingToday: CalendarEvent[]
}

function classify(events: CalendarEvent[], now: Date, horizon: number): Classified {
  const first = startOfDay(now)
  const lastExclusive = addDays(first, horizon)
  const inWindow = (e: CalendarEvent) =>
    spanEndDate(e) >= first && new Date(e.startsAt) < lastExclusive

  const conditions = [
    ...events.filter(isConditionSpan).filter(inWindow),
    ...conditionSeriesReps(events),
  ].sort((a, b) => a.startsAt.localeCompare(b.startsAt))
  // A series' last day is its last real occurrence — `recurrenceUntil` can fall on
  // a day it doesn't meet, or the final day can be cancelled. Knowable only when
  // the bound lies inside the fetched window.
  const endsToday = (e: CalendarEvent) => {
    if (!isDailyWindow(e)) return isSameDay(spanEndDate(e), now)
    if (!e.recurrenceUntil || parseDateKey(e.recurrenceUntil) >= lastExclusive) return false
    const last = events
      .filter((o) => o.seriesId === e.seriesId)
      .reduce((a, b) => (b.startsAt > a.startsAt ? b : a))
    return isSameDay(new Date(last.startsAt), now)
  }
  const standing = conditions.filter((e) => !endsToday(e))

  // A short spell of all-day days is a span; a timed event that crosses midnight
  // (a sleepover, a red-eye) is still an appointment.
  const isShortSpan = (e: CalendarEvent) => isMultiDay(e) && e.allDay && !isConditionSpan(e)
  const live = events
    .filter((e) => !isConditionSpan(e) && !isShortSpan(e))
    .filter((e) => !isConditionSeries(e) || isSameDay(new Date(e.startsAt), now))
    .filter((e) => eventEnd(e) >= now)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
  const hero = live[0] ?? null

  return {
    hero,
    running: standing.filter((e) => startOfDay(new Date(e.startsAt)) <= first),
    upcoming: standing.filter((e) => startOfDay(new Date(e.startsAt)) > first),
    listable: live.filter((e) => !isConditionSeries(e)),
    shortSpans: events.filter(isShortSpan).filter(inWindow),
    endingToday: conditions.filter(endsToday).flatMap((e) => {
      if (!isConditionSeries(e)) return [e]
      const todays = live.find(
        (l) => l.seriesId === e.seriesId && isSameDay(new Date(l.startsAt), now)
      )
      return todays && todays.id !== hero?.id ? [todays] : []
    }),
  }
}

/** Every list a day carries, from the classified window. */
function dayLists(c: Classified, date: Date, now: Date) {
  const covers = (e: CalendarEvent) =>
    startOfDay(new Date(e.startsAt)) <= date && startOfDay(spanEndDate(e)) >= date
  const shortHere = c.shortSpans.filter(covers)
  const isLast = (e: CalendarEvent) => isSameDay(spanEndDate(e), date)
  return {
    events: [
      ...shortHere.filter((e) => !isLast(e)),
      ...c.listable.filter((e) => e.id !== c.hero?.id && isSameDay(new Date(e.startsAt), date)),
    ],
    starting: c.upcoming.filter((e) => isSameDay(new Date(e.startsAt), date)),
    ending: [...(isSameDay(date, now) ? c.endingToday : []), ...shortHere.filter(isLast)],
  }
}

/** Split the forward window into the band + the day rows. */
export function buildWeek(
  events: CalendarEvent[],
  now: Date,
  windowDays: number = WEEK_WINDOW_DAYS
): WeekModel {
  const first = startOfDay(now)
  const lastExclusive = addDays(first, windowDays)
  const c = classify(events, now, windowDays)
  const days: WeekDay[] = Array.from({ length: windowDays }, (_, i) => {
    const date = addDays(first, i)
    return { date, ...dayLists(c, date, now) }
  })
  const beyond = c.listable.filter((e) => new Date(e.startsAt) >= lastExclusive).length
  return { hero: c.hero, spans: c.running, days, beyond }
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
  /** Appointments starting on this date, plus a 1–2-day span on its first day. */
  timed: CalendarEvent[]
  /** Conditions that START here — stated once, on the day they begin. */
  startingSpans: CalendarEvent[]
  /** Things on their last day, stated once as "last day" (D-083). */
  ending: CalendarEvent[]
}

const EMPTY_MARK_DATES: ReadonlySet<string> = new Set()

export interface AgendaModel {
  hero: CalendarEvent | null
  /** Conditions already under way — pinned in a band, because their start day is
   *  in the past and there is no upcoming section left to state them in. */
  running: CalendarEvent[]
  days: AgendaDay[]
}

/* The agenda is a six-week SCROLL, not a week — so the widget's "pin every span in
   an All-week band" rule doesn't transfer: a camp three weeks out is not "all
   week", and pinning it at the top would be a lie about when it matters.

   The rule that does transfer is the one that mattered: STATE A CONDITION EXACTLY
   ONCE (D-083 decides what is one). Here that means — pinned at the top if it is
   already running (its start day has passed, so no section below can carry it),
   otherwise inline, once, in the day it begins; on its last day, once, as "last
   day". It never repeats across the days it covers. */
export function buildAgenda(
  events: CalendarEvent[],
  now: Date,
  /** Dates (`YYYY-MM-DD`) carrying a day mark (ADR 050) — a day with a mark but no
      events still needs its section, so "Zach's got dinner" has a header to sit
      in. Empty by default; callers with no marks pass nothing. */
  markDates: ReadonlySet<string> = EMPTY_MARK_DATES,
  horizon: number = 42
): AgendaModel {
  const first = startOfDay(now)
  const c = classify(events, now, horizon)
  const days: AgendaDay[] = []
  for (let i = 0; i < horizon; i++) {
    const date = addDays(first, i)
    const { events: timed, starting: startingSpans, ending } = dayLists(c, date, now)
    if (
      timed.length ||
      startingSpans.length ||
      ending.length ||
      markDates.has(localDateKey(date))
    ) {
      days.push({ date, timed, startingSpans, ending })
    }
  }

  return { hero: c.hero, running: c.running, days }
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
  const days = daySetLabel(event.recurrenceWeekdays)
  const clock = event.endsAt
    ? `${formatChipTime(event.startsAt)} – ${formatChipTime(event.endsAt)}`
    : formatChipTime(event.startsAt)
  const bound = event.recurrenceUntil
    ? ` · through ${dayLabel(parseDateKey(event.recurrenceUntil), now)}`
    : ''
  return `${days} ${clock}${bound}`
}
