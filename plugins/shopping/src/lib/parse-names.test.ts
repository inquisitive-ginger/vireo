import { describe, it, expect } from 'vitest'
import { MAX_NAMES, parseNames } from './parse-names'

describe('parseNames', () => {
  it('splits a comma list into names, in submitted order', () => {
    expect(parseNames('milk, cereal, chicken thighs')).toEqual(['milk', 'cereal', 'chicken thighs'])
  })

  /* The common case must not be reshaped by the feature: one word is one name,
     and its caller sends it down the single-add route. */
  it('gives one name back for a word with no comma', () => {
    expect(parseNames('tortillas')).toEqual(['tortillas'])
  })

  /* A trailing comma is what a person types when they are still thinking, and a
     double comma is a fumble. Neither should cost them a row or an error. */
  it('drops empties, so a trailing comma and a double comma are both harmless', () => {
    expect(parseNames('milk,')).toEqual(['milk'])
    expect(parseNames('milk,,eggs')).toEqual(['milk', 'eggs'])
    expect(parseNames('milk, , eggs')).toEqual(['milk', 'eggs'])
  })

  it('is empty for a string that is only separators and space', () => {
    expect(parseNames(' , , ')).toEqual([])
  })

  it('collapses internal whitespace without touching the words', () => {
    expect(parseNames('chicken    thighs,   oat  milk ')).toEqual(['chicken thighs', 'oat milk'])
  })

  /* Case is theirs. `normalizeItemName` is the server's business, and a client
     that "tidies" the word puts a spelling on the list nobody typed. */
  it('preserves case', () => {
    expect(parseNames('Milk, GREEK yogurt')).toEqual(['Milk', 'GREEK yogurt'])
  })

  /* NOT deduplicated: two rows, and the server reports the second as a collision
     — the same answer typing it twice would give. A client-side dedupe would be
     an opinion the surface then has to explain. */
  it('does not deduplicate — `milk, milk` is two names', () => {
    expect(parseNames('milk, milk')).toEqual(['milk', 'milk'])
    expect(parseNames('milk, Milk')).toEqual(['milk', 'Milk'])
  })

  it('counts past the ceiling rather than silently truncating', () => {
    const many = Array.from({ length: MAX_NAMES + 1 }, (_, i) => `thing ${i}`).join(', ')
    expect(parseNames(many)).toHaveLength(MAX_NAMES + 1)
  })
})
