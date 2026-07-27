import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { StoreTab, PocketTab } from './Store'
import { UseTicketView } from './UseTicketDialog'
import type { Redemption, Reward } from '../types'

const r = (over: Partial<Reward> & Pick<Reward, 'id' | 'name' | 'cost'>): Reward => ({
  emoji: '🎁',
  description: null,
  requiresApproval: false,
  audience: null,
  stock: null,
  active: true,
  ...over,
})

const ticket = (
  over: Partial<Redemption> & { id: string; name: string; emoji?: string }
): Redemption => ({
  rewardId: over.id,
  profileId: 'kid',
  cost: 10,
  status: 'owned',
  purchasedAt: '2026-07-20T09:00:00.000Z',
  useRequestedAt: null,
  usedAt: null,
  decidedBy: null,
  decidedAt: null,
  decidedNote: null,
  ...over,
  reward: {
    id: over.id,
    name: over.name,
    emoji: over.emoji ?? '🎁',
    description: null,
    requiresApproval: false,
    ...(over.reward ?? {}),
  },
})

const catalog = [
  r({ id: 'a', name: 'Car music', cost: 5, description: 'Your tunes for the whole ride' }),
  r({ id: 'b', name: 'Movie night', cost: 15 }),
  r({ id: 'c', name: 'Ice cream', cost: 25, requiresApproval: true }),
  r({ id: 'd', name: 'Yes day', cost: 40, requiresApproval: true }),
]

describe('StoreTab', () => {
  it('leads with the purse — whose money, and how much', () => {
    render(<StoreTab name="Teddy" balance={35} rewards={catalog} onPick={vi.fn()} />)
    expect(screen.getByText(/Teddy’s P-Bucks/)).toBeInTheDocument()
    expect(screen.getByText('35')).toBeInTheDocument()
  })

  it('splits Get it now from Almost there', () => {
    render(<StoreTab name="Teddy" balance={16} rewards={catalog} onPick={vi.fn()} />)
    expect(screen.getByText('Get it now')).toBeInTheDocument()
    expect(screen.getByText('Almost there')).toBeInTheDocument()
    // The old shelf labels are gone.
    expect(screen.queryByText('You can get')).not.toBeInTheDocument()
    expect(screen.queryByText('Saving up for')).not.toBeInTheDocument()
  })

  it('orders Get it now by price descending — the biggest thing in reach leads', () => {
    render(<StoreTab name="Teddy" balance={35} rewards={catalog} onPick={vi.fn()} />)
    const tickets = screen.getAllByRole('button', { name: /You can get this now/ })
    expect(tickets[0]).toHaveAccessibleName(/Ice cream/)
    expect(tickets[1]).toHaveAccessibleName(/Movie night/)
    expect(tickets[2]).toHaveAccessibleName(/Car music/)
  })

  it('caps each shelf at three and reveals the rest on See all', () => {
    const many = [
      ...catalog,
      r({ id: 'e', name: 'Bake something', cost: 10 }),
      r({ id: 'f', name: 'Stay up late', cost: 10 }),
    ]
    render(<StoreTab name="Teddy" balance={35} rewards={many} onPick={vi.fn()} />)
    expect(screen.getAllByRole('button', { name: /You can get this now/ })).toHaveLength(3)
    fireEvent.click(screen.getByRole('button', { name: /See all 5 you can get/ }))
    expect(screen.getAllByRole('button', { name: /You can get this now/ })).toHaveLength(5)
  })

  it('renders a ticket with its description and a quiet ask marker', () => {
    render(<StoreTab name="Teddy" balance={35} rewards={catalog} onPick={vi.fn()} />)
    // getAll: the roll re-renders each ticket as dimmed aria-hidden echoes.
    expect(screen.getAllByText('Your tunes for the whole ride').length).toBeGreaterThan(0)
    // Ice cream (25, approval) is affordable → its ticket wears the corner ask line.
    expect(screen.getAllByText('ask to use').length).toBeGreaterThan(0)
  })

  it('keeps the roll echoes out of the accessibility tree', () => {
    render(<StoreTab name="Teddy" balance={35} rewards={catalog} onPick={vi.fn()} />)
    // One live tap target per reward, however many echoes render beside it.
    expect(screen.getAllByRole('button', { name: /Ice cream.*You can get this now/ })).toHaveLength(
      1
    )
  })

  it('shows distance as quiet text on an Almost there row — no meter, no pill', () => {
    render(<StoreTab name="Teddy" balance={12} rewards={catalog} onPick={vi.fn()} />)
    expect(screen.getByText('3 more P$')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Movie night, 15 P-Bucks. You need 3 more/ })
    ).toBeInTheDocument()
    // No balance-fed bar on the shelf — it would drop on every spend (see NearRow).
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })

  it('opens the picked reward when a ticket is tapped', () => {
    const onPick = vi.fn()
    render(<StoreTab name="Teddy" balance={12} rewards={catalog} onPick={onPick} />)
    fireEvent.click(screen.getByRole('button', { name: /Car music.*You can get this now/i }))
    expect(onPick).toHaveBeenCalledWith(expect.objectContaining({ id: 'a' }))
  })

  it('invites setup when the catalog is empty', () => {
    render(<StoreTab name="Teddy" balance={0} rewards={[]} onPick={vi.fn()} />)
    expect(screen.getByText('No rewards yet')).toBeInTheDocument()
  })
})

