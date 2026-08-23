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

/** Serialized `grocery_items` row — `note` is computed server-side (provenance
    is one grammar, design.md §M5/6), never stored raw. */
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
  /** A family-wide override already exists for this item's normalized name —
      the "Which aisle?" correction prompt is one-time (AC4) and must not
      resurface once triaged, including a "Leave it" dismissal (which teaches
      an override of `Other`). */
  hasOverride: boolean
}

export interface GroceriesResponse {
  items: GroceryItem[]
}

export interface Staple {
  id: string
  name: string
  category: string
  active: boolean
}

export interface StaplesResponse {
  staples: Staple[]
}
