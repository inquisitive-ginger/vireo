import type { Meta, StoryObj } from '@storybook/react'
import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import type { CalendarEvent, CalendarMember } from '../types'
import { UpNextView, type UpNextFraming, type WidgetSize } from './UpNextView'

/* `calendar.up-next` — the shipped widget. Three zones, three ranks (2026-07-11):
   a RAISED hero (the next event, washed in its owner's hue), a RECESSED all-week
   groove for multi-day spans (`--surface-sunken` + `--shadow-inset`, ADR 040), and
   a FLAT day-gutter list of appointments. Multi-day events are stated once in the
   band rather than re-emitted on every day they touch, and the window is one week,
   so the old "+40 more" is gone.

   Two framings (owner avatars for Family, dropped for Mine), three sizes, an
   all-clear empty state, height-aware "+N more" overflow, read-only tap-through.
   Sizes are passed explicitly here; in the shell the view self-sizes via container
   queries. */

const NOW = new Date('2026-07-11T13:20:00') // a Saturday afternoon, mid-event

const MEMBERS = new Map<string, CalendarMember>([
  ['zach', { name: 'Zach' }],
  ['hallie', { name: 'Hallie' }],
  ['zoe', { name: 'Zoe' }],
  ['teddy', { name: 'Teddy' }],
])

function ev(
  p: Pick<CalendarEvent, 'id' | 'title' | 'startsAt' | 'attendeeIds'> & Partial<CalendarEvent>
): CalendarEvent {
  return {
    seriesId: p.id,
    occurrenceDate: null,
    isOccurrence: false,
    description: null,
    ownerId: p.attendeeIds[0] ?? null,
    createdBy: 'seed',
    endsAt: null,
    allDay: false,
    location: null,
    recurrence: null,
    recurrenceUntil: null,
    isActivity: false,
    status: 'confirmed',
    source: 'manual',
    reminderMinutes: null,
    createdAt: '',
    updatedAt: '',
    ...p,
  }
}

/* A typical week: one in-progress event (the hero), two multi-day spans — one of
   them running past the week's edge — and two genuinely empty days. */
const FAMILY_EVENTS: CalendarEvent[] = [
  ev({
    id: 'fest',
    title: 'West Seattle Summer Fest',
    startsAt: '2026-07-11T10:00:00',
    endsAt: '2026-07-11T16:00:00',
    attendeeIds: [],
    location: 'The Junction',
  }),
  ev({
    id: 'date-night',
    title: 'Date night',
    startsAt: '2026-07-11T19:00:00',
    attendeeIds: ['zach', 'hallie'],
  }),
  ev({
    id: 'camp',
    title: 'FISW Camp',
    startsAt: '2026-07-13T00:00:00',
    endsAt: '2026-07-18T00:00:00',
    allDay: true,
    attendeeIds: ['zoe', 'teddy'],
  }),
  ev({
    id: 'grandma',
    title: 'Grandma visiting',
    startsAt: '2026-07-16T00:00:00',
    endsAt: '2026-07-20T00:00:00',
    allDay: true,
    attendeeIds: [],
  }),
  ev({ id: 'tt-sun', title: 'T&T', startsAt: '2026-07-12T11:00:00', attendeeIds: ['zoe'] }),
  ev({
    id: 'shower',
    title: "Daniela's baby shower",
    startsAt: '2026-07-12T14:00:00',
    attendeeIds: ['hallie'],
  }),
  ev({ id: 'tt-tue', title: 'T&T', startsAt: '2026-07-14T17:15:00', attendeeIds: ['teddy'] }),
  ev({
    id: 'gym',
    title: 'Artistic gymnastics',
    startsAt: '2026-07-14T19:00:00',
    attendeeIds: ['zoe'],
  }),
  ev({
    id: 'speech',
    title: 'Speech therapy',
    startsAt: '2026-07-15T17:00:00',
    attendeeIds: ['teddy'],
  }),
  ev({
    id: 'vision',
    title: 'Vision therapy',
    startsAt: '2026-07-17T16:45:00',
    attendeeIds: ['teddy'],
  }),
  // A single-day all-day event — the case the day list had no fixture for, and
  // therefore printed as "12:00 am" until #61.
  ev({
    id: 'closed',
    title: 'School closed',
    startsAt: '2026-07-15T00:00:00',
    allDay: true,
    attendeeIds: [],
  }),
]

// "Mine" = Hallie's own + Family events.
const MINE_EVENTS: CalendarEvent[] = [
  ev({
    id: 'm1',
    title: 'Yoga',
    startsAt: '2026-07-11T17:30:00',
    attendeeIds: ['hallie'],
    location: 'Studio B',
  }),
  ev({
    id: 'm2',
    title: 'Date night',
    startsAt: '2026-07-11T19:00:00',
    attendeeIds: ['zach', 'hallie'],
  }),
  ev({
    id: 'm3',
    title: 'Grandma visiting',
    startsAt: '2026-07-16T00:00:00',
    endsAt: '2026-07-20T00:00:00',
    allDay: true,
    attendeeIds: [],
  }),
  ev({ id: 'm4', title: 'Book club', startsAt: '2026-07-13T19:30:00', attendeeIds: ['hallie'] }),
  ev({ id: 'm5', title: 'Church', startsAt: '2026-07-12T10:00:00', attendeeIds: [] }),
  ev({
    id: 'm6',
    title: 'Dinner with friends',
    startsAt: '2026-07-15T19:00:00',
    attendeeIds: ['hallie'],
    location: 'Bistro',
  }),
]

