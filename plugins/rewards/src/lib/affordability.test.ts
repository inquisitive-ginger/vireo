import { describe, it, expect } from 'vitest'
import { storeShelves, walletReach, redeemMode, gapFor } from './affordability'
import type { Reward } from '../types'

const r = (over: Partial<Reward> & Pick<Reward, 'id' | 'cost'>): Reward => ({
  name: `R${over.cost}`,
  emoji: '🎁',
  description: null,
  requiresApproval: false,
  audience: null,
  stock: null,
  active: true,
  ...over,
})

const catalog = [r({ id: 'a', cost: 5 }), r({ id: 'b', cost: 15 }), r({ id: 'c', cost: 40 })]

describe('storeShelves', () => {
  it('buckets by distance and sorts cheapest-first', () => {
    const { afford, almost, big } = storeShelves(catalog, 12)
    expect(afford.map((x) => x.id)).toEqual(['a']) // 5 ≤ 12
    expect(almost.map((x) => x.id)).toEqual(['b']) // 15, 3 away (≤10)
    expect(big.map((x) => x.id)).toEqual(['c']) // 40, 28 away
  })

  it('moves a reward up a shelf as the balance grows — the boundary is exactly the cost', () => {
    expect(storeShelves(catalog, 14).afford.map((x) => x.id)).toEqual(['a'])
    expect(storeShelves(catalog, 15).afford.map((x) => x.id)).toEqual(['a', 'b'])
  })
})

describe('walletReach', () => {
  it('returns everything affordable and the single nearest next goal', () => {
    const { affordable, nextUp } = walletReach(catalog, 12)
    expect(affordable.map((x) => x.id)).toEqual(['a'])
    expect(nextUp?.id).toBe('b') // the cheapest still out of reach
  })

  it('has no nextUp once everything is affordable', () => {
    expect(walletReach(catalog, 100).nextUp).toBeUndefined()
  })
})

describe('redeemMode', () => {
  it('nudges when unaffordable, even for an approval reward', () => {
    expect(redeemMode(r({ id: 'x', cost: 40, requiresApproval: true }), 10)).toBe('nudge')
  })
  it('asks when affordable AND approval-gated', () => {
    expect(redeemMode(r({ id: 'x', cost: 10, requiresApproval: true }), 10)).toBe('ask')
  })
  it('spends when affordable and no approval', () => {
    expect(redeemMode(r({ id: 'x', cost: 10 }), 12)).toBe('spend')
  })
})

describe('gapFor', () => {
  it('never goes negative (an affordable reward has a gap of 0)', () => {
    expect(gapFor(r({ id: 'x', cost: 5 }), 12)).toBe(0)
    expect(gapFor(r({ id: 'x', cost: 15 }), 12)).toBe(3)
  })
})
