import type { CalendarEvent } from '../types'

/* The daily time-window series model (ADR 057). A 'daily' series arrives from the
   API pre-expanded into one occurrence per matching day; these helpers are how the
   client reads the series THROUGH its occurrences — the weekday set, the one
   statement per series, the offset↔weekday maps the wire contract needs.

   Offsets, not weekdays, cross the wire: `recurrenceDayOffsets` counts days from
   the series start's weekday mod 7, because the server has no timezone in which to
   resolve a weekday. The client is where local weekdays exist, so both maps live
   here, beside their tests. */

export const isDailyWindow = (e: Pick<CalendarEvent, 'recurrence'>) => e.recurrence === 'daily'

/** Write path: the picked local weekdays → wire offsets, anchored on the range
 *  start's local weekday. */
export function offsetsFromWeekdays(weekdays: number[], rangeStart: Date): number[] {
  const anchor = rangeStart.getDay()
  return [...new Set(weekdays.map((d) => (d - anchor + 7) % 7))].sort((a, b) => a - b)
}

/** Read path: wire offsets → local weekdays, anchored on the series start. */
export function weekdaysFromOffsets(offsets: number[], seriesStart: Date): number[] {
  const anchor = seriesStart.getDay()
  return [...new Set(offsets.map((o) => (anchor + o) % 7))].sort((a, b) => a - b)
}

const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

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

/** A daily series' local weekday set, read off any of its occurrences. */
export function windowWeekdays(event: CalendarEvent): number[] {
  return weekdaysFromOffsets(event.recurrenceDayOffsets, new Date(event.seriesStartsAt))
}

/** One representative occurrence per daily series — the earliest in range — for
 *  the surfaces that state a series exactly once (the All-week band, the agenda's
 *  Ongoing panel). Input order is preserved for everything else. */
export function dailySeriesReps(events: CalendarEvent[]): CalendarEvent[] {
  const bySeries = new Map<string, CalendarEvent>()
  for (const e of events) {
    if (!isDailyWindow(e)) continue
    const held = bySeries.get(e.seriesId)
    if (!held || e.startsAt < held.startsAt) bySeries.set(e.seriesId, e)
  }
  return [...bySeries.values()].sort((a, b) => a.startsAt.localeCompare(b.startsAt))
}
