import { describe, it, expect } from 'vitest'
import { FAMILY_HUE, IDENTITY_HUES, getIdentityHue } from '@family-os/ui'
import {
  fillForHues,
  huesForEvent,
  initialsForEvent,
  isFamilyHues,
  spineColorsForEvent,
} from './hues'

const members = new Map([
  ['p1', { name: 'Zoe' }],
  ['p2', { name: 'Teddy' }],
])

describe('huesForEvent', () => {
  it('maps attendee ids to identity hues, dropping unknown ids', () => {
    expect(huesForEvent(['p1', 'p2'], members)).toEqual([
      getIdentityHue('Zoe'),
      getIdentityHue('Teddy'),
    ])
  })

  it('prefers a member’s ASSIGNED hue over the name hash (ADR 044)', () => {
    const assigned = new Map([
      ['p1', { name: 'Zoe', identityHue: 'indigo' }],
      ['p2', { name: 'Teddy', identityHue: 'moss' }],
    ])
    expect(huesForEvent(['p1', 'p2'], assigned)).toEqual(['indigo', 'moss'])
  })

  it('keeps two same-hashing members apart once their hues are assigned', () => {
    // "Zach" and "Emma" hash to one bucket — on a shared calendar that made their
    // chips the same colour, which is the one thing "colour = person" cannot survive.
    expect(getIdentityHue('Zach')).toBe(getIdentityHue('Emma'))
    const family = new Map([
      ['z', { name: 'Zach', identityHue: 'terracotta' }],
      ['e', { name: 'Emma', identityHue: 'plum' }],
    ])
    expect(huesForEvent(['z'], family)).not.toEqual(huesForEvent(['e'], family))
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

/* The SECOND CHANNEL (ADR 044). A month chip used to be a coloured pill and nothing
   else, which made the hue the only thing telling two people apart — and eight nameable
   hues do not survive red-green colour-blindness. */
describe('initialsForEvent', () => {
  it('carries the owner’s initial for a solo event', () => {
    expect(initialsForEvent(['p1'], members)).toBe('Z')
  })

  it('carries one initial per attendee for a shared event', () => {
    expect(initialsForEvent(['p1', 'p2'], members)).toBe('ZT')
  })

  it('returns null for the household — Hearth is not a person and has no initial', () => {
    expect(initialsForEvent([], members)).toBeNull()
    expect(initialsForEvent(['ghost'], members)).toBeNull()
  })

  it('caps the initials so a chip stays a chip', () => {
    const crowd = new Map([
      ['a', { name: 'Ada' }],
      ['b', { name: 'Bo' }],
      ['c', { name: 'Cy' }],
      ['d', { name: 'Dee' }],
    ])
    expect(initialsForEvent(['a', 'b', 'c', 'd'], crowd)).toBe('ABC')
  })

  it('handles a non-ASCII first letter', () => {
    expect(initialsForEvent(['x'], new Map([['x', { name: 'Ører' }]]))).toBe('Ø')
  })
})
