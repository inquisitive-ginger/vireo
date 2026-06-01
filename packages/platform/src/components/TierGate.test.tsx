import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TierGate } from './TierGate'
import { MockAuthProvider } from '../testing'

const p = (tier: 1 | 2 | 3 | 4) => ({ id: `t${tier}`, name: `Tier ${tier}`, tier })

function wrap(tier: 1 | 2 | 3 | 4, ui: React.ReactNode) {
  return render(<MockAuthProvider profile={p(tier)}>{ui}</MockAuthProvider>)
}

describe('TierGate', () => {
  it('renders children when profile tier meets minimum', () => {
    wrap(3, <TierGate min={3}>secret</TierGate>)
    expect(screen.getByText('secret')).toBeInTheDocument()
  })

  it('renders children when profile tier exceeds minimum', () => {
    wrap(4, <TierGate min={2}>admin panel</TierGate>)
    expect(screen.getByText('admin panel')).toBeInTheDocument()
  })

  it('renders nothing when profile tier is below minimum', () => {
    wrap(1, <TierGate min={4}>hidden</TierGate>)
    expect(screen.queryByText('hidden')).not.toBeInTheDocument()
  })

  it('renders fallback when tier is below minimum', () => {
    wrap(1, <TierGate min={4} fallback={<span>locked</span>}>hidden</TierGate>)
    expect(screen.queryByText('hidden')).not.toBeInTheDocument()
    expect(screen.getByText('locked')).toBeInTheDocument()
  })
})
