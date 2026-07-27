import { describe, it, expect } from 'vitest'
import { FAMILY_PROFILE_ID } from './types'
import { DEFAULT_LAYOUTS, defaultLayoutKey, prominenceFor } from './home-layout'

describe('default layouts + widget prominence (ADR 039)', () => {
  it('maps the family pseudo-profile to its own layout, and tiers to their buckets', () => {
    expect(defaultLayoutKey(FAMILY_PROFILE_ID, 1)).toBe('default_layout_family')
    expect(defaultLayoutKey('p', 1)).toBe('default_layout_tier_1_2')
    expect(defaultLayoutKey('p', 2)).toBe('default_layout_tier_1_2')
    expect(defaultLayoutKey('p', 3)).toBe('default_layout_tier_3')
    expect(defaultLayoutKey('p', 4)).toBe('default_layout_tier_3_4')
  })

  /* The kid surfaces rank wallet > chores > feed = calendar. A teen gets the same
     order without a feature (their surface declines to shout, like the parent's);
     the parent layout stays wallet-free. */
  it('leads both kid surfaces with the wallet, and gives a parent none', () => {
    const teen = DEFAULT_LAYOUTS['default_layout_tier_3']
    expect(teen.find((i) => i.widgetId === 'rewards.wallet')).toMatchObject({
      x: 0,
      y: 0,
      prominence: 'card',
    })
    expect(teen.filter((i) => i.prominence === 'feature')).toHaveLength(0)
    expect(
      DEFAULT_LAYOUTS['default_layout_tier_3_4'].some((i) => i.widgetId === 'rewards.wallet')
    ).toBe(false)
  })

  /* AT MOST one — never two. The rung means "this is what you came for", and two of
     them is the same as none (ADR 039, amended 2026-07-11). */
  it('never gives a layout more than one feature', () => {
    for (const [key, items] of Object.entries(DEFAULT_LAYOUTS)) {
      const features = items.filter((i) => i.prominence === 'feature')
      expect(features.length, key).toBeLessThanOrEqual(1)
    }
  })

  it('features the profile-appropriate widget, where a surface has one at all', () => {
    const feature = (key: string) =>
      DEFAULT_LAYOUTS[key].find((i) => i.prominence === 'feature')?.widgetId
    expect(feature('default_layout_tier_1_2')).toBe('rewards.wallet')
    expect(feature('default_layout_family')).toBe('family-feed.feed')
    // Parents triage — no single widget is "the one they came for", so no feature.
    expect(feature('default_layout_tier_3_4')).toBeUndefined()
  })

  /* The bug this guards: the seed kept a second copy of the composition, and when the
     right column was re-ranked (chores above feed) only one copy was updated. The API
     derives prominence from code but took geometry from the DB, so it served the NEW
     rungs on the OLD positions — a `quiet` widget sitting above a `card` one. Elevation
     and reading order both say "how much does this matter"; they must not disagree. */
  it('never stacks a lower rung above a higher one in the same column', () => {
    const RANK: Record<string, number> = { feature: 0, card: 1, quiet: 2 }
    for (const [key, items] of Object.entries(DEFAULT_LAYOUTS)) {
      for (const a of items) {
        for (const b of items) {
          if (a === b || a.x !== b.x) continue // same column only
          if (a.y < b.y) {
            expect(
              RANK[a.prominence] <= RANK[b.prominence],
              `${key}: ${a.widgetId} (${a.prominence}) sits above ${b.widgetId} (${b.prominence})`
            ).toBe(true)
          }
        }
      }
    }
  })

  it('resolves prominence by (key, widgetId), defaulting to card', () => {
    expect(prominenceFor('default_layout_tier_1_2', 'rewards.wallet')).toBe('feature')
    expect(prominenceFor('default_layout_tier_3_4', 'calendar.up-next')).toBe('card')
    expect(prominenceFor('default_layout_tier_3_4', 'family-feed.feed')).toBe('quiet')
    expect(prominenceFor('default_layout_tier_3_4', 'chores.today-summary')).toBe('card')
    expect(prominenceFor('default_layout_tier_3_4', 'unknown.widget')).toBe('card')
    expect(prominenceFor('nonexistent_key', 'calendar.up-next')).toBe('card')
  })
})
