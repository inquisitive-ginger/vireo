import { describe, it, expect } from 'vitest'
import { addDays, dayDiff, isSameDay, relativeDayLabel, startOfDay } from './dates'

const at = (y: number, m: number, d: number, h = 12) => new Date(y, m - 1, d, h)

describe('date-only primitives', () => {
  it('startOfDay zeroes the time', () => {
    expect(startOfDay(at(2026, 7, 10, 18)).getTime()).toBe(at(2026, 7, 10, 0).getTime())
  })

  it('addDays crosses month boundaries', () => {
    expect(addDays(at(2026, 7, 30), 3)).toEqual(new Date(2026, 7, 2))
  })

  it('isSameDay ignores time of day', () => {
    expect(isSameDay(at(2026, 7, 10, 1), at(2026, 7, 10, 23))).toBe(true)
    expect(isSameDay(at(2026, 7, 10), at(2026, 7, 11))).toBe(false)
  })

  it('dayDiff counts whole local days, signed', () => {
    expect(dayDiff(at(2026, 7, 10), at(2026, 7, 13))).toBe(3)
    expect(dayDiff(at(2026, 7, 13), at(2026, 7, 10))).toBe(-3)
    expect(dayDiff(at(2026, 7, 10, 1), at(2026, 7, 10, 23))).toBe(0)
  })
})

describe('relativeDayLabel', () => {
  const now = at(2026, 7, 10) // a Friday

  it('names today / tomorrow / yesterday', () => {
    expect(relativeDayLabel(now, now).lead).toBe('Today')
    expect(relativeDayLabel(addDays(now, 1), now).lead).toBe('Tomorrow')
    expect(relativeDayLabel(addDays(now, -1), now).lead).toBe('Yesterday')
  })

  it('forward: weekday within a week, month/day beyond', () => {
    expect(relativeDayLabel(addDays(now, 3), now).lead).toBe(
      addDays(now, 3).toLocaleDateString(undefined, { weekday: 'long' })
    )
    expect(relativeDayLabel(addDays(now, 10), now).lead).toBe(
      addDays(now, 10).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    )
  })

  it('forward: past days beyond yesterday fall to month/day, not a weekday', () => {
    expect(relativeDayLabel(addDays(now, -3), now).lead).toBe(
      addDays(now, -3).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    )
  })

  it('backward: weekday for near-past, long month beyond', () => {
    expect(relativeDayLabel(addDays(now, -3), now, { direction: 'backward' }).lead).toBe(
      addDays(now, -3).toLocaleDateString(undefined, { weekday: 'long' })
    )
    expect(
      relativeDayLabel(addDays(now, -10), now, { direction: 'backward', month: 'long' }).lead
    ).toBe(addDays(now, -10).toLocaleDateString(undefined, { month: 'long', day: 'numeric' }))
  })

  it('distant: weekday keeps the weekday lead and can carry a sub date', () => {
    const far = addDays(now, 14)
    const { lead, sub } = relativeDayLabel(far, now, { distant: 'weekday', sub: true })
    expect(lead).toBe(far.toLocaleDateString(undefined, { weekday: 'long' }))
    expect(sub).toBe(far.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }))
  })

  it('sub rides along with today / tomorrow / weekday leads', () => {
    expect(relativeDayLabel(now, now, { sub: true })).toEqual({
      lead: 'Today',
      sub: now.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    })
  })

  it('handles month boundaries in the month/day form', () => {
    const start = at(2026, 7, 30)
    expect(relativeDayLabel(at(2026, 8, 9), start).lead).toBe(
      at(2026, 8, 9).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    )
  })
})
