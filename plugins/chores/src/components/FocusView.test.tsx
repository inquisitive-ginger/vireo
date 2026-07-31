import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FocusView } from './FocusView'
import type { ChoreTask } from '../types'

function task(over: Partial<ChoreTask> & Pick<ChoreTask, 'id' | 'title'>): ChoreTask {
  return {
    description: null,
    routineId: null,
    routine: null,
    assigneeId: 'm-zoe',
    assigneeName: 'Zoë',
    assigneeAvatarUrl: null,
    assigneeHue: 'moss',
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

// Focus-mode gate (recurring-chores session): the hero and the meter speak about
// YOUR work only; up-for-grabs waits in its own collapsed section, where claiming
// is the row's action — never the hero's big green button.
describe('FocusView — up for grabs', () => {
  it('keeps grabs out of the hero and the meter, claimable from its section', () => {
    const claims: string[] = []
    render(
      <FocusView
        tasks={[
          task({ id: 't1', title: 'Make your bed' }),
          task({ id: 'g1', title: 'Water the plants', assigneeId: null, assigneeName: null }),
        ]}
        onClaimTask={(id) => {
          claims.push(id)
          return Promise.resolve()
        }}
      />
    )

    // Hero is the kid's own task; the meter counts one, not two.
    expect(screen.getByRole('heading', { name: 'Make your bed' })).toBeInTheDocument()
    expect(screen.getByText('1 left · 0 of 1 done')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /^Up for grabs/ }))
    expect(screen.getByText('Water the plants')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'I’ll do it' }))
    expect(claims).toEqual(['g1'])
  })

  it('renders no grabs section when there is nothing unowned', () => {
    render(<FocusView tasks={[task({ id: 't1', title: 'Make your bed' })]} />)
    expect(screen.queryByRole('button', { name: /^Up for grabs/ })).not.toBeInTheDocument()
  })
})
