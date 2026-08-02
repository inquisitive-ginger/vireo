import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MockAuthProvider, QueryClient, QueryClientProvider } from '@family-os/platform'
import type { Profile } from '@family-os/platform/types'
import { PunchCardsTab } from './PunchCardsTab'
import type { PrizeOption, PunchCardData, PunchResponse } from '../lib/punch-cards'

const teddy: Profile = { id: 'kid-teddy', name: 'Teddy Pritchett', tier: 2 }

const icecream: PrizeOption = {
  id: 'r-ice',
  name: 'Ice cream run',
  emoji: '🍦',
  description: null,
  cost: 25,
  requiresApproval: true,
  active: true,
}
const bake: PrizeOption = {
  id: 'r-bake',
  name: 'Bake something',
  emoji: '🍪',
  description: 'Pick a treat and make it',
  cost: 10,
  requiresApproval: false,
  active: true,
}

const card = (over: Partial<PunchCardData> = {}): PunchCardData => ({
  id: 'pc1',
  templateId: 't1',
  profileId: 'kid-teddy',
  count: 3,
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
    payoutKind: 'reward',
    payoutCoins: null,
    payoutOptionIds: [icecream.id, bake.id],
    payoutOptions: [icecream, bake],
    audience: null,
    active: true,
  },
  ...over,
})

let cards: PunchCardData[]
let punchResponse: PunchResponse
let prizeResponse: { card: PunchCardData; payout: unknown }
let fetchMock: ReturnType<typeof vi.fn>

beforeEach(() => {
  cards = [card()]
  punchResponse = { card: card({ count: 4 }), completed: false, payout: null, prizePending: false }
  prizeResponse = {
    card: card({ chosenRewardId: icecream.id, chosenReward: icecream }),
    payout: null,
  }
  fetchMock = vi.fn(async (url: RequestInfo | URL) => {
    const u = String(url)
    if (u.endsWith('/punch')) return new Response(JSON.stringify(punchResponse), { status: 200 })
    if (u.endsWith('/prize')) return new Response(JSON.stringify(prizeResponse), { status: 200 })
    if (u.startsWith('/api/rewards/punch-cards')) {
      return new Response(JSON.stringify({ cards, finished: [] }), { status: 200 })
    }
    throw new Error(`Unexpected fetch: ${u}`)
  })
  vi.stubGlobal('fetch', fetchMock)
})

function renderTab() {
  return render(
    <MockAuthProvider profile={teddy}>
      <QueryClientProvider
        client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
      >
        <PunchCardsTab tabBar={<div data-testid="tabbar" />} />
      </QueryClientProvider>
    </MockAuthProvider>
  )
}

