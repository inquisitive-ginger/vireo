import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Bell, Trash2, Users } from 'lucide-react'
import {
  Button,
  DatePicker,
  DateRangePicker,
  Drawer,
  Input,
  Label,
  Switch,
  identityColor,
  type DateRange,
} from '@family-os/ui'
import type { Profile } from '@family-os/platform/types'
import type { CalendarEvent } from '../types'
import { addDays, isMultiDay, localDateKey, spanEndDate, startOfDay } from '../lib/grid'

/* The single create / edit surface for calendar events (design §2) — one reused
   right Drawer (chores `CreateTaskDrawer` pattern). Each modifier lives on the
   field it changes: "Multiple days" turns the date field into a range (and drops
   times + repeat); "All day" hides the time inputs; "Repeat weekly" reveals an
   optional "until". Owner is a multi-select of members + a mutually-exclusive
   Family chip, and a pick is REQUIRED (an event always carries identity). Edit
   mode prefills from the event, swaps the header + CTA copy, and adds Remove. */

const REMINDER_PRESETS: { label: string; value: number | null }[] = [
  { label: 'None', value: null },
  { label: '10 min', value: 10 },
  { label: '30 min', value: 30 },
  { label: '1 hr', value: 60 },
]
const DEFAULT_REMINDER = 30

/** The wire body for create/edit — matches `EventInputSchema` in
 *  `@family-os/schemas`; the route resolves ownership + derives `isActivity`. */
export interface CreateEventInput {
  title: string
  attendeeIds: string[]
  startsAt: string
  endsAt: string | null
  allDay: boolean
  location: string | null
  description: string | null
  recurrence: 'weekly' | null
  recurrenceUntil: string | null
  reminderMinutes: number | null
}

export interface CreateEventDrawerProps {
  open: boolean
  onClose: () => void
  members: Profile[]
  /** Prefill the date in create mode (the agenda's per-day "+ Add"). Ignored in
      edit mode; defaults to today when absent. */
  prefillDate?: Date | null
  /** Set → edit mode: fields prefilled, header "Edit event", CTA "Save changes",
      Remove shown. Absent → create mode. */
  editingEvent?: CalendarEvent | null
  onSubmit: (input: CreateEventInput) => Promise<void> | void
  /** Request removal of the event being edited — the parent owns the confirm
      dialog (recurring → "Just this week" vs "All events"). */
  onRemove?: () => void
}

