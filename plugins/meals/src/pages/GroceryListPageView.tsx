import { useMemo } from 'react'
import { ChevronLeft } from 'lucide-react'
import { Button, PageContainer } from '@family-os/ui'
import type { GroceryItem, GroceryList, Staple } from '../types'
import { aisleSortIndex } from '../lib/grocery-filing'
import { GroceryAddBar } from '../components/GroceryAddBar'
import { GroceryRow } from '../components/GroceryRow'

export interface GroceryListPageViewProps {
  list: GroceryList
  items: GroceryItem[]
  staples: Staple[]
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
  onTapStaple: (staple: Staple) => void
  onCorrect: (item: GroceryItem, category: string) => void
}

/* Inside a list the destination is implied — no store picker (handoff spec
   "Adding"). Aisle grouping is a property of THIS list (`groupByAisle`), not
   of the app — a non-food list renders flat. */
export function GroceryListPageView({
  list,
  items,
  staples,
  canAdd,
  canCorrect,
  flashItemId,
  errorMessage,
  onBack,
  onAdd,
  onTapStaple,
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

  return (
    <PageContainer width="list">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Back to lists"
          onClick={onBack}
        >
          <ChevronLeft className="size-5" aria-hidden />
        </Button>
        <h1 className="text-page-title text-foreground">{list.name}</h1>
      </div>

      {canAdd && (
        <div className="mt-4 hidden md:block">
          <GroceryAddBar
            staples={staples}
            errorMessage={errorMessage}
            onAdd={onAdd}
            onTapStaple={onTapStaple}
            layout="wide"
          />
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-base-token mt-6 text-muted-foreground">
          Nothing on the list — add something below.
        </p>
      ) : (
        // Bottom padding clears the fixed mobile add bar (~132px: tab bar +
        // bar chrome) so the last aisle's rows aren't hidden behind it.
        <div className="mt-5 flex flex-col pb-36 md:pb-4">
          {groups.map(([aisle, aisleItems]) => (
            <section key={aisle ?? 'flat'}>
              {aisle && (
                <div className="sticky top-0 z-10 flex items-baseline justify-between border-b border-border bg-background pb-1.5 pt-3">
                  <span className="text-aisle-head text-foreground">{aisle}</span>
                  <span className="text-sm-token text-muted-foreground">
                    {aisleItems.length === 1 ? '1 left' : `${aisleItems.length} left`}
                  </span>
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

      {canAdd && (
        // `fixed`, not `sticky` — a short list doesn't fill the viewport, and
        // the thumb zone has to hold regardless of list length.
        <div className="fixed inset-x-0 bottom-[calc(var(--spacing-tab-bar)+env(safe-area-inset-bottom))] z-20 border-t border-border bg-background pt-2 pb-2 md:hidden">
          <GroceryAddBar
            staples={staples}
            errorMessage={errorMessage}
            onAdd={onAdd}
            onTapStaple={onTapStaple}
            layout="narrow"
          />
        </div>
      )}
    </PageContainer>
  )
}
