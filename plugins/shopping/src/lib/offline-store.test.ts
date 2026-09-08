import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { readQueue, readSnapshot, saveLists, saveListItems, saveQueue } from './offline-store'
import type { ListResponse, ListsResponse } from '../types'

const lists: ListsResponse = {
  lists: [{ id: 'grocery', name: 'Grocery', kind: 'permanent', groupByAisle: true, itemCount: 1 }],
}

const listResponse: ListResponse = {
  list: lists.lists[0],
  items: [
    {
      id: '1',
      name: 'milk',
      category: 'Dairy',
      quantity: null,
      status: 'needed',
      listId: 'grocery',
      addedAt: '2026-09-07T12:00:00.000Z',
      note: null,
      canRetract: true,
    },
  ],
}

beforeEach(() => localStorage.clear())
afterEach(() => vi.restoreAllMocks())

describe('the snapshot', () => {
  it('round-trips the index and a list, each dated when it was saved', () => {
    saveLists('parent-1', lists, 5_000)
    saveListItems('parent-1', 'grocery', listResponse, 7_000)

    const snapshot = readSnapshot('parent-1')
    expect(snapshot.lists).toEqual({ savedAt: 5_000, data: lists })
    expect(snapshot.items.grocery).toEqual({ savedAt: 7_000, data: listResponse })
  })

  it('is scoped to the profile — the wall does not read the parent’s trip', () => {
    saveLists('parent-1', lists, 5_000)
    expect(readSnapshot('family').lists).toBeNull()
  })

  it('reads as empty rather than throwing when there is nothing yet', () => {
    expect(readSnapshot('parent-1')).toEqual({ lists: null, items: {} })
  })

  it('says so out loud when the browser refuses storage, and still renders', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('denied')
    })

    expect(readSnapshot('parent-1')).toEqual({ lists: null, items: {} })
    expect(error).toHaveBeenCalled()
  })

  it('says so out loud when a write is refused — a full quota is not a silent one', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError')
    })

    saveLists('parent-1', lists, 5_000)
    expect(error).toHaveBeenCalled()
  })
})

describe('the queue', () => {
  it('round-trips, profile-scoped, and reads empty before anything is written', () => {
    expect(readQueue('parent-1')).toEqual([])

    const queue = [
      {
        itemId: '1',
        listId: 'grocery',
        name: 'milk',
        status: 'got' as const,
        was: 'needed' as const,
        queuedAt: 1_000,
      },
    ]
    saveQueue('parent-1', queue)

    expect(readQueue('parent-1')).toEqual(queue)
    expect(readQueue('family')).toEqual([])
  })
})
