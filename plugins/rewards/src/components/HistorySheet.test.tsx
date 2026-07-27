import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MockAuthProvider, QueryClient, QueryClientProvider } from '@family-os/platform'
import type { Profile } from '@family-os/platform/types'
import { HistorySheet } from './HistorySheet'
import type { LedgerEntry, WalletPage } from '../types'

const teddy: Profile = { id: 'kid-teddy', name: 'Teddy Pritchett', tier: 2 }

const profiles: Profile[] = [
  teddy,
  { id: 'parent-emma', name: 'Emma Pritchett', tier: 4 },
  { id: 'family', name: 'Family', tier: 1 },
]

const iso = (daysAgo: number) => {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  d.setHours(9, 0, 0, 0)
  return d.toISOString()
}

const entry = (over: Partial<LedgerEntry> & Pick<LedgerEntry, 'id' | 'delta'>): LedgerEntry => ({
  reason: 'A chore',
  sourceType: 'chores.task',
  sourceId: null,
  createdBy: null,
  createdAt: iso(0),
  ...over,
})

/* The three rows deliberately sum to the balance (50 − 25 + 10 = 35) — AC1: the
   sheet explains the number, visibly. */
const page: WalletPage = {
  profileId: teddy.id,
  balance: 35,
  entries: [
    entry({
      id: 'e3',
      delta: 10,
      reason: 'Emptied the dishwasher',
      createdBy: 'parent-emma',
      createdAt: iso(0),
    }),
    entry({
      id: 'e2',
      delta: -25,
      reason: 'Bought 🍦 Ice cream run',
      sourceType: 'redemption',
      createdAt: iso(0),
    }),
    entry({ id: 'e1', delta: 50, reason: 'Mowed the lawn', createdAt: iso(3) }),
  ],
  nextCursor: null,
}

function mockFetch(walletPage: WalletPage) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: RequestInfo | URL) => {
      const u = String(url)
      const body = u.startsWith('/api/profiles') ? profiles : walletPage
      return new Response(JSON.stringify(body), { status: 200 })
    })
  )
}

function renderSheet() {
  return render(
    <MockAuthProvider profile={teddy}>
      <QueryClientProvider
        client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
      >
        <HistorySheet open onClose={() => {}} />
      </QueryClientProvider>
    </MockAuthProvider>
  )
}

beforeEach(() => {
  vi.unstubAllGlobals()
})

describe('HistorySheet', () => {
  it('reads the ledger back in kid grammar — earned signed, spent plain, summing to the balance', async () => {
    mockFetch(page)
    renderSheet()

    expect(await screen.findByText('Emptied the dishwasher')).toBeInTheDocument()
    // Earned rows are signed; spent rows carry the bare minus.
    expect(screen.getByText('+10')).toBeInTheDocument()
    expect(screen.getByText('−25')).toBeInTheDocument()
    expect(screen.getByText('+50')).toBeInTheDocument()
    // The reason is the row text, verbatim off the ledger.
    expect(screen.getByText('Bought 🍦 Ice cream run')).toBeInTheDocument()
    // AC1 made visible: the fully loaded story states the sum it reaches.
    expect(screen.getByText(/adds up to 35 P\$/)).toBeInTheDocument()
  })

  it('groups by day and names who checked a released chore payout', async () => {
    mockFetch(page)
    renderSheet()

    expect(await screen.findByText('Today')).toBeInTheDocument()
    // Three days back gets a weekday name, not a date.
    const weekday = new Date(iso(3)).toLocaleDateString(undefined, { weekday: 'long' })
    expect(screen.getByText(weekday)).toBeInTheDocument()
    // The payout tray's provenance retold: createdBy is the approving parent.
    expect(screen.getByText('checked by Emma')).toBeInTheDocument()
    // The auto-credited chore names nobody.
    expect(screen.getAllByText(/checked by/)).toHaveLength(1)
  })

  it('offers "further back" while pages remain, instead of claiming the story is whole', async () => {
    mockFetch({ ...page, nextCursor: 'e1' })
    renderSheet()

    expect(await screen.findByRole('button', { name: /Further back/ })).toBeInTheDocument()
    expect(screen.queryByText(/adds up to/)).not.toBeInTheDocument()
  })

  it('tells an empty story plainly', async () => {
    mockFetch({ ...page, balance: 0, entries: [] })
    renderSheet()

    expect(await screen.findByText(/the story starts here/)).toBeInTheDocument()
  })
})
