import { describe, it, expect } from 'vitest'
import type { DayMark, DayMarkLine } from '@family-os/platform/types'
import { headlineLine, lineChange } from './mark-lines'

const line = (
  id: string,
  minutes: number,
  ownerId: string | null,
  cleared = false
): DayMarkLine => ({
  id,
  minutes,
  text: id,
  ownerId,
  cleared,
})
const MARK: DayMark = {
  date: '2026-11-17',
  glyph: 'car',
  label: '',
  lines: [line('a', 495, 'h'), line('b', 990, 'h'), line('c', 1050, null)],
}

describe('mark lines', () => {
  it('D-087 today names the next run not yet past, and the last once all are past [F-042]', () => {
    expect(headlineLine(MARK, new Date(2026, 10, 17, 16, 0))?.id).toBe('b')
    expect(headlineLine(MARK, new Date(2026, 10, 17, 21, 0))?.id).toBe('c')
  })

  it('D-087 another day names its first run; cleared runs never count [F-042]', () => {
    expect(headlineLine(MARK, new Date(2026, 10, 16, 16, 0))?.id).toBe('a')
    const cleared = { ...MARK, lines: MARK.lines!.map((l) => ({ ...l, cleared: l.id === 'a' })) }
    expect(headlineLine(cleared, new Date(2026, 10, 16, 16, 0))?.id).toBe('b')
  })

  it('D-087 claim takes the run, swap hands it to the next parent [F-042]', () => {
    expect(lineChange(line('c', 1050, null), 'claim', ['h', 'z'], 'teen').ownerId).toBe('teen')
    expect(lineChange(line('c', 1050, null), 'claim', ['h', 'z'], 'z')).toEqual({
      ownerId: 'z',
      cleared: false,
    })
    expect(lineChange(line('b', 990, 'h'), 'swap', ['h', 'z'], 'h')).toEqual({
      ownerId: 'z',
      cleared: false,
    })
    expect(lineChange(line('b', 990, 'z'), 'swap', ['h', 'z'], 'h')).toEqual({
      ownerId: 'h',
      cleared: false,
    })
  })

  it('D-094 clear and restore keep the driver [F-042]', () => {
    expect(lineChange(line('b', 990, 'h'), 'clear', ['h', 'z'], 'z')).toEqual({
      ownerId: 'h',
      cleared: true,
    })
    expect(lineChange(line('b', 990, 'h', true), 'restore', ['h', 'z'], 'z')).toEqual({
      ownerId: 'h',
      cleared: false,
    })
  })
})
