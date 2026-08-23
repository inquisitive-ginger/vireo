import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import type { DayMark } from '@family-os/platform/types'
import type { CalendarEvent, CalendarMember } from '../types'
import { localDateKey } from '../lib/grid'
import { AgendaView } from './AgendaView'

const MEMBERS = new Map<string, CalendarMember>([
  ['p1', { name: 'Zoe' }],
  ['p2', { name: 'Teddy' }],
])
const NOW = new Date(2026, 5, 22, 8, 0) // Mon Jun 22, 8am

function mk(
  p: Partial<CalendarEvent> & { id: string; title: string; startsAt: string }
): CalendarEvent {
  return {
    seriesId: p.id,
    occurrenceDate: null,
    isOccurrence: false,
    description: null,
    attendeeIds: [],
    ownerId: null,
    createdBy: 'p1',
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

const DOCTOR = mk({
  id: 'doctor',
  title: 'Doctor',
  attendeeIds: ['p1'],
  startsAt: new Date(2026, 5, 22, 11, 0).toISOString(),
  endsAt: new Date(2026, 5, 22, 12, 0).toISOString(),
  location: 'Pediatrics',
})
const GROCERY = mk({
  id: 'grocery',
  title: 'Grocery run',
  startsAt: new Date(2026, 5, 22, 13, 0).toISOString(),
})
const KARATE = mk({
  id: 'karate',
  title: 'Karate',
  attendeeIds: ['p1'],
  startsAt: new Date(2026, 5, 24, 16, 30).toISOString(),
})

describe('AgendaView', () => {
  it('leads with the next-up hero and groups the rest by day', () => {
    render(<AgendaView events={[DOCTOR, GROCERY, KARATE]} membersById={MEMBERS} now={NOW} />)

    // Hero: the soonest still-current event.
    expect(screen.getByText('Up next')).toBeInTheDocument()
    expect(screen.getByText('Doctor')).toBeInTheDocument()

    // The hero event is not duplicated as a row; the other events appear grouped.
    expect(screen.getByText('Later today')).toBeInTheDocument()
    expect(screen.getByText('Grocery run')).toBeInTheDocument()
    expect(screen.getByText('Wednesday')).toBeInTheDocument()
    expect(screen.getByText('Karate')).toBeInTheDocument()
  })

  it('renders an empty state with an Add CTA when nothing is upcoming', () => {
    const onAdd = vi.fn()
    render(<AgendaView events={[]} membersById={MEMBERS} now={NOW} onAdd={onAdd} />)

    expect(screen.getByText('Nothing scheduled')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Add event/i }))
    expect(onAdd).toHaveBeenCalledTimes(1)
  })

  it('makes the hero and rows tap-to-edit when onEditEvent is provided', () => {
    const onEditEvent = vi.fn()
    render(
      <AgendaView
        events={[DOCTOR, GROCERY]}
        membersById={MEMBERS}
        now={NOW}
        onEditEvent={onEditEvent}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Edit Doctor' }))
    expect(onEditEvent).toHaveBeenCalledWith(DOCTOR)

    fireEvent.click(screen.getByRole('button', { name: 'Edit Grocery run' }))
    expect(onEditEvent).toHaveBeenCalledWith(GROCERY)
  })

  it('leaves rows read-only (no edit button) without onEditEvent', () => {
    render(<AgendaView events={[DOCTOR, GROCERY]} membersById={MEMBERS} now={NOW} />)
    expect(screen.queryByRole('button', { name: /^Edit / })).not.toBeInTheDocument()
  })

  it('tags a Family (no-attendee) event in the hero', () => {
    // GROCERY (no attendees) is the only event → it's the hero, with no rows, so
    // the Family label appears once.
    render(<AgendaView events={[GROCERY]} membersById={MEMBERS} now={NOW} />)
    expect(screen.getByText('Up next')).toBeInTheDocument()
    expect(screen.getByText('Family')).toBeInTheDocument()
  })

  describe('day marks (ADR 050)', () => {
    it('renders the label with the owner disc, on a day that has no events (AC4)', () => {
      // Wednesday (KARATE's day) also carries a dinner mark.
      const wed = localDateKey(new Date(2026, 5, 24))
      const marksByDate = new Map<string, DayMark[]>([
        [wed, [{ date: wed, ownerId: 'p1', glyph: 'utensils', label: "Zoe's got dinner" }]],
      ])
      render(
        <AgendaView events={[KARATE]} membersById={MEMBERS} now={NOW} marksByDate={marksByDate} />
      )
      expect(screen.getByText("Zoe's got dinner")).toBeInTheDocument()
    })

    it('gives a day its own header for a mark alone, with no events', () => {
      // Thursday: no events at all, only a mark.
      const thu = localDateKey(new Date(2026, 5, 25))
      const marksByDate = new Map<string, DayMark[]>([
        [thu, [{ date: thu, ownerId: 'p2', glyph: 'utensils', label: "Teddy's got dinner" }]],
      ])
      render(<AgendaView events={[]} membersById={MEMBERS} now={NOW} marksByDate={marksByDate} />)
      expect(screen.getByText("Teddy's got dinner")).toBeInTheDocument()
    })

    it('renders no mark row when the day carries none', () => {
      render(<AgendaView events={[KARATE]} membersById={MEMBERS} now={NOW} />)
      expect(screen.queryByText(/got dinner/)).not.toBeInTheDocument()
    })
  })
})
