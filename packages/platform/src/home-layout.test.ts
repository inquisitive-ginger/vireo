import { describe, it, expect } from 'vitest'
import { FAMILY_PROFILE_ID } from './types'
import { DEFAULT_LAYOUTS, defaultLayoutKey, prominenceFor } from './home-layout'

describe('default layouts + widget prominence (ADR 039)', () => {
  it('maps the family pseudo-profile onto the tier-4 layout, and tiers to their buckets', () => {
    expect(defaultLayoutKey(FAMILY_PROFILE_ID, 1)).toBe('default_layout_tier_3_4')
    expect(defaultLayoutKey('p', 1)).toBe('default_layout_tier_1_2')
    expect(defaultLayoutKey('p', 2)).toBe('default_layout_tier_1_2')
    expect(defaultLayoutKey('p', 3)).toBe('default_layout_tier_3')
    expect(defaultLayoutKey('p', 4)).toBe('default_layout_tier_3_4')
  })

  /* The kid surfaces rank wallet > chores > calendar = meals. A teen gets the same
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
    // Parents (and the family profile) triage — no single widget is "the one they
    // came for", so no feature.
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
    expect(prominenceFor('default_layout_tier_3_4', 'shopping.capture')).toBe('quiet')
    expect(prominenceFor('default_layout_tier_3_4', 'chores.today-summary')).toBe('card')
    expect(prominenceFor('default_layout_tier_3_4', 'unknown.widget')).toBe('card')
    expect(prominenceFor('nonexistent_key', 'calendar.up-next')).toBe('card')
  })

  /* D3 — shopping's 2×2 DISPLACES the feed rather than extending the column.
     Added on top it grew every grid by two rows and made the desktop dashboard
     scroll; the feed yields its cell because its page is a scroll of the same
     rows the tile shows, so a nav tap loses nothing. The Feed route is untouched
     — this is a dashboard composition, not a removal. */
  it('gives shopping a 2×2 in the right column, on every default layout', () => {
    for (const [key, items] of Object.entries(DEFAULT_LAYOUTS)) {
      const shopping = items.find((i) => i.widgetId === 'shopping.capture')
      expect(shopping, key).toMatchObject({ x: 2, w: 2, h: 2, prominence: 'quiet' })
    }
  })

  it('has taken the feed off all three, and paid for shopping with its cell', () => {
    for (const [key, items] of Object.entries(DEFAULT_LAYOUTS)) {
      expect(
        items.some((i) => i.widgetId === 'family-feed.feed'),
        key
      ).toBe(false)
    }
  })

  /* The cost, stated as an assertion so the next composition change has to look
     at it: shopping's h=2 grows the right column by one row over the pre-M5.5
     grid, not two. `ListRow`'s 56px floor is not overridable (ADR 068), so a 2×1
     shopping tile fits the field and no whole row at all. */
  it('grows the right column by one row, not two', () => {
    const columnHeight = (key: string) =>
      Math.max(...DEFAULT_LAYOUTS[key].filter((i) => i.x === 2).map((i) => i.y + i.h))
    expect(columnHeight('default_layout_tier_1_2')).toBe(4)
    expect(columnHeight('default_layout_tier_3')).toBe(4)
    expect(columnHeight('default_layout_tier_3_4')).toBe(5)
  })
})
