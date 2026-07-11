import { describe, expect, it } from 'vitest'
import type { CalendarEvent } from '../types'
import { buildWeek, spanWhenLabel } from './week'

const NOW = new Date('2026-07-11T13:20:00') // Saturday afternoon

function mk(
  p: Pick<CalendarEvent, 'id' | 'title' | 'startsAt'> & Partial<CalendarEvent>
): CalendarEvent {
  return {
    seriesId: p.id,
    occurrenceDate: null,
    isOccurrence: false,
    description: null,
    attendeeIds: [],
    ownerId: null,
    createdBy: 'seed',
    endsAt: null,
    allDay: false,
    location: null,
    recurrence: null,
    recurrenceUntil: null,
    isActivity: false,
    status: 'confirmed',
    source: 'manual',
    reminderMinutes: null,
    createdAt: '',
    updatedAt: '',
    ...p,
  }
}

// A camp running Mon 13 → Fri 17 (end is the exclusive Sat 18 midnight).
const CAMP = mk({
  id: 'camp',
  title: 'FISW Camp',
  startsAt: '2026-07-13T00:00:00',
  endsAt: '2026-07-18T00:00:00',
  allDay: true,
})
const TOMORROW = mk({ id: 'tt', title: 'T&T', startsAt: '2026-07-12T11:00:00' })
const TODAY_LATER = mk({ id: 'date', title: 'Date night', startsAt: '2026-07-11T19:00:00' })

describe('buildWeek', () => {
  it('states a multi-day span once, not on every day it touches', () => {
    // TODAY_LATER takes the hero slot, so TOMORROW is left to prove the point:
    // the camp covers Mon–Fri and still claims no row on any of them.
    const { spans, days } = buildWeek([CAMP, TODAY_LATER, TOMORROW], NOW)
    expect(spans.map((s) => s.id)).toEqual(['camp'])
    const listed = days.flatMap((d) => d.events.map((e) => e.id))
    expect(listed).not.toContain('camp')
    expect(listed).toEqual(['tt'])
  })

  it('keeps a span that started before today and is still running', () => {
    const running = mk({
      id: 'grandma',
      title: 'Grandma visiting',
      startsAt: '2026-07-08T00:00:00',
      endsAt: '2026-07-14T00:00:00',
      allDay: true,
    })
    expect(buildWeek([running], NOW).spans.map((s) => s.id)).toEqual(['grandma'])
  })

  it('drops a span that ended before today', () => {
    const past = mk({
      id: 'old',
      title: 'Old trip',
      startsAt: '2026-07-01T00:00:00',
      endsAt: '2026-07-05T00:00:00',
      allDay: true,
    })
    expect(buildWeek([past], NOW).spans).toEqual([])
  })

  it('picks the next live single-day event as the hero, never a span', () => {
    const { hero, days } = buildWeek([CAMP, TODAY_LATER, TOMORROW], NOW)
    expect(hero?.id).toBe('date')
    // The hero is not repeated in the day list.
    expect(days.flatMap((d) => d.events.map((e) => e.id))).toEqual(['tt'])
  })

  it('treats an in-progress event as still live (it is what is happening now)', () => {
    const inProgress = mk({
      id: 'fest',
      title: 'Summer Fest',
      startsAt: '2026-07-11T10:00:00',
      endsAt: '2026-07-11T16:00:00',
    })
    expect(buildWeek([inProgress, TODAY_LATER], NOW).hero?.id).toBe('fest')
  })

  it('drops events that have already ended', () => {
    const done = mk({
      id: 'gone',
      title: 'Breakfast',
      startsAt: '2026-07-11T08:00:00',
      endsAt: '2026-07-11T09:00:00',
    })
    const { hero, days } = buildWeek([done, TOMORROW], NOW)
    expect(hero?.id).toBe('tt')
    expect(days.flatMap((d) => d.events.map((e) => e.id))).toEqual([])
  })

  it('returns all seven days, empty ones included', () => {
    const { days } = buildWeek([TODAY_LATER, TOMORROW], NOW)
    expect(days).toHaveLength(7)
    expect(days[0].date.getDate()).toBe(11) // today leads
    expect(days[6].date.getDate()).toBe(17)
    // TODAY_LATER is the hero, so only TOMORROW's day carries a row.
    expect(days.filter((d) => d.events.length === 0)).toHaveLength(6)
    expect(days[1].events.map((e) => e.id)).toEqual(['tt'])
  })

  it('counts appointments past the window edge as "beyond", not as rows', () => {
    const nextWeek = mk({ id: 'far', title: 'Dentist', startsAt: '2026-07-20T09:00:00' })
    const { days, beyond } = buildWeek([TOMORROW, nextWeek], NOW)
    expect(beyond).toBe(1)
    expect(days.flatMap((d) => d.events.map((e) => e.id))).not.toContain('far')
  })

  it('has no hero and no spans on a clear week', () => {
    const { hero, spans, days, beyond } = buildWeek([], NOW)
    expect(hero).toBeNull()
    expect(spans).toEqual([])
    expect(beyond).toBe(0)
    expect(days.every((d) => d.events.length === 0)).toBe(true)
  })
})

describe('spanWhenLabel', () => {
  it('gives a range for a span that has not started', () => {
    expect(spanWhenLabel(CAMP, NOW)).toBe('Mon 13 – Fri 17')
  })

  it('drops the start date once the span is already running', () => {
    const running = mk({
      id: 'r',
      title: 'Grandma visiting',
      startsAt: '2026-07-08T00:00:00',
      endsAt: '2026-07-14T00:00:00',
      allDay: true,
    })
    expect(spanWhenLabel(running, NOW)).toBe('Through Mon 13')
  })
})
