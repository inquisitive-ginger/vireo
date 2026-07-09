import { useRef, type ComponentType, type KeyboardEvent } from 'react'
import { cn } from '../lib/utils'

export interface TabBarOption<T extends string> {
  value: T
  label: string
  /** Optional leading icon (e.g. a Lucide icon component). */
  icon?: ComponentType<{ className?: string }>
}

export interface TabBarProps<T extends string> {
  options: TabBarOption<T>[]
  /** The selected value. */
  value: T
  onChange: (value: T) => void
  /** Accessible name for the tablist (e.g. "Calendar surface"). */
  'aria-label': string
  className?: string
  /** Base id → each tab gets `${idBase}-tab-${value}`, so a consumer can point its
   *  matching `role="tabpanel"` at the active tab via `aria-labelledby`. */
  idBase?: string
}

/* A primary "tab bar" — underlined tabs on a hairline rule, for switching between
   peer surfaces (e.g. the calendar's Calendar ⇄ Activities tier). A proper ARIA
   tablist: roving tabindex + arrow-key navigation with automatic activation, so it
   reads as one control rather than N buttons.

   Distinct from `SegmentedControl` (a filled-pill radiogroup) on purpose — use a
   TabBar for the top-level split between surfaces, the SegmentedControl for a
   zoom/mode switch within a surface. Styled utility-first with tokens (ADR 035);
   the active tab is `--primary`. Generic over a string-union value so call sites
   stay type-safe. */
export function TabBar<T extends string>({
  options,
  value,
  onChange,
  'aria-label': ariaLabel,
  className,
  idBase,
}: TabBarProps<T>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const activeIndex = options.findIndex((o) => o.value === value)

  function move(delta: 1 | -1) {
    const next = (activeIndex + delta + options.length) % options.length
    onChange(options[next].value)
    refs.current[next]?.focus()
  }

  function handleKeyDown(event: KeyboardEvent) {
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
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className={cn('flex items-center gap-1 border-b border-border', className)}
    >
      {options.map((option, i) => {
        const selected = option.value === value
        const Icon = option.icon
        return (
          <button
            key={option.value}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            role="tab"
            id={idBase ? `${idBase}-tab-${option.value}` : undefined}
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={cn(
              '-mb-px flex cursor-pointer items-center gap-1.5 border-b-2 px-3 py-2 text-sm-token font-medium transition-colors',
              selected
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {Icon && <Icon className="size-4" />}
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
