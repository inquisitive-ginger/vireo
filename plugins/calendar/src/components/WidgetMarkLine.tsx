import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import type { DayMark } from '@family-os/platform/types'
import { Button } from '@family-os/ui'
import type { CalendarMember } from '../types'
import { DAY_MARK_GLYPHS } from '../lib/day-mark-glyphs'
import { formatMinutes, headlineLine } from '../lib/mark-lines'
import type { MarkActionProps } from './DayHeader'
import { MarkLines } from './MarkLines'

const LINE =
  'pointer-events-auto relative z-10 -mx-1.5 flex min-h-9 w-full min-w-0 cursor-pointer items-center gap-1.5 rounded-card px-1.5 text-left text-sm-token text-muted-foreground hover:bg-secondary/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'

/* Today's lines mark in the calendar widget (D-095): one line naming the next
   one, which unfolds them over the tile so a swap needs no trip to the
   calendar. The tile itself stays a link to the calendar underneath. */
export function WidgetMarkLine({
  mark,
  membersById,
  now,
  onMarkAction,
  markPending,
  markFailed,
}: {
  mark: DayMark
  membersById: Map<string, CalendarMember>
  now: Date
} & MarkActionProps) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const Glyph = DAY_MARK_GLYPHS[mark.glyph]
  const glyph = Glyph && <Glyph aria-hidden className="h-4 w-4 shrink-0" />

  if (!mark.lines?.length) {
    return mark.act?.manage ? (
      <Link to={mark.act.manage.href} className={LINE}>
        {glyph}
        <span className="truncate">{mark.act.manage.label}</span>
      </Link>
    ) : null
  }

  const line = headlineLine(mark, now)
  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-label={`${line ? `Next: ${formatMinutes(line.minutes)}, ${line.text}` : mark.label}. Show the day's list.`}
        onClick={() => setOpen(!open)}
        className={LINE}
      >
        {glyph}
        <span className="truncate">
          {line ? `${formatMinutes(line.minutes)} · ${line.text}` : mark.label}
        </span>
      </button>
      {open && (
        <div
          id={id}
          className="pointer-events-auto absolute inset-3 z-20 flex flex-col overflow-auto rounded-panel bg-card p-2 shadow-[var(--shadow-raised)]"
        >
          <MarkLines
            mark={mark}
            membersById={membersById}
            onAction={onMarkAction}
            pending={markPending}
          />
          {markFailed && (
            <p role="alert" className="px-2 text-xs-token text-error">
              That change didn't save. Try again.
            </p>
          )}
          <Button variant="ghost" size="sm" className="self-end" onClick={() => setOpen(false)}>
            Done
          </Button>
        </div>
      )}
    </>
  )
}
