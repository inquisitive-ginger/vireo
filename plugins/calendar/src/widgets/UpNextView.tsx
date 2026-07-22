import { useCallback, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { CalendarDays } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  EmptyState,
  Spine,
  WidgetHeader as UiWidgetHeader,
  WIDGET_CQ,
  WIDGET_INSET,
  cn,
  isSameDay,
  relativeDayLabel,
} from '@family-os/ui'
import type { CalendarEvent, CalendarMember } from '../types'
import { agendaWhenLabel } from '../lib/grid'
import { buildWeek, spanWhenLabel, type WeekDay, type WeekModel } from '../lib/week'
import { huesForEvent, spineColorsForEvent } from '../lib/hues'
import { EventOwners } from '../components/EventOwners'
import { NextEventHero } from '../components/NextEventHero'
import { SpanBand } from '../components/SpanBand'

/* `calendar.up-next` — the pure view (data comes from `UpNext.tsx`).

   THREE ZONES, THREE RANKS (2026-07-11 design pass). The tile is a hierarchy, not
   a list, and each zone wears a different SURFACE so none can be mistaken for a
   peer of the others:

     1. HERO — raised. The next event, washed in its owner's identity hue on a
        `--radius-hero` card. A moment.
     2. ALL-WEEK BAND — recessed. Multi-day events, cut into the tile as a
        full-bleed groove (`--surface-sunken` + `--shadow-inset`, ADR 040). A
        condition. It is the one element that touches both edges — which is
        exactly what a multi-day event does to a day-by-day view: runs past the
        frame.
     3. DAY LIST — flat. Appointments on the tile's own ground plane, in a day
        gutter. A sequence.

   Two structural fixes came with it. Multi-day events used to be bucketed by
   every day they TOUCHED, so one week-long camp claimed five rows and swamped the
   appointments; they now leave the list entirely for the band (`lib/week.ts`). And
   the window is one week, not 42 days, so the old "+40 more" — which read as a
   backlog rather than an offer — is now a "+2" or nothing at all.

   Two framings (owner avatars shown for Family, dropped for Mine), three sizes
   that self-size via CSS container queries (the shell renders `<Widget />` with no
   size prop). The whole tile deep-links to `/calendar` (read-only MVP). */

export type WidgetSize = 'compact' | 'standard' | 'large'
export type UpNextFraming = 'family' | 'mine'

export interface UpNextViewProps {
  events: CalendarEvent[]
  membersById: Map<string, CalendarMember>
  /** Current time — drives the countdown, "Later today", and day labels. */
  now: Date
  /** Family → owner avatars shown; Mine → dropped (all theirs), Family events tagged. */
  framing: UpNextFraming
  /** Explicit density override (Storybook / fixed hosts). Omitted in the shell —
      the view self-sizes to its rendered box via container queries. */
  size?: WidgetSize
}

interface ZoneProps {
  week: WeekModel
  membersById: Map<string, CalendarMember>
  now: Date
  framing: UpNextFraming
}

// shared pieces

// The slot-scaled widget inset (`WIDGET_INSET`, design-system.md §Spacing). Any
// full-bleed child must negate the matching value — see `AllWeekBand`'s `-mx-6`.
const INSET = WIDGET_INSET

function WidgetHeader() {
  return <UiWidgetHeader icon={CalendarDays} label="Calendar" />
}

function spineFor(event: CalendarEvent, membersById: Map<string, CalendarMember>): string[] {
  return spineColorsForEvent(huesForEvent(event.attendeeIds, membersById))
}

/* The owner marker is shared with the multi-day band (`EventOwners`) — the widget
   only supplies the framing rule: member avatars are dropped in Mine (everything
   on that surface is already theirs), while a no-owner Family event keeps its
   glyph in both framings. */
const showMembersIn = (framing: UpNextFraming) => framing === 'family'

/* Every row — appointment or "nothing else scheduled" — is exactly one ROW_BAND
   tall: 48px (a 28px avatar between 10px of padding), so its text always centres
   on y=24. The `min-h-12` floor is what holds that when there's no avatar to set
   the height (the Mine framing, an empty day) — otherwise those rows collapse to
   their text height and the day label drifts off them.

   Note `min-height` is border-box: the floor has to be the FULL 48, not the 28px
   content band, or the padding eats into it and the label rides ~5px high. */
const ROW_BAND = 'flex min-h-12 items-center py-2.5'

