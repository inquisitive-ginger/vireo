import { describe, it, expect } from 'vitest'
import { normalizeItemName, lookupDictionaryAisle } from './aisle-dictionary'
import { fileAisle, aisleSortIndex } from './grocery-filing'

describe('normalizeItemName', () => {
  it('lowercases, trims, and collapses whitespace', () => {
    expect(normalizeItemName('  Chicken   Thighs  ')).toBe('chicken thighs')
  })

  it('strips punctuation', () => {
    expect(normalizeItemName("Emma's snap peas!")).toBe('emmas snap peas')
  })

  it('two spellings of the same item normalize equal', () => {
    expect(normalizeItemName('Milk')).toBe(normalizeItemName('milk,'))
  })
})

describe('lookupDictionaryAisle', () => {
  it('matches a direct hit', () => {
    expect(lookupDictionaryAisle(normalizeItemName('milk'))).toBe('Dairy')
  })

  it('matches a dictionary word inside a longer free-text name', () => {
    expect(lookupDictionaryAisle(normalizeItemName('boneless chicken thighs'))).toBe('Meat')
  })

  it('prefers the longer, more specific phrase over a shorter word it contains', () => {
    expect(lookupDictionaryAisle(normalizeItemName('peanut butter'))).toBe('Pantry')
    expect(lookupDictionaryAisle(normalizeItemName('butter'))).toBe('Dairy')
  })

  it('does not match a substring that is not a whole word', () => {
    // "rice" is a dictionary word, but "price" must not fire off it.
    expect(lookupDictionaryAisle(normalizeItemName('price'))).toBeNull()
  })

  it('returns null for an unknown word', () => {
    expect(lookupDictionaryAisle(normalizeItemName('flibbertigibbet'))).toBeNull()
  })
})

describe('fileAisle', () => {
  it('files a known word into its dictionary aisle', () => {
    expect(fileAisle('Milk', null)).toBe('Dairy')
  })

  it('files an unknown word into Other', () => {
    expect(fileAisle('Flibbertigibbet', null)).toBe('Other')
  })

  it('a per-family override always wins over the dictionary', () => {
    expect(fileAisle('Milk', 'Pantry')).toBe('Pantry')
  })

  it('a correction on an unknown word files by the override going forward', () => {
    expect(fileAisle('Snap peas', 'Produce')).toBe('Produce')
  })
})

describe('aisleSortIndex', () => {
  it('orders the fixed walk: Produce → Bakery → Meat → Dairy → Pantry → Frozen → Other', () => {
    const order = ['Produce', 'Bakery', 'Meat', 'Dairy', 'Pantry', 'Frozen', 'Other']
    const shuffled = [...order].sort(() => 0.5 - Math.random())
    expect(shuffled.sort((a, b) => aisleSortIndex(a) - aisleSortIndex(b))).toEqual(order)
  })

  it('sorts an unrecognized category last', () => {
    expect(aisleSortIndex('Bogus')).toBe(aisleSortIndex('Other') + 1)
  })
})
