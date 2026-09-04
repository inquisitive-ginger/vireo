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

  it('tier 1: cannot create family-feed.Post', () => {
    const ability = createAbility(profile(1), [])
    expect(ability.can('create', 'family-feed.Post')).toBe(false)
  })

  it('tier 2: can create family-feed.Post', () => {
    const ability = createAbility(profile(2), [])
    expect(ability.can('create', 'family-feed.Post')).toBe(true)
  })

  it('tier 3: can create family-feed.Post', () => {
    const ability = createAbility(profile(3), [])
    expect(ability.can('create', 'family-feed.Post')).toBe(true)
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

  // The shopping key set (ADR 071). The tier boundary is the whole decision, so
  // it is asserted per tier rather than inferred from one branch.
  it('tier 1: sees and adds to a shopping list, but cannot check anything off', () => {
    const ability = createAbility(profile(1), [])
    expect(ability.can('view', 'shopping.Item')).toBe(true)
    expect(ability.can('create', 'shopping.Item')).toBe(true)
    // A four-year-old at the wall must not be able to clear a trip.
    expect(ability.can('check', 'shopping.Item')).toBe(false)
  })

  it('tiers 2 and 3: can check off — the partner shopper is the one holding the cart', () => {
    for (const tier of [2, 3] as const) {
      const ability = createAbility(profile(tier), [])
      expect(ability.can('check', 'shopping.Item')).toBe(true)
      expect(ability.can('view', 'shopping.Item')).toBe(true)
      expect(ability.can('create', 'shopping.Item')).toBe(true)
    }
  })

  it('below tier 4: cannot file, manage, or create a list — those are the tier-4 three', () => {
    for (const tier of [1, 2, 3] as const) {
      const ability = createAbility(profile(tier), [])
      expect(ability.can('file', 'shopping.Item')).toBe(false)
      expect(ability.can('manage', 'shopping.Item')).toBe(false)
      expect(ability.can('create', 'shopping.List')).toBe(false)
    }
  })

  it('tier 4: reaches all six via `manage all`', () => {
    const ability = createAbility(profile(4), [])
    expect(ability.can('file', 'shopping.Item')).toBe(true)
    expect(ability.can('manage', 'shopping.Item')).toBe(true)
    expect(ability.can('check', 'shopping.Item')).toBe(true)
    expect(ability.can('create', 'shopping.List')).toBe(true)
  })

  it('a grant hands a tier-3 profile the aisle correction WITHOUT delete and rename (ADR 071 §3)', () => {
    const grant: PermissionOverride = {
      id: 'grant-file',
      profileId: 'test-3',
      action: 'file',
      subject: 'shopping.Item',
      type: 'grant',
    }
    const ability = createAbility(profile(3), [grant])
    expect(ability.can('file', 'shopping.Item')).toBe(true)
    expect(ability.can('manage', 'shopping.Item')).toBe(false)
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
