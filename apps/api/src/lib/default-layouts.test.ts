import { describe, it, expect } from 'vitest'
import { FAMILY_PROFILE_ID } from '@family-os/platform/types'
import { DEFAULT_LAYOUTS, defaultLayoutKey, prominenceFor } from './default-layouts'

describe('default layouts + widget prominence (ADR 039)', () => {
  it('maps the family pseudo-profile to its own layout, and tiers to their buckets', () => {
    expect(defaultLayoutKey(FAMILY_PROFILE_ID, 1)).toBe('default_layout_family')
    expect(defaultLayoutKey('p', 1)).toBe('default_layout_tier_1_2')
    expect(defaultLayoutKey('p', 2)).toBe('default_layout_tier_1_2')
    expect(defaultLayoutKey('p', 3)).toBe('default_layout_tier_3_4')
    expect(defaultLayoutKey('p', 4)).toBe('default_layout_tier_3_4')
  })

  it('gives every default layout exactly one feature', () => {
    for (const [key, items] of Object.entries(DEFAULT_LAYOUTS)) {
      const features = items.filter((i) => i.prominence === 'feature')
      expect(features, key).toHaveLength(1)
    }
  })

  it('features the profile-appropriate widget', () => {
    const feature = (key: string) =>
      DEFAULT_LAYOUTS[key].find((i) => i.prominence === 'feature')?.widgetId
    expect(feature('default_layout_tier_3_4')).toBe('calendar.up-next')
    expect(feature('default_layout_tier_1_2')).toBe('chores.today-summary')
    expect(feature('default_layout_family')).toBe('family-feed.feed')
  })

  it('resolves prominence by (key, widgetId), defaulting to card', () => {
    expect(prominenceFor('default_layout_tier_3_4', 'calendar.up-next')).toBe('feature')
    expect(prominenceFor('default_layout_tier_3_4', 'family-feed.feed')).toBe('quiet')
    expect(prominenceFor('default_layout_tier_3_4', 'chores.today-summary')).toBe('card')
    expect(prominenceFor('default_layout_tier_3_4', 'unknown.widget')).toBe('card')
    expect(prominenceFor('nonexistent_key', 'calendar.up-next')).toBe('card')
  })
})
