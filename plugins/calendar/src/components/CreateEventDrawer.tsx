import { useEffect, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Bell, Trash2, Users } from 'lucide-react'
import {
  Button,
  Chip,
  DatePicker,
  DateRangePicker,
  Drawer,
  FieldLabel,
  Input,
  Label,
  MemberChip,
  Switch,
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
   mode prefills from the event, swaps the header + CTA copy, and adds Remove.

   Form state is React Hook Form + a zodResolver (the shell's form standard —
   Onboarding/Settings) over the UI-shaped `EventFormSchema`; on submit the valid
   values are transformed to the wire body (which the API re-validates against the
   shared `EventInputSchema`). */

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

// The UI-shaped form (Date objects + the modifier toggles), distinct from the
// wire body. Cross-field rules live in the refinement so the resolver gates the
// submit + drives the disabled state.
const EventFormSchema = z
  .object({
    title: z.string().trim().min(1),
    ownerIds: z.array(z.string()),
    family: z.boolean(),
    multiDay: z.boolean(),
    date: z.date().optional(),
    range: z.object({ from: z.date().optional(), to: z.date().optional() }).optional(),
    allDay: z.boolean(),
    startTime: z.string(),
    endTime: z.string(),
    repeatWeekly: z.boolean(),
    until: z.date().optional(),
    location: z.string(),
    description: z.string(),
    reminderMinutes: z.number().nullable(),
  })
  .superRefine((v, ctx) => {
    if (!v.family && v.ownerIds.length === 0) {
      ctx.addIssue({ code: 'custom', path: ['ownerIds'], message: 'Pick at least one owner' })
    }
    if (v.multiDay) {
      if (!v.range?.from || !v.range?.to) {
        ctx.addIssue({ code: 'custom', path: ['range'], message: 'Pick a start and end date' })
      }
    } else {
      if (!v.date) {
        ctx.addIssue({ code: 'custom', path: ['date'], message: 'Pick a date' })
      } else if (!v.allDay && combine(v.date, v.endTime) <= combine(v.date, v.startTime)) {
        ctx.addIssue({ code: 'custom', path: ['endTime'], message: 'End must be after the start' })
      }
    }
  })

type EventForm = z.input<typeof EventFormSchema>

function blankDefaults(opts?: {
  prefillDate?: Date | null
  ownerId?: string | null
  asActivity?: boolean
}): EventForm {
  return {
    title: '',
    // Activities are single-owner by definition; the per-person "+ Add" seeds it.
    ownerIds: opts?.ownerId ? [opts.ownerId] : [],
    family: false,
    multiDay: false,
    date: opts?.prefillDate ? startOfDay(opts.prefillDate) : startOfDay(new Date()),
    range: undefined,
    allDay: false,
    startTime: '09:00',
    endTime: '10:00',
    // An activity is a weekly commitment — repeat-weekly is implied (design.md §4).
    repeatWeekly: Boolean(opts?.asActivity),
    until: undefined,
    location: '',
    description: '',
    reminderMinutes: DEFAULT_REMINDER,
  }
}

function editDefaults(event: CalendarEvent): EventForm {
  const start = new Date(event.startsAt)
  const span = isMultiDay(event)
  return {
    title: event.title,
    ownerIds: event.attendeeIds.length === 0 ? [] : event.attendeeIds,
    family: event.attendeeIds.length === 0,
    multiDay: span,
    date: startOfDay(start),
    range: span ? { from: startOfDay(start), to: spanEndDate(event) } : undefined,
    allDay: event.allDay,
    startTime: toHM(start),
    endTime: event.endsAt ? toHM(new Date(event.endsAt)) : addMinutesHM(toHM(start), 60),
    repeatWeekly: event.recurrence === 'weekly',
    until: event.recurrenceUntil ? parseDateKey(event.recurrenceUntil) : undefined,
    location: event.location ?? '',
    description: event.description ?? '',
    reminderMinutes: event.reminderMinutes ?? null,
  }
}

/** Transform validated form values into the wire body. */
function toInput(v: EventForm): CreateEventInput {
  const attendeeIds = v.family ? [] : v.ownerIds
  const base = {
    title: v.title.trim(),
    attendeeIds,
    location: v.location.trim() || null,
    description: v.description.trim() || null,
  }
  if (v.multiDay) {
    // A span is all-day and carries no times/repeat. The exclusive end bound
    // (start of the day after the last day) is what `lib/grid` reads back as an
    // inclusive last day.
    return {
      ...base,
      startsAt: startOfDay(v.range!.from!).toISOString(),
      endsAt: startOfDay(addDays(v.range!.to!, 1)).toISOString(),
      allDay: true,
      recurrence: null,
      recurrenceUntil: null,
      reminderMinutes: null,
    }
  }
  const recurrence = v.repeatWeekly ? ('weekly' as const) : null
  const recurrenceUntil = recurrence && v.until ? localDateKey(v.until) : null
  if (v.allDay) {
    return {
      ...base,
      startsAt: startOfDay(v.date!).toISOString(),
      endsAt: null,
      allDay: true,
      recurrence,
      recurrenceUntil,
      reminderMinutes: null,
    }
  }
  return {
    ...base,
    startsAt: combine(v.date!, v.startTime).toISOString(),
    endsAt: combine(v.date!, v.endTime).toISOString(),
    allDay: false,
    recurrence,
    recurrenceUntil,
    reminderMinutes: v.reminderMinutes,
  }
}

export interface CreateEventDrawerProps {
  open: boolean
  onClose: () => void
  members: Profile[]
  /** Prefill the date in create mode (the agenda's per-day "+ Add"). Ignored in
      edit mode; defaults to today when absent. */
  prefillDate?: Date | null
  /** Preselect a single owner in create mode (the roster's per-person "+ Add").
      Ignored in edit mode. */
  prefillOwnerId?: string | null
  /** Activity framing (story #5): create seeds repeat-weekly on; the header, CTA,
      and Remove copy swap "event" → "activity". */
  activityContext?: boolean
  /** Set → edit mode: fields prefilled, header "Edit event", CTA "Save changes",
      Remove shown. Absent → create mode. */
  editingEvent?: CalendarEvent | null
  onSubmit: (input: CreateEventInput) => Promise<void> | void
  /** Request removal of the event being edited — the parent owns the confirm
      dialog (recurring → "Just this week" vs "All events"). */
  onRemove?: () => void
}

export function CreateEventDrawer({
  open,
  onClose,
  members,
  prefillDate,
  prefillOwnerId,
  activityContext = false,
  editingEvent,
  onSubmit,
  onRemove,
}: CreateEventDrawerProps) {
  const isEdit = Boolean(editingEvent)
  // Copy noun — an activity is still an event under the hood, just framed as a
  // standing commitment on this surface.
  const noun = activityContext ? 'activity' : 'event'
  // Tracks whether the user has overridden the end time — until then it follows
  // the start by +60m.
  const endTouched = useRef(false)

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<EventForm>({
    resolver: zodResolver(EventFormSchema),
    mode: 'onChange',
    defaultValues: blankDefaults({
      prefillDate,
      ownerId: prefillOwnerId,
      asActivity: activityContext,
    }),
  })

  // Reset each time the drawer opens — prefill from the event in edit mode,
  // otherwise blank with the prefilled date / owner / activity framing.
  useEffect(() => {
    if (!open) return
    endTouched.current = false
    reset(
      editingEvent
        ? editDefaults(editingEvent)
        : blankDefaults({ prefillDate, ownerId: prefillOwnerId, asActivity: activityContext })
    )
  }, [open, editingEvent, prefillDate, prefillOwnerId, activityContext, reset])

  const title = watch('title')
  const family = watch('family')
  const ownerIds = watch('ownerIds')
  const multiDay = watch('multiDay')
  const allDay = watch('allDay')
  const repeatWeekly = watch('repeatWeekly')
  const date = watch('date')
  const range = watch('range')
  const startTime = watch('startTime')
  const endTime = watch('endTime')
  const timed = !multiDay && !allDay

  // The submit gate mirrors the schema's cross-field rules, derived synchronously
  // from the current values so the button toggles immediately (zodResolver is the
  // async re-check at submit time, but `isValid` lands a tick late for a click).
  const ownerChosen = family || ownerIds.length > 0
  const datesValid = multiDay ? Boolean(range?.from && range?.to) : Boolean(date)
  const endBeforeStart = Boolean(
    timed && date && combine(date, endTime) <= combine(date, startTime)
  )
  const canSubmit = title.trim().length > 0 && ownerChosen && datesValid && !endBeforeStart

  function toggleOwner(id: string) {
    setValue('family', false, { shouldValidate: true })
    const next = ownerIds.includes(id) ? ownerIds.filter((x) => x !== id) : [...ownerIds, id]
    setValue('ownerIds', next, { shouldValidate: true })
  }
  function pickFamily() {
    setValue('ownerIds', [], { shouldValidate: true })
    setValue('family', true, { shouldValidate: true })
  }

  // The weekday label for "(Every Tuesday)" — derived from the start date.
  const weekday = date?.toLocaleDateString(undefined, { weekday: 'long' })

  const submit = handleSubmit(async (values) => {
    await onSubmit(toInput(values))
  })

  return (
    <Drawer open={open} onClose={onClose} title={`${isEdit ? 'Edit' : 'Add'} ${noun}`}>
      <form onSubmit={submit} className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-6">
            <div>
              <FieldLabel htmlFor="event-title">Title</FieldLabel>
              <Input id="event-title" placeholder="What's happening?" {...register('title')} />
            </div>

            {/* Owner — multi-select members + mutually-exclusive Family */}
            <div>
              <FieldLabel>For</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {members.map((m) => (
                  <MemberChip
                    key={m.id}
                    name={m.name}
                    hue={m.identityHue}
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
                    setValue('multiDay', v, { shouldValidate: true })
                    if (v && date) setValue('range', { from: date, to: undefined })
                  },
                }}
              />
              {multiDay ? (
                <Controller
                  control={control}
                  name="range"
                  render={({ field }) => (
                    <DateRangePicker
                      value={field.value as DateRange | undefined}
                      onChange={field.onChange}
                    />
                  )}
                />
              ) : (
                <Controller
                  control={control}
                  name="date"
                  render={({ field }) => (
                    <DatePicker value={field.value} onChange={field.onChange} />
                  )}
                />
              )}
            </div>

            {/* Time — single-day only; inline "All day" toggle hides the fields */}
            {!multiDay && (
              <div>
                <FieldHeader
                  label="Time"
                  toggle={{
                    label: 'All day',
                    checked: allDay,
                    onChange: (v) => setValue('allDay', v, { shouldValidate: true }),
                  }}
                />
                {!allDay && (
                  <div className="flex items-center gap-2">
                    <Controller
                      control={control}
                      name="startTime"
                      render={({ field }) => (
                        <Input
                          type="time"
                          aria-label="Start time"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value)
                            if (!endTouched.current) {
                              setValue('endTime', addMinutesHM(e.target.value, 60), {
                                shouldValidate: true,
                              })
                            }
                          }}
                          className="min-w-0 flex-1 appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                        />
                      )}
                    />
                    <span className="text-sm-token text-muted-foreground">–</span>
                    <Controller
                      control={control}
                      name="endTime"
                      render={({ field }) => (
                        <Input
                          type="time"
                          aria-label="End time"
                          value={field.value}
                          onChange={(e) => {
                            endTouched.current = true
                            field.onChange(e.target.value)
                          }}
                          className="min-w-0 flex-1 appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                        />
                      )}
                    />
                  </div>
                )}
                {endBeforeStart && (
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
                    onCheckedChange={(v) => setValue('repeatWeekly', v, { shouldValidate: true })}
                  />
                </div>
                {repeatWeekly && (
                  <div className="rounded-lg bg-secondary/50 p-3">
                    <FieldLabel htmlFor="event-until" optional>
                      Until
                    </FieldLabel>
                    <Controller
                      control={control}
                      name="until"
                      render={({ field }) => (
                        <DatePicker
                          id="event-until"
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="No end date"
                          fromDate={date}
                        />
                      )}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Reminder — timed events only (a span/all-day reminder is future) */}
            {timed && (
              <div>
                <FieldLabel>Reminder</FieldLabel>
                <Controller
                  control={control}
                  name="reminderMinutes"
                  render={({ field }) => (
                    <div className="flex flex-wrap items-center gap-2">
                      {REMINDER_PRESETS.map((p) => (
                        <ReminderChip
                          key={p.label}
                          label={p.label}
                          selected={field.value === p.value}
                          onClick={() => field.onChange(p.value)}
                        />
                      ))}
                    </div>
                  )}
                />
              </div>
            )}

            <div>
              <FieldLabel htmlFor="event-location" optional>
                Location
              </FieldLabel>
              <Input id="event-location" placeholder="Where?" {...register('location')} />
            </div>
            <div>
              <FieldLabel htmlFor="event-notes" optional>
                Notes
              </FieldLabel>
              <textarea
                id="event-notes"
                placeholder="Anything else?"
                rows={2}
                className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...register('description')}
              />
            </div>
          </div>
        </div>

        {/* Footer — safe-area bottom clears the home indicator on a full-screen
            mobile sheet. */}
        <div className="flex flex-col gap-2.5 border-t border-border p-6 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
          <Button type="submit" className="w-full" disabled={!canSubmit || isSubmitting}>
            {isEdit
              ? isSubmitting
                ? 'Saving…'
                : 'Save changes'
              : isSubmitting
                ? 'Adding…'
                : `Add ${noun}`}
          </Button>

          {isEdit && onRemove && (
            <Button
              type="button"
              variant="ghost"
              className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={onRemove}
            >
              <Trash2 className="mr-1.5 h-4 w-4" /> Remove {noun}
            </Button>
          )}
        </div>
      </form>
    </Drawer>
  )
}

/* A field's label row with an optional inline modifier toggle on the right
   (Multiple days / All day) — the shared Switch keeps it on-brand and accessible
   (`aria-label` names the switch for AT + tests). */
function FieldHeader({
  label,
  toggle,
}: {
  label: string
  toggle?: { label: string; checked: boolean; onChange: (v: boolean) => void }
}) {
  return (
    <div className="mb-2 flex items-center justify-between gap-3">
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

// The owner picker's Family option — neutral chip (Users glyph) composed on the
// shared Chip; mutually exclusive with the member chips.
function FamilyChip({ selected, onClick }: { selected: boolean; onClick: () => void }) {
  return (
    <Chip
      selected={selected}
      onClick={onClick}
      leading={<Users className="h-3.5 w-3.5" />}
      selectedClassName="border-foreground bg-secondary text-secondary-foreground"
      idleClassName="text-foreground"
    >
      Family
    </Chip>
  )
}

// A reminder-offset preset chip — primary-toned, on the shared Chip.
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
    <Chip
      selected={selected}
      onClick={onClick}
      leading={selected && label !== 'None' ? <Bell className="h-3 w-3" /> : undefined}
      selectedClassName="border-primary bg-primary/10 text-primary"
      idleClassName="text-muted-foreground"
    >
      {label}
    </Chip>
  )
}
