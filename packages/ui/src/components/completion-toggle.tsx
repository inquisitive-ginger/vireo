import { Check } from 'lucide-react'

export interface CompletionToggleProps {
  /** Completed → filled-success circle with a check; otherwise an empty ring. */
  checked: boolean
  /** Diameter in px (taskee card = 40, admin row = 28). */
  size?: number
  /** When set, the control is an interactive button (hover ring); otherwise a
      static indicator. Fires on tap — the parent owns the state change. */
  onToggle?: () => void
  /** Accessible label for the interactive button (required when `onToggle` is set). */
  label?: string
  /** Native title tooltip (e.g. "Mark not done"). */
  title?: string
  /** Dim a non-interactive ring (e.g. a task mid-flight). */
  muted?: boolean
}

/* The shared chores completion control. Lives in `packages/ui` (which Tailwind
   scans) so it can use real utility classes + a `hover:` ring instead of the
   per-plugin inline-style convention — and so the taskee card and the admin row
   share one implementation. Checked = filled success + check; unchecked = ring.
   The parent drives `checked` (the taskee flow flips it only after the XP flight
   lands), so this stays a controlled, presentational control. */
export function CompletionToggle({
  checked,
  size = 40,
  onToggle,
  label,
  title,
  muted,
}: CompletionToggleProps) {
  const dimension = { width: size, height: size }
  const check = <Check size={Math.round(size * 0.5)} strokeWidth={3} />

  // Interactive: a transparent button with a generous (negative-margin) hit area
  // around the visible circle, which reacts on hover via `group-hover`.
  if (onToggle) {
    return (
      <button
        type="button"
        onClick={onToggle}
        aria-label={label}
        title={title}
        className="group -m-2 flex shrink-0 cursor-pointer items-center justify-center border-none bg-transparent p-2"
      >
        {checked ? (
          <span
            className="flex items-center justify-center rounded-full bg-success text-white"
            style={dimension}
          >
            {check}
          </span>
        ) : (
          <span
            className="flex items-center justify-center rounded-full border-[2.5px] border-input transition-colors group-hover:border-success group-hover:bg-success/10"
            style={dimension}
          />
        )}
      </button>
    )
  }

  // Static indicator.
  return checked ? (
    <span
      aria-hidden
      className="flex shrink-0 items-center justify-center rounded-full bg-success text-white"
      style={dimension}
    >
      {check}
    </span>
  ) : (
    <span
      aria-hidden
      className="flex shrink-0 items-center justify-center rounded-full border-[2.5px] border-input"
      style={{ ...dimension, opacity: muted ? 0.5 : 1 }}
    />
  )
}
