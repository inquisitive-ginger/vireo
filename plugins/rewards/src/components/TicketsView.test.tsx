import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MockAuthProvider, QueryClient, QueryClientProvider } from '@family-os/platform'
import type { Profile } from '@family-os/platform/types'
import { TicketsView } from './TicketsView'
import type { PunchCardData, Redemption } from '../types'

const parent: Profile = { id: 'parent-emma', name: 'Emma Pritchett', tier: 4 }

const profiles: Profile[] = [
  parent,
  { id: 'kid-teddy', name: 'Teddy Pritchett', tier: 2, identityHue: 'moss' },
]

const reward = { id: 'r1', name: 'Extra screen time', emoji: '🎮', description: null }

const ticket = (over: Partial<Redemption> = {}): Redemption => ({
  id: 'rd1',
  rewardId: 'r1',
  profileId: 'kid-teddy',
  cost: 3,
  status: 'owned',
  purchasedAt: '2026-07-29T14:49:00.000Z',
  useRequestedAt: null,
  usedAt: null,
  decidedBy: null,
  decidedAt: null,
  decidedNote: null,
  reward: { ...reward, requiresApproval: false },
  ...over,
})

const card = (over: Partial<PunchCardData> = {}): PunchCardData => ({
  id: 'pc1',
  templateId: 't1',
  profileId: 'kid-teddy',
  count: 2,
  chosenRewardId: null,
  chosenReward: null,
  completedAt: null,
  prizeClaimedAt: null,
  createdAt: '2026-07-29T14:49:00.000Z',
  template: {
    id: 't1',
    name: 'Try bites',
    glyph: '🥦',
    goal: 5,
    payoutKind: 'coins',
    payoutCoins: 10,
    payoutOptionIds: [],
    payoutOptions: null,
    audience: null,
    active: true,
  },
  ...over,
})

let redemptions: Redemption[]
let cards: PunchCardData[]
let fetchMock: ReturnType<typeof vi.fn>

beforeEach(() => {
  redemptions = [
    ticket(),
    ticket({ id: 'rd2', status: 'used', usedAt: '2026-07-30T15:33:00.000Z' }),
  ]
  cards = []
  fetchMock = vi.fn(async (url: RequestInfo | URL, init?: RequestInit) => {
    const u = String(url)
    if (u.startsWith('/api/profiles')) {
      return new Response(JSON.stringify(profiles), { status: 200 })
    }
    if (u.startsWith('/api/rewards/redemptions?')) {
      return new Response(JSON.stringify({ redemptions }), { status: 200 })
    }
    if (u.startsWith('/api/rewards/punch-cards') && u.endsWith('/punch')) {
      return new Response(JSON.stringify({ card: card({ count: 1 }) }), { status: 200 })
    }
    if (u.startsWith('/api/rewards/punch-cards')) {
      return new Response(JSON.stringify({ cards, finished: [] }), { status: 200 })
    }
    if (u.endsWith('/restore')) {
      return new Response(JSON.stringify({ redemption: ticket({ id: 'rd2' }) }), { status: 200 })
    }
    if (init?.method === 'DELETE') {
      return new Response(JSON.stringify({ revoked: true, balance: 3 }), { status: 200 })
    }
    throw new Error(`Unexpected fetch: ${u}`)
  })
  vi.stubGlobal('fetch', fetchMock)
})

function renderView() {
  return render(
    <MockAuthProvider profile={parent}>
      <QueryClientProvider
        client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
      >
        <TicketsView />
      </QueryClientProvider>
    </MockAuthProvider>
  )
}

