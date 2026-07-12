import { cn } from '@family-os/ui'
import type { CalendarEvent } from '../types'
import { spanWhenLabel } from '../lib/week'
import { EventOwners } from './EventOwners'

/* THE MULTI-DAY SPAN PRIMITIVE — one content anatomy, two containers.

   A multi-day event is a *condition*, not an appointment: it should be stated once,
   as standing context, never re-emitted on each of the five days it covers. That
   rule is the same everywhere. What differs is the surface it can be stated ON:

     · `groove` — recessed into a card (`--surface-sunken` + `--shadow-inset`,
       ADR 040), full-bleed so it runs past the frame the way the event runs past
       the day. This is the widget, which lives inside a card.

     · `panel`  — a resting `--card` panel. The mobile agenda sits directly on
       `--background`, and ADR 040 is explicit that a recess is ILLEGAL there: a
       groove needs something to be recessed INTO, and the page is already the
       bottom of the stack. So the same rows get an elevated container instead of a
       sunken one. Same primitive, same anatomy — a different claim about depth,
       because the ground underneath it is different.

   Don't "fix" the panel by making it sunken. That inverts the ladder. */

export type SpanContainer = 'groove' | 'panel'

/** One span, stated once: title · date range · owners. No clock — a span's "when"
    is a range, and "all day" is implied by it. */
export function SpanRow({
  event,
  membersById,
  now,
  showMembers,
  onClick,
}: {
  event: CalendarEvent
  membersById: Map<string, string>
  now: Date
  showMembers?: boolean
  onClick?: () => void
}) {
  const body = (
    <>
      <span className="text-base-token shrink-0 truncate font-semibold text-foreground">
        {event.title}
      </span>
      <span className="text-sm-token min-w-0 flex-1 truncate text-muted-foreground">
        {spanWhenLabel(event, now)}
      </span>
      <EventOwners event={event} membersById={membersById} showMembers={showMembers} />
    </>
  )
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`Edit ${event.title}`}
        className="flex w-full min-h-12 cursor-pointer items-center gap-3 py-1.5 text-left"
      >
        {body}
      </button>
    )
  }
  return <div className="flex min-h-12 items-center gap-3 py-1.5">{body}</div>
}

export interface SpanBandProps {
  spans: CalendarEvent[]
  membersById: Map<string, string>
  now: Date
  container: SpanContainer
  /** The band's eyebrow. The widget's window is a week ("All week"); the agenda
      scrolls for six, so a span three weeks out is not "all week" — it says
      "Ongoing" and only carries what is actually running. */
  label: string
  /** Passed through to `EventOwners` — false in the widget's "mine" framing. */
  showMembers?: boolean
  /** Tap a span → edit (tier 4). Absent → read-only. */
  onSelect?: (event: CalendarEvent) => void
  /** The groove is full-bleed, so it must negate its host's inset (`-mx-6` under
      the widget's `p-6`). Passed in rather than assumed — if the host's padding
      moves and this doesn't, the groove stops reaching the edges. */
  className?: string
}

export function SpanBand({
  spans,
  membersById,
  now,
  container,
  label,
  showMembers,
  onSelect,
  className,
}: SpanBandProps) {
  // Nothing to say → say nothing. An empty groove is a hole in the card, and an
  // empty panel is a floating label.
  if (spans.length === 0) return null

  return (
    <div
      data-testid="span-band"
      className={cn(
        container === 'groove'
          ? 'bg-surface-sunken px-6 py-2.5 shadow-[var(--shadow-inset)]'
          : 'rounded-panel border border-border bg-card px-4 py-3 shadow-[var(--shadow-card)]',
        className
      )}
    >
      <div className="text-section-label mb-0.5 text-muted-foreground">{label}</div>
      {spans.map((event) => (
        <SpanRow
          key={event.id}
          event={event}
          membersById={membersById}
          now={now}
          showMembers={showMembers}
          onClick={onSelect ? () => onSelect(event) : undefined}
        />
      ))}
    </div>
  )
}
