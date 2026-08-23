import { describe, it, expect, vi } from 'vitest'
import type { AppAbility, DayMarkProvider } from '@family-os/platform/server'
import type { DayMark } from '@family-os/platform/types'
import { aggregateDayMarks } from './day-marks'

// A minimal stand-in for `AppAbility` — only `.can()` is read by the aggregator.
function abilityAllowing(...allowed: string[]): AppAbility {
  return {
    can: (action: string, subject: string) => allowed.includes(`${action} ${subject}`),
  } as unknown as AppAbility
}

function provider(
  name: string,
  action: string,
  subject: string,
  marks: DayMark[]
): DayMarkProvider {
  return { name, action, subject, fetch: async () => marks }
}

describe('aggregateDayMarks', () => {
  it('merges marks from every provider the caller can see', async () => {
    const ability = abilityAllowing('view meals.PlannedMeal', 'view school.SchoolDay')
    const result = await aggregateDayMarks(
      [
        provider('meals', 'view', 'meals.PlannedMeal', [
          { date: '2026-08-24', ownerId: 'p1', glyph: 'utensils', label: "Zach's got dinner" },
        ]),
        provider('school', 'view', 'school.SchoolDay', [
          { date: '2026-08-24', glyph: 'school-off', label: 'No school' },
        ]),
      ],
      ability,
      '2026-08-24',
      '2026-08-24'
    )
    expect(result).toHaveLength(2)
  })

  it('skips a provider the caller cannot see — its fetch never runs', async () => {
    let called = false
    const ability = abilityAllowing('view meals.PlannedMeal')
    const provider1 = provider('school', 'view', 'school.SchoolDay', [
      { date: '2026-08-24', glyph: 'school-off', label: 'No school' },
    ])
    provider1.fetch = async () => {
      called = true
      return []
    }
    const result = await aggregateDayMarks([provider1], ability, '2026-08-24', '2026-08-24')
    expect(called).toBe(false)
    expect(result).toEqual([])
  })

  it("isolates one provider's failure — it never takes the whole route down", async () => {
    const ability = abilityAllowing('view meals.PlannedMeal', 'view school.SchoolDay')
    const broken: DayMarkProvider = {
      name: 'school',
      action: 'view',
      subject: 'school.SchoolDay',
      fetch: async () => {
        throw new Error('db unreachable')
      },
    }
    const errors: unknown[] = []
    const spy = vi.spyOn(console, 'error').mockImplementation((...args) => {
      errors.push(args)
    })
    try {
      const result = await aggregateDayMarks(
        [
          broken,
          provider('meals', 'view', 'meals.PlannedMeal', [
            { date: '2026-08-24', ownerId: 'p1', glyph: 'utensils', label: "Zach's got dinner" },
          ]),
        ],
        ability,
        '2026-08-24',
        '2026-08-24'
      )
      expect(result).toHaveLength(1)
      expect(result[0].label).toBe("Zach's got dinner")
      expect(errors).toHaveLength(1) // logged, not swallowed
    } finally {
      spy.mockRestore()
    }
  })

  it('keeps at most one mark per provider per day even if fetch misbehaves', async () => {
    const ability = abilityAllowing('view meals.PlannedMeal')
    const result = await aggregateDayMarks(
      [
        provider('meals', 'view', 'meals.PlannedMeal', [
          { date: '2026-08-24', ownerId: 'p1', glyph: 'utensils', label: "Zach's got dinner" },
          { date: '2026-08-24', ownerId: 'p2', glyph: 'utensils', label: "Mom's got dinner" },
        ]),
      ],
      ability,
      '2026-08-24',
      '2026-08-24'
    )
    expect(result).toHaveLength(1)
    expect(result[0].ownerId).toBe('p1') // first one wins
  })

  it('caps a day at two marks, registration order as the tie-break', async () => {
    const ability = abilityAllowing('view a.A', 'view b.B', 'view c.C')
    const result = await aggregateDayMarks(
      [
        provider('a', 'view', 'a.A', [{ date: '2026-08-24', glyph: 'a', label: 'A' }]),
        provider('b', 'view', 'b.B', [{ date: '2026-08-24', glyph: 'b', label: 'B' }]),
        provider('c', 'view', 'c.C', [{ date: '2026-08-24', glyph: 'c', label: 'C' }]),
      ],
      ability,
      '2026-08-24',
      '2026-08-24'
    )
    expect(result.map((m) => m.label)).toEqual(['A', 'B'])
  })

  it('caps AFTER filtering — a caller never loses a visible mark to one they cannot see (ADR 066)', async () => {
    // Caller can't see "a"; the cap must not still reserve it a slot.
    const ability = abilityAllowing('view b.B', 'view c.C')
    const result = await aggregateDayMarks(
      [
        provider('a', 'view', 'a.A', [{ date: '2026-08-24', glyph: 'a', label: 'A' }]),
        provider('b', 'view', 'b.B', [{ date: '2026-08-24', glyph: 'b', label: 'B' }]),
        provider('c', 'view', 'c.C', [{ date: '2026-08-24', glyph: 'c', label: 'C' }]),
      ],
      ability,
      '2026-08-24',
      '2026-08-24'
    )
    expect(result.map((m) => m.label)).toEqual(['B', 'C'])
  })

  it('sorts the result by date', async () => {
    const ability = abilityAllowing('view meals.PlannedMeal')
    const result = await aggregateDayMarks(
      [
        provider('meals', 'view', 'meals.PlannedMeal', [
          { date: '2026-08-26', ownerId: 'p1', glyph: 'utensils', label: 'Later' },
          { date: '2026-08-24', ownerId: 'p1', glyph: 'utensils', label: 'Earlier' },
        ]),
      ],
      ability,
      '2026-08-24',
      '2026-08-26'
    )
    expect(result.map((m) => m.label)).toEqual(['Earlier', 'Later'])
  })
})
