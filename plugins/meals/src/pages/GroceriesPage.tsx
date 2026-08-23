import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import {
  FAMILY_PROFILE_ID,
  useAuth,
  useMutation,
  useQuery,
  useQueryClient,
} from '@family-os/platform'
import { ErrorCard } from '@family-os/ui'
import type { GroceriesResponse, GroceryItem, Staple, StaplesResponse } from '../types'
import { GroceriesPageView } from './GroceriesPageView'

// How long the just-added row holds its primary-tint flash (design.md §M5/6:
// "did my add land?"). Long enough to register, short enough to still read as
// a pulse rather than a persistent status.
const FLASH_MS = 1400

export function GroceriesPage() {
  const { id } = useAuth()
  const queryClient = useQueryClient()
  const [flashItemId, setFlashItemId] = useState<string | null>(null)

  const canAdd = id !== FAMILY_PROFILE_ID

  // Shares the 'meals/groceries' key prefix with anything else that reads the
  // list (ADR 013) — one invalidation refreshes every consumer.
  const itemsQuery = useQuery<GroceriesResponse>({
    queryKey: ['meals/groceries', id],
    queryFn: () =>
      fetch('/api/groceries').then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<GroceriesResponse>
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

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['meals/groceries'] })

  useEffect(() => {
    if (!flashItemId) return
    const timer = setTimeout(() => setFlashItemId(null), FLASH_MS)
    return () => clearTimeout(timer)
  }, [flashItemId])

  const addItem = useMutation({
    mutationFn: (name: string) =>
      fetch('/api/groceries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      }).then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<GroceryItem>
      }),
    onSuccess: (item) => {
      setFlashItemId(item.id)
      void invalidate()
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
    onSuccess: () => void invalidate(),
  })

  if (itemsQuery.isLoading || staplesQuery.isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (itemsQuery.isError || staplesQuery.isError) {
    return (
      <div className="p-6">
        <ErrorCard
          moduleName="Groceries"
          onRetry={() => {
            void itemsQuery.refetch()
            void staplesQuery.refetch()
          }}
        />
      </div>
    )
  }

  return (
    <GroceriesPageView
      items={itemsQuery.data?.items ?? []}
      staples={staplesQuery.data?.staples ?? []}
      canAdd={canAdd}
      flashItemId={flashItemId}
      onAdd={(name) => addItem.mutate(name)}
      onTapStaple={(staple: Staple) => addItem.mutate(staple.name)}
      onCorrect={(item, category) => correctAisle.mutate({ item, category })}
    />
  )
}
