import { useState } from 'react'
import { ChevronRight, Plus } from 'lucide-react'
import { Button, Chip, ItemCard, Input, PageContainer } from '@family-os/ui'
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

  return (
    <PageContainer width="list">
      <h1 className="text-page-title text-foreground">Groceries</h1>

      {canAdd && (
        <div className="hidden md:block">
          <GroceryAddBar
            staples={staples}
            errorMessage={errorMessage}
            onAdd={onAdd}
            onTapStaple={onTapStaple}
            layout="wide"
            listPicker={listPicker}
          />
        </div>
      )}

      {lists.length === 0 ? (
        <p className="text-base-token mt-6 text-muted-foreground">No lists yet.</p>
      ) : (
        <div className="mt-5 flex flex-col gap-2 pb-36 md:pb-4">
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
        </div>
      )}

      {canCreateList && (
        <div className="mt-4">
          {creating ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Input
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') void submitNewList()
                    if (e.key === 'Escape') setCreating(false)
                  }}
                  placeholder="List name…"
                  aria-label="New list name"
                  autoFocus
                  className="max-w-xs"
                />
                <Button
                  type="button"
                  onClick={() => void submitNewList()}
                  disabled={!newListName.trim()}
                >
                  Create
                </Button>
              </div>
              {createListError && (
                <p className="text-sm-token text-destructive">{createListError}</p>
              )}
            </div>
          ) : (
            <Chip
              selected={false}
              leading={<Plus className="size-3.5" aria-hidden />}
              onClick={() => setCreating(true)}
            >
              New list
            </Chip>
          )}
        </div>
      )}

      {canAdd && (
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
      )}
    </PageContainer>
  )
}
