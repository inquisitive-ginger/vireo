import type { Meta, StoryObj } from '@storybook/react'
import { format } from 'date-fns'
import { CalendarDays, Pencil, Plus, Repeat, Trash2 } from 'lucide-react'
import { Button } from '../components/button'
import { ProfileAvatar } from '../components/profile-avatar'
import { identityToken, type IdentityHue } from '../lib/identity'

/* ────────────────────────────────────────────────────────────────────────────
   CALENDAR UX EXPLORATION — Activities surface (story #5)
   ----------------------------------------------------------------------------
   Exploration scaffolding for M3 Design: Calendar. NOT a shippable component.

   WHAT AN ACTIVITY IS (settled 2026-06-22): not "an event that repeats" — both
   events and activities repeat. An Activity is a *standing commitment a specific
   person has taken on, over a season, that counts toward how busy they are*
   (T&T, gymnastics, Vision Therapy, speech). A recurring *event* is just
   something that lands on the calendar again (trash day, Sunday dinner) — nobody
   carries it as load.

   DERIVE, DON'T CATEGORIZE: users never pick "event vs activity." Any
   weekly-recurring event owned by a person IS an activity and shows up in their
   roster automatically; Family / un-owned / one-off recurring things don't. This
   surface is a LENS on the calendar, not a separate object type.

   WHY IT EARNS ITS KEEP — the load/balance lens (the thing paper can't do):
     · per-kid WEEKDAY-LOAD strip — committed days filled in their hue, so
       over/under-booking is glanceable ("is Teddy overbooked? room for more?")
     · family SEASON TIMELINE — bars to each activity's end, so "what frees up in
       November / can we start something new?" is visible
   (Connects to the owed member-capacity ADR: a kid's true load is chores +
   activities; Activities is capacity's first real consumer.)

   Grouped by owner (color = person). Tier 4 manages; tiers 1–3 view only.
   ──────────────────────────────────────────────────────────────────────────── */

type Activity = {
  name: string
  weekday: number // 0=Sun … 6=Sat
  time: string
  location?: string
  endsAt?: Date // season end; undefined = ongoing
}

const D = (s: string) => new Date(`${s}T00:00:00`)
const SEASON_END = D('2026-08-25')

const GROUPS: { owner: string; hue: IdentityHue; activities: Activity[] }[] = [
  {
    owner: 'Zoe',
    hue: 'marigold',
    activities: [
      {
        name: 'Gymnastics',
        weekday: 1,
        time: '4:00 PM',
        location: 'Flips Gym',
        endsAt: SEASON_END,
      },
      { name: 'Karate', weekday: 3, time: '4:30 PM', location: 'Dojo', endsAt: SEASON_END },
      { name: 'Piano', weekday: 5, time: '3:30 PM' },
    ],
  },
  {
    owner: 'Teddy',
    hue: 'sky',
    activities: [
      { name: 'T&T', weekday: 2, time: '5:15 PM', location: 'Flips Gym', endsAt: SEASON_END },
      { name: 'Swim', weekday: 4, time: '6:00 PM', location: 'Rec Center' },
    ],
  },
  {
    owner: 'Hallie',
    hue: 'plum',
    activities: [{ name: 'Yoga', weekday: 2, time: '6:00 PM' }],
  },
]

const WD_LETTER = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const WD_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// ─── Weekday-load strip ────────────────────────────────────────────────────────

function WeekdayLoad({ hue, days }: { hue: IdentityHue; days: Set<number> }) {
  return (
    <div className="flex gap-1">
      {WD_LETTER.map((letter, i) => {
        const on = days.has(i)
        return (
          <span
            key={i}
            className="text-xs-token flex h-6 w-6 items-center justify-center rounded-md"
            style={
              on
                ? {
                    background: identityToken(hue, 'tint'),
                    color: identityToken(hue, 'ink'),
                    fontWeight: 600,
                  }
                : { background: 'var(--muted)', color: 'var(--muted-foreground)', opacity: 0.6 }
            }
          >
            {letter}
          </span>
        )
      })}
    </div>
  )
}

function ActivityRow({ activity, hue }: { activity: Activity; hue: IdentityHue }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-[var(--shadow-card)]">
      <span
        className="h-10 w-1 shrink-0 rounded-full"
        style={{ background: identityToken(hue) }}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <div className="text-card-title truncate text-foreground">{activity.name}</div>
        <div className="text-sm-token text-muted-foreground truncate">
          {WD_SHORT[activity.weekday]}s · {activity.time}
          {activity.location ? ` · ${activity.location}` : ''}
        </div>
      </div>
      <span className="text-xs-token shrink-0 rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
        {activity.endsAt ? `until ${format(activity.endsAt, 'MMM d')}` : 'ongoing'}
      </span>
      <div className="flex shrink-0 items-center gap-0.5">
        <Button variant="ghost" size="icon-sm" aria-label="Edit activity">
          <Pencil className="size-4 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="End or remove activity">
          <Trash2 className="size-4 text-muted-foreground" />
        </Button>
      </div>
    </div>
  )
}

