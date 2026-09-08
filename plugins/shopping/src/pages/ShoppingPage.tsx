import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import {
  useAuth,
  useEventBus,
  useMutation,
  usePermissions,
  useQuery,
  useQueryClient,
} from '@family-os/platform'
import type { QueryClient } from '@family-os/platform'
import { ErrorCard } from '@family-os/ui'
import type { ShoppingAisle } from '@family-os/schemas'
import type {
  AddItemResponse,
  BatchAddResponse,
  ListResponse,
  ListsResponse,
  ShoppingItem,
} from '../types'
import { aisleSortIndex } from '../lib/filing'
import {
  EMPTY_CAPTURE,
  buildReport,
  clearErrors,
  dismissNotice,
  type CaptureState,
} from '../lib/capture-report'
import { MAX_NAMES, parseNames } from '../lib/parse-names'
import { collisions, failedNames, toDuplicate, tooMany } from '../lib/batch-results'
import { retractMessage } from '../lib/use-ambient-capture'
import { useWideLayout } from '../lib/use-wide-layout'
import { useOffline } from '../lib/use-offline'
import {
  OfflineError,
  abandonedChecks,
  drainQueue,
  pruneQueue,
  queueCheck,
  sendCheck,
  type QueuedCheck,
} from '../lib/offline-checks'
import { readQueue, readSnapshot, saveLists, saveListItems, saveQueue } from '../lib/offline-store'
import { OfflinePill } from '../components/OfflinePill'
import { ShoppingPageView, type AisleGroup } from './ShoppingPageView'
import type { ClearScope } from './ClearListMenu'

const CHECK_MUTATION = ['shopping/check'] as const

/** The optimistic row write, shared by the three things that move a row without
    the server having said so: the online mutation's `onMutate`, the offline tap
    that never reaches it, and the rollback when a replay is refused. */
