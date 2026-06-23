import type { Meta, StoryObj } from '@storybook/react'
import { ChevronLeft, ChevronRight, Plus, Users } from 'lucide-react'
import { Button } from '../components/button'
import { identityToken, type IdentityHue } from '../lib/identity'
import { cn } from '../lib/utils'

/* ────────────────────────────────────────────────────────────────────────────
   CALENDAR UX EXPLORATION — Month grid (LOCKED)
   ----------------------------------------------------------------------------
   Exploration scaffolding for M3 Design: Calendar. NOT a shippable component —
   the dev session (Tablet Month View, #2) reads this as the visual reference,
   then deletes it.

   Locked 2026-06-22 via the visual gate:
     · FILLED hue pills (highlighter analog) — owner tint fill + ink text.
     · Family events (no attendee) — neutral pill (--secondary) + Users glyph.
     · Shared events (2+ attendees) — SPLIT fill: hard-stop tint segments, one
       per person (reads as two highlighters; gradient/dots were dropped).
       Multi-person was pulled into M3 scope here.
     · Multi-day spans — continuous bars; flush edges + ←/→ across weeks; carry
       the same solo/family/shared fill language (see "FISW Camp", shared).
     · Today — active date circle only (no cell wash/ring/bar).
     · Past — dim-events: past number + pills recede (~40%/60%); grid uniform.
     · Density — first few chips + "+N more" → drill into day/week (not built here).

   Family: Zach (teal) · Hallie (plum) · Zoe (marigold) · Teddy (sky).
   ──────────────────────────────────────────────────────────────────────────── */

// ─── Family fixture ───────────────────────────────────────────────────────────

const MEMBERS: Record<string, IdentityHue> = {
  Zach: 'teal',
  Hallie: 'plum',
  Zoe: 'marigold',
  Teddy: 'sky',
}

// ─── Event fixtures (June 2026) — owners[]: [] = Family, 1 = solo, 2+ = shared

type WeeklyEvent = { title: string; owners: string[]; weekday: number; time: string }
type SingleEvent = { title: string; owners: string[]; day: number; time?: string }
type SpanEvent = { title: string; owners: string[]; startDay: number; endDay: number }

// The recurring activity backbone — the part that dwarfs one-offs on paper.
const WEEKLY: WeeklyEvent[] = [
  { title: 'Gymnastics', owners: ['Zoe'], weekday: 1, time: '4:00' },
  { title: 'T&T', owners: ['Teddy'], weekday: 2, time: '5:15' },
  { title: 'Karate', owners: ['Zoe'], weekday: 3, time: '4:30' },
  { title: 'Swim', owners: ['Teddy'], weekday: 4, time: '6:00' },
  { title: 'Piano', owners: ['Zoe'], weekday: 5, time: '3:30' },
]

const SINGLES: SingleEvent[] = [
  { title: 'Dentist', owners: ['Zoe', 'Teddy'], day: 9, time: '10:00' }, // shared
  { title: 'Parent–teacher', owners: [], day: 11, time: '5:00' }, // Family
  { title: 'Soccer game', owners: ['Teddy'], day: 13, time: '9:00' },
  { title: 'Date night', owners: ['Zach', 'Hallie'], day: 20, time: '7:00' }, // shared
  { title: 'Family BBQ', owners: [], day: 21, time: '1:00' }, // Family
  { title: 'Doctor', owners: ['Zoe'], day: 23, time: '11:00' },
  { title: 'Book club', owners: ['Hallie'], day: 23, time: '7:30' },
  { title: "Zoe's party", owners: ['Zoe'], day: 27, time: '2:00' },
]

const SPANS: SpanEvent[] = [
  { title: 'Grandma visits', owners: [], startDay: 5, endDay: 8 }, // Family, wraps a week
  { title: 'Zach → London', owners: ['Zach'], startDay: 16, endDay: 19 }, // solo
  { title: 'FISW Camp', owners: ['Zoe', 'Teddy'], startDay: 22, endDay: 26 }, // shared span
  { title: 'School break', owners: [], startDay: 29, endDay: 30 }, // Family
]

// ─── Month grid math (June 2026, Sunday-start) ───────────────────────────────

const YEAR = 2026
const MONTH = 5 // June (0-indexed)
const TODAY = 22
const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

type Cell = { day: number | null; weekday: number }

function buildWeeks(): Cell[][] {
  const first = new Date(YEAR, MONTH, 1)
  const startOffset = first.getDay() // 0=Sun
  const daysInMonth = new Date(YEAR, MONTH + 1, 0).getDate()
  const total = startOffset + daysInMonth
  const weekCount = Math.ceil(total / 7)
  const weeks: Cell[][] = []
  let cursor = 1 - startOffset
  for (let w = 0; w < weekCount; w++) {
    const week: Cell[] = []
    for (let d = 0; d < 7; d++) {
      week.push({ day: cursor >= 1 && cursor <= daysInMonth ? cursor : null, weekday: d })
      cursor++
    }
    weeks.push(week)
  }
  return weeks
}

