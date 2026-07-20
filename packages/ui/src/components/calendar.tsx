import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker, getDefaultClassNames } from 'react-day-picker'
import type { ComponentProps, CSSProperties } from 'react'
import { cn } from '../lib/utils'

/* The shared date-grid picker — react-day-picker v10 themed to our tokens.
   Used inside DatePicker (single) and available in range mode for multi-day
   spans.

   Theming notes (load-bearing):
   - The base react-day-picker stylesheet declares the --rdp-* variables *on
     .rdp-root itself*, so a value set on a parent wrapper is overridden. We
     therefore set the token theme via the `style` prop, which lands inline on
     .rdp-root and wins.
   - Layout classes (caption, nav, weekday grid) come from the base stylesheet;
     we only *extend* `today`/`selected` (via getDefaultClassNames) so we never
     drop rdp's own layout classes — replacing them breaks the header/nav. */

const RDP_THEME = {
  '--rdp-accent-color': 'var(--primary)',
  '--rdp-accent-background-color': 'color-mix(in oklch, var(--primary) 14%, transparent)',
  '--rdp-today-color': 'var(--primary)',
  '--rdp-selected-border': '2px solid transparent',
  '--rdp-range_start-color': 'var(--primary-foreground)',
  '--rdp-range_end-color': 'var(--primary-foreground)',
  '--rdp-range_start-date-background-color': 'var(--primary)',
  '--rdp-range_end-date-background-color': 'var(--primary)',
  fontFamily: 'var(--font-ui)',
} as CSSProperties

export type CalendarProps = ComponentProps<typeof DayPicker>

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const dft = getDefaultClassNames()
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      style={RDP_THEME}
      // today emphasis here; the single-selected fill lives in calendar.css
      // (reliable DOM-targeted rule rather than an arbitrary descendant variant).
      classNames={{
        today: cn(dft.today, 'font-semibold'),
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === 'left' ? (
            <ChevronLeft className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          ),
      }}
      {...props}
    />
  )
}