/* The gutter's day label MIRRORS the row's geometry rather than approximating it:
   the same 10px top inset, then the same 28px band, centred the same way. So the
   lead lands on the row's centre line exactly — by construction, not by
   arithmetic — and stays there if a line-height ever moves. The date then hangs
   below the band, which is why a day's first row runs taller than the ones under
   it: days get a little air, for free.

   (Two earlier attempts computed an inset from the lead's line box and missed by
   a few px each way. The line box is 21px, not the 17.5px `leading-tight` implies
   — the `text-*-token` utilities bake their own line-height and win the cascade,
   so that class is silently dead. Don't reach for it; mirror the band instead.) */
const GUTTER_INSET = 'pt-2.5'
const GUTTER_LEAD = 'flex h-7 items-center'

/** An appointment row: time · title · owners. */
function EventRow({
  event,
  membersById,
  framing,
  showOwners = true,
}: {
  event: CalendarEvent
  membersById: Map<string, CalendarMember>
  framing: UpNextFraming
  showOwners?: boolean
}) {
  return (
    <div className={cn(ROW_BAND, 'gap-3')}>
      <span className="text-sm-token w-16 shrink-0 tabular-nums text-muted-foreground">
        {agendaWhenLabel(event).toLowerCase()}
      </span>
      {/* The spine, not the avatar, carries the hue (ADR 042). An avatar can hold a
          PHOTO now, so it is no longer a strict superset of the spine — the premise
          this row was stripped on. Across the room the colour is what reads; the
          face is a close-up detail. */}
      <Spine color={spineFor(event, membersById)} />
      <span className="text-base-token min-w-0 flex-1 truncate text-foreground">{event.title}</span>
      {showOwners && (
        <EventOwners event={event} membersById={membersById} showMembers={showMembersIn(framing)} />
      )}
    </div>
  )
}

// ZONE 2 — the all-week band

/* The groove — the shared `SpanBand` primitive in its recessed container. The
   bleed margin has to track the tile's inset (`INSET.large`) exactly, or the groove
   stops reaching the edges, which is the whole point of it. The mobile agenda uses
   the same primitive in its `panel` container: same anatomy, different ground
   (ADR 040 forbids a recess directly on `--background`). */
function AllWeekBand({ week, membersById, now, framing }: ZoneProps) {
  return (
    <SpanBand
      spans={week.spans}
      membersById={membersById}
      now={now}
      container="groove"
      label="All week"
      showMembers={showMembersIn(framing)}
      className="-mx-6 mt-3.5"
    />
  )
}

/** The band, compressed to one line — for the narrow sizes, which have no room
    for a full-bleed groove but still must not drop the week's standing facts. */
function AllWeekLine({ week, membersById, now }: ZoneProps) {
  if (week.spans.length === 0) return null
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
      <span className="text-section-label shrink-0 text-muted-foreground">All week</span>
      {week.spans.map((event) => (
        <span key={event.id} className="flex min-w-0 items-center gap-1.5">
          <span
            aria-hidden
            className="size-2 shrink-0 rounded-full"
            style={{ background: spineFor(event, membersById)[0] }}
          />
          <span className="text-sm-token truncate text-foreground">{event.title}</span>
          <span className="text-sm-token shrink-0 text-muted-foreground">
            {spanWhenLabel(event, now).toLowerCase()}
          </span>
        </span>
      ))}
    </div>
  )
}

// ZONE 3 — the day list (height-aware)

/* One row of the gutter list. A day's label is printed on its FIRST row only, so
   the whole list stays a flat sequence of equal-height rows — which is what lets
   the height clamp below measure and cut at row granularity instead of dropping a
   whole day. */
interface Row {
  key: string
  lead?: string
  sub?: string
  event?: CalendarEvent
}

function buildRows(days: WeekDay[], now: Date): Row[] {
  const rows: Row[] = []
  for (const { date, events } of days) {
    const today = isSameDay(date, now)
    // An empty weekday is news ("nothing else scheduled"); an empty *today* is
    // just noise, so it doesn't get a band at all.
    if (today && events.length === 0) continue
    const { lead, sub } = today
      ? { lead: 'Later today', sub: undefined }
      : relativeDayLabel(date, now, { distant: 'weekday', sub: true })
    if (events.length === 0) {
      rows.push({ key: `empty-${date.toISOString()}`, lead, sub })
      continue
    }
    events.forEach((event, i) => {
      rows.push(i === 0 ? { key: event.id, lead, sub, event } : { key: event.id, event })
    })
  }
  return rows
}

// Reserve for the "+N more" line when the list is truncated.
const MORE_RESERVE = 26

