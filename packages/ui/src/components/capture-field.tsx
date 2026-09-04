import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Plus } from 'lucide-react'
import { cn } from '../lib/utils'

/** Where the field sits, which is the only thing that sets its height
    (design-system.md §Capture primitives): `inline` inside a widget, `hero` as
    the first thing under a page title, `wall` at across-the-room size. */
export type CaptureFieldSize = 'inline' | 'hero' | 'wall'

export interface CaptureFieldProps {
  /** Called with the trimmed value on Enter. The field has already cleared by
      the time this runs — it is a catch, not a form, so a slow round trip must
      not hold the next word. Surface a failure where the user is waiting. */
  onSubmit: (value: string) => void
  placeholder: string
  /** Accessible name — there is no visible label above a capture line. */
  label: string
  /** The scope control: what you type lands *there*. `ComposeForm` has no
      analogue (a note goes to the family), which is half of why these are two
      primitives (ADR 070). No avatar, no identity hue — ever. */
  trailing?: ReactNode
  /** Every keystroke, so the surface can state the filing before the commit. */
  onValueChange?: (value: string) => void
  size?: CaptureFieldSize
  disabled?: boolean
  className?: string
}

/* `text` scales with the surface, not with the box: what you are typing IS the
   primary content, and on the wall the distance rule wants a key value at
   `heading`, not at the 18px floor (design-system.md §Type scale). Inline and
   hero are both read close up, where `body` is right. */
const SIZE: Record<CaptureFieldSize, { box: string; text: string; icon: number }> = {
  inline: { box: 'h-touch gap-2 pl-3', text: 'text-body', icon: 18 },
  hero: { box: 'h-14 gap-2.5 pl-3.5', text: 'text-body', icon: 22 },
  wall: { box: 'h-19 gap-3 pl-5', text: 'text-heading', icon: 26 },
}

/* The catch half of the capture taxonomy (ADR 070): one line, always open,
   Enter submits, and it CLEARS AND STAYS rather than closing — a family
   unloading four things from a fridge types four times, it does not open the
   field four times. `ComposeForm` is the other half; the rule for choosing is
   in design-system.md §Capture primitives. */
export function CaptureField({
  onSubmit,
  placeholder,
  label,
  trailing,
  onValueChange,
  size = 'inline',
  disabled = false,
  className,
}: CaptureFieldProps) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  /* NOTHING here claims focus, and no prop offers to (ADR 070, amended
     2026-09-04). Both surfaces that used to — the wide `/shopping` layout and
     the Home widget — cost more than they bought: an always-on display claiming
     the keyboard nobody walked up to, and a stacked phone dashboard scrolling
     1272px to a tile the reader never asked for.

     Two facts underneath that are expensive to rediscover, pinned by tests in
     capture-field.test.tsx because the next person to reach for autofocus here
     will hit both: React renders the `autoFocus` prop as the DOM attribute,
     which browsers honour ONLY while parsing the document — inert for anything
     mounted later, which is every federated remote — and focusing a disabled
     input (this field mounts disabled while its first read is in flight) is a
     silent no-op. */

  function change(next: string) {
    setValue(next)
    onValueChange?.(next)
  }

  function submit(e: FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    change('')
    onSubmit(trimmed)
    inputRef.current?.focus()
  }

  return (
    <form
      onSubmit={submit}
      className={cn(
        'flex items-center rounded-panel border border-input bg-card pr-2 shadow-[var(--shadow-raised)]',
        'transition-colors duration-[var(--duration-fast)]',
        'focus-within:border-primary focus-within:ring-1 focus-within:ring-primary',
        SIZE[size].box,
        className
      )}
    >
      <Plus
        size={SIZE[size].icon}
        aria-hidden
        className={cn('shrink-0', value ? 'text-primary' : 'text-muted-foreground')}
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => change(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        disabled={disabled}
        autoComplete="off"
        enterKeyHint="done"
        className={cn(
          SIZE[size].text,
          'min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50'
        )}
      />
      {trailing !== undefined && <div className="flex shrink-0 items-center">{trailing}</div>}
    </form>
  )
}
