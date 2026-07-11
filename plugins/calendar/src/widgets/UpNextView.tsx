import { useCallback, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { CalendarDays } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  EmptyState,
  Spine,
  WidgetHeader as UiWidgetHeader,
  WIDGET_CQ,
  relativeDayLabel,
} from '@family-os/ui'
import type { CalendarEvent } from '../types'
import { formatTime, isSameDay, pickNextUp, upcomingByDay } from '../lib/grid'
import { huesForEvent, spineColorsForEvent } from '../lib/hues'
import { NextEventHero } from '../components/NextEventHero'

/* `calendar.up-next` — the pure view (data comes from `UpNext.tsx`). The chosen
   design (Frame C, "Next Hero"): one washed, dominant `NextEventHero` over a
   quiet, fill-less agenda of what's after it. Two framings (owner names shown for
   Family, dropped for Mine), three sizes that **self-size via CSS container
   queries** (the shell renders `<Widget />` with no size prop). The whole tile
   deep-links to `/calendar` (read-only MVP). */

export type WidgetSize = 'compact' | 'standard' | 'large'
export type UpNextFraming = 'family' | 'mine'

export interface UpNextViewProps {
  events: CalendarEvent[]
  membersById: Map<string, string>
  /** Current time — drives the countdown, "Later today", and day labels. */
  now: Date
  /** Family → owner names shown; Mine → dropped (all theirs), Family events tagged. */
  framing: UpNextFraming
  /** Explicit density override (Storybook / fixed hosts). Omitted in the shell —
      the view self-sizes to its rendered box via container queries. */
  size?: WidgetSize
}

// helpers

function ownerNamesOf(event: CalendarEvent, membersById: Map<string, string>): string[] {
  return event.attendeeIds.map((id) => membersById.get(id)).filter((n): n is string => Boolean(n))
}

function ownerLabel(
  event: CalendarEvent,
  framing: UpNextFraming,
  membersById: Map<string, string>
): string | undefined {
  const names = ownerNamesOf(event, membersById)
  if (names.length === 0) return 'Family'
  if (framing === 'mine') return undefined // all theirs
  return names.join(' & ')
}

function spineFor(event: CalendarEvent, membersById: Map<string, string>): string[] {
  return spineColorsForEvent(huesForEvent(event.attendeeIds, membersById))
}

// shared pieces

/* CalendarDays + "Calendar" widget identity — the shared `WidgetHeader` primitive
   supplied with this module's glyph + label. */
function WidgetHeader() {
  return <UiWidgetHeader icon={CalendarDays} label="Calendar" />
}

/* Day heading — a `text-base-token` semibold lead in the foreground with a muted
   secondary date (never a coloured label). Sized below the hero so the next event
   stays the one element with weight. */
function DayHeading({ lead, sub }: { lead: string; sub?: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-base-token font-semibold text-foreground">{lead}</span>
      {sub && <span className="text-sm-token text-muted-foreground">{sub}</span>}
    </div>
  )
}

/* A quiet, fill-less agenda row — leading owner-hue spine + time + title + owner.
   No fill, so the washed hero above stays the only element with weight.
   `showOwner=false` in tight columns (the spine already codes owner). */
function QuietEventRow({
  event,
  membersById,
  framing,
  showOwner = true,
}: {
  event: CalendarEvent
  membersById: Map<string, string>
  framing: UpNextFraming
  showOwner?: boolean
}) {
  const label = showOwner ? ownerLabel(event, framing, membersById) : undefined
  return (
    <div className="flex items-center gap-2.5 py-1">
      <Spine color={spineFor(event, membersById)} />
      <span className="text-sm-token w-18 shrink-0 whitespace-nowrap font-medium tabular-nums text-muted-foreground">
        {formatTime(event.startsAt)}
      </span>
      <span className="text-sm-token min-w-0 flex-1 truncate text-foreground">{event.title}</span>
      {label && (
        <span className="text-xs-token shrink-0 truncate text-muted-foreground">{label}</span>
      )}
    </div>
  )
}

function MoreLine({ n }: { n: number }) {
  return <div className="mt-1.5 text-sm-token text-muted-foreground">+{n} more</div>
}

