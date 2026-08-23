import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button, Chip, Input, ListRow, PageContainer, cn } from '@family-os/ui'
import type { GroceryItem, Staple } from '../types'
import { AISLES, aisleSortIndex } from '../lib/grocery-filing'

export interface GroceriesPageViewProps {
  items: GroceryItem[]
  staples: Staple[]
  canAdd: boolean
  /** The just-added item — flashes primary-tint in place, in its aisle, the
      answer to "did my add land?" (design.md §M5/6). Cleared by the container
      after the flash plays. */
  flashItemId: string | null
  onAdd: (name: string) => void
  onTapStaple: (staple: Staple) => void
  onCorrect: (item: GroceryItem, category: string) => void
}

const CORRECTABLE_AISLES = AISLES.filter((a) => a !== 'Other')

/* ADR 063/064 applied: `ListRow`, no identity chrome — the person who added an
   item, or whose meal it's for, is the note line, never a spine or avatar.
   Add bar sits bottom on the phone (thumb zone) and top on the wall (`md:`,
   the settled tablet/mobile split, design-system.md §Tablet), where the width
   exists and reach doesn't constrain (design.md §M5/6). */
export function GroceriesPageView({
  items,
  staples,
  canAdd,
  flashItemId,
  onAdd,
  onTapStaple,
  onCorrect,
}: GroceriesPageViewProps) {
  const groups = useMemo(() => {
    const byAisle = new Map<string, GroceryItem[]>()
    for (const item of items) {
      const list = byAisle.get(item.category) ?? []
      list.push(item)
      byAisle.set(item.category, list)
    }
    return [...byAisle.entries()].sort(([a], [b]) => aisleSortIndex(a) - aisleSortIndex(b))
  }, [items])

  return (
    <PageContainer width="list">
      <h1 className="text-page-title text-foreground">Groceries</h1>

      {canAdd && (
        <div className="hidden md:block">
          <AddBar staples={staples} onAdd={onAdd} onTapStaple={onTapStaple} layout="wide" />
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-base-token mt-6 text-muted-foreground">
          Nothing on the list — add something below.
        </p>
      ) : (
        <div className="mt-5 flex flex-col pb-4">
          {groups.map(([aisle, aisleItems]) => (
            <section key={aisle}>
              <div className="sticky top-0 z-10 flex items-baseline justify-between border-b border-border bg-background pb-1.5 pt-3">
                <span className="text-aisle-head text-foreground">{aisle}</span>
                <span className="text-sm-token text-muted-foreground">
                  {aisleItems.length === 1 ? '1 left' : `${aisleItems.length} left`}
                </span>
              </div>
              {aisleItems.map((item) => (
                <GroceryRow
                  key={item.id}
                  item={item}
                  flash={item.id === flashItemId}
                  onCorrect={onCorrect}
                />
              ))}
            </section>
          ))}
        </div>
      )}

      {canAdd && (
        <div className="sticky bottom-[calc(var(--spacing-tab-bar)+env(safe-area-inset-bottom))] z-20 border-t border-border bg-background pt-2 pb-2 md:hidden">
          <AddBar staples={staples} onAdd={onAdd} onTapStaple={onTapStaple} layout="narrow" />
        </div>
      )}
    </PageContainer>
  )
}

function GroceryRow({
  item,
  flash,
  onCorrect,
}: {
  item: GroceryItem
  flash: boolean
  onCorrect: (item: GroceryItem, category: string) => void
}) {
  return (
    <ListRow
      leading={
        <span className="size-[26px] shrink-0 rounded-full border-2 border-border" aria-hidden />
      }
      className={cn(
        'items-start py-2 transition-colors duration-[var(--duration-slow)]',
        flash && 'bg-primary/13'
      )}
    >
      <div className="min-w-0 flex-1 py-1">
        <div className="flex items-baseline gap-2">
          <span className="text-list-title truncate text-foreground">{item.name}</span>
          {item.quantity && (
            <span className="text-sm-token shrink-0 text-muted-foreground">{item.quantity}</span>
          )}
        </div>
        {item.note && (
          <span className="text-sm-token block truncate text-muted-foreground">{item.note}</span>
        )}
        {item.category === 'Other' && (
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span className="text-xs-body text-muted-foreground">Which aisle?</span>
            {CORRECTABLE_AISLES.map((aisle) => (
              <Chip
                key={aisle}
                selected={false}
                onClick={() => onCorrect(item, aisle)}
                className="px-2.5 py-0.5 text-xs-body"
              >
                {aisle}
              </Chip>
            ))}
          </div>
        )}
      </div>
    </ListRow>
  )
}

function AddBar({
  staples,
  onAdd,
  onTapStaple,
  layout,
}: {
  staples: Staple[]
  onAdd: (name: string) => void
  onTapStaple: (staple: Staple) => void
  layout: 'wide' | 'narrow'
}) {
  const [value, setValue] = useState('')

  const submit = () => {
    const name = value.trim()
    if (!name) return
    onAdd(name)
    setValue('')
  }

  const typed = value.trim().toLowerCase()
  const suggestions = typed
    ? staples.filter((s) => s.name.toLowerCase().includes(typed)).slice(0, 6)
    : staples

  const chipStrip = suggestions.length > 0 && (
    <div className={cn('flex flex-wrap gap-1.5', layout === 'wide' ? 'max-w-md' : '')}>
      {suggestions.map((staple) => (
        <Chip key={staple.id} selected={false} onClick={() => onTapStaple(staple)}>
          {staple.name}
        </Chip>
      ))}
    </div>
  )

  const bar = (
    <div className="flex items-center gap-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit()
        }}
        placeholder="Add to the list…"
        aria-label="Add to the grocery list"
        className="flex-1"
      />
      <Button type="button" size="icon" aria-label="Add" onClick={submit} disabled={!value.trim()}>
        <Plus className="size-4" aria-hidden />
      </Button>
    </div>
  )

  if (layout === 'wide') {
    return (
      <div className="flex items-center gap-4 border-b border-border pb-4">
        <div className="max-w-xs flex-1">{bar}</div>
        {chipStrip}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 px-4">
      {chipStrip}
      {bar}
    </div>
  )
}
