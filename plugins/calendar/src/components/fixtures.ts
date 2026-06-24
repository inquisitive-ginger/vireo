import type { CalendarEvent } from '../types'

/* Shared Storybook fixtures for the calendar components — a representative
   June 2026 family month (the visual reference the deleted `Calendar Exploration`
   story used to carry, now driving the real components). */

export const STORY_MEMBERS = new Map<string, string>([
  ['p1', 'Zach'],
  ['p2', 'Hallie'],
  ['p3', 'Zoe'],
  ['p4', 'Teddy'],
])

export const STORY_TODAY = new Date(2026, 5, 22)

let seq = 0
function event(o: {
  title: string
  attendeeIds?: string[]
  start: Date
  end?: Date
  allDay?: boolean
  recurrence?: 'weekly'
  location?: string
}): CalendarEvent {
  const id = `story-${seq++}`
  return {
    id,
    seriesId: id,
    occurrenceDate: null,
    isOccurrence: false,
    title: o.title,
    description: null,
    attendeeIds: o.attendeeIds ?? [],
    ownerId: o.attendeeIds?.length === 1 ? o.attendeeIds[0] : null,
    createdBy: 'p1',
    startsAt: o.start.toISOString(),
    endsAt: o.end ? o.end.toISOString() : null,
    allDay: o.allDay ?? false,
    location: o.location ?? null,
    recurrence: o.recurrence ?? null,
    recurrenceUntil: null,
    isActivity: o.recurrence === 'weekly' && (o.attendeeIds?.length ?? 0) === 1,
    status: 'confirmed',
    source: 'manual',
    reminderMinutes: null,
    createdAt: '',
    updatedAt: '',
  }
}

// Every June-2026 date on `weekday`, at `h:m` — a recurring activity expanded the
// way the server would (MonthGrid consumes already-expanded occurrences).
function weekly(
  title: string,
  attendeeIds: string[],
  weekday: number,
  h: number,
  m: number
): CalendarEvent[] {
  const out: CalendarEvent[] = []
  for (let day = 1; day <= 30; day++) {
    const start = new Date(2026, 5, day, h, m)
    if (start.getDay() === weekday)
      out.push(event({ title, attendeeIds, start, recurrence: 'weekly' }))
  }
  return out
}

export const STORY_EVENTS: CalendarEvent[] = [
  // Recurring activity backbone (solo).
  ...weekly('Gymnastics', ['p3'], 1, 16, 0),
  ...weekly('T&T', ['p4'], 2, 17, 15),
  ...weekly('Karate', ['p3'], 3, 16, 30),
  ...weekly('Swim', ['p4'], 4, 18, 0),
  ...weekly('Piano', ['p3'], 5, 15, 30),
  // One-offs: solo, shared (split fill), Family (neutral).
  event({
    title: 'Dentist',
    attendeeIds: ['p3', 'p4'],
    start: new Date(2026, 5, 9, 10),
    end: new Date(2026, 5, 9, 11),
    location: 'Dr. Lee',
  }),
  event({
    title: 'Parent–teacher',
    start: new Date(2026, 5, 11, 17),
    end: new Date(2026, 5, 11, 18),
  }),
  event({
    title: 'Soccer game',
    attendeeIds: ['p4'],
    start: new Date(2026, 5, 13, 9),
    end: new Date(2026, 5, 13, 10),
  }),
  event({
    title: 'Date night',
    attendeeIds: ['p1', 'p2'],
    start: new Date(2026, 5, 20, 19),
    end: new Date(2026, 5, 20, 21),
  }),
  event({ title: 'Family BBQ', start: new Date(2026, 5, 21, 13), end: new Date(2026, 5, 21, 16) }),
  // Crowded day (the 22nd already has T&T) → +N more.
  event({
    title: 'Doctor',
    attendeeIds: ['p3'],
    start: new Date(2026, 5, 22, 11),
    end: new Date(2026, 5, 22, 12),
    location: 'Pediatrics',
  }),
  event({
    title: 'Book club',
    attendeeIds: ['p2'],
    start: new Date(2026, 5, 22, 15, 30),
    end: new Date(2026, 5, 22, 17),
  }),
  event({ title: 'Grocery run', start: new Date(2026, 5, 22, 13), end: new Date(2026, 5, 22, 14) }),
  // Multi-day spans (all-day) — Family wrap, solo, shared.
  event({
    title: 'Grandma visits',
    start: new Date(2026, 5, 5, 12),
    end: new Date(2026, 5, 8, 12),
    allDay: true,
  }),
  event({
    title: 'Zach → London',
    attendeeIds: ['p1'],
    start: new Date(2026, 5, 16, 12),
    end: new Date(2026, 5, 19, 12),
    allDay: true,
  }),
  event({
    title: 'FISW Camp',
    attendeeIds: ['p3', 'p4'],
    start: new Date(2026, 5, 22, 12),
    end: new Date(2026, 5, 26, 12),
    allDay: true,
  }),
]
