import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider, MockAuthProvider } from '@family-os/platform'
import type { Profile } from '@family-os/platform/types'
import TodaySummary from './TodaySummary'
import type { ChoreTask } from '../types'

function jsonResponse(data: unknown) {
  return Promise.resolve({ ok: true, json: () => Promise.resolve(data) } as Response)
}

function mockFetch(tasks: ChoreTask[], totalXp: number) {
  return vi.fn((url: string) => {
    if (url.startsWith('/api/chores/xp')) return jsonResponse({ totalXp })
    return jsonResponse({ tasks })
  })
}

function task(over: Partial<ChoreTask> = {}): ChoreTask {
  return {
    id: 't1',
    title: 'Clean Bedroom',
    description: null,
    routineId: null,
    routine: null,
    assigneeId: 'kid-1',
    assigneeName: 'Kid',
    assigneeAvatarUrl: null,
    assigneeHue: 'sage',
    status: 'pending',
    dueDate: null,
    xpReward: 5,
    coinReward: 0,
    requiresApproval: false,
    xpAwarded: false,
    createdBy: 'parent-1',
    createdAt: new Date().toISOString(),
    completedAt: null,
    ...over,
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

function renderWidget(tasks: ChoreTask[], totalXp = 100) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const profile = { id: 'kid-1', name: 'Kid', tier: 2 } as Profile
  vi.stubGlobal('fetch', mockFetch(tasks, totalXp))
  return render(
    <MemoryRouter>
      <QueryClientProvider client={client}>
        <MockAuthProvider profile={profile}>
          <TodaySummary />
        </MockAuthProvider>
      </QueryClientProvider>
    </MemoryRouter>
  )
}

/* auto-bug #73 — the widget's "+N today" header summed XP for every completed task
   ever, not just the ones actually completed today, because nothing checked
   `completedAt` against today's date. */
describe('TodaySummary — daily XP is scoped to today (auto-bug #73)', () => {
  it('excludes a task completed on a prior day from the daily XP total', async () => {
    const yesterday = new Date(Date.now() - 2 * 86_400_000).toISOString()
    renderWidget([
      task({ id: 'old', status: 'completed', completedAt: yesterday, xpReward: 10 }),
      task({
        id: 'today',
        status: 'completed',
        completedAt: new Date().toISOString(),
        xpReward: 15,
      }),
      task({ id: 'pending', status: 'pending' }),
    ])

    await waitFor(() => expect(screen.getAllByText('+15').length).toBeGreaterThan(0))
    expect(screen.queryByText('+25')).not.toBeInTheDocument()
  })
})