describe('PocketTab', () => {
  it('offers Use it on a ready ticket and Ask to use on an ask-first one', () => {
    render(
      <PocketTab
        pocket={[
          ticket({ id: 'a', name: 'Movie night', emoji: '🍿' }),
          ticket({
            id: 'c',
            name: 'Ice cream',
            reward: {
              id: 'c',
              name: 'Ice cream',
              emoji: '🍦',
              description: null,
              requiresApproval: true,
            },
          }),
        ]}
        used={[]}
        onUse={vi.fn()}
      />
    )
    expect(screen.getByRole('button', { name: 'Use Movie night' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ask to use Ice cream' })).toBeInTheDocument()
  })

  it('shows an asked ticket as waiting, with no button', () => {
    render(
      <PocketTab
        pocket={[
          ticket({
            id: 'a',
            name: 'Day out',
            status: 'use_requested',
            useRequestedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          }),
        ]}
        used={[]}
        onUse={vi.fn()}
      />
    )
    expect(screen.getByText('⏳ Waiting on a yes')).toBeInTheDocument()
    expect(screen.getByText('Asked 2 hours ago')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it("quotes a parent's not-now note on the returned ticket, verbatim", () => {
    render(
      <PocketTab
        pocket={[
          ticket({
            id: 'a',
            name: 'Day out',
            decidedNote: 'Big weekend already — next Saturday',
          }),
        ]}
        used={[]}
        onUse={vi.fn()}
      />
    )
    expect(
      screen.getByText(/“Big weekend already — next Saturday” — ask again anytime/)
    ).toBeInTheDocument()
  })

  it('fires onUse for the tapped ticket', () => {
    const onUse = vi.fn()
    const t = ticket({ id: 'a', name: 'Movie night' })
    render(<PocketTab pocket={[t]} used={[]} onUse={onUse} />)
    fireEvent.click(screen.getByRole('button', { name: 'Use Movie night' }))
    expect(onUse).toHaveBeenCalledWith(t)
  })

  it('groups torn stubs with counts on the shelf', () => {
    render(
      <PocketTab
        pocket={[]}
        used={[
          ticket({
            id: 'g',
            name: 'Car music',
            emoji: '🎧',
            status: 'used',
            usedAt: '2026-07-10T00:00:00.000Z',
          }),
          ticket({
            id: 'g',
            name: 'Car music',
            emoji: '🎧',
            status: 'used',
            usedAt: '2026-07-15T00:00:00.000Z',
          }),
          ticket({
            id: 'h',
            name: 'Baked brownies',
            emoji: '🍪',
            status: 'used',
            usedAt: '2026-07-20T00:00:00.000Z',
          }),
        ]}
        onUse={vi.fn()}
      />
    )
    expect(screen.getByText('Torn & enjoyed')).toBeInTheDocument()
    expect(screen.getByText('×2')).toBeInTheDocument()
    expect(screen.getByText(/3 rewards enjoyed since July/)).toBeInTheDocument()
  })

  it('points an empty pocket at the store', () => {
    render(<PocketTab pocket={[]} used={[]} onUse={vi.fn()} />)
    expect(screen.getByText('Nothing in your pocket yet')).toBeInTheDocument()
  })
})

describe('UseTicketView', () => {
  const base = {
    emoji: '🍿',
    name: 'Movie night',
    description: null,
    result: null,
    pending: false,
    error: null,
    onUse: vi.fn(),
    onClose: vi.fn(),
  }

  it('confirms a tear for a non-approval ticket — no money talk', () => {
    render(<UseTicketView {...base} title="Use it now?" askFirst={false} />)
    expect(screen.getByText(/Tear the ticket and it’s used/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Use it' })).toBeInTheDocument()
    expect(screen.queryByText(/P\$/)).not.toBeInTheDocument()
  })

  it('frames an ask-first ticket as timing, ticket safe in the pocket', () => {
    render(<UseTicketView {...base} title="Use it now?" askFirst />)
    expect(screen.getByText(/your ticket stays in your pocket/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Ask to use it/ })).toBeInTheDocument()
  })

  it('celebrates the tear and points at the shelf', () => {
    render(<UseTicketView {...base} title="Torn!" askFirst={false} result="used" />)
    expect(screen.getByText('Enjoy Movie night 🎉')).toBeInTheDocument()
    expect(screen.getByText(/The stub’s on your shelf/)).toBeInTheDocument()
  })

  it('confirms an ask went out without tearing anything', () => {
    render(<UseTicketView {...base} title="Asked!" askFirst result="use_requested" />)
    expect(screen.getByText(/stays in your pocket until it’s a yes/)).toBeInTheDocument()
  })
})
