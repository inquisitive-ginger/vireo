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
    seriesStartsAt: o.startsAt,
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

  it('activity framing seeds repeat-weekly + a preselected owner and swaps the copy', async () => {
    const { onSubmit } = renderDrawer({ activityContext: true, prefillOwnerId: 'p2' })
    // Copy swaps event → activity, and repeat-weekly is implied.
    expect(screen.getByRole('heading', { name: 'Add activity' })).toBeInTheDocument()
    expect(screen.getByRole('switch', { name: 'Repeat weekly' })).toBeChecked()

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'T&T' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add activity' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    const input = lastInput(onSubmit)
    expect(input.attendeeIds).toEqual(['p2']) // the per-person "+ Add" owner
    expect(input.recurrence).toBe('weekly')
  })

  it('end time auto-follows the start by +60m until overridden', () => {
    renderDrawer()
    const end = screen.getByLabelText('End time') as HTMLInputElement
    fireEvent.change(screen.getByLabelText('Start time'), { target: { value: '14:00' } })
    expect(end.value).toBe('15:00')
  })

  it('warns and blocks submit when the end time is before the start', () => {
    renderDrawer()
    fireEvent.click(screen.getByRole('button', { name: 'Zoe' }))
    // Override the end first (marks it touched), then push the start past it.
    fireEvent.change(screen.getByLabelText('End time'), { target: { value: '08:00' } })
    fireEvent.change(screen.getByLabelText('Start time'), { target: { value: '14:00' } })
    expect(screen.getByText(/End time must be after the start/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add event' })).toBeDisabled()
  })
})

describe('CreateEventDrawer — daily time window (ADR 057)', () => {
  it('multi-day keeps the Time field: All day defaults on, off reveals the day chips', () => {
    renderDrawer()
    fireEvent.click(screen.getByRole('switch', { name: 'Multiple days' }))

    // The span default: All day on, no time inputs, no day chips.
    expect(screen.getByRole('switch', { name: 'All day' })).toBeChecked()
    expect(screen.queryByLabelText('Start time')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Monday' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('switch', { name: 'All day' }))
    expect(screen.getByLabelText('Start time')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Monday' })).toBeInTheDocument()
    // All seven days start selected; Reminder appears for a timed window.
    expect(screen.getByRole('button', { name: 'Sunday' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: '30 min' })).toBeInTheDocument()
  })

  it('blocks submit when every day is deselected', () => {
    renderDrawer()
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Camp' } })
    fireEvent.click(screen.getByRole('button', { name: 'Zoe' }))
    fireEvent.click(screen.getByRole('switch', { name: 'Multiple days' }))
    fireEvent.click(screen.getByRole('switch', { name: 'All day' }))
    for (const day of DAY_NAMES_TEST) fireEvent.click(screen.getByRole('button', { name: day }))
    expect(screen.getByText('Pick at least one day.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add event' })).toBeDisabled()
  })

  // A server-shaped occurrence of a M–F 9:30–15:30 series: the drawer was opened
  // from WEDNESDAY's bar, but must edit the whole series off its Monday anchor.
  const dailyOccurrence = evt({
    id: 'd1:2026-06-24',
    seriesId: 'd1',
    occurrenceDate: '2026-06-24',
    isOccurrence: true,
    title: 'Girls Rock Math',
    attendeeIds: ['p1'],
    startsAt: new Date(2026, 5, 24, 9, 30).toISOString(), // the Wednesday occurrence
    endsAt: new Date(2026, 5, 24, 15, 30).toISOString(),
    seriesStartsAt: new Date(2026, 5, 22, 9, 30).toISOString(), // Mon Jun 22
    recurrence: 'daily',
    recurrenceDayOffsets: [0, 1, 2, 3, 4], // Monday anchor → Mon–Fri
    recurrenceUntil: '2026-07-03',
  })

  it('edit prefills the window off the SERIES anchor and round-trips the wire body', async () => {
    const { onSubmit } = renderDrawer({ editingEvent: dailyOccurrence, prefillDate: null })

    expect(screen.getByRole('switch', { name: 'Multiple days' })).toBeChecked()
    expect(screen.getByRole('switch', { name: 'All day' })).not.toBeChecked()
    expect((screen.getByLabelText('Start time') as HTMLInputElement).value).toBe('09:30')
    expect((screen.getByLabelText('End time') as HTMLInputElement).value).toBe('15:30')
    // Mon–Fri selected, the weekend not; the summary states the semantics.
    expect(screen.getByRole('button', { name: 'Friday' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Sunday' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByText('Weekdays · Jun 22 – Jul 3 · 10 days')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }))
    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    const input = lastInput(onSubmit)
    expect(input.recurrence).toBe('daily')
    // Anchored on the series' Monday, NOT the tapped Wednesday — editing week two
    // must not rebase the range and delete week one.
    expect(input.startsAt).toBe(new Date(2026, 5, 22, 9, 30).toISOString())
    expect(input.endsAt).toBe(new Date(2026, 5, 22, 15, 30).toISOString())
    expect(input.recurrenceDayOffsets).toEqual([0, 1, 2, 3, 4])
    expect(input.recurrenceUntil).toBe('2026-07-03')
    expect(input.allDay).toBe(false)
  })

  it('a day-set edit lands in the offsets', async () => {
    const { onSubmit } = renderDrawer({ editingEvent: dailyOccurrence, prefillDate: null })
    fireEvent.click(screen.getByRole('button', { name: 'Saturday' }))
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }))
    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    expect(lastInput(onSubmit).recurrenceDayOffsets).toEqual([0, 1, 2, 3, 4, 5])
  })
})

const DAY_NAMES_TEST = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

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
