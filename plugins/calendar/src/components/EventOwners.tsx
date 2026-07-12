import { Users } from 'lucide-react'
import { FAMILY_HUE, ProfileAvatar, identityToken } from '@family-os/ui'
import type { CalendarEvent } from '../types'

/* WHO AN EVENT BELONGS TO — one marker, used by every calendar row (the up-next
   widget's day rows, the multi-day `SpanBand`, and anything that follows).

   Owners are avatars, not names: "Zoe & Teddy" costs a third of a row; two 28px
   circles cost nothing and carry strictly more — the avatar already IS the
   identity hue a spine would paint, plus the initial that disambiguates it.

   A no-owner event belongs to the household, and gets the household's own glyph
   in the reserved `family` identity hue — not the chrome token it used to borrow
   (ADR 041). It resolves through the same tint/ink layers as a person's, which is
   the whole point: one path, no "no owner" branch. */

export function EventOwners({
  event,
  membersById,
  showMembers = true,
}: {
  event: CalendarEvent
  membersById: Map<string, string>
  /** False in the widget's "mine" framing — every event on that surface is already
   *  theirs, so member avatars are noise. The household glyph still renders: "this
   *  one is everyone's" is news even on your own surface. */
  showMembers?: boolean
}) {
  const names = event.attendeeIds
    .map((id) => membersById.get(id))
    .filter((n): n is string => Boolean(n))

  if (names.length === 0) {
    return (
      <span
        className="flex size-7 shrink-0 items-center justify-center rounded-full"
        style={{
          background: identityToken(FAMILY_HUE, 'tint'),
          color: identityToken(FAMILY_HUE, 'ink'),
        }}
        aria-label="Family"
        role="img"
      >
        <Users className="size-3.5" aria-hidden />
      </span>
    )
  }

  if (!showMembers) return null

  return (
    <span className="flex shrink-0 -space-x-1.5">
      {names.slice(0, 3).map((name) => (
        <ProfileAvatar
          key={name}
          name={name}
          size="sm"
          className="size-7 text-xs-body ring-2 ring-card"
        />
      ))}
    </span>
  )
}
