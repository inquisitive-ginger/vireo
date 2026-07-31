import { describe, it, expect } from 'vitest'
import { daySetLabel, daySetSummary, routineStatusLabel } from './routines'

describe('daySetLabel', () => {
  it('names the common sets', () => {
    expect(daySetLabel([0, 1, 2, 3, 4, 5, 6])).toBe('Every day')
    expect(daySetLabel([1, 2, 3, 4, 5])).toBe('Weekdays')
    expect(daySetLabel([4])).toBe('Thursdays')
    expect(daySetLabel([4, 1])).toBe('Mon & Thu')
    expect(daySetLabel([1, 3, 5])).toBe('Mon, Wed & Fri')
  })
})

describe('daySetSummary', () => {
  it('leads with Every and prompts on an empty set', () => {
    expect(daySetSummary([])).toBe('Pick the days it repeats')
    expect(daySetSummary([1, 2, 3, 4, 5])).toBe('Every weekday')
    expect(daySetSummary([4])).toBe('Every Thursday')
    expect(daySetSummary([1, 4])).toBe('Every Mon & Thu')
  })
})

describe('routineStatusLabel', () => {
  it('states the schedule or the standing promise', () => {
    expect(routineStatusLabel({ kind: 'days', repeatDays: [1, 4] })).toBe('Mon & Thu')
    expect(routineStatusLabel({ kind: 'ongoing', repeatDays: [] })).toBe("Whenever it's needed")
  })
})
