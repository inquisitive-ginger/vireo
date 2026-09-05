import { X } from 'lucide-react'
import { cn } from '@family-os/ui'
import type { CaptureReport } from '../types'

export interface ReportLineProps {
  /** The error or the duplicate notice, already ranked by the container. */
  report: CaptureReport | null
  /** What the slot says with no report to make — `Enter to add` while composing,
      the revoked-add line, or nothing. */
  idle?: string
  /** `body` on the wall, `sm` everywhere read close up. */
  size?: 'sm' | 'body'
  className?: string
}

/* The one report slot every capture surface owns (D4, ADR 070). One line, its
   height reserved whether or not it has something to say: mounted on the first
   keystroke it shoves the whole page down and Enter shoves it back, which is the
   defect the reserve exists for and the reason it survives SH-13.

   It never steals focus and never blocks — the field behind it stays cleared and
   ready. A success does NOT clear a standing error: "milk" failing and then
   "eggs" landing must not erase the record that milk was lost. Only the `✕`
   does. */
export function ReportLine({ report, idle, size = 'sm', className }: ReportLineProps) {
  const text = size === 'body' ? 'text-body' : 'text-sm-token'

  return (
    <div className={cn('flex min-h-10 items-center gap-2 px-1', className)}>
      {report ? (
        <>
          <p
            role={report.tone === 'error' ? 'alert' : undefined}
            className={cn(
              text,
              'min-w-0 truncate',
              report.tone === 'error' ? 'text-error' : 'text-muted-foreground'
            )}
          >
            {report.message}
          </p>
          {/* Every control here clears --spacing-touch and none of them grows the
              line: the target is 48px and a negative margin gives back what it
              would otherwise add, the way `CompletionToggle` does it. */}
          {report.actions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={action.onSelect}
              className={cn(
                text,
                'min-h-touch -my-2 flex shrink-0 cursor-pointer items-center font-medium text-primary underline'
              )}
            >
              {action.label}
            </button>
          ))}
          <button
            type="button"
            onClick={report.onDismiss}
            aria-label="Dismiss"
            className="group -m-2 ml-auto flex size-12 shrink-0 cursor-pointer items-center justify-center"
          >
            <span className="flex size-8 items-center justify-center rounded-full text-muted-foreground group-hover:bg-secondary group-hover:text-foreground">
              <X size={16} aria-hidden />
            </span>
          </button>
        </>
      ) : idle ? (
        <p className={cn(text, 'min-w-0 truncate text-muted-foreground')}>{idle}</p>
      ) : null}
    </div>
  )
}
