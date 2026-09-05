import { Users } from 'lucide-react'
import { cn } from '@family-os/ui'
import type { CalendarEvent, CalendarMember } from '../types'
import { formatChipTime } from '../lib/grid'
import {
  fillForHues,
  huesForEvent,
  initialsForEvent,
  isFamilyHues,
  ownersForEvent,
} from '../lib/hues'

/* A filled identity-hue pill (the "highlighter" analog). Family events (no attendee)
   get the reserved Hearth fill + a Users glyph; shared (2+) get the split fill — all
   resolved in `hues.ts`.

   The OWNER'S INITIAL is the chip's second channel (ADR 044). This is the surface where
   colour does the most work and had the least help: at month scale a chip is a coloured
   pill and nothing else, so the hue was the only thing saying whose event it is — and
   two pairs of the eight hues are indistinguishable to a red-green colour-blind viewer.
   Note the family case ALREADY had a second channel (the glyph below); it was only a
   person's event that had none. */
export function EventChip({
  event,
  membersById,
}: {
  event: CalendarEvent
  membersById: Map<string, CalendarMember>
}) {
  const hues = huesForEvent(event.attendeeIds, membersById)
  const { background, color } = fillForHues(hues)
  const isFamily = isFamilyHues(hues)
  const initials = initialsForEvent(event.attendeeIds, membersById)
  const label = event.allDay ? event.title : `${formatChipTime(event.startsAt)} ${event.title}`

  // Whose event this is, said in words. The initial is a visual shorthand for the hue,
  // so it is aria-hidden — but that leaves a screen reader with no owner at all, which
  // was already true before the initial existed. Name the owners here instead.
  const owners = ownersForEvent(event.attendeeIds, membersById)
  const who = isFamily ? 'Family' : owners.map((m) => m.name).join(', ')

  return (
    <div
      className={cn(
        'flex items-center gap-1 truncate rounded-card px-1.5 py-0.5 text-xs-token font-semibold'
      )}
      style={{ background, color }}
      title={`${event.title} — ${who}`}
    >
      {isFamily && <Users aria-hidden className="h-2.5 w-2.5 shrink-0 opacity-70" />}
      {initials && (
        <span aria-hidden className="shrink-0 font-extrabold opacity-70">
          {initials}
        </span>
      )}
      <span className="truncate">{label}</span>
      <span className="sr-only">{` — ${who}`}</span>
    </div>
  )
}
