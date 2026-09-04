import { cn } from '@family-os/ui'

/* The day label that sits above its events — one object at two ranks. The mobile
   agenda states it as a page section heading; the up-next widget states it inline
   in its day list, a rank down so it can't outweigh the hero. Both wear the same
   anatomy (lead · secondary date, today in the primary hue), which is what the
   widget was asked for when its gutter came out (auto-bug #135). */
export function DayHeading({
  lead,
  sub,
  today = false,
  rank = 'section',
  className,
}: {
  lead: string
  /** The secondary date ("Jul 12"), from `relativeDayLabel`'s `sub`. */
  sub?: string
  today?: boolean
  /** `section` — a page heading. `row` — the widget's denser in-list line. */
  rank?: 'section' | 'row'
  className?: string
}) {
  const tone = today ? 'text-primary' : 'text-foreground'
  return (
    <div className={cn('flex items-baseline gap-2', className)}>
      {rank === 'section' ? (
        <h3 className={cn('text-card-title', tone)}>{lead}</h3>
      ) : (
        <span className={cn('text-base-token font-semibold', tone)}>{lead}</span>
      )}
      {sub && <span className="text-sm-token text-muted-foreground">{sub}</span>}
    </div>
  )
}
