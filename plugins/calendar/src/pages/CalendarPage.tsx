import { useMemo, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Repeat } from 'lucide-react'
import {
  Button,
  ConfirmDialog,
  EmptyState,
  PageContainer,
  SegmentedControl,
  TabBar,
  type TabBarOption,
} from '@family-os/ui'
import {
  FAMILY_PROFILE_ID,
  useAuth,
  useMutation,
  useQuery,
  useQueryClient,
} from '@family-os/platform'
import type { Profile } from '@family-os/platform/types'
import type {
  ActivitiesResponse,
  CalendarEvent,
  CalendarLens,
  CalendarView,
  EventsResponse,
  CalendarMember,
} from '../types'
import {
  addDays,
  agendaRange,
  buildWeek,
  dayTitle,
  layoutMonth,
  monthTitle,
  rangeFor,
  weekTitle,
} from '../lib/grid'
import { useIsTabletUp } from '../lib/use-is-tablet'
import { MonthGrid } from '../components/MonthGrid'
import { DetailView } from '../components/DetailView'
import { AgendaView } from '../components/AgendaView'
import { ActivitiesView } from '../components/ActivitiesView'
import { CreateEventDrawer, type CreateEventInput } from '../components/CreateEventDrawer'

const VIEW_OPTIONS: { value: CalendarView; label: string }[] = [
  { value: 'month', label: 'Month' },
  { value: 'week', label: 'Week' },
  { value: 'day', label: 'Day' },
]

// The primary surface tier (design.md §4, approved Frame B): the time grid vs.
// the Activities lens. Rendered as a `TabBar` (underline tablist), visually
// distinct from the Month/Week/Day `SegmentedControl` so the lens never reads as
// a fourth zoom level.
const LENS_TABS: TabBarOption<CalendarLens>[] = [
  { value: 'calendar', label: 'Calendar', icon: CalendarDays },
  { value: 'activities', label: 'Activities', icon: Repeat },
]

