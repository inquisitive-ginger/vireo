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
  recipeUrl: string | null
  createdBy: string
  createdAt: string
  updatedAt: string
}

/** What the needs-push contract hands back (ADR 069 §4). The counts are shown
    to the person who tapped, so they are exact — `filed` is what landed,
    `alreadyOn` is what was already there. */
export interface NeedsPushResult {
  listId: string
  listName: string
  filed: number
  alreadyOn: number
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