function OwnerGroup({
  owner,
  hue,
  activities,
}: {
  owner: string
  hue: IdentityHue
  activities: Activity[]
}) {
  const days = new Set(activities.map((a) => a.weekday))
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2.5">
        <ProfileAvatar name={owner} identity={hue} size="sm" />
        <span className="text-heading text-foreground">{owner}</span>
        <span
          className="text-xs-token rounded-full px-2 py-0.5"
          style={{ background: identityToken(hue, 'tint'), color: identityToken(hue, 'ink') }}
        >
          {activities.length}
        </span>
        <WeekdayLoad hue={hue} days={days} />
        <Button variant="ghost" size="sm" className="ml-auto text-muted-foreground">
          <Plus className="mr-1 size-4" /> Add
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        {activities.map((a) => (
          <ActivityRow key={a.name} activity={a} hue={hue} />
        ))}
      </div>
    </section>
  )
}

// ─── Season timeline (family-wide) ──────────────────────────────────────────────
// Schematic Gantt: each activity runs from the left to its season end (ongoing →
// runs the full width). Months are equal cells; gridlines are drawn once as a
// full-height overlay so they stay aligned. Answers "what frees up in November?".

const MONTHS = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] // 7-month axis from June
const AXIS_MONTHS = MONTHS.length
// Fixed inline width so the label row, gridline overlay, and bar rows share an
// exact origin (utility widths proved unreliable to emit for this one-off).
const GUTTER = { width: 120, flexShrink: 0 } as const

// Months elapsed since June 1 (fractional) → axis position.
function monthsFromStart(date: Date): number {
  const m = date.getMonth() - 5 // June = 0
  const dim = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  return m + (date.getDate() - 1) / dim
}

type TimelineBar = { key: string; name: string; hue: IdentityHue; endsAt?: Date }

function SeasonTimeline() {
  const bars: TimelineBar[] = GROUPS.flatMap((g) =>
    g.activities.map((a) => ({
      key: `${g.owner}-${a.name}`,
      name: a.name,
      hue: g.hue,
      endsAt: a.endsAt,
    }))
  )

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
      <div>
        <h2 className="text-heading text-foreground">Seasons</h2>
        <p className="text-sm-token text-muted-foreground">
          What’s running and when it frees up — several activities end Aug 25, so autumn opens room.
        </p>
      </div>

      {/* month labels (aligned to the same gutter + 7-col track as the bars) */}
      <div className="flex">
        <div style={GUTTER} />
        <div className="grid flex-1 grid-cols-7">
          {MONTHS.map((m) => (
            <div key={m} className="text-section-label pl-1.5 text-muted-foreground">
              {m}
            </div>
          ))}
        </div>
      </div>

      {/* body — gridlines drawn once across the full height, bars on top */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 flex">
          <div style={GUTTER} />
          <div className="grid flex-1 grid-cols-7">
            {MONTHS.map((m) => (
              <div key={m} className="border-l border-border/50" />
            ))}
          </div>
        </div>

        <div className="relative flex flex-col gap-2.5">
          {bars.map((b) => {
            const end = b.endsAt ? monthsFromStart(b.endsAt) : AXIS_MONTHS
            const width = Math.min((end / AXIS_MONTHS) * 100, 100)
            const ongoing = !b.endsAt
            return (
              <div key={b.key} className="flex items-center">
                <div style={GUTTER} className="flex items-center gap-1.5 pr-3">
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ background: identityToken(b.hue) }}
                  />
                  <span className="text-sm-token truncate text-foreground">{b.name}</span>
                </div>
                <div className="relative h-7 flex-1">
                  <div
                    className="text-xs-token absolute inset-y-1 left-0 flex items-center rounded-md px-2 font-semibold"
                    style={{
                      width: `${width}%`,
                      background: identityToken(b.hue, 'tint'),
                      color: identityToken(b.hue, 'ink'),
                    }}
                  >
                    <span className="truncate">
                      {ongoing ? 'ongoing →' : `until ${format(b.endsAt!, 'MMM d')}`}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Surface ────────────────────────────────────────────────────────────────────

function ActivitiesSurface() {
  return (
    <div className="flex flex-col gap-6">
      {/* header + Month/Activities view switch (entry-point context) */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-page-title text-foreground">Activities</h1>
          <div className="flex items-center gap-1 rounded-full border border-border p-0.5">
            <button className="text-sm-token rounded-full px-3 py-1 text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-3.5" /> Month
              </span>
            </button>
            <button className="text-sm-token rounded-full bg-primary px-3 py-1 font-medium text-primary-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Repeat className="size-3.5" /> Activities
              </span>
            </button>
          </div>
        </div>
        <Button size="sm">
          <Plus className="mr-1 size-4" /> Add activity
        </Button>
      </div>

      <p className="text-body text-muted-foreground -mt-2 max-w-[560px]">
        Standing weekly commitments — set once and they fill the calendar. The day strip shows each
        person’s load; the season timeline shows when things free up.
      </p>

      <div className="flex flex-col gap-7">
        {GROUPS.map((g) => (
          <OwnerGroup key={g.owner} owner={g.owner} hue={g.hue} activities={g.activities} />
        ))}
      </div>

      <SeasonTimeline />
    </div>
  )
}

const meta: Meta<typeof ActivitiesSurface> = {
  title: 'Calendar Exploration/Activities',
  component: ActivitiesSurface,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ background: 'var(--background)', padding: 24, minHeight: '100vh' }}>
        <div className="mx-auto" style={{ maxWidth: 760 }}>
          <Story />
        </div>
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ActivitiesSurface>

export const LoadView: Story = {
  name: 'Activities — load lens (locked)',
}
