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

// Completed "just now" so the today-scoping fix (auto-bug #73) doesn't drop these
// fixtures out of the widget's working set regardless of when the suite runs.
const COMPLETED_AT = new Date().toISOString()

function task(over: Partial<ChoreTask> = {}): ChoreTask {
  return {
    id: 't1',
    title: 'Clean Bedroom',
    description: null,
    routineId: null,
    routine: null,
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

// A completed task from a prior day — never today's calendar day, regardless of
// when the suite runs.
const YESTERDAY = new Date(Date.now() - 2 * 86_400_000).toISOString()

/* auto-bug #73 — "done today" and its XP kept accumulating across days because
   nothing checked `completedAt` against today's date; a chore finished days ago
   still counted as "done today" forever. */
describe('TodaySummaryView — "done today" is scoped to today (auto-bug #73)', () => {
  it('does not count a task completed on a prior day as done today', () => {
    view([
      task({ id: 'old', status: 'completed', completedAt: YESTERDAY }),
      task({ id: 'new', status: 'pending', completedAt: null }),
    ])
    expect(screen.getAllByText('0 of 1 done today').length).toBeGreaterThan(0)
  })

  it("does not render a prior day's completed row in the working list", () => {
    view([task({ id: 'old', title: 'Old Chore', status: 'completed', completedAt: YESTERDAY })])
    expect(screen.queryByText('Old Chore')).not.toBeInTheDocument()
  })

  it('still counts a task completed earlier today', () => {
    view([task({ id: 'today', status: 'completed', completedAt: COMPLETED_AT })])
    expect(screen.getAllByText('All done today').length).toBeGreaterThan(0)
  })
})

const familyView = (tasks: ChoreTask[], size?: 'compact' | 'standard' | 'large') =>
  render(
    <MemoryRouter>
      <TodaySummaryView tasks={tasks} tier={4} isFamily size={size} />
    </MemoryRouter>
  )

const HOUSEHOLD = ['Zach', 'Emma', 'Teddy', 'Nora'].map((name, i) =>
  task({ id: `t${i}`, title: `${name}'s chore`, assigneeName: name, status: 'pending' })
)

/* auto-bug #70 — the fourth member was sliced in half by the slot on the fridge iPad. */
describe('TodaySummaryView — the family list', () => {
  it('renders every member with work today', () => {
    familyView(HOUSEHOLD, 'large')
    for (const name of ['Zach', 'Emma', 'Teddy', 'Nora']) {
      expect(screen.getByText(name)).toBeInTheDocument()
    }
  })

  it('spends one line on the aggregate, not three', () => {
    familyView(HOUSEHOLD, 'large')
    // The count and its label share a line, and the done-count moved up beside
    // them — the meter no longer restates it on a line of its own.
    expect(screen.getByText('pending today')).toBeInTheDocument()
    expect(screen.getByText('0 of 4 done')).toBeInTheDocument()
    expect(screen.queryByText(/done today$/)).not.toBeInTheDocument()
  })

  it('keeps the stacked hero on the compact slot, which has nothing to make room for', () => {
    familyView(HOUSEHOLD, 'compact')
    expect(screen.getByText('0 of 4 done today')).toBeInTheDocument()
  })
})