describe('TicketsView', () => {
  it('splits a kid’s tickets into the pocket and what they’ve used', async () => {
    renderView()
    expect(await screen.findByText('Teddy Pritchett')).toBeInTheDocument()
    expect(screen.getByText('In pocket')).toBeInTheDocument()
    expect(screen.getByText('1 in pocket')).toBeInTheDocument()
    // The used shelf states its true total but starts CLOSED (M4/6 review gate) —
    // three shelves per kid made open history dominate the page.
    const shelf = screen.getByRole('button', { name: /Recently used · 1/ })
    expect(shelf).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(shelf)
    expect(screen.getByRole('button', { name: /Put .* back/ })).toBeInTheDocument()
  })

  /* Used tickets are never archived, so this shelf only grows (auto-bug #82). */
  it('clamps the used shelf and reveals the rest in steps', async () => {
    redemptions = Array.from({ length: 23 }, (_, i) =>
      ticket({ id: `u${i}`, status: 'used', usedAt: `2026-07-${String(i + 1).padStart(2, '0')}` })
    )
    renderView()
    fireEvent.click(await screen.findByRole('button', { name: /Recently used · 23/ }))
    expect(screen.getAllByRole('button', { name: /Put .* back/ })).toHaveLength(10)

    fireEvent.click(screen.getByRole('button', { name: 'Show 13 more' }))
    expect(screen.getAllByRole('button', { name: /Put .* back/ })).toHaveLength(20)

    fireEvent.click(screen.getByRole('button', { name: 'Show 3 more' }))
    expect(screen.getAllByRole('button', { name: /Put .* back/ })).toHaveLength(23)
    expect(screen.queryByRole('button', { name: /Show \d+ more/ })).not.toBeInTheDocument()
  })

  it('puts a used ticket back without a confirmation', async () => {
    renderView()
    fireEvent.click(await screen.findByRole('button', { name: /Recently used · 1/ }))
    fireEvent.click(await screen.findByRole('button', { name: /Put .* back/ }))
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/rewards/redemptions/rd2/restore',
        expect.objectContaining({ method: 'POST' })
      )
    )
  })

  it('clamps a deep pocket behind a disclosure', async () => {
    redemptions = Array.from({ length: 5 }, (_, i) => ticket({ id: `p${i}` }))
    renderView()
    expect(await screen.findByText('5 in pocket')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /Refund and remove/ })).toHaveLength(3)

    fireEvent.click(screen.getByRole('button', { name: /More in pocket · 2/ }))
    expect(screen.getAllByRole('button', { name: /Refund and remove/ })).toHaveLength(5)
  })

  // Money moves, so this one asks first — and the copy has to point at the cheaper
  // correction, or a parent undoing a mistaken tear reaches for the refund instead.
  it('confirms a refund and names the put-it-back alternative', async () => {
    renderView()
    fireEvent.click(await screen.findByRole('button', { name: /Refund and remove/ }))
    expect(await screen.findByText(/put it back instead/)).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalledWith(
      '/api/rewards/redemptions/rd1',
      expect.objectContaining({ method: 'DELETE' })
    )

    fireEvent.click(screen.getByRole('button', { name: 'Refund & remove' }))
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/rewards/redemptions/rd1',
        expect.objectContaining({ method: 'DELETE' })
      )
    )
  })

  it('shows an ask in flight in the pocket, not on the used shelf', async () => {
    redemptions = [ticket({ status: 'use_requested', useRequestedAt: '2026-07-30T15:00:00.000Z' })]
    renderView()
    expect(await screen.findByText(/waiting on your OK/)).toBeInTheDocument()
    expect(screen.queryByText('Recently used')).not.toBeInTheDocument()
  })

  /* M4/6 (ADR 049): the kid punches, the parent erases — the undo lives here. */
  it('lists a kid’s punch cards and undoes the last punch', async () => {
    cards = [card()]
    renderView()

    expect(await screen.findByText('Punch cards')).toBeInTheDocument()
    expect(screen.getByText('2 of 5 punched')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Undo the last punch/ }))
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/rewards/punch-cards/pc1/punch',
        expect.objectContaining({ method: 'DELETE' })
      )
    )
  })

  it('disables the undo on an untouched card', async () => {
    cards = [card({ count: 0 })]
    renderView()
    expect(await screen.findByRole('button', { name: /Undo the last punch/ })).toBeDisabled()
  })

  /* The take-down (M4/6 review gate): destructive of effort, so it confirms and
     the copy names the punches that go with it. */
  it('takes a card down behind a confirm that names the lost punches', async () => {
    cards = [card({ count: 7, template: { ...card().template, goal: 15 } })]
    renderView()

    fireEvent.click(await screen.findByRole('button', { name: /Take .* card down/ }))
    expect(await screen.findByText(/7 punches go with it/)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Take it down' }))
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/rewards/punch-cards/pc1',
        expect.objectContaining({ method: 'DELETE' })
      )
    )
  })

  it('leaves a full card alone — no eraser, no take-down, just the waiting pick', async () => {
    cards = [card({ count: 5, completedAt: '2026-07-31T09:00:00.000Z' })]
    renderView()

    expect(await screen.findByText('Card full — waiting on their prize pick')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Undo the last punch/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Take .* card down/ })).not.toBeInTheDocument()
  })
})
