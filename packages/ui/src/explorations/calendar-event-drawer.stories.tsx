import type { Meta, StoryObj } from '@storybook/react'
import { useEffect, useState, type ReactNode } from 'react'
import { MapPin, Trash2, Users } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { Button } from '../components/button'
import { DatePicker } from '../components/date-picker'
import { DateRangePicker } from '../components/date-range-picker'
import { Drawer } from '../components/drawer'
import { Input } from '../components/input'
import { Label } from '../components/label'
import { Switch } from '../components/switch'
import { Textarea } from '../components/textarea'
import { identityToken, type IdentityHue } from '../lib/identity'
import { cn } from '../lib/utils'

/* ────────────────────────────────────────────────────────────────────────────
   CALENDAR UX EXPLORATION — Event create / edit drawer (story #3)
   ----------------------------------------------------------------------------
   Exploration scaffolding for M3 Design: Calendar. NOT a shippable component —
   the dev session (Event Create / Edit, #3) reads this as the visual reference,
   then deletes it. The real component lives in the calendar plugin and reuses
   the shared primitives (Drawer, DatePicker, DateRangePicker, Switch…).

   Flow (settled 2026-06-22 — modifiers attach to the field they change, so the
   form reads as one connected thing rather than a list of switches):
     · Title
     · For — multi-select members (1 = solo, 2+ = shared split fill) or Family
     · Date — with an inline "Multiple days" toggle that converts the single
       date field into a range picker (start → end in one calendar)
     · Time — with an inline "All day" toggle that hides the time fields; the end
       time auto-follows start by +60 min until the user overrides it
       (single-day only — a span carries no times)
     · Repeat weekly — label gains an inline "(Every Tuesday)" when on; reveals an
       optional Until (single-day only — a span doesn't repeat)
     · Location, Notes (optional)
     · Reminder — sets reminder_minutes only; the firing mechanism is story #6
   Edit mode adds a Remove action in the footer (a month chip has no row to hang
   a trash on, unlike the chores list). */

// ─── Family fixture (matches the month-grid exploration) ─────────────────────

const MEMBERS: { id: string; name: string; hue: IdentityHue }[] = [
  { id: 'zach', name: 'Zach', hue: 'teal' },
  { id: 'hallie', name: 'Hallie', hue: 'plum' },
  { id: 'zoe', name: 'Zoe', hue: 'marigold' },
  { id: 'teddy', name: 'Teddy', hue: 'sky' },
]

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const REMINDERS: { label: string; value: number | null }[] = [
  { label: 'None', value: null },
  { label: 'At start', value: 0 },
  { label: '10m', value: 10 },
  { label: '30m', value: 30 },
  { label: '1h', value: 60 },
  { label: '1d', value: 1440 },
]

type EventDraft = {
  title: string
  // Attendees drive the fill: empty + !isFamily = nothing chosen yet (required, so
  // an event always carries identity); 1 = solo (owner hue); 2+ = shared (split
  // fill); isFamily = whole-house (neutral pill). Family is mutually exclusive with
  // members.
  attendees: string[] // member ids
  isFamily: boolean
  allDay: boolean
  multiDay: boolean
  startDate?: Date
  startTime: string
  endDate?: Date
  endTime: string
  repeatWeekly: boolean
  repeatUntil?: Date
  location: string
  notes: string
  reminder: number | null
}

const d = (s: string) => new Date(`${s}T00:00:00`)

const BLANK: EventDraft = {
  title: '',
  attendees: [],
  isFamily: false,
  allDay: false,
  multiDay: false,
  startDate: d('2026-06-23'),
  startTime: '17:15',
  endDate: d('2026-06-23'),
  endTime: '18:15',
  repeatWeekly: false,
  repeatUntil: undefined,
  location: '',
  notes: '',
  // Default to a reminder so capture-once-and-get-reminded is the default path
  // (the notification value is the reason to retire Google), not an opt-in.
  reminder: 30,
}

