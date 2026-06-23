import { useRef, useState } from 'react'
import { format } from 'date-fns'
import { CalendarDays } from 'lucide-react'
import { Calendar } from './calendar'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { cn } from '../lib/utils'

/* The shared single-date field: a trigger styled like an Input that opens the
   Calendar in a Popover. Reused by the calendar event form and retrofitted onto
   the chores due-date field (replacing the stripped-native <input type=date>).

   When rendered inside a modal Drawer, the popover auto-portals into the nearest
   dialog so it stays interactive (a body-portaled popover would fall outside the
   dialog's dismiss scope and swallow clicks). */

export interface DatePickerProps {
  value?: Date
  onChange: (date?: Date) => void
  placeholder?: string
  id?: string
  disabled?: boolean
  /** Dates before this are unselectable — e.g. an end date can't precede start. */
  fromDate?: Date
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  id,
  disabled,
  fromDate,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [container, setContainer] = useState<HTMLElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          ref={triggerRef}
          id={id}
          type="button"
          disabled={disabled}
          // Resolve the portal target on open: the nearest dialog if we're inside
          // a modal Drawer, otherwise body (container stays null).
          onPointerDown={() => {
            const dialog = triggerRef.current?.closest('[role="dialog"]')
            setContainer(dialog instanceof HTMLElement ? dialog : null)
          }}
          className={cn(
            'flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm shadow-sm',
            'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            !value && 'text-muted-foreground'
          )}
        >
          <span>{value ? format(value, 'EEE, MMM d, yyyy') : placeholder}</span>
          <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" container={container}>
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange(date)
            setOpen(false)
          }}
          defaultMonth={value}
          disabled={fromDate ? { before: fromDate } : undefined}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}
