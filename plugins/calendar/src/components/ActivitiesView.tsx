import { useMemo, useState } from 'react'
import { Plus, Repeat } from 'lucide-react'
import {
  Button,
  EmptyState,
  ItemCard,
  MemberGroupHeader,
  RowActions,
  SegmentedControl,
  cn,
  getIdentityHue,
  identityToken,
  type IdentityHue,
} from '@family-os/ui'
import type { CalendarEvent, CalendarMember } from '../types'
import { formatTime, localDateKey } from '../lib/grid'

/* The Activities lens (design.md §4, story #5) — a LENS on the calendar, not a
   separate object type: every standing activity is just a weekly-recurring event
   owned by one person (`is_activity`, derived on write). This surface groups them
   by owner (colour = person) and splits two questions behind a [Roster · Seasons]
   sub-switch:
     · Roster  — who's committed to what, plus each kid's weekday-load strip
                 ("is Teddy overbooked? room for more?").
     · Seasons — a schematic Gantt to each activity's end ("what frees up in
                 November / can we start something new?").
   Management (add / edit / remove) is tier-4 only; tiers 1–3 view read-only. */

const WD_LETTER = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

// `YYYY-MM-DD` (the wire shape of recurrenceUntil) → a local Date.
function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function seasonLabel(recurrenceUntil: string | null): string {
  if (!recurrenceUntil) return 'ongoing'
  return `until ${parseDateKey(recurrenceUntil).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })}`
}

type OwnerGroup = {
  ownerId: string
  name: string
  hue: IdentityHue
  avatarUrl?: string | null
  activities: CalendarEvent[]
  days: Set<number>
}

/** Group standing activities by their single owner, in roster order. An activity
 *  is "standing" when it hasn't ended yet (no season end, or the end is today or
 *  later — measured against the injected `now`). */
function groupByOwner(
  activities: CalendarEvent[],
  membersById: Map<string, CalendarMember>,
  now: Date
): OwnerGroup[] {
  const nowKey = localDateKey(now)
  const standing = activities.filter(
    (a) => a.ownerId && (!a.recurrenceUntil || a.recurrenceUntil >= nowKey)
  )

  const byOwner = new Map<string, CalendarEvent[]>()
  for (const a of standing) {
    const list = byOwner.get(a.ownerId!) ?? []
    list.push(a)
    byOwner.set(a.ownerId!, list)
  }

  // Roster order follows the profiles map; unknown owners are dropped.
  return [...membersById.keys()]
    .filter((id) => byOwner.has(id))
    .map((ownerId) => {
      const { name, avatarUrl } = membersById.get(ownerId)!
      const list = byOwner
        .get(ownerId)!
        .slice()
        .sort((a, b) => {
          const da = new Date(a.startsAt)
          const db = new Date(b.startsAt)
          return da.getDay() - db.getDay() || da.getTime() - db.getTime()
        })
      return {
        ownerId,
        name,
        hue: getIdentityHue(name),
        avatarUrl,
        activities: list,
        days: new Set(list.map((a) => new Date(a.startsAt).getDay())),
      }
    })
}

export interface ActivitiesViewProps {
  activities: CalendarEvent[]
  membersById: Map<string, CalendarMember>
  /** Current time — decides which activities still count as standing, and anchors
   *  the Seasons axis. */
  now: Date
  /** Tier-4 gate: shows the per-owner "+ Add", row edit/remove, and empty CTA. */
  canManage: boolean
  /** Add an activity, optionally pre-owned (the per-person "+ Add"). */
  onAdd?: (ownerId?: string) => void
  onEdit?: (activity: CalendarEvent) => void
  onRemove?: (activity: CalendarEvent) => void
}

