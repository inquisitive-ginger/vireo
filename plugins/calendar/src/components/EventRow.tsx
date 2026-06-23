import { MapPin, Repeat, Users } from 'lucide-react'
import type { CalendarEvent } from '../types'
import { formatTime, isMultiDay, spanEndDate } from '../lib/grid'
import { fillForHues, huesForEvent } from '../lib/hues'

/* A drill-in agenda row: an owner-hue spine (split for shared, neutral for
   Family) + the time, title, and any location — the higher-density read behind
   a month chip. */
export function EventRow({
  event,
  membersById,
}: {
  event: CalendarEvent
  membersById: Map<string, string>
}) {
  const hues = huesForEvent(event.attendeeIds, membersById)
  const { background } = fillForHues(hues)
  const ownerNames = event.attendeeIds
    .map((id) => membersById.get(id))
    .filter((n): n is string => Boolean(n))

  let when: string
  if (event.allDay) {
    when = 'All day'
  } else if (isMultiDay(event)) {
    when = `Until ${spanEndDate(event).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
  } else {
    when = formatTime(event.startsAt)
  }

  return (
    <div className="flex items-stretch gap-3 rounded-lg border border-border bg-card px-3 py-2.5 shadow-[var(--shadow-card)]">
      <span className="w-1.5 shrink-0 rounded-full" style={{ background }} aria-hidden />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm-token font-semibold text-foreground">{when}</span>
          {event.recurrence === 'weekly' && (
            <Repeat
              className="h-3 w-3 shrink-0 text-muted-foreground"
              aria-label="Repeats weekly"
            />
          )}
        </div>
        <div className="truncate text-body font-medium text-foreground">{event.title}</div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs-token text-muted-foreground">
          {ownerNames.length === 0 ? (
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" /> Family
            </span>
          ) : (
            <span className="truncate">{ownerNames.join(' · ')}</span>
          )}
          {event.location && (
            <span className="flex items-center gap-1 truncate">
              <MapPin className="h-3 w-3 shrink-0" /> {event.location}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
