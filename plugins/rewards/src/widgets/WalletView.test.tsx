import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { WalletView } from './WalletView'
import type { Reward } from '../types'

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