/* The stress case: a heavy week, where the height clamp actually bites and the
   "+N more" line has to read as an offer rather than a backlog. */
const BUSY_EVENTS: CalendarEvent[] = [
  ...FAMILY_EVENTS,
  ev({ id: 'b1', title: 'Dentist', startsAt: '2026-07-13T08:30:00', attendeeIds: ['zach'] }),
  ev({ id: 'b2', title: 'Piano lesson', startsAt: '2026-07-13T16:00:00', attendeeIds: ['zoe'] }),
  ev({ id: 'b3', title: 'Swim lessons', startsAt: '2026-07-14T08:00:00', attendeeIds: ['teddy'] }),
  ev({ id: 'b4', title: 'Pediatrician', startsAt: '2026-07-15T09:15:00', attendeeIds: ['zoe'] }),
  ev({
    id: 'b5',
    title: 'Haircuts',
    startsAt: '2026-07-16T10:00:00',
    attendeeIds: ['zoe', 'teddy'],
  }),
  ev({ id: 'b6', title: 'Parent-teacher night', startsAt: '2026-07-16T18:00:00', attendeeIds: [] }),
]

const SLOTS: Record<WidgetSize, { w: number; h: number }> = {
  compact: { w: 253, h: 180 },
  standard: { w: 522, h: 180 },
  large: { w: 522, h: 560 },
}

function Slot({ size, h, children }: { size: WidgetSize; h?: number; children: ReactNode }) {
  const slot = SLOTS[size]
  return (
    <div
      style={{ width: slot.w, height: h ?? slot.h }}
      className="overflow-hidden rounded-hero bg-card shadow-[var(--shadow-raised)]"
    >
      {children}
    </div>
  )
}

function Caption({ children }: { children: ReactNode }) {
  return <div className="text-sm-token mb-2 text-muted-foreground">{children}</div>
}

function Showcase() {
  const sizes: WidgetSize[] = ['compact', 'standard', 'large']
  const framings: { key: UpNextFraming; label: string; events: CalendarEvent[] }[] = [
    { key: 'family', label: 'Family framing (shared tablet)', events: FAMILY_EVENTS },
    { key: 'mine', label: 'Mine framing (Hallie)', events: MINE_EVENTS },
  ]
  const captions: Record<WidgetSize, string> = {
    compact: 'compact · 1×1 — spans collapse to one line',
    standard: 'standard · 2×1 — spans as a compressed line',
    large: 'large · 2×2 — the full three-zone hierarchy',
  }
  return (
    <div className="flex flex-col gap-10">
      {framings.map(({ key, label, events }) => (
        <section key={key} className="flex flex-col gap-4">
          <h2 className="text-heading text-foreground">{label}</h2>
          <div className="flex flex-wrap items-start gap-6">
            {sizes.map((size) => (
              <div key={size}>
                <Caption>{captions[size]}</Caption>
                <Slot size={size}>
                  <UpNextView
                    events={events}
                    membersById={MEMBERS}
                    now={NOW}
                    framing={key}
                    size={size}
                  />
                </Slot>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="flex flex-col gap-4">
        <h2 className="text-heading text-foreground">Edge cases</h2>
        <div className="flex flex-wrap items-start gap-6">
          <div>
            <Caption>heavy week — the clamp bites, “+N more” offers the rest</Caption>
            <Slot size="large">
              <UpNextView
                events={BUSY_EVENTS}
                membersById={MEMBERS}
                now={NOW}
                framing="family"
                size="large"
              />
            </Slot>
          </div>
          <div>
            <Caption>no spans — the groove vanishes, leaving no hole</Caption>
            <Slot size="large">
              <UpNextView
                events={FAMILY_EVENTS.filter((e) => !e.allDay)}
                membersById={MEMBERS}
                now={NOW}
                framing="family"
                size="large"
              />
            </Slot>
          </div>
          <div>
            <Caption>short slot (376px) — the 2×2 at its minimum height</Caption>
            <Slot size="large" h={376}>
              <UpNextView
                events={FAMILY_EVENTS}
                membersById={MEMBERS}
                now={NOW}
                framing="family"
                size="large"
              />
            </Slot>
          </div>
          <div>
            <Caption>all-clear (empty)</Caption>
            <Slot size="large" h={376}>
              <UpNextView events={[]} membersById={MEMBERS} now={NOW} framing="mine" size="large" />
            </Slot>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-heading text-foreground">
          Self-sizing (no size prop → container queries)
        </h2>
        <Caption>drag the frame — compact / standard / large reveal by box size</Caption>
        <div
          className="resize overflow-hidden rounded-hero bg-card shadow-[var(--shadow-raised)]"
          style={{ width: 520, height: 420, minWidth: 220, minHeight: 170 }}
        >
          <UpNextView events={FAMILY_EVENTS} membersById={MEMBERS} now={NOW} framing="family" />
        </div>
      </section>
    </div>
  )
}

const meta: Meta<typeof Showcase> = {
  title: 'Calendar/Up Next Widget',
  component: Showcase,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div style={{ background: 'var(--background)', padding: 32, minHeight: '100vh' }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Showcase>

export const Widget: Story = { name: 'Framings × sizes + edge cases + self-sizing' }
