export const MEAL_KINDS = ['cooked', 'takeout', 'leftovers', 'out'] as const
export type MealKind = (typeof MEAL_KINDS)[number]

/** Serialized `planned_meals` row — `date` travels as a YYYY-MM-DD key. */
export interface PlannedMeal {
  id: string
  date: string
  slot: string
  title: string
  sides: string | null
  kind: MealKind
  ownerId: string | null
  notes: string | null
  tryBite: string | null
  needs: string | null
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface PlanResponse {
  meals: PlannedMeal[]
}

export interface MealMember {
  name: string
  identityHue?: string | null
  avatarUrl?: string
}

export type WidgetSize = 'compact' | 'standard' | 'large'

export type GroceryStatus = 'needed' | 'got'
export type GrocerySourceType = 'manual' | 'meal' | 'staple'

/** Serialized `grocery_items` row — `note` is computed server-side, never
    stored raw. Nothing renders it since the M5/6 gate cut the note line
    (design gate 2026-08-23), but the field and its computation stay: M5/7's
    partner sync ("Sam got it") is expected to want the same grammar. */
export interface GroceryItem {
  id: string
  name: string
  category: string
  quantity: string | null
  status: GroceryStatus
  sourceType: GrocerySourceType
  sourceId: string | null
  addedBy: string
  note: string | null
  listId: string
  /** A family-wide override already exists for this item's normalized name —
      the "Which aisle?" correction prompt is one-time (AC4) and must not
      resurface once triaged, including a "Leave it" dismissal (which teaches
      an override of `Other`). */
  hasOverride: boolean
}

/** A list is its own row (ADR 067) — never a column on the item. `kind`
    distinguishes the seeded permanent lists (always shown, dim at zero) from
    a tier-4-created runtime one (shown only while it holds items).
    `groupByAisle` is a property of the list, not the app. */
export type GroceryListKind = 'permanent' | 'runtime'

export interface GroceryList {
  id: string
  name: string
  kind: GroceryListKind
  groupByAisle: boolean
  itemCount: number
}

export interface GroceryListsResponse {
  lists: GroceryList[]
}

export interface GroceryListResponse {
  list: GroceryList
  items: GroceryItem[]
}

/** One previously-added item name — the ghost completion's dictionary (design
    gate amendment 2026-08-23). Ordered most-recent-first by the API; the field
    prefix-matches `name` and never renders a list of these. */
export interface GroceryEntry {
  normalizedName: string
  name: string
}

export interface GroceryEntriesResponse {
  entries: GroceryEntry[]
}
