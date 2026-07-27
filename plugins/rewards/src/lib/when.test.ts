import { describe, it, expect } from 'vitest'
import { askedLabel, boughtLabel, enjoyedSince } from './when'

// Saturday 2026-07-25, mid-afternoon.
const now = new Date('2026-07-25T15:00:00')

describe('boughtLabel', () => {
  it('names the day in kid grammar', () => {
    expect(boughtLabel('2026-07-25T09:00:00', now)).toBe('Bought today')
    expect(boughtLabel('2026-07-24T22:00:00', now)).toBe('Bought yesterday')
    expect(boughtLabel('2026-07-21T09:00:00', now)).toBe('Bought Tuesday')
  })

  it('falls back to a date past a week', () => {
    expect(boughtLabel('2026-07-04T09:00:00', now)).toMatch(/^Bought Jul 4/)
  })
})

describe('askedLabel', () => {
  it('speaks in minutes, then hours, then days', () => {
    expect(askedLabel('2026-07-25T14:59:40', now)).toBe('Asked just now')
    expect(askedLabel('2026-07-25T14:35:00', now)).toBe('Asked 25 min ago')
    expect(askedLabel('2026-07-25T13:00:00', now)).toBe('Asked 2 hours ago')
    expect(askedLabel('2026-07-23T15:00:00', now)).toBe('Asked Thursday')
  })
})

describe('enjoyedSince', () => {
  it('summarizes the shelf from the first tear', () => {
    expect(enjoyedSince(4, '2026-07-02T00:00:00', now)).toBe('4 rewards enjoyed since July')
    expect(enjoyedSince(1, '2026-07-02T00:00:00', now)).toBe('1 reward enjoyed since July')
  })

  it('adds the year once it stops being this one', () => {
    expect(enjoyedSince(9, '2025-11-02T00:00:00', now)).toBe(
      '9 rewards enjoyed since November 2025'
    )
  })
})
