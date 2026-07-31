import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CreateTaskDrawer } from './CreateTaskDrawer'
import type { Profile } from '@family-os/platform/types'

const MEMBERS = [
  { id: 'm-maya', name: 'Maya', identityHue: 'sage' },
  { id: 'm-luca', name: 'Luca', identityHue: 'plum' },
] as Profile[]

function renderDrawer(onSubmit = vi.fn()) {
  render(<CreateTaskDrawer open onClose={vi.fn()} members={MEMBERS} onSubmit={onSubmit} />)
  return onSubmit
}

// ADR 056 — one value at assignment. The XP picker is gone; the P$ tier is the
// drawer's only reward control and the derived score is stated beside it.
describe('CreateTaskDrawer — XP derived from P-Bucks', () => {
  it('has no Score picker', () => {
    renderDrawer()
    expect(screen.queryByText('Score')).not.toBeInTheDocument()
  })

  it('states the derived score and tracks the amount', () => {
    renderDrawer()
    expect(screen.getByText('Scores 5 XP')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '2' }))
    expect(screen.getByText('Scores 25 XP')).toBeInTheDocument()

    // The input takes any amount — the ladder teaches, it doesn't cage.
    fireEvent.change(screen.getByLabelText('Pays (P$)'), { target: { value: '3' } })
    expect(screen.getByText('Scores 35 XP')).toBeInTheDocument()

    // Free is typed, not toggled: clearing the input returns to base XP.
    fireEvent.change(screen.getByLabelText('Pays (P$)'), { target: { value: '' } })
    expect(screen.getByText('Scores 5 XP')).toBeInTheDocument()
  })

  it('submits the tier and never an xpReward', async () => {
    const onSubmit = renderDrawer()
    fireEvent.change(screen.getByLabelText('Task title'), { target: { value: 'Mow the lawn' } })
    fireEvent.click(screen.getByRole('button', { name: 'Maya' }))
    fireEvent.click(screen.getByRole('button', { name: '5' }))
    fireEvent.click(screen.getByRole('button', { name: 'Assign task' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    const input = onSubmit.mock.calls[0][0]
    expect(input.coinReward).toBe(5)
    expect('xpReward' in input).toBe(false)
  })
})

// Recurring-chores session (gate D1): the three-way Repeats control. On days swaps
// the due date for the weekday chips; Ongoing drops dates entirely; the summary
// line states the rule and the weekly price.
describe('CreateTaskDrawer — Repeats', () => {
  it('On days reveals the weekday chips and hides the due date', () => {
    renderDrawer()
    expect(screen.getByLabelText('Due date (optional)')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('radio', { name: 'On days' }))
    expect(screen.queryByLabelText('Due date (optional)')).not.toBeInTheDocument()
    expect(screen.getByText('Pick the days it repeats')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Monday' }))
    fireEvent.click(screen.getByRole('button', { name: 'Thursday' }))
    expect(screen.getByText('Every Mon & Thu')).toBeInTheDocument()
  })

  it('prices the routine per week once it pays', () => {
    renderDrawer()
    fireEvent.click(screen.getByRole('radio', { name: 'On days' }))
    fireEvent.click(screen.getByRole('button', { name: 'Monday' }))
    fireEvent.click(screen.getByRole('button', { name: 'Thursday' }))
    fireEvent.click(screen.getByRole('button', { name: '2' }))
    expect(
      screen.getByText(/Every Mon & Thu · pays 2 P\$ each time ≈ 4 P\$ a week/)
    ).toBeInTheDocument()
  })

  it('submits the rule, and Anyone submits a null assignee', async () => {
    const onSubmit = renderDrawer()
    fireEvent.change(screen.getByLabelText('Task title'), { target: { value: 'Trash' } })
    fireEvent.click(screen.getByRole('button', { name: 'Anyone' }))
    fireEvent.click(screen.getByRole('radio', { name: 'On days' }))
    fireEvent.click(screen.getByRole('button', { name: 'Monday' }))
    fireEvent.click(screen.getByRole('button', { name: 'Start routine' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    const input = onSubmit.mock.calls[0][0]
    expect(input.repeats).toBe('days')
    expect(input.repeatDays).toEqual([1])
    expect(input.assigneeId).toBeNull()
    expect(input.dueDate).toBeNull()
  })

  it('Ongoing states its return and disables the day requirement', async () => {
    const onSubmit = renderDrawer()
    fireEvent.click(screen.getByRole('radio', { name: 'Ongoing' }))
    expect(screen.getByText(/Comes back after it's done/)).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Task title'), { target: { value: 'Dishwasher' } })
    fireEvent.click(screen.getByRole('button', { name: 'Maya' }))
    fireEvent.click(screen.getByRole('button', { name: 'Start routine' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    expect(onSubmit.mock.calls[0][0].repeats).toBe('ongoing')
  })
})
