import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import type { Profile } from '@family-os/platform/types'
import { RewardRow } from './RewardRow'
import type { Reward } from '../types'

const TEDDY: Profile = { id: 't', name: 'Teddy', tier: 1, identityHue: 'moss' }
const EMMA: Profile = { id: 'e', name: 'Emma', tier: 1, identityHue: 'sky' }

const reward = (over: Partial<Reward> = {}): Reward => ({
  id: 'r1',
  name: 'Pick the movie',
  emoji: '🍿',
  description: null,
  cost: 15,
  requiresApproval: false,
  audience: null,
  stock: null,
  active: true,
  ...over,
})

function renderRow(over: Partial<Reward> = {}, members = [TEDDY, EMMA]) {
  const onEdit = vi.fn()
  const onRemove = vi.fn()
  render(<RewardRow reward={reward(over)} members={members} onEdit={onEdit} onRemove={onRemove} />)
  return { onEdit, onRemove }
}

describe('RewardRow', () => {
  it('shows the cost and no seal for an open reward', () => {
    renderRow()
    expect(screen.getByText('15')).toBeInTheDocument()
    expect(screen.getByText('Anyone can get this')).toBeInTheDocument()
    expect(screen.queryByRole('img', { name: "Needs a parent's OK" })).not.toBeInTheDocument()
  })

  it('wears the "?" seal when it needs approval', () => {
    renderRow({ requiresApproval: true })
    expect(screen.getByRole('img', { name: "Needs a parent's OK" })).toBeInTheDocument()
  })

  it('names the audience instead of "anyone" when scoped', () => {
    renderRow({ audience: ['t'] })
    expect(screen.getByText('just Teddy')).toBeInTheDocument()
    expect(screen.queryByText('Anyone can get this')).not.toBeInTheDocument()
  })

  it('shows a warm count only when stock is limited', () => {
    renderRow({ stock: 2 })
    expect(screen.getByText(/2 left/)).toBeInTheDocument()
  })

  it('routes edit (row tap) and remove to their handlers', () => {
    const { onEdit, onRemove } = renderRow()
    // The whole row activates to edit (the pencil is sm+ only); tapping it edits.
    fireEvent.click(screen.getByRole('button', { name: 'Edit Pick the movie' }))
    expect(onEdit).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByRole('button', { name: /Remove/ }))
    expect(onRemove).toHaveBeenCalledTimes(1)
  })
})
