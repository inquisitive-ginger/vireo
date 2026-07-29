import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { CalendarEvent, CalendarMember } from '../types'
import { UpNextView, type UpNextFraming, type WidgetSize } from './UpNextView'

/* jsdom has no layout, so the height-aware `DayList` sees clientHeight 0 and
   renders every row (no truncation) — which is exactly what we want for content
   assertions. The "+N more" clamp depends on real measurement and is verified in
   Storybook / the live app, not here. */

const MEMBERS = new Map<string, CalendarMember>([
  ['zach', { name: 'Zach' }],
  ['hallie', { name: 'Hallie' }],
  ['zoe', { name: 'Zoe' }],
  ['teddy', { name: 'Teddy' }],
])
const NOW = new Date('2026-07-11T13:20:00') // Saturday afternoon

function mk(
  p: Pick<CalendarEvent, 'id' | 'title' | 'startsAt' | 'attendeeIds'> & Partial<CalendarEvent>
): CalendarEvent {
  return {
    seriesId: p.id,
    occurrenceDate: null,
    isOccurrence: false,
    description: null,
    ownerId: p.attendeeIds[0] ?? null,
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

const EVENTS: CalendarEvent[] = [
  mk({
    id: 'e1',
    title: 'Karate',
    startsAt: '2026-07-11T16:30:00',
    attendeeIds: ['zoe'],
    location: 'Dojo',
  }),
  mk({ id: 'e2', title: 'Tumbling', startsAt: '2026-07-11T17:15:00', attendeeIds: ['teddy'] }),
  mk({
    id: 'e3',
    title: 'Date night',
    startsAt: '2026-07-11T19:00:00',
    attendeeIds: ['zach', 'hallie'],
  }),
  mk({ id: 'e4', title: 'Family BBQ', startsAt: '2026-07-12T13:00:00', attendeeIds: [] }),
  // A week-long span: the event that used to claim a row on all five of its days.
  mk({
    id: 'camp',
    title: 'FISW Camp',
    startsAt: '2026-07-13T00:00:00',
    endsAt: '2026-07-18T00:00:00',
    allDay: true,
    attendeeIds: ['zoe', 'teddy'],
  }),
]

function renderWidget(props: {
  events?: CalendarEvent[]
  framing?: UpNextFraming
  size?: WidgetSize
}) {
  return render(
    <MemoryRouter>
      <UpNextView
        events={props.events ?? EVENTS}
        membersById={MEMBERS}
        now={NOW}
        framing={props.framing ?? 'family'}
        size={props.size ?? 'large'}
      />
    </MemoryRouter>
  )
}

describe('UpNextView', () => {
  it('leads with the next-up hero and lists the rest', () => {
    renderWidget({})
    expect(screen.getByText('Up next ·')).toBeInTheDocument()
    expect(screen.getByText('Karate')).toBeInTheDocument()
    // The rest appear as rows, and the hero is not duplicated among them.
    expect(screen.getByText('Tumbling')).toBeInTheDocument()
    expect(screen.getByText('Date night')).toBeInTheDocument()
    expect(screen.getAllByText('Karate')).toHaveLength(1)
  })

  // NOW is Sat 13:20 and Karate is Sat 16:30 — still today, so "how soon" beats
  // "which day", and the eyebrow keeps the countdown it has always shown.
  it('keeps the countdown, not a day label, while the hero is still today', () => {
    renderWidget({})
    expect(screen.getByText('Up next ·')).toBeInTheDocument()
    expect(screen.getByText('in 3h 10m')).toBeInTheDocument()
    expect(screen.queryByText('Nothing left today ·')).not.toBeInTheDocument()
  })

  /* The bug. The hero is the next event still LIVE — not the next event today —
     so on a spent evening it silently promotes a future day. It used to announce
     that day's bare clock ("1:00 PM"), which reads as tonight. It must name the
     day, and say that today is done. */
  it('names the day and says today is spent when the hero is not today', () => {
    const bbq = EVENTS.find((e) => e.id === 'e4')!
    renderWidget({ events: [bbq] })

    expect(screen.getByText('Nothing left today ·')).toBeInTheDocument()
    expect(screen.getAllByText('Tomorrow').length).toBeGreaterThan(0)
    expect(screen.queryByText('Up next ·')).not.toBeInTheDocument()
    // The clock still renders — in the meta line, where it can't be mistaken for
    // the proximity clause.
    expect(screen.getByText('1:00 PM')).toBeInTheDocument()
  })

  /* A single-day all-day event has no clock, and printing its midnight start as
     "12:00 am" states a time the event doesn't have. */
  it('labels a single-day all-day row "all day", not midnight', () => {
    const picnic = mk({
      id: 'allday',
      title: 'School closed',
      startsAt: '2026-07-12T00:00:00',
      allDay: true,
      attendeeIds: ['zoe'],
    })
    renderWidget({ events: [...EVENTS, picnic] })

    expect(screen.getByText('all day')).toBeInTheDocument()
    expect(screen.queryByText('12:00 am')).not.toBeInTheDocument()
  })

  it('states a multi-day span once in the all-week band, not on every day it touches', () => {
    renderWidget({})
    const band = screen.getByTestId('span-band')
    expect(within(band).getByText('All week')).toBeInTheDocument()
    expect(within(band).getByText('FISW Camp')).toBeInTheDocument()
    expect(within(band).getByText('Mon 13 – Fri 17')).toBeInTheDocument()
    // Once in the whole tile — the camp covers Mon–Fri and claims no day row.
    expect(screen.getAllByText('FISW Camp')).toHaveLength(1)
  })

  it('hides the all-week band entirely when there are no spans', () => {
    renderWidget({ events: EVENTS.filter((e) => e.id !== 'camp') })
    expect(screen.queryByTestId('span-band')).not.toBeInTheDocument()
    expect(screen.queryByText('All week')).not.toBeInTheDocument()
  })

  it('keeps empty weekdays in place — an empty day is news', () => {
    renderWidget({})
    // Mon–Fri hold only the camp (which is now in the band), so those days report
    // as clear rather than vanishing.
    expect(screen.getAllByText('Nothing else scheduled').length).toBeGreaterThan(0)
  })

  it('shows owners as avatars in the Family framing', () => {
    renderWidget({ framing: 'family' })
    // Rows carry avatars (labelled by name), not spelled-out owner names.
    expect(screen.getAllByLabelText('Teddy').length).toBeGreaterThan(0)
    expect(screen.getAllByLabelText('Zach').length).toBeGreaterThan(0)
    expect(screen.getAllByLabelText('Hallie').length).toBeGreaterThan(0)
    // A no-attendee event is still tagged Family.
    expect(screen.getAllByLabelText('Family').length).toBeGreaterThan(0)
  })

  it('drops owner avatars in the Mine framing but keeps the Family tag', () => {
    renderWidget({ framing: 'mine' })
    expect(screen.getByText('Karate')).toBeInTheDocument()
    expect(screen.queryByLabelText('Teddy')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Zach')).not.toBeInTheDocument()
    expect(screen.getAllByLabelText('Family').length).toBeGreaterThan(0)
  })

  it.each(['compact', 'standard', 'large'] as WidgetSize[])('renders the %s size', (size) => {
    renderWidget({ size })
    expect(screen.getByText('Karate')).toBeInTheDocument()
    // Every size states the span somewhere — the narrow ones compress it to a line.
    expect(screen.getAllByText(/FISW Camp/).length).toBeGreaterThan(0)
  })

  it('shows the all-clear empty state with no events', () => {
    renderWidget({ events: [] })
    expect(screen.getByText('Nothing scheduled')).toBeInTheDocument()
    expect(screen.queryByText('Up next')).not.toBeInTheDocument()
  })

  it('is not all-clear when only a running span remains', () => {
    renderWidget({ events: [EVENTS[4]] })
    expect(screen.queryByText('Nothing scheduled')).not.toBeInTheDocument()
    expect(screen.getByTestId('span-band')).toBeInTheDocument()
  })

  it('deep-links the whole tile to /calendar', () => {
    renderWidget({})
    const link = screen.getByRole('link', { name: 'Open Calendar' })
    expect(link).toHaveAttribute('href', '/calendar')
    expect(within(link).getByText('Karate')).toBeInTheDocument()
  })
})
