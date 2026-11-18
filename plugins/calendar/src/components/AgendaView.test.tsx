import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { MemoryRouter } from 'react-router-dom'
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
    recurrenceInterval: 1,
    recurrenceWeekdays: [],
    recurrenceMonthWeek: null,
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

describe('repeat glyph (D-082)', () => {
  it('D-082 a monthly row wears the repeat glyph and says its rule [F-021] #152', () => {
    const pta = mk({
      id: 'pta:2026-06-23',
      seriesId: 'pta',
      title: 'PTA',
      startsAt: new Date(2026, 5, 23, 19).toISOString(),
      seriesStartsAt: new Date(2026, 4, 19, 19).toISOString(),
      recurrence: 'monthly',
      recurrenceInterval: 1,
      recurrenceWeekdays: [],
      recurrenceMonthWeek: 3,
    })
    render(<AgendaView events={[DOCTOR, pta]} membersById={MEMBERS} now={NOW} />)
    expect(
      screen.getByRole('img', { name: 'Repeats every month on the 3rd Tuesday' })
    ).toBeInTheDocument()
  })
})

describe('D-083 the Ongoing panel, rendered', () => {
  it('D-083 a span on its last day leaves Ongoing and reads "Last day" in today’s section [F-023] #153', () => {
    const camp = mk({
      id: 'camp',
      title: 'Swim camp',
      allDay: true,
      startsAt: new Date(2026, 5, 18).toISOString(),
      endsAt: new Date(2026, 5, 23).toISOString(),
    })
    render(<AgendaView events={[DOCTOR, camp]} membersById={MEMBERS} now={NOW} />)
    expect(screen.queryByText('Ongoing')).not.toBeInTheDocument()
    expect(screen.getByText('Last day')).toBeInTheDocument()
    expect(screen.getByText('Swim camp')).toBeInTheDocument()
  })
})

describe('the rides mark (D-087, D-091, D-098, D-099)', () => {
  const today = localDateKey(NOW)
  const RIDES: DayMark = {
    date: today,
    glyph: 'car',
    label: '3 school runs',
    lines: [
      { id: 'td', minutes: 495, text: 'Hallie drops off Teddy', ownerId: 'p1', cleared: false },
      { id: 'tp', minutes: 990, text: 'Hallie picks up Teddy', ownerId: 'p1', cleared: false },
      {
        id: 'zp',
        minutes: 1050,
        text: 'Zach picks up Zoë at yarn club',
        ownerId: 'p2',
        cleared: false,
      },
    ],
    act: {
      endpoint: `/api/rides/days/${today}`,
      owners: ['p1', 'p2'],
      manage: { href: `/rides/week?on=${today}`, label: 'Set the week' },
    },
  }
  const withRides = (mark: DayMark = RIDES) => new Map<string, DayMark[]>([[mark.date, [mark]]])
  const view = (props: Partial<ComponentProps<typeof AgendaView>> = {}) =>
    render(
      <MemoryRouter>
        <AgendaView
          events={[]}
          membersById={MEMBERS}
          now={NOW}
          marksByDate={withRides()}
          {...props}
        />
      </MemoryRouter>
    )

  it('D-087 names the next run in words [F-042]', () => {
    view({ now: new Date(2026, 5, 22, 16, 0) })
    expect(
      screen.getByRole('button', { name: /Next: 4:30 PM, Hallie picks up Teddy/ })
    ).toHaveTextContent('4:30 PM · Hallie picks up Teddy')
  })

  it('D-087 a later day names its first run [F-042]', () => {
    const tomorrow = localDateKey(new Date(2026, 5, 23))
    view({ marksByDate: withRides({ ...RIDES, date: tomorrow }) })
    expect(
      screen.getByRole('button', { name: /Next: 8:15 AM, Hallie drops off Teddy/ })
    ).toBeInTheDocument()
  })

  it('D-091 tapping the mark unfolds the day’s runs under the heading, and again folds them [F-042]', () => {
    view()
    const mark = screen.getByRole('button', { name: /Show the day's list/ })
    expect(mark).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(mark)
    expect(mark).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    fireEvent.click(mark)
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('D-098 every run offers Swap and never Claim; Swap and "Not needed today" report the line [F-042]', () => {
    const onMarkAction = vi.fn()
    view({ onMarkAction })
    fireEvent.click(screen.getByRole('button', { name: /Show the day's list/ }))
    expect(screen.queryByRole('button', { name: /^Claim/ })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Swap: Hallie picks up Teddy' }))
    fireEvent.click(
      screen.getByRole('button', { name: 'Not needed today: Hallie drops off Teddy' })
    )
    expect(onMarkAction.mock.calls.map(([, line, action]) => [line.id, action])).toEqual([
      ['tp', 'swap'],
      ['td', 'clear'],
    ])
  })

  it('D-098 with one parent there is no one to swap to, so Swap is hidden [F-042]', () => {
    view({
      marksByDate: withRides({ ...RIDES, act: { ...RIDES.act!, owners: ['p1'] } }),
      onMarkAction: vi.fn(),
    })
    fireEvent.click(screen.getByRole('button', { name: /Show the day's list/ }))
    expect(screen.queryByRole('button', { name: /^Swap/ })).toBeNull()
    expect(screen.getAllByRole('button', { name: /^Not needed today/ })).toHaveLength(3)
  })

  it('D-099 a run not needed today reads struck through and offers Restore [F-042]', () => {
    const cleared = {
      ...RIDES,
      lines: RIDES.lines!.map((l) => (l.id === 'zp' ? { ...l, cleared: true } : l)),
    }
    view({ marksByDate: withRides(cleared), onMarkAction: vi.fn() })
    fireEvent.click(screen.getByRole('button', { name: /Show the day's list/ }))
    expect(
      screen.getByRole('button', { name: 'Restore: Zach picks up Zoë at yarn club' })
    ).toBeInTheDocument()
  })

  it('D-097 the unfolded runs link to the week editor [F-041]', () => {
    view({ onMarkAction: vi.fn() })
    fireEvent.click(screen.getByRole('button', { name: /Show the day's list/ }))
    expect(screen.getByRole('link', { name: 'Set the week' })).toHaveAttribute(
      'href',
      `/rides/week?on=${today}`
    )
  })

  it('D-097 before any run exists, a parent’s day header links to setting the week up [F-041]', () => {
    const setup: DayMark = {
      date: today,
      glyph: 'car',
      label: 'Set up school runs',
      lines: [],
      act: {
        ...RIDES.act!,
        manage: { href: `/rides/week?on=${today}`, label: 'Set up school runs' },
      },
    }
    view({ marksByDate: withRides(setup) })
    expect(screen.getByRole('link', { name: 'Set up school runs' })).toHaveAttribute(
      'href',
      `/rides/week?on=${today}`
    )
  })

  it('D-086 without act the runs are read-only [F-042]', () => {
    const { act: _act, ...readOnly } = RIDES
    view({ marksByDate: withRides(readOnly), onMarkAction: vi.fn() })
    fireEvent.click(screen.getByRole('button', { name: /Show the day's list/ }))
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    expect(screen.queryByRole('button', { name: /^(Swap|Not needed)/ })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Set the week' })).toBeNull()
  })
})
