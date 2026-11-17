import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { occurrenceStarts } from './recurrence'

const iso = (ms: number) => new Date(ms).toISOString()
const DAY_MS = 24 * 60 * 60 * 1000

describe('occurrenceStarts across DST (America/Los_Angeles)', () => {
  beforeAll(() => vi.stubEnv('TZ', 'America/Los_Angeles'))
  afterAll(() => vi.unstubAllEnvs())

  it('keeps a weekly 6pm series at 6pm through the 2026-11-01 fall-back', () => {
    const startsAt = new Date('2026-10-26T01:00:00.000Z') // Sun Oct 25, 6pm PDT
    const out = occurrenceStarts(
      { startsAt, recurrence: 'weekly', recurrenceUntil: null },
      startsAt.getTime(),
      startsAt.getTime() + 21 * DAY_MS
    )
    expect(out.map(iso)).toEqual([
      '2026-10-26T01:00:00.000Z',
      '2026-11-02T02:00:00.000Z',
      '2026-11-09T02:00:00.000Z',
    ])
    expect(out.map((ms) => new Date(ms).getHours())).toEqual([18, 18, 18])
  })

  it('keeps a weekly 6pm series at 6pm through the 2026-03-08 spring-forward', () => {
    const startsAt = new Date('2026-03-02T02:00:00.000Z') // Sun Mar 1, 6pm PST
    const out = occurrenceStarts(
      { startsAt, recurrence: 'weekly', recurrenceUntil: null },
      startsAt.getTime(),
      startsAt.getTime() + 14 * DAY_MS
    )
    expect(out.map(iso)).toEqual([
      '2026-03-02T02:00:00.000Z',
      '2026-03-09T01:00:00.000Z',
      '2026-03-16T01:00:00.000Z',
    ])
  })

  it('keeps a weekday 9:30 window at 9:30 through the fall-back', () => {
    const startsAt = new Date('2026-10-29T16:30:00.000Z') // Thu Oct 29, 9:30am PDT
    const out = occurrenceStarts(
      {
        startsAt,
        recurrence: 'daily',
        recurrenceWeekdays: [1, 2, 3, 4, 5],
        recurrenceUntil: new Date('2026-11-04T00:00:00.000Z'),
      },
      startsAt.getTime(),
      startsAt.getTime() + 10 * DAY_MS
    )
    expect(out.map(iso)).toEqual([
      '2026-10-29T16:30:00.000Z',
      '2026-10-30T16:30:00.000Z',
      '2026-11-02T17:30:00.000Z',
      '2026-11-03T17:30:00.000Z',
      '2026-11-04T17:30:00.000Z',
    ])
  })

  it('lands on the post-transition wall clock when the window skips ahead', () => {
    const startsAt = new Date('2026-09-07T01:00:00.000Z') // Sun Sep 6, 6pm PDT
    const from = new Date('2026-11-01T08:00:00.000Z').getTime() // Nov 1, 00:00 PDT
    const out = occurrenceStarts(
      { startsAt, recurrence: 'weekly', recurrenceUntil: null },
      from,
      from + DAY_MS
    )
    expect(out.map(iso)).toEqual(['2026-11-02T02:00:00.000Z'])
  })

  it('keeps a weekly all-day series on local midnight', () => {
    const startsAt = new Date('2026-10-30T07:00:00.000Z') // Fri Oct 30, 00:00 PDT
    const out = occurrenceStarts(
      { startsAt, recurrence: 'weekly', recurrenceUntil: null },
      startsAt.getTime(),
      startsAt.getTime() + 8 * DAY_MS,
      DAY_MS
    )
    expect(out.map(iso)).toEqual(['2026-10-30T07:00:00.000Z', '2026-11-06T08:00:00.000Z'])
  })
  it('keeps a late-afternoon occurrence on its inclusive until date', () => {
    const startsAt = new Date('2026-10-29T23:30:00.000Z') // Thu Oct 29, 4:30pm PDT
    const out = occurrenceStarts(
      { startsAt, recurrence: 'weekly', recurrenceUntil: new Date('2026-11-12T00:00:00.000Z') },
      startsAt.getTime(),
      startsAt.getTime() + 30 * DAY_MS
    )
    expect(out.map(iso)).toEqual([
      '2026-10-29T23:30:00.000Z',
      '2026-11-06T00:30:00.000Z',
      '2026-11-13T00:30:00.000Z',
    ])
  })
})

