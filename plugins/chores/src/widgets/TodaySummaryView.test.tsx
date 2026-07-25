import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { TodaySummaryView } from './TodaySummaryView'
import { indexPayouts } from '../lib/payouts'
import type { ChoreTask, PendingPayout } from '../types'

// The earn UI is flagged off by default (prod), which would hide every reward chip and
// make these assertions vacuously pass. Force it on — this file is about what the chips
// SAY once they render.
vi.mock('../lib/flags', () => ({
  REWARDS_UI_ENABLED: true,
  showCoinReward: (coinReward: number) => coinReward > 0,
}))

const COMPLETED_AT = '2026-07-24T16:12:00.000Z'

function task(over: Partial<ChoreTask> = {}): ChoreTask {
  return {
    id: 't1',
    title: 'Clean Bedroom',
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
    createdAt: COMPLETED_AT,
    completedAt: COMPLETED_AT,
    ...over,
  }
}

function payout(over: Partial<PendingPayout> = {}): PendingPayout {
  return {
    id: 'p1',
    profileId: 'm-kid',
    amount: 10,
    reason: 'Clean Bedroom',
    sourceType: 'chores.task',
    sourceId: `t1@${COMPLETED_AT}`,
    status: 'pending',
    decidedNote: null,
    createdAt: COMPLETED_AT,
    ...over,
  }
}

// Every density variant's markup ships at once (CSS container queries reveal one), so a
// row appears more than once in jsdom.
const view = (tasks: ChoreTask[], payouts: PendingPayout[] = []) =>
  render(
    <MemoryRouter>
      <TodaySummaryView tasks={tasks} tier={2} payoutIndex={indexPayouts(payouts)} />
    </MemoryRouter>
  )

/* The gap M4/3b left here: the page learned held/earned/declined and the widget did not,
   so a completed row rendered `coinReward` raw and stated all three outcomes as banked. */
describe('TodaySummaryView — a completed row states the payout OUTCOME', () => {
  it('shows the plain value for an auto-credited paying chore', () => {
    view([task({ requiresApproval: false })])
    expect(screen.getAllByText('10 P-Bucks').length).toBeGreaterThan(0)
    expect(screen.queryByText(/when Mom or Dad checks/)).not.toBeInTheDocument()
  })

  it('does not bank a payout that is still held for a parent', () => {
    view([task({ requiresApproval: true })], [payout({ status: 'pending' })])
    expect(screen.getAllByText('10 P$ when Mom or Dad checks').length).toBeGreaterThan(0)
  })

  it('does not bank a payout the parent declined', () => {
    view([task({ requiresApproval: true })], [payout({ status: 'declined' })])
    expect(screen.getAllByText('No P$ this time').length).toBeGreaterThan(0)
    expect(screen.queryByText('10 P-Bucks')).not.toBeInTheDocument()
  })

  it('still shows the promise on a row that is not done yet', () => {
    view([task({ status: 'pending', completedAt: null, requiresApproval: true })])
    expect(screen.getAllByText('10').length).toBeGreaterThan(0)
    expect(screen.queryByText(/when Mom or Dad checks/)).not.toBeInTheDocument()
  })
})
