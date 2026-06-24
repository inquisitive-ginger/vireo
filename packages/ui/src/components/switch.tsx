import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cn } from '../lib/utils'

export interface SwitchProps {
  id?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
  /** Accessible name when there's no associated `<label htmlFor>` — e.g. the
      switch sits beside a plain text label (the calendar drawer's field toggles). */
  'aria-label'?: string
}

export function Switch({
  id,
  checked,
  onCheckedChange,
  disabled,
  className,
  'aria-label': ariaLabel,
}: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        'relative inline-flex h-[22px] w-10 shrink-0 cursor-pointer items-center rounded-full border-0',
        'bg-muted transition-colors duration-200',
        'data-[state=checked]:bg-primary',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:cursor-not-allowed disabled:opacity-45',
        className
      )}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm',
          'translate-x-[3px] transition-transform duration-180',
          'data-[state=checked]:translate-x-[21px]'
        )}
      />
    </SwitchPrimitive.Root>
  )
}