export function CalendarPage() {
  const { tier } = useAuth()
  // Create / edit / remove are tier-4 only (matches the API's `calendar.Event`
  // write rule and the locked design).
  const canManage = tier >= 4
  const queryClient = useQueryClient()

  // Below `md:` the page is the forward-looking agenda (story #4); at `md:`+ it's
  // the glanceable month grid + week/day drill-ins. The surface and its query
  // range both follow this, so only one query runs per device.
  const isTabletUp = useIsTabletUp()

  const [view, setView] = useState<CalendarView>('month')
  // The primary tier (tablet+ only): the time grid or the Activities lens.
  const [lens, setLens] = useState<CalendarLens>('calendar')
  const [cursor, setCursor] = useState<Date>(() => new Date())
  // Stable "now" for the session so the today-circle/dim treatment doesn't churn.
  const today = useMemo(() => new Date(), [])

  // Drawer state: set `editingEvent` → edit mode; `prefillDate` seeds a new
  // event's date (the agenda's per-day "+ Add"). `createAsActivity` + `prefillOwnerId`
  // open it in activity framing (repeat-weekly on, optionally pre-owned).
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [prefillDate, setPrefillDate] = useState<Date | null>(null)
  const [createAsActivity, setCreateAsActivity] = useState(false)
  const [prefillOwnerId, setPrefillOwnerId] = useState<string | null>(null)
  // Set → the remove-confirm dialog is open for this event (recurring → a
  // "Just this week" vs "All events" choice).
  const [removeTarget, setRemoveTarget] = useState<CalendarEvent | null>(null)
  // Removing an activity from the Activities lens — a standing series with no
  // occurrence context, so always a whole-series delete (no per-occurrence choice).
  // The edit-drawer path routes through `removeTarget`, which offers the
  // this-week/series choice when the target is a concrete grid occurrence.
  const [activityToRemove, setActivityToRemove] = useState<CalendarEvent | null>(null)

  const range = useMemo(
    () => (isTabletUp ? rangeFor(view, cursor) : agendaRange(today)),
    [isTabletUp, view, cursor, today]
  )

  const eventsQuery = useQuery({
    queryKey: ['calendar/events', { from: range.from, to: range.to }],
    queryFn: () =>
      fetch(`/api/calendar/events?from=${range.from}&to=${range.to}`).then((r) => {
        if (!r.ok) throw new Error('Failed to load events')
        return r.json() as Promise<EventsResponse>
      }),
  })

  // The Activities lens (story #5) — standing series, not range-expanded. Lazily
  // fetched only when the lens is open (either viewport), so the calendar/agenda
  // path pays nothing.
  const activitiesQuery = useQuery({
    queryKey: ['calendar/activities'],
    queryFn: () =>
      fetch('/api/calendar/activities').then((r) => {
        if (!r.ok) throw new Error('Failed to load activities')
        return r.json() as Promise<ActivitiesResponse>
      }),
    enabled: lens === 'activities',
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
    const map = new Map<string, CalendarMember>()
    for (const m of profilesQuery.data ?? [])
      map.set(m.id, { name: m.name, avatarUrl: m.avatarUrl })
    return map
  }, [profilesQuery.data])

  // One invalidation refreshes the month view + (story 7) the up-next widget,
  // which share the `['calendar/events']` prefix (ADR 013). Activities are a
  // separate series query, so refresh both — an edited event may change what
  // counts as a standing activity (weekly + one owner).
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['calendar/events'] })
    queryClient.invalidateQueries({ queryKey: ['calendar/activities'] })
  }

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
      setActivityToRemove(null)
      closeDrawer()
    },
  })

  function openCreate(date: Date | null) {
    setEditingEvent(null)
    setPrefillDate(date)
    setCreateAsActivity(false)
    setPrefillOwnerId(null)
    setDrawerOpen(true)
  }
  // Add an activity — the create form with repeat-weekly implied (design.md §4),
  // optionally pre-owned (the roster's per-person "+ Add").
  function openCreateActivity(ownerId?: string) {
    setEditingEvent(null)
    setPrefillDate(null)
    setCreateAsActivity(true)
    setPrefillOwnerId(ownerId ?? null)
    setDrawerOpen(true)
  }
  function openEdit(event: CalendarEvent) {
    setEditingEvent(event)
    setPrefillDate(null)
    setCreateAsActivity(false)
    setPrefillOwnerId(null)
    setDrawerOpen(true)
  }
  function closeDrawer() {
    setDrawerOpen(false)
    setEditingEvent(null)
    setPrefillDate(null)
    setCreateAsActivity(false)
    setPrefillOwnerId(null)
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

  const errorCard = (
    <div className="rounded-panel border border-border bg-card py-6 shadow-[var(--shadow-card)]">
      <EmptyState
        icon={CalendarDays}
        heading="Couldn't load the calendar"
        body="Something went wrong fetching events. Try again in a moment."
      />
    </div>
  )

  // Shared lens bodies (loading / error / content), reused by the tablet chrome and
  // the mobile surface so both viewports render the same agenda + Activities lens.
  const agendaBody = isLoading ? (
    <AgendaSkeleton />
  ) : eventsQuery.isError ? (
    errorCard
  ) : (
    <AgendaView
      events={events}
      membersById={membersById}
      now={today}
      onEditEvent={canManage ? openEdit : undefined}
      onAdd={canManage ? () => openCreate(null) : undefined}
    />
  )

  const activitiesBody =
    activitiesQuery.isLoading || profilesQuery.isLoading ? (
      <ActivitiesSkeleton />
    ) : activitiesQuery.isError ? (
      errorCard
    ) : (
      <ActivitiesView
        activities={activitiesQuery.data?.activities ?? []}
        membersById={membersById}
        now={today}
        canManage={canManage}
        onAdd={canManage ? openCreateActivity : undefined}
        onEdit={canManage ? openEdit : undefined}
        onRemove={canManage ? setActivityToRemove : undefined}
      />
    )

  const onActivities = lens === 'activities'

  // Below `md:` — the mobile surface (story #4): the forward-looking agenda, now
  // carrying the same Calendar ⇄ Activities tier so a parent can view and manage
  // activities from their phone. Contextual header + Add CTA, then the tab bar +
  // its panel.
  const mobileSurface = (
    // `full` — a phone agenda spans the screen. The gutter is the container's now;
    // each of these three children used to carry its own `px-4`.
    <PageContainer width="full">
      <div className="flex items-center justify-between gap-3 pb-3">
        <h1 className="text-page-title text-foreground">
          {onActivities ? 'Activities' : 'Calendar'}
        </h1>
        {canManage && (
          <Button
            size="sm"
            className="h-10 shrink-0"
            onClick={onActivities ? () => openCreateActivity() : () => openCreate(null)}
          >
            <Plus className="mr-1 h-4 w-4" /> {onActivities ? 'Add activity' : 'Add event'}
          </Button>
        )}
      </div>
      <TabBar
        aria-label="Calendar surface"
        idBase="calendar-surface-m"
        options={LENS_TABS}
        value={lens}
        onChange={setLens}
      />
      <div className="pt-4" role="tabpanel" aria-labelledby={`calendar-surface-m-tab-${lens}`}>
        {onActivities ? activitiesBody : agendaBody}
      </div>
    </PageContainer>
  )

  // The time grid (month/week/day) — the calendar lens's chrome + body.
  const calendarLens = (
    <>
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

      {isLoading ? (
        <MonthSkeleton />
      ) : eventsQuery.isError ? (
        errorCard
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
    </>
  )

  // The Activities lens (story #5) — grouped by owner, no time-nav (it isn't a range).
  const activitiesLens = (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-page-title text-foreground">Activities</h1>
        {canManage && (
          <Button size="sm" onClick={() => openCreateActivity()}>
            <Plus className="mr-1 h-4 w-4" /> Add activity
          </Button>
        )}
      </div>
      {activitiesBody}
    </>
  )

  const tabletSurface = (
    // `wide` — a 7-column month grid needs canvas, not a reading column.
    <PageContainer width="wide">
      {/* Primary tier — Calendar ⇄ Activities (design.md §4), set apart from the
          Month/Week/Day sub-switch so the lens never reads as a fourth zoom level. */}
      <TabBar
        aria-label="Calendar surface"
        idBase="calendar-surface"
        className="mb-4"
        options={LENS_TABS}
        value={lens}
        onChange={setLens}
      />

      <div role="tabpanel" aria-labelledby={`calendar-surface-tab-${lens}`}>
        {lens === 'activities' ? activitiesLens : calendarLens}
      </div>
    </PageContainer>
  )

  return (
    <>
      {isTabletUp ? tabletSurface : mobileSurface}

      {canManage && (
        <CreateEventDrawer
          open={drawerOpen}
          onClose={closeDrawer}
          members={members}
          prefillDate={prefillDate}
          prefillOwnerId={prefillOwnerId}
          editingEvent={editingEvent}
          // Activity framing: creating from the lens implies repeat-weekly; editing
          // an existing activity keeps that framing (copy only).
          activityContext={editingEvent ? editingEvent.isActivity : createAsActivity}
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

      {canManage &&
        removeTarget &&
        (() => {
          // Offer "just this week" vs "the whole series" only when there's a
          // concrete occurrence to skip — a weekly event/activity opened from the
          // grid carries `occurrenceDate`. A bare series (e.g. an activity edited
          // from the Activities lens) has none, so "just this week" would silently
          // fall back to a series delete — collapse to a plain series confirm.
          const noun = removeTarget.isActivity ? 'activity' : 'event'
          const offersChoice = removeTarget.recurrence === 'weekly' && !!removeTarget.occurrenceDate
          return (
            <ConfirmDialog
              open
              title={`Remove “${removeTarget.title}”?`}
              description={
                offersChoice
                  ? `This ${noun} repeats weekly. Remove just this week, or the whole series?`
                  : `This ${noun} will be permanently deleted. This can’t be undone.`
              }
              confirmLabel={offersChoice ? 'All events' : 'Remove'}
              onConfirm={() => deleteEvent.mutate({ event: removeTarget, scope: 'series' })}
              secondaryLabel={offersChoice ? 'Just this week' : undefined}
              onSecondary={
                offersChoice
                  ? () => deleteEvent.mutate({ event: removeTarget, scope: 'occurrence' })
                  : undefined
              }
              onCancel={() => setRemoveTarget(null)}
              isPending={deleteEvent.isPending}
            />
          )
        })()}

      {canManage && activityToRemove && (
        <ConfirmDialog
          open
          title={`Remove “${activityToRemove.title}”?`}
          description="This clears the activity and all its future occurrences from the calendar. This can’t be undone."
          confirmLabel="Remove activity"
          onConfirm={() => deleteEvent.mutate({ event: activityToRemove, scope: 'series' })}
          onCancel={() => setActivityToRemove(null)}
          isPending={deleteEvent.isPending}
        />
      )}
    </>
  )
}

/* The Activities lens loading state: the sub-switch + a couple pulsing owner
   groups, so the surface doesn't jump when data lands. */
function ActivitiesSkeleton() {
  return (
    <div className="flex flex-col gap-7">
      <div className="h-9 w-52 rounded-md bg-muted/60 animate-pulse" />
      {Array.from({ length: 2 }).map((_, g) => (
        <div key={g} className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-muted" />
            <div className="h-5 w-24 rounded bg-muted/70 animate-pulse" />
          </div>
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-card border border-border bg-card shadow-[var(--shadow-card)]"
            >
              <div className="flex h-full items-center gap-3 px-4">
                <div className="h-9 w-1 rounded-full bg-muted" />
                <div className="flex flex-col gap-1.5">
                  <div className="h-4 w-40 rounded bg-muted/70 animate-pulse" />
                  <div className="h-3 w-28 rounded bg-muted/50 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

/* The mobile agenda's loading state: a hero block + a few pulsing rows, so the
   surface doesn't jump when data lands. */
function AgendaSkeleton() {
  return (
    <div className="flex flex-col gap-7">
      <div className="h-28 rounded-hero bg-muted/60 animate-pulse" />
      <div className="flex flex-col gap-2.5">
        <div className="mb-1 h-5 w-28 rounded bg-muted" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-16 rounded-card border border-border bg-card shadow-[var(--shadow-card)]"
          >
            <div className="flex h-full items-center gap-3 px-4">
              <div className="h-9 w-1 rounded-full bg-muted" />
              <div className="flex flex-col gap-1.5">
                <div className="h-4 w-40 rounded bg-muted/70 animate-pulse" />
                <div className="h-3 w-24 rounded bg-muted/50 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* A non-janky loading state: the month grid's shell with pulsing placeholder
   cells, so the layout doesn't jump when data lands. */
function MonthSkeleton() {
  return (
    <div className="overflow-hidden rounded-panel border border-border bg-card shadow-[var(--shadow-card)]">
      <div className="grid grid-cols-7 border-b border-border">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="px-2 py-1.5">
            <div className="mx-auto h-3 w-8 rounded bg-muted" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="min-h-32 border-b border-r border-border p-2 last:border-r-0">
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