const pad = (n: number) => String(n).padStart(2, '0')
const toHM = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`
const addMinutesHM = (hm: string, mins: number) => {
  const [h, m] = hm.split(':').map(Number)
  const total = (h * 60 + m + mins + 1440) % 1440
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`
}
const combine = (date: Date, hm: string) => {
  const [h, m] = hm.split(':').map(Number)
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m)
}
/** `YYYY-MM-DD` → a local Date (matches how `recurrenceUntil` is serialized). */
const parseDateKey = (key: string) => {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function CreateEventDrawer({
  open,
  onClose,
  members,
  prefillDate,
  editingEvent,
  onSubmit,
  onRemove,
}: CreateEventDrawerProps) {
  const isEdit = Boolean(editingEvent)

  const [title, setTitle] = useState('')
  const [ownerIds, setOwnerIds] = useState<string[]>([])
  const [family, setFamily] = useState(false)
  const [multiDay, setMultiDay] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [range, setRange] = useState<DateRange | undefined>(undefined)
  const [allDay, setAllDay] = useState(false)
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const endTouched = useRef(false)
  const [repeatWeekly, setRepeatWeekly] = useState(false)
  const [until, setUntil] = useState<Date | undefined>(undefined)
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [reminderMinutes, setReminderMinutes] = useState<number | null>(DEFAULT_REMINDER)
  const [submitting, setSubmitting] = useState(false)

  // Reset the form each time the drawer opens — prefill from the event in edit
  // mode, otherwise blank with the prefilled (or today's) date.
  useEffect(() => {
    if (!open) return
    setSubmitting(false)
    endTouched.current = false

    if (editingEvent) {
      const start = new Date(editingEvent.startsAt)
      const attendees = editingEvent.attendeeIds
      setTitle(editingEvent.title)
      setFamily(attendees.length === 0)
      setOwnerIds(attendees.length === 0 ? [] : attendees)
      setAllDay(editingEvent.allDay)
      const span = isMultiDay(editingEvent)
      setMultiDay(span)
      setDate(startOfDay(start))
      setRange(span ? { from: startOfDay(start), to: spanEndDate(editingEvent) } : undefined)
      setStartTime(toHM(start))
      setEndTime(
        editingEvent.endsAt ? toHM(new Date(editingEvent.endsAt)) : addMinutesHM(toHM(start), 60)
      )
      setRepeatWeekly(editingEvent.recurrence === 'weekly')
      setUntil(
        editingEvent.recurrenceUntil ? parseDateKey(editingEvent.recurrenceUntil) : undefined
      )
      setLocation(editingEvent.location ?? '')
      setDescription(editingEvent.description ?? '')
      setReminderMinutes(editingEvent.reminderMinutes ?? null)
    } else {
      const d = prefillDate ? startOfDay(prefillDate) : startOfDay(new Date())
      setTitle('')
      setFamily(false)
      setOwnerIds([])
      setAllDay(false)
      setMultiDay(false)
      setDate(d)
      setRange(undefined)
      setStartTime('09:00')
      setEndTime('10:00')
      setRepeatWeekly(false)
      setUntil(undefined)
      setLocation('')
      setDescription('')
      setReminderMinutes(DEFAULT_REMINDER)
    }
  }, [open, editingEvent, prefillDate])

  function toggleOwner(id: string) {
    setFamily(false)
    setOwnerIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }
  function pickFamily() {
    setFamily(true)
    setOwnerIds([])
  }
  function changeStart(v: string) {
    setStartTime(v)
    if (!endTouched.current) setEndTime(addMinutesHM(v, 60))
  }

  const ownerChosen = family || ownerIds.length > 0
  const timed = !multiDay && !allDay
  const endAfterStart = !timed || !date || combine(date, endTime) > combine(date, startTime)
  const datesValid = multiDay ? Boolean(range?.from && range?.to) : Boolean(date)
  const canSubmit =
    title.trim().length > 0 && ownerChosen && datesValid && endAfterStart && !submitting

  // The weekday label for "(Every Tuesday)" — derived from the start date.
  const weekday = date?.toLocaleDateString(undefined, { weekday: 'long' })

  function buildInput(): CreateEventInput | null {
    if (!canSubmit) return null
    const attendeeIds = family ? [] : ownerIds
    const base = {
      title: title.trim(),
      attendeeIds,
      location: location.trim() || null,
      description: description.trim() || null,
    }
    if (multiDay) {
      if (!range?.from || !range?.to) return null
      return {
        ...base,
        // A span is all-day and carries no times/repeat. The exclusive end bound
        // (start of the day after the last day) is what `lib/grid` reads back as
        // an inclusive last day.
        startsAt: startOfDay(range.from).toISOString(),
        endsAt: startOfDay(addDays(range.to, 1)).toISOString(),
        allDay: true,
        recurrence: null,
        recurrenceUntil: null,
        reminderMinutes: null,
      }
    }
    if (!date) return null
    const recurrence = repeatWeekly ? ('weekly' as const) : null
    const recurrenceUntil = recurrence && until ? localDateKey(until) : null
    if (allDay) {
      return {
        ...base,
        startsAt: startOfDay(date).toISOString(),
        endsAt: null,
        allDay: true,
        recurrence,
        recurrenceUntil,
        reminderMinutes: null,
      }
    }
    return {
      ...base,
      startsAt: combine(date, startTime).toISOString(),
      endsAt: combine(date, endTime).toISOString(),
      allDay: false,
      recurrence,
      recurrenceUntil,
      reminderMinutes,
    }
  }

  async function handleSubmit() {
    const input = buildInput()
    if (!input) return
    setSubmitting(true)
    try {
      await onSubmit(input)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Drawer open={open} onClose={onClose} title={isEdit ? 'Edit event' : 'Add event'}>
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-6">
            {/* Title */}
            <div>
              <FieldLabel htmlFor="event-title">Title</FieldLabel>
              <Input
                id="event-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's happening?"
              />
            </div>

            {/* Owner — multi-select members + mutually-exclusive Family */}
            <div>
              <FieldLabel>For</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {members.map((m) => (
                  <OwnerChip
                    key={m.id}
                    name={m.name}
                    selected={!family && ownerIds.includes(m.id)}
                    onClick={() => toggleOwner(m.id)}
                  />
                ))}
                <FamilyChip selected={family} onClick={pickFamily} />
              </div>
              {!family && ownerIds.length >= 2 && (
                <p className="mt-1.5 text-sm-token text-muted-foreground">
                  Shows as a split color on the calendar.
                </p>
              )}
            </div>

            {/* Date — inline "Multiple days" toggle converts it to a range */}
            <div>
              <FieldHeader
                label="Date"
                toggle={{
                  label: 'Multiple days',
                  checked: multiDay,
                  onChange: (v) => {
                    setMultiDay(v)
                    if (v && date && !range) setRange({ from: date, to: undefined })
                  },
                }}
              />
              {multiDay ? (
                <DateRangePicker value={range} onChange={setRange} />
              ) : (
                <DatePicker value={date} onChange={setDate} />
              )}
            </div>

            {/* Time — single-day only; inline "All day" toggle hides the fields */}
            {!multiDay && (
              <div>
                <FieldHeader
                  label="Time"
                  toggle={{ label: 'All day', checked: allDay, onChange: setAllDay }}
                />
                {!allDay && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      aria-label="Start time"
                      value={startTime}
                      onChange={(e) => changeStart(e.target.value)}
                      className="min-w-0 flex-1 appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                    />
                    <span className="text-sm-token text-muted-foreground">–</span>
                    <Input
                      type="time"
                      aria-label="End time"
                      value={endTime}
                      onChange={(e) => {
                        endTouched.current = true
                        setEndTime(e.target.value)
                      }}
                      className="min-w-0 flex-1 appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                    />
                  </div>
                )}
                {!allDay && !endAfterStart && (
                  <p className="mt-1.5 text-sm-token text-destructive">
                    End time must be after the start.
                  </p>
                )}
              </div>
            )}

            {/* Repeat weekly — single-day only; "(Every Tuesday)" inline + Until */}
            {!multiDay && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <Label className="cursor-default">
                    Repeat weekly
                    {repeatWeekly && weekday && (
                      <span className="font-normal text-muted-foreground"> (Every {weekday})</span>
                    )}
                  </Label>
                  <Switch
                    aria-label="Repeat weekly"
                    checked={repeatWeekly}
                    onCheckedChange={setRepeatWeekly}
                  />
                </div>
                {repeatWeekly && (
                  <div className="rounded-lg bg-secondary/50 p-3">
                    <FieldLabel htmlFor="event-until" optional>
                      Until
                    </FieldLabel>
                    <DatePicker
                      id="event-until"
                      value={until}
                      onChange={setUntil}
                      placeholder="No end date"
                      fromDate={date}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Reminder — timed events only (a span/all-day reminder is future) */}
            {timed && (
              <div>
                <FieldLabel>Reminder</FieldLabel>
                <div className="flex flex-wrap items-center gap-2">
                  {REMINDER_PRESETS.map((p) => (
                    <ReminderChip
                      key={p.label}
                      label={p.label}
                      selected={reminderMinutes === p.value}
                      onClick={() => setReminderMinutes(p.value)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Location + Notes */}
            <div>
              <FieldLabel htmlFor="event-location" optional>
                Location
              </FieldLabel>
              <Input
                id="event-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where?"
              />
            </div>
            <div>
              <FieldLabel htmlFor="event-notes" optional>
                Notes
              </FieldLabel>
              <textarea
                id="event-notes"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Anything else?"
                rows={2}
                className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-2.5 border-t border-border p-6">
          <Button className="w-full" onClick={handleSubmit} disabled={!canSubmit}>
            {isEdit
              ? submitting
                ? 'Saving…'
                : 'Save changes'
              : submitting
                ? 'Adding…'
                : 'Add event'}
          </Button>

          {isEdit && onRemove && (
            <Button
              variant="ghost"
              className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={onRemove}
            >
              <Trash2 className="mr-1.5 h-4 w-4" /> Remove event
            </Button>
          )}
        </div>
      </div>
    </Drawer>
  )
}

/* ── Field bits ──────────────────────────────────────────────────────────── */

/* A field's label row with an optional inline modifier toggle on the right
   (Multiple days / All day) — the shared Switch keeps it on-brand and accessible
   (`aria-label` names the switch for AT + tests). */
function FieldHeader({
  label,
  toggle,
}: {
  label: ReactNode
  toggle?: { label: string; checked: boolean; onChange: (v: boolean) => void }
}) {
  return (
    <div className="mb-[7px] flex items-center justify-between gap-3">
      <Label className="cursor-default">{label}</Label>
      {toggle && (
        <div className="flex items-center gap-2">
          <span className="text-sm-token text-muted-foreground">{toggle.label}</span>
          <Switch
            aria-label={toggle.label}
            checked={toggle.checked}
            onCheckedChange={toggle.onChange}
          />
        </div>
      )}
    </div>
  )
}

function FieldLabel({
  children,
  optional,
  htmlFor,
}: {
  children: string
  optional?: boolean
  htmlFor?: string
}) {
  return (
    <Label htmlFor={htmlFor} className="mb-[7px] block">
      {children}
      {optional && <span className="font-normal opacity-65"> (optional)</span>}
    </Label>
  )
}

/* A compact pill toggle for the inline field modifiers (Multiple days / All day /
   Repeat weekly). `role="switch"` so it's operable + queryable by name. */

function OwnerChip({
  name,
  selected,
  onClick,
}: {
  name: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-sm-token inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5"
      style={{
        border: `2px solid ${selected ? identityColor(name) : 'var(--border)'}`,
        background: selected ? identityColor(name, 'tint') : 'transparent',
        color: selected ? identityColor(name, 'ink') : 'var(--foreground)',
        fontWeight: selected ? 600 : 400,
      }}
    >
      <span className="size-2 shrink-0 rounded-full" style={{ background: identityColor(name) }} />
      {name}
    </button>
  )
}

function FamilyChip({ selected, onClick }: { selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-sm-token inline-flex cursor-pointer items-center gap-1.5 rounded-full border-2 px-3.5 py-1.5 ${
        selected
          ? 'border-foreground bg-secondary font-semibold text-secondary-foreground'
          : 'border-border font-normal text-foreground'
      }`}
    >
      <Users className="h-3.5 w-3.5" /> Family
    </button>
  )
}

function ReminderChip({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-sm-token inline-flex cursor-pointer items-center gap-1 rounded-full border-2 px-3 py-1.5 ${
        selected
          ? 'border-primary bg-primary/10 font-semibold text-primary'
          : 'border-border font-normal text-muted-foreground'
      }`}
    >
      {selected && label !== 'None' && <Bell className="h-3 w-3" />}
      {label}
    </button>
  )
}
