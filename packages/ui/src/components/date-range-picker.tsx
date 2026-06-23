import { useRef, useState } from 'react'
import { format } from 'date-fns'
import { CalendarDays } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { Calendar } from './calendar'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { cn } from '../lib/utils'

/* Range variant of DatePicker — one trigger that opens a range Calendar, for a
   multi-day span (start → end) picked in a single calendar. Same dialog-aware
   portal behavior as DatePicker so it stays interactive inside a modal Drawer. */

export interface DateRangePickerProps {
  value?: DateRange
  onChange: (range?: DateRange) => void
  placeholder?: string
  id?: string
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = 'Pick dates',
  id,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false)
  const [container, setContainer] = useState<HTMLElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const label = value?.from
    ? value.to
      ? `${format(value.from, 'MMM d')} – ${format(value.to, 'MMM d, yyyy')}`
      : format(value.from, 'MMM d, yyyy')
    : placeholder

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          ref={triggerRef}
          id={id}
          type="button"
          onPointerDown={() => {
            const dialog = triggerRef.current?.closest('[role="dialog"]')
            setContainer(dialog instanceof HTMLElement ? dialog : null)
          }}
          className={cn(
            'flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm shadow-sm',
            'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            !value?.from && 'text-muted-foreground'
          )}
        >
          <span>{label}</span>
          <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" container={container}>
        <Calendar
          mode="range"
          selected={value}
          onSelect={onChange}
          defaultMonth={value?.from}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}
