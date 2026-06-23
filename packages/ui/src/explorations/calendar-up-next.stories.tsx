import type { Meta, StoryObj } from '@storybook/react'
import type { ReactNode } from 'react'
import { CalendarDays } from 'lucide-react'
import { EmptyState } from '../components/empty-state'
import { Spine } from '../components/spine'
import { identityToken, type IdentityHue } from '../lib/identity'

/* ────────────────────────────────────────────────────────────────────────────
   CALENDAR UX EXPLORATION — calendar.up-next widget (story #7)
   ----------------------------------------------------------------------------
   Exploration scaffolding for M3 Design: Calendar. NOT a shippable component —
   the dev session (Up Next Widget, #7) reads this as the visual reference, then
   deletes it. Follows the chores.today-summary precedent: two framings, three
   sizes, container-query self-sizing (here shown at fixed slot sizes), read-only
   tap-through to /calendar, an all-clear empty state.

   Framings (same widget id, derived from the active profile):
     · FAMILY (shared tablet / family pseudo-profile) — the family's next events
       across all members, color-by-owner (owner name shown).
     · MINE (a member's own profile / mobile) — the active member's own + Family
       events; Family events tagged, owner names dropped (they're all "mine").
   An event's spine carries the owner hue (split for a shared 2+ event; neutral
   for a Family event) — the widget-slot identity rule.
   ──────────────────────────────────────────────────────────────────────────── */

const MEMBERS: Record<string, IdentityHue> = {
  Zach: 'teal',
  Hallie: 'plum',
  Zoe: 'marigold',
  Teddy: 'sky',
}

type Evt = { time: string; title: string; owners: string[] } // owners [] = Family
type Day = { label: string; events: Evt[] }

const FAMILY_AGENDA: Day[] = [
  {
    label: 'Today',
    events: [
      { time: '4:30 PM', title: 'Karate', owners: ['Zoe'] },
      { time: '5:15 PM', title: 'T&T', owners: ['Teddy'] },
      { time: '7:00 PM', title: 'Date night', owners: ['Zach', 'Hallie'] },
    ],
  },
  {
    label: 'Tomorrow',
    events: [
      { time: '11:00 AM', title: 'Doctor', owners: ['Zoe'] },
      { time: '1:00 PM', title: 'Family BBQ', owners: [] },
    ],
  },
  {
    label: 'Thursday',
    events: [
      { time: '6:00 PM', title: 'Swim', owners: ['Teddy'] },
      { time: '7:30 PM', title: 'Book club', owners: ['Hallie'] },
    ],
  },
]

// "Mine" = Hallie's own + Family events.
const MINE_AGENDA: Day[] = [
  {
    label: 'Today',
    events: [
      { time: '6:00 PM', title: 'Yoga', owners: ['Hallie'] },
      { time: '7:00 PM', title: 'Date night', owners: ['Zach', 'Hallie'] },
    ],
  },
  {
    label: 'Tomorrow',
    events: [{ time: '1:00 PM', title: 'Family BBQ', owners: [] }],
  },
  {
    label: 'Thursday',
    events: [{ time: '7:30 PM', title: 'Book club', owners: ['Hallie'] }],
  },
]

type Framing = 'family' | 'mine'
type Size = 'compact' | 'standard' | 'large'

// ─── helpers ───────────────────────────────────────────────────────────────────

function spineBackground(owners: string[]): string {
  if (owners.length === 0) return 'var(--muted-foreground)' // Family — neutral
  const hues = owners.map((n) => identityToken(MEMBERS[n]))
  if (hues.length === 1) return hues[0]
  // shared → split spine (vertical hard-stop segments)
  const stops = hues
    .map(
      (h, i) =>
        `${h} ${Math.round((i / hues.length) * 100)}% ${Math.round(((i + 1) / hues.length) * 100)}%`
    )
    .join(', ')
  return `linear-gradient(180deg, ${stops})`
}

function ownerLabel(owners: string[], framing: Framing): string | undefined {
  if (owners.length === 0) return 'Family'
  if (framing === 'mine') return undefined // they're all mine
  return owners.join(' & ')
}

const flat = (days: Day[]) => days.flatMap((d) => d.events)

// ─── pieces ──────────────────────────────────────────────────────────────────

function WidgetHeader({ trailing }: { trailing?: ReactNode }) {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <CalendarDays size={13} className="text-muted-foreground" aria-hidden />
      <span className="text-section-label flex-1">Calendar</span>
      {trailing}
    </div>
  )
}

function EventRow({ ev, framing }: { ev: Evt; framing: Framing }) {
  const label = ownerLabel(ev.owners, framing)
  return (
    <div
      className="flex items-center gap-2.5 rounded-[11px] bg-muted px-3"
      style={{ minHeight: 40 }}
    >
      <Spine color={spineBackground(ev.owners)} inset />
      <span className="text-sm-token w-[68px] shrink-0 font-semibold text-foreground">
        {ev.time}
      </span>
      <span className="text-sm-token min-w-0 flex-1 truncate text-foreground">{ev.title}</span>
      {label && (
        <span className="text-xs-token shrink-0 truncate text-muted-foreground">{label}</span>
      )}
    </div>
  )
}

function HeroCount({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-metric text-foreground">{value}</span>
      <span className="text-sm-token text-muted-foreground">{label}</span>
    </div>
  )
}

