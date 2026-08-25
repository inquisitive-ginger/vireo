import { useMemo } from 'react'
import { PageContainer } from '@family-os/ui'
import type { GroceryEntry, GroceryItem, GroceryList } from '../types'
import { aisleSortIndex } from '../lib/grocery-filing'
import { GroceryCompletionField } from '../components/GroceryCompletionField'
import { GroceryRow } from '../components/GroceryRow'

export interface GroceryListPageViewProps {
  list: GroceryList
  items: GroceryItem[]
  entries: GroceryEntry[]
  canAdd: boolean
  /** Tier 4 via `ability.can('manage', 'meals.GroceryItem')` (ADR 067) —
      gates the "Which aisle?" correction, which teaches a family-wide
      override, not just this row. */
  canCorrect: boolean
  /** The just-added item — flashes primary-tint in place, in its aisle, the
      answer to "did my add land?" (design.md §M5/6). */
  flashItemId: string | null
  errorMessage: string | null
  onBack: () => void
  onAdd: (name: string) => Promise<void>
  onCorrect: (item: GroceryItem, category: string) => void
}

/* Inside a list the destination is implied — no store picker, no "Add to…"
   label, one composer in the thumb zone (dev-ready artifact §2). Aisle
   grouping is a property of THIS list (`groupByAisle`), not of the app — a
   non-food list renders flat. */
export function GroceryListPageView({
  list,
  items,
  entries,
  canAdd,
  canCorrect,
  flashItemId,
  errorMessage,
  onBack,
  onAdd,
  onCorrect,
}: GroceryListPageViewProps) {
  const groups = useMemo(() => {
    if (!list.groupByAisle) return [[null, items] as const]
    const byAisle = new Map<string, GroceryItem[]>()
    for (const item of items) {
      const bucket = byAisle.get(item.category) ?? []
      bucket.push(item)
      byAisle.set(item.category, bucket)
    }
    return [...byAisle.entries()]
      .sort(([a], [b]) => aisleSortIndex(a) - aisleSortIndex(b))
      .map(([aisle, aisleItems]) => [aisle, aisleItems] as const)
  }, [list.groupByAisle, items])

  const composer = canAdd && (
    <>
      <GroceryCompletionField
        entries={entries}
        variant="field"
        placeholder="Add to the list…"
        ariaLabel="Add to the list"
        onSubmit={onAdd}
      />
      {errorMessage && <p className="text-sm-token pt-1 text-destructive">{errorMessage}</p>}
    </>
  )

  return (
    <PageContainer width="list">
      <button
        type="button"
        onClick={onBack}
        className="text-sm-token -ml-1 rounded-card px-1 text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        ‹ Groceries
      </button>
      <h1 className="text-page-title mt-1 text-foreground">{list.name}</h1>

      {items.length === 0 ? (
        <p className="text-base-token mt-6 text-muted-foreground">
          Nothing on the list — add something below.
        </p>
      ) : (
        // Bottom padding clears the composer, which is fixed above the tab bar
        // on the phone and sticky at the column's foot everywhere else.
        <div className="mt-4 flex flex-col pb-32 md:pb-4">
          {groups.map(([aisle, aisleItems]) => (
            <section key={aisle ?? 'flat'}>
              {aisle && (
                <div className="text-section-label sticky top-0 z-10 bg-background pt-4 pb-1.5 text-muted-foreground">
                  {aisle}
                </div>
              )}
              {aisleItems.map((item) => (
                <GroceryRow
                  key={item.id}
                  item={item}
                  flash={item.id === flashItemId}
                  // hasOverride comes from the server, not component state —
                  // "one-time" (AC4) has to survive a reload of the fridge
                  // tablet, not just last until the tab closes.
                  showCorrection={canCorrect && item.category === 'Other' && !item.hasOverride}
                  onCorrect={onCorrect}
                />
              ))}
            </section>
          ))}
        </div>
      )}

      {/* One composer at the foot of the list on every width — the wall differs
          from the phone in size, not in structure (artifact §3). The phone
          needs `fixed` to clear the tab bar and to hold the thumb zone on a
          short list; on the wall the page column is the scrollport, so sticky
          pins it to the same place without spanning under the sidebar. */}
      {canAdd && (
        <div className="fixed inset-x-0 bottom-[calc(var(--spacing-tab-bar)+env(safe-area-inset-bottom))] z-20 border-t border-border bg-background px-4 py-2 md:sticky md:inset-x-auto md:bottom-0 md:px-0">
          {composer}
        </div>
      )}
    </PageContainer>
  )
}
