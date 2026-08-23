import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button, Chip, Input, ListRow, PageContainer, cn } from '@family-os/ui'
import type { GroceryItem, Staple } from '../types'
import { AISLES, aisleSortIndex } from '../lib/grocery-filing'

export interface GroceriesPageViewProps {
  items: GroceryItem[]
  staples: Staple[]
  canAdd: boolean
  /** Tier 4 (spec.md §Permissions: "tier 4 manages") — gates the "Which
      aisle?" correction, which teaches a family-wide override, not just this
      row. Tier 1–3 still see the item filed under Other, just no prompt to
      act on. */
  canCorrect: boolean
  /** The just-added item — flashes primary-tint in place, in its aisle, the
      answer to "did my add land?" (design.md §M5/6). Cleared by the container
      after the flash plays. */
  flashItemId: string | null
  /** A brief, user-facing line for the last failed add/correct — the "no
      blind catch" rule (CLAUDE.md): a family member on the fridge tablet gets
      no devtools, so a failed mutation must say so, not vanish. Rendered next
      to the add bar on both layouts — where the user's eyes already are right
      after a failed attempt, not the page header, which is off-screen once
      the list has scrolled. */
  errorMessage: string | null
  onAdd: (name: string) => Promise<void>
  onTapStaple: (staple: Staple) => void
  /** `category` is one of the real aisles, or `Other` — "Leave it" (below)
      calls this with `Other`, which teaches the override that makes the
      one-time prompt (AC4) actually stay gone (see `item.hasOverride`). */
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
  canCorrect,
  flashItemId,
  errorMessage,
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
          <AddBar
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
        // the thumb zone (AC3) has to hold regardless of list length.
        <div className="fixed inset-x-0 bottom-[calc(var(--spacing-tab-bar)+env(safe-area-inset-bottom))] z-20 border-t border-border bg-background pt-2 pb-2 md:hidden">
          <AddBar
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

function GroceryRow({
  item,
  flash,
  showCorrection,
  onCorrect,
}: {
  item: GroceryItem
  flash: boolean
  showCorrection: boolean
  onCorrect: (item: GroceryItem, category: string) => void
}) {
  return (
    <ListRow
      leading={
        <span className="size-6.5 shrink-0 rounded-full border-2 border-border" aria-hidden />
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
        {showCorrection && (
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
            <button
              type="button"
              onClick={() => onCorrect(item, 'Other')}
              className="text-xs-body text-muted-foreground underline-offset-2 hover:underline"
            >
              Leave it
            </button>
          </div>
        )}
      </div>
    </ListRow>
  )
}

function AddBar({
  staples,
  errorMessage,
  onAdd,
  onTapStaple,
  layout,
}: {
  staples: Staple[]
  errorMessage: string | null
  onAdd: (name: string) => Promise<void>
  onTapStaple: (staple: Staple) => void
  layout: 'wide' | 'narrow'
}) {
  const [value, setValue] = useState('')

  const submit = async () => {
    const name = value.trim()
    if (!name) return
    try {
      await onAdd(name)
      setValue('')
    } catch {
      // The container already logged and surfaced the failure (errorMessage
      // below) — keeping the typed text here is the recovery: a family
      // member shouldn't have to retype "chicken thighs" after a blip.
    }
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
          if (e.key === 'Enter') void submit()
        }}
        placeholder="Add to the list…"
        aria-label="Add to the grocery list"
        className="flex-1"
      />
      <Button
        type="button"
        size="icon"
        aria-label="Add"
        onClick={() => void submit()}
        disabled={!value.trim()}
      >
        <Plus className="size-4" aria-hidden />
      </Button>
    </div>
  )

  const error = errorMessage && <p className="text-sm-token text-destructive">{errorMessage}</p>

  if (layout === 'wide') {
    return (
      <div className="flex flex-col gap-2 border-b border-border pb-4">
        <div className="flex items-center gap-4">
          <div className="max-w-xs flex-1">{bar}</div>
          {chipStrip}
        </div>
        {error}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 px-4">
      {chipStrip}
      {bar}
      {error}
    </div>
  )
}