// A populated recurring activity, for edit mode.
const EDIT_FIXTURE: EventDraft = {
  title: 'T&T',
  attendees: ['teddy'],
  isFamily: false,
  allDay: false,
  multiDay: false,
  startDate: d('2026-06-23'),
  startTime: '17:15',
  endDate: d('2026-06-23'),
  endTime: '18:15',
  repeatWeekly: true,
  repeatUntil: d('2026-08-25'),
  location: 'Flips Gym',
  notes: '',
  reminder: 30,
}

function weekdayName(date?: Date): string {
  if (!date) return '—'
  return WEEKDAYS[date.getDay()]
}

const dayKey = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime()

const addDay = (x: Date) => {
  const n = new Date(x)
  n.setDate(n.getDate() + 1)
  return n
}

// "HH:MM" + minutes → "HH:MM" (24h, wraps at midnight)
function addMinutesToTime(time: string, mins: number): string {
  const [h, m] = time.split(':').map(Number)
  if (Number.isNaN(h) || Number.isNaN(m)) return time
  const total = (((h * 60 + m + mins) % 1440) + 1440) % 1440
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

// ─── Field building blocks ────────────────────────────────────────────────────

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

// A field label with an optional small toggle on the right — the modifier lives
// with the field it reshapes (Date → Multiple days, Time → All day).
function FieldHeader({
  label,
  htmlFor,
  toggle,
}: {
  label: ReactNode
  htmlFor?: string
  toggle?: { label: string; checked: boolean; onCheckedChange: (v: boolean) => void }
}) {
  return (
    <div className="mb-[7px] flex items-center justify-between gap-3">
      <Label htmlFor={htmlFor} className="cursor-default">
        {label}
      </Label>
      {toggle && (
        <div className="flex items-center gap-2">
          <span className="text-sm-token text-muted-foreground">{toggle.label}</span>
          <Switch checked={toggle.checked} onCheckedChange={toggle.onCheckedChange} />
        </div>
      )}
    </div>
  )
}

function TimeField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <Input
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="min-w-0 flex-1 appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
    />
  )
}

// Owner chip — member (identity hue) or Family (neutral + Users glyph).
function OwnerChip({
  label,
  hue,
  family,
  selected,
  onClick,
}: {
  label: string
  hue?: IdentityHue
  family?: boolean
  selected: boolean
  onClick: () => void
}) {
  const accent = hue ? identityToken(hue) : 'var(--muted-foreground)'
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-sm-token inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5"
      style={{
        border: `2px solid ${selected ? accent : 'var(--border)'}`,
        background: selected
          ? hue
            ? identityToken(hue, 'tint')
            : 'var(--secondary)'
          : 'transparent',
        color: selected
          ? hue
            ? identityToken(hue, 'ink')
            : 'var(--secondary-foreground)'
          : 'var(--foreground)',
        fontWeight: selected ? 600 : 400,
      }}
    >
      {family ? (
        <Users className="size-3 shrink-0" />
      ) : (
        <span className="size-2 shrink-0 rounded-full" style={{ background: accent }} />
      )}
      {label}
    </button>
  )
}

// Reminder preset — sits at the same sm size as the owner chips.
function SelectChip({
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
      className={cn(
        'text-sm-token inline-flex cursor-pointer items-center rounded-full border-2 px-3 py-1.5',
        selected
          ? 'border-primary bg-primary/10 font-semibold text-foreground'
          : 'border-border text-muted-foreground'
      )}
    >
      {label}
    </button>
  )
}

// ─── The drawer ───────────────────────────────────────────────────────────────

