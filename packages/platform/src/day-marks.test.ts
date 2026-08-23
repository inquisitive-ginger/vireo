import { describe, it, expect } from 'vitest'
import { createDayMarkRegistry } from './day-marks'

describe('createDayMarkRegistry', () => {
  it('lists providers in registration order — the cap tie-break relies on this', () => {
    const registry = createDayMarkRegistry()
    registry.register({
      name: 'meals',
      action: 'view',
      subject: 'meals.PlannedMeal',
      fetch: async () => [],
    })
    registry.register({
      name: 'school',
      action: 'view',
      subject: 'school.SchoolDay',
      fetch: async () => [],
    })
    expect(registry.list().map((p) => p.name)).toEqual(['meals', 'school'])
  })

  it('starts empty', () => {
    expect(createDayMarkRegistry().list()).toEqual([])
  })
})
