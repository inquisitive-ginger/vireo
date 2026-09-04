import { AISLES, lookupDictionaryAisle, normalizeItemName, type Aisle } from './aisle-dictionary'

export { AISLES, normalizeItemName }
export type { Aisle }

/** Assigns the aisle a new item files itself under: a family-wide override
    always wins (it's a correction, a stronger signal than the shipped
    dictionary), then the dictionary, then `Other`. Pure and DB-free — callers
    resolve `overrideCategory` from `shopping.aisle_overrides` (keyed by the same
    `normalizeItemName`) before calling this. */
export function fileAisle(name: string, overrideCategory: string | null): Aisle | string {
  if (overrideCategory) return overrideCategory
  return lookupDictionaryAisle(normalizeItemName(name)) ?? 'Other'
}

/** Sort key for the fixed walk order (Produce → Bakery → Meat → Dairy → Pantry
    → Frozen → Other). A category outside the shipped list (shouldn't happen —
    corrections only ever write one of these) sorts last, next to Other, rather
    than throwing. */
export function aisleSortIndex(category: string): number {
  const i = AISLES.indexOf(category as Aisle)
  return i === -1 ? AISLES.length : i
}
