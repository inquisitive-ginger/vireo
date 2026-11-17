import type { DayMark, DayMarkLine } from '@family-os/platform/types'
import { Button, cn } from '@family-os/ui'
import type { CalendarMember } from '../types'
import { formatMinutes, type MarkLineAction } from '../lib/mark-lines'
import { DayMarkOwnerDot } from './DayMarkOwnerDot'

/* A mark's lines, unfolded under the day heading (D-091): a recess, not a card,
   so it reads as part of the day it opened from (ADR 040). */
export function MarkLines({
  mark,
  membersById,
  onAction,
  pending,
}: {
  mark: DayMark
  membersById: Map<string, CalendarMember>
  onAction?: (mark: DayMark, line: DayMarkLine, action: MarkLineAction) => void
  pending?: boolean
}) {
  const act = mark.act && onAction ? onAction : undefined
  return (
    <ul
      id={`mark-lines-${mark.date}-${mark.glyph}`}
      className="mb-3 rounded-panel bg-surface-sunken px-3 shadow-[var(--shadow-inset)]"
    >
      {(mark.lines ?? []).map((line) => {
        const owner = line.ownerId ? membersById.get(line.ownerId) : undefined
        const open = !line.cleared && line.ownerId === null
        return (
          <li
            key={line.id}
            className="flex min-h-12 items-center gap-3 border-t border-border py-1.5 first:border-t-0"
          >
            <span className="w-16 shrink-0 text-sm-token tabular-nums text-muted-foreground">
              {formatMinutes(line.minutes)}
            </span>
            {owner ? (
              <DayMarkOwnerDot member={owner} />
            ) : (
              <span
                aria-hidden
                className="h-4 w-4 shrink-0 rounded-full border border-dashed border-input"
              />
            )}
            <span
              className={cn(
                'min-w-0 flex-1 text-base-token',
                open && 'text-error',
                line.cleared && 'text-muted-foreground line-through'
              )}
            >
              {line.text}
              {line.cleared && <span className="sr-only"> (cleared for today)</span>}
            </span>
            {act && (
              <span className="flex shrink-0 items-center gap-1">
                {!line.cleared && (
                  <Button
                    size="sm"
                    variant={open ? 'default' : 'outline'}
                    disabled={pending}
                    aria-label={`${open ? 'Claim' : 'Swap'}: ${line.text}`}
                    onClick={() => act(mark, line, open ? 'claim' : 'swap')}
                  >
                    {open ? 'Claim' : 'Swap'}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={pending}
                  aria-label={`${line.cleared ? 'Restore' : 'Clear'}: ${line.text}`}
                  onClick={() => act(mark, line, line.cleared ? 'restore' : 'clear')}
                >
                  {line.cleared ? 'Restore' : 'Clear'}
                </Button>
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
