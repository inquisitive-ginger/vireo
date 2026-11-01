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
        recurrenceDayOffsets: [0, 1, 4, 5, 6], // Thu, Fri, Mon, Tue, Wed
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