describe('occurrenceStarts — the one repeat rule (ADR 082)', () => {
  beforeAll(() => vi.stubEnv('TZ', 'America/Los_Angeles'))
  afterAll(() => vi.unstubAllEnvs())

  const local = (y: number, m: number, d: number, h = 19) => new Date(y, m - 1, d, h)
  const days = (out: number[]) =>
    out.map((ms) => {
      const d = new Date(ms)
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:00`
    })
  const yearOf = (startsAt: Date) =>
    [startsAt.getTime(), startsAt.getTime() + 366 * DAY_MS] as const

  it('D-082 monthly on the date repeats on every 17th at the same clock [F-021] #152', () => {
    const startsAt = local(2026, 11, 17)
    const out = occurrenceStarts(
      { startsAt, recurrence: 'monthly', recurrenceUntil: null },
      startsAt.getTime(),
      local(2027, 2, 28).getTime()
    )
    expect(days(out)).toEqual([
      '2026-11-17 19:00',
      '2026-12-17 19:00',
      '2027-1-17 19:00',
      '2027-2-17 19:00',
    ])
  })

  it('D-082 monthly on the 31st skips the months that have no 31st [F-021] #152', () => {
    const startsAt = local(2026, 12, 31)
    const out = occurrenceStarts(
      { startsAt, recurrence: 'monthly', recurrenceUntil: null },
      startsAt.getTime(),
      local(2027, 5, 31, 23).getTime()
    )
    expect(days(out)).toEqual([
      '2026-12-31 19:00',
      '2027-1-31 19:00',
      '2027-3-31 19:00',
      '2027-5-31 19:00',
    ])
  })

  it('D-082 monthly on the 3rd Tuesday follows the weekday, not the date [F-021] #152', () => {
    const startsAt = local(2026, 11, 17) // the 3rd Tuesday of November
    const out = occurrenceStarts(
      { startsAt, recurrence: 'monthly', recurrenceMonthWeek: 3, recurrenceUntil: null },
      startsAt.getTime(),
      local(2027, 3, 31).getTime()
    )
    expect(days(out)).toEqual([
      '2026-11-17 19:00',
      '2026-12-15 19:00',
      '2027-1-19 19:00',
      '2027-2-16 19:00',
      '2027-3-16 19:00',
    ])
  })

  it('D-082 monthly on the last Tuesday lands on the final one of each month [F-021] #152', () => {
    const startsAt = local(2026, 11, 24)
    const out = occurrenceStarts(
      { startsAt, recurrence: 'monthly', recurrenceMonthWeek: -1, recurrenceUntil: null },
      startsAt.getTime(),
      local(2027, 3, 31).getTime()
    )
    expect(days(out)).toEqual([
      '2026-11-24 19:00',
      '2026-12-29 19:00',
      '2027-1-26 19:00',
      '2027-2-23 19:00',
      '2027-3-30 19:00',
    ])
  })

  it('D-082 a monthly series skipped ahead to a later window still lands on its days [F-021]', () => {
    const startsAt = local(2026, 1, 20) // the 3rd Tuesday of January 2026
    const out = occurrenceStarts(
      { startsAt, recurrence: 'monthly', recurrenceMonthWeek: 3, recurrenceUntil: null },
      local(2026, 11, 1, 0).getTime(),
      local(2026, 11, 30, 23).getTime()
    )
    expect(days(out)).toEqual(['2026-11-17 19:00'])
  })

  it('D-082 every other week steps fourteen days [F-021]', () => {
    const startsAt = local(2026, 11, 17)
    const out = occurrenceStarts(
      { startsAt, recurrence: 'weekly', recurrenceInterval: 2, recurrenceUntil: null },
      startsAt.getTime(),
      startsAt.getTime() + 35 * DAY_MS
    )
    expect(days(out)).toEqual(['2026-11-17 19:00', '2026-12-1 19:00', '2026-12-15 19:00'])
  })

  it('D-082 yearly repeats on the same date, and Feb 29 only in leap years [F-021]', () => {
    const birthday = local(2026, 11, 17, 0)
    expect(
      days(
        occurrenceStarts(
          { startsAt: birthday, recurrence: 'yearly', recurrenceUntil: null },
          ...yearOf(birthday)
        )
      )
    ).toEqual(['2026-11-17 0:00', '2027-11-17 0:00'])
    const leap = local(2028, 2, 29, 0)
    const out = occurrenceStarts(
      { startsAt: leap, recurrence: 'yearly', recurrenceUntil: null },
      leap.getTime(),
      local(2032, 3, 1, 0).getTime()
    )
    expect(days(out)).toEqual(['2028-2-29 0:00', '2032-2-29 0:00'])
  })

  it('D-082 a daily series keeps only its local weekdays (Tue · Thu) [F-021] #153', () => {
    const startsAt = local(2026, 11, 3, 15) // Tue
    const out = occurrenceStarts(
      { startsAt, recurrence: 'daily', recurrenceWeekdays: [2, 4], recurrenceUntil: null },
      startsAt.getTime(),
      startsAt.getTime() + 13 * DAY_MS
    )
    expect(days(out)).toEqual([
      '2026-11-3 15:00',
      '2026-11-5 15:00',
      '2026-11-10 15:00',
      '2026-11-12 15:00',
    ])
  })

  it('D-082 a cancelled exception and the inclusive until bound apply to a monthly series [F-021]', () => {
    const startsAt = local(2026, 11, 17)
    const out = occurrenceStarts(
      {
        startsAt,
        recurrence: 'monthly',
        recurrenceUntil: new Date('2027-02-17T00:00:00.000Z'),
        exceptions: [{ occurrenceDate: new Date('2026-12-18T00:00:00.000Z'), kind: 'cancelled' }],
      },
      startsAt.getTime(),
      local(2027, 6, 1).getTime()
    )
    // Dec 17 7pm PST is Dec 18 in UTC — the occurrence key convention.
    expect(days(out)).toEqual(['2026-11-17 19:00', '2027-1-17 19:00', '2027-2-17 19:00'])
  })
})
