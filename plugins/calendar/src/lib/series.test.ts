import { describe, expect, it } from 'vitest'
import type { CalendarEvent } from '../types'
import {
  choiceForEvent,
  conditionSeriesReps,
  daySetLabel,
  isConditionSeries,
  nextDates,
  repeatChoices,
  repeatRuleLabel,
  ruleForChoice,
} from './series'

describe('daySetLabel', () => {
  it('names the common sets and lists the rest', () => {
    expect(daySetLabel([0, 1, 2, 3, 4, 5, 6])).toBe('Every day')
    expect(daySetLabel([1, 2, 3, 4, 5])).toBe('Weekdays')
    expect(daySetLabel([0, 6])).toBe('Weekends')
    expect(daySetLabel([1, 3, 5])).toBe('Mon · Wed · Fri')
  })
})

function occ(seriesId: string, startsAt: string, weekdays = [1, 2, 3, 4, 5]): CalendarEvent {
  const date = startsAt.slice(0, 10)
  return {
    id: `${seriesId}:${date}`,
    seriesId,
    occurrenceDate: date,
    isOccurrence: true,
    title: seriesId,
    description: null,
    attendeeIds: [],
    ownerId: null,
    createdBy: 'x',
    startsAt,
    seriesStartsAt: startsAt,
    endsAt: null,
    allDay: false,
    location: null,
    recurrence: 'daily',
    recurrenceInterval: 1,
    recurrenceWeekdays: weekdays,
    recurrenceMonthWeek: null,
    recurrenceUntil: null,
    isActivity: false,
    status: 'confirmed',
    source: 'manual',
    reminderMinutes: null,
    createdAt: '',
    updatedAt: '',
  }
}

describe('conditionSeriesReps', () => {
  it('keeps one earliest occurrence per series, series-sorted', () => {
    const reps = conditionSeriesReps([
      occ('b', '2026-07-08T09:30:00'),
      occ('a', '2026-07-07T09:30:00'),
      occ('a', '2026-07-06T09:30:00'),
      occ('b', '2026-07-09T09:30:00'),
    ])
    expect(reps.map((r) => r.id)).toEqual(['a:2026-07-06', 'b:2026-07-08'])
  })
})

describe('what counts as a condition series (D-083)', () => {
  it('D-083 a series meeting 4+ days a week is a condition; 1–3 days is appointments [F-023] #153', () => {
    expect(isConditionSeries(occ('swim', '2026-11-16T17:00:00'))).toBe(true)
    expect(isConditionSeries(occ('four', '2026-11-16T17:00:00', [1, 2, 3, 4]))).toBe(true)
    expect(isConditionSeries(occ('french', '2026-11-17T15:30:00', [2, 4]))).toBe(false)
    expect(isConditionSeries(occ('three', '2026-11-16T15:30:00', [1, 3, 5]))).toBe(false)
    expect(conditionSeriesReps([occ('french', '2026-11-17T15:30:00', [2, 4])])).toEqual([])
  })
})

describe('the Repeats list (D-082)', () => {
  const TUE_17 = new Date(2026, 10, 17)

  it('D-082 offers every week, every other week, both monthlies and yearly, worded from the date [F-021] #152', () => {
    expect(repeatChoices(TUE_17).map((c) => c.label)).toEqual([
      'Doesn’t repeat',
      'Every week on Tuesday',
      'Every other week on Tuesday',
      'Every month on the 17th',
      'Every month on the 3rd Tuesday',
      'Every year on Nov 17',
    ])
  })

  it('D-082 a date in the last week of its month also offers "last"; a 5th weekday offers only "last" [F-021]', () => {
    const fourthAndLast = repeatChoices(new Date(2026, 10, 24)).map((c) => c.label)
    expect(fourthAndLast).toContain('Every month on the 4th Tuesday')
    expect(fourthAndLast).toContain('Every month on the last Tuesday')
    const fifth = repeatChoices(new Date(2026, 11, 29)).map((c) => c.label)
    expect(fifth).toContain('Every month on the last Tuesday')
    expect(fifth.some((l) => l.includes('5th'))).toBe(false)
  })

  it('D-082 each choice stores one rule [F-021]', () => {
    expect(ruleForChoice('none', TUE_17).recurrence).toBeNull()
    expect(ruleForChoice('week', TUE_17)).toEqual({
      recurrence: 'weekly',
      recurrenceInterval: 1,
      recurrenceMonthWeek: null,
    })
    expect(ruleForChoice('other-week', TUE_17)).toEqual({
      recurrence: 'weekly',
      recurrenceInterval: 2,
      recurrenceMonthWeek: null,
    })
    expect(ruleForChoice('month-date', TUE_17)).toEqual({
      recurrence: 'monthly',
      recurrenceInterval: 1,
      recurrenceMonthWeek: null,
    })
    expect(ruleForChoice('month-week', TUE_17)).toEqual({
      recurrence: 'monthly',
      recurrenceInterval: 1,
      recurrenceMonthWeek: 3,
    })
    expect(ruleForChoice('month-last', TUE_17).recurrenceMonthWeek).toBe(-1)
    expect(ruleForChoice('year', TUE_17).recurrence).toBe('yearly')
  })

  it('D-082 the next dates follow the rule [F-021]', () => {
    const fmt = (ds: Date[]) =>
      ds.map((d) => `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear() % 100}`)
    expect(fmt(nextDates('month-week', TUE_17))).toEqual(['12/15/26', '1/19/27', '2/16/27'])
    expect(fmt(nextDates('month-date', TUE_17))).toEqual(['12/17/26', '1/17/27', '2/17/27'])
    expect(fmt(nextDates('other-week', TUE_17))).toEqual(['12/1/26', '12/15/26', '12/29/26'])
    expect(fmt(nextDates('year', TUE_17, 1))).toEqual(['11/17/27'])
    expect(fmt(nextDates('month-date', new Date(2027, 0, 31)))).toEqual([
      '3/31/27',
      '5/31/27',
      '7/31/27',
    ])
    expect(nextDates('none', TUE_17)).toEqual([])
  })

  it('D-082 a stored rule reads back as its choice and its words [F-021]', () => {
    const monthly = {
      ...occ('pta', '2026-11-17T19:00:00'),
      recurrence: 'monthly',
      recurrenceWeekdays: [],
      recurrenceMonthWeek: 3,
    }
    expect(choiceForEvent(monthly)).toBe('month-week')
    expect(repeatRuleLabel(monthly)).toBe('Every month on the 3rd Tuesday')
    const everyOther = {
      ...monthly,
      recurrence: 'weekly',
      recurrenceInterval: 2,
      recurrenceMonthWeek: null,
    }
    expect(choiceForEvent(everyOther)).toBe('other-week')
    expect(repeatRuleLabel(everyOther)).toBe('Every other week on Tuesday')
    expect(repeatRuleLabel(occ('french', '2026-11-17T15:30:00', [2, 4]))).toBe('Tue · Thu')
    expect(repeatRuleLabel({ ...monthly, recurrence: null })).toBeNull()
  })
})
