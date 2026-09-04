import { useMemo, useState } from 'react'
import { useAuth, useMutation, useQuery, useQueryClient } from '@family-os/platform'
import type { RecentResponse, ShoppingItem } from '../types'
import { fileAisle, normalizeItemName } from './filing'

/* The Home widget's read and write. `/shopping` has its own container because
   it selects a destination and draws the aisle list, neither of which a widget
   does — but both reach the same endpoint under the same key, so an add on
   either refreshes both. */

function json<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(String(res.status))
  return res.json() as Promise<T>
}

export interface AmbientCapture {
  data: RecentResponse | undefined
  loading: boolean
  error: boolean
  refetch: () => void
  /** Everything still waiting, everywhere. */
  openCount: number
  /** Where an ambient add lands: the first destination, same default the page
      opens on. The widget offers no picker: it is one line on a dashboard, and
      any control before the word is a tap the notepad does not charge. */
  destination: string | null
  destinationId: string | null
  onDraftChange: (draft: string) => void
  /** The aisle the SERVER would pick for the current draft, corrections and all.
      Null while the field is empty — the echo exists between typing and
      committing, and nowhere else (ADR 070). */
  draftAisle: string | null
  add: (name: string) => void
  /** The name that failed to land. The field has already cleared by then, so
      this is the only thing standing between the person and a lost word. */
  addError: string | null
  canAdd: boolean
}

export function useAmbientCapture(canAdd: boolean): AmbientCapture {
  const { id } = useAuth()
  const queryClient = useQueryClient()
  const [draft, setDraft] = useState('')
  const [addError, setAddError] = useState<string | null>(null)

  // Under the page's own `shopping/list` prefix, so one invalidation from any
  // add — here, on the route, or from the meals needs-push — refreshes both
  // layouts of the page and the widget together (ADR 013/022).
  const recent = useQuery<RecentResponse>({
    queryKey: ['shopping/list', id, 'recent'],
    queryFn: () => fetch('/api/shopping/recent').then(json<RecentResponse>),
    retry: 1,
  })

  const lists = recent.data?.lists ?? []
  const destinationList = lists[0] ?? null

  const draftAisle = useMemo(() => {
    const trimmed = draft.trim()
    if (!trimmed) return null
    const overrides = recent.data?.overrides ?? {}
    return String(fileAisle(trimmed, overrides[normalizeItemName(trimmed)] ?? null))
  }, [draft, recent.data])

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
      // Nobody at a fridge tablet is holding devtools, and the field cleared the
      // moment they hit Enter — so the reason goes to the console AND the name
      // goes back on the screen.
      console.error('[shopping] could not add %s', variables.name, err)
      setAddError(variables.name)
    },
  })

  return {
    data: recent.data,
    loading: recent.isPending,
    error: recent.isError,
    refetch: () => void recent.refetch(),
    openCount: lists.reduce((sum, l) => sum + l.itemCount, 0),
    destination: destinationList?.name ?? null,
    destinationId: destinationList?.id ?? null,
    onDraftChange: setDraft,
    draftAisle,
    add: (name) => {
      if (!destinationList) return
      addItem.mutate({ listId: destinationList.id, name })
      setDraft('')
    },
    addError,
    canAdd,
  }
}
