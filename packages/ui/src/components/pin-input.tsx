import { useRef, useState } from 'react'
import { cn } from '../lib/utils'

export type PinInputSize = 'sm' | 'md'

export interface PinInputProps {
  value: string
  onChange: (value: string) => void
  error?: boolean
  autoFocus?: boolean
  size?: PinInputSize
  className?: string
}

const SIZE = {
  sm: { box: 'w-9 h-9', gap: 'gap-2', dot: 'w-2 h-2' },
  md: { box: 'w-12 h-12', gap: 'gap-3', dot: 'w-2.5 h-2.5' },
} as const

export function PinInput({
  value,
  onChange,
  error = false,
  autoFocus = false,
  size = 'md',
  className,
}: PinInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [focused, setFocused] = useState(false)
  const s = SIZE[size]
  const activeIndex = Math.min(value.length, 3)

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <input
        ref={inputRef}
        type="tel"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 4))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="sr-only"
        aria-label="PIN entry"
        autoFocus={autoFocus}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.focus()}
        className={cn('flex focus:outline-none', s.gap)}
        aria-label="PIN digit boxes — click to focus"
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              s.box,
              'rounded-panel border-2 flex items-center justify-center',
              'transition-all duration-[var(--duration-normal)]',
              error
                ? 'border-destructive'
                : i < value.length
                  ? 'border-primary bg-primary/8'
                  : 'border-border bg-background',
              focused && i === activeIndex && 'ring-2 ring-ring'
            )}
          >
            {i < value.length && (
              <div className={cn(s.dot, 'rounded-full', error ? 'bg-destructive' : 'bg-primary')} />
            )}
          </div>
        ))}
      </button>
    </div>
  )
}
