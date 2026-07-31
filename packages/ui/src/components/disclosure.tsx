import { useState, type ReactNode } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '../lib/utils'

export interface DisclosureProps {
  label: string
  /** The TRUE total, not the count of what happens to be loaded — a header that
      states the loaded count re-tells the truncation it exists to admit. */
  count?: number
  /** Secondary lists lead collapsed. Open when the list IS the reason for the
      surface (the tickets tab's used shelf), where a tap before the first action
      is a tax on the common case. */
  defaultOpen?: boolean
  children: ReactNode
  className?: string
}

/* The header a long secondary list hides behind — chevron, label, true count.
   Extracted at the third caller (chores' Done/Coming up, the settings triage
   board's Settled, the rewards tickets tab's Recently used), which is the trigger
   the 2026-07-28 unbounded-lists session named: the bodies bound themselves by
   different mechanisms (client clamp vs. cursor paging) and stay with their
   callers; only the header and its open state are shared. */
export function Disclosure({
  label,
  count,
  defaultOpen = false,
  children,
  className,
}: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-section-label flex w-full items-center gap-1.5 py-2 text-muted-foreground"
        aria-expanded={open}
      >
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        {count === undefined ? label : `${label} · ${count}`}
      </button>
      {open && children}
    </div>
  )
}

export interface RevealMoreProps {
  label: string
  onClick: () => void
  /** Set while a page is in flight; server-paged callers only. */
  busy?: boolean
  /** The chevron marks a trip to the server. A count clamp reveals rows already
      held and takes none, so the two reads differently at a glance. */
  fetches?: boolean
  className?: string
}

export function RevealMore({ label, onClick, busy, fetches, className }: RevealMoreProps) {
  return (
    <button
      type="button"
      disabled={busy}
      onClick={onClick}
      className={cn(
        'text-sm-token self-start py-2 text-muted-foreground underline underline-offset-4 disabled:opacity-50',
        className
      )}
    >
      {busy ? 'Loading…' : fetches ? `${label} ›` : label}
    </button>
  )
}
