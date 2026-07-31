import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChoresPageView } from './ChoresPageView'
import type { ChoreTask } from '../types'

function task(over: Partial<ChoreTask> & Pick<ChoreTask, 'id' | 'title'>): ChoreTask {
  return {
    description: null,
    routineId: null,
    routine: null,
    assigneeId: 'm-maya',
    assigneeName: 'Maya',
    assigneeAvatarUrl: null,
    assigneeHue: 'sage',
    status: 'pending',
    dueDate: null,
    xpReward: 10,
    coinReward: 0,
    requiresApproval: false,
    xpAwarded: false,
    createdBy: 'm-parent',
    createdAt: new Date().toISOString(),
    completedAt: null,
    ...over,
  }
}

const PENDING = task({ id: 't1', title: 'Feed the dog' })
const DONE = task({ id: 't2', title: 'Tidy the playroom', status: 'completed' })

function board(props: Partial<React.ComponentProps<typeof ChoresPageView>> = {}) {
  return (
    <ChoresPageView
      tasks={[PENDING, DONE]}
      tier={4}
      seesAllTasks
      canManage
      profileId="m-parent"
      {...props}
    />
  )
}

const toggle = () => screen.getByRole('switch', { name: /hide completed/i })

beforeEach(() => localStorage.clear())

describe('ChoresPageView — hide completed persistence', () => {
  it('remembers the toggle across remounts, scoped to the profile', () => {
    const first = render(board())
    fireEvent.click(toggle())
    expect(toggle()).toBeChecked()
    first.unmount()

    render(board())
    expect(toggle()).toBeChecked()
    expect(screen.queryByText('Tidy the playroom')).not.toBeInTheDocument()
  })

  it('does not leak one profile’s choice to another on a shared device', () => {
    const first = render(board())
    fireEvent.click(toggle())
    first.unmount()

    render(board({ profileId: 'm-other' }))
    expect(toggle()).not.toBeChecked()
  })

  it('re-reads on a profile switch without a remount', () => {
    localStorage.setItem('chores.hide-completed:m-other', 'true')
    const { rerender } = render(board())
    expect(toggle()).not.toBeChecked()

    rerender(board({ profileId: 'm-other' }))
    expect(toggle()).toBeChecked()
  })
})

describe('ChoresPageView — everything hidden', () => {
  it('shows an all-caught-up state rather than a blank board', () => {
    render(board({ tasks: [DONE] }))
    fireEvent.click(toggle())

    expect(screen.getByText('All caught up')).toBeInTheDocument()
    expect(screen.getByText(/switch off hide completed/i)).toBeInTheDocument()
    // The way back out has to stay on screen.
    expect(toggle()).toBeInTheDocument()
  })

  it('leaves the board alone while anything is still pending', () => {
    render(board())
    fireEvent.click(toggle())

    expect(screen.queryByText('All caught up')).not.toBeInTheDocument()
    expect(screen.getByText('Feed the dog')).toBeInTheDocument()
  })
})