function setRowStatus(
  queryClient: QueryClient,
  key: readonly unknown[],
  itemId: string,
  status: ShoppingItem['status']
) {
  queryClient.setQueryData<ListResponse>(key, (old) =>
    old ? { ...old, items: old.items.map((i) => (i.id === itemId ? { ...i, status } : i)) } : old
  )
}

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
  const { subscribe } = useEventBus()
  const [selectedListId, setSelectedListId] = useState<string | null>(null)
  const [capture, setCapture] = useState<CaptureState>(EMPTY_CAPTURE)
  const [rowErrors, setRowErrors] = useState<Record<string, string>>({})
  const [offline, setOffline] = useOffline()
  // A ref, not state: nothing on screen is derived from the queue — the pill
  // reports the CONNECTION, and the rows report themselves. Keeping it out of
  // state also keeps the drain reading the queue as it is now rather than as it
  // was when the callback was made.
  const queueRef = useRef<QueuedCheck[]>([])

  // A retry that works has to clear what the failure said, or the row keeps
  // reporting a problem it no longer has for the rest of the session.
  const clearRowError = (itemId: string) =>
    setRowErrors((errors) => {
      if (!(itemId in errors)) return errors
      const next = { ...errors }
      delete next[itemId]
      return next
    })

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
  // Tier 2 and the SAME key in both directions (ADR 071 §2) — the person who
  // mis-taps is in an aisle, and the undo has to be reachable by them.
  const canCheck = ability.can('check', 'shopping.Item')
  // Tier 4, and its own action rather than `manage` (ADR 071 §3), so a house can
  // hand a shopping teen the correction without also handing over delete.
  const canFile = ability.can('file', 'shopping.Item')
  // Tier 4, and the same key for rename and remove (D5). No new permission key —
  // "let a lower tier fix their own row" is a product decision (SH-05), not a
  // check widened in a component.
  const canManage = ability.can('manage', 'shopping.Item')

  /* The last thing this device saw, so a shop with no signal opens on rows
     rather than on a Retry button. Only these two reads get a copy: they are the
     ones a person is standing in front of a shelf reading, and every other read
     on this surface is an answer to an act that cannot happen offline anyway.

     It seeds `initialData` and it is dated when it was SAVED, never now — so the
     query is stale on arrival and refetches the instant there is a network. That
     is what keeps AC5 whole: the service worker's network-first `/api` rule is
     untouched, and nothing here can outlive a deploy. */
  const snapshot = useMemo(() => (id ? readSnapshot(id) : null), [id])

  // Profile-scoped, under one `shopping/list` prefix the M5.5/5 widget reuses,
  // so a single invalidation refreshes the page and the widget together.
  const listsQuery = useQuery<ListsResponse>({
    queryKey: ['shopping/list', id, 'index'],
    queryFn: () => fetch('/api/shopping/lists').then(json<ListsResponse>),
    retry: 1,
    initialData: snapshot?.lists?.data,
    initialDataUpdatedAt: snapshot?.lists?.savedAt,
  })

  const lists = useMemo(() => listsQuery.data?.lists ?? [], [listsQuery.data])
  const activeListId = selectedListId ?? lists[0]?.id ?? null
  const selected = lists.find((l) => l.id === activeListId)

  // Keyed by the list the row actually belongs to, not by what is selected right
  // now: a mutation that settles after a pill tap must roll back into the list it
  // came from, or Grocery's rows land under the Costco key until the refetch
  // catches up.
  const keyFor = (listId: string | null) => ['shopping/list', id, listId]

  const cachedList = activeListId ? snapshot?.items[activeListId] : undefined

  const listQuery = useQuery<ListResponse>({
    queryKey: keyFor(activeListId),
    queryFn: () => fetch(`/api/shopping/lists/${activeListId}`).then(json<ListResponse>),
    enabled: activeListId !== null,
    retry: 1,
    initialData: cachedList?.data,
    initialDataUpdatedAt: cachedList?.savedAt,
  })

  /* Saved from the CACHE rather than from the response, so an offline check is
     written down twice: as the row it drew, and as the queue entry that will
     send it. If only the queue survived a reload the row would flip back under
     the shopper on reopening, which is the thing they would notice and not
     believe. */
  useEffect(() => {
    if (id && listsQuery.data) saveLists(id, listsQuery.data)
  }, [id, listsQuery.data])

  useEffect(() => {
    if (id && activeListId && listQuery.data) saveListItems(id, activeListId, listQuery.data)
  }, [id, activeListId, listQuery.data])

  const enqueue = (
    item: ShoppingItem,
    status: ShoppingItem['status'],
    was: ShoppingItem['status'] = item.status
  ) => {
    const next = queueCheck(queueRef.current, {
      itemId: item.id,
      listId: item.listId,
      name: item.name,
      status,
      was,
      queuedAt: Date.now(),
    })
    queueRef.current = next
    if (id) saveQueue(id, next)
  }

  const drain = useCallback(async () => {
    if (queueRef.current.length === 0) return
    const result = await drainQueue(queueRef.current, (entry) =>
      sendCheck(entry.itemId, entry.status)
    )
    queueRef.current = result.remaining
    if (id) saveQueue(id, result.remaining)
    // Anything left means the drain hit a request that never left the device —
    // `drainQueue` stops there rather than burning the tail against a dead
    // radio. The pill goes back up on that evidence, whatever `navigator.onLine`
    // believes about the supermarket's captive wifi.
    setOffline(result.remaining.length > 0)

    for (const { entry, reason } of result.refused) {
      /* The one case where the row on screen is genuinely wrong: the server
         answered, and the answer was no. Put it back where it was and say so —
         without claiming which of a 403, a 404 on a row someone else cleared and
         a 400 it was, since only one of those is worth telling them to retry.
         The reason goes to the console, same rule as the clear-list failure. */
      console.error('[shopping] the list refused a queued check on %s', entry.name, reason)
      setRowStatus(queryClient, ['shopping/list', id, entry.listId], entry.itemId, entry.was)
      setRowErrors((errors) => ({
        ...errors,
        [entry.itemId]: `“${entry.name}” didn’t sync — it’s back the way it was.`,
      }))
    }

    if (result.sent.length > 0 || result.refused.length > 0) {
      await queryClient.invalidateQueries({ queryKey: ['shopping/list'] })
    }
  }, [id, queryClient, setOffline])

  /* What the last trip could not send. Loaded once per profile, pruned before it
     is trusted, and replayed straight away — reopening the app IS the reconnect
     for a phone that was closed in the shop and opened in the car. */
  useEffect(() => {
    if (!id) return
    const { kept, stale } = pruneQueue(readQueue(id), Date.now())
    queueRef.current = kept
    if (stale.length > 0) {
      saveQueue(id, kept)
      console.error('[shopping] gave up on %d unsent check(s)', stale.length, stale)
      setCapture((state) => ({ ...state, actionError: abandonedChecks(stale) }))
    }
    void drain()
  }, [id, drain])

  useEffect(() => {
    const onReconnect = () => void drain()
    window.addEventListener('online', onReconnect)
    return () => window.removeEventListener('online', onReconnect)
  }, [drain])

  // Checked rows stay in the list, in their place (M5.5/4) — the server's order
  // is walk order and a check does not move a row out of it. An item never
  // vanishes from under a thumb.
  const items = useMemo(() => listQuery.data?.items ?? [], [listQuery.data])

  const groups = useMemo(() => toGroups(items, selected?.groupByAisle ?? true), [items, selected])

  // Two phones on one list. The `/events` websocket already broadcasts every bus
  // message to every connected client, so the other shopper's check arrives as
  // an invalidation rather than a poll running all day in a pocket. A refresh is
  // held back while one of our own checks is in flight — its optimistic row is
  // the truth on this screen until the mutation settles, and a refetch landing
  // mid-flight flips the row back under the thumb that just moved it.
  //
  // Held back, NOT dropped: the settle window includes the mutation's own
  // refetch, so a partner's check arriving inside it would otherwise be answered
  // by a response that was already in the air before they tapped, and their item
  // would sit unchecked on our phone until something unrelated happened. The
  // missed beat is replayed once the window closes.
  const missedRefresh = useRef(false)
  // Counted, not a membership set: tapping one row twice before the first
  // settles puts the same id in flight twice, and a plain `delete` would
  // declare the air clear while the second request is still out.
  const inFlightChecks = useRef(new Map<string, number>())
  useEffect(() => {
    const refresh = (payload: unknown) => {
      const itemId = (payload as { itemId?: string } | null)?.itemId
      // `/events` fans out to every socket with no originator on the frame, so
      // our own check comes straight back to us. Answering it would arm the
      // replay on every tap — and the replay exists for the partner's tap.
      if (itemId && inFlightChecks.current.has(itemId)) return
      if (queryClient.isMutating({ mutationKey: CHECK_MUTATION }) > 0) {
        missedRefresh.current = true
        return
      }
      void queryClient.invalidateQueries({ queryKey: ['shopping/list'] })
    }
    // Every transition a second shopper can cause. `removed` and `renamed` were
    // both emitted with nothing listening: ADR 073 §5 added the first one FOR
    // live staleness, and a rename lands on the same argument — one client fixes
    // `mikk` and every other screen keeps reading the typo until something
    // unrelated refetches.
    const offs = (
      [
        'shopping.item.checked',
        'shopping.item.added',
        'shopping.item.removed',
        'shopping.item.renamed',
        // A clear emits ONE event for the whole act and no per-row `removed`
        // (backend, pinned by a test), so this subscription is the only thing
        // that refreshes the other shopper's screen. It fires even when nothing
        // was removed, so the refetch does not depend on the list's contents.
        'shopping.list.cleared',
      ] as const
    ).map((event) => subscribe(event, refresh))
    return () => offs.forEach((off) => off())
  }, [subscribe, queryClient])

  const addItem = useMutation({
    mutationFn: ({ listId, name }: { listId: string; name: string }) =>
      fetch(`/api/shopping/lists/${listId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      }).then(json<AddItemResponse>),
    onSuccess: (data, variables) => {
      // A success does NOT clear a standing error (D4): "milk" failing and then
      // "eggs" landing must not erase the record that milk was lost. Only the
      // `✕` on the line clears it.
      const listName = lists.find((l) => l.id === variables.listId)?.name ?? 'the list'
      setCapture((state) => ({
        ...state,
        duplicates: data.duplicateOf ? [toDuplicate(listName, data.item, canRetract)] : [],
      }))
      void queryClient.invalidateQueries({ queryKey: ['shopping/list'] })
    },
    onError: (err, variables) => {
      // The field already cleared — the word is gone from the screen, so the
      // failure has to name it back or the person never learns what was lost.
      console.error('[shopping] could not add %s', variables.name, err)
      setCapture((state) => ({ ...state, addErrors: [variables.name, ...state.addErrors] }))
    },
  })

  /* `milk, cereal, chicken thighs` on one Enter. The route is NOT atomic, so this
     reads per-name results: what landed reports its collisions, what did not
     joins the sticky error line, and neither costs the other. */
  const addBatch = useMutation({
    mutationFn: ({ listId, names }: { listId: string; names: string[] }) =>
      fetch(`/api/shopping/lists/${listId}/items/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ names }),
      }).then(json<BatchAddResponse>),
    onSuccess: (data, variables) => {
      const listName = lists.find((l) => l.id === variables.listId)?.name ?? 'the list'
      setCapture((state) => ({
        ...state,
        addErrors: [...failedNames(data), ...state.addErrors],
        duplicates: collisions(data, listName, canRetract),
      }))
      void queryClient.invalidateQueries({ queryKey: ['shopping/list'] })
    },
    onError: (err, variables) => {
      console.error('[shopping] could not add %d things', variables.names.length, err)
      setCapture((state) => ({ ...state, addErrors: [...variables.names, ...state.addErrors] }))
    },
  })

  // The body names the TARGET STATE, not a toggle verb: two people tapping the
  // same row a second apart both say `got` and settle there, instead of racing
  // each other back and forth.
  const checkItem = useMutation({
    mutationKey: CHECK_MUTATION,
    mutationFn: ({ item, status }: { item: ShoppingItem; status: ShoppingItem['status'] }) =>
      sendCheck(item.id, status),
    onMutate: async ({ item, status }) => {
      // A shop is where the signal is worst and the thumb is fastest. The row
      // answers immediately and the server confirms behind it.
      const key = keyFor(item.listId)
      inFlightChecks.current.set(item.id, (inFlightChecks.current.get(item.id) ?? 0) + 1)
      await queryClient.cancelQueries({ queryKey: key })
      setRowStatus(queryClient, key, item.id, status)
      clearRowError(item.id)
      // The row's OWN prior status, not a snapshot of the list. Restoring a whole
      // snapshot would undo whatever else landed while this request was in the
      // air: two checks in flight, the second succeeds, the first fails, and the
      // rollback quietly puts the second row back on the list with no error on
      // it — the exact failure the row-scoped rule exists to prevent.
      return { key, was: item.status }
    },
    onError: (err, { item, status }, context) => {
      /* Signal died between the thumb and the server. The row is not WRONG, it
         is unsent — rolling it back would undo a check in front of the person
         who just made it, and throw away the only record that they made it. So
         the optimistic row stands, the tap joins the queue, and the pill says
         why. This is the whole difference between a refusal and a dropout. */
      if (err instanceof OfflineError) {
        console.error('[shopping] queued a check on %s — no signal', item.name, err)
        setOffline(true)
        enqueue(item, status, context?.was ?? item.status)
        return
      }
      if (context) setRowStatus(queryClient, context.key, item.id, context.was)
      // The row goes back to what it was, and says why. Silence here is a person
      // walking away from a shelf believing the thing is in the cart.
      console.error('[shopping] could not mark %s as %s', item.name, status, err)
      setRowErrors((errors) => ({
        ...errors,
        [item.id]: "Didn't reach the list — check your connection and tap again.",
      }))
    },
    onSettled: async (_data, _err, { item }) => {
      const outstanding = (inFlightChecks.current.get(item.id) ?? 1) - 1
      if (outstanding > 0) inFlightChecks.current.set(item.id, outstanding)
      else inFlightChecks.current.delete(item.id)
      await queryClient.invalidateQueries({ queryKey: ['shopping/list'] })
      // Another tap is already in the air — walking an aisle is a run of them —
      // and refetching now would land on top of its optimistic row. The flag
      // stays set; whichever check settles last replays it.
      if (missedRefresh.current && inFlightChecks.current.size === 0) {
        missedRefresh.current = false
        void queryClient.invalidateQueries({ queryKey: ['shopping/list'] })
      }
    },
  })

  // A correction refiles THIS row and teaches a family-wide override, so the
  // next add of the same name files itself correctly for everyone.
  const refileItem = useMutation({
    mutationFn: ({ item, category }: { item: ShoppingItem; category: ShoppingAisle }) =>
      fetch(`/api/shopping/items/${item.id}/aisle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category }),
      }).then(json<ShoppingItem>),
    onMutate: ({ item }) => clearRowError(item.id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['shopping/list'] }),
    onError: (err, { item, category }) => {
      console.error('[shopping] could not refile %s under %s', item.name, category, err)
      setRowErrors((errors) => ({
        ...errors,
        [item.id]: `Couldn’t move this to ${category} — check your connection and try again.`,
      }))
    },
  })

  /* Two verbs on two endpoints, and they read differently to the person holding
     the phone: `retract` takes back YOUR OWN recent add and is tier 1, `manage`
     removes anyone's row and is tier 4 (ADR 073 §1). Both hard-delete, both emit
     `shopping.item.removed`; neither is an undo, which is why the gesture reveals
     rather than fires (D1).

     Where the failure lands is decided by where the tap was. A row's verb reports
     on the row (M5.5/3) — the row is still there to carry the message, and a
     page-scoped line names no row when thirty of them look alike. The wide hero's
     chip and the duplicate notice's `Take it back?` have no row on screen, so
     they report in the one slot they were tapped from. */
  const retractItem = useMutation({
    mutationFn: async ({ itemId }: { itemId: string; name: string; onRow: boolean }) => {
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
    onSuccess: (_data, { itemId, onRow }) => {
      if (onRow) clearRowError(itemId)
      else
        setCapture((state) => ({
          ...state,
          actionError: null,
          duplicates: state.duplicates.filter((d) => d.retractId !== itemId),
        }))
      void queryClient.invalidateQueries({ queryKey: ['shopping/list'] })
    },
    onError: (err, { itemId, name, onRow }) => {
      console.error('[shopping] could not take back %s', name, err)
      const message = retractMessage(err, name)
      if (onRow) setRowErrors((errors) => ({ ...errors, [itemId]: message }))
      else setCapture((state) => ({ ...state, actionError: message }))
    },
  })

  const removeItem = useMutation({
    mutationFn: async ({ item }: { item: ShoppingItem }) => {
      const res = await fetch(`/api/shopping/items/${item.id}`, { method: 'DELETE' })
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null
        throw new Error(body?.error ?? String(res.status))
      }
    },
    onMutate: ({ item }) => clearRowError(item.id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['shopping/list'] }),
    onError: (err, { item }) => {
      console.error('[shopping] could not remove %s', item.name, err)
      setRowErrors((errors) => ({
        ...errors,
        [item.id]: `Couldn’t remove “${item.name}” — check your connection and try again.`,
      }))
    },
  })

  /* Recycling the list, or throwing it away. One route, two scopes, because the
     acts differ in which rows they name and not in what they do — both are hard
     deletes with no undo, which is why the confirmation names the count. */
  const clearList = useMutation({
    mutationFn: async ({ listId, scope }: { listId: string; scope: ClearScope }) => {
      const res = await fetch(`/api/shopping/lists/${listId}/clear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope }),
      })
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null
        throw new Error(body?.error ?? String(res.status))
      }
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['shopping/list'] }),
    onError: (err, { scope }) => {
      /* Page-scoped because the rows it names are gone or were never named — the
         one failure on this surface with no row to report on.

         It claims ONLY what it knows. A 403, a 404 on a list someone else just
         deleted and a dropped connection all land here, and only one of them is
         a connection problem: telling someone to check their wifi when their
         permission was revoked sends them to fix the wrong thing. The reason
         goes to the console, same rule as the server's Zod string — contained,
         not swallowed. */
      console.error('[shopping] could not clear the list (%s)', scope, err)
      setCapture((state) => ({ ...state, actionError: 'Couldn’t clear the list.' }))
    },
  })

  // A rename fixes a typo. It does not re-file the aisle and it does not teach
  // the dictionary (D5) — the asymmetry ADR 073 §4 already recorded for retract.
  const renameItem = useMutation({
    mutationFn: ({ item, name }: { item: ShoppingItem; name: string }) =>
      fetch(`/api/shopping/items/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      }).then(json<ShoppingItem>),
    onMutate: ({ item }) => clearRowError(item.id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['shopping/list'] }),
    onError: (err, { item, name }) => {
      console.error('[shopping] could not rename %s to %s', item.name, name, err)
      setRowErrors((errors) => ({
        ...errors,
        [item.id]: `Couldn’t rename this to “${name}” — check your connection and try again.`,
      }))
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
        {/* Nothing cached to fall back to — a device that has never read this
            list with a signal. The card is right, and it cannot say why on its
            own: "Shopping couldn't load" sends someone looking for a broken app
            instead of a bar of signal. */}
        <OfflinePill offline={offline} />
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
        // The report line is NOT cleared here (D4): a lost word stays reported
        // until the `✕` says otherwise, whichever list is on screen.
        setRowErrors({})
      }}
      groups={groups}
      onAdd={(input) => {
        if (!activeListId) return
        const names = parseNames(input)
        if (names.length === 0) return
        if (names.length > MAX_NAMES) {
          setCapture((state) => ({ ...state, actionError: tooMany(names.length) }))
          return
        }
        // One word keeps the single route it has always had, envelope and all —
        // the common case does not pay for the feature.
        if (names.length === 1) addItem.mutate({ listId: activeListId, name: names[0] })
        else addBatch.mutate({ listId: activeListId, names })
      }}
      reports={buildReport(capture, {
        onClearErrors: () => setCapture(clearErrors),
        onDismissNotice: (index) => setCapture((state) => dismissNotice(state, index)),
        onRetract: (itemId) =>
          retractItem.mutate({
            itemId,
            name: capture.duplicates.find((d) => d.retractId === itemId)?.name ?? 'that',
            onRow: false,
          }),
      })}
      canAdd={canAdd}
      layout={capturing ? 'capture' : 'list'}
      // Only the wide list view offers the way back; a phone has no dedicated
      // capture view to return to (Zach, 2026-09-04).
      onBackToCapture={wide && onListsRoute ? () => void navigate('/shopping') : undefined}
      totalOpenCount={lists.reduce((sum, l) => sum + l.itemCount, 0)}
      onShowLists={() => void navigate('/shopping/lists')}
      canCheck={canCheck}
      canFile={canFile}
      canManage={canManage}
      canRetract={canRetract}
      // The same 768px split the layout itself uses — a row's verbs render
      // inline where there is room for them, and in a bottom sheet where there
      // is not (Zach, live pass on the list surface).
      inlineActions={wide}
      offline={offline}
      onToggle={(item) => {
        const status = item.status === 'got' ? 'needed' : 'got'
        // Known to be offline before the tap: draw the row and write the tap
        // down, rather than spending a request the radio will not carry and
        // making the person wait for it to time out.
        if (offline) {
          setRowStatus(queryClient, keyFor(item.listId), item.id, status)
          clearRowError(item.id)
          enqueue(item, status)
          return
        }
        checkItem.mutate({ item, status })
      }}
      onRefile={(item, category) => refileItem.mutate({ item, category })}
      onRename={(item, name) => renameItem.mutate({ item, name })}
      onRemove={(item) => removeItem.mutate({ item })}
      onRowRetract={(item) => retractItem.mutate({ itemId: item.id, name: item.name, onRow: true })}
      onClear={(scope) => {
        if (activeListId) clearList.mutate({ listId: activeListId, scope })
      }}
      rowErrors={rowErrors}
    />
  )
}
