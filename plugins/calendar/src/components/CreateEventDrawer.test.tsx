import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import type { Profile } from '@family-os/platform/types'
import type { CalendarEvent } from '../types'
import { CreateEventDrawer, type CreateEventInput } from './CreateEventDrawer'

const members = [
  { id: 'p1', name: 'Zoe', tier: 2 },
  { id: 'p2', name: 'Teddy', tier: 2 },
] as Profile[]

// June 23 2026 is a Tuesday — drives the "(Every Tuesday)" recurrence label.
const PREFILL = new Date(2026, 5, 23)

function evt(
  o: Partial<CalendarEvent> & { id: string; title: string; startsAt: string }
): CalendarEvent {
  return {
    seriesId: o.id,
    occurrenceDate: null,
    isOccurrence: false,
    description: null,
    attendeeIds: [],
    ownerId: null,
    createdBy: 'p1',
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
    ...o,
  }
}

function renderDrawer(props: Partial<React.ComponentProps<typeof CreateEventDrawer>> = {}) {
  const onSubmit = vi.fn<(i: CreateEventInput) => void>()
  const onClose = vi.fn()
  render(
    <CreateEventDrawer
      open
      onClose={onClose}
      members={members}
      prefillDate={PREFILL}
      onSubmit={onSubmit}
      {...props}
    />
  )
  return { onSubmit, onClose }
}

const lastInput = (onSubmit: ReturnType<typeof vi.fn>) =>
  onSubmit.mock.calls.at(-1)![0] as CreateEventInput

describe('CreateEventDrawer — create', () => {
  it('requires an owner before it can submit, then creates a timed solo event', async () => {
    const { onSubmit } = renderDrawer()
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Soccer' } })

    // No owner picked yet → CTA disabled.
    expect(screen.getByRole('button', { name: 'Add event' })).toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: 'Zoe' }))
    fireEvent.click(screen.getByRole('button', { name: 'Add event' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    const input = lastInput(onSubmit)
    expect(input.title).toBe('Soccer')
    expect(input.attendeeIds).toEqual(['p1'])
    expect(input.allDay).toBe(false)
    expect(input.recurrence).toBeNull()
    // Defaults: timed 9–10 with a 30-minute reminder.
    expect(input.reminderMinutes).toBe(30)
    expect(input.endsAt).not.toBeNull()
  })

  it('treats Family as mutually exclusive with members (attendeeIds empty)', async () => {
    const { onSubmit } = renderDrawer()
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'BBQ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Zoe' }))
    fireEvent.click(screen.getByRole('button', { name: 'Family' }))
    fireEvent.click(screen.getByRole('button', { name: 'Add event' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    expect(lastInput(onSubmit).attendeeIds).toEqual([])
  })

  it('all-day hides the time fields and submits allDay with no end / reminder', async () => {
    const { onSubmit } = renderDrawer()
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Holiday' } })
    fireEvent.click(screen.getByRole('button', { name: 'Family' }))
    fireEvent.click(screen.getByRole('switch', { name: 'All day' }))

    expect(screen.queryByLabelText('Start time')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Add event' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    const input = lastInput(onSubmit)
    expect(input.allDay).toBe(true)
    expect(input.endsAt).toBeNull()
    expect(input.reminderMinutes).toBeNull()
  })

  it('repeat-weekly shows the weekday label and submits a weekly recurrence', async () => {
    const { onSubmit } = renderDrawer()
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Piano' } })
    fireEvent.click(screen.getByRole('button', { name: 'Zoe' }))
    fireEvent.click(screen.getByRole('switch', { name: 'Repeat weekly' }))

    expect(screen.getByText(/Every Tuesday/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Add event' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    expect(lastInput(onSubmit).recurrence).toBe('weekly')
  })

  it('end time auto-follows the start by +60m until overridden', () => {
    renderDrawer()
    const end = screen.getByLabelText('End time') as HTMLInputElement
    fireEvent.change(screen.getByLabelText('Start time'), { target: { value: '14:00' } })
    expect(end.value).toBe('15:00')
  })
})

describe('CreateEventDrawer — edit', () => {
  const editing = evt({
    id: 'e1',
    title: 'Dentist',
    attendeeIds: ['p1'],
    startsAt: new Date(2026, 5, 23, 10, 0).toISOString(),
    endsAt: new Date(2026, 5, 23, 11, 0).toISOString(),
    location: 'Dr. Lee',
  })

  it('prefills the form and swaps header + CTA copy', () => {
    renderDrawer({ editingEvent: editing, prefillDate: null })
    expect(screen.getByText('Edit event')).toBeInTheDocument()
    expect((screen.getByLabelText('Title') as HTMLInputElement).value).toBe('Dentist')
    expect((screen.getByLabelText(/Location/) as HTMLInputElement).value).toBe('Dr. Lee')
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeInTheDocument()
  })

  it('preserves an all-day multi-day span (exclusive end bound)', async () => {
    const span = evt({
      id: 'e2',
      title: 'Camp',
      attendeeIds: ['p1', 'p2'],
      startsAt: new Date(2026, 5, 22).toISOString(),
      endsAt: new Date(2026, 5, 27).toISOString(), // exclusive → covers 22–26
      allDay: true,
    })
    const { onSubmit } = renderDrawer({ editingEvent: span, prefillDate: null })
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }))
    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    const input = lastInput(onSubmit)
    expect(input.allDay).toBe(true)
    expect(input.recurrence).toBeNull()
    expect(input.endsAt).not.toBeNull()
  })

  it('exposes Remove in edit mode and delegates to the parent confirm', () => {
    const onRemove = vi.fn()
    renderDrawer({ editingEvent: editing, prefillDate: null, onRemove })
    fireEvent.click(screen.getByRole('button', { name: /Remove event/ }))
    expect(onRemove).toHaveBeenCalledTimes(1)
  })

  it('hides Remove in create mode', () => {
    renderDrawer()
    expect(screen.queryByRole('button', { name: /Remove event/ })).not.toBeInTheDocument()
  })
})
