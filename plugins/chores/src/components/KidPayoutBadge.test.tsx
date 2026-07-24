import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DeclinedNote, KidPayoutBadge } from './KidPayoutBadge'
import { kidPayoutView, reopenClawback } from '../lib/payouts'
import type { ChoreTask, PendingPayout } from '../types'

function task(over: Partial<ChoreTask> = {}): ChoreTask {
  return {
    id: 'th',
    title: 'Mow the lawn',
    description: null,
    assigneeId: 'm-kid',
    assigneeName: 'Kid',
    assigneeAvatarUrl: null,
    assigneeHue: 'sage',
    status: 'completed',
    dueDate: null,
    xpReward: 10,
    coinReward: 10,
    requiresApproval: false,
    xpAwarded: true,
    createdBy: 'm-parent',
    createdAt: '2026-07-23T16:12:00.000Z',
    completedAt: '2026-07-23T16:12:00.000Z',
    ...over,
  }
}

function payout(over: Partial<PendingPayout> = {}): PendingPayout {
  return {
    id: 'p1',
    profileId: 'm-kid',
    amount: 10,
    reason: 'Mow the lawn',
    sourceType: 'chores.task',
    sourceId: 'th@2026-07-23T16:12:00.000Z',
    status: 'pending',
    decidedNote: null,
    createdAt: '2026-07-23T16:12:00.000Z',
    ...over,
  }
}

describe('kidPayoutView (M4/3b)', () => {
  it('is null for a non-paying chore', () => {
    expect(kidPayoutView(task({ coinReward: 0 }))).toBeNull()
  })

  it('is null before completion', () => {
    expect(kidPayoutView(task({ status: 'pending' }))).toBeNull()
  })

  it('held from the task alone when approval is required and no payout row yet', () => {
    expect(kidPayoutView(task({ requiresApproval: true }))).toEqual({ kind: 'held', amount: 10 })
  })

  it('earned from the task alone for an auto-credited paying chore', () => {
    expect(kidPayoutView(task({ requiresApproval: false }))).toEqual({ kind: 'earned', amount: 10 })
  })

  it('follows the payout row once it exists: pending → held, approved → earned', () => {
    expect(kidPayoutView(task(), payout({ status: 'pending' }))).toEqual({
      kind: 'held',
      amount: 10,
    })
    expect(kidPayoutView(task(), payout({ status: 'approved' }))).toEqual({
      kind: 'earned',
      amount: 10,
    })
  })

  it('declined carries the note; voided renders nothing', () => {
    expect(kidPayoutView(task(), payout({ status: 'declined', decidedNote: 'Not yet' }))).toEqual({
      kind: 'declined',
      note: 'Not yet',
    })
    expect(kidPayoutView(task(), payout({ status: 'voided' }))).toBeNull()
  })
})

describe('reopenClawback (M4/3b)', () => {
  it('is 0 for a pending or non-paying chore', () => {
    expect(reopenClawback(task({ status: 'pending' }))).toBe(0)
    expect(reopenClawback(task({ coinReward: 0 }))).toBe(0)
  })

  it('claws back the coinReward for an auto-credited paying chore', () => {
    expect(reopenClawback(task({ requiresApproval: false, coinReward: 10 }))).toBe(10)
  })

  it('claws back only once an approval chore has been approved', () => {
    const t = task({ requiresApproval: true, coinReward: 10 })
    expect(reopenClawback(t, payout({ status: 'approved', amount: 10 }))).toBe(10)
    expect(reopenClawback(t, payout({ status: 'pending' }))).toBe(0) // still held → voids
    expect(reopenClawback(t, payout({ status: 'declined' }))).toBe(0)
    expect(reopenClawback(t, undefined)).toBe(0) // not yet decided / declined
  })
})

describe('KidPayoutBadge (M4/3b)', () => {
  it('held reads "when Mom or Dad checks" with the amount', () => {
    render(<KidPayoutBadge view={{ kind: 'held', amount: 10 }} />)
    expect(screen.getByText('10 F$ when Mom or Dad checks')).toBeInTheDocument()
  })

  it('earned shows the amount', () => {
    render(<KidPayoutBadge view={{ kind: 'earned', amount: 10 }} />)
    expect(screen.getByText('10 F$')).toBeInTheDocument()
  })

  it('declined reads "No F$ this time"', () => {
    render(<KidPayoutBadge view={{ kind: 'declined', note: null }} />)
    expect(screen.getByText('No F$ this time')).toBeInTheDocument()
  })

  it('renders nothing for a null view', () => {
    const { container } = render(<KidPayoutBadge view={null} />)
    expect(container).toBeEmptyDOMElement()
  })
})

describe('DeclinedNote (M4/3b)', () => {
  it('quotes the parent reason verbatim on a declined view', () => {
    render(<DeclinedNote view={{ kind: 'declined', note: 'Corners still full of leaves' }} />)
    expect(screen.getByText('“Corners still full of leaves”')).toBeInTheDocument()
  })

  it('renders nothing when a declined view has no note', () => {
    const { container } = render(<DeclinedNote view={{ kind: 'declined', note: null }} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing on a held view', () => {
    const { container } = render(<DeclinedNote view={{ kind: 'held', amount: 10 }} />)
    expect(container).toBeEmptyDOMElement()
  })
})
