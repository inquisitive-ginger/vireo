import { useMemo, useState } from 'react'
import { Loader2 } from 'lucide-react'
import {
  FAMILY_PROFILE_ID,
  useAuth,
  useMutation,
  useQuery,
  useQueryClient,
} from '@family-os/platform'
import { ErrorCard } from '@family-os/ui'
import type { ListResponse, ListsResponse, ShoppingItem } from '../types'
import { aisleSortIndex, fileAisle, normalizeItemName } from '../lib/filing'
import { ShoppingPageView, type AisleGroup } from './ShoppingPageView'

// The row's second line says "just now" while the add is still the thing you
// are looking at — the window someone is standing in an aisle watching a phone.
const JUST_NOW_MS = 5 * 60 * 1000

function json<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(String(res.status))
  return res.json() as Promise<T>
}

function groupByAisle(items: ShoppingItem[]): AisleGroup[] {
  const groups: AisleGroup[] = []
  for (const item of items) {
    const last = groups[groups.length - 1]
    if (last?.aisle === item.category) last.items.push(item)
    else groups.push({ aisle: item.category, items: [item] })
  }
  return groups.sort((a, b) => aisleSortIndex(a.aisle) - aisleSortIndex(b.aisle))
}

export function ShoppingPage() {
  const { id } = useAuth()
  const queryClient = useQueryClient()
  const [selectedListId, setSelectedListId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [addError, setAddError] = useState<string | null>(null)

  const canAdd = id !== FAMILY_PROFILE_ID

  // Profile-scoped, under one `shopping/list` prefix the M5.5/5 widget reuses,
  // so a single invalidation refreshes the page and the widget together.
  const listsQuery = useQuery<ListsResponse>({
    queryKey: ['shopping/list', id, 'index'],
    queryFn: () => fetch('/api/shopping/lists').then(json<ListsResponse>),
    retry: 1,
  })

  const lists = useMemo(() => listsQuery.data?.lists ?? [], [listsQuery.data])
  const activeListId = selectedListId ?? lists[0]?.id ?? null
  const selected = lists.find((l) => l.id === activeListId)

  const listQuery = useQuery<ListResponse>({
    queryKey: ['shopping/list', id, activeListId],
    queryFn: () => fetch(`/api/shopping/lists/${activeListId}`).then(json<ListResponse>),
    enabled: activeListId !== null,
    retry: 1,
  })

  const openItems = useMemo(
    () => (listQuery.data?.items ?? []).filter((i) => i.status === 'needed'),
    [listQuery.data]
  )

  const now = Date.now()
  const groups = useMemo(
    () =>
      groupByAisle(
        openItems.map((item) =>
          item.note && now - new Date(item.addedAt).getTime() < JUST_NOW_MS
            ? { ...item, note: `${item.note} · just now` }
            : item
        )
      ),
    // `now` is read once per render on purpose — the suffix is cosmetic and
    // settles itself on the next refetch; a ticking timer would re-render the
    // whole list every second in someone's hand.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [openItems]
  )

  // The echo has to state the aisle the SERVER will pick, so it reads the
  // family's corrections, not the bare dictionary.
  const draftAisle = useMemo(() => {
    const trimmed = draft.trim()
    if (!trimmed) return null
    const overrides = listQuery.data?.overrides ?? {}
    return String(fileAisle(trimmed, overrides[normalizeItemName(trimmed)] ?? null))
  }, [draft, listQuery.data])

  const addItem = useMutation({
    mutationFn: ({ listId, name }: { listId: string; name: string }) =>
      fetch(`/api/shopping/lists/${listId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      }).then(json<ShoppingItem>),
    onSuccess: () => {
      setAddError(null)
      void queryClient.invalidateQueries({ queryKey: ['shopping/list'] })
    },
    onError: (err, variables) => {
      // The field already cleared — the word is gone from the screen, so the
      // failure has to name it back or the person never learns what was lost.
      console.error('[shopping] could not add %s', variables.name, err)
      setAddError(variables.name)
    },
  })

  if (listsQuery.isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (listsQuery.isError || listQuery.isError) {
    return (
      <div className="p-6">
        <ErrorCard
          moduleName="Shopping"
          onRetry={() => {
            void listsQuery.refetch()
            void listQuery.refetch()
          }}
        />
      </div>
    )
  }

  // The list read is a SERIAL second fetch — it needs an id from the index — and
  // it restarts on every pill tap. Without this the surface paints "Nothing on
  // Grocery yet." beside a count strip reading 14, which is the one state a
  // shopper must never be shown wrongly. The index already knows the count, so
  // the strip stays true while the rows are still coming.
  const listLoading = activeListId !== null && listQuery.isPending

  return (
    <ShoppingPageView
      lists={lists}
      loading={listLoading}
      selectedListId={activeListId ?? ''}
      onSelectList={(listId) => {
        setSelectedListId(listId)
        setAddError(null)
      }}
      groups={groups}
      openCount={listLoading ? (selected?.itemCount ?? 0) : openItems.length}
      onAdd={(name) => {
        if (!activeListId) return
        addItem.mutate({ listId: activeListId, name })
        setDraft('')
      }}
      onDraftChange={setDraft}
      draftAisle={draftAisle}
      addError={addError}
      canAdd={canAdd}
    />
  )
}