type Chip = { title: string; hues: IdentityHue[]; time?: string }

const huesFor = (owners: string[]): IdentityHue[] => owners.map((n) => MEMBERS[n])

// Single-day chips for a given day-of-month: weekly occurrences + one-offs.
function chipsForDay(day: number): Chip[] {
  const weekday = new Date(YEAR, MONTH, day).getDay()
  const weekly = WEEKLY.filter((e) => e.weekday === weekday).map((e) => ({
    title: e.title,
    hues: huesFor(e.owners),
    time: e.time,
  }))
  const singles = SINGLES.filter((e) => e.day === day).map((e) => ({
    title: e.title,
    hues: huesFor(e.owners),
    time: e.time,
  }))
  return [...weekly, ...singles]
}

// Spans intersecting a week, clipped to the week's column range.
type WeekSpan = {
  title: string
  hues: IdentityHue[]
  startCol: number
  endCol: number
  openStart: boolean
  openEnd: boolean
  lane: number
}

function spansForWeek(week: Cell[]): WeekSpan[] {
  const weekDays = week.map((c) => c.day).filter((d): d is number => d != null)
  if (weekDays.length === 0) return []
  const weekMin = weekDays[0]
  const weekMax = weekDays[weekDays.length - 1]
  const placed: WeekSpan[] = []
  const laneEnds: number[] = []

  for (const s of SPANS) {
    if (s.endDay < weekMin || s.startDay > weekMax) continue
    const clampedStart = Math.max(s.startDay, weekMin)
    const clampedEnd = Math.min(s.endDay, weekMax)
    const startCol = week.findIndex((c) => c.day === clampedStart)
    const endCol = week.findIndex((c) => c.day === clampedEnd)
    let lane = laneEnds.findIndex((end) => end < startCol)
    if (lane === -1) {
      lane = laneEnds.length
      laneEnds.push(endCol)
    } else {
      laneEnds[lane] = endCol
    }
    placed.push({
      title: s.title,
      hues: huesFor(s.owners),
      startCol,
      endCol,
      openStart: s.startDay < clampedStart,
      openEnd: s.endDay > clampedEnd,
      lane,
    })
  }
  return placed
}

// ─── Fill resolution ──────────────────────────────────────────────────────────

// Background + text by attendee count: Family (neutral), solo (single tint), or
// shared (SPLIT fill — hard-stop tint segments, one per person, neutral ink).
function fillFor(hues: IdentityHue[]): { background: string; color: string } {
  if (hues.length === 0) {
    return { background: 'var(--secondary)', color: 'var(--secondary-foreground)' }
  }
  if (hues.length === 1) {
    return { background: identityToken(hues[0], 'tint'), color: identityToken(hues[0], 'ink') }
  }
  const tints = hues.map((h) => identityToken(h, 'tint'))
  const n = tints.length
  const background = `linear-gradient(90deg, ${tints
    .map((t, i) => `${t} ${Math.round((i / n) * 100)}% ${Math.round(((i + 1) / n) * 100)}%`)
    .join(', ')})`
  return { background, color: 'var(--foreground)' }
}

// ─── Chips ───────────────────────────────────────────────────────────────────

const MAX_CHIPS = 3

function EventChip({ chip }: { chip: Chip }) {
  const label = chip.time ? `${chip.time} ${chip.title}` : chip.title
  const { background, color } = fillFor(chip.hues)
  return (
    <div
      className="flex items-center gap-1 truncate rounded-md px-1.5 py-0.5 text-xs-token font-semibold"
      style={{ background, color }}
    >
      {chip.hues.length === 0 && <Users className="h-2.5 w-2.5 shrink-0 opacity-70" />}
      <span className="truncate">{label}</span>
    </div>
  )
}

function SpanBar({ span }: { span: WeekSpan }) {
  const { background, color } = fillFor(span.hues)
  const radius = cn(
    'truncate',
    span.openStart ? 'rounded-l-none' : 'rounded-l-md',
    span.openEnd ? 'rounded-r-none' : 'rounded-r-md'
  )
  return (
    <div
      className={cn(radius, 'flex h-full items-center px-1.5 text-xs-token font-semibold')}
      style={{ background, color }}
    >
      {span.hues.length === 0 && !span.openStart && (
        <Users className="mr-1 h-2.5 w-2.5 shrink-0 opacity-70" />
      )}
      <span className="truncate">
        {span.openStart ? '← ' : ''}
        {span.title}
        {span.openEnd ? ' →' : ''}
      </span>
    </div>
  )
}

