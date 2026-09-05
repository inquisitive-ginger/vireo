import { useState } from 'react'
import { useAuth, useMutation, useQuery, useQueryClient } from '@family-os/platform'
import type { AddItemResponse, CaptureReport, RecentResponse } from '../types'
import { EMPTY_CAPTURE, buildReport, dismissReport, type CaptureState } from './capture-report'

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
  /** Everything still waiting, everywhere — the same "what's left" arithmetic
      every other surface counts by, at the scope this one states (D6). */
  openCount: number
  /** Where an ambient add lands: the first destination, same default the page
      opens on. The widget offers no picker: it is one line on a dashboard, and
      any control before the word is a tap the notepad does not charge. */
  destination: string | null
  destinationId: string | null
  add: (name: string) => void
  /** The one line the tile reports on, already ranked (D4). Errors are STICKY
      and counted — a later success never clears one. */
  report: CaptureReport | null
  canAdd: boolean
}

export function useAmbientCapture(canAdd: boolean, canRetract: boolean): AmbientCapture {
  const { id } = useAuth()
  const queryClient = useQueryClient()
  const [capture, setCapture] = useState<CaptureState>(EMPTY_CAPTURE)

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

  const addItem = useMutation({
    mutationFn: ({ listId, name }: { listId: string; name: string }) =>
      fetch(`/api/shopping/lists/${listId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      }).then(json<AddItemResponse>),
    onSuccess: (data, variables) => {
      // No error clearing here, and that is the whole of D4: "milk" failing and
      // then "eggs" landing must not erase the record that milk was lost.
      setCapture((state) => ({
        ...state,
        duplicate: data.duplicateOf
          ? {
              listName: lists.find((l) => l.id === variables.listId)?.name ?? 'the list',
              name: data.item.name,
              retractId: canRetract && data.item.canRetract ? data.item.id : null,
            }
          : null,
      }))
      void queryClient.invalidateQueries({ queryKey: ['shopping/list'] })
    },
    onError: (err, variables) => {
      // Nobody at a fridge tablet is holding devtools, and the field cleared the
      // moment they hit Enter — so the reason goes to the console AND the name
      // goes back on the screen.
      console.error('[shopping] could not add %s', variables.name, err)
      setCapture((state) => ({ ...state, addErrors: [variables.name, ...state.addErrors] }))
    },
  })

  const retractItem = useMutation({
    mutationFn: async ({ itemId }: { itemId: string; name: string }) => {
      const res = await fetch(`/api/shopping/items/${itemId}/retract`, { method: 'POST' })
      if (!res.ok) {
        // The window closes between fetches by design (ADR 073 §2), so this 403
        // is an expected outcome and MUST be shown rather than swallowed.
        const body = (await res.json().catch(() => null)) as { error?: string } | null
        throw new Error(body?.error ?? String(res.status))
      }
    },
    onSuccess: () => {
      setCapture((state) => ({ ...state, duplicate: null }))
      void queryClient.invalidateQueries({ queryKey: ['shopping/list'] })
    },
    onError: (err, variables) => {
      console.error('[shopping] could not take back %s', variables.name, err)
      setCapture((state) => ({ ...state, actionError: retractMessage(err, variables.name) }))
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
    add: (name) => {
      if (!destinationList) return
      addItem.mutate({ listId: destinationList.id, name })
    },
    report: buildReport(capture, {
      onDismiss: () => setCapture(dismissReport),
      onRetract: (itemId) =>
        retractItem.mutate({ itemId, name: capture.duplicate?.name ?? 'that' }),
    }),
    canAdd,
  }
}

/** The 403 at the boundary reads as an outcome, not a fault: the window closed
    between the fetch that drew the control and the tap on it. */
export function retractMessage(err: unknown, name: string): string {
  return /too old/i.test(String(err))
    ? `Too late to take back “${name}” — it has been on the list a while.`
    : `Couldn’t take back “${name}”.`
}
