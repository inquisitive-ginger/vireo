import type { ReactNode } from 'react'
import { MapPin, Users } from 'lucide-react'
import { FAMILY_HUE, identityToken, type OwnerHue } from '@family-os/ui'
import type { CalendarEvent, CalendarMember } from '../types'
import { agendaWhenLabel, formatTime, isMultiDay, relativeWhen } from '../lib/grid'
import { fillForHues, huesForEvent, isFamilyHues } from '../lib/hues'

/* Static identity pill for the compact hero owner — the owner's soft `tint`/`ink`
   with a hue ring so it reads against the same-hue wash it sits on. Display only
   (not the interactive `MemberChip` picker).

   The household uses this too (ADR 041): with `family` a real identity hue, the
   Family pill is no longer a hand-rolled `--secondary` special case that dissolved
   into its own hero — it takes the same tint/ink/ring path a member's does, and the
   ring is what keeps it legible on a same-hue wash. */
function OwnerPill({ name, hue, icon }: { name: string; hue: OwnerHue; icon?: ReactNode }) {
  return (
    <span
      // `text-sm-token` — the same size as the location beside it. The meta line is
      // one register; a 10px bold pill next to 13px regular text read as a mistake.
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-sm-token font-semibold"
      style={{
        background: identityToken(hue, 'tint'),
        color: identityToken(hue, 'ink'),
        boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${identityToken(hue, 'base')} 32%, transparent)`,
      }}
    >
      {icon}
      {name}
    </span>
  )
}

/* The "Up next" hero — the single next event, washed in its owner's identity
   colour (a split fill for a shared event, neutral for Family). Established on
   the mobile agenda (story #4) and reused by the `calendar.up-next` widget
   (story #7) so the two surfaces stay in lockstep.

   Two layouts share the same washing / hue / "Up next" identity:
   · default (mobile agenda) — title left, the clock/date label prominent on the
     right, owner under the title. Unchanged from story #4.
   · `compact` (widget slot) — a single header line ("Up next · in 30 min", the
     countdown reunited with the eyebrow), the title as the one dominant element,
     then a quiet meta line (time · place · owner). `now` drives the countdown.

   `onClick` makes the whole card a button (tap-to-edit / tap-through).
   `showSoloOwner=false` drops member names (the widget's Mine framing — all
   theirs); a Family event still tags "Family". */
export function NextEventHero({
  event,
  membersById,
  now,
  onClick,
  compact = false,
  showSoloOwner = true,
}: {
  event: CalendarEvent
  membersById: Map<string, CalendarMember>
  now?: Date
  onClick?: () => void
  compact?: boolean
  showSoloOwner?: boolean
}) {
  const hues = huesForEvent(event.attendeeIds, membersById)
  const fill = fillForHues(hues)
  const ownerNames = event.attendeeIds
    .map((id) => membersById.get(id)?.name)
    .filter((n): n is string => Boolean(n))
  const when = now ? relativeWhen(event, now) : agendaWhenLabel(event)
  const hasClock = !event.allDay && !isMultiDay(event)

  const owner: ReactNode =
    ownerNames.length === 0 ? (
      <span className="inline-flex items-center gap-1">
        <Users className="h-3.5 w-3.5" /> Family
      </span>
    ) : showSoloOwner ? (
      ownerNames.join(' · ')
    ) : null
  /* Owner(s) as identity pills — the household included, on the same path (ADR 041). */
  const ownerPills: ReactNode = isFamilyHues(hues) ? (
    <OwnerPill name="Family" hue={FAMILY_HUE} icon={<Users className="h-3.5 w-3.5" />} />
  ) : showSoloOwner ? (
    ownerNames.map((name, i) => <OwnerPill key={name} name={name} hue={hues[i]} />)
  ) : null

  const body = compact ? (
    <>
      {/* Header line: "Up next" and the countdown read together, not in opposite
          corners — and both stay smaller than the title below. No identity dot: the
          wash already codes the owner, and on a Family event the dot was
          `--secondary` on a `--secondary` wash — invisible, and indenting the
          eyebrow 14px off the title's edge for nothing. */}
      <div className="flex items-center gap-1.5 text-section-label text-foreground/60">
        <span>Up next</span>
        {now && <span className="text-foreground/80">· {when}</span>}
      </div>
      <div className="text-heading mt-2 truncate text-foreground">{event.title}</div>
      {/* Meta: time (plain, no clock icon) → place → owner pill. The wash already
          codes identity, so the owner reads as a pill, not a labelled field. */}
      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm-token text-foreground/75">
        {hasClock && <span className="tabular-nums">{formatTime(event.startsAt)}</span>}
        {event.location && (
          <span className="inline-flex min-w-0 items-center gap-1">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{event.location}</span>
          </span>
        )}
        {ownerPills}
      </div>
    </>
  ) : (
    <>
      <div className="text-section-label text-foreground/60">Up next</div>
      <div className="mt-2.5 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="text-heading text-foreground">{event.title}</div>
          {owner && (
            <div className="mt-1.5 flex items-center gap-1.5 text-sm-token text-foreground/70">
              {owner}
            </div>
          )}
        </div>
        <div className="shrink-0 text-right">
          <div className="text-card-title font-semibold tabular-nums text-foreground">{when}</div>
          {event.location && (
            <div className="mt-0.5 flex items-center justify-end gap-1 text-xs-token text-foreground/70">
              <MapPin className="h-3 w-3" /> {event.location}
            </div>
          )}
        </div>
      </div>
    </>
  )

  const className = `block w-full rounded-hero border border-border/60 text-left shadow-[var(--shadow-card)] ${
    compact ? 'p-3.5' : 'p-4'
  }`
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`Edit ${event.title}`}
        className={`${className} cursor-pointer`}
        style={{ background: fill.background }}
      >
        {body}
      </button>
    )
  }
  return (
    <div className={className} style={{ background: fill.background }}>
      {body}
    </div>
  )
}