export function ActivitiesView({
  activities,
  membersById,
  now,
  canManage,
  onAdd,
  onEdit,
  onRemove,
}: ActivitiesViewProps) {
  const [tab, setTab] = useState<'roster' | 'seasons'>('roster')
  const groups = useMemo(
    () => groupByOwner(activities, membersById, now),
    [activities, membersById, now]
  )

  if (groups.length === 0) {
    return (
      <div className="rounded-panel border border-border bg-card py-8 shadow-[var(--shadow-card)]">
        <EmptyState
          icon={Repeat}
          heading="No activities yet"
          body="A standing weekly commitment — T&T, gymnastics, speech — set once and it fills the calendar."
          action={
            canManage && onAdd ? (
              <Button size="sm" onClick={() => onAdd()}>
                <Plus className="mr-1 h-4 w-4" /> Add activity
              </Button>
            ) : undefined
          }
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2.5">
        <SegmentedControl
          aria-label="Activities lens"
          options={[
            { value: 'roster', label: 'Roster' },
            { value: 'seasons', label: 'Seasons' },
          ]}
          value={tab}
          onChange={setTab}
        />
        <span className="text-sm-token text-muted-foreground">
          {tab === 'roster'
            ? 'Who’s committed to what, by person — and each kid’s weekday load.'
            : 'When each activity ends — what frees up, family-wide.'}
        </span>
      </div>

      {tab === 'roster' ? (
        <div className="flex flex-col gap-7">
          {groups.map((g) => (
            <OwnerRoster
              key={g.ownerId}
              group={g}
              canManage={canManage}
              onAdd={onAdd}
              onEdit={onEdit}
              onRemove={onRemove}
            />
          ))}
        </div>
      ) : (
        <SeasonTimeline groups={groups} now={now} />
      )}
    </div>
  )
}

// Roster

function OwnerRoster({
  group,
  canManage,
  onAdd,
  onEdit,
  onRemove,
}: {
  group: OwnerGroup
  canManage: boolean
  onAdd?: (ownerId?: string) => void
  onEdit?: (activity: CalendarEvent) => void
  onRemove?: (activity: CalendarEvent) => void
}) {
  return (
    <section className="flex flex-col gap-3">
      {/* The shared by-member group header (`@family-os/ui`) — chores' admin board
          composes the same one. Its avatar can hold a photo, so it is not the hue
          carrier: the rows' identity spines are (ADR 042/043). */}
      <MemberGroupHeader
        name={group.name}
        hue={group.hue}
        avatarUrl={group.avatarUrl}
        badge={group.activities.length}
        load={<WeekdayLoad hue={group.hue} days={group.days} />}
        action={
          canManage && onAdd ? (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => onAdd(group.ownerId)}
            >
              <Plus className="mr-1 size-4" /> Add
            </Button>
          ) : undefined
        }
      />
      <div className="flex flex-col gap-2">
        {group.activities.map((activity) => (
          <ActivityRow
            key={activity.seriesId}
            activity={activity}
            hue={group.hue}
            canManage={canManage}
            onEdit={onEdit}
            onRemove={onRemove}
          />
        ))}
      </div>
    </section>
  )
}

/** Per-person weekday-load strip — committed weekdays filled in their hue, so
 *  over/under-booking reads at a glance. */
