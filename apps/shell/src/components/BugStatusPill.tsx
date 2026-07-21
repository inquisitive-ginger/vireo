import { Badge } from '@family-os/ui'
import type { BugReportStatus } from '@family-os/schemas'

/* The reporter's-eye view of the lifecycle. The stored values are engineering words
   (`new`, `deployed`); these are the words a household uses. A nine-year-old reads
   "Live", not "deployed" — and the pill is the ONLY place a tier-1 reporter learns
   what happened to their report, since notify() cannot reach them (ADR 046). */
const STATUS_LABELS: Record<BugReportStatus, string> = {
  new: 'Reported',
  triaged: 'Logged',
  fixing: 'Being fixed',
  deployed: 'Fixed — live',
  wont_fix: 'Not a bug',
}

/* Status takes the field, never the spine (ADR 043) — on the triage board the spine is
   already carrying the reporter's identity hue, so this is the only status channel. */
const STATUS_CLASSES: Record<BugReportStatus, string> = {
  new: 'border-border text-muted-foreground',
  triaged: 'border-transparent bg-warning text-warning-foreground',
  fixing: 'border-transparent bg-primary text-primary-foreground',
  deployed: 'border-transparent bg-success text-success-foreground',
  wont_fix: 'border-border text-muted-foreground',
}

export function BugStatusPill({ status }: { status: BugReportStatus }) {
  return (
    <Badge variant="outline" className={STATUS_CLASSES[status]}>
      {STATUS_LABELS[status]}
    </Badge>
  )
}

export { STATUS_LABELS }
