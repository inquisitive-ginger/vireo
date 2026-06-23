import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { Calendar } from './calendar'
import { DatePicker } from './date-picker'
import { Label } from './label'

/* The shared date picker — react-day-picker v10 themed to our tokens. Used by
   the calendar event form and retrofitted onto the chores due-date field. */

const meta: Meta = {
  title: 'Primitives/DatePicker',
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj

function FieldDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 5, 23))
  return (
    <div className="flex max-w-[320px] flex-col gap-2">
      <Label htmlFor="demo-date">Due date</Label>
      <DatePicker id="demo-date" value={date} onChange={setDate} />
      <p className="text-sm-token text-muted-foreground">
        Trigger styled like an Input; opens the calendar in a Popover. Empty shows the placeholder.
        Use the theme toggle to check dark mode.
      </p>
    </div>
  )
}

function SingleCalendarDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 5, 23))
  return (
    <div className="w-fit rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
      <Calendar mode="single" selected={date} onSelect={setDate} defaultMonth={date} />
    </div>
  )
}

function RangeCalendarDemo() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(2026, 5, 16),
    to: new Date(2026, 5, 19),
  })
  return (
    <div className="flex flex-col gap-3">
      <div className="w-fit rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
        <Calendar mode="range" selected={range} onSelect={setRange} defaultMonth={range?.from} />
      </div>
      <p className="text-sm-token text-muted-foreground max-w-[320px]">
        Range mode — endpoints fill in --primary, the middle is a light primary wash. Available for
        a future "quick multi-day span" affordance; the event drawer uses two single fields today.
      </p>
    </div>
  )
}

export const Field: Story = {
  name: 'DatePicker field',
  render: () => <FieldDemo />,
}

export const SingleCalendar: Story = {
  name: 'Calendar — single',
  render: () => <SingleCalendarDemo />,
}

export const RangeCalendar: Story = {
  name: 'Calendar — range (multi-day spans)',
  render: () => <RangeCalendarDemo />,
}
