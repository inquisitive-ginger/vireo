import { ChevronRight, MapPin, Repeat, Users } from 'lucide-react'
import { ItemCard } from '@family-os/ui'
import type { CalendarEvent } from '../types'
import { agendaWhenLabel } from '../lib/grid'
import { huesForEvent, spineColorsForEvent } from '../lib/hues'

/* A full-width agenda row on the shared `ItemCard`: owner-hue spine (split for
   shared, neutral for Family) + a leading time column + title/meta. The mobile
   read surface's row (story #4) — denser than a month chip, calmer than the
   tablet day/week `EventRow` (which stacks the time above the title); here the
   time is a fixed leading column so a thumb-scanned list reads as "when → what". */
export function AgendaRow({
  event,
  membersById,
  onClick,
}: {
  event: CalendarEvent
  membersById: Map<string, string>
  /** Tap-to-edit (tier 4). When set the row becomes a button. */
  onClick?: () => void
}) {
  const spineColors = spineColorsForEvent(huesForEvent(event.attendeeIds, membersById))
  const ownerNames = event.attendeeIds
    .map((id) => membersById.get(id))
    .filter((n): n is string => Boolean(n))

  const card = (
    <ItemCard
      spine={spineColors}
      align="center"
      className={
        onClick
          ? 'transition-colors group-hover:border-primary/50 group-hover:bg-muted/40'
          : undefined
      }
      trailing={
        onClick ? (
          <ChevronRight className="h-4 w-4 shrink-0 self-center text-muted-foreground/40 transition-colors group-hover:text-foreground" />
        ) : undefined
      }
    >
      <span className="w-[72px] shrink-0 text-sm-token font-semibold tabular-nums text-muted-foreground">
        {agendaWhenLabel(event)}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-body font-medium text-foreground">{event.title}</span>
          {event.recurrence === 'weekly' && (
            <Repeat
              className="h-3 w-3 shrink-0 text-muted-foreground"
              aria-label="Repeats weekly"
            />
          )}
        </div>
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
    </ItemCard>
  )

  if (!onClick) return card
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Edit ${event.title}`}
      className="group block w-full cursor-pointer text-left"
    >
      {card}
    </button>
  )
}
