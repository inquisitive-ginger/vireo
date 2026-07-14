import { describe, it, expect } from 'vitest'
import type { CalendarEvent } from '../types'
import {
  buildMonthWeeks,
  buildWeek,
  eventsForDay,
  eventsOnDay,
  heroWhen,
  isMultiDay,
  layoutMonth,
  localDateKey,
  rangeFor,
  spansForWeek,
} from './grid'

// Build a CalendarEvent fixture from local Date(s) so day-bucketing is TZ-stable.
function evt(partial: { id: string; start: Date; end?: Date; allDay?: boolean }): CalendarEvent {
  return {
    id: partial.id,
    seriesId: partial.id,
    occurrenceDate: null,
    isOccurrence: false,
    title: partial.id,
    description: null,
    attendeeIds: [],
    ownerId: null,
    createdBy: 'x',
    startsAt: partial.start.toISOString(),
    endsAt: partial.end ? partial.end.toISOString() : null,
    allDay: partial.allDay ?? false,
    location: null,
    recurrence: null,
    recurrenceUntil: null,
    isActivity: false,
    status: 'confirmed',
    source: 'manual',
    reminderMinutes: null,
    createdAt: '',
    updatedAt: '',
  }
}

describe('buildMonthWeeks', () => {
  it('is Sunday-start, whole weeks, and includes adjacent-month spillover', () => {
    const weeks = buildMonthWeeks(2026, 5) // June 2026
    expect(weeks.every((w) => w.length === 7)).toBe(true)
    expect(weeks.every((w) => w[0].date.getDay() === 0)).toBe(true) // col 0 = Sunday
    // June 1 lives somewhere in the first week; week count covers the month.
    const flat = weeks.flat()
    expect(flat.some((c) => c.inMonth && c.date.getDate() === 1)).toBe(true)
    expect(flat.some((c) => c.inMonth && c.date.getDate() === 30)).toBe(true)
    // Leading cells before June 1 are out-of-month.
    expect(flat[0].inMonth).toBe(false)
  })
})

describe('isMultiDay', () => {
  it('is false for a single-day timed event', () => {
    expect(
      isMultiDay(evt({ id: 'a', start: new Date(2026, 5, 9, 10), end: new Date(2026, 5, 9, 11) }))
    ).toBe(false)
  })
  it('is false for an event ending exactly at the next midnight (exclusive bound)', () => {
    expect(
      isMultiDay(evt({ id: 'b', start: new Date(2026, 5, 9, 18), end: new Date(2026, 5, 10, 0) }))
    ).toBe(false)
  })
  it('is false with no end', () => {
    expect(isMultiDay(evt({ id: 'c', start: new Date(2026, 5, 9, 10) }))).toBe(false)
  })
  it('is true across 2+ days', () => {
    expect(
      isMultiDay(evt({ id: 'd', start: new Date(2026, 5, 5), end: new Date(2026, 5, 8) }))
    ).toBe(true)
  })
})

describe('eventsOnDay', () => {
  it('returns single-day events on the date, time-sorted, excluding spans', () => {
    const events = [
      evt({ id: 'late', start: new Date(2026, 5, 9, 17) }),
      evt({ id: 'early', start: new Date(2026, 5, 9, 9) }),
      evt({ id: 'other', start: new Date(2026, 5, 10, 9) }),
      evt({ id: 'span', start: new Date(2026, 5, 8), end: new Date(2026, 5, 11) }),
    ]
    const got = eventsOnDay(events, new Date(2026, 5, 9))
    expect(got.map((e) => e.id)).toEqual(['early', 'late'])
  })
})

describe('eventsForDay', () => {
  it('includes a multi-day span covering the date', () => {
    const span = evt({ id: 'camp', start: new Date(2026, 5, 8), end: new Date(2026, 5, 11) })
    const got = eventsForDay([span], new Date(2026, 5, 10))
    expect(got.map((e) => e.id)).toContain('camp')
  })
})

