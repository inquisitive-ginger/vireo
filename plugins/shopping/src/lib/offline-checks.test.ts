import { describe, it, expect, vi } from 'vitest'
import {
  MAX_QUEUE_AGE_MS,
  OfflineError,
  abandonedChecks,
  drainQueue,
  pruneQueue,
  queueCheck,
  type QueuedCheck,
} from './offline-checks'

const entry = (over: Partial<QueuedCheck> & { itemId: string }): QueuedCheck => ({
  listId: 'grocery',
  name: 'milk',
  status: 'got',
  was: 'needed',
  queuedAt: 1_000,
  ...over,
})

describe('queueCheck', () => {
  it('keeps one entry per row, holding only the last thing the thumb meant', () => {
    const queue = queueCheck([], entry({ itemId: '1', status: 'got', was: 'needed' }))
    const next = queueCheck(queue, entry({ itemId: '1', status: 'needed', was: 'got' }))
    const back = queueCheck(next, entry({ itemId: '1', status: 'got', was: 'needed' }))

    expect(back).toHaveLength(1)
    expect(back[0].status).toBe('got')
  })

  it('drops the entry entirely when the row is tapped back to where it started', () => {
    const queue = queueCheck([], entry({ itemId: '1', status: 'got', was: 'needed' }))
    expect(queueCheck(queue, entry({ itemId: '1', status: 'needed', was: 'got' }))).toEqual([])
  })

  /* The same target queued twice for one row. It happens when a refetch lands
     between the taps and puts the server's older `needed` back under the thumb —
     the row is redrawn, tapped again, and reports a `was` that is a round trip
     old. The first entry is the one that saw the truth. */
  it('keeps the original rollback target and age when a row is queued twice over', () => {
    const queue = queueCheck([], entry({ itemId: '1', status: 'got', queuedAt: 1_000 }))
    const next = queueCheck(queue, entry({ itemId: '1', status: 'got', queuedAt: 9_000 }))

    expect(next).toHaveLength(1)
    expect(next[0].was).toBe('needed')
    // Ages from the FIRST tap, so a row tapped all afternoon cannot outrun the cap.
    expect(next[0].queuedAt).toBe(1_000)
  })

  it('leaves other rows alone', () => {
    const queue = queueCheck(
      [entry({ itemId: '1' }), entry({ itemId: '2', name: 'eggs' })],
      entry({ itemId: '1', status: 'needed', was: 'got' })
    )
    expect(queue.map((q) => q.itemId)).toEqual(['2'])
  })
})

describe('pruneQueue', () => {
  it('gives up on a check nobody could send for a day, and keeps the rest', () => {
    const fresh = entry({ itemId: '1', queuedAt: 10_000 })
    const old = entry({ itemId: '2', name: 'eggs', queuedAt: 0 })
    const { kept, stale } = pruneQueue([fresh, old], MAX_QUEUE_AGE_MS + 1)
    expect(kept).toEqual([fresh])
    expect(stale).toEqual([old])
  })
})

describe('drainQueue', () => {
  it('replays every entry in the order the taps happened', async () => {
    const sentIds: string[] = []
    const send = vi.fn((e: QueuedCheck) => {
      sentIds.push(e.itemId)
      return Promise.resolve()
    })
    const queue = [entry({ itemId: '1' }), entry({ itemId: '2', name: 'eggs' })]

    const result = await drainQueue(queue, send)

    expect(sentIds).toEqual(['1', '2'])
    expect(result.remaining).toEqual([])
    expect(result.sent).toHaveLength(2)
  })

  it('stops at the first request that never left the device and keeps the tail', async () => {
    const queue = [entry({ itemId: '1' }), entry({ itemId: '2' }), entry({ itemId: '3' })]
    const send = vi
      .fn()
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new OfflineError(new TypeError('Failed to fetch')))

    const result = await drainQueue(queue, send)

    expect(send).toHaveBeenCalledTimes(2)
    expect(result.sent.map((e) => e.itemId)).toEqual(['1'])
    expect(result.remaining.map((e) => e.itemId)).toEqual(['2', '3'])
    expect(result.refused).toEqual([])
  })

  it('reports a REFUSED entry and carries on — the server answered, so retrying it changes nothing', async () => {
    const queue = [entry({ itemId: '1' }), entry({ itemId: '2', name: 'eggs' })]
    const send = vi.fn().mockRejectedValueOnce(new Error('403')).mockResolvedValueOnce(undefined)

    const result = await drainQueue(queue, send)

    expect(result.remaining).toEqual([])
    expect(result.sent.map((e) => e.itemId)).toEqual(['2'])
    expect(result.refused).toHaveLength(1)
    expect(result.refused[0].entry.itemId).toBe('1')
  })

  it('is safe to run twice — the route no-ops a target the row already holds', async () => {
    const send = vi.fn().mockResolvedValue(undefined)
    const queue = [entry({ itemId: '1' })]

    const first = await drainQueue(queue, send)
    const second = await drainQueue(first.remaining, send)

    expect(second.sent).toEqual([])
    expect(send).toHaveBeenCalledTimes(1)
  })
})

describe('abandonedChecks', () => {
  it('names the first and counts the rest, in the shape the add error already uses', () => {
    expect(abandonedChecks([entry({ itemId: '1' })])).toContain('“milk”')
    expect(abandonedChecks([entry({ itemId: '1' }), entry({ itemId: '2' })])).toContain('1 more')
  })
})
