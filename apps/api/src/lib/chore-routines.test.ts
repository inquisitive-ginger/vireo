import { describe, it, expect } from 'vitest'
import {
  addDaysKey,
  latestScheduledOnOrBefore,
  nextScheduledOnOrAfter,
  weekdayOfKey,
} from './chore-routines'

// 2026-07-30 is a Thursday.
const THU = '2026-07-30'

describe('weekdayOfKey', () => {
  it('resolves the calendar weekday of a date key', () => {
    expect(weekdayOfKey(THU)).toBe(4)
    expect(weekdayOfKey('2026-08-02')).toBe(0) // Sunday
  })
})

describe('addDaysKey', () => {
  it('steps across month and year boundaries', () => {
    expect(addDaysKey('2026-07-31', 1)).toBe('2026-08-01')
    expect(addDaysKey('2026-01-01', -1)).toBe('2025-12-31')
  })
})

describe('latestScheduledOnOrBefore', () => {
  it('returns today when today is scheduled', () => {
    expect(latestScheduledOnOrBefore(THU, [1, 4])).toBe(THU)
  })
  it('walks back to the most recent scheduled day', () => {
    // Mon & Thu, asked on Wednesday → the Monday before.
    expect(latestScheduledOnOrBefore('2026-07-29', [1, 4])).toBe('2026-07-27')
  })
  it('is null for an empty set', () => {
    expect(latestScheduledOnOrBefore(THU, [])).toBeNull()
  })
})

describe('nextScheduledOnOrAfter', () => {
  it('returns today when today is scheduled', () => {
    expect(nextScheduledOnOrAfter(THU, [4])).toBe(THU)
  })
  it('walks forward across the week wrap', () => {
    // Mon only, asked on Thursday → next Monday.
    expect(nextScheduledOnOrAfter(THU, [1])).toBe('2026-08-03')
  })
  it('is null for an empty set', () => {
    expect(nextScheduledOnOrAfter(THU, [])).toBeNull()
  })
})
