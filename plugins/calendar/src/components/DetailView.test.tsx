import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import type { DayMark } from '@family-os/platform/types'
import type { CalendarMember } from '../types'
import { localDateKey } from '../lib/grid'
import { MemoryRouter } from 'react-router-dom'
import { DetailView } from './DetailView'

const MEMBERS = new Map<string, CalendarMember>([['h', { name: 'Hallie' }]])
const NOW = new Date(2026, 10, 17, 16, 0) // Tue Nov 17, 4pm

const rides = (date: Date): DayMark => ({
  date: localDateKey(date),
  glyph: 'car',
  label: '2 school runs',
  lines: [
    { id: 'tp', minutes: 990, text: 'Hallie picks up Teddy', ownerId: 'h', cleared: false },
    {
      id: 'zp',
      minutes: 1050,
      text: 'Hallie picks up Zoë at yarn club',
      ownerId: 'h',
      cleared: false,
    },
  ],
  act: { endpoint: '/api/rides/days/x', owners: ['h', 'z'] },
})
const dinner = (date: Date): DayMark => ({
  date: localDateKey(date),
  ownerId: 'h',
  glyph: 'utensils',
  label: "Hallie's got dinner",
})

describe('marks in the day and week drill-in (D-087, D-091)', () => {
  it('D-091 the day view, even with nothing scheduled, carries the rides mark and unfolds its runs [F-042]', () => {
    const onMarkAction = vi.fn()
    render(
      <MemoryRouter>
        <DetailView
          view="day"
          cursor={NOW}
          events={[]}
          membersById={MEMBERS}
          today={NOW}
          marksByDate={new Map([[localDateKey(NOW), [dinner(NOW), rides(NOW)]]])}
          onMarkAction={onMarkAction}
        />
      </MemoryRouter>
    )
    expect(screen.getByText("Hallie's got dinner")).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Next: 4:30 PM, Hallie picks up Teddy/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Swap: Hallie picks up Zoë at yarn club' }))
    expect(onMarkAction.mock.calls[0][2]).toBe('swap')
  })

  it('D-087 the week view gives each day its own mark [F-042]', () => {
    const wed = new Date(2026, 10, 18)
    render(
      <MemoryRouter>
        <DetailView
          view="week"
          cursor={NOW}
          events={[]}
          membersById={MEMBERS}
          today={NOW}
          marksByDate={
            new Map([
              [localDateKey(NOW), [rides(NOW)]],
              [localDateKey(wed), [rides(wed)]],
            ])
          }
        />
      </MemoryRouter>
    )
    expect(screen.getAllByRole('button', { name: /Show the day's list/ })).toHaveLength(2)
  })
})
