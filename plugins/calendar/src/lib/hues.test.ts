import { describe, it, expect } from 'vitest'
import { getIdentityHue } from '@family-os/ui'
import { fillForHues, huesForEvent, spineColorsForEvent } from './hues'

const members = new Map([
  ['p1', 'Zoe'],
  ['p2', 'Teddy'],
])

describe('huesForEvent', () => {
  it('maps attendee ids to identity hues, dropping unknown ids', () => {
    expect(huesForEvent(['p1', 'p2'], members)).toEqual([
      getIdentityHue('Zoe'),
      getIdentityHue('Teddy'),
    ])
    expect(huesForEvent(['ghost'], members)).toEqual([])
    expect(huesForEvent([], members)).toEqual([])
  })
})

describe('fillForHues', () => {
  it('Family (no hue) → neutral secondary fill', () => {
    expect(fillForHues([])).toEqual({
      background: 'var(--secondary)',
      color: 'var(--secondary-foreground)',
    })
  })
  it('solo → the owner identity tint fill + ink', () => {
    expect(fillForHues(['teal'])).toEqual({
      background: 'var(--identity-teal-tint)',
      color: 'var(--identity-teal-ink)',
    })
  })
  it('shared (2+) → a hard-stop split gradient', () => {
    const { background } = fillForHues(['teal', 'plum'])
    expect(background).toContain('linear-gradient(90deg')
    expect(background).toContain('var(--identity-teal-tint) 0% 50%')
    expect(background).toContain('var(--identity-plum-tint) 50% 100%')
  })
})

describe('spineColorsForEvent', () => {
  it('Family (no hue) → a single neutral secondary band', () => {
    expect(spineColorsForEvent([])).toEqual(['var(--secondary)'])
  })
  it('solo → a single base identity hue (the full-strength spine layer)', () => {
    expect(spineColorsForEvent(['teal'])).toEqual(['var(--identity-teal)'])
  })
  it('shared → one base identity hue per attendee, in order (Spine splits them)', () => {
    expect(spineColorsForEvent(['teal', 'plum'])).toEqual([
      'var(--identity-teal)',
      'var(--identity-plum)',
    ])
  })
})
