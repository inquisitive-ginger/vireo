import { describe, it, expect } from 'vitest'
import { FAMILY_HUE, IDENTITY_HUES, getIdentityHue } from '@family-os/ui'
import { fillForHues, huesForEvent, isFamilyHues, spineColorsForEvent } from './hues'

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
  })

  /* An event with nobody on it belongs to the household — so it resolves to the
     reserved `family` hue rather than an empty array. That is what lets every
     downstream surface (fill, spine, pill) take one path instead of branching on
     "no owner" (ADR 041). */
  it('resolves a no-owner event to the household, never an empty array', () => {
    expect(huesForEvent([], members)).toEqual([FAMILY_HUE])
    expect(huesForEvent(['ghost'], members)).toEqual([FAMILY_HUE])
  })

  it('never assigns the reserved family hue to a person', () => {
    expect(IDENTITY_HUES).not.toContain(FAMILY_HUE)
    for (const name of ['Zoe', 'Teddy', 'Zach', 'Hallie', 'Ada', 'Bo', 'Cy']) {
      expect(getIdentityHue(name)).not.toBe(FAMILY_HUE)
    }
  })
})

describe('isFamilyHues', () => {
  it('is true only for the household', () => {
    expect(isFamilyHues(huesForEvent([], members))).toBe(true)
    expect(isFamilyHues(huesForEvent(['p1'], members))).toBe(false)
    expect(isFamilyHues(huesForEvent(['p1', 'p2'], members))).toBe(false)
  })
})

describe('fillForHues', () => {
  it('the household → the reserved family tint + ink (not the chrome token)', () => {
    expect(fillForHues([FAMILY_HUE])).toEqual({
      background: 'var(--identity-family-tint)',
      color: 'var(--identity-family-ink)',
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
  it('the household → a single family-hue band (not the chrome token)', () => {
    expect(spineColorsForEvent([FAMILY_HUE])).toEqual(['var(--identity-family)'])
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