function EventDrawer({ mode }: { mode: 'create' | 'edit' }) {
  const isEdit = mode === 'edit'
  const [open, setOpen] = useState(true)
  const [draft, setDraft] = useState<EventDraft>(isEdit ? EDIT_FIXTURE : BLANK)
  // Once the user picks an end time, stop auto-following the start time.
  const [endTimeEdited, setEndTimeEdited] = useState(isEdit)

  // Re-seed when the story's mode arg flips.
  useEffect(() => {
    setDraft(isEdit ? EDIT_FIXTURE : BLANK)
    setEndTimeEdited(isEdit)
    setOpen(true)
  }, [isEdit])

  const set = <K extends keyof EventDraft>(key: K, value: EventDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }))

  // Members multi-select; picking any member clears Family. Family clears members.
  const toggleMember = (id: string) =>
    setDraft((dr) => ({
      ...dr,
      isFamily: false,
      attendees: dr.attendees.includes(id)
        ? dr.attendees.filter((x) => x !== id)
        : [...dr.attendees, id],
    }))
  const chooseFamily = () => setDraft((dr) => ({ ...dr, isFamily: true, attendees: [] }))

  // End time defaults to start + 60 min until the user overrides it.
  const onStartTime = (v: string) =>
    setDraft((dr) => ({
      ...dr,
      startTime: v,
      endTime: endTimeEdited ? dr.endTime : addMinutesToTime(v, 60),
    }))
  const onEndTime = (v: string) => {
    setEndTimeEdited(true)
    set('endTime', v)
  }

  // Turning on "Multiple days" seeds a sensible end date (the day after start)
  // and clears recurrence — a span and a weekly repeat are mutually exclusive.
  const setMultiDay = (v: boolean) =>
    setDraft((dr) => {
      if (!v) return { ...dr, multiDay: false }
      const endDate =
        dr.startDate && (!dr.endDate || dayKey(dr.endDate) <= dayKey(dr.startDate))
          ? addDay(dr.startDate)
          : dr.endDate
      return { ...dr, multiDay: true, repeatWeekly: false, endDate }
    })

  const onRange = (r?: DateRange) =>
    setDraft((dr) => ({ ...dr, startDate: r?.from, endDate: r?.to }))

  // A deliberate "For" pick is required (≥1 member, or Family) — never defaulted —
  // so an event always carries its color-by-person identity.
  const canSubmit = draft.title.trim().length > 0 && (draft.attendees.length > 0 || draft.isFamily)

  return (
    <>
      {/* faux page behind, so the drawer reads in context */}
      <div className="h-full w-full p-8">
        <p className="text-muted-foreground text-sm-token">
          {open ? 'Drawer open →' : 'Drawer closed.'}{' '}
          {!open && (
            <button className="underline" onClick={() => setOpen(true)}>
              Reopen
            </button>
          )}
        </p>
      </div>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title={isEdit ? 'Edit event' : 'Add event'}
      >
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex flex-col gap-6">
              {/* Title */}
              <div>
                <FieldLabel htmlFor="evt-title">Title</FieldLabel>
                <Input
                  id="evt-title"
                  value={draft.title}
                  onChange={(e) => set('title', e.target.value)}
                  placeholder="What's happening?"
                />
              </div>

              {/* For — multi-select members (1 = solo, 2+ = shared split fill) or Family */}
              <div>
                <FieldLabel>For</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {MEMBERS.map((m) => (
                    <OwnerChip
                      key={m.id}
                      label={m.name}
                      hue={m.hue}
                      selected={draft.attendees.includes(m.id)}
                      onClick={() => toggleMember(m.id)}
                    />
                  ))}
                  <OwnerChip
                    label="Family"
                    family
                    selected={draft.isFamily}
                    onClick={chooseFamily}
                  />
                </div>
                {draft.attendees.length >= 2 && (
                  <p className="text-sm-token text-muted-foreground mt-1.5">
                    Shared event — shows as a split color on the calendar.
                  </p>
                )}
              </div>

              {/* Date — inline "Multiple days" toggle converts it to a range */}
              <div>
                <FieldHeader
                  label="Date"
                  htmlFor="evt-date"
                  toggle={{
                    label: 'Multiple days',
                    checked: draft.multiDay,
                    onCheckedChange: setMultiDay,
                  }}
                />
                {draft.multiDay ? (
                  <DateRangePicker
                    id="evt-date"
                    value={{ from: draft.startDate, to: draft.endDate }}
                    onChange={onRange}
                  />
                ) : (
                  <DatePicker
                    id="evt-date"
                    value={draft.startDate}
                    onChange={(v) => set('startDate', v)}
                  />
                )}
              </div>

              {/* Time — inline "All day" toggle hides the fields (single-day only) */}
              {!draft.multiDay && (
                <div>
                  <FieldHeader
                    label="Time"
                    toggle={{
                      label: 'All day',
                      checked: draft.allDay,
                      onCheckedChange: (v) => set('allDay', v),
                    }}
                  />
                  {!draft.allDay && (
                    <div className="flex items-center gap-2">
                      <TimeField value={draft.startTime} onChange={onStartTime} />
                      <span className="text-muted-foreground">–</span>
                      <TimeField value={draft.endTime} onChange={onEndTime} />
                    </div>
                  )}
                </div>
              )}

              {/* Repeat weekly — "(Every Tuesday)" inline; reveals optional Until */}
              {!draft.multiDay && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <Label className="cursor-default">
                      Repeat weekly
                      {draft.repeatWeekly && (
                        <span className="font-normal text-muted-foreground">
                          {' '}
                          (Every {weekdayName(draft.startDate)})
                        </span>
                      )}
                    </Label>
                    <Switch
                      checked={draft.repeatWeekly}
                      onCheckedChange={(v) => set('repeatWeekly', v)}
                    />
                  </div>
                  {draft.repeatWeekly && (
                    <div className="rounded-lg bg-secondary/50 p-3">
                      <FieldLabel htmlFor="evt-until" optional>
                        Until
                      </FieldLabel>
                      <DatePicker
                        id="evt-until"
                        value={draft.repeatUntil}
                        onChange={(v) => set('repeatUntil', v)}
                        fromDate={draft.startDate}
                        placeholder="No end date"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Location */}
              <div>
                <FieldLabel htmlFor="evt-loc" optional>
                  Location
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="evt-loc"
                    value={draft.location}
                    onChange={(e) => set('location', e.target.value)}
                    placeholder="Where?"
                    className="pl-9"
                  />
                  <MapPin
                    size={16}
                    aria-hidden
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <FieldLabel htmlFor="evt-notes" optional>
                  Notes
                </FieldLabel>
                <Textarea
                  id="evt-notes"
                  value={draft.notes}
                  onChange={(e) => set('notes', e.target.value)}
                  placeholder="Anything else…"
                  rows={2}
                />
              </div>

              {/* Reminder */}
              <div>
                <FieldLabel>Reminder</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {REMINDERS.map((r) => (
                    <SelectChip
                      key={r.label}
                      label={r.label}
                      selected={draft.reminder === r.value}
                      onClick={() => set('reminder', r.value)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-2.5 border-t border-border p-6">
            <Button className="w-full" disabled={!canSubmit}>
              {isEdit ? 'Save changes' : 'Add event'}
            </Button>
            {isEdit && (
              <Button variant="ghost-destructive" className="w-full">
                <Trash2 className="mr-1.5 size-4" /> Remove event
              </Button>
            )}
          </div>
        </div>
      </Drawer>
    </>
  )
}

// ─── Story wiring ─────────────────────────────────────────────────────────────

const meta: Meta<typeof EventDrawer> = {
  title: 'Calendar Exploration/Event Drawer',
  component: EventDrawer,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    mode: {
      control: 'inline-radio',
      options: ['create', 'edit'],
      description: 'Create (blank) vs edit (prefilled, with Remove)',
    },
  },
}

export default meta
type Story = StoryObj<typeof EventDrawer>

export const Create: Story = {
  name: 'Create — blank',
  args: { mode: 'create' },
}

export const Edit: Story = {
  name: 'Edit — recurring activity (with Remove)',
  args: { mode: 'edit' },
}
