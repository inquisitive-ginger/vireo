import type { BatchAddResponse, BatchAddResult } from '../types'
import type { CaptureDuplicate } from './capture-report'
import { MAX_NAMES } from './parse-names'

type FailedResult = Extract<BatchAddResult, { error: string }>

/* Reading `POST /shopping/lists/:id/items/batch`. The route is not atomic, so a
   response is a list of outcomes rather than one: these turn it into the two
   things the slot renders — the names that were lost, and the collisions.

   An error result carries no `item` key at all, so `'error' in r` is the branch. */
function failures(data: BatchAddResponse): FailedResult[] {
  return data.results.filter((r): r is FailedResult => 'error' in r)
}

/** The names that did not land, in submitted order, so the error line names the
    first thing lost rather than whichever the server answered last.

    **The server's `error` string never comes with them.** It is Zod's own message
    — `String must contain at most 120 character(s)` — which is developer copy,
    and a family member at the wall must not be shown a schema. The reason goes to
    the console instead, where ADR 046's ring buffer can have it; the slot says
    `Couldn't add "…"` in the voice the rest of it already uses. */
export function failedNames(data: BatchAddResponse): string[] {
  const failed = failures(data)
  for (const result of failed) {
    console.error('[shopping] could not add %s: %s', result.name, result.error)
  }
  return failed.map((result) => result.name)
}

/** The row a collision points at is the one the add CREATED, never the
    pre-existing row it doubled — on a shared list those belong to two people. */
export function toDuplicate(
  listName: string,
  item: { id: string; name: string; canRetract: boolean },
  canRetract: boolean
): CaptureDuplicate {
  return {
    listName,
    name: item.name,
    retractId: canRetract && item.canRetract ? item.id : null,
  }
}

export function collisions(
  data: BatchAddResponse,
  listName: string,
  canRetract: boolean
): CaptureDuplicate[] {
  return data.results.flatMap((result) =>
    !('error' in result) && result.duplicateOf
      ? [toDuplicate(listName, result.item, canRetract)]
      : []
  )
}

/** Refused before it is sent — the batch route's own ceiling, said in the slot
    rather than discovered as a 400. */
export function tooMany(count: number): string {
  return `That is ${count} things at once — ${MAX_NAMES} is the most in one go.`
}
