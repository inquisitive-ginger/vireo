import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { AdminBoard, type AdminLane } from './AdminBoard'
import type { ChoreTask } from '../types'

function isoDay(offset: number): string {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return d.toISOString().slice(0, 10)
}

function task(over: Partial<ChoreTask> & Pick<ChoreTask, 'id' | 'title'>): ChoreTask {
  return {
    description: null,
    assigneeId: 'm-maya',
    assigneeName: 'Maya',
    assigneeAvatarUrl: null,
    status: 'pending',
    dueDate: null,
    xpReward: 10,
    createdBy: 'm-parent',
    createdAt: new Date().toISOString(),
    completedAt: null,
    ...over,
  }
}

// Maya hashes to `sage`, Luca to `plum` (packages/ui identity hash).
const MAYA_HUE = 'var(--identity-sage)'
const LUCA_HUE = 'var(--identity-plum)'

const OVERDUE = task({ id: 't1', title: 'Feed the dog', dueDate: isoDay(-2) })
const PENDING = task({ id: 't2', title: 'Make your bed', dueDate: isoDay(1) })
const DONE = task({ id: 't3', title: 'Tidy the playroom', status: 'completed' })

function lanes(over: Partial<AdminLane>[] = []): AdminLane[] {
  const base: AdminLane[] = [
    {
      assigneeId: 'm-maya',
      assigneeName: 'Maya',
      assigneeAvatarUrl: null,
      tasks: [OVERDUE, PENDING, DONE],
    },
  ]
  return over.length ? (over as AdminLane[]) : base
}

/** The row `<ItemCard>` that owns a given task title. */
function rowFor(title: string): HTMLElement {
  const heading = screen.getByText(title)
  const row = heading.closest('.rounded-card')
  if (!row) throw new Error(`no row found for “${title}”`)
  return row as HTMLElement
}

/** The row's leading spine — `<Spine>` renders an aria-hidden span with an inline
    background. It is the first such span in the row. */
function spineColorOf(title: string): string {
  const spine = rowFor(title).querySelector('span[aria-hidden]') as HTMLElement | null
  if (!spine) throw new Error(`no spine found for “${title}”`)
  return spine.style.background
}

describe('AdminBoard — identity takes the edge (ADR 043)', () => {
  it('paints every row spine with the ASSIGNEE hue, whatever the status', () => {
    render(<AdminBoard lanes={lanes()} onAddForAssignee={vi.fn()} />)

    // The whole point of the rework: the spine answers "whose", never "what state".
    expect(spineColorOf('Feed the dog')).toBe(MAYA_HUE) // overdue
    expect(spineColorOf('Make your bed')).toBe(MAYA_HUE) // pending
    expect(spineColorOf('Tidy the playroom')).toBe(MAYA_HUE) // done
  })

  it('never lets a status colour reach a row spine', () => {
    render(<AdminBoard lanes={lanes()} onAddForAssignee={vi.fn()} />)

    for (const title of ['Feed the dog', 'Make your bed', 'Tidy the playroom']) {
      expect(spineColorOf(title)).not.toContain('--success')
      expect(spineColorOf(title)).not.toContain('--error')
      expect(spineColorOf(title)).not.toContain('--border')
    }
  })

  it('gives each member their own hue', () => {
    render(
      <AdminBoard
        lanes={[
          { assigneeId: 'm-maya', assigneeName: 'Maya', assigneeAvatarUrl: null, tasks: [PENDING] },
          {
            assigneeId: 'm-luca',
            assigneeName: 'Luca',
            assigneeAvatarUrl: null,
            tasks: [
              task({
                id: 't9',
                title: 'Water the plants',
                assigneeId: 'm-luca',
                assigneeName: 'Luca',
              }),
            ],
          },
        ]}
        onAddForAssignee={vi.fn()}
      />
    )
    expect(spineColorOf('Make your bed')).toBe(MAYA_HUE)
    expect(spineColorOf('Water the plants')).toBe(LUCA_HUE)
  })

  it('carries status on the field instead — badge, wash, strikethrough', () => {
    render(<AdminBoard lanes={lanes()} onAddForAssignee={vi.fn()} />)

    // Overdue: a badge and an error wash on the row itself.
    expect(within(rowFor('Feed the dog')).getByText('Overdue')).toBeInTheDocument()
    expect(rowFor('Feed the dog').style.background).toContain('--error')

    // Pending: no wash, no badge.
    expect(rowFor('Make your bed').style.background).toBe('')

    // Done: struck through, and no XP pill (the reward is already banked).
    expect(screen.getByText('Tidy the playroom')).toHaveClass('line-through')
    expect(within(rowFor('Tidy the playroom')).queryByText('+10')).not.toBeInTheDocument()
  })
})

