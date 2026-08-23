import { useEffect, useState } from 'react'
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
import type { GroceryList, GroceryListsResponse, Staple, StaplesResponse } from '../types'
import { GroceriesIndexPageView } from './GroceriesIndexPageView'

export function GroceriesIndexPage() {
  const { id } = useAuth()
  const ability = usePermissions()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [addListTargetId, setAddListTargetId] = useState<string>('')
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

  const staplesQuery = useQuery<StaplesResponse>({
    queryKey: ['meals/groceries/staples'],
    queryFn: () =>
      fetch('/api/groceries/staples').then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<StaplesResponse>
      }),
    staleTime: 300_000,
    retry: 1,
  })

  const lists = listsQuery.data?.lists ?? []
  const firstListId = listsQuery.data?.lists[0]?.id

  // The add-to target defaults to the first (permanent) list once the index
  // loads, and never drops back to '' once a real list has been picked.
  useEffect(() => {
    if (!addListTargetId && firstListId) setAddListTargetId(firstListId)
  }, [addListTargetId, firstListId])

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
    onSuccess: (list) => {
      setCreateListError(null)
      setAddListTargetId(list.id)
      void invalidate()
    },
    onError: (err) => {
      console.error('[groceries] list creation failed', err)
      setCreateListError("Couldn't create that list — try again.")
    },
  })

  if (listsQuery.isLoading || staplesQuery.isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (listsQuery.isError || staplesQuery.isError) {
    return (
      <div className="p-6">
        <ErrorCard
          moduleName="Groceries"
          onRetry={() => {
            void listsQuery.refetch()
            void staplesQuery.refetch()
          }}
        />
      </div>
    )
  }

  return (
    <GroceriesIndexPageView
      lists={lists}
      staples={staplesQuery.data?.staples ?? []}
      canAdd={canAdd}
      canCreateList={canCreateList}
      addListTargetId={addListTargetId}
      errorMessage={errorMessage}
      createListError={createListError}
      onSelectAddTarget={setAddListTargetId}
      onOpenList={(list) => navigate(`/groceries/${list.id}`)}
      onAdd={(name) => addItem.mutateAsync({ listId: addListTargetId, name }).then(() => {})}
      onTapStaple={(staple: Staple) =>
        addItem.mutate({ listId: addListTargetId, name: staple.name })
      }
      onCreateList={(name) => createList.mutateAsync(name).then(() => {})}
    />
  )
}
