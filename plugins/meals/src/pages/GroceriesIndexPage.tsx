import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import {
  FAMILY_PROFILE_ID,
  useAuth,
  useMutation,
  usePermissions,
  useQuery,
  useQueryClient,
} from '@family-os/platform'
import { ErrorCard } from '@family-os/ui'
import type { GroceryEntriesResponse, GroceryList, GroceryListsResponse } from '../types'
import { GroceriesIndexPageView } from './GroceriesIndexPageView'

export function GroceriesIndexPage() {
  const { id } = useAuth()
  const ability = usePermissions()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [addError, setAddError] = useState<{ listId: string; message: string } | null>(null)
  const [createListError, setCreateListError] = useState<string | null>(null)

  // `ability.can`, not a tier baseline (ADR 018) — `meals.grocery.add` is a
  // revocable key, and a kid whose parent revoked it must not be shown a field
  // that 403s. The family dashboard is separate: it has nobody to attribute to.
  const canAdd = id !== FAMILY_PROFILE_ID && ability.can('create', 'meals.GroceryItem')
  const canCreateList = ability.can('create', 'meals.GroceryList')

  // Shares the 'meals/groceries' key prefix with the per-list view (ADR 013)
  // — one invalidation refreshes both.
  const listsQuery = useQuery<GroceryListsResponse>({
    queryKey: ['meals/groceries', 'lists'],
    queryFn: () =>
      fetch('/api/groceries/lists').then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<GroceryListsResponse>
      }),
    retry: 1,
  })

  // The ghost completion's dictionary — what this family has added before, on
  // the same key prefix so an add refreshes it too (design gate amendment).
  const entriesQuery = useQuery<GroceryEntriesResponse>({
    queryKey: ['meals/groceries', 'entries'],
    queryFn: () =>
      fetch('/api/groceries/entries').then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<GroceryEntriesResponse>
      }),
    retry: 1,
  })

  const lists = listsQuery.data?.lists ?? []

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['meals/groceries'] })

  const addItem = useMutation({
    mutationFn: ({ listId, name }: { listId: string; name: string }) =>
      fetch(`/api/groceries/lists/${listId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      }).then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json()
      }),
    onSuccess: () => {
      setAddError(null)
      void invalidate()
    },
    // No blind catch (CLAUDE.md): logged for whoever's watching the console,
    // and surfaced on the card whose composer failed — a kid on the fridge
    // tablet has no devtools, and every list has its own composer now.
    onError: (err, { listId }) => {
      console.error('[groceries] add failed', err)
      setAddError({ listId, message: "Couldn't add that — try again." })
    },
  })

  const createList = useMutation({
    mutationFn: (name: string) =>
      fetch('/api/groceries/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      }).then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<GroceryList>
      }),
    // Straight into the new list. A runtime list is only visible while it holds
    // items (design gate), so a freshly-created one is filtered off the index
    // the instant it is made — leaving the creator on a page their new list is
    // not on, with no way to put the first thing in it. Landing inside it keeps
    // that rule intact and still ends somewhere usable.
    onSuccess: (list) => {
      setCreateListError(null)
      void invalidate()
      navigate(`/groceries/${list.id}`)
    },
    onError: (err) => {
      console.error('[groceries] list creation failed', err)
      setCreateListError("Couldn't create that list — try again.")
    },
  })

  if (listsQuery.isLoading || entriesQuery.isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (listsQuery.isError || entriesQuery.isError) {
    return (
      <div className="p-6">
        <ErrorCard
          moduleName="Groceries"
          onRetry={() => {
            void listsQuery.refetch()
            void entriesQuery.refetch()
          }}
        />
      </div>
    )
  }

  return (
    <GroceriesIndexPageView
      lists={lists}
      entries={entriesQuery.data?.entries ?? []}
      canAdd={canAdd}
      canCreateList={canCreateList}
      addError={addError}
      createListError={createListError}
      onOpenList={(list) => navigate(`/groceries/${list.id}`)}
      onAdd={(list, name) => addItem.mutateAsync({ listId: list.id, name }).then(() => {})}
      onCreateList={(name) => createList.mutateAsync(name).then(() => {})}
    />
  )
}
