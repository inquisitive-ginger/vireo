import { CalendarDays } from 'lucide-react'
import { EmptyState } from '@family-os/ui'
import type { CalendarEvent, CalendarView } from '../types'
import { buildWeek, dayTitle, eventsForDay, isSameDay } from '../lib/grid'
import { EventRow } from './EventRow'

/* The day/week drill-in: a day-grouped agenda at higher density than the month
   chips. Day view is a single day's section; week view is the seven days of the
   Sunday-start week, each with its own events. */

function DaySection({
  date,
  events,
  membersById,
  today,
  showHeading,
}: {
  date: Date
  events: CalendarEvent[]
  membersById: Map<string, string>
  today: Date
  showHeading: boolean
}) {
  return (
    <section className="flex flex-col gap-2">
      {showHeading && (
        <h3 className="text-section-label text-muted-foreground">
          {isSameDay(date, today) ? `Today · ${dayTitle(date)}` : dayTitle(date)}
        </h3>
      )}
      {events.length === 0 ? (
        <p className="text-sm-token text-muted-foreground">Nothing scheduled.</p>
      ) : (
        events.map((event) => <EventRow key={event.id} event={event} membersById={membersById} />)
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
}: {
  view: Exclude<CalendarView, 'month'>
  cursor: Date
  events: CalendarEvent[]
  membersById: Map<string, string>
  today: Date
}) {
  const days = view === 'day' ? [cursor] : buildWeek(cursor)

  // Day view with nothing scheduled gets the full design-system empty state.
  if (view === 'day' && eventsForDay(events, cursor).length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card py-6 shadow-[var(--shadow-card)]">
        <EmptyState
          icon={CalendarDays}
          heading="Nothing scheduled"
          body={`${dayTitle(cursor)} is clear.`}
        />
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
        />
      ))}
    </div>
  )
}
