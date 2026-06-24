import { Plus } from 'lucide-react'
import { cn } from '@family-os/ui'
import type { LaidOutWeek } from '../lib/grid'
import { WEEKDAY_LABELS, isSameDay, dayDiff } from '../lib/grid'
import { EventChip } from './EventChip'
import { SpanBar } from './SpanBar'

// Layout constants (px) — ported from the locked exploration so the span overlay
// lines up with the reserved band under each cell's date number.
const CELL_PT = 6
const NUMBER_H = 20
const NUM_GAP = 8
const SPAN_LANE_H = 20
const FIRST_LANE_TOP = CELL_PT + NUMBER_H + NUM_GAP

const MAX_CHIPS = 3

export function MonthGrid({
  weeks,
  membersById,
  today,
  onDrillDay,
  onQuickAdd,
}: {
  weeks: LaidOutWeek[]
  membersById: Map<string, string>
  today: Date
  onDrillDay: (date: Date) => void
  /** Tier-4 quick-add: a "+" revealed on cell hover (hover-capable devices only)
      that creates an event prefilled to that day. Touch devices never see it —
      they reach the same add via tap → day agenda → "+ Add". */
  onQuickAdd?: (date: Date) => void
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
      {/* Weekday header */}
      <div className="grid grid-cols-7 border-b border-border">
        {WEEKDAY_LABELS.map((d) => (
          <div key={d} className="px-2 py-1.5 text-center text-section-label text-muted-foreground">
            {d}
          </div>
        ))}
      </div>

      {weeks.map((week, wi) => {
        const spanBandH = week.laneCount * SPAN_LANE_H
        return (
          <div key={wi} className="relative grid grid-cols-7">
            {week.cells.map((cell, ci) => {
              const visible = cell.events.slice(0, MAX_CHIPS)
              const more = cell.events.length - visible.length
              const isToday = isSameDay(cell.date, today)
              const isPast = dayDiff(today, cell.date) < 0 // before today → dim-events
              return (
                <div
                  key={ci}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${cell.date.toDateString()}`}
                  onClick={() => onDrillDay(cell.date)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') onDrillDay(cell.date)
                  }}
                  className={cn(
                    'group min-h-[128px] cursor-pointer border-b border-r border-border px-1.5 pb-1.5 pt-1.5 transition-colors last:border-r-0 hover:bg-muted/40 focus:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                    ci === 6 && 'border-r-0',
                    !cell.inMonth && 'bg-muted/30'
                  )}
                >
                  {/* date number — today gets the filled primary circle */}
                  <div className="flex h-5 items-center justify-between">
                    <span
                      className={cn(
                        'flex h-6 w-6 items-center justify-center rounded-full text-sm-token',
                        isToday
                          ? 'bg-primary font-semibold text-primary-foreground'
                          : 'text-muted-foreground',
                        !cell.inMonth && 'opacity-50',
                        isPast && !isToday && 'opacity-40'
                      )}
                    >
                      {cell.date.getDate()}
                    </span>
                    {onQuickAdd && (
                      // Hover-only quick-add (hover-capable devices); revealed on
                      // cell hover or keyboard focus. Hidden entirely on touch.
                      <button
                        type="button"
                        aria-label={`Add event on ${cell.date.toDateString()}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          onQuickAdd(cell.date)
                        }}
                        className="hidden size-6 items-center justify-center rounded-full text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:hover)]:flex"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  {/* reserved space: gap below the number + the span band */}
                  <div style={{ height: NUM_GAP + spanBandH }} />
                  {/* single-day chips — past days recede */}
                  <div className={cn('flex flex-col gap-0.5', isPast && 'opacity-60')}>
                    {visible.map((event) => (
                      <EventChip key={event.id} event={event} membersById={membersById} />
                    ))}
                    {more > 0 && (
                      <button
                        className="rounded px-1.5 py-0.5 text-left text-xs-token font-medium text-muted-foreground hover:bg-muted"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDrillDay(cell.date)
                        }}
                      >
                        +{more} more
                      </button>
                    )}
                  </div>
                </div>
              )
            })}

            {/* span overlay — sits on top of the reserved band */}
            <div className="pointer-events-none absolute inset-0">
              {week.spans.map((s, i) => (
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
                  <SpanBar span={s} membersById={membersById} />
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