/* Renders only the whole rows that fit the slot height, then a "+N more" line —
   never a partial row, never a scrollbar. A measuring pass renders every row once
   and caches its bottom offset (rows are single-line, so heights don't change with
   width); a ResizeObserver re-clamps from that cache. New data → a fresh pass. */
function DayList({
  week,
  membersById,
  now,
  framing,
  showOwners = true,
}: ZoneProps & { showOwners?: boolean }) {
  const rows = useMemo(() => buildRows(week.days, now), [week.days, now])
  const boxRef = useRef<HTMLDivElement | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)
  const bottomsRef = useRef<number[]>([])
  const [cut, setCut] = useState(rows.length)
  const [hidden, setHidden] = useState(0)
  const [measured, setMeasured] = useState<Row[] | null>(null)
  const measuring = measured !== rows

  const clamp = useCallback(
    (avail: number) => {
      const bottoms = bottomsRef.current
      if (avail <= 0 || bottoms.length !== rows.length || bottoms[rows.length - 1] <= avail) {
        setCut(rows.length)
        setHidden(0)
        return
      }
      const limit = avail - MORE_RESERVE
      let c = rows.length
      for (let i = 0; i < rows.length; i++) {
        if (bottoms[i] > limit) {
          c = i
          break
        }
      }
      setCut(c)
      setHidden(rows.slice(c).filter((r) => r.event).length)
    },
    [rows]
  )

  useLayoutEffect(() => {
    if (!measuring) return
    const box = boxRef.current
    const list = listRef.current
    if (!box || !list) return
    const kids = Array.from(list.children) as HTMLElement[]
    bottomsRef.current = kids.slice(0, rows.length).map((el) => el.offsetTop + el.offsetHeight)
    setMeasured(rows)
    clamp(box.clientHeight)
  }, [measuring, rows, clamp])

  useLayoutEffect(() => {
    const box = boxRef.current
    if (!box) return
    const ro = new ResizeObserver(() => {
      if (!measuring) clamp(box.clientHeight)
    })
    ro.observe(box)
    return () => ro.disconnect()
  }, [measuring, rows, clamp])

  const shown = measuring ? rows : rows.slice(0, cut)
  // Everything the tile isn't showing: rows clipped by the clamp, plus the
  // appointments that fall past the week's edge entirely.
  const more = hidden + week.beyond

  return (
    <div ref={boxRef} className="relative min-h-0 flex-1 overflow-hidden">
      <div ref={listRef} className="flex flex-col">
        {shown.map((row, i) => (
          <div key={row.key} className="grid grid-cols-[84px_1fr] gap-x-4">
            <div className={cn(row.lead && GUTTER_INSET)}>
              {row.lead && (
                <>
                  <div className={GUTTER_LEAD}>
                    <span className="text-base-token font-semibold text-foreground">
                      {row.lead}
                    </span>
                  </div>
                  {row.sub && <div className="text-sm-token text-muted-foreground">{row.sub}</div>}
                </>
              )}
            </div>
            <div className={cn(i > 0 && 'border-t border-border/50')}>
              {row.event ? (
                <EventRow
                  event={row.event}
                  membersById={membersById}
                  framing={framing}
                  showOwners={showOwners}
                />
              ) : (
                <div className={cn(ROW_BAND, 'text-sm-token text-muted-foreground/70')}>
                  Nothing else scheduled
                </div>
              )}
            </div>
          </div>
        ))}
        {!measuring && more > 0 && (
          <div className="text-sm-token mt-2 text-muted-foreground">
            <span className="underline underline-offset-4">Show {more} more</span>
          </div>
        )}
      </div>
    </div>
  )
}

/* The all-clear — "Nothing scheduled" always; body at large only. */
function AllClear({ withBody = false }: { withBody?: boolean }) {
  return (
    <div className={cn('flex size-full flex-col', withBody ? INSET.large : INSET.compact)}>
      <WidgetHeader />
      <div className="flex flex-1 items-center justify-center">
        <EmptyState
          heading="Nothing scheduled"
          body={withBody ? 'Your calendar is clear.' : undefined}
          compact
        />
      </div>
    </div>
  )
}

// size variants

/* Compact (1×1): the hero and one line of what follows. The groove needs width
   this size hasn't got, so spans collapse into the same trailing line. */
