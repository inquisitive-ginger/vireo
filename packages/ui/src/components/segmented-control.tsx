import { useRef } from 'react'
import { cn } from '../lib/utils'

export interface SegmentedControlOption<T extends string> {
  value: T
  label: string
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[]
  /** The selected value. */
  value: T
  onChange: (value: T) => void
  /** Accessible name for the group (e.g. "Calendar view"). */
  'aria-label': string
  className?: string
}

/* A compact single-select view/mode switch: a bordered track of segments where
   the active one fills with `--primary`. A radio group under the hood (roving
   tabindex + arrow-key navigation), so it reads as one control, not N buttons.
   Standardizes the Month/Week/Day switch the calendar hand-rolled and any future
   toggle of the same shape.

   Styled utility-first like the shell (ADR 035) — token classes only. Generic
   over a string-union value so call sites stay type-safe. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  'aria-label': ariaLabel,
  className,
}: SegmentedControlProps<T>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const activeIndex = options.findIndex((o) => o.value === value)

  function move(delta: 1 | -1) {
    const next = (activeIndex + delta + options.length) % options.length
    onChange(options[next].value)
    refs.current[next]?.focus()
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      move(1)
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      move(-1)
    }
  }

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className={cn('flex items-center rounded-md border border-border p-1', className)}
    >
      {options.map((option, i) => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={cn(
              'cursor-pointer rounded px-3 py-1 text-sm-token font-medium transition-colors',
              selected
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
