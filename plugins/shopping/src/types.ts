import type { ShoppingAisle } from '@family-os/schemas'

/** Serialized `shopping.items` row. `note` is the row's second line and carries
    PRODUCER words only — why the row exists ("for Thursday"), never who added
    it (live review, 2026-09-03). `addedBy` is stored but never serialized. */
export interface ShoppingItem {
  id: string
  name: string
  category: ShoppingAisle | string
  quantity: string | null
  status: 'needed' | 'got'
  listId: string
  addedAt: string
  note: string | null
  /** Whether THIS reader may take the row back right now (ADR 073) — derived on
      the server, because `added_by` never goes on the wire and the window is a
      clock question. Goes stale between fetches by design; a tap after the
      boundary gets a 403 the surface shows rather than swallows. */
  canRetract: boolean
}

/** A destination. Permanent lists stay in the strip at zero; a runtime one is
    there only while it holds something. `itemCount` is what is still NEEDED on
    that list — the one arithmetic the whole module counts by (SH-10). */
export interface ShoppingList {
  id: string
  name: string
  kind: 'permanent' | 'runtime'
  groupByAisle: boolean
  itemCount: number
}

export interface ListsResponse {
  lists: ShoppingList[]
}

export interface ListResponse {
  list: ShoppingList
  items: ShoppingItem[]
}

/** An add is an ENVELOPE, not a row: the collision rides back with the item so
    the surface can say `Already on Grocery.` without a second read. `duplicateOf`
    is the pre-existing UNCHECKED row on the same list matching by
    `normalizeItemName` — never the row just created. The add always completes. */
export interface AddItemResponse {
  item: ShoppingItem
  duplicateOf: { id: string; name: string } | null
}

/** One name's outcome in a batch. Discriminated by `item`: a name that landed
    carries its row and any collision, a name that did not carries why. */
export type BatchAddResult =
  | { name: string; item: ShoppingItem; duplicateOf: { id: string; name: string } | null }
  | { name: string; error: string }

/** `POST /shopping/lists/:id/items/batch`, in submitted order and NOT atomic —
    one bad name does not cost the good ones, which is the whole reason a comma
    list is safe to type. */
export interface BatchAddResponse {
  results: BatchAddResult[]
}

/** A row read across every destination — the wide layout's `Just added` and
    the Home widget's list. Both span all lists, so each row names the one it
    landed on; the aisle list below does not, because it shows one list already. */
export interface RecentItem extends ShoppingItem {
  listName: string
}

export interface RecentResponse {
  lists: ShoppingList[]
  items: RecentItem[]
}

/** ONE line in the report slot (D4). A message plus a LIST of actions rather
    than a message-and-a-button, because the duplicate notice is permanent —
    duplicates carry a count rather than merging (E4), so the quantity session's
    `Make it ×2` lands beside `Take it back?` without reshaping the line.

    The slot holds an ordered stack of these: one error line at the top, then one
    notice per collision. It reserves a line's height from first paint and never
    moves while someone is typing — it grows only in answer to an Enter, which is
    the reader's own act. */
export interface CaptureReport {
  /** `error` outranks `notice` — a lost item is worse news than a doubled one. */
  tone: 'error' | 'notice'
  message: string
  actions: { label: string; onSelect: () => void }[]
  /** The `✕`, which sits just after the action: the line reads as one object —
      notice, verb, dismiss. It clears THIS line and nothing else. */
  onDismiss: () => void
}
