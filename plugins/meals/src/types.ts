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

export interface PlanResponse {
  meals: PlannedMeal[]
}

export interface MealMember {
  name: string
  identityHue?: string | null
  avatarUrl?: string
}

export type WidgetSize = 'compact' | 'standard' | 'large'
