import { addDays, dayDiff, isSameDay, startOfDay } from '@family-os/ui'
import type { CalendarEvent } from '../types'
import { isMultiDay, spanEndDate } from './grid'

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
}

export interface WeekModel {
  /** The next single-day event still live — the hero. Spans are never the hero:
   *  "FISW Camp, day 3 of 5" is not what's happening next. */
  hero: CalendarEvent | null
  /** Multi-day events overlapping the window — the "all week" band's feed. */
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

/** Split the forward window into spans + timed days. */
export function buildWeek(
  events: CalendarEvent[],
  now: Date,
  windowDays: number = WEEK_WINDOW_DAYS
): WeekModel {
  const first = startOfDay(now)
  const lastExclusive = addDays(first, windowDays)

  // A span counts if it overlaps the window at all — including one that started
  // before today and is still running (the camp you're already halfway through).
  const spans = events
    .filter(isMultiDay)
    .filter((e) => spanEndDate(e) >= first && new Date(e.startsAt) < lastExclusive)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))

  const live = events
    .filter((e) => !isMultiDay(e))
    .filter((e) => eventEnd(e) >= now)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))

  const hero = live[0] ?? null

  const days: WeekDay[] = Array.from({ length: windowDays }, (_, i) => {
    const date = addDays(first, i)
    return {
      date,
      events: live.filter((e) => e.id !== hero?.id && isSameDay(new Date(e.startsAt), date)),
    }
  })

  const beyond = live.filter((e) => new Date(e.startsAt) >= lastExclusive).length
  return { hero, spans, days, beyond }
}

/* "Mon 13". Composed rather than handed to `toLocaleDateString({weekday, day})`,
   which orders the parts by locale ("13 Mon" in en-US) — the weekday has to lead
   for the range to scan. */
const shortDay = (d: Date) =>
  `${d.toLocaleDateString(undefined, { weekday: 'short' })} ${d.getDate()}`

/** A span's "when" — a date range, never a clock. Once it's already running the
 *  start date is dead weight, so it collapses to "Through Fri 17". "All day" is
 *  implied by a multi-day event; saying it is noise. */
export function spanWhenLabel(event: CalendarEvent, now: Date): string {
  const start = new Date(event.startsAt)
  const end = spanEndDate(event)
  return dayDiff(startOfDay(now), start) < 0
    ? `Through ${shortDay(end)}`
    : `${shortDay(start)} – ${shortDay(end)}`
}
