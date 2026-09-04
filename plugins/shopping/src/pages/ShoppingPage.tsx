import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth, useMutation, usePermissions, useQuery, useQueryClient } from '@family-os/platform'
import { ErrorCard } from '@family-os/ui'
import type { ListResponse, ListsResponse, RecentResponse, ShoppingItem } from '../types'
import { aisleSortIndex, fileAisle, normalizeItemName } from '../lib/filing'
import { useWideLayout } from '../lib/use-wide-layout'
import { ShoppingPageView, type AisleGroup } from './ShoppingPageView'

/** How many chips the wide layout's short memory holds. More than a row's worth
    stops being a memory and starts being the list it sits above. */
const JUST_ADDED = 5

function json<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(String(res.status))
  return res.json() as Promise<T>
}

/** One group per aisle, in walk order. A list with no aisles of ours is ONE
    group in the order the server sent — regrouping it by category would reorder
    a flat list behind the shopper's back. */
function toGroups(items: ShoppingItem[], groupByAisle: boolean): AisleGroup[] {
  if (!groupByAisle) return items.length ? [{ aisle: '', items }] : []
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
  // The viewport picks the layout — never the profile (2026-09-04 live review).
  // A tablet and up is W2 relocated: capture only, with `Show lists` swapping to
  // the list at its own URL. A phone is always the scrolling list, which already
  // carries a capture field at its top — it needs no dedicated capture view and
  // is given none.
  //
  // `/shopping/lists` is a ROUTE rather than component state because the control
  // replaces a whole screen of content: swapping that behind an unchanged URL
  // breaks the back button, which on a tablet is the gesture a reader reaches
  // for first. A phone landing here directly gets the list it would have got at
  // `/shopping` anyway.
  const wide = useWideLayout()
  const navigate = useNavigate()
  const onListsRoute = useLocation().pathname.startsWith('/shopping/lists')
  const capturing = wide && !onListsRoute
  const ability = usePermissions()
  const queryClient = useQueryClient()
  const [selectedListId, setSelectedListId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [addError, setAddError] = useState<string | null>(null)
  const [retractError, setRetractError] = useState<string | null>(null)

  // The house adds too (ADR 072) — the wall-mounted tablet runs as the family
  // profile and capture is its whole job. What can close the field is the
  // revocation ADR 072 §6 names as the lever: `shopping.item.add` off for one
  // profile. Ability, never a tier or an id (ADR 018).
  const canAdd = ability.can('create', 'shopping.Item')
  // Taking back your own recent add is `retract`, tier 1 (ADR 073) — no longer
  // the tier-4 delete verb, which left the wall unable to undo its own typos.
  // Whether a given ROW qualifies is the server's answer (`canRetract`), since
  // it owns the clock and `added_by` never reaches the client.
  const canRetract = ability.can('retract', 'shopping.Item')

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

  // Wide only: what landed lately, anywhere. Same key the Home widget reads, so
  // the two share one cache entry and one invalidation.
  const recentQuery = useQuery<RecentResponse>({
    queryKey: ['shopping/list', id, 'recent'],
    queryFn: () => fetch('/api/shopping/recent').then(json<RecentResponse>),
    enabled: capturing,
    retry: 1,
  })

  const openItems = useMemo(
    () => (listQuery.data?.items ?? []).filter((i) => i.status === 'needed'),
    [listQuery.data]
  )

  const groups = useMemo(
    () => toGroups(openItems, selected?.groupByAisle ?? true),
    [openItems, selected]
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

  const retractItem = useMutation({
    mutationFn: async ({ itemId }: { itemId: string; name: string }) => {
      const res = await fetch(`/api/shopping/items/${itemId}/retract`, { method: 'POST' })
      if (!res.ok) {
        // The window closes between fetches by design (ADR 073 §2), so this 403
        // is an expected outcome, not an anomaly — and it MUST be shown. A
        // swallowed one leaves someone tapping a control that silently does
        // nothing, on a screen with no devtools behind it.
        const body = (await res.json().catch(() => null)) as { error?: string } | null
        throw new Error(body?.error ?? String(res.status))
      }
    },
    onSuccess: () => {
      setRetractError(null)
      void queryClient.invalidateQueries({ queryKey: ['shopping/list'] })
    },
    onError: (err, variables) => {
      console.error('[shopping] could not take back %s', variables.name, err)
      setRetractError(
        /too old/i.test(String(err))
          ? `Too late to take back “${variables.name}” — it has been on the list a while.`
          : `Couldn’t take back “${variables.name}”.`
      )
    },
  })

  if (listsQuery.isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // `&& !data`: TanStack keeps `data` and still reports `error` when a
  // BACKGROUND refetch fails — which is exactly what every add triggers via
  // `invalidateQueries`. Without the guard, adding milk at the fridge over a
  // wifi blip replaces a correct list with a Retry button nobody is standing
  // there to tap. Stale rows beat no rows; a failed refetch is not a failed read.
  const readFailed =
    (listsQuery.isError && !listsQuery.data) || (listQuery.isError && !listQuery.data)

  if (readFailed) {
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
      onAdd={(name) => {
        if (!activeListId) return
        addItem.mutate({ listId: activeListId, name })
        setDraft('')
      }}
      onDraftChange={setDraft}
      draftAisle={draftAisle}
      addError={addError}
      canAdd={canAdd}
      layout={capturing ? 'capture' : 'list'}
      // Only the wide list view offers the way back; a phone has no dedicated
      // capture view to return to (Zach, 2026-09-04).
      onBackToCapture={wide && onListsRoute ? () => void navigate('/shopping') : undefined}
      justAdded={(recentQuery.data?.items ?? [])
        .slice(0, JUST_ADDED)
        .map((i) => ({ id: i.id, name: i.name, canRetract: i.canRetract }))}
      totalOpenCount={lists.reduce((sum, l) => sum + l.itemCount, 0)}
      onShowLists={() => void navigate('/shopping/lists')}
      onRetract={canRetract ? (itemId, name) => retractItem.mutate({ itemId, name }) : undefined}
      retractError={retractError}
    />
  )
}
