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
    there only while it holds something. */
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
  /** Family-wide corrections, keyed by normalized name — what the filing echo
      reads so it states the aisle the server will actually pick. */
  overrides: Record<string, string>
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
  /** Same corrections the page's read carries — the filing echo has to be true
      wherever the field lives, not only on the route. */
  overrides: Record<string, string>
}
