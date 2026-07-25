import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { AdminBoard, type AdminLane } from './AdminBoard'
import { indexPayouts } from '../lib/payouts'
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

// The hues are ASSIGNED, not hashed from the name (ADR 044) — so the fixtures carry
// them, and these assertions are pinned to the assignment rather than to whatever
// bucket a name happens to fall in. (Hashing would also pin them to the palette's
// LENGTH: growing it from six hues to eight moved every bucket, which is what broke
// the previous version of this comment.)
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
      assigneeHue: 'sage',
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
          {
            assigneeId: 'm-maya',
            assigneeName: 'Maya',
            assigneeAvatarUrl: null,
            assigneeHue: 'sage',
            tasks: [PENDING],
          },
          {
            assigneeId: 'm-luca',
            assigneeName: 'Luca',
            assigneeAvatarUrl: null,
            assigneeHue: 'plum',
            tasks: [
              task({
                id: 't9',
                title: 'Water the plants',
                assigneeId: 'm-luca',
                assigneeName: 'Luca',
                assigneeHue: 'plum',
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

  it('takes the hue from the DATA, not the name — two members who hash alike still differ (ADR 044)', () => {
    // "Zach" and "Emma" hash to the same bucket, so under the old name-derived scheme
    // these two lanes rendered in ONE colour — stacked adjacently, on a board whose
    // entire language is "the spine says who". The assigned hue is what fixes it.
    render(
      <AdminBoard
        lanes={[
          {
            assigneeId: 'm-zach',
            assigneeName: 'Zach',
            assigneeAvatarUrl: null,
            assigneeHue: 'terracotta',
            tasks: [
              task({ id: 'z1', title: 'Bins', assigneeName: 'Zach', assigneeHue: 'terracotta' }),
            ],
          },
          {
            assigneeId: 'm-emma',
            assigneeName: 'Emma',
            assigneeAvatarUrl: null,
            assigneeHue: 'moss',
            tasks: [task({ id: 'e1', title: 'Dishes', assigneeName: 'Emma', assigneeHue: 'moss' })],
          },
        ]}
        onAddForAssignee={vi.fn()}
      />
    )
    expect(spineColorOf('Bins')).toBe('var(--identity-terracotta)')
    expect(spineColorOf('Dishes')).toBe('var(--identity-moss)')
    expect(spineColorOf('Bins')).not.toBe(spineColorOf('Dishes'))
  })

  it('falls back to the name hash only when a member has no assigned hue', () => {
    render(
      <AdminBoard
        lanes={[
          {
            assigneeId: 'm-maya',
            assigneeName: 'Maya',
            assigneeAvatarUrl: null,
            assigneeHue: null,
            tasks: [task({ id: 'n1', title: 'Sweep', assigneeName: 'Maya', assigneeHue: null })],
          },
        ]}
        onAddForAssignee={vi.fn()}
      />
    )
    // Still painted — an unassigned profile is never colourless.
    expect(spineColorOf('Sweep')).toMatch(/^var\(--identity-[a-z]+\)$/)
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
          {
            assigneeId: 'm-maya',
            assigneeName: 'Maya',
            assigneeAvatarUrl: null,
            assigneeHue: 'sage',
            tasks: [DONE],
          },
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
          {
            assigneeId: 'm-maya',
            assigneeName: 'Maya',
            assigneeAvatarUrl: null,
            assigneeHue: 'sage',
            tasks: [DONE],
          },
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
          {
            assigneeId: 'm-maya',
            assigneeName: 'Maya',
            assigneeAvatarUrl: null,
            assigneeHue: 'sage',
            tasks: [DONE],
          },
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
          {
            assigneeId: 'm-maya',
            assigneeName: 'Maya',
            assigneeAvatarUrl: null,
            assigneeHue: 'sage',
            tasks: [PENDING],
          },
          {
            assigneeId: 'm-luca',
            assigneeName: 'Luca',
            assigneeAvatarUrl: null,
            assigneeHue: 'sage',
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
          {
            assigneeId: 'm-maya',
            assigneeName: 'Maya',
            assigneeAvatarUrl: null,
            assigneeHue: 'sage',
            tasks: [PENDING],
          },
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
          {
            assigneeId: 'm-maya',
            assigneeName: 'Maya',
            assigneeAvatarUrl: null,
            assigneeHue: 'sage',
            tasks: [DONE],
          },
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

  it('routes a PAID reopen through the confirm handler, an unpaid one directly (M4/3b)', () => {
    const onReopen = vi.fn().mockResolvedValue({})
    const onReopenPaid = vi.fn()
    const paid = task({
      id: 'tp',
      title: 'Paid chore',
      status: 'completed',
      coinReward: 10,
      completedAt: '2026-07-23T16:12:00.000Z',
    })
    render(
      <AdminBoard
        lanes={[
          {
            assigneeId: 'm-maya',
            assigneeName: 'Maya',
            assigneeAvatarUrl: null,
            assigneeHue: 'sage',
            tasks: [paid, DONE], // DONE pays 0
          },
        ]}
        onAddForAssignee={vi.fn()}
        onReopenTask={onReopen}
        onReopenPaidTask={onReopenPaid}
      />
    )

    // The paid chore (auto-credited 10 P-Bucks) confirms first — no direct reopen.
    fireEvent.click(screen.getByRole('checkbox', { name: 'Reopen “Paid chore” (mark not done)' }))
    expect(onReopenPaid).toHaveBeenCalledWith(expect.objectContaining({ id: 'tp' }), 10)
    expect(onReopen).not.toHaveBeenCalled()

    // The unpaid completed chore reopens straight away.
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

  it('marks a reopened pending task with Redo, but not a fresh one (M4/3b)', () => {
    const reopened = task({ id: 'tr', title: 'Redo me', status: 'pending', xpAwarded: true })
    render(
      <AdminBoard
        lanes={[
          {
            assigneeId: 'm-maya',
            assigneeName: 'Maya',
            assigneeAvatarUrl: null,
            assigneeHue: 'sage',
            tasks: [reopened, PENDING],
          },
        ]}
        onAddForAssignee={vi.fn()}
      />
    )
    expect(within(rowFor('Redo me')).getByText('Redo')).toBeInTheDocument()
    // A never-completed pending task is not a redo.
    expect(within(rowFor('Make your bed')).queryByText('Redo')).not.toBeInTheDocument()
  })

  it('locks a completed row from editing — reopen is the way back (M4/3b)', () => {
    render(
      <AdminBoard
        lanes={lanes()}
        onAddForAssignee={vi.fn()}
        onEditTask={vi.fn()}
        onReopenTask={vi.fn()}
      />
    )
    // Done row: no pencil and no tap-to-edit overlay share the edit label.
    expect(
      screen.queryByRole('button', { name: 'Edit “Tidy the playroom”' })
    ).not.toBeInTheDocument()
    // ...but a pending row still edits.
    expect(screen.getAllByRole('button', { name: 'Edit “Make your bed”' }).length).toBeGreaterThan(
      0
    )
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

describe('AdminBoard — held payout tray (M4/3b)', () => {
  const COMPLETED_AT = '2026-07-23T16:12:00.000Z'
  const HELD = task({
    id: 'th',
    title: 'Mow the lawn',
    status: 'completed',
    coinReward: 10,
    requiresApproval: true,
    completedAt: COMPLETED_AT,
  })

  function heldLanes(): AdminLane[] {
    return [
      {
        assigneeId: 'm-maya',
        assigneeName: 'Maya',
        assigneeAvatarUrl: null,
        assigneeHue: 'sage',
        tasks: [HELD],
      },
    ]
  }

  const payoutIndex = indexPayouts([
    {
      id: 'p1',
      profileId: 'm-maya',
      amount: 10,
      reason: 'Mow the lawn',
      sourceType: 'chores.task',
      sourceId: `th@${COMPLETED_AT}`,
      status: 'pending',
      decidedNote: null,
      createdAt: COMPLETED_AT,
    },
  ])

  it('grows the tray on a held completed row, amount in the Pay button', () => {
    render(
      <AdminBoard
        lanes={heldLanes()}
        onAddForAssignee={vi.fn()}
        payoutIndex={payoutIndex}
        onDecidePayout={vi.fn()}
      />
    )
    expect(screen.getByText('Waiting on your OK')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Pay 10 P$' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Not yet' })).toBeInTheDocument()
  })

  it('Pay approves and Not yet declines the payout', () => {
    const onDecide = vi.fn().mockResolvedValue(undefined)
    render(
      <AdminBoard
        lanes={heldLanes()}
        onAddForAssignee={vi.fn()}
        payoutIndex={payoutIndex}
        onDecidePayout={onDecide}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Pay 10 P$' }))
    expect(onDecide).toHaveBeenCalledWith({ id: 'p1', decision: 'approve' })
  })

  it('declines via Not yet', () => {
    const onDecide = vi.fn().mockResolvedValue(undefined)
    render(
      <AdminBoard
        lanes={heldLanes()}
        onAddForAssignee={vi.fn()}
        payoutIndex={payoutIndex}
        onDecidePayout={onDecide}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Not yet' }))
    expect(onDecide).toHaveBeenCalledWith({ id: 'p1', decision: 'decline' })
  })

  it('no tray on a completed row without a held payout', () => {
    render(<AdminBoard lanes={heldLanes()} onAddForAssignee={vi.fn()} onDecidePayout={vi.fn()} />)
    expect(screen.queryByText('Waiting on your OK')).not.toBeInTheDocument()
  })

  it('still keeps the assignee hue on the held row spine (ADR 043)', () => {
    render(
      <AdminBoard
        lanes={heldLanes()}
        onAddForAssignee={vi.fn()}
        payoutIndex={payoutIndex}
        onDecidePayout={vi.fn()}
      />
    )
    expect(spineColorOf('Mow the lawn')).toBe(MAYA_HUE)
  })

  it('exposes no edit affordance on a held row — reopen to change it', () => {
    render(
      <AdminBoard
        lanes={heldLanes()}
        onAddForAssignee={vi.fn()}
        payoutIndex={payoutIndex}
        onDecidePayout={vi.fn()}
        onEditTask={vi.fn()}
        onReopenTask={vi.fn()}
      />
    )
    expect(screen.queryByRole('button', { name: 'Edit “Mow the lawn”' })).not.toBeInTheDocument()
    // The reopen check is present — the one way back to editable.
    expect(
      screen.getByRole('checkbox', { name: 'Reopen “Mow the lawn” (mark not done)' })
    ).toBeInTheDocument()
  })
})
