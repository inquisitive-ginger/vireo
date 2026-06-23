import { Users } from 'lucide-react'
import { cn } from '@family-os/ui'
import type { PlacedSpan } from '../lib/grid'
import { fillForHues, huesForEvent } from '../lib/hues'

/* A continuous multi-day bar. Flush edges with a ←/→ cap where the span crosses a
   week boundary; carries the same solo/Family/shared fill as a chip. */
export function SpanBar({
  span,
  membersById,
}: {
  span: PlacedSpan
  membersById: Map<string, string>
}) {
  const hues = huesForEvent(span.event.attendeeIds, membersById)
  const { background, color } = fillForHues(hues)
  return (
    <div
      className={cn(
        'flex h-full items-center px-1.5 text-xs-token font-semibold',
        span.openStart ? 'rounded-l-none' : 'rounded-l-md',
        span.openEnd ? 'rounded-r-none' : 'rounded-r-md'
      )}
      style={{ background, color }}
      title={span.event.title}
    >
      {hues.length === 0 && !span.openStart && (
        <Users className="mr-1 h-2.5 w-2.5 shrink-0 opacity-70" />
      )}
      <span className="truncate">
        {span.openStart ? '← ' : ''}
        {span.event.title}
        {span.openEnd ? ' →' : ''}
      </span>
    </div>
  )
}
