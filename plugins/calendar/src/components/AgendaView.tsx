import { CalendarDays, Plus } from 'lucide-react'
import { Button, EmptyState, relativeDayLabel } from '@family-os/ui'
import type { DayMark } from '@family-os/platform/types'
import type { CalendarEvent, CalendarMember } from '../types'
import { isSameDay, localDateKey } from '../lib/grid'
import { buildAgenda } from '../lib/week'
import { AgendaRow } from './AgendaRow'
import { DayHeading } from './DayHeading'
import { NextEventHero } from './NextEventHero'
import { SpanBand, SpanRow } from './SpanBand'
import { DayMarkOwnerDot } from './DayMarkOwnerDot'

/* The mobile read surface (story #4): a forward-looking, day-grouped agenda led
   by an "Up next" hero — the one thing a parent opens the phone to check —
   washed in the owner's identity colour, then the rest of the day(s) as
   full-width `AgendaRow`s. Reads the same `['calendar/events']` data the tablet
   surfaces do, so an event added here (or on the wall tablet) shows on both.

   MULTI-DAY EVENTS ARE STATED ONCE (2026-07-11). This surface used to bucket every
   event by every day it TOUCHED, so a week-long camp claimed a row on all five —
   the same density bug the up-next widget carried. Spans now leave the day rows for
   the shared `SpanBand` primitive: pinned at the top if already **running**,
   otherwise inline **once**, in the day they begin.

   The band renders as a `panel` here, not the widget's recessed `groove`: this
   surface sits directly on `--background`, and a recess needs something to be
   recessed into (ADR 040). */

const EMPTY_MARKS: Map<string, DayMark[]> = new Map()

export function AgendaView({
  events,
  membersById,
  now,
  onEditEvent,
  onAdd,
  marksByDate = EMPTY_MARKS,
}: {
  events: CalendarEvent[]
  membersById: Map<string, CalendarMember>
  /** Current time — drives "up next" and the Today/Tomorrow labels. */
  now: Date
  /** Tap an event → edit (tier 4). Absent → rows are read-only. */
  onEditEvent?: (event: CalendarEvent) => void
  /** Empty-state CTA (tier 4). */
  onAdd?: () => void
  /** Read-time day marks (ADR 050), keyed by `YYYY-MM-DD` — already capped and
      permission-filtered server-side (ADR 066). A day with only a mark and no
      events still gets a header, so the label has somewhere to sit. */
  marksByDate?: Map<string, DayMark[]>
}) {
  const markDates = new Set(marksByDate.keys())
  const { hero, running, days } = buildAgenda(events, now, markDates)

  if (days.length === 0 && running.length === 0 && !hero) {
    return (
      <div className="rounded-panel border border-border bg-card py-6 shadow-[var(--shadow-card)]">
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

  const heroIsToday = hero ? isSameDay(new Date(hero.startsAt), now) : false

  return (
    <div className="flex flex-col gap-7">
      {hero && (
        <NextEventHero
          event={hero}
          membersById={membersById}
          now={now}
          onClick={onEditEvent ? () => onEditEvent(hero) : undefined}
        />
      )}

      {/* Already under way — their start day has passed, so no section below can
          carry them. "Ongoing", not "All week": this list runs six weeks. */}
      <SpanBand
        spans={running}
        membersById={membersById}
        now={now}
        container="panel"
        label="Ongoing"
        onSelect={onEditEvent}
      />

      {days.map((day) => {
        const { lead, sub } = sectionLabel(day.date, now, heroIsToday)
        const dayMarks = marksByDate.get(localDateKey(day.date)) ?? []
        return (
          <section key={day.date.toISOString()}>
            <div className="mb-2.5 flex items-baseline justify-between gap-2">
              <DayHeading lead={lead} sub={sub} today={isSameDay(day.date, now)} />
              {dayMarks.length > 0 && (
                <div className="flex items-center gap-3">
                  {dayMarks.map((mark) => {
                    const owner = mark.ownerId ? membersById.get(mark.ownerId) : undefined
                    return (
                      <div
                        key={`${mark.ownerId ?? ''}-${mark.glyph}`}
                        className="flex items-center gap-1.5 text-sm-token text-muted-foreground"
                      >
                        {owner && <DayMarkOwnerDot member={owner} />}
                        <span>{mark.label}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2.5">
              {/* A span begins here — stated once, in the day it starts, and never
                  again on the days it covers. */}
              {day.startingSpans.length > 0 && (
                <div className="rounded-panel border border-border bg-card px-4 py-1 shadow-[var(--shadow-card)]">
                  {day.startingSpans.map((event) => (
                    <SpanRow
                      key={event.id}
                      event={event}
                      membersById={membersById}
                      now={now}
                      onClick={onEditEvent ? () => onEditEvent(event) : undefined}
                    />
                  ))}
                </div>
              )}
              {day.timed.map((event) => (
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
   secondary date — the warm header treatment that replaces an all-caps label. The
   hero already carries today's next event, so today's remainder reads "Later today". */
function sectionLabel(date: Date, now: Date, heroIsToday: boolean): { lead: string; sub?: string } {
  if (heroIsToday && isSameDay(date, now)) return { lead: 'Later today' }
  return relativeDayLabel(date, now, { distant: 'weekday', sub: true })
}
