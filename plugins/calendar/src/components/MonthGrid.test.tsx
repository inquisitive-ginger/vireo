import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import type { DayMark } from '@family-os/platform/types'
import type { CalendarEvent } from '../types'
import { layoutMonth, localDateKey } from '../lib/grid'
import { MonthGrid } from './MonthGrid'

const members = new Map([
  ['p1', { name: 'Zoe' }],
  ['p2', { name: 'Teddy' }],
])

function evt(o: {
  id: string
  title: string
  start: Date
  end?: Date
  attendeeIds?: string[]
}): CalendarEvent {
  return {
    id: o.id,
    seriesId: o.id,
    occurrenceDate: null,
    isOccurrence: false,
    title: o.title,
    description: null,
    attendeeIds: o.attendeeIds ?? [],
    ownerId: null,
    createdBy: 'x',
    startsAt: o.start.toISOString(),
    seriesStartsAt: o.start.toISOString(),
    endsAt: o.end ? o.end.toISOString() : null,
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
  }
}

function renderGrid(events: CalendarEvent[], onDrillDay = vi.fn()) {
  const weeks = layoutMonth(events, 2026, 5) // June 2026
  render(
    <MonthGrid
      weeks={weeks}
      membersById={members}
      today={new Date(2026, 5, 22)}
      onDrillDay={onDrillDay}
    />
  )
  return onDrillDay
}

describe('MonthGrid', () => {
  it('renders single-day event chips and a Family event with its Users glyph', () => {
    const { container } = render(
      <MonthGrid
        weeks={layoutMonth(
          [
            evt({
              id: 'a',
              title: 'Gymnastics',
              start: new Date(2026, 5, 9, 16),
              attendeeIds: ['p1'],
            }),
            evt({
              id: 'f',
              title: 'Parent night',
              start: new Date(2026, 5, 11, 17),
              attendeeIds: [],
            }),
          ],
          2026,
          5
        )}
        membersById={members}
        today={new Date(2026, 5, 22)}
        onDrillDay={vi.fn()}
      />
    )
    expect(screen.getByText(/Gymnastics/)).toBeInTheDocument()
    expect(screen.getByText(/Parent night/)).toBeInTheDocument()
    // Family event carries the Users glyph; the owned one does not.
    expect(container.querySelector('.lucide-users')).toBeInTheDocument()
  })

  it('quick-adds on a cell without drilling in (tier-4 hover "+")', () => {
    const onDrill = vi.fn()
    const onQuickAdd = vi.fn()
    render(
      <MonthGrid
        weeks={layoutMonth([], 2026, 5)}
        membersById={members}
        today={new Date(2026, 5, 22)}
        onDrillDay={onDrill}
        onQuickAdd={onQuickAdd}
      />
    )
    const label = `Add event on ${new Date(2026, 5, 9).toDateString()}`
    fireEvent.click(screen.getByRole('button', { name: label }))
    expect(onQuickAdd).toHaveBeenCalledTimes(1)
    expect(onQuickAdd.mock.calls[0][0].getDate()).toBe(9)
    // The "+" stops propagation — it must not also drill into the day.
    expect(onDrill).not.toHaveBeenCalled()
  })

  it('omits the quick-add "+" when onQuickAdd is absent (tiers < 4)', () => {
    renderGrid([])
    expect(screen.queryByRole('button', { name: /Add event on/ })).not.toBeInTheDocument()
  })

  it('renders a multi-day event as a single span bar (not one chip per day)', () => {
    renderGrid([
      evt({
        id: 'camp',
        title: 'FISW Camp',
        start: new Date(2026, 5, 22),
        end: new Date(2026, 5, 26),
        attendeeIds: ['p1', 'p2'],
      }),
    ])
    // One bar, one label — not five chips.
    expect(screen.getAllByText('FISW Camp')).toHaveLength(1)
  })

  it('truncates a crowded day to 3 chips + "+N more" and drills in on click', () => {
    const onDrill = renderGrid([
      evt({ id: '1', title: 'One', start: new Date(2026, 5, 9, 8) }),
      evt({ id: '2', title: 'Two', start: new Date(2026, 5, 9, 9) }),
      evt({ id: '3', title: 'Three', start: new Date(2026, 5, 9, 10) }),
      evt({ id: '4', title: 'Four', start: new Date(2026, 5, 9, 11) }),
      evt({ id: '5', title: 'Five', start: new Date(2026, 5, 9, 12) }),
    ])
    expect(screen.getByText(/One/)).toBeInTheDocument()
    expect(screen.getByText(/Three/)).toBeInTheDocument()
    expect(screen.queryByText(/Four/)).not.toBeInTheDocument() // truncated
    const more = screen.getByText('+2 more')
    fireEvent.click(more)
    expect(onDrill).toHaveBeenCalledTimes(1)
  })

  it('drills into the day when a cell is clicked', () => {
    const onDrill = renderGrid([])
    fireEvent.click(screen.getByLabelText(/Mon Jun 22 2026/))
    expect(onDrill).toHaveBeenCalledTimes(1)
  })

  describe('day marks (ADR 050)', () => {
    const dayKey = localDateKey(new Date(2026, 5, 9))
    const mark: DayMark = {
      date: dayKey,
      ownerId: 'p1',
      glyph: 'utensils',
      label: "Zoe's got dinner",
    }

    it("renders the owner disc + glyph, and carries the name in the cell's own accessible name", () => {
      const { container } = render(
        <MonthGrid
          weeks={layoutMonth([], 2026, 5)}
          membersById={members}
          today={new Date(2026, 5, 22)}
          onDrillDay={vi.fn()}
          marksByDate={new Map([[dayKey, [mark]]])}
        />
      )
      // The disc carries the initial, aria-hidden. `role="button"` is
      // children-presentational and an author `aria-label` wins the accessible-name
      // computation over descendant text, so the name has to live ON the cell's own
      // aria-label — a buried sr-only span would never reach assistive tech.
      expect(screen.getByText('Z', { selector: 'span[aria-hidden]' })).toBeInTheDocument()
      expect(container.querySelector('.lucide-utensils')).toBeInTheDocument()
      expect(screen.getByLabelText(/Zoe's got dinner/)).toBeInTheDocument()
    })

    it('renders no mark on an unmarked day', () => {
      render(
        <MonthGrid
          weeks={layoutMonth([], 2026, 5)}
          membersById={members}
          today={new Date(2026, 5, 22)}
          onDrillDay={vi.fn()}
        />
      )
      expect(document.querySelector('.lucide-utensils')).not.toBeInTheDocument()
    })

    it('renders at most two marks — the caller trusts the server cap, but still only shows what it gets', () => {
      const twoMarks: DayMark[] = [
        mark,
        { date: dayKey, ownerId: 'p2', glyph: 'utensils', label: "Teddy's got dinner" },
      ]
      render(
        <MonthGrid
          weeks={layoutMonth([], 2026, 5)}
          membersById={members}
          today={new Date(2026, 5, 22)}
          onDrillDay={vi.fn()}
          marksByDate={new Map([[dayKey, twoMarks]])}
        />
      )
      const cell = screen.getByLabelText(/Zoe's got dinner/)
      expect(cell.getAttribute('aria-label')).toContain("Teddy's got dinner")
    })
  })
})