function DayGroup({ day, framing }: { day: Day; framing: Framing }) {
  if (day.events.length === 0) return null
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-section-label text-muted-foreground">{day.label}</span>
      {day.events.map((ev, i) => (
        <EventRow key={i} ev={ev} framing={framing} />
      ))}
    </div>
  )
}

/* All-clear empty — aligns to the design-system pattern: heading the primary
   signal ("Nothing scheduled"), body only at the larger size (compact drops it,
   per the widget empty-state precedent). */
function AllClear({ withBody = false }: { withBody?: boolean }) {
  return (
    <div className="flex size-full flex-col p-4" style={{ containerType: 'size' }}>
      <WidgetHeader />
      <div className="flex flex-1 items-center justify-center">
        <EmptyState
          heading="Nothing scheduled"
          body={withBody ? 'Your calendar is clear.' : undefined}
          compact
        />
      </div>
    </div>
  )
}

// ─── sizes ──────────────────────────────────────────────────────────────────

function Compact({ days, framing }: { days: Day[]; framing: Framing }) {
  const today = days[0]?.events ?? []
  if (flat(days).length === 0) return <AllClear />
  const [next, ...rest] = today
  return (
    <div className="flex size-full flex-col p-4">
      <WidgetHeader />
      <div className="mt-2 flex flex-1 flex-col justify-between gap-2">
        <div className="flex flex-col gap-1.5">
          <span className="text-section-label text-muted-foreground">Next up</span>
          {next ? <EventRow ev={next} framing={framing} /> : null}
        </div>
        {rest.length > 0 && (
          <span className="text-sm-token text-muted-foreground">+{rest.length} more today</span>
        )}
      </div>
    </div>
  )
}

function Standard({ days, framing }: { days: Day[]; framing: Framing }) {
  const today = days[0]?.events ?? []
  if (flat(days).length === 0) return <AllClear />
  return (
    <div className="flex size-full flex-col p-4">
      <WidgetHeader />
      <div className="mt-3 flex min-h-0 flex-1 gap-4">
        <div className="flex w-[120px] shrink-0 flex-col">
          <HeroCount
            value={today.length}
            label={today.length === 1 ? 'event today' : 'events today'}
          />
        </div>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-1.5 overflow-hidden">
          {today.map((ev, i) => (
            <EventRow key={i} ev={ev} framing={framing} />
          ))}
        </div>
      </div>
    </div>
  )
}

function Large({ days, framing }: { days: Day[]; framing: Framing }) {
  if (flat(days).length === 0) return <AllClear withBody />
  return (
    <div className="flex size-full flex-col p-4">
      <WidgetHeader />
      <div className="mt-3 flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
        {days.map((day) => (
          <DayGroup key={day.label} day={day} framing={framing} />
        ))}
      </div>
    </div>
  )
}

function UpNext({ framing, size, days }: { framing: Framing; size: Size; days: Day[] }) {
  if (size === 'compact') return <Compact days={days} framing={framing} />
  if (size === 'standard') return <Standard days={days} framing={framing} />
  return <Large days={days} framing={framing} />
}

// ─── story scaffold ──────────────────────────────────────────────────────────

const SLOTS: Record<Size, { w: number; h: number }> = {
  compact: { w: 253, h: 180 },
  standard: { w: 522, h: 180 },
  large: { w: 522, h: 376 },
}

function Slot({ size, children }: { size: Size; children: ReactNode }) {
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
  const framings: Framing[] = ['family', 'mine']
  return (
    <div className="flex flex-col gap-10">
      {framings.map((framing) => {
        const days = framing === 'family' ? FAMILY_AGENDA : MINE_AGENDA
        return (
          <section key={framing} className="flex flex-col gap-4">
            <h2 className="text-heading text-foreground capitalize">
              {framing === 'family' ? 'Family framing (shared tablet)' : 'Mine framing (Hallie)'}
            </h2>
            <div className="flex flex-wrap items-start gap-6">
              <div>
                <Caption>compact · 1×1</Caption>
                <Slot size="compact">
                  <UpNext framing={framing} size="compact" days={days} />
                </Slot>
              </div>
              <div>
                <Caption>standard · 2×1</Caption>
                <Slot size="standard">
                  <UpNext framing={framing} size="standard" days={days} />
                </Slot>
              </div>
              <div>
                <Caption>large · 2×2</Caption>
                <Slot size="large">
                  <UpNext framing={framing} size="large" days={days} />
                </Slot>
              </div>
            </div>
          </section>
        )
      })}

      <section className="flex flex-col gap-4">
        <h2 className="text-heading text-foreground">All-clear (empty)</h2>
        <div className="flex flex-wrap items-start gap-6">
          <div>
            <Caption>compact</Caption>
            <Slot size="compact">
              <UpNext framing="mine" size="compact" days={[]} />
            </Slot>
          </div>
          <div>
            <Caption>large</Caption>
            <Slot size="large">
              <UpNext framing="mine" size="large" days={[]} />
            </Slot>
          </div>
        </div>
      </section>
    </div>
  )
}

const meta: Meta<typeof Showcase> = {
  title: 'Calendar Exploration/Up Next Widget',
  component: Showcase,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ background: 'var(--background)', padding: 32, minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Showcase>

export const Widget: Story = {
  name: 'Up Next — framings × sizes + empty',
}
