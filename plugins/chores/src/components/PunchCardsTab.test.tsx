import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { MockAuthProvider, QueryClient, QueryClientProvider } from '@family-os/platform'
import type { Profile } from '@family-os/platform/types'
import { PunchCardsTab } from './PunchCardsTab'
import type { FinishedCards, PrizeOption, PunchCardData, PunchResponse } from '../lib/punch-cards'

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
  lastPunchedAt: null,
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
let finished: FinishedCards[]
let punchResponse: PunchResponse
let prizeResponse: { card: PunchCardData; payout: unknown }
let fetchMock: ReturnType<typeof vi.fn>

beforeEach(() => {
  cards = [card()]
  finished = []
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
      return new Response(JSON.stringify({ cards, finished }), { status: 200 })
    }
    throw new Error(`Unexpected fetch: ${u}`)
  })
  vi.stubGlobal('fetch', fetchMock)
})

function renderTab() {
  return render(
    <MemoryRouter>
      <MockAuthProvider profile={teddy}>
        <QueryClientProvider
          client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
        >
          <PunchCardsTab tabBar={<div data-testid="tabbar" />} />
        </QueryClientProvider>
      </MockAuthProvider>
    </MemoryRouter>
  )
}

const gridLabels = () => screen.getAllByRole('img').map((el) => el.getAttribute('aria-label') ?? '')

