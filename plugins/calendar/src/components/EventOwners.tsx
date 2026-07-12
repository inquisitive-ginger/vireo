import { Users } from 'lucide-react'
import { FAMILY_HUE, ProfileAvatar, identityToken } from '@family-os/ui'
import type { CalendarEvent, CalendarMember } from '../types'

/* WHO AN EVENT BELONGS TO — the FACE on a calendar row (the up-next widget's day
   rows, the multi-day `SpanBand`, and anything that follows).

   Owners are avatars, not names: "Zoe & Teddy" costs a third of a row; two 28px
   circles cost nothing and are read faster.

   But the avatar is NOT the row's colour signal. It used to be — this very comment
   once justified deleting the row's `<Spine>` on the grounds that "the avatar
   already IS the identity hue a spine would paint, plus the initial". Avatars can
   hold a PHOTOGRAPH now (ADR 042), which makes that false: a photo covers the tint,
   and a photo's own dominant colour is not its owner's hue. The spine came back,
   and the division of labour is now explicit — **the spine carries the identity,
   the avatar carries the face.** Across the room only the colour survives; the face
   is a close-up detail. Never delete a row's spine because it has an avatar.

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
  membersById: Map<string, CalendarMember>
  /** False in the widget's "mine" framing — every event on that surface is already
   *  theirs, so member avatars are noise. The household glyph still renders: "this
   *  one is everyone's" is news even on your own surface. */
  showMembers?: boolean
}) {
  const owners = event.attendeeIds
    .map((id) => membersById.get(id))
    .filter((m): m is CalendarMember => Boolean(m))

  if (owners.length === 0) {
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
      {owners.slice(0, 3).map((member) => (
        <ProfileAvatar
          key={member.name}
          name={member.name}
          avatarUrl={member.avatarUrl ?? undefined}
          size="sm"
          className="size-7 text-xs-body ring-2 ring-card"
        />
      ))}
    </span>
  )
}
