/** The wire shape returned by `GET /api/calendar/events` (see
 *  `apps/api/src/plugins/calendar.ts` → `serializeEvent`). A recurring series is
 *  pre-expanded server-side into one object per occurrence; `seriesId` is the
 *  canonical event, `id` is the synthetic occurrence id. */
export interface CalendarEvent {
  id: string
  seriesId: string
  occurrenceDate: string | null
  isOccurrence: boolean
  title: string
  description: string | null
  attendeeIds: string[]
  ownerId: string | null
  createdBy: string
  startsAt: string
  endsAt: string | null
  allDay: boolean
  location: string | null
  recurrence: string | null
  recurrenceUntil: string | null
  isActivity: boolean
  status: string
  source: string
  reminderMinutes: number | null
  createdAt: string
  updatedAt: string
}

export interface EventsResponse {
  events: CalendarEvent[]
}

/** Platform profile, as returned by `GET /api/profiles` (the roster the month
 *  view maps attendee ids → identity hue against). */
export interface FamilyMember {
  id: string
  name: string
  tier: number
}

export type CalendarView = 'month' | 'week' | 'day'
