import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { doneLabel } from './dates'

describe('doneLabel', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-08-05T20:00:00'))
  })
  afterEach(() => vi.useRealTimers())

  it('is null without a completedAt', () => {
    expect(doneLabel(null)).toBeNull()
  })

  it('gives the time of day for today', () => {
    expect(doneLabel('2026-08-05T09:07:00')).toMatch(/9:07/)
  })

  it('says yesterday, lowercased to follow "Done"', () => {
    expect(doneLabel('2026-08-04T21:30:00')).toBe('yesterday')
  })

  it('names the weekday inside a week', () => {
    expect(doneLabel('2026-08-01T10:00:00')).toBe('Saturday')
  })

  it('falls to month-day beyond a week', () => {
    expect(doneLabel('2026-07-20T10:00:00')).toBe('Jul 20')
  })
})
