import type { MealKind, PlannedMeal } from '../types'
import { toDateKey } from './dates'

/** The hour the widget escalates — the same hour M5/3's afternoon poll fires
    (design.md: one message, two channels). Client-local until the poll ships. */
export const ESCALATION_HOUR = 16

/** The kind lives in the verb, never a chip (design.md §Shared language).
    Second person when the viewer IS the owner (v3 review, 2026-08-12) — the
    morning glance reads "You're cooking", not your own name. Past tense on
    days already behind us (critique, 2026-08-13) — the page records those,
    it doesn't offer them. */
export function kindVerb(
  kind: MealKind,
  ownerName: string,
  isViewer = false,
  past = false
): string {
  switch (kind) {
    case 'takeout':
      if (past) return isViewer ? 'You called it in' : `${ownerName} called it in`
      return isViewer ? "You're calling it in" : `${ownerName} is calling it in`
    case 'leftovers':
      if (past) return isViewer ? 'You reheated' : `${ownerName} reheated`
      return isViewer ? "You're reheating" : `${ownerName} is reheating`
    case 'out':
      return past ? 'we went out' : "we're going out"
    default:
      if (past) return isViewer ? 'You cooked' : `${ownerName} cooked`
      return isViewer ? "You're cooking" : `${ownerName} is cooking`
  }
}

/* "4 to buy" from the free-text `needs` field — a comma count, honest about
   what it is. Renders NOTHING when needs is empty: blank means "nobody typed
   anything", never "everything's in the house" — the real all-clear waits for
   the grocery list (M5/6). */
export function needsCount(meal: PlannedMeal | null | undefined): number {
  if (!meal?.needs) return 0
  return meal.needs.split(',').filter((t) => t.trim().length > 0).length
}

/** A going-out dinner needs no planner and no attribution — "we're going out"
    is the whole sentence (live review, 2026-08-12). Ownerless is its resting
    state, not a gap: it never reads unclaimed, never escalates, never counts
    as needing a cook. */
export function isCovered(meal: PlannedMeal | null | undefined): boolean {
  return Boolean(meal && (meal.ownerId || meal.kind === 'out'))
}

/* "N days need a cook" counts today forward — Monday's gap is not news on
   Thursday. A day needs a cook when nothing is planned or the plan is unclaimed. */
export function daysNeedingCook(
  days: Date[],
  mealsByDate: Map<string, PlannedMeal>,
  now: Date
): number {
  const todayKey = toDateKey(now)
  return days.filter((d) => {
    const key = toDateKey(d)
    if (key < todayKey) return false
    return !isCovered(mealsByDate.get(key))
  }).length
}

/** The strip/header label states the count in words — the viewer never tallies
    rings (design.md §M5/2). */
export function needsCookLabel(count: number): string {
  if (count === 0) return "every day's covered"
  return count === 1 ? '1 day needs a cook' : `${count} days need a cook`
}
