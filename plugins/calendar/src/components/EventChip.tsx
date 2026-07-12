import { Users } from 'lucide-react'
import { cn } from '@family-os/ui'
import type { CalendarEvent } from '../types'
import { formatChipTime } from '../lib/grid'
import { fillForHues, huesForEvent, isFamilyHues } from '../lib/hues'

/* A filled identity-hue pill (the "highlighter" analog). Family events (no
   attendee) get the neutral fill + a Users glyph; shared (2+) get the split
   fill — all resolved in `hues.ts`. Ported from the locked exploration. */
export function EventChip({
  event,
  membersById,
}: {
  event: CalendarEvent
  membersById: Map<string, string>
}) {
  const hues = huesForEvent(event.attendeeIds, membersById)
  const { background, color } = fillForHues(hues)
  const label = event.allDay ? event.title : `${formatChipTime(event.startsAt)} ${event.title}`
  return (
    <div
      className={cn(
        'flex items-center gap-1 truncate rounded-md px-1.5 py-0.5 text-xs-token font-semibold'
      )}
      style={{ background, color }}
      title={event.title}
    >
      {isFamilyHues(hues) && <Users className="h-2.5 w-2.5 shrink-0 opacity-70" />}
      <span className="truncate">{label}</span>
    </div>
  )
}
