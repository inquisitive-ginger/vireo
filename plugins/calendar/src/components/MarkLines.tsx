import type { DayMark, DayMarkLine } from '@family-os/platform/types'
import { Link } from 'react-router-dom'
import { Button, ListRow, buttonVariants, cn } from '@family-os/ui'
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
      className="mb-3 rounded-panel bg-surface-sunken shadow-[var(--shadow-inset)]"
    >
      {(mark.lines ?? []).map((line) => {
        const owner = membersById.get(line.ownerId)
        return (
          <ListRow
            key={line.id}
            as="li"
            className="last:border-b-0"
            trailing={
              act && (
                <span className="flex items-center gap-1">
                  {!line.cleared && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={pending}
                      aria-label={`Swap: ${line.text}`}
                      onClick={() => act(mark, line, 'swap')}
                    >
                      Swap
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={pending}
                    aria-label={`${line.cleared ? 'Restore' : 'Not needed today'}: ${line.text}`}
                    onClick={() => act(mark, line, line.cleared ? 'restore' : 'clear')}
                  >
                    {line.cleared ? 'Restore' : 'Not needed today'}
                  </Button>
                </span>
              )
            }
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
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
                  line.cleared && 'text-muted-foreground line-through'
                )}
              >
                {line.text}
                {line.cleared && <span className="sr-only"> (not needed)</span>}
              </span>
            </div>
          </ListRow>
        )
      })}
      {act && mark.act?.manage && (
        <li className="px-2 py-1">
          <Link
            to={mark.act.manage.href}
            className={buttonVariants({ variant: 'ghost', size: 'sm' })}
          >
            {mark.act.manage.label}
          </Link>
        </li>
      )}
    </ul>
  )
}