function Compact({ week, membersById, now, framing }: ZoneProps) {
  const { hero, spans, days } = week
  const rest = days.flatMap((d) => d.events)
  return (
    <div className={cn('flex size-full flex-col', INSET.compact)}>
      <WidgetHeader />
      <div className="mt-2.5 flex flex-1 flex-col justify-between gap-2">
        {hero && (
          <NextEventHero
            compact
            event={hero}
            membersById={membersById}
            now={now}
            showSoloOwner={framing === 'family'}
          />
        )}
        {spans.length > 0 ? (
          <span className="text-sm-token truncate text-muted-foreground">
            All week · {spans.map((s) => s.title).join(' · ')}
          </span>
        ) : (
          rest.length > 0 && (
            <span className="text-sm-token truncate text-muted-foreground">
              Then{' '}
              {rest
                .slice(0, 2)
                .map((e) => `${agendaWhenLabel(e)} ${e.title}`)
                .join(' · ')}
            </span>
          )
        )}
      </div>
    </div>
  )
}

/* Standard (2×1, wide and short): hero beside the list. Too narrow for the
   full-bleed groove, so the band compresses to its one-line form under the hero,
   and the list drops owner avatars (the column is tight). */
function Standard(props: ZoneProps) {
  const { week, membersById, now, framing } = props
  return (
    <div className={cn('flex size-full flex-col', INSET.standard)}>
      <WidgetHeader />
      <div className="mt-3 flex min-h-0 flex-1 items-stretch gap-5">
        <div className="flex min-w-0 flex-[1.15] flex-col gap-2">
          {week.hero && (
            <NextEventHero
              compact
              event={week.hero}
              membersById={membersById}
              now={now}
              showSoloOwner={framing === 'family'}
            />
          )}
          <AllWeekLine {...props} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <DayList {...props} showOwners={false} />
        </div>
      </div>
    </div>
  )
}

/* Large (2×2): the full three-zone hierarchy — raised hero, recessed all-week
   groove, flat day list. */
function Large(props: ZoneProps) {
  const { week, membersById, now, framing } = props
  return (
    <div className={cn('flex size-full flex-col', INSET.large)}>
      <WidgetHeader />
      <div className="mt-3">
        {week.hero && (
          <NextEventHero
            compact
            event={week.hero}
            membersById={membersById}
            now={now}
            showSoloOwner={framing === 'family'}
          />
        )}
      </div>
      <AllWeekBand {...props} />
      <div className="mt-3.5 flex min-h-0 flex-1 flex-col">
        <DayList {...props} />
      </div>
    </div>
  )
}

/* Container-query density toggle — ship every variant, let CSS reveal the one that
   fits the rendered box (mirrors chores `today-summary`). The two-column standard
   is wide-and-short, so it engages only when the slot is both wide (≥440px) and
   short (≤299px); everything narrower reflows to compact (short) or large (tall). */
const WIDGET_STYLES = `
  .cun-compact, .cun-standard, .cun-large { height: 100%; }
  .cun-compact  { display: block; }
  .cun-standard { display: none; }
  .cun-large    { display: none; }
  @container (min-height: ${WIDGET_CQ.tallMinHeight}) {
    .cun-compact  { display: none; }
    .cun-large    { display: block; }
  }
  @container (min-width: ${WIDGET_CQ.wideMinWidth}) and (max-height: ${WIDGET_CQ.shortMaxHeight}) {
    .cun-compact  { display: none; }
    .cun-large    { display: none; }
    .cun-standard { display: block; }
  }
`

export function UpNextView({ events, membersById, now, framing, size }: UpNextViewProps) {
  const week = useMemo(() => buildWeek(events, now), [events, now])
  const zones: ZoneProps = { week, membersById, now, framing }

  // Nothing at all this week — not even a running span.
  const empty = !week.hero && week.spans.length === 0

  let inner: ReactNode
  if (empty) {
    inner = <AllClear withBody={size === 'large' || size === undefined} />
  } else if (size) {
    inner =
      size === 'compact' ? (
        <Compact {...zones} />
      ) : size === 'standard' ? (
        <Standard {...zones} />
      ) : (
        <Large {...zones} />
      )
  } else {
    inner = (
      <div className="size-full" style={{ containerType: 'size' }}>
        <style href="calendar-up-next-widget" precedence="default">
          {WIDGET_STYLES}
        </style>
        <div className="cun-compact">
          <Compact {...zones} />
        </div>
        <div className="cun-standard">
          <Standard {...zones} />
        </div>
        <div className="cun-large">
          <Large {...zones} />
        </div>
      </div>
    )
  }

  return (
    <Link to="/calendar" className="block size-full no-underline" aria-label="Open Calendar">
      {inner}
    </Link>
  )
}