describe('PunchCardsTab', () => {
  it('renders the stamp wall — one dashed tap target, countdown in the header', async () => {
    renderTab()

    expect(await screen.findByText('Try bites')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /Punch Try bites/ })).toHaveLength(1)
    expect(screen.getByRole('button', { name: 'Punch Try bites — 4 of 5' })).toBeInTheDocument()
    expect(screen.getByText('2 to go')).toBeInTheDocument()
    expect(screen.getByText('3 of 5')).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: /Try bites: 3 of 5 stamped, 2 to go/ })
    ).toBeInTheDocument()
  })

  it('shows the last-punched meta line, and omits it on a fresh card', async () => {
    const yesterday = new Date(Date.now() - 86_400_000).toISOString()
    cards = [card({ lastPunchedAt: yesterday })]
    const { unmount } = renderTab()

    expect(await screen.findByText('Last punched yesterday')).toBeInTheDocument()
    unmount()

    cards = [card({ lastPunchedAt: null })]
    renderTab()
    await screen.findByText('Try bites')
    expect(screen.queryByText(/Last punched/)).not.toBeInTheDocument()
  })

  it('unpicked rail is the loud state — its primary CTA opens the picker', async () => {
    renderTab()

    expect(await screen.findByText('What are you working for?')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Pick your prize' }))

    // Ask-first options carry their seal in the sheet — no surprise at use time.
    expect(await screen.findByRole('button', { name: /^Ice cream run/ })).toBeInTheDocument()
    expect(screen.getByText('ask to use')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /^Ice cream run/ }))
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/rewards/punch-cards/pc1/prize',
        expect.objectContaining({ method: 'POST', body: JSON.stringify({ rewardId: icecream.id }) })
      )
    )
  })

  it('carries the kid’s pick in the rail once named, with the quiet change link', async () => {
    cards = [card({ chosenRewardId: icecream.id, chosenReward: icecream })]
    renderTab()

    expect(await screen.findByText('Ice cream run')).toBeInTheDocument()
    expect(screen.getByText('Your pick — 2 stamps away.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Change your prize for Try bites' }))
    expect(await screen.findByRole('button', { name: /^Bake something/ })).toBeInTheDocument()
  })

  it('renders the coins rail with the amount and no CTA', async () => {
    cards = [
      card({
        template: {
          ...card().template,
          payoutKind: 'coins',
          payoutCoins: 15,
          payoutOptionIds: [],
          payoutOptions: [],
        },
      }),
    ]
    renderTab()

    expect(await screen.findByText('15 P-Bucks')).toBeInTheDocument()
    expect(screen.getByText('Straight into your wallet.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Pick your prize' })).not.toBeInTheDocument()
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

  it('sorts full cards first, then closest to a prize, and holds order as punches land', async () => {
    const reading = (over: Partial<PunchCardData> = {}) =>
      card({
        id: 'pc2',
        templateId: 't2',
        count: 13,
        template: { ...card().template, id: 't2', name: 'Reading nights', goal: 15 },
        ...over,
      })
    const teeth = card({
      id: 'pc3',
      templateId: 't3',
      count: 5,
      completedAt: '2026-08-01T09:00:00.000Z',
      template: { ...card().template, id: 't3', name: 'Kind catch' },
    })
    // Try bites: 2 remaining · Reading nights: 2 remaining (id tie-break) · Kind catch: full
    cards = [reading(), card(), teeth]
    renderTab()
    await screen.findByText('Try bites')

    let labels = gridLabels()
    expect(labels[0]).toMatch(/^Kind catch: all 5/)
    expect(labels[1]).toMatch(/^Try bites/)
    expect(labels[2]).toMatch(/^Reading nights/)

    // The refetch after a punch changes counts but not membership — order holds
    // even though Reading nights is now closer than Try bites.
    cards = [reading({ count: 14 }), card(), teeth]
    punchResponse = {
      card: reading({ count: 14 }),
      completed: false,
      payout: null,
      prizePending: false,
    }
    fireEvent.click(screen.getByRole('button', { name: /Punch Reading nights/ }))
    await waitFor(() =>
      expect(screen.getByRole('img', { name: /Reading nights: 14 of 15/ })).toBeInTheDocument()
    )
    labels = gridLabels()
    expect(labels[1]).toMatch(/^Try bites/)
    expect(labels[2]).toMatch(/^Reading nights/)
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
    expect(await screen.findByText('Bake something is yours!')).toBeInTheDocument()
    expect(screen.getByText('Prize won!')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Start the next/ }))
    expect(screen.queryByText('Prize won!')).not.toBeInTheDocument()
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
    expect(await screen.findByText('Ice cream run is yours!')).toBeInTheDocument()
    expect(screen.getByText("It's in your pocket, in Rewards.")).toBeInTheDocument()
  })

  it('keeps a full unclaimed card gold until the prize is taken', async () => {
    cards = [card({ count: 5, completedAt: '2026-07-31T09:00:00.000Z' })]
    renderTab()

    expect(await screen.findByText('Card full!')).toBeInTheDocument()
    expect(screen.getByText('Pick your prize!')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Punch Try bites/ })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Pick your prize' }))
    expect(await screen.findByText('Card full! Pick your prize')).toBeInTheDocument()
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

    fireEvent.click(await screen.findByRole('button', { name: 'Pick your prize' }))
    expect(await screen.findByText(/aren’t in the store any more/)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Claim 25 P\$ instead/ }))
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/rewards/punch-cards/pc1/prize',
        expect.objectContaining({ body: JSON.stringify({ rewardId: null }) })
      )
    )
  })

  it('shelves the latest three finished cards with a See-all link into Rewards', async () => {
    const stub = (n: number, over: Partial<FinishedCards> = {}): FinishedCards => ({
      templateId: `ft${n}`,
      profileId: 'kid-teddy',
      name: `Habit ${n}`,
      glyph: '🎉',
      count: 1,
      lastFinishedAt: `2026-07-0${n}T10:00:00.000Z`,
      prizeName: null,
      prizeCoins: null,
      ...over,
    })
    finished = [
      stub(1, { count: 2, prizeCoins: 15 }),
      stub(2, { prizeName: 'Pool trip' }),
      stub(3),
      stub(4),
    ]
    renderTab()

    expect(await screen.findByText('Cards you’ve finished')).toBeInTheDocument()
    // Latest three by finish date — the oldest (Habit 1) falls off the shelf...
    expect(screen.getByText('Habit 4')).toBeInTheDocument()
    expect(screen.getByText('Habit 3')).toBeInTheDocument()
    expect(screen.getByText(/Pool trip/)).toBeInTheDocument()
    expect(screen.queryByText(/Habit 1/)).not.toBeInTheDocument()
    // ...but the See-all count is every finish, and the link goes to Rewards.
    const link = screen.getByRole('link', { name: 'See all 5 in My stuff ›' })
    expect(link).toHaveAttribute('href', '/rewards')
  })

  it('shows the empty state when no templates exist', async () => {
    cards = []
    renderTab()
    expect(await screen.findByText('No punch cards yet')).toBeInTheDocument()
  })
})
