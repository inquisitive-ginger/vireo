import { CalendarDays, Plus } from 'lucide-react'
import { Button, EmptyState } from '@family-os/ui'
import type { DayMark } from '@family-os/platform/types'
import type { CalendarEvent, CalendarView, CalendarMember } from '../types'
import { buildWeek, dayTitle, eventsForDay, isSameDay, localDateKey } from '../lib/grid'
import { DayHeader, type MarkActionProps } from './DayHeader'
import { EventRow } from './EventRow'

/* The day/week drill-in: a day-grouped agenda at higher density than the month
   chips. Day view is a single day's section; week view is the seven days of the
   Sunday-start week, each with its own events. Tier-4 managers edit an event by
   tapping its row and add an event on a given day from each section's "+ Add". */

const EMPTY_MARKS: Map<string, DayMark[]> = new Map()

interface ManageProps extends MarkActionProps {
  /** Tap an event row → edit (tier 4). Absent → rows are inert. */
  onEditEvent?: (event: CalendarEvent) => void
  /** "+ Add" on a day → create with that date prefilled (tier 4). */
  onAddOnDay?: (date: Date) => void
}

function AddOnDay({ date, onAddOnDay }: { date: Date; onAddOnDay?: (date: Date) => void }) {
  if (!onAddOnDay) return null
  return (
    <Button variant="ghost" size="sm" onClick={() => onAddOnDay(date)}>
      <Plus className="mr-1 h-4 w-4" /> Add
    </Button>
  )
}

function DaySection({
  date,
  events,
  membersById,
  today,
  showHeading,
  marks,
  onEditEvent,
  onAddOnDay,
  onMarkAction,
  markPending,
}: {
  date: Date
  events: CalendarEvent[]
  membersById: Map<string, CalendarMember>
  today: Date
  showHeading: boolean
  marks: DayMark[]
} & ManageProps) {
  return (
    <section className="flex flex-col gap-2">
      <DayHeader
        heading={
          showHeading ? (
            <h3 className="text-section-label text-muted-foreground">
              {isSameDay(date, today) ? `Today · ${dayTitle(date)}` : dayTitle(date)}
            </h3>
          ) : undefined
        }
        action={onAddOnDay && <AddOnDay date={date} onAddOnDay={onAddOnDay} />}
        marks={marks}
        membersById={membersById}
        now={today}
        onMarkAction={onMarkAction}
        markPending={markPending}
      />
      {events.length === 0 ? (
        <p className="text-sm-token text-muted-foreground">Nothing scheduled.</p>
      ) : (
        events.map((event) => (
          <EventRow
            key={event.id}
            event={event}
            membersById={membersById}
            onClick={onEditEvent ? () => onEditEvent(event) : undefined}
          />
        ))
      )}
    </section>
  )
}

export function DetailView({
  view,
  cursor,
  events,
  membersById,
  today,
  onEditEvent,
  onAddOnDay,
  marksByDate = EMPTY_MARKS,
  onMarkAction,
  markPending,
}: {
  view: Exclude<CalendarView, 'month'>
  cursor: Date
  events: CalendarEvent[]
  membersById: Map<string, CalendarMember>
  today: Date
  /** Read-time day marks (ADR 050), keyed by `YYYY-MM-DD`. */
  marksByDate?: Map<string, DayMark[]>
} & ManageProps) {
  const days = view === 'day' ? [cursor] : buildWeek(cursor)

  const marksFor = (date: Date) => marksByDate.get(localDateKey(date)) ?? []

  // Day view with nothing scheduled gets the full design-system empty state.
  if (view === 'day' && eventsForDay(events, cursor).length === 0) {
    return (
      <div className="flex flex-col gap-2">
        <DayHeader
          heading={undefined}
          marks={marksFor(cursor)}
          membersById={membersById}
          now={today}
          onMarkAction={onMarkAction}
          markPending={markPending}
        />
        <div className="rounded-panel border border-border bg-card py-6 shadow-[var(--shadow-card)]">
          <EmptyState
            icon={CalendarDays}
            heading="Nothing scheduled"
            body={`${dayTitle(cursor)} is clear.`}
            action={
              onAddOnDay ? (
                <Button size="sm" onClick={() => onAddOnDay(cursor)}>
                  <Plus className="mr-1 h-4 w-4" /> Add event
                </Button>
              ) : undefined
            }
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {days.map((date) => (
        <DaySection
          key={date.toISOString()}
          date={date}
          events={eventsForDay(events, date)}
          membersById={membersById}
          today={today}
          showHeading={view === 'week'}
          marks={marksFor(date)}
          onEditEvent={onEditEvent}
          onAddOnDay={onAddOnDay}
          onMarkAction={onMarkAction}
          markPending={markPending}
        />
      ))}
    </div>
  )
}
