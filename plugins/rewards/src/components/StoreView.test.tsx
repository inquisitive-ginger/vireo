import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { StoreView } from './Store'
import type { Redemption, Reward } from '../types'

const earned = (rewardId: string, emoji: string, name: string): Redemption => ({
  id: `${rewardId}-${Math.random()}`,
  rewardId,
  profileId: 'kid',
  cost: 10,
  status: 'used',
  purchasedAt: '2026-07-26T00:00:00.000Z',
  useRequestedAt: null,
  usedAt: '2026-07-26T00:00:00.000Z',
  decidedBy: null,
  decidedAt: null,
  decidedNote: null,
  reward: { id: rewardId, emoji, name, description: null, requiresApproval: false },
})

const r = (over: Partial<Reward> & Pick<Reward, 'id' | 'name' | 'cost'>): Reward => ({
  emoji: '🎁',
  description: null,
  requiresApproval: false,
  audience: null,
  stock: null,
  active: true,
  ...over,
})

const catalog = [
  r({ id: 'a', name: 'Car music', cost: 5 }),
  r({ id: 'b', name: 'Movie night', cost: 15 }),
  r({ id: 'c', name: 'Ice cream', cost: 25, requiresApproval: true }),
  r({ id: 'd', name: 'Yes day', cost: 40, requiresApproval: true }),
]

describe('StoreView', () => {
  it('splits affordable from saving-up, leading with what you can get', () => {
    render(<StoreView balance={12} rewards={catalog} onPick={vi.fn()} />)
    expect(screen.getByText('You can get')).toBeInTheDocument()
    expect(screen.getByText('Saving up for')).toBeInTheDocument()
    // The old three-shelf labels are gone.
    expect(screen.queryByText('Almost there')).not.toBeInTheDocument()
    expect(screen.queryByText('Big goals')).not.toBeInTheDocument()
  })

  it('shows only the closest goal by default, and reveals the rest on "See all"', () => {
    render(<StoreView balance={12} rewards={catalog} onPick={vi.fn()} />)
    // Closest out-of-reach is Movie night (15, 3 away) — shown with its distance.
    expect(screen.getByText('3 more P$')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Movie night.*3 more P-Bucks/i })).toBeInTheDocument()
    // The further ones are hidden behind the disclosure until asked for.
    expect(screen.queryByRole('button', { name: /Yes day/i })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /See all rewards/i }))
    expect(screen.getByRole('button', { name: /Yes day/i })).toBeInTheDocument()
  })

  it('marks an approval reward with the Ask pill', () => {
    render(<StoreView balance={100} rewards={catalog} onPick={vi.fn()} />)
    // Everything is affordable at 100 → both approval rewards show as tiles with the pill.
    expect(screen.getAllByText('Ask first')).toHaveLength(2)
  })

  it('opens the picked reward when a tile is tapped', () => {
    const onPick = vi.fn()
    render(<StoreView balance={12} rewards={catalog} onPick={onPick} />)
    fireEvent.click(screen.getByRole('button', { name: /Car music.*You can get this now/i }))
    expect(onPick).toHaveBeenCalledWith(expect.objectContaining({ id: 'a' }))
  })

  it('invites setup when the catalog is empty', () => {
    render(<StoreView balance={0} rewards={[]} onPick={vi.fn()} />)
    expect(screen.getByText('No rewards yet')).toBeInTheDocument()
  })

  it('counts earned rewards and expands to a trophy shelf grouped by reward', () => {
    render(
      <StoreView
        balance={12}
        rewards={catalog}
        earned={[
          earned('a', '🎮', 'Extra screen'),
          earned('a', '🎮', 'Extra screen'),
          earned('b', '🍿', 'Movie night'),
        ]}
        onPick={vi.fn()}
      />
    )
    // Collapsed: a single motivating count line.
    expect(screen.getByRole('button', { name: /earned 3 rewards/i })).toBeInTheDocument()
    expect(screen.queryByText(/×2/)).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /earned 3 rewards/i }))
    // Expanded: grouped — the twice-earned reward shows a count. "Extra screen" isn't in
    // the visible catalog, so it's unique to the earned shelf.
    expect(screen.getByText('×2')).toBeInTheDocument()
    expect(screen.getByText('Extra screen')).toBeInTheDocument()
  })
})
