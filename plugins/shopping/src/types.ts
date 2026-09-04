import type { ShoppingAisle } from '@family-os/schemas'

/** Serialized `shopping.items` row. `note` is the row's second line — text
    facts only, never a hue or a face (ADR 064). */
export interface ShoppingItem {
  id: string
  name: string
  category: ShoppingAisle | string
  quantity: string | null
  status: 'needed' | 'got'
  listId: string
  addedAt: string
  note: string | null
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
