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

/** What the one-line report slot is saying (D4). Modelled as a message plus a
    LIST of actions rather than a message-and-a-button, because the duplicate
    notice is permanent: duplicates carry a count rather than merging (E4), so
    the quantity session's `Make it ×2` lands beside `Take it back?` here without
    reshaping the slot. It still draws one line and never resizes. */
export interface CaptureReport {
  /** `error` outranks `notice` outranks idle — a lost item is worse news than a
      doubled one. */
  tone: 'error' | 'notice'
  message: string
  actions: { label: string; onSelect: () => void }[]
  /** The `✕`. Nothing else clears the line — least of all a later success. */
  onDismiss: () => void
}
