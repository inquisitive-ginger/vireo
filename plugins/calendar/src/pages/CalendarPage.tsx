import { useMemo, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Button, ConfirmDialog, EmptyState, SegmentedControl } from '@family-os/ui'
import {
  FAMILY_PROFILE_ID,
  useAuth,
  useMutation,
  useQuery,
  useQueryClient,
} from '@family-os/platform'
import type { Profile } from '@family-os/platform/types'
import type { CalendarEvent, CalendarView, EventsResponse } from '../types'
import {
  addDays,
  buildWeek,
  dayTitle,
  layoutMonth,
  monthTitle,
  rangeFor,
  weekTitle,
} from '../lib/grid'
import { MonthGrid } from '../components/MonthGrid'
import { DetailView } from '../components/DetailView'
import { CreateEventDrawer, type CreateEventInput } from '../components/CreateEventDrawer'

const VIEW_OPTIONS: { value: CalendarView; label: string }[] = [
  { value: 'month', label: 'Month' },
  { value: 'week', label: 'Week' },
  { value: 'day', label: 'Day' },
]

export function CalendarPage() {
  const { tier } = useAuth()
  // Create / edit / remove are tier-4 only (matches the API's `calendar.Event`
  // write rule and the locked design).
  const canManage = tier >= 4
  const queryClient = useQueryClient()

  const [view, setView] = useState<CalendarView>('month')
  const [cursor, setCursor] = useState<Date>(() => new Date())
  // Stable "now" for the session so the today-circle/dim treatment doesn't churn.
  const today = useMemo(() => new Date(), [])

  // Drawer state: set `editingEvent` → edit mode; `prefillDate` seeds a new
  // event's date (the agenda's per-day "+ Add").
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [prefillDate, setPrefillDate] = useState<Date | null>(null)
  // Set → the remove-confirm dialog is open for this event (recurring → a
  // "Just this week" vs "All events" choice).
  const [removeTarget, setRemoveTarget] = useState<CalendarEvent | null>(null)

  const range = useMemo(() => rangeFor(view, cursor), [view, cursor])

  const eventsQuery = useQuery({
    queryKey: ['calendar/events', { from: range.from, to: range.to }],
    queryFn: () =>
      fetch(`/api/calendar/events?from=${range.from}&to=${range.to}`).then((r) => {
        if (!r.ok) throw new Error('Failed to load events')
        return r.json() as Promise<EventsResponse>
      }),
  })

  const profilesQuery = useQuery({
    queryKey: ['api/profiles'],
    queryFn: () =>
      fetch('/api/profiles').then((r) => {
        if (!r.ok) throw new Error('Failed to load profiles')
        return r.json() as Promise<Profile[]>
      }),
  })

  // The owner chips need the roster; the "family" pseudo-profile isn't a person.
  const members = useMemo(
    () => (profilesQuery.data ?? []).filter((m) => m.id !== FAMILY_PROFILE_ID),
    [profilesQuery.data]
  )
  const membersById = useMemo(() => {
    const map = new Map<string, string>()
    for (const m of profilesQuery.data ?? []) map.set(m.id, m.name)
    return map
  }, [profilesQuery.data])

  // One invalidation refreshes the month view + (story 7) the up-next widget,
  // which share the `['calendar/events']` prefix (ADR 013).
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['calendar/events'] })

  const createEvent = useMutation({
    mutationFn: (input: CreateEventInput) =>
      fetch('/api/calendar/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      }).then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<CalendarEvent>
      }),
    onSuccess: () => {
      invalidate()
      closeDrawer()
    },
  })

  const updateEvent = useMutation({
    mutationFn: ({ id, input }: { id: string; input: CreateEventInput }) =>
      fetch(`/api/calendar/events/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      }).then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<CalendarEvent>
      }),
    onSuccess: () => {
      invalidate()
      closeDrawer()
    },
  })

  // `series` deletes the whole event; `occurrence` skips just that week of a
  // recurring series (story-1 `?occurrence=` support).
  const deleteEvent = useMutation({
    mutationFn: ({ event, scope }: { event: CalendarEvent; scope: 'series' | 'occurrence' }) => {
      const qs =
        scope === 'occurrence' && event.occurrenceDate ? `?occurrence=${event.occurrenceDate}` : ''
      return fetch(`/api/calendar/events/${event.seriesId}${qs}`, { method: 'DELETE' }).then(
        (r) => {
          if (!r.ok) throw new Error(String(r.status))
        }
      )
    },
    onSuccess: () => {
      invalidate()
      setRemoveTarget(null)
      closeDrawer()
    },
  })

  function openCreate(date: Date | null) {
    setEditingEvent(null)
    setPrefillDate(date)
    setDrawerOpen(true)
  }
  function openEdit(event: CalendarEvent) {
    setEditingEvent(event)
    setPrefillDate(null)
    setDrawerOpen(true)
  }
  function closeDrawer() {
    setDrawerOpen(false)
    setEditingEvent(null)
    setPrefillDate(null)
  }

  const events: CalendarEvent[] = useMemo(() => eventsQuery.data?.events ?? [], [eventsQuery.data])
  const weeks = useMemo(
    () => layoutMonth(events, cursor.getFullYear(), cursor.getMonth()),
    [events, cursor]
  )

  const title =
    view === 'month'
      ? monthTitle(cursor.getFullYear(), cursor.getMonth())
      : view === 'week'
        ? weekTitle(buildWeek(cursor))
        : dayTitle(cursor)

  function step(delta: 1 | -1) {
    if (view === 'month') setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1))
    else if (view === 'week') setCursor(addDays(cursor, delta * 7))
    else setCursor(addDays(cursor, delta))
  }

  function drillDay(date: Date) {
    setCursor(date)
    setView('day')
  }

  const isLoading = eventsQuery.isLoading || profilesQuery.isLoading

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 pb-12 pt-6 sm:px-6">
      {/* Chrome */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h1 className="text-page-title text-foreground">{title}</h1>
          <div className="ml-1 flex items-center gap-1">
            <Button variant="ghost" size="icon" aria-label="Previous" onClick={() => step(-1)}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Next" onClick={() => step(1)}>
              <ChevronRight className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setCursor(new Date())}>
              Today
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <SegmentedControl
            aria-label="Calendar view"
            options={VIEW_OPTIONS}
            value={view}
            onChange={setView}
          />
          {canManage && (
            <Button size="sm" onClick={() => openCreate(null)}>
              <Plus className="mr-1 h-4 w-4" /> Add event
            </Button>
          )}
        </div>
      </div>

      {/* Body */}
      {isLoading ? (
        <MonthSkeleton />
      ) : eventsQuery.isError ? (
        <div className="rounded-xl border border-border bg-card py-6 shadow-[var(--shadow-card)]">
          <EmptyState
            icon={CalendarDays}
            heading="Couldn't load the calendar"
            body="Something went wrong fetching events. Try again in a moment."
          />
        </div>
      ) : view === 'month' ? (
        <>
          <MonthGrid
            weeks={weeks}
            membersById={membersById}
            today={today}
            onDrillDay={drillDay}
            onQuickAdd={canManage ? (date) => openCreate(date) : undefined}
          />
          {events.length === 0 && (
            <p className="mt-4 text-center text-sm-token text-muted-foreground">
              Nothing on the calendar this month.
            </p>
          )}
        </>
      ) : (
        <DetailView
          view={view}
          cursor={cursor}
          events={events}
          membersById={membersById}
          today={today}
          onEditEvent={canManage ? openEdit : undefined}
          onAddOnDay={canManage ? (date) => openCreate(date) : undefined}
        />
      )}

      {canManage && (
        <CreateEventDrawer
          open={drawerOpen}
          onClose={closeDrawer}
          members={members}
          prefillDate={prefillDate}
          editingEvent={editingEvent}
          onSubmit={async (input) => {
            // Swallow rejection so the drawer stays open on failure; onSuccess closes it.
            if (editingEvent) {
              await updateEvent.mutateAsync({ id: editingEvent.seriesId, input }).catch(() => {})
            } else {
              await createEvent.mutateAsync(input).catch(() => {})
            }
          }}
          onRemove={() => editingEvent && setRemoveTarget(editingEvent)}
        />
      )}

      {canManage && removeTarget && (
        <ConfirmDialog
          open
          title={`Remove “${removeTarget.title}”?`}
          description={
            removeTarget.recurrence === 'weekly'
              ? 'This event repeats weekly. Remove just this week, or the whole series?'
              : 'This event will be permanently deleted. This can’t be undone.'
          }
          confirmLabel={removeTarget.recurrence === 'weekly' ? 'All events' : 'Remove'}
          onConfirm={() => deleteEvent.mutate({ event: removeTarget, scope: 'series' })}
          secondaryLabel={removeTarget.recurrence === 'weekly' ? 'Just this week' : undefined}
          onSecondary={
            removeTarget.recurrence === 'weekly'
              ? () => deleteEvent.mutate({ event: removeTarget, scope: 'occurrence' })
              : undefined
          }
          onCancel={() => setRemoveTarget(null)}
          isPending={deleteEvent.isPending}
        />
      )}
    </div>
  )
}

/* A non-janky loading state: the month grid's shell with pulsing placeholder
   cells, so the layout doesn't jump when data lands. */
function MonthSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
      <div className="grid grid-cols-7 border-b border-border">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="px-2 py-1.5">
            <div className="mx-auto h-3 w-8 rounded bg-muted" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {Array.from({ length: 35 }).map((_, i) => (
          <div
            key={i}
            className="min-h-[128px] border-b border-r border-border p-2 last:border-r-0"
          >
            <div className="h-6 w-6 rounded-full bg-muted" />
            <div className="mt-3 flex flex-col gap-1">
              <div className="h-4 w-full rounded bg-muted/70 animate-pulse" />
              <div className="h-4 w-2/3 rounded bg-muted/50 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
