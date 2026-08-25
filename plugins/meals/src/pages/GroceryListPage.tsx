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
import type { GroceryEntriesResponse, GroceryItem, GroceryListResponse } from '../types'
import { GroceryListPageView } from './GroceryListPageView'

// How long the just-added row holds its primary-tint flash (design.md §M5/6:
// "did my add land?"). Long enough to register, short enough to still read as
// a pulse rather than a persistent status.
const FLASH_MS = 1400

export function GroceryListPage({ listId }: { listId: string }) {
  const { id } = useAuth()
  const ability = usePermissions()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [flashItemId, setFlashItemId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const canAdd = id !== FAMILY_PROFILE_ID
  // The gate is `ability.can`, not a raw tier read (ADR 067) — a `tier >= 4`
  // comparison is a TierGate, a structural ceiling a parent's own override
  // can't reach; teaching a correction is exactly what overrides are for.
  const canCorrect = ability.can('manage', 'meals.GroceryItem')

  // Shares the 'meals/groceries' key prefix with the index (ADR 013) — one
  // invalidation refreshes both.
  const listQuery = useQuery<GroceryListResponse>({
    queryKey: ['meals/groceries', 'lists', listId],
    queryFn: () =>
      fetch(`/api/groceries/lists/${listId}`).then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<GroceryListResponse>
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

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['meals/groceries'] })

  useEffect(() => {
    if (!flashItemId) return
    const timer = setTimeout(() => setFlashItemId(null), FLASH_MS)
    return () => clearTimeout(timer)
  }, [flashItemId])

  const addItem = useMutation({
    mutationFn: (name: string) =>
      fetch(`/api/groceries/lists/${listId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      }).then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<GroceryItem>
      }),
    onSuccess: (item) => {
      setErrorMessage(null)
      setFlashItemId(item.id)
      void invalidate()
    },
    // No blind catch (CLAUDE.md): logged for whoever's watching the console,
    // and surfaced in the page — a kid on the fridge tablet has no devtools.
    onError: (err) => {
      console.error('[groceries] add failed', err)
      setErrorMessage("Couldn't add that — try again.")
    },
  })

  const correctAisle = useMutation({
    mutationFn: ({ item, category }: { item: GroceryItem; category: string }) =>
      fetch(`/api/groceries/${item.id}/aisle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category }),
      }).then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<GroceryItem>
      }),
    onSuccess: () => {
      setErrorMessage(null)
      void invalidate()
    },
    onError: (err) => {
      console.error('[groceries] aisle correction failed', err)
      setErrorMessage("Couldn't refile that — try again.")
    },
  })

  if (listQuery.isLoading || entriesQuery.isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (listQuery.isError || entriesQuery.isError) {
    return (
      <div className="p-6">
        <ErrorCard
          moduleName="Groceries"
          onRetry={() => {
            void listQuery.refetch()
            void entriesQuery.refetch()
          }}
        />
      </div>
    )
  }

  if (!listQuery.data) return null

  return (
    <GroceryListPageView
      list={listQuery.data.list}
      items={listQuery.data.items}
      entries={entriesQuery.data?.entries ?? []}
      canAdd={canAdd}
      canCorrect={canCorrect}
      flashItemId={flashItemId}
      errorMessage={errorMessage}
      onBack={() => navigate('/groceries')}
      onAdd={(name) => addItem.mutateAsync(name).then(() => {})}
      onCorrect={(item, category) => correctAisle.mutate({ item, category })}
    />
  )
}
