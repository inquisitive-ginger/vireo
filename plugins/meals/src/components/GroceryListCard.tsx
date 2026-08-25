import { useState } from 'react'
import { ChevronRight, Plus } from 'lucide-react'
import { ItemCard } from '@family-os/ui'
import type { GroceryEntry, GroceryList } from '../types'
import { GroceryCompletionField } from './GroceryCompletionField'

export interface GroceryListCardProps {
  list: GroceryList
  entries: GroceryEntry[]
  canAdd: boolean
  /** The last failed add to THIS list. Option B gives every list its own
      composer, so the failure has to name its own card — a single message at
      the foot of the index sits under the wrong list, or under `+ New list`. */
  errorMessage: string | null
  onOpen: () => void
  onAdd: (name: string) => Promise<void>
}

function countLabel(itemCount: number): string {
  if (itemCount === 0) return 'Empty'
  return itemCount === 1 ? '1 item' : `${itemCount} items`
}

/* An index row is a card with two regions divided by a hairline (dev-ready
   artifact §1): the list itself on top, its own add affordance below. That
   second region is what makes an item reach any list without opening it —
   option B, the whole point of the index. `ItemCard` owns the skeleton and the
   whole-card tap target; the add region lifts above that overlay the same way
   `trailing` does, so it takes its own taps. */
export function GroceryListCard({
  list,
  entries,
  canAdd,
  errorMessage,
  onOpen,
  onAdd,
}: GroceryListCardProps) {
  const [capturing, setCapturing] = useState(false)

  return (
    <ItemCard
      align="stretch"
      // Dimming a field being typed into would be its own bug — an empty list
      // un-dims for as long as it is the one capturing.
      dimmed={list.itemCount === 0 && !capturing}
      onActivate={onOpen}
      activateLabel={`Open ${list.name}`}
      className="flex-col gap-0 py-0"
    >
      <div className="flex min-h-row-touch items-center gap-2.5">
        <span className="text-list-title min-w-0 flex-1 truncate text-foreground">{list.name}</span>
        <span className="text-sm-token shrink-0 text-muted-foreground">
          {countLabel(list.itemCount)}
        </span>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      </div>

      {canAdd && (
        <div className="relative z-20 min-h-11 border-t border-border">
          {capturing ? (
            <GroceryCompletionField
              entries={entries}
              variant="row"
              autoFocus
              placeholder={`Add to ${list.name}…`}
              ariaLabel={`Add to ${list.name}`}
              onSubmit={onAdd}
              onCancel={() => setCapturing(false)}
            />
          ) : (
            <button
              type="button"
              onClick={() => setCapturing(true)}
              className="text-base-token flex h-11 w-full items-center gap-2.5 rounded-card text-left text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset focus-visible:outline-none"
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-card bg-muted">
                <Plus className="size-3.5" aria-hidden />
              </span>
              <span className="truncate">Add to {list.name}…</span>
            </button>
          )}
          {errorMessage && <p className="text-sm-token pb-2 text-destructive">{errorMessage}</p>}
        </div>
      )}
    </ItemCard>
  )
}
