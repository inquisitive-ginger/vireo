import { identityToken, resolveHue } from '@family-os/ui'
import type { CalendarMember } from '../types'

/** A day mark's required second channel (ADR 044): a 16px identity-tint disc
 *  carrying the owner's initial. Never a photo — at 16px an avatar carries
 *  neither hue nor letter at a glance (design.md §M5/4), so this is deliberately
 *  not `ProfileAvatar`. `aria-hidden`: it's a visual shorthand for the hue, and
 *  the mark's own label carries the owner's name in the accessible text. */
export function DayMarkOwnerDot({ member }: { member: CalendarMember }) {
  const hue = resolveHue(member.name, member.identityHue)
  return (
    <span
      aria-hidden
      className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold"
      style={{
        backgroundColor: identityToken(hue, 'tint'),
        color: identityToken(hue, 'ink'),
      }}
    >
      {member.name[0]?.toUpperCase() ?? ''}
    </span>
  )
}