// ─── Layout constants ────────────────────────────────────────────────────────

const CELL_PT = 6
const NUMBER_H = 20
const NUM_GAP = 8
const SPAN_LANE_H = 20
const FIRST_LANE_TOP = CELL_PT + NUMBER_H + NUM_GAP

// ─── Month grid ──────────────────────────────────────────────────────────────

function MonthGrid() {
  const weeks = buildWeeks()

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
      {/* Header chrome */}
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-2">
          <h2 className="text-page-title text-foreground">June 2026</h2>
          <div className="ml-1 flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" aria-label="Previous month">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="Next month">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              Today
            </Button>
          </div>
        </div>
        <Button size="sm">
          <Plus className="mr-1 h-4 w-4" /> Add event
        </Button>
      </div>

      {/* Weekday header */}
      <div className="grid grid-cols-7 border-b border-border">
        {WEEKDAY_LABELS.map((d) => (
          <div key={d} className="px-2 py-1.5 text-center text-section-label text-muted-foreground">
            {d}
          </div>
        ))}
      </div>

      {/* Week rows */}
      {weeks.map((week, wi) => {
        const spans = spansForWeek(week)
        const laneCount = spans.reduce((m, s) => Math.max(m, s.lane + 1), 0)
        const spanBandH = laneCount * SPAN_LANE_H

        return (
          <div key={wi} className="relative grid grid-cols-7">
            {week.map((cell, ci) => {
              const chips = cell.day != null ? chipsForDay(cell.day) : []
              const visible = chips.slice(0, MAX_CHIPS)
              const more = chips.length - visible.length
              const isToday = cell.day === TODAY
              const isPast = cell.day != null && cell.day < TODAY // locked: dim-events
              return (
                <div
                  key={ci}
                  className={cn(
                    'min-h-[128px] border-b border-r border-border px-1.5 pb-1.5 pt-1.5 last:border-r-0',
                    ci === 6 && 'border-r-0',
                    cell.day == null && 'bg-muted/30'
                  )}
                >
                  {/* date number — today gets the filled primary circle */}
                  <div className="flex h-5 items-center">
                    {cell.day != null && (
                      <span
                        className={cn(
                          'flex h-6 w-6 items-center justify-center rounded-full text-sm-token',
                          isToday
                            ? 'bg-primary font-semibold text-primary-foreground'
                            : 'text-muted-foreground',
                          isPast && 'opacity-40'
                        )}
                      >
                        {cell.day}
                      </span>
                    )}
                  </div>
                  {/* gap below the number + reserved space for the span band */}
                  <div style={{ height: NUM_GAP + spanBandH }} />
                  {/* single-day chips — past days recede */}
                  <div className={cn('flex flex-col gap-0.5', isPast && 'opacity-60')}>
                    {visible.map((c, i) => (
                      <EventChip key={i} chip={c} />
                    ))}
                    {more > 0 && (
                      <button className="rounded px-1.5 py-0.5 text-left text-xs-token font-medium text-muted-foreground hover:bg-muted">
                        +{more} more
                      </button>
                    )}
                  </div>
                </div>
              )
            })}

            {/* span overlay (sits on top of the reserved band) */}
            <div className="pointer-events-none absolute inset-0">
              {spans.map((s, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${(s.startCol / 7) * 100}%`,
                    width: `${((s.endCol - s.startCol + 1) / 7) * 100}%`,
                    top: FIRST_LANE_TOP + s.lane * SPAN_LANE_H + 2,
                    height: SPAN_LANE_H - 4,
                    paddingLeft: s.openStart ? 0 : 6,
                    paddingRight: s.openEnd ? 0 : 6,
                  }}
                >
                  <div className="relative h-full">
                    <SpanBar span={s} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Legend ──────────────────────────────────────────────────────────────────

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-4 pt-3">
      {Object.entries(MEMBERS).map(([name, hue]) => (
        <div key={name} className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full" style={{ background: identityToken(hue) }} />
          <span className="text-sm-token text-muted-foreground">{name}</span>
        </div>
      ))}
      <div className="flex items-center gap-1.5">
        <Users className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-sm-token text-muted-foreground">Family</span>
      </div>
      <span className="text-sm-token text-muted-foreground">
        · shared events (Dentist, Date night, FISW Camp) use the split fill
      </span>
    </div>
  )
}

// ─── Story wiring ─────────────────────────────────────────────────────────────

const meta: Meta<typeof MonthGrid> = {
  title: 'Calendar Exploration/Month Grid',
  component: MonthGrid,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ background: 'var(--background)', padding: 24, minHeight: '100vh' }}>
        <div className="mx-auto" style={{ width: 1060 }}>
          <Story />
          <Legend />
        </div>
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof MonthGrid>

export const MonthView: Story = {
  name: 'Month view (locked)',
}