describe('AdminBoard — the member group header', () => {
  it('shows the member’s face and name, and flags an urgent member before their rows', () => {
    render(<AdminBoard lanes={lanes()} onAddForAssignee={vi.fn()} />)

    expect(screen.getByRole('img', { name: 'Maya' })).toBeInTheDocument()
    expect(screen.getByText('Maya')).toBeInTheDocument()
    expect(screen.getByText('1 overdue')).toBeInTheDocument()
    expect(screen.getByText('2 left')).toBeInTheDocument()
    expect(screen.getByText(/2 tasks · 20 XP load/)).toBeInTheDocument()
  })

  /* One fact must not wear two colours. The header chip said "1 overdue" while the
     row two lines below said "Overdue" — if the header is tinted in the member's hue,
     the same alarm is red in one place and pale teal in the other. */
  it('says overdue in the SAME language as the row — never in the member’s identity hue', () => {
    render(<AdminBoard lanes={lanes()} onAddForAssignee={vi.fn()} />)

    const headerChip = screen.getByText('1 overdue')
    const rowBadge = within(rowFor('Feed the dog')).getByText('Overdue')

    // Both are the destructive Badge; neither carries an inline identity tint.
    expect(headerChip.className).toContain('destructive')
    expect(rowBadge.className).toContain('destructive')
    expect(headerChip.style.background).toBe('')
  })

  it('says "✓ all done" in success green when a member has nothing open', () => {
    render(
      <AdminBoard
        lanes={[
          { assigneeId: 'm-maya', assigneeName: 'Maya', assigneeAvatarUrl: null, tasks: [DONE] },
        ]}
        onAddForAssignee={vi.fn()}
      />
    )
    const chip = screen.getByText('✓ all done')
    expect(chip.className).toContain('success')
    expect(chip.style.background).toBe('')
  })

  /* A meter is a COMPARISON. With nothing on the plate there is nothing to compare,
     so it must not render — otherwise it claims to have data it doesn't, and the 6%
     minimum-width floor even paints a stub of load that isn't there. */
  it('drops the load meter entirely for a member with nothing open', () => {
    render(
      <AdminBoard
        lanes={[
          { assigneeId: 'm-maya', assigneeName: 'Maya', assigneeAvatarUrl: null, tasks: [DONE] },
        ]}
        onAddForAssignee={vi.fn()}
      />
    )
    expect(screen.queryByText(/XP load/)).not.toBeInTheDocument()
    expect(screen.queryByText(/0 tasks/)).not.toBeInTheDocument()
  })

  it('shows no count chip when a member has nothing open — the status chip says it', () => {
    render(
      <AdminBoard
        lanes={[
          { assigneeId: 'm-maya', assigneeName: 'Maya', assigneeAvatarUrl: null, tasks: [DONE] },
        ]}
        onAddForAssignee={vi.fn()}
      />
    )
    expect(screen.queryByText(/left$/)).not.toBeInTheDocument()
  })

  it('prefills the create drawer from the per-member Add', () => {
    const onAdd = vi.fn()
    render(<AdminBoard lanes={lanes()} onAddForAssignee={onAdd} />)
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(onAdd).toHaveBeenCalledWith('m-maya')
  })
})

