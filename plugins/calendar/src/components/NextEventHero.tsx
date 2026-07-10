import type { CSSProperties, ReactNode } from 'react'
import { Clock, MapPin, Users } from 'lucide-react'
import type { CalendarEvent } from '../types'
import { agendaWhenLabel, formatTime, isMultiDay, relativeWhen } from '../lib/grid'
import { fillForHues, huesForEvent, spineColorsForEvent } from '../lib/hues'

/* The "Up next" hero — the single next event, washed in its owner's identity
   colour (a split fill for a shared event, neutral for Family). Established on
   the mobile agenda (story #4) and reused by the `calendar.up-next` widget
   (story #7) so the two surfaces stay in lockstep.

   Two layouts share the same washing / hue / "Up next" identity:
   · default (mobile agenda) — title left, the clock/date label prominent on the
     right, owner under the title. Unchanged from story #4.
   · `compact` (widget slot) — a single header line ("Up next · in 30 min", the
     countdown reunited with the eyebrow), the title as the one dominant element,
     then a quiet meta line (time · place · owner). `now` drives the countdown.

   `onClick` makes the whole card a button (tap-to-edit / tap-through).
   `showSoloOwner=false` drops member names (the widget's Mine framing — all
   theirs); a Family event still tags "Family". */
export function NextEventHero({
  event,
  membersById,
  now,
  onClick,
  compact = false,
  showSoloOwner = true,
}: {
  event: CalendarEvent
  membersById: Map<string, string>
  now?: Date
  onClick?: () => void
  compact?: boolean
  showSoloOwner?: boolean
}) {
  const hues = huesForEvent(event.attendeeIds, membersById)
  const fill = fillForHues(hues)
  const ownerNames = event.attendeeIds
    .map((id) => membersById.get(id))
    .filter((n): n is string => Boolean(n))
  const when = now ? relativeWhen(event, now) : agendaWhenLabel(event)
  const hasClock = !event.allDay && !isMultiDay(event)

  const dot = <span className="size-2 rounded-full" style={dotStyle(spineColorsForEvent(hues))} />
  const owner: ReactNode =
    ownerNames.length === 0 ? (
      <span className="inline-flex items-center gap-1">
        <Users className="h-3.5 w-3.5" /> Family
      </span>
    ) : showSoloOwner ? (
      ownerNames.join(' · ')
    ) : null

  const body = compact ? (
    <>
      {/* Header line: "Up next" and the countdown read together, not in opposite
          corners — and both stay smaller than the title below. */}
      <div className="flex items-center gap-1.5 text-section-label text-foreground/60">
        {dot}
        <span>Up next</span>
        {now && <span className="text-foreground/80">· {when}</span>}
      </div>
      <div className="text-heading mt-2 truncate text-foreground">{event.title}</div>
      {/* Meta order: time → place → owner. Time anchors the countdown eyebrow;
          place is the next logistic; owner comes last since the wash already
          codes identity. */}
      <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs-token text-foreground/70">
        {hasClock && (
          <span className="inline-flex items-center gap-1 tabular-nums">
            <Clock className="h-3 w-3" /> {formatTime(event.startsAt)}
          </span>
        )}
        {event.location && (
          <span className="inline-flex min-w-0 items-center gap-1">
            <MapPin className="h-3 w-3 shrink-0" />{' '}
            <span className="truncate">{event.location}</span>
          </span>
        )}
        {owner && <span className="inline-flex items-center gap-1">{owner}</span>}
      </div>
    </>
  ) : (
    <>
      <div className="flex items-center gap-2 text-section-label text-foreground/60">
        {dot}
        Up next
      </div>
      <div className="mt-2.5 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="text-heading text-foreground">{event.title}</div>
          {owner && (
            <div className="mt-1.5 flex items-center gap-1.5 text-sm-token text-foreground/70">
              {owner}
            </div>
          )}
        </div>
        <div className="shrink-0 text-right">
          <div className="text-card-title font-semibold tabular-nums text-foreground">{when}</div>
          {event.location && (
            <div className="mt-0.5 flex items-center justify-end gap-1 text-xs-token text-foreground/70">
              <MapPin className="h-3 w-3" /> {event.location}
            </div>
          )}
        </div>
      </div>
    </>
  )

  const className = `block w-full rounded-2xl border border-border/60 text-left shadow-[var(--shadow-card)] ${
    compact ? 'p-3.5' : 'p-4'
  }`
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`Edit ${event.title}`}
        className={`${className} cursor-pointer`}
        style={{ background: fill.background }}
      >
        {body}
      </button>
    )
  }
  return (
    <div className={className} style={{ background: fill.background }}>
      {body}
    </div>
  )
}

// A dot echoing the row spine: solid for solo, vertical split for shared.
function dotStyle(colors: string[]): CSSProperties {
  if (colors.length === 1) return { background: colors[0] }
  const n = colors.length
  return {
    background: `linear-gradient(180deg, ${colors
      .map((c, i) => `${c} ${Math.round((i / n) * 100)}% ${Math.round(((i + 1) / n) * 100)}%`)
      .join(', ')})`,
  }
}
