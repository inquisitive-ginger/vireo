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
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [createListError, setCreateListError] = useState<string | null>(null)

  const canAdd = id !== FAMILY_PROFILE_ID
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
      setErrorMessage(null)
      void invalidate()
    },
    // No blind catch (CLAUDE.md): logged for whoever's watching the console,
    // and surfaced in the page — a kid on the fridge tablet has no devtools.
    onError: (err) => {
      console.error('[groceries] add failed', err)
      setErrorMessage("Couldn't add that — try again.")
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
    onSuccess: () => {
      setCreateListError(null)
      void invalidate()
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
      errorMessage={errorMessage}
      createListError={createListError}
      onOpenList={(list) => navigate(`/groceries/${list.id}`)}
      onAdd={(list, name) => addItem.mutateAsync({ listId: list.id, name }).then(() => {})}
      onCreateList={(name) => createList.mutateAsync(name).then(() => {})}
    />
  )
}
