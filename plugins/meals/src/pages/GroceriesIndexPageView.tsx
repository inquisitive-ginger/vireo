import { useState } from 'react'
import { ChevronRight, Plus } from 'lucide-react'
import { Button, ItemCard, Input, PageContainer } from '@family-os/ui'
import type { GroceryList, Staple } from '../types'
import { GroceryAddBar } from '../components/GroceryAddBar'

export interface GroceriesIndexPageViewProps {
  lists: GroceryList[]
  staples: Staple[]
  canAdd: boolean
  /** Tier 4 (ADR 067) — creating a list commits the household to a trip,
      unlike adding to one already planned. */
  canCreateList: boolean
  addListTargetId: string
  errorMessage: string | null
  createListError: string | null
  onSelectAddTarget: (listId: string) => void
  onOpenList: (list: GroceryList) => void
  onAdd: (name: string) => Promise<void>
  onTapStaple: (staple: Staple) => void
  onCreateList: (name: string) => Promise<void>
}

/* The index (handoff spec: "Home is an index of lists; tap enters one
   full-screen. Not one list grouped by store" — a trip to Costco should never
   show up while standing in the grocery store). */
export function GroceriesIndexPageView({
  lists,
  staples,
  canAdd,
  canCreateList,
  addListTargetId,
  errorMessage,
  createListError,
  onSelectAddTarget,
  onOpenList,
  onAdd,
  onTapStaple,
  onCreateList,
}: GroceriesIndexPageViewProps) {
  const [creating, setCreating] = useState(false)
  const [newListName, setNewListName] = useState('')

  const listPicker =
    canAdd && lists.length > 0
      ? {
          options: lists.map((l) => ({ id: l.id, name: l.name })),
          selectedId: addListTargetId,
          onSelect: onSelectAddTarget,
        }
      : undefined

  const submitNewList = async () => {
    const name = newListName.trim()
    if (!name) return
    try {
      await onCreateList(name)
      setNewListName('')
      setCreating(false)
    } catch {
      // errorMessage below carries the failure — leave the form open with the
      // typed name so a blip doesn't cost a family member their retyping.
    }
  }

  // The index's subject is the list of lists — it leads the page on every
  // width. The composer (destination + field) is secondary: a slim bar that
  // follows the rows, never a block of chips sitting above them.
  return (
    <PageContainer width="list">
      <h1 className="text-page-title text-foreground">Groceries</h1>

      {lists.length === 0 ? (
        <p className="text-base-token mt-6 text-muted-foreground">No lists yet.</p>
      ) : (
        <div className="mt-5 flex flex-col gap-2 pb-28 md:pb-4">
          {lists.map((list) => (
            <ItemCard
              key={list.id}
              align="center"
              dimmed={list.itemCount === 0}
              onActivate={() => onOpenList(list)}
              activateLabel={`Open ${list.name}`}
              trailing={<ChevronRight className="size-4 text-muted-foreground" aria-hidden />}
            >
              <div className="min-w-0 flex-1">
                <span className="text-list-title truncate text-foreground">{list.name}</span>
              </div>
              <span className="text-sm-token shrink-0 text-muted-foreground">
                {list.itemCount === 0
                  ? 'Empty'
                  : list.itemCount === 1
                    ? '1 item'
                    : `${list.itemCount} items`}
              </span>
            </ItemCard>
          ))}

          {canCreateList &&
            (creating ? (
              <div className="flex items-center gap-2 rounded-card border border-dashed border-border px-4 py-2.5">
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
                  className="h-8 flex-1"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => void submitNewList()}
                  disabled={!newListName.trim()}
                >
                  Create
                </Button>
              </div>
            ) : (
              // Ghost row, not a chip — the artifact's idiom for "somewhere an
              // unresolved action can go" (the suggestion sheet's "add as new"
              // row). This affordance was never designed in the gate; this is
              // the smallest one that fits the language already on the page.
              <ItemCard
                align="center"
                className="border-dashed text-muted-foreground"
                onActivate={() => setCreating(true)}
                activateLabel="Create a new list"
              >
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <Plus className="size-4 shrink-0" aria-hidden />
                  <span className="text-list-title">New list</span>
                </div>
              </ItemCard>
            ))}
          {createListError && <p className="text-sm-token text-destructive">{createListError}</p>}
        </div>
      )}

      {canAdd && (
        <>
          <div className="hidden md:mt-4 md:block">
            <GroceryAddBar
              staples={staples}
              errorMessage={errorMessage}
              onAdd={onAdd}
              onTapStaple={onTapStaple}
              layout="wide"
              listPicker={listPicker}
            />
          </div>
          <div className="fixed inset-x-0 bottom-[calc(var(--spacing-tab-bar)+env(safe-area-inset-bottom))] z-20 border-t border-border bg-background pt-2 pb-2 md:hidden">
            <GroceryAddBar
              staples={staples}
              errorMessage={errorMessage}
              onAdd={onAdd}
              onTapStaple={onTapStaple}
              layout="narrow"
              listPicker={listPicker}
            />
          </div>
        </>
      )}
    </PageContainer>
  )
}
