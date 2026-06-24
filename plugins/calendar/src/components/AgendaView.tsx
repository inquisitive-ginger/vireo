import type { CSSProperties } from 'react'
import { CalendarDays, MapPin, Plus, Users } from 'lucide-react'
import { Button, EmptyState } from '@family-os/ui'
import type { CalendarEvent } from '../types'
import {
  addDays,
  agendaWhenLabel,
  isSameDay,
  pickNextUp,
  startOfDay,
  upcomingByDay,
} from '../lib/grid'
import { fillForHues, huesForEvent, spineColorsForEvent } from '../lib/hues'
import { AgendaRow } from './AgendaRow'

/* The mobile read surface (story #4): a forward-looking, day-grouped agenda led
   by an "Up next" hero — the one thing a parent opens the phone to check —
   washed in the owner's identity colour, then the rest of the day(s) as
   full-width `AgendaRow`s. Reads the same `['calendar/events']` data the tablet
   surfaces do, so an event added here (or on the wall tablet) shows on both. */

export function AgendaView({
  events,
  membersById,
  now,
  onEditEvent,
  onAdd,
}: {
  events: CalendarEvent[]
  membersById: Map<string, string>
  /** Current time — drives "up next" and the Today/Tomorrow labels. */
  now: Date
  /** Tap an event → edit (tier 4). Absent → rows are read-only. */
  onEditEvent?: (event: CalendarEvent) => void
  /** Empty-state CTA (tier 4). */
  onAdd?: () => void
}) {
  const days = upcomingByDay(events, now)

  if (days.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card py-6 shadow-[var(--shadow-card)]">
        <EmptyState
          icon={CalendarDays}
          heading="Nothing scheduled"
          body="Your calendar is clear."
          action={
            onAdd ? (
              <Button size="sm" onClick={onAdd}>
                <Plus className="mr-1 h-4 w-4" /> Add event
              </Button>
            ) : undefined
          }
        />
      </div>
    )
  }

  const hero = pickNextUp(days, now)
  const heroIsToday = hero ? isSameDay(new Date(hero.startsAt), now) : false

  return (
    <div className="flex flex-col gap-7">
      {hero && (
        <HeroNext
          event={hero}
          membersById={membersById}
          onClick={onEditEvent ? () => onEditEvent(hero) : undefined}
        />
      )}
      {days.map((day) => {
        const rest = day.events.filter((e) => e.id !== hero?.id)
        if (rest.length === 0) return null
        const { lead, sub } = sectionLabel(day.date, now, heroIsToday)
        return (
          <section key={day.date.toISOString()}>
            <div className="mb-2.5 flex items-baseline gap-2">
              <h3
                className={`text-card-title ${
                  isSameDay(day.date, now) ? 'text-primary' : 'text-foreground'
                }`}
              >
                {lead}
              </h3>
              {sub && <span className="text-sm-token text-muted-foreground">{sub}</span>}
            </div>
            <div className="flex flex-col gap-2.5">
              {rest.map((event) => (
                <AgendaRow
                  key={event.id}
                  event={event}
                  membersById={membersById}
                  onClick={onEditEvent ? () => onEditEvent(event) : undefined}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

/* The next-up event, washed in its owner's identity colour. Tappable (edit) for
   tier 4, mirroring the rows. */
function HeroNext({
  event,
  membersById,
  onClick,
}: {
  event: CalendarEvent
  membersById: Map<string, string>
  onClick?: () => void
}) {
  const hues = huesForEvent(event.attendeeIds, membersById)
  const fill = fillForHues(hues)
  const ownerNames = event.attendeeIds
    .map((id) => membersById.get(id))
    .filter((n): n is string => Boolean(n))

  const body = (
    <>
      <div className="flex items-center gap-2 text-section-label text-foreground/60">
        <span className="size-2 rounded-full" style={dotStyle(spineColorsForEvent(hues))} />
        Up next
      </div>
      <div className="mt-2.5 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="text-heading text-foreground">{event.title}</div>
          <div className="mt-1.5 flex items-center gap-1.5 text-sm-token text-foreground/70">
            {ownerNames.length === 0 ? (
              <>
                <Users className="h-3.5 w-3.5" /> Family
              </>
            ) : (
              ownerNames.join(' · ')
            )}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-card-title font-semibold tabular-nums text-foreground">
            {agendaWhenLabel(event)}
          </div>
          {event.location && (
            <div className="mt-0.5 flex items-center justify-end gap-1 text-xs-token text-foreground/70">
              <MapPin className="h-3 w-3" /> {event.location}
            </div>
          )}
        </div>
      </div>
    </>
  )

  const className =
    'block w-full rounded-2xl border border-border/60 p-4 text-left shadow-[var(--shadow-card)]'
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

/* "Today" / "Later today" (when the hero is today) / "Tomorrow" / weekday, plus a
   secondary date — the warm header treatment that replaces an all-caps label. */
function sectionLabel(date: Date, now: Date, heroIsToday: boolean): { lead: string; sub?: string } {
  if (isSameDay(date, now)) {
    return heroIsToday
      ? { lead: 'Later today' }
      : {
          lead: 'Today',
          sub: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        }
  }
  if (isSameDay(date, addDays(startOfDay(now), 1))) {
    return {
      lead: 'Tomorrow',
      sub: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    }
  }
  return {
    lead: date.toLocaleDateString(undefined, { weekday: 'long' }),
    sub: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
  }
}
