import type { ShoppingItem } from '../types'

/** A check taken while the phone could not reach the server. The queue is the
    only durable record of it — the optimistic row it drew lives in a cache a
    reload throws away, and a shop is exactly where a phone gets closed. */
export interface QueuedCheck {
  itemId: string
  listId: string
  name: string
  status: ShoppingItem['status']
  /** What the row read before the FIRST queued tap on it — where a dropped
      entry has to put the row back. */
  was: ShoppingItem['status']
  queuedAt: number
}

/** A request that never reached the server, as opposed to one the server
    refused. They are opposite outcomes and get opposite treatment: a refusal is
    an answer, so the row rolls back and says so; a dropped connection is not an
    answer, so the row stands and the tap is queued. */
export class OfflineError extends Error {
  constructor(cause: unknown) {
    super('The check never reached the server')
    this.cause = cause
  }
}

/** An entry nobody has managed to send in a day is not a check any more — the
    trip is over and the list has moved on without it. */
export const MAX_QUEUE_AGE_MS = 24 * 60 * 60 * 1000

/** One entry per row, always. A shopper walking an aisle taps the same row more
    than once, and the server's rule is that the body names the TARGET state
    (M5.5/4) — so only the last intent is worth sending, and sending the
    intermediate ones would race the other shopper for a state nobody wants. */
export function queueCheck(queue: QueuedCheck[], entry: QueuedCheck): QueuedCheck[] {
  const prior = queue.find((q) => q.itemId === entry.itemId)
  const rest = queue.filter((q) => q.itemId !== entry.itemId)
  if (!prior) return [...rest, entry]
  // Tapped back to where it started while offline: there is nothing left to
  // tell the server, and an entry saying "leave it alone" would still overwrite
  // whatever the other shopper did to that row in the meantime.
  if (prior.was === entry.status) return rest
  // The original `was` and the original `queuedAt` survive: the rollback target
  // is where the row was before any of this, and the age is how long the row
  // has actually been unsent.
  return [...rest, { ...entry, was: prior.was, queuedAt: prior.queuedAt }]
}

export function pruneQueue(queue: QueuedCheck[], now: number, maxAge = MAX_QUEUE_AGE_MS) {
  const kept: QueuedCheck[] = []
  const stale: QueuedCheck[] = []
  for (const entry of queue) {
    if (now - entry.queuedAt > maxAge) stale.push(entry)
    else kept.push(entry)
  }
  return { kept, stale }
}

export interface DrainResult {
  /** Everything still unsent, in order. Non-empty means the signal went away
      again mid-drain — not that anything failed. */
  remaining: QueuedCheck[]
  sent: QueuedCheck[]
  /** The server answered, and the answer was no. */
  refused: { entry: QueuedCheck; reason: unknown }[]
}

/** Replay is safe because the check route is conditional on the row still being
    in the OTHER state (M5.5/4): re-sending a target the row already holds is a
    true no-op that emits nothing, so a queue drained twice is a queue drained
    once. */
export async function drainQueue(
  queue: QueuedCheck[],
  send: (entry: QueuedCheck) => Promise<unknown>
): Promise<DrainResult> {
  const sent: QueuedCheck[] = []
  const refused: DrainResult['refused'] = []
  // Serial, in the order the taps happened. A parallel flush would hand a burst
  // to the server from the one device that has just proved its connection is
  // thin, and it would take the whole queue down on the first dropout instead
  // of the tail.
  for (let i = 0; i < queue.length; i++) {
    const entry = queue[i]
    try {
      await send(entry)
      sent.push(entry)
    } catch (err) {
      if (err instanceof OfflineError) return { remaining: queue.slice(i), sent, refused }
      refused.push({ entry, reason: err })
    }
  }
  return { remaining: [], sent, refused }
}

export async function sendCheck(
  itemId: string,
  status: ShoppingItem['status']
): Promise<ShoppingItem> {
  let res: Response
  try {
    res = await fetch(`/api/shopping/items/${itemId}/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
  } catch (err) {
    throw new OfflineError(err)
  }
  if (!res.ok) throw new Error(String(res.status))
  return res.json() as Promise<ShoppingItem>
}

/** Said in the report slot, in the same shape the add error uses: the newest
    name, then a count. A check nobody could send is a row that is wrong on this
    phone and right everywhere else — the one thing worse than saying so is not. */
export function abandonedChecks(stale: QueuedCheck[]): string {
  const [first, ...rest] = stale
  return `Couldn’t sync “${first.name}”${rest.length ? ` · ${rest.length} more` : ''} — too old to send now.`
}