function WeekdayLoad({ hue, days }: { hue: IdentityHue; days: Set<number> }) {
  return (
    <div className="flex gap-1" aria-hidden>
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

function ActivityRow({
  activity,
  hue,
  canManage,
  onEdit,
  onRemove,
}: {
  activity: CalendarEvent
  hue: IdentityHue
  canManage: boolean
  onEdit?: (activity: CalendarEvent) => void
  onRemove?: (activity: CalendarEvent) => void
}) {
  const start = new Date(activity.startsAt)
  const weekday = start.toLocaleDateString(undefined, { weekday: 'long' })
  const meta = `${weekday}s · ${formatTime(activity.startsAt)}${
    activity.location ? ` · ${activity.location}` : ''
  }`

  const editable = canManage && onEdit

  return (
    <ItemCard
      spine={identityToken(hue)}
      align="center"
      className={cn(editable && 'transition-colors hover:border-primary/50')}
      onActivate={editable ? () => onEdit(activity) : undefined}
      activateLabel={editable ? `Edit “${activity.title}”` : undefined}
      trailing={
        canManage ? (
          <RowActions
            label={activity.title}
            noun="activity"
            onEdit={onEdit ? () => onEdit(activity) : undefined}
            onRemove={onRemove ? () => onRemove(activity) : undefined}
          />
        ) : undefined
      }
    >
      <div className="min-w-0 flex-1">
        <div className="text-card-title truncate text-foreground">{activity.title}</div>
        <div className="text-sm-token truncate text-muted-foreground">{meta}</div>
      </div>
      <span className="text-xs-token shrink-0 rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
        {seasonLabel(activity.recurrenceUntil)}
      </span>
    </ItemCard>
  )
}

// Season timeline (family-wide)
// Schematic Gantt: each activity runs from the axis start to its season end
// (ongoing → runs the full width). Months are equal cells; gridlines are drawn
// once as a full-height overlay so they stay aligned. Answers "what frees up?".

const AXIS_LEN = 7 // months shown, from the current month forward
// Fixed inline width so the label row, gridline overlay, and bar rows share an
// exact origin (utility widths proved unreliable to emit for this one-off).
const GUTTER = { width: 128, flexShrink: 0 } as const

function monthsFromStart(date: Date, start: Date): number {
  const m = (date.getFullYear() - start.getFullYear()) * 12 + (date.getMonth() - start.getMonth())
  const dim = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  return m + (date.getDate() - 1) / dim
}

type TimelineBar = { key: string; name: string; hue: IdentityHue; recurrenceUntil: string | null }

function SeasonTimeline({ groups, now }: { groups: OwnerGroup[]; now: Date }) {
  const axisStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const months = Array.from({ length: AXIS_LEN }, (_, i) =>
    new Date(axisStart.getFullYear(), axisStart.getMonth() + i, 1).toLocaleDateString(undefined, {
      month: 'short',
    })
  )
  const bars: TimelineBar[] = groups.flatMap((g) =>
    g.activities.map((a) => ({
      key: a.seriesId,
      name: a.title,
      hue: g.hue,
      recurrenceUntil: a.recurrenceUntil,
    }))
  )

  return (
    <section className="flex flex-col gap-4 rounded-panel border border-border bg-card p-6 shadow-[var(--shadow-card)]">
      <div>
        <h2 className="text-heading text-foreground">Seasons</h2>
        <p className="text-sm-token text-muted-foreground">
          What’s running and when it frees up — ongoing commitments run on, ended ones drop off.
        </p>
      </div>

      {/* month labels (aligned to the same gutter + N-col track as the bars) */}
      <div className="flex">
        <div style={GUTTER} />
        <div className="grid flex-1" style={{ gridTemplateColumns: `repeat(${AXIS_LEN}, 1fr)` }}>
          {months.map((m, i) => (
            <div key={i} className="text-section-label pl-1.5 text-muted-foreground">
              {m}
            </div>
          ))}
        </div>
      </div>

      {/* body — gridlines drawn once across the full height, bars on top */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 flex">
          <div style={GUTTER} />
          <div className="grid flex-1" style={{ gridTemplateColumns: `repeat(${AXIS_LEN}, 1fr)` }}>
            {months.map((_, i) => (
              <div key={i} className="border-l border-border/50" />
            ))}
          </div>
        </div>

        <div className="relative flex flex-col gap-2.5">
          {bars.map((b) => {
            const ongoing = !b.recurrenceUntil
            const end = ongoing
              ? AXIS_LEN
              : monthsFromStart(parseDateKey(b.recurrenceUntil!), axisStart)
            const width = Math.max(6, Math.min((end / AXIS_LEN) * 100, 100))
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
                      {ongoing ? 'ongoing →' : seasonLabel(b.recurrenceUntil)}
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
