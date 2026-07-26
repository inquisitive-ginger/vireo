import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { WalletView } from './WalletView'
import type { Redemption, Reward } from '../types'

const r = (over: Partial<Reward> & Pick<Reward, 'id' | 'name' | 'cost'>): Reward => ({
  emoji: '🎧',
  description: null,
  requiresApproval: false,
  audience: null,
  stock: null,
  active: true,
  ...over,
})

const catalog = [
  r({ id: 'a', name: 'Car music', cost: 5 }),
  r({ id: 'b', name: 'Screen', cost: 10 }),
  r({ id: 'c', name: 'Late', cost: 10 }),
  r({ id: 'd', name: 'Bake', cost: 10 }),
  r({ id: 'e', name: 'Movie night', cost: 15 }),
]

function renderWallet(props: Parameters<typeof WalletView>[0]) {
  return render(
    <MemoryRouter>
      <WalletView {...props} size="compact" />
    </MemoryRouter>
  )
}

describe('WalletView', () => {
  it('leads with what you can get when the balance affords something', () => {
    renderWallet({ balance: 12, rewards: catalog })
    expect(screen.getByText(/4 you can get/)).toBeInTheDocument()
  })

  it('points a near-empty wallet at the next reachable reward, not a dead end', () => {
    renderWallet({ balance: 3, rewards: catalog })
    expect(screen.getByText(/2 more P\$ for/)).toBeInTheDocument()
    expect(screen.getByText('Car music')).toBeInTheDocument()
  })

  it('nudges toward earning when nothing is affordable and no goal is closer', () => {
    renderWallet({ balance: 0, rewards: [] })
    expect(screen.getByText(/Do a chore to earn your first P-Bucks/)).toBeInTheDocument()
  })

  it('shows the XP footnote only when XP is supplied (taskee)', () => {
    const { rerender } = renderWallet({ balance: 12, rewards: catalog, lifetimeXp: 340 })
    expect(screen.getByText(/XP earned all-time/)).toBeInTheDocument()
    expect(screen.getByText('340')).toBeInTheDocument()

    rerender(
      <MemoryRouter>
        <WalletView balance={12} rewards={catalog} size="compact" />
      </MemoryRouter>
    )
    expect(screen.queryByText(/XP earned all-time/)).not.toBeInTheDocument()
  })
})

const ticket = (id: string, emoji: string, purchasedAt: string): Redemption => ({
  id,
  rewardId: id,
  profileId: 'kid',
  cost: 10,
  status: 'owned',
  purchasedAt,
  useRequestedAt: null,
  usedAt: null,
  decidedBy: null,
  decidedAt: null,
  decidedNote: null,
  reward: { id, name: id, emoji, description: null, requiresApproval: false },
})

/* M4/5c — AC3: ticket-ready › affordable › next-goal › first-earn. The thing you
   already have beats the thing you could buy. */
describe('WalletView ticket-ready line', () => {
  it('an owned ticket beats the affordability line', () => {
    renderWallet({ balance: 12, rewards: catalog, tickets: [ticket('t1', '🍿', '2026-07-20')] })
    expect(screen.getByText(/A ticket’s waiting in your pocket/)).toBeInTheDocument()
    expect(screen.queryByText(/you can get/)).not.toBeInTheDocument()
  })

  it('leads with the longest-held ticket, and counts several', () => {
    renderWallet({
      balance: 0,
      rewards: catalog,
      tickets: [ticket('new', '🎨', '2026-07-25'), ticket('old', '🍿', '2026-07-18')],
    })
    expect(screen.getByText('🍿')).toBeInTheDocument()
    expect(screen.getByText(/2 tickets are waiting in your pocket/)).toBeInTheDocument()
  })
})
