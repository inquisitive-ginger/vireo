import { X } from 'lucide-react'
import { cn } from '@family-os/ui'
import type { CaptureReport } from '../types'

export interface ReportLineProps {
  /** The stack, already ranked by the container: one error line, then one notice
      per collision. Empty and the slot draws `idle`, or nothing. */
  reports: CaptureReport[]
  /** What the slot says with no report to make — `Enter to add` while composing,
      or the revoked-add line. The wall has neither: its hint lives in the field. */
  idle?: string
  /** `body` on the wall, `sm` everywhere read close up. */
  size?: 'sm' | 'body'
  className?: string
}

/* The one report slot every capture surface owns (D4, ADR 070). Its height is
   reserved whether or not it has anything to say: mounted on the first keystroke
   it shoves the whole page down and Enter shoves it back, which is the defect the
   reserve exists for.

   It never steals focus and never blocks — the field behind it stays cleared and
   ready. A success does NOT clear a standing error: "milk" failing and then
   "eggs" landing must not erase the record that milk was lost.

   It grows DOWNWARD, and only in answer to an Enter. Typing never moves it, which
   is the property that matters: the thing under the field must be still while
   someone is looking at the field. */
export function ReportLine({ reports, idle, size = 'sm', className }: ReportLineProps) {
  const text = size === 'body' ? 'text-body' : 'text-sm-token'

  return (
    <div className={cn('flex min-h-10 flex-col justify-center gap-0.5 px-1', className)}>
      {reports.length > 0
        ? reports.map((report, index) => (
            <div
              // Index is the identity here on purpose: a notice IS its position
              // in the last submission, and the stack is replaced wholesale each
              // Enter rather than reconciled.
              key={`${report.tone}-${index}`}
              className="flex items-center gap-2"
            >
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
              {/* Every control here clears --spacing-touch and none of them grows
                  the line: the target is 48px and a negative margin gives back
                  what it would otherwise add, the way `CompletionToggle` does it. */}
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
              {/* Straight after the verb, at every width — the line is one
                  object: notice, action, dismiss. Pushed to the far margin it sat
                  840px from the words it dismissed on the wall. */}
              <button
                type="button"
                onClick={report.onDismiss}
                aria-label="Dismiss"
                className="group -m-2 flex size-12 shrink-0 cursor-pointer items-center justify-center"
              >
                <span className="flex size-8 items-center justify-center rounded-full text-muted-foreground group-hover:bg-secondary group-hover:text-foreground">
                  <X size={16} aria-hidden />
                </span>
              </button>
            </div>
          ))
        : idle && <p className={cn(text, 'min-w-0 truncate text-muted-foreground')}>{idle}</p>}
    </div>
  )
}
