import type { ListResponse, ListsResponse } from '../types'
import type { QueuedCheck } from './offline-checks'

/* What this device knows about the list when it cannot ask. Two things live
   here and they answer different halves of the same failure: the SNAPSHOT is
   what to draw, the QUEUE is what has not been said yet.

   `localStorage` and not the SW cache on purpose. The SW's `/api` rule is
   network-first so a deploy lands immediately on every device (2026-07-19), and
   that rule is worth more than this feature — so the offline copy is kept
   somewhere that cannot weaken it. */

const VERSION = 'v1'

/** Profile-scoped: a wall tablet and a phone are different readers, and the
    house profile's list is not the parent's to replay. */
const key = (kind: string, profileId: string) => `vireo.shopping.${kind}.${VERSION}.${profileId}`

function read<T>(storageKey: string): T | null {
  try {
    const raw = localStorage.getItem(storageKey)
    return raw ? (JSON.parse(raw) as T) : null
  } catch (err) {
    // A browser that refuses storage costs the offline copy, not the page. It
    // stays loud anyway: silence here is a list that mysteriously never
    // survives a reload, in a house with no devtools to ask why.
    console.error('[shopping] could not read %s', storageKey, err)
    return null
  }
}

function write(storageKey: string, value: unknown) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(value))
  } catch (err) {
    console.error('[shopping] could not save %s', storageKey, err)
  }
}

/** Dated when it was SAVED. That date is what makes the query stale on arrival,
    so a device with a network refetches immediately and the snapshot is only
    ever what is on screen while the real answer is in the air. */
export interface Cached<T> {
  savedAt: number
  data: T
}

export interface ListSnapshot {
  lists: Cached<ListsResponse> | null
  items: Record<string, Cached<ListResponse>>
}

const EMPTY: ListSnapshot = { lists: null, items: {} }

export function readSnapshot(profileId: string): ListSnapshot {
  return read<ListSnapshot>(key('snapshot', profileId)) ?? EMPTY
}

export function saveLists(profileId: string, lists: ListsResponse, now = Date.now()) {
  const snapshot = readSnapshot(profileId)
  write(key('snapshot', profileId), { ...snapshot, lists: { savedAt: now, data: lists } })
}

/** Saves whatever the query cache holds, optimistic rows included — an offline
    check has to survive the reload that its queue entry already survives, or
    the two disagree on reopening and the row flips back under the shopper. */
export function saveListItems(
  profileId: string,
  listId: string,
  items: ListResponse,
  now = Date.now()
) {
  const snapshot = readSnapshot(profileId)
  write(key('snapshot', profileId), {
    ...snapshot,
    items: { ...snapshot.items, [listId]: { savedAt: now, data: items } },
  })
}

export function readQueue(profileId: string): QueuedCheck[] {
  return read<QueuedCheck[]>(key('checks', profileId)) ?? []
}

export function saveQueue(profileId: string, queue: QueuedCheck[]) {
  write(key('checks', profileId), queue)
}
