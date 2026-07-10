import { CalendarDays, Plus } from 'lucide-react'
import { Button, EmptyState } from '@family-os/ui'
import type { CalendarEvent } from '../types'
import { addDays, isSameDay, pickNextUp, startOfDay, upcomingByDay } from '../lib/grid'
import { AgendaRow } from './AgendaRow'
import { NextEventHero } from './NextEventHero'

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
        <NextEventHero
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