describe('AdminBoard — hide completed', () => {
  it('drops completed rows', () => {
    render(<AdminBoard lanes={lanes()} onAddForAssignee={vi.fn()} hideCompleted />)
    expect(screen.getByText('Feed the dog')).toBeInTheDocument()
    expect(screen.queryByText('Tidy the playroom')).not.toBeInTheDocument()
  })

  it('drops a member left with nothing to show — no header over an empty list', () => {
    render(
      <AdminBoard
        lanes={[
          { assigneeId: 'm-maya', assigneeName: 'Maya', assigneeAvatarUrl: null, tasks: [PENDING] },
          {
            assigneeId: 'm-luca',
            assigneeName: 'Luca',
            assigneeAvatarUrl: null,
            tasks: [
              task({ id: 't8', title: 'Old chore', assigneeName: 'Luca', status: 'completed' }),
            ],
          },
        ]}
        onAddForAssignee={vi.fn()}
        hideCompleted
      />
    )
    expect(screen.getByText('Maya')).toBeInTheDocument()
    expect(screen.queryByText('Luca')).not.toBeInTheDocument()
  })
})

describe('AdminBoard — tier-4 controls', () => {
  it('completes a task optimistically and reverts if the server rejects', async () => {
    const onComplete = vi.fn().mockRejectedValue(new Error('nope'))
    render(
      <AdminBoard
        lanes={[
          { assigneeId: 'm-maya', assigneeName: 'Maya', assigneeAvatarUrl: null, tasks: [PENDING] },
        ]}
        onAddForAssignee={vi.fn()}
        onCompleteTask={onComplete}
      />
    )

    fireEvent.click(screen.getByRole('checkbox', { name: 'Mark “Make your bed” done' }))
    expect(onComplete).toHaveBeenCalledWith('t2')
    // Optimistic: struck through immediately.
    expect(screen.getByText('Make your bed')).toHaveClass('line-through')

    // The rejection reverts it.
    await screen.findByRole('checkbox', { name: 'Mark “Make your bed” done' })
    expect(screen.getByText('Make your bed')).not.toHaveClass('line-through')
  })

  it('reopens a completed task', () => {
    const onReopen = vi.fn().mockResolvedValue({})
    render(
      <AdminBoard
        lanes={[
          { assigneeId: 'm-maya', assigneeName: 'Maya', assigneeAvatarUrl: null, tasks: [DONE] },
        ]}
        onAddForAssignee={vi.fn()}
        onReopenTask={onReopen}
      />
    )
    fireEvent.click(
      screen.getByRole('checkbox', { name: 'Reopen “Tidy the playroom” (mark not done)' })
    )
    expect(onReopen).toHaveBeenCalledWith('t3')
  })

  it('makes the row itself the edit target (the touch affordance)', () => {
    const onEdit = vi.fn()
    render(<AdminBoard lanes={lanes()} onAddForAssignee={vi.fn()} onEditTask={onEdit} />)
    // Two controls share the label: the stretched row overlay and the sm+ pencil.
    fireEvent.click(screen.getAllByRole('button', { name: 'Edit “Make your bed”' })[0])
    expect(onEdit).toHaveBeenCalledWith(PENDING)
  })

  it('delegates Remove to the host (which confirms)', () => {
    const onRemove = vi.fn()
    render(<AdminBoard lanes={lanes()} onAddForAssignee={vi.fn()} onRemoveTask={onRemove} />)
    fireEvent.click(screen.getByRole('button', { name: 'Remove “Make your bed”' }))
    expect(onRemove).toHaveBeenCalledWith(PENDING)
  })

  it('is read-only for the family dashboard — no Add, edit, remove, or check-off', () => {
    render(<AdminBoard lanes={lanes()} onAddForAssignee={vi.fn()} showAdd={false} />)

    expect(screen.queryByRole('button', { name: 'Add' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Edit / })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Remove / })).not.toBeInTheDocument()
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
  })
})