/* The all-clear empty state — "Nothing scheduled" always; body at large only. */
function AllClear({ withBody = false }: { withBody?: boolean }) {
  return (
    <div className="flex size-full flex-col p-4">
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

// the "then" agenda (height-aware)

type Block =
  | { kind: 'heading'; key: string; lead: string; sub?: string }
  | { kind: 'event'; key: string; event: CalendarEvent }

/* The upcoming events (hero excluded) grouped by day into a flat block list —
   a day heading then its rows, rolling forward across days. */
function buildBlocks(events: CalendarEvent[], now: Date, heroId: string): Block[] {
  const days = upcomingByDay(events, now)
    .map((d) => ({ date: d.date, events: d.events.filter((e) => e.id !== heroId) }))
    .filter((d) => d.events.length > 0)
  const blocks: Block[] = []
  for (const d of days) {
    const today = isSameDay(d.date, now)
    // Today's follow-on group reads "Later today"; other days keep the mobile
    // agenda's weekday lead + muted date (weekday even past a week — the date
    // disambiguates).
    const { lead, sub } = today
      ? { lead: 'Later today', sub: undefined }
      : relativeDayLabel(d.date, now, { distant: 'weekday', sub: true })
    blocks.push({ kind: 'heading', key: `h-${d.date.toISOString()}`, lead, sub })
    for (const e of d.events) blocks.push({ kind: 'event', key: e.id, event: e })
  }
  return blocks
}

/* Vertical spacing carried as margins so the measured geometry matches what's
   drawn. A new day (a non-first heading) is set apart by space, not a rule —
   depth/spacing, not lines (design-system.md §Principles); rows sit tight under
   their heading. */
function blockSpacing(blocks: Block[], i: number): string {
  if (i === 0) return ''
  if (blocks[i].kind === 'heading') return 'mt-5'
  return blocks[i - 1].kind === 'heading' ? 'mt-1.5' : 'mt-0.5'
}

// Reserve for the "+N more" line when the list is truncated.
const MORE_RESERVE = 26

/* Renders only the whole blocks that fit the slot height, then a "+N more" line —
   never a partial row, never a scrollbar. A measuring pass renders all blocks
   once, caches each block's bottom offset (heights are single-line, so they don't
   change with width), then clamps; a ResizeObserver re-clamps from the cache on
   resize. New data → a fresh measuring pass. */
function ThenAgenda({
  events,
  now,
  heroId,
  membersById,
  framing,
  showOwner = true,
}: {
  events: CalendarEvent[]
  now: Date
  heroId: string
  membersById: Map<string, string>
  framing: UpNextFraming
  showOwner?: boolean
}) {
  const blocks = useMemo(() => buildBlocks(events, now, heroId), [events, now, heroId])
  const boxRef = useRef<HTMLDivElement | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)
  const bottomsRef = useRef<number[]>([])
  const [cut, setCut] = useState(blocks.length)
  const [hidden, setHidden] = useState(0)
  // A fresh block list needs a full-render measuring pass before we can clamp.
  const [measured, setMeasured] = useState<Block[] | null>(null)
  const measuring = measured !== blocks

  const clamp = useCallback(
    (avail: number) => {
      const bottoms = bottomsRef.current
      if (avail <= 0 || bottoms.length !== blocks.length || bottoms[blocks.length - 1] <= avail) {
        setCut(blocks.length)
        setHidden(0)
        return
      }
      const limit = avail - MORE_RESERVE
      let c = blocks.length
      for (let i = 0; i < blocks.length; i++) {
        if (bottoms[i] > limit) {
          c = i
          break
        }
      }
      // Never end on a dangling day heading.
      while (c > 0 && blocks[c - 1].kind === 'heading') c--
      setCut(c)
      setHidden(blocks.slice(c).filter((b) => b.kind === 'event').length)
    },
    [blocks]
  )

  useLayoutEffect(() => {
    if (!measuring) return
    const box = boxRef.current
    const list = listRef.current
    if (!box || !list) return
    const kids = Array.from(list.children) as HTMLElement[]
    bottomsRef.current = kids.slice(0, blocks.length).map((el) => el.offsetTop + el.offsetHeight)
    setMeasured(blocks)
    clamp(box.clientHeight)
  }, [measuring, blocks, clamp])

  useLayoutEffect(() => {
    const box = boxRef.current
    if (!box) return
    const ro = new ResizeObserver(() => {
      if (!measuring) clamp(box.clientHeight)
    })
    ro.observe(box)
    return () => ro.disconnect()
  }, [measuring, blocks, clamp])

  const shown = measuring ? blocks : blocks.slice(0, cut)
  return (
    <div ref={boxRef} className="relative min-h-0 flex-1 overflow-hidden">
      <div ref={listRef} className="flex flex-col">
        {shown.map((b, i) => (
          <div key={b.key} className={blockSpacing(blocks, i)}>
            {b.kind === 'heading' ? (
              <DayHeading lead={b.lead} sub={b.sub} />
            ) : (
              <QuietEventRow
                event={b.event}
                membersById={membersById}
                framing={framing}
                showOwner={showOwner}
              />
            )}
          </div>
        ))}
        {!measuring && hidden > 0 && <MoreLine n={hidden} />}
      </div>
    </div>
  )
}

// size variants

function Compact({ events, membersById, now, framing }: Required<Omit<UpNextViewProps, 'size'>>) {
  const upcoming = upcomingByDay(events, now).flatMap((d) => d.events)
  if (upcoming.length === 0) return <AllClear />
  const hero = pickNextUp(upcomingByDay(events, now), now) ?? upcoming[0]
  const rest = upcoming.filter((e) => e.id !== hero.id)
  return (
    <div className="flex size-full flex-col p-4">
      <WidgetHeader />
      <div className="mt-2.5 flex flex-1 flex-col justify-between gap-2">
        <NextEventHero
          compact
          event={hero}
          membersById={membersById}
          now={now}
          showSoloOwner={framing === 'family'}
        />
        {rest.length > 0 && (
          <span className="text-sm-token truncate text-muted-foreground">
            Then{' '}
            {rest
              .slice(0, 2)
              .map((e) => `${formatTime(e.startsAt)} ${e.title}`)
              .join(' · ')}
          </span>
        )}
      </div>
    </div>
  )
}

function Standard({ events, membersById, now, framing }: Required<Omit<UpNextViewProps, 'size'>>) {
  const upcoming = upcomingByDay(events, now).flatMap((d) => d.events)
  if (upcoming.length === 0) return <AllClear />
  const hero = pickNextUp(upcomingByDay(events, now), now) ?? upcoming[0]
  // Hero nudged narrower and the list flexes so titles breathe; owner drops to the
  // hue spine in this tight column.
  return (
    <div className="flex size-full flex-col p-4">
      <WidgetHeader />
      <div className="mt-3 flex min-h-0 flex-1 items-stretch gap-5">
        <div className="min-w-0 flex-[1.15]">
          <NextEventHero
            compact
            event={hero}
            membersById={membersById}
            now={now}
            showSoloOwner={framing === 'family'}
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <ThenAgenda
            events={events}
            now={now}
            heroId={hero.id}
            membersById={membersById}
            framing={framing}
            showOwner={false}
          />
        </div>
      </div>
    </div>
  )
}

function Large({ events, membersById, now, framing }: Required<Omit<UpNextViewProps, 'size'>>) {
  const upcoming = upcomingByDay(events, now).flatMap((d) => d.events)
  if (upcoming.length === 0) return <AllClear withBody />
  const hero = pickNextUp(upcomingByDay(events, now), now) ?? upcoming[0]
  return (
    <div className="flex size-full flex-col p-4">
      <WidgetHeader />
      <div className="mt-3">
        <NextEventHero
          compact
          event={hero}
          membersById={membersById}
          now={now}
          showSoloOwner={framing === 'family'}
        />
      </div>
      <div className="mt-4 flex min-h-0 flex-1 flex-col">
        <ThenAgenda
          events={events}
          now={now}
          heroId={hero.id}
          membersById={membersById}
          framing={framing}
        />
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
  const shared = { events, membersById, now, framing }
  const compact = <Compact {...shared} />
  const standard = <Standard {...shared} />
  const large = <Large {...shared} />

  let inner: ReactNode
  if (size) {
    inner = size === 'compact' ? compact : size === 'standard' ? standard : large
  } else {
    inner = (
      <div className="size-full" style={{ containerType: 'size' }}>
        <style href="calendar-up-next-widget" precedence="default">
          {WIDGET_STYLES}
        </style>
        <div className="cun-compact">{compact}</div>
        <div className="cun-standard">{standard}</div>
        <div className="cun-large">{large}</div>
      </div>
    )
  }

  return (
    <Link to="/calendar" className="block size-full no-underline" aria-label="Open Calendar">
      {inner}
    </Link>
  )
}
