import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import type { CalendarEvent } from '../types'
import { ActivitiesView } from './ActivitiesView'
import { STORY_ACTIVITIES, STORY_MEMBERS, STORY_TODAY } from './fixtures'

// STORY_ACTIVITIES owners: p3 Zoe (Gymnastics, Karate, Piano), p4 Teddy (T&T,
// Swim), p2 Hallie (Yoga). STORY_TODAY = Jun 22 2026, before the Aug-25 season end.
const NOW = STORY_TODAY

function activity(
  p: Partial<CalendarEvent> & { id: string; title: string; startsAt: string; ownerId: string }
): CalendarEvent {
  return {
    seriesId: p.id,
    occurrenceDate: null,
    isOccurrence: false,
    description: null,
    attendeeIds: [p.ownerId],
    createdBy: 'p1',
    seriesStartsAt: p.startsAt,
    endsAt: null,
    allDay: false,
    location: null,
    recurrence: 'weekly',
    recurrenceDayOffsets: [],
    recurrenceUntil: null,
    isActivity: true,
    status: 'confirmed',
    source: 'manual',
    reminderMinutes: null,
    createdAt: '',
    updatedAt: '',
    ...p,
  }
}

function renderView(props: Partial<React.ComponentProps<typeof ActivitiesView>> = {}) {
  return render(
    <ActivitiesView
      activities={STORY_ACTIVITIES}
      membersById={STORY_MEMBERS}
      now={NOW}
      canManage
      {...props}
    />
  )
}

describe('ActivitiesView', () => {
  it('groups standing activities by owner with per-owner counts', () => {
    renderView()
    // Owners with activities appear (Zach has none → absent).
    expect(screen.getByText('Zoe')).toBeInTheDocument()
    expect(screen.getByText('Teddy')).toBeInTheDocument()
    expect(screen.getByText('Hallie')).toBeInTheDocument()
    expect(screen.queryByText('Zach')).not.toBeInTheDocument()
    // Activity rows render with their weekly slot.
    expect(screen.getByText('Gymnastics')).toBeInTheDocument()
    expect(screen.getByText(/Mondays · 4:00 PM · Flips Gym/)).toBeInTheDocument()
    expect(screen.getByText('Yoga')).toBeInTheDocument()
  })

  it('drops activities whose season has already ended (measured against now)', () => {
    const ended = activity({
      id: 'ended',
      title: 'Old Soccer',
      ownerId: 'p3',
      startsAt: new Date(2026, 2, 2, 16, 0).toISOString(),
      recurrenceUntil: '2026-05-01', // before NOW (Jun 22)
    })
    renderView({ activities: [...STORY_ACTIVITIES, ended] })
    expect(screen.queryByText('Old Soccer')).not.toBeInTheDocument()
  })

  it('switches to the Seasons timeline via the sub-switch', () => {
    renderView()
    // Roster first — no timeline heading yet.
    expect(screen.queryByRole('heading', { name: 'Seasons' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('radio', { name: 'Seasons' }))
    expect(screen.getByRole('heading', { name: 'Seasons' })).toBeInTheDocument()
  })

  it('fires onEdit / onRemove / onAdd for tier 4', () => {
    const onEdit = vi.fn()
    const onRemove = vi.fn()
    const onAdd = vi.fn()
    renderView({ onEdit, onRemove, onAdd })

    fireEvent.click(screen.getAllByRole('button', { name: 'Edit “Gymnastics”' })[0])
    expect(onEdit).toHaveBeenCalledWith(expect.objectContaining({ title: 'Gymnastics' }))

    fireEvent.click(screen.getByRole('button', { name: 'Remove “Gymnastics”' }))
    expect(onRemove).toHaveBeenCalledWith(expect.objectContaining({ title: 'Gymnastics' }))

    // The first per-owner "+ Add" is Hallie's (p2) — roster order follows the map.
    fireEvent.click(screen.getAllByRole('button', { name: 'Add' })[0])
    expect(onAdd).toHaveBeenCalledWith('p2')
  })

  it('is read-only below tier 4 (no add / edit / remove controls)', () => {
    renderView({ canManage: false, onEdit: vi.fn(), onRemove: vi.fn(), onAdd: vi.fn() })
    expect(screen.queryByRole('button', { name: /^Edit / })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Remove / })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Add' })).not.toBeInTheDocument()
    // …but the roster still renders and the sub-switch is available.
    expect(screen.getByText('Gymnastics')).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Seasons' })).toBeInTheDocument()
  })

  it('shows an empty state with an Add CTA when there are no activities', () => {
    const onAdd = vi.fn()
    renderView({ activities: [], onAdd })
    expect(screen.getByText('No activities yet')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Add activity/i }))
    expect(onAdd).toHaveBeenCalledTimes(1)
  })
})
