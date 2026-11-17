import { useState, type ReactNode } from 'react'
import type { DayMark, DayMarkLine } from '@family-os/platform/types'
import { cn } from '@family-os/ui'
import type { CalendarMember } from '../types'
import { DAY_MARK_GLYPHS } from '../lib/day-mark-glyphs'
import { formatMinutes, hasOpenLine, headlineLine, type MarkLineAction } from '../lib/mark-lines'
import { DayMarkOwnerDot } from './DayMarkOwnerDot'
import { MarkLines } from './MarkLines'

export type MarkActionProps = {
  /** Claim, swap or clear one of a mark's lines (D-087). Only called for a mark
      that carries `act`. */
  onMarkAction?: (mark: DayMark, line: DayMarkLine, action: MarkLineAction) => void
  markPending?: boolean
}

/* A day's heading row with its marks (ADR 050), shared by the agenda and the
   day/week drill-in. A mark with lines is a button that unfolds them under the
   row (D-091). */
export function DayHeader({
  heading,
  action,
  marks,
  membersById,
  now,
  onMarkAction,
  markPending,
  className,
}: {
  heading: ReactNode
  action?: ReactNode
  marks: DayMark[]
  membersById: Map<string, CalendarMember>
  now: Date
  className?: string
} & MarkActionProps) {
  const [unfolded, setUnfolded] = useState<string | null>(null)
  if (marks.length === 0 && !action && !heading) return null
  return (
    <>
      <div className={cn('flex items-baseline justify-between gap-2', className)}>
        {heading ?? <span />}
        {(marks.length > 0 || action) && (
          <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1">
            {marks.map((mark) => {
              const owner = mark.ownerId ? membersById.get(mark.ownerId) : undefined
              if (mark.lines) {
                const key = `${mark.date}-${mark.glyph}`
                const line = headlineLine(mark, now)
                const open = hasOpenLine(mark)
                const Glyph = DAY_MARK_GLYPHS[mark.glyph]
                return (
                  <button
                    key={key}
                    type="button"
                    aria-expanded={unfolded === key}
                    aria-controls={`mark-lines-${key}`}
                    aria-label={`${line ? `Next: ${formatMinutes(line.minutes)}, ${line.text}` : mark.label}${open ? '. One is open' : ''}. Show the day's list.`}
                    onClick={() => setUnfolded(unfolded === key ? null : key)}
                    className="-my-2 flex cursor-pointer items-center gap-1.5 rounded-card py-2 text-sm-token text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {Glyph && <Glyph aria-hidden className="h-4 w-4 shrink-0" />}
                    <span>
                      {line ? `${formatMinutes(line.minutes)} · ${line.text}` : mark.label}
                    </span>
                    {open && (
                      <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-error" />
                    )}
                  </button>
                )
              }
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
            {action}
          </div>
        )}
      </div>
      {marks
        .filter((mark) => mark.lines && unfolded === `${mark.date}-${mark.glyph}`)
        .map((mark) => (
          <MarkLines
            key={mark.glyph}
            mark={mark}
            membersById={membersById}
            onAction={onMarkAction}
            pending={markPending}
          />
        ))}
    </>
  )
}
