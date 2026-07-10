import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { CalendarEvent } from '../types'
import { UpNextView, type UpNextFraming, type WidgetSize } from './UpNextView'

/* jsdom has no layout, so the height-aware `ThenAgenda` sees clientHeight 0 and
   renders every block (no truncation) — which is exactly what we want for content
   assertions. The "+N more" overflow depends on real measurement and is verified
   in Storybook / the live app, not here. */

const MEMBERS = new Map<string, string>([
  ['zach', 'Zach'],
  ['hallie', 'Hallie'],
  ['zoe', 'Zoe'],
  ['teddy', 'Teddy'],
])
const NOW = new Date('2026-07-09T16:00:00')

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

const EVENTS: CalendarEvent[] = [
  mk({
    id: 'e1',
    title: 'Karate',
    startsAt: '2026-07-09T16:30:00',
    attendeeIds: ['zoe'],
    location: 'Dojo',
  }),
  mk({ id: 'e2', title: 'Tumbling', startsAt: '2026-07-09T17:15:00', attendeeIds: ['teddy'] }),
  mk({
    id: 'e3',
    title: 'Date night',
    startsAt: '2026-07-09T19:00:00',
    attendeeIds: ['zach', 'hallie'],
  }),
  mk({ id: 'e4', title: 'Family BBQ', startsAt: '2026-07-10T13:00:00', attendeeIds: [] }),
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
    renderWidget({ framing: 'family', size: 'large' })
    // Hero: the soonest event.
    expect(screen.getByText('Up next')).toBeInTheDocument()
    expect(screen.getByText('Karate')).toBeInTheDocument()
    // The rest appear as rows (hero not duplicated).
    expect(screen.getByText('Tumbling')).toBeInTheDocument()
    expect(screen.getByText('Date night')).toBeInTheDocument()
    expect(screen.getAllByText('Karate')).toHaveLength(1)
  })

  it('shows owner names in the Family framing (incl. shared + Family tags)', () => {
    renderWidget({ framing: 'family', size: 'large' })
    expect(screen.getByText('Zoe')).toBeInTheDocument() // hero owner
    expect(screen.getByText('Teddy')).toBeInTheDocument() // a row owner
    expect(screen.getByText('Zach & Hallie')).toBeInTheDocument() // shared
    expect(screen.getByText('Family')).toBeInTheDocument() // no-attendee event tagged
  })

  it('drops member names in the Mine framing but keeps the Family tag', () => {
    renderWidget({ framing: 'mine', size: 'large' })
    // The hero (Karate/Zoe) still renders, but the solo owner name is dropped.
    expect(screen.getByText('Karate')).toBeInTheDocument()
    expect(screen.queryByText('Zoe')).not.toBeInTheDocument()
    expect(screen.queryByText('Teddy')).not.toBeInTheDocument()
    // A Family (no-attendee) event is still tagged.
    expect(screen.getByText('Family')).toBeInTheDocument()
  })

  it.each(['compact', 'standard', 'large'] as WidgetSize[])('renders the %s size', (size) => {
    renderWidget({ size })
    expect(screen.getByText('Karate')).toBeInTheDocument()
  })

  it('shows the all-clear empty state with no events', () => {
    renderWidget({ events: [], size: 'large' })
    expect(screen.getByText('Nothing scheduled')).toBeInTheDocument()
    expect(screen.queryByText('Up next')).not.toBeInTheDocument()
  })

  it('deep-links the whole tile to /calendar', () => {
    renderWidget({ size: 'large' })
    const link = screen.getByRole('link', { name: 'Open Calendar' })
    expect(link).toHaveAttribute('href', '/calendar')
    // The hero is inside the tap-through target.
    expect(within(link).getByText('Karate')).toBeInTheDocument()
  })
})
