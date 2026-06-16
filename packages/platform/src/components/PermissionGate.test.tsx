import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PermissionGate } from './PermissionGate'
import { MockAuthProvider } from '../testing'

const p = (tier: 1 | 2 | 3 | 4) => ({ id: `t${tier}`, name: `Tier ${tier}`, tier })

function wrap(tier: 1 | 2 | 3 | 4, ui: React.ReactNode) {
  return render(<MockAuthProvider profile={p(tier)}>{ui}</MockAuthProvider>)
}

describe('PermissionGate', () => {
  it('renders children when ability permits (tier 1 can view platform.Plugin)', () => {
    wrap(
      1,
      <PermissionGate action="view" subject="platform.Plugin">
        plugin content
      </PermissionGate>
    )
    expect(screen.getByText('plugin content')).toBeInTheDocument()
  })

  it('renders nothing when ability denies (tier 1 cannot switch platform.Profile)', () => {
    wrap(
      1,
      <PermissionGate action="switch" subject="platform.Profile">
        switch
      </PermissionGate>
    )
    expect(screen.queryByText('switch')).not.toBeInTheDocument()
  })

  it('renders children when tier 3 can switch platform.Profile', () => {
    wrap(
      3,
      <PermissionGate action="switch" subject="platform.Profile">
        switch
      </PermissionGate>
    )
    expect(screen.getByText('switch')).toBeInTheDocument()
  })

  it('renders fallback when ability denies', () => {
    wrap(
      1,
      <PermissionGate action="switch" subject="platform.Profile" fallback={<span>no access</span>}>
        switch
      </PermissionGate>
    )
    expect(screen.queryByText('switch')).not.toBeInTheDocument()
    expect(screen.getByText('no access')).toBeInTheDocument()
  })
})