describe('PunchCardsTab', () => {
  it('renders the paper sheet — one dashed tap target, the wrapped gift before a pick', async () => {
    renderTab()

    expect(await screen.findByText('Try bites')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /Punch Try bites/ })).toHaveLength(1)
    expect(screen.getByRole('button', { name: 'Punch Try bites — 4 of 5' })).toBeInTheDocument()
    // Unpicked choice card: the gift finish line + the invitation.
    expect(screen.getByRole('button', { name: 'Pick your prize for Try bites' })).toHaveTextContent(
      '🎁'
    )
    expect(screen.getByRole('button', { name: 'Pick your prize ›' })).toBeInTheDocument()
  })

  it('carries the kid’s pick on the finish line once named', async () => {
    cards = [card({ chosenRewardId: icecream.id, chosenReward: icecream })]
    renderTab()

    expect(
      await screen.findByRole('button', { name: 'Change your prize for Try bites' })
    ).toHaveTextContent('🍦')
    expect(
      screen.getByText(/🍦 Ice cream run is yours. Tap it to change your pick/)
    ).toBeInTheDocument()
  })

  it('punches on tap with no confirm', async () => {
    renderTab()
    fireEvent.click(await screen.findByRole('button', { name: /Punch Try bites/ }))

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/rewards/punch-cards/pc1/punch',
        expect.objectContaining({ method: 'POST' })
      )
    )
    expect(screen.queryByText(/Punch it\?/)).not.toBeInTheDocument()
  })

  it('opens the prize picker from the finish line and names the pick', async () => {
    renderTab()
    fireEvent.click(await screen.findByRole('button', { name: 'Pick your prize for Try bites' }))

    expect(await screen.findByText('What are you working for?')).toBeInTheDocument()
    // Ask-first options carry their seal in the sheet — no surprise at use time.
    expect(screen.getByText('ask to use')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /^Ice cream run/ }))
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/rewards/punch-cards/pc1/prize',
        expect.objectContaining({ method: 'POST', body: JSON.stringify({ rewardId: icecream.id }) })
      )
    )
  })

  it('claims a full unpicked card through the picker and celebrates the mint', async () => {
    punchResponse = {
      card: card({ count: 5, completedAt: '2026-07-31T10:00:00.000Z' }),
      completed: true,
      payout: null,
      prizePending: true,
    }
    prizeResponse = {
      card: card({
        count: 5,
        completedAt: '2026-07-31T10:00:00.000Z',
        prizeClaimedAt: '2026-07-31T10:00:05.000Z',
        chosenRewardId: bake.id,
        chosenReward: bake,
      }),
      payout: {
        kind: 'reward',
        redemptionId: 'rd9',
        rewardId: bake.id,
        emoji: '🍪',
        name: 'Bake something',
      },
    }
    cards = [card({ count: 4 })]
    renderTab()

    fireEvent.click(await screen.findByRole('button', { name: /Punch Try bites/ }))
    expect(await screen.findByText('Card full! Pick your prize')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /^Bake something/ }))
    expect(
      await screen.findByText(/🍪 Bake something is in your pocket — it's in Rewards/)
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Start the next/ }))
    expect(screen.queryByText('Done!')).not.toBeInTheDocument()
  })

  it('celebrates a picked card straight from the finishing punch', async () => {
    cards = [card({ count: 4, chosenRewardId: icecream.id, chosenReward: icecream })]
    punchResponse = {
      card: card({
        count: 5,
        completedAt: '2026-07-31T10:00:00.000Z',
        prizeClaimedAt: '2026-07-31T10:00:00.000Z',
        chosenRewardId: icecream.id,
        chosenReward: icecream,
      }),
      completed: true,
      payout: {
        kind: 'reward',
        redemptionId: 'rd8',
        rewardId: icecream.id,
        emoji: '🍦',
        name: 'Ice cream run',
      },
      prizePending: false,
    }
    renderTab()

    fireEvent.click(await screen.findByRole('button', { name: /Punch Try bites/ }))
    expect(
      await screen.findByText(/🍦 Ice cream run is in your pocket — it's in Rewards/)
    ).toBeInTheDocument()
    expect(screen.getByText('Done!')).toBeInTheDocument()
  })

  it('keeps a full unclaimed card glowing until the prize is taken', async () => {
    cards = [card({ count: 5, completedAt: '2026-07-31T09:00:00.000Z' })]
    renderTab()

    expect(await screen.findByText('Card full — your prize is waiting.')).toBeInTheDocument()
    expect(screen.getByText('Done!')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Punch Try bites/ })).not.toBeInTheDocument()
  })

  it('offers the coins escape hatch when every option is retired', async () => {
    const retired = { ...icecream, active: false }
    const retired2 = { ...bake, active: false }
    cards = [
      card({
        count: 5,
        completedAt: '2026-07-31T09:00:00.000Z',
        template: { ...card().template, payoutOptions: [retired, retired2] },
      }),
    ]
    renderTab()

    fireEvent.click(await screen.findByRole('button', { name: 'Pick your prize ›' }))
    expect(await screen.findByText(/aren’t in the store any more/)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Claim 25 P\$ instead/ }))
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/rewards/punch-cards/pc1/prize',
        expect.objectContaining({ body: JSON.stringify({ rewardId: null }) })
      )
    )
  })

  it('shows the empty state when no templates exist', async () => {
    cards = []
    renderTab()
    expect(await screen.findByText('No punch cards yet')).toBeInTheDocument()
  })
})
