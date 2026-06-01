import { describe, it, expect } from 'vitest'
import { createAbility } from './ability'
import type { Profile, PermissionOverride } from './types'

const profile = (tier: 1 | 2 | 3 | 4): Profile => ({
  id: `test-${tier}`,
  name: `Tier ${tier}`,
  tier,
})

describe('createAbility — tier baselines', () => {
  it('tier 1: can view platform.Plugin', () => {
    const ability = createAbility(profile(1), [])
    expect(ability.can('view', 'platform.Plugin')).toBe(true)
  })

  it('tier 1: cannot switch platform.Profile', () => {
    const ability = createAbility(profile(1), [])
    expect(ability.can('switch', 'platform.Profile')).toBe(false)
  })

  it('tier 2: can view platform.Plugin', () => {
    const ability = createAbility(profile(2), [])
    expect(ability.can('view', 'platform.Plugin')).toBe(true)
  })

  it('tier 2: cannot switch platform.Profile', () => {
    const ability = createAbility(profile(2), [])
    expect(ability.can('switch', 'platform.Profile')).toBe(false)
  })

  it('tier 3: can view platform.Plugin and switch platform.Profile', () => {
    const ability = createAbility(profile(3), [])
    expect(ability.can('view', 'platform.Plugin')).toBe(true)
    expect(ability.can('switch', 'platform.Profile')).toBe(true)
  })

  it('tier 4: can manage all', () => {
    const ability = createAbility(profile(4), [])
    expect(ability.can('manage', 'all')).toBe(true)
    expect(ability.can('view', 'platform.Plugin')).toBe(true)
    expect(ability.can('switch', 'platform.Profile')).toBe(true)
  })
})

describe('createAbility — permission overrides', () => {
  it('grant elevates a tier-1 profile to switch profiles', () => {
    const override: PermissionOverride = {
      id: 'o1',
      profileId: 'test-1',
      action: 'switch',
      subject: 'platform.Profile',
      type: 'grant',
    }
    const ability = createAbility(profile(1), [override])
    expect(ability.can('switch', 'platform.Profile')).toBe(true)
  })

  it('revocation removes view from a tier-3 profile', () => {
    const override: PermissionOverride = {
      id: 'o2',
      profileId: 'test-3',
      action: 'view',
      subject: 'platform.Plugin',
      type: 'revocation',
    }
    const ability = createAbility(profile(3), [override])
    expect(ability.can('view', 'platform.Plugin')).toBe(false)
  })
})