describe('spansForWeek lane packing', () => {
  it('places overlapping spans on separate lanes with open edges across the boundary', () => {
    const week = buildWeek(new Date(2026, 5, 3)) // the week containing June 3
    const a = evt({ id: 'a', start: week[0], end: week[3] })
    const b = evt({ id: 'b', start: week[2], end: week[5] })
    // c starts before this week → openStart; ends after → openEnd.
    const wide = evt({
      id: 'c',
      start: new Date(week[0].getTime() - 5 * 86_400_000),
      end: new Date(week[6].getTime() + 5 * 86_400_000),
    })
    const placed = spansForWeek([a, b, wide], week)
    const byId = Object.fromEntries(placed.map((p) => [p.event.id, p]))
    expect(byId.a.lane).not.toBe(byId.b.lane) // they overlap → different lanes
    expect(byId.c.openStart).toBe(true)
    expect(byId.c.openEnd).toBe(true)
    expect(byId.c.startCol).toBe(0)
    expect(byId.c.endCol).toBe(6)
  })
})

describe('layoutMonth', () => {
  it('buckets singles into cells and spans into weeks', () => {
    const events = [
      evt({ id: 'single', start: new Date(2026, 5, 9, 10) }),
      evt({ id: 'span', start: new Date(2026, 5, 22), end: new Date(2026, 5, 26) }),
    ]
    const weeks = layoutMonth(events, 2026, 5)
    const single = weeks.flatMap((w) => w.cells).flatMap((c) => c.events)
    expect(single.map((e) => e.id)).toContain('single')
    const spans = weeks.flatMap((w) => w.spans)
    expect(spans.map((s) => s.event.id)).toContain('span')
  })
})

describe('rangeFor', () => {
  it('month range spans the full visible grid', () => {
    const { from, to } = rangeFor('month', new Date(2026, 5, 15))
    const weeks = buildMonthWeeks(2026, 5)
    expect(localDateKey(new Date(from))).toBe(localDateKey(weeks[0][0].date))
    expect(localDateKey(new Date(to))).toBe(localDateKey(weeks[weeks.length - 1][6].date))
  })
  it('day range is the single day', () => {
    const { from, to } = rangeFor('day', new Date(2026, 5, 15, 12))
    expect(localDateKey(new Date(from))).toBe('2026-06-15')
    expect(localDateKey(new Date(to))).toBe('2026-06-15')
  })
})

describe('heroWhen', () => {
  // Mon 13 Jul 2026, 4:00 PM — the hero is picked from a week-long window, so
  // "later today" and "a later day" are both routine, not edge cases.
  const now = new Date(2026, 6, 13, 16, 0)

  it('counts down a later-today event', () => {
    const w = heroWhen(evt({ id: 'e', start: new Date(2026, 6, 13, 17, 15) }), now)
    expect(w).toEqual({ when: 'in 1h 15m', clock: '5:15 PM', future: false })
  })

  it('says Now while the event is under way', () => {
    const w = heroWhen(
      evt({ id: 'e', start: new Date(2026, 6, 13, 15, 30), end: new Date(2026, 6, 13, 17, 0) }),
      now
    )
    expect(w).toEqual({ when: 'Now', clock: '3:30 PM', future: false })
  })

  // The bug this function exists to kill: a tomorrow event used to report its bare
  // clock ("5:15 PM") as the proximity clause, which reads as today.
  it('names the DAY for tomorrow, not the clock', () => {
    const w = heroWhen(evt({ id: 'e', start: new Date(2026, 6, 14, 17, 15) }), now)
    expect(w).toEqual({ when: 'Tomorrow', clock: '5:15 PM', future: true })
  })

  it('names the weekday within the week and the date beyond it', () => {
    expect(heroWhen(evt({ id: 'e', start: new Date(2026, 6, 18, 14, 0) }), now).when).toBe(
      'Saturday'
    )
    expect(heroWhen(evt({ id: 'e', start: new Date(2026, 6, 22, 14, 0) }), now).when).toBe('Jul 22')
  })

  // A later start day means the hero — the first event still live — is not today,
  // so nothing single-day is left today. That's what `future` licenses the eyebrow
  // to say, and why an in-progress event that STARTED yesterday must not set it.
  it('does not mark a still-running event from an earlier day as future', () => {
    const w = heroWhen(
      evt({ id: 'e', start: new Date(2026, 6, 12, 9, 0), end: new Date(2026, 6, 13, 18, 0) }),
      now
    )
    expect(w.future).toBe(false)
    expect(w.when).toBe('Now')
  })

  // An all-day hero rendered no time line at all, because the meta line was keyed
  // on having a clock. `clock` is always a renderable string.
  it('gives an all-day event a clock label and still names its day', () => {
    const w = heroWhen(evt({ id: 'e', start: new Date(2026, 6, 14), allDay: true }), now)
    expect(w).toEqual({ when: 'Tomorrow', clock: 'All day', future: true })
  })
})
