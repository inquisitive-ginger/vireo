import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TaskeeView } from './TaskeeView'
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

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

/** A chore finished on an earlier day — the kind that piles up forever. */
function history(id: string, title: string, ago = 3): ChoreTask {
  return task({ id, title, status: 'completed', xpAwarded: true, completedAt: daysAgo(ago) })
}

const doneSection = () => screen.getByRole('button', { name: /^Done/ })

// auto-bug #82 — reported by a tier-3 profile, which resolves to this Agency
// variant. It was the one taskee framing with no completed-chore treatment at all.
describe('TaskeeView — completed chores do not pile up in the list', () => {
  it('moves chores completed on an earlier day into a collapsed Done section', () => {
    render(
      <TaskeeView
        tasks={[task({ id: 't1', title: 'Feed the dog' }), history('t2', 'Tidy the playroom')]}
      />
    )

    expect(screen.getByText('Feed the dog')).toBeInTheDocument()
    expect(screen.queryByText('Tidy the playroom')).not.toBeInTheDocument()

    fireEvent.click(doneSection())
    expect(screen.getByText('Tidy the playroom')).toBeInTheDocument()
  })

  it('states the true total on the header even while clamped, and reveals the rest', () => {
    const past = Array.from({ length: 14 }, (_, i) => history(`h${i}`, `Old chore ${i}`, i + 1))
    render(<TaskeeView tasks={[task({ id: 't1', title: 'Feed the dog' }), ...past]} />)

    expect(doneSection()).toHaveTextContent('Done · 14')

    fireEvent.click(doneSection())
    // Newest completion first, clamped to the first page.
    expect(screen.getByText('Old chore 0')).toBeInTheDocument()
    expect(screen.queryByText('Old chore 10')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Show 4 more' }))
    expect(screen.getByText('Old chore 10')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Show \d+ more/ })).not.toBeInTheDocument()
  })

  it('keeps a chore completed in this session in place, so the XP flight can land on it', () => {
    const { rerender } = render(<TaskeeView tasks={[task({ id: 't1', title: 'Feed the dog' })]} />)

    // The refetch after a completion — the row must not vanish into Done underneath
    // the card that is still morphing (design §2).
    rerender(
      <TaskeeView
        tasks={[
          task({
            id: 't1',
            title: 'Feed the dog',
            status: 'completed',
            completedAt: new Date().toISOString(),
          }),
        ]}
      />
    )

    expect(screen.getByText('Feed the dog')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Done/ })).not.toBeInTheDocument()
  })

  it('renders no Done section when nothing has been completed', () => {
    render(<TaskeeView tasks={[task({ id: 't1', title: 'Feed the dog' })]} />)
    expect(screen.queryByRole('button', { name: /^Done/ })).not.toBeInTheDocument()
  })
})

// The same root cause as auto-bug #73: a "today" that never checked `completedAt`.
describe('TaskeeView — progress counts today, not all time', () => {
  it('does not let old completions inflate the bar', () => {
    const past = Array.from({ length: 9 }, (_, i) => history(`h${i}`, `Old chore ${i}`))
    render(<TaskeeView tasks={[task({ id: 't1', title: 'Feed the dog' }), ...past]} />)

    // All-time would read "9 of 10 done"; only today's work counts.
    expect(screen.getByText('1 left · 0 of 1 done')).toBeInTheDocument()
  })

  it('counts a chore completed today', () => {
    render(
      <TaskeeView
        tasks={[
          task({ id: 't1', title: 'Feed the dog' }),
          task({
            id: 't2',
            title: 'Make the bed',
            status: 'completed',
            completedAt: new Date().toISOString(),
          }),
        ]}
      />
    )

    expect(screen.getByText('1 left · 1 of 2 done')).toBeInTheDocument()
  })

  it('celebrates when nothing is left today, even with history behind it', () => {
    render(<TaskeeView tasks={[history('h1', 'Old chore')]} />)
    expect(screen.getByText('All done today')).toBeInTheDocument()
  })
})

// A cleared list used to leave the page blank under a thin full meter, because
// completed rows had always filled it before they moved into Done.
describe('TaskeeView — nothing left to do', () => {
  it('pays the clear list off with the celebration instead of an empty page', () => {
    const past = Array.from({ length: 3 }, (_, i) => history(`h${i}`, `Old chore ${i}`))
    render(<TaskeeView tasks={past} />)

    expect(screen.getByText('All done today')).toBeInTheDocument()
    expect(screen.getByText('3 chores finished so far')).toBeInTheDocument()
    // The meter would only restate what the card already says.
    expect(screen.queryByText(/of \d+ done/)).not.toBeInTheDocument()
  })

  it('keeps the meter while there is still something to do', () => {
    render(<TaskeeView tasks={[task({ id: 't1', title: 'Feed the dog' }), history('h1', 'Old')]} />)

    expect(screen.getByText('1 left · 0 of 1 done')).toBeInTheDocument()
    expect(screen.queryByText('All done today')).not.toBeInTheDocument()
  })
})

// Recurring-chores session (gate D4): an unowned chore belongs to the household
// until claimed — the row says so, offers "I'll do it", and never offers the check.
describe('TaskeeView — up for grabs', () => {
  it('offers the claim instead of the completion circle', () => {
    const claims: string[] = []
    render(
      <TaskeeView
        tasks={[
          task({ id: 'g1', title: 'Water the plants', assigneeId: null, assigneeName: null }),
        ]}
        onClaimTask={(id) => {
          claims.push(id)
          return Promise.resolve()
        }}
      />
    )

    expect(screen.getByText('Up for grabs')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Mark .* done/ })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'I’ll do it' }))
    expect(claims).toEqual(['g1'])
  })

  it('the meter counts your work only, not the offer board', () => {
    render(
      <TaskeeView
        tasks={[
          task({ id: 't1', title: 'Make your bed' }),
          task({ id: 'g1', title: 'Water the plants', assigneeId: null, assigneeName: null }),
          task({ id: 'g2', title: 'Take out compost', assigneeId: null, assigneeName: null }),
        ]}
      />
    )

    expect(screen.getByText('1 left · 0 of 1 done')).toBeInTheDocument()
  })
})

// The routine row language: a days routine wears its schedule, an ongoing one its
// standing promise — and a completed ongoing row states its return.
describe('TaskeeView — routine rows', () => {
  it('states the schedule and the ongoing promise', () => {
    render(
      <TaskeeView
        tasks={[
          task({
            id: 'r1',
            title: 'Take out the trash',
            routineId: 'ro-1',
            routine: { kind: 'days', repeatDays: [1, 4] },
          }),
          task({
            id: 'r2',
            title: 'Empty the dishwasher',
            routineId: 'ro-2',
            routine: { kind: 'ongoing', repeatDays: [] },
          }),
        ]}
      />
    )

    expect(screen.getByText('Mon & Thu')).toBeInTheDocument()
    expect(screen.getByText("Whenever it's needed")).toBeInTheDocument()
  })

  it('a done ongoing chore says it will be back', () => {
    render(
      <TaskeeView
        tasks={[
          task({
            id: 'r2',
            title: 'Empty the dishwasher',
            routineId: 'ro-2',
            routine: { kind: 'ongoing', repeatDays: [] },
            status: 'completed',
            xpAwarded: true,
            completedAt: new Date().toISOString(),
          }),
        ]}
      />
    )

    // Completed on arrival → the collapsed Done section (auto-bug #82's rule).
    fireEvent.click(doneSection())
    expect(screen.getByText(/Done .+ · Back tomorrow/)).toBeInTheDocument()
  })
})
