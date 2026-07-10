import type { Meta, StoryObj } from '@storybook/react'
import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import type { CalendarEvent } from '../types'
import { UpNextView, type UpNextFraming, type WidgetSize } from './UpNextView'

/* `calendar.up-next` — the shipped widget (Frame C, "Next Hero"): a washed,
   dominant `NextEventHero` over a quiet agenda of what's after it. Two framings
   (owner names shown for Family, dropped for Mine), three sizes, an all-clear
   empty state, height-aware "+N more" overflow, read-only tap-through. Sizes are
   passed explicitly here; in the shell the view self-sizes via container queries. */

const NOW = new Date('2026-07-09T16:00:00')

const MEMBERS = new Map<string, string>([
  ['zach', 'Zach'],
  ['hallie', 'Hallie'],
  ['zoe', 'Zoe'],
  ['teddy', 'Teddy'],
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

const FAMILY_EVENTS: CalendarEvent[] = [
  ev({
    id: 'e1',
    title: 'Karate',
    startsAt: '2026-07-09T16:30:00',
    attendeeIds: ['zoe'],
    location: 'Dojo',
  }),
  ev({
    id: 'e2',
    title: 'Tumbling & trampoline',
    startsAt: '2026-07-09T17:15:00',
    attendeeIds: ['teddy'],
  }),
  ev({
    id: 'e3',
    title: 'Date night',
    startsAt: '2026-07-09T19:00:00',
    attendeeIds: ['zach', 'hallie'],
  }),
  ev({
    id: 'e4',
    title: 'Pediatrician',
    startsAt: '2026-07-10T11:00:00',
    attendeeIds: ['zoe'],
    location: 'Northside',
  }),
  ev({ id: 'e5', title: 'Family BBQ', startsAt: '2026-07-10T13:00:00', attendeeIds: [] }),
  ev({
    id: 'e6',
    title: 'Soccer practice',
    startsAt: '2026-07-10T16:00:00',
    attendeeIds: ['teddy'],
    location: 'Park',
  }),
  ev({ id: 'e7', title: 'Swim meet', startsAt: '2026-07-11T09:00:00', attendeeIds: ['teddy'] }),
  ev({
    id: 'e8',
    title: 'Art class',
    startsAt: '2026-07-11T15:00:00',
    attendeeIds: ['zoe'],
    location: 'Studio',
  }),
  ev({ id: 'e9', title: 'Church', startsAt: '2026-07-12T10:00:00', attendeeIds: [] }),
  ev({
    id: 'e10',
    title: 'Piano recital',
    startsAt: '2026-07-12T14:00:00',
    attendeeIds: ['teddy'],
    location: 'Hall',
  }),
  ev({ id: 'e11', title: 'Dentist', startsAt: '2026-07-13T08:30:00', attendeeIds: ['zach'] }),
  ev({
    id: 'e12',
    title: 'Karate',
    startsAt: '2026-07-13T16:30:00',
    attendeeIds: ['zoe'],
    location: 'Dojo',
  }),
  ev({ id: 'e13', title: 'Swim lessons', startsAt: '2026-07-14T17:00:00', attendeeIds: ['teddy'] }),
]

// "Mine" = Hallie's own + Family events.
const MINE_EVENTS: CalendarEvent[] = [
  ev({
    id: 'm1',
    title: 'Yoga',
    startsAt: '2026-07-09T17:30:00',
    attendeeIds: ['hallie'],
    location: 'Studio B',
  }),
  ev({
    id: 'm2',
    title: 'Date night',
    startsAt: '2026-07-09T19:00:00',
    attendeeIds: ['zach', 'hallie'],
  }),
  ev({ id: 'm3', title: 'Family BBQ', startsAt: '2026-07-10T13:00:00', attendeeIds: [] }),
  ev({ id: 'm4', title: 'Book club', startsAt: '2026-07-11T19:30:00', attendeeIds: ['hallie'] }),
  ev({ id: 'm5', title: 'Church', startsAt: '2026-07-12T10:00:00', attendeeIds: [] }),
  ev({
    id: 'm6',
    title: 'Gym',
    startsAt: '2026-07-13T07:00:00',
    attendeeIds: ['hallie'],
    location: 'Rec Center',
  }),
  ev({
    id: 'm7',
    title: 'Dinner with friends',
    startsAt: '2026-07-14T19:00:00',
    attendeeIds: ['hallie'],
    location: 'Bistro',
  }),
]

const SLOTS: Record<WidgetSize, { w: number; h: number }> = {
  compact: { w: 253, h: 180 },
  standard: { w: 522, h: 180 },
  large: { w: 522, h: 376 },
}

function Slot({ size, children }: { size: WidgetSize; children: ReactNode }) {
  const { w, h } = SLOTS[size]
  return (
    <div
      style={{ width: w, height: h }}
      className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]"
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
    compact: 'compact · 1×1',
    standard: 'standard · 2×1',
    large: 'large · 2×2',
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
        <h2 className="text-heading text-foreground">All-clear (empty)</h2>
        <div className="flex flex-wrap items-start gap-6">
          <div>
            <Caption>compact</Caption>
            <Slot size="compact">
              <UpNextView
                events={[]}
                membersById={MEMBERS}
                now={NOW}
                framing="mine"
                size="compact"
              />
            </Slot>
          </div>
          <div>
            <Caption>large</Caption>
            <Slot size="large">
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
          className="resize overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]"
          style={{ width: 420, height: 300, minWidth: 220, minHeight: 170 }}
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

export const Widget: Story = { name: 'Framings × sizes + empty + self-sizing' }
