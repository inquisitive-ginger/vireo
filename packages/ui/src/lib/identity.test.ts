import { describe, it, expect } from 'vitest'
import {
  FAMILY_HUE,
  IDENTITY_HUES,
  getIdentityHue,
  identityToken,
  isIdentityHue,
  nextFreeHue,
  resolveHue,
} from './identity'

describe('the palette (ADR 044)', () => {
  it('has eight assignable hues — the size of the palette is the cap on household size', () => {
    expect(IDENTITY_HUES).toHaveLength(8)
  })

  it('never offers the household hue to a person — Hearth is reserved (ADR 041)', () => {
    expect(IDENTITY_HUES).not.toContain(FAMILY_HUE)
    expect(nextFreeHue(IDENTITY_HUES)).toBeNull()
    // ...even when every member hue is taken, the family's is not a fallback.
    expect(nextFreeHue(IDENTITY_HUES)).not.toBe(FAMILY_HUE)
  })
})

describe('resolveHue — assigned wins, hash is only a fallback', () => {
  it('uses the assigned hue', () => {
    expect(resolveHue('Zach', 'plum')).toBe('plum')
  })

  it('falls back to the name hash when a profile has none yet', () => {
    expect(resolveHue('Zach', null)).toBe(getIdentityHue('Zach'))
    expect(resolveHue('Zach', undefined)).toBe(getIdentityHue('Zach'))
  })

  it('ignores a hue that is not in the palette rather than painting with it', () => {
    expect(resolveHue('Zach', 'neon-green')).toBe(getIdentityHue('Zach'))
    expect(resolveHue('Zach', FAMILY_HUE)).toBe(getIdentityHue('Zach'))
  })

  it('is stable across a rename ONLY when a hue is assigned — the bug ADR 044 closes', () => {
    // Assigned: the colour belongs to the person, so renaming them does not repaint them.
    expect(resolveHue('Teddy', 'plum')).toBe(resolveHue('Ted', 'plum'))
    // Unassigned: the hash moves with the name. "Teddy" is terracotta and "Ted" is
    // sage, so shortening a nickname silently re-coloured someone everywhere.
    expect(getIdentityHue('Teddy')).not.toBe(getIdentityHue('Ted'))
  })

  it('still collides between two DIFFERENT people when hashing — growing the palette never fixed this', () => {
    // The original bug: "Zach" and "Emma" hashed to one hue. They still do at eight —
    // more buckets makes a collision rarer, never impossible. Only ASSIGNING the hue
    // makes "colour = person" true, which is the whole of ADR 044.
    expect(getIdentityHue('Zach')).toBe(getIdentityHue('Emma'))
    expect(resolveHue('Zach', 'terracotta')).not.toBe(resolveHue('Emma', 'plum'))
  })
})

describe('nextFreeHue — the auto-assignment rule', () => {
  it('walks the palette in order', () => {
    expect(nextFreeHue([])).toBe(IDENTITY_HUES[0])
    expect(nextFreeHue([IDENTITY_HUES[0]])).toBe(IDENTITY_HUES[1])
  })

  it('returns null on a full palette rather than doubling a colour', () => {
    // A duplicate hue does not degrade "colour = person" — it points it at two people
    // at once. Callers must SAY the palette is full.
    expect(nextFreeHue(IDENTITY_HUES)).toBeNull()
  })

  it('skips holes, so freeing a colour makes it available again', () => {
    const taken = IDENTITY_HUES.filter((h) => h !== 'teal')
    expect(nextFreeHue(taken)).toBe('teal')
  })

  it('ignores nulls — an unassigned profile consumes nothing', () => {
    expect(nextFreeHue([null, undefined, IDENTITY_HUES[0]])).toBe(IDENTITY_HUES[1])
  })
})

describe('isIdentityHue', () => {
  it.each([...IDENTITY_HUES])('accepts %s', (hue) => {
    expect(isIdentityHue(hue)).toBe(true)
  })

  it.each([FAMILY_HUE, 'neon-green', '', null, undefined, 3])('rejects %s', (value) => {
    expect(isIdentityHue(value)).toBe(false)
  })
})

describe('identityToken', () => {
  it('resolves each layer', () => {
    expect(identityToken('moss')).toBe('var(--identity-moss)')
    expect(identityToken('moss', 'tint')).toBe('var(--identity-moss-tint)')
    expect(identityToken('indigo', 'ink')).toBe('var(--identity-indigo-ink)')
  })

  it('resolves the household down the same path a member does (ADR 041)', () => {
    expect(identityToken(FAMILY_HUE, 'tint')).toBe('var(--identity-family-tint)')
  })
})
