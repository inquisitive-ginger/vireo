import { describe, expect, it } from 'vitest'
import type { CalendarEvent } from '../types'
import { buildAgenda, buildWeek, spanWhenLabel } from './week'
import { localDateKey } from './grid'

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
    seriesStartsAt: p.startsAt,
    endsAt: null,
    allDay: false,
    location: null,
    recurrence: null,
    recurrenceDayOffsets: [],
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

/* The agenda's rule is the widget's rule under a different window: STATE A SPAN
   EXACTLY ONCE. It just has two places to state it, because it scrolls six weeks —
   pinned if it is already running, otherwise inline on the day it begins. */
describe('buildAgenda', () => {
  // Started Thu 9, runs to Mon 13 — already under way at NOW (Sat 11).
  const RUNNING = mk({
    id: 'trip',
    title: 'Grandma visit',
    startsAt: '2026-07-09T00:00:00',
    endsAt: '2026-07-14T00:00:00',
    allDay: true,
  })

  it('pins a span that is already running — no day section below can carry it', () => {
    // TODAY_LATER is here to take the hero slot, so TOMORROW stays in the day list.
    const { running, days } = buildAgenda([RUNNING, TODAY_LATER, TOMORROW], NOW)
    expect(running.map((e) => e.id)).toEqual(['trip'])
    // And it claims no day rows: Sun 12 holds only the appointment.
    expect(days.flatMap((d) => d.startingSpans)).toHaveLength(0)
    expect(days.flatMap((d) => d.timed.map((e) => e.id))).toEqual(['tt'])
  })

  it('states a future span once, inline on the day it begins — never on the days it covers', () => {
    const { running, days } = buildAgenda([CAMP], NOW)
    expect(running).toHaveLength(0)
    const withCamp = days.filter((d) => d.startingSpans.some((e) => e.id === 'camp'))
    expect(withCamp).toHaveLength(1) // Mon 13 only — not Mon–Fri
    expect(withCamp[0].date.getDate()).toBe(13)
  })

  it('leads with the next live single-day event, and never a span, as the hero', () => {
    const { hero, days } = buildAgenda([CAMP, TODAY_LATER, TOMORROW], NOW)
    expect(hero?.id).toBe('date')
    // The hero is lifted out of the day list, so it is not stated twice.
    expect(days.flatMap((d) => d.timed.map((e) => e.id))).toEqual(['tt'])
  })

  it('omits days with nothing on them — the agenda is a scroll, not a grid', () => {
    const { days } = buildAgenda([TODAY_LATER, TOMORROW], NOW)
    expect(days).toHaveLength(1) // Sun 12 only; the hero holds today's remainder
    expect(days[0].date.getDate()).toBe(12)
  })

  it('is empty on a clear calendar', () => {
    expect(buildAgenda([], NOW)).toEqual({ hero: null, running: [], days: [] })
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

// ─── Daily time-window series (ADR 057, design gate 3) ───────────────────────

/* Server-shaped occurrences of one M–F 9:30–15:30 series: seriesStartsAt is the
   canonical Monday anchor, each occurrence carries the window on its own day. */
const SERIES_START = new Date(2026, 6, 6, 9, 30) // Mon Jul 6 — a Monday
function campOcc(day: Date): CalendarEvent {
  const date = localDateKey(day)
  const start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 9, 30)
  const end = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 15, 30)
  return mk({
    id: `camp:${date}`,
    seriesId: 'camp',
    occurrenceDate: date,
    isOccurrence: true,
    title: 'Girls Rock Math',
    startsAt: start.toISOString(),
    endsAt: end.toISOString(),
    seriesStartsAt: SERIES_START.toISOString(),
    recurrence: 'daily',
    recurrenceDayOffsets: [0, 1, 2, 3, 4],
    recurrenceUntil: '2026-07-24',
  })
}
// The week around NOW (Sat Jul 11): occurrences land Mon 13 – Fri 17.
const CAMP_WEEK = [13, 14, 15, 16, 17].map((d) => campOcc(new Date(2026, 6, d)))

describe('daily time-window series in buildWeek', () => {
  it('states the series once in the spans band and never in the day rows', () => {
    const week = buildWeek([...CAMP_WEEK, TOMORROW], NOW)
    expect(week.spans.map((s) => s.id)).toEqual(['camp:2026-07-13'])
    expect(week.days.flatMap((d) => d.events.map((e) => e.seriesId))).not.toContain('camp')
    expect(week.beyond).toBe(0)
  })

  it("makes only TODAY's occurrence hero-eligible", () => {
    // Saturday: no occurrence today → the hero is the ordinary next event.
    const sat = buildWeek([...CAMP_WEEK, TOMORROW], NOW)
    expect(sat.hero?.id).toBe('tt')

    // Monday 8:45 — camp starts at 9:30 → today's occurrence leads.
    const monday = new Date(2026, 6, 13, 8, 45)
    const mon = buildWeek(CAMP_WEEK, monday)
    expect(mon.hero?.id).toBe('camp:2026-07-13')
    // Still stated in the band — the hero is "now", the band is the condition.
    expect(mon.spans.map((s) => s.id)).toEqual(['camp:2026-07-13'])
  })
})

describe('daily time-window series in buildAgenda', () => {
  it('pins a running series in Ongoing; states an upcoming one on its start day', () => {
    // Saturday: first visible occurrence is Monday → inline on Monday, not pinned.
    const sat = buildAgenda([...CAMP_WEEK, TOMORROW], NOW)
    expect(sat.running).toHaveLength(0)
    const monday = sat.days.find((d) => d.date.getDate() === 13)
    expect(monday?.startingSpans.map((e) => e.seriesId)).toEqual(['camp'])

    // Mid-run Tuesday: today's occurrence exists → pinned in Ongoing.
    const tue = buildAgenda(CAMP_WEEK.slice(1), new Date(2026, 6, 14, 7, 0))
    expect(tue.running.map((e) => e.seriesId)).toEqual(['camp'])
    expect(tue.days.flatMap((d) => d.startingSpans)).toHaveLength(0)
  })

  it('never repeats the series in the day rows', () => {
    const model = buildAgenda(CAMP_WEEK, new Date(2026, 6, 14, 7, 0))
    expect(model.days.flatMap((d) => d.timed.map((e) => e.seriesId))).not.toContain('camp')
  })
})

describe('spanWhenLabel — daily window grammar', () => {
  it('reads day-set · window · bound', () => {
    expect(spanWhenLabel(CAMP_WEEK[0], NOW)).toBe('Weekdays 9:30 – 3:30 · through Fri 24')
  })
})
