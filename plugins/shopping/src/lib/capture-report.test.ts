import { describe, it, expect, vi } from 'vitest'
import {
  EMPTY_CAPTURE,
  buildReport,
  clearErrors,
  dismissNotice,
  type CaptureState,
} from './capture-report'

const handlers = { onClearErrors: vi.fn(), onDismissNotice: vi.fn(), onRetract: vi.fn() }
const state = (over: Partial<CaptureState> = {}): CaptureState => ({ ...EMPTY_CAPTURE, ...over })
const dup = (name: string, retractId: string | null = 'r1') => ({
  listName: 'Grocery',
  name,
  retractId,
})

describe('buildReport (D4)', () => {
  it('says nothing when there is nothing to say', () => {
    expect(buildReport(state(), handlers)).toEqual([])
  })

  it('names the newest failure and counts the rest, on one line', () => {
    const [line, ...rest] = buildReport(state({ addErrors: ['bread', 'milk'] }), handlers)
    expect(line.message).toBe('Couldn’t add “bread” · 1 more')
    expect(rest).toEqual([])
  })

  /* A single collision is unambiguous — it is the word they just typed — so the
     line stays verbatim, unnamed. */
  it('leaves one collision unnamed', () => {
    const [line] = buildReport(state({ duplicates: [dup('milk')] }), handlers)
    expect(line.message).toBe('Already on Grocery.')
    expect(line.actions.map((a) => a.label)).toEqual(['Take it back?'])
  })

  /* Two or more is ambiguous: three names went in and the reader cannot tell
     which of them doubled, so each line names itself. */
  it('names every collision once there is more than one', () => {
    const lines = buildReport(state({ duplicates: [dup('milk'), dup('bread')] }), handlers)
    expect(lines.map((l) => l.message)).toEqual([
      '“milk” already on Grocery.',
      '“bread” already on Grocery.',
    ])
  })

  it('stacks the notices UNDER the one error line', () => {
    const lines = buildReport(
      state({ addErrors: ['bread'], duplicates: [dup('milk'), dup('eggs')] }),
      handlers
    )
    expect(lines.map((l) => l.tone)).toEqual(['error', 'notice', 'notice'])
    expect(lines[0].message).toBe('Couldn’t add “bread”')
  })

  it('drops the verb from a collision whose add is not retract-eligible', () => {
    const [line] = buildReport(state({ duplicates: [dup('milk', null)] }), handlers)
    expect(line.actions).toEqual([])
  })

  it('gives a refused action the top of the slot', () => {
    const lines = buildReport(
      state({ actionError: 'Too late to take back “milk”.', addErrors: ['bread'] }),
      handlers
    )
    expect(lines[0].message).toBe('Too late to take back “milk”.')
    expect(lines).toHaveLength(1)
  })
})

describe('clearing the slot', () => {
  /* The error line is ONE report about every add that was lost, so its `✕`
     clears the whole line. Only the `✕` does — never a later success. */
  it('clears every error on the error line’s ✕', () => {
    const next = clearErrors(state({ addErrors: ['bread', 'milk'], actionError: 'nope' }))
    expect(next.addErrors).toEqual([])
    expect(next.actionError).toBeNull()
  })

  it('leaves the notices standing when the errors are cleared', () => {
    const next = clearErrors(state({ addErrors: ['bread'], duplicates: [dup('milk')] }))
    expect(next.duplicates).toHaveLength(1)
  })

  /* One notice's ✕ takes that notice. The others are separate collisions and
     have not been answered. */
  it('dismisses one notice and keeps its neighbours', () => {
    const next = dismissNotice(state({ duplicates: [dup('milk'), dup('bread'), dup('eggs')] }), 1)
    expect(next.duplicates.map((d) => d.name)).toEqual(['milk', 'eggs'])
  })
})
