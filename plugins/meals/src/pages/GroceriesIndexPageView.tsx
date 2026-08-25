import { useState } from 'react'
import { ItemCard, Input, PageContainer } from '@family-os/ui'
import type { GroceryEntry, GroceryList } from '../types'
import { GroceryListCard } from '../components/GroceryListCard'

export interface GroceriesIndexPageViewProps {
  lists: GroceryList[]
  entries: GroceryEntry[]
  canAdd: boolean
  /** Tier 4 (ADR 067) — creating a list commits the household to a trip,
      unlike adding to one already planned. Tiers 1–3 never see the row; it is
      not rendered disabled. */
  canCreateList: boolean
  /** The list an add just failed on, and what to say — the message belongs to
      that card's composer, not to the page. */
  addError: { listId: string; message: string } | null
  createListError: string | null
  onOpenList: (list: GroceryList) => void
  onAdd: (list: GroceryList, name: string) => Promise<void>
  onCreateList: (name: string) => Promise<void>
}

/* The index (dev-ready artifact §1): lists lead the page and are its subject —
   nothing sits above them, and there is no page-level composer, because every
   list row carries its own. That is option B; the two builds that put a
   composer on top and an index under it were the same mistake twice. */
export function GroceriesIndexPageView({
  lists,
  entries,
  canAdd,
  canCreateList,
  addError,
  createListError,
  onOpenList,
  onAdd,
  onCreateList,
}: GroceriesIndexPageViewProps) {
  const [creating, setCreating] = useState(false)
  const [newListName, setNewListName] = useState('')

  const submitNewList = async () => {
    const name = newListName.trim()
    if (!name) return
    try {
      await onCreateList(name)
      setNewListName('')
      setCreating(false)
    } catch {
      // createListError below carries the failure — leave the row open with the
      // typed name so a blip doesn't cost a family member their retyping.
    }
  }

  return (
    <PageContainer width="list">
      <h1 className="text-page-title text-foreground">Groceries</h1>

      <div className="mt-5 flex flex-col gap-2">
        {lists.length === 0 && (
          <p className="text-base-token text-muted-foreground">No lists yet.</p>
        )}
        {lists.map((list) => (
          <GroceryListCard
            key={list.id}
            list={list}
            entries={entries}
            canAdd={canAdd}
            errorMessage={addError?.listId === list.id ? addError.message : null}
            onOpen={() => onOpenList(list)}
            onAdd={(name) => onAdd(list, name)}
          />
        ))}

        {canCreateList &&
          (creating ? (
            <>
              <ItemCard align="center" className="py-0 shadow-none">
                <Input
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') void submitNewList()
                    if (e.key === 'Escape') setCreating(false)
                  }}
                  onBlur={() => {
                    if (!newListName.trim()) setCreating(false)
                  }}
                  placeholder="List name…"
                  aria-label="New list name"
                  autoFocus
                  className="text-base-token h-13 flex-1 border-transparent bg-transparent px-0 shadow-none focus-visible:ring-0"
                />
              </ItemCard>
              <p className="text-xs-body px-1 text-muted-foreground">
                Enter to create · Esc to cancel
              </p>
            </>
          ) : (
            <ItemCard
              align="center"
              className="min-h-13 border-dashed bg-transparent py-0 text-muted-foreground shadow-none"
              onActivate={() => setCreating(true)}
              activateLabel="Create a new list"
            >
              <span className="text-base-token min-w-0 flex-1">+ New list</span>
            </ItemCard>
          ))}

        {createListError && (
          <p className="text-sm-token px-1 text-destructive">{createListError}</p>
        )}
      </div>
    </PageContainer>
  )
}
