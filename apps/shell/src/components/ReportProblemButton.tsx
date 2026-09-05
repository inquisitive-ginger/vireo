import { useState } from 'react'
import { Bug } from 'lucide-react'
import { cn, Button } from '@family-os/ui'
import { ReportProblemDrawer } from './ReportProblemDrawer'

/* The entry to the report drawer, in the three chrome shapes the shell uses (mirrors
   `BellBadge`'s variants deliberately — this control sits in the bell's slots).

   `tray` is the decided primary entry (ADR 046): the notification tray's footer, since
   the tray is already the "needs attention" surface and is reachable from every screen.
   The other two exist because the tray itself is tier-2+ chrome, and tier 1 can report:
   in a tier-1 profile this control TAKES the bell's slot rather than adding a new one,
   so the household still has one report affordance, in one place, per profile. */
export function ReportProblemButton({
  variant = 'tray',
  className,
}: {
  variant?: 'tray' | 'compact' | 'fold'
  className?: string
}) {
  const [open, setOpen] = useState(false)

  const trigger =
    variant === 'compact' ? (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label="Report a problem"
        className={cn('text-muted-foreground hover:bg-primary/10', className)}
      >
        <Bug size={18} aria-hidden />
      </Button>
    ) : variant === 'fold' ? (
      <Button
        variant="ghost"
        onClick={() => setOpen(true)}
        aria-label="Report a problem"
        className={cn(
          'flex flex-col xl:flex-row items-center justify-center xl:justify-start',
          'gap-1 xl:gap-3 w-full py-2 xl:py-2.5 xl:px-3 min-h-touch h-auto rounded-panel',
          'text-muted-foreground hover:bg-secondary/70 hover:text-foreground',
          className
        )}
      >
        <Bug size={18} aria-hidden />
        <span className="text-xs-body xl:text-sm-token leading-tight xl:flex-1 xl:text-left font-normal">
          <span className="xl:hidden">Report</span>
          <span className="hidden xl:inline">Report a problem</span>
        </span>
      </Button>
    ) : (
      <Button
        variant="ghost"
        onClick={() => setOpen(true)}
        className={cn(
          'w-full justify-start gap-3 px-3 min-h-touch h-auto',
          'text-muted-foreground hover:bg-secondary hover:text-foreground',
          className
        )}
      >
        <Bug size={18} aria-hidden />
        <span className="text-sm-token flex-1 text-left font-normal">Report a problem</span>
      </Button>
    )

  return (
    <>
      {trigger}
      <ReportProblemDrawer open={open} onClose={() => setOpen(false)} />
    </>
  )
}
