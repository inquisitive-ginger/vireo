import { useMemo, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Button, EmptyState, cn } from '@family-os/ui'
import { useQuery } from '@family-os/platform'
import type { CalendarEvent, CalendarView, EventsResponse, FamilyMember } from '../types'
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

const VIEWS: CalendarView[] = ['month', 'week', 'day']

export function CalendarPage() {
  const [view, setView] = useState<CalendarView>('month')
  const [cursor, setCursor] = useState<Date>(() => new Date())
  // Stable "now" for the session so the today-circle/dim treatment doesn't churn.
  const today = useMemo(() => new Date(), [])

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
        return r.json() as Promise<FamilyMember[]>
      }),
  })

  const membersById = useMemo(() => {
    const map = new Map<string, string>()
    for (const m of profilesQuery.data ?? []) map.set(m.id, m.name)
    return map
  }, [profilesQuery.data])

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
          {/* View switch */}
          <div className="flex items-center rounded-md border border-border p-0.5">
            {VIEWS.map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  'rounded px-3 py-1 text-sm-token font-medium capitalize transition-colors',
                  v === view
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                )}
              >
                {v}
              </button>
            ))}
          </div>
          {/* Inert until story #3 wires the create drawer. */}
          <Button size="sm" disabled title="Adding events arrives in the next calendar story">
            <Plus className="mr-1 h-4 w-4" /> Add event
          </Button>
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
          <MonthGrid weeks={weeks} membersById={membersById} today={today} onDrillDay={drillDay} />
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
