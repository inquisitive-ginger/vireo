import { describe, expect, it } from 'vitest'
import type { CalendarEvent } from '../types'
import { daySetLabel, dailySeriesReps, offsetsFromWeekdays, weekdaysFromOffsets } from './series'

// 2026-07-06 is a Monday, 2026-07-05 a Sunday — local Dates, so the anchor
// weekday is TZ-stable.
const MONDAY = new Date(2026, 6, 6)
const SUNDAY = new Date(2026, 6, 5)

describe('offset ↔ weekday maps (ADR 057)', () => {
  it('anchors offsets on the range start weekday', () => {
    // Mon–Fri picked, Monday start → offsets 0–4.
    expect(offsetsFromWeekdays([1, 2, 3, 4, 5], MONDAY)).toEqual([0, 1, 2, 3, 4])
    // Same picks, Sunday start → shifted by one.
    expect(offsetsFromWeekdays([1, 2, 3, 4, 5], SUNDAY)).toEqual([1, 2, 3, 4, 5])
  })

  it('round-trips through both maps', () => {
    for (const anchor of [MONDAY, SUNDAY]) {
      for (const days of [[1, 2, 3, 4, 5], [0, 6], [2], [0, 1, 2, 3, 4, 5, 6]]) {
        expect(weekdaysFromOffsets(offsetsFromWeekdays(days, anchor), anchor)).toEqual(days)
      }
    }
  })
})

describe('daySetLabel', () => {
  it('names the common sets and lists the rest', () => {
    expect(daySetLabel([0, 1, 2, 3, 4, 5, 6])).toBe('Every day')
    expect(daySetLabel([1, 2, 3, 4, 5])).toBe('Weekdays')
    expect(daySetLabel([0, 6])).toBe('Weekends')
    expect(daySetLabel([1, 3, 5])).toBe('Mon · Wed · Fri')
  })
})

function occ(seriesId: string, startsAt: string): CalendarEvent {
  const date = startsAt.slice(0, 10)
  return {
    id: `${seriesId}:${date}`,
    seriesId,
    occurrenceDate: date,
    isOccurrence: true,
    title: seriesId,
    description: null,
    attendeeIds: [],
    ownerId: null,
    createdBy: 'x',
    startsAt,
    seriesStartsAt: startsAt,
    endsAt: null,
    allDay: false,
    location: null,
    recurrence: 'daily',
    recurrenceDayOffsets: [0, 1, 2, 3, 4],
    recurrenceUntil: null,
    isActivity: false,
    status: 'confirmed',
    source: 'manual',
    reminderMinutes: null,
    createdAt: '',
    updatedAt: '',
  }
}

describe('dailySeriesReps', () => {
  it('keeps one earliest occurrence per series, series-sorted', () => {
    const reps = dailySeriesReps([
      occ('b', '2026-07-08T09:30:00'),
      occ('a', '2026-07-07T09:30:00'),
      occ('a', '2026-07-06T09:30:00'),
      occ('b', '2026-07-09T09:30:00'),
    ])
    expect(reps.map((r) => r.id)).toEqual(['a:2026-07-06', 'b:2026-07-08'])
  })
})
