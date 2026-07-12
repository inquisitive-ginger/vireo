import type { ReactNode } from 'react'
import { ProfileAvatar } from './profile-avatar'
import { identityToken, resolveHue, type OwnerHue } from '../lib/identity'
import { cn } from '../lib/utils'

export interface MemberGroupHeaderProps {
  name: string
  /** Explicit hue; falls back to the name hash (ADR 030). Pass `FAMILY_HUE` for
      the household. */
  hue?: OwnerHue
  avatarUrl?: string | null
  /** A count of **this member's items** — "3", "2 left". Rendered on their identity
      tint, because a count of someone's things is an identity statement. Omit for none. */
  count?: ReactNode
  /** A **status** chip — "1 overdue", "✓ all done". Rendered **raw**: the caller owns
      the colour, because status has its own language (red = overdue, green = done) and
      must not be repainted in an identity hue.

      This slot exists because the first pass tinted *everything* here, so a member with
      overdue work got "1 overdue" in their pale teal — while the row two lines below
      said "Overdue" in red. One fact, two colours: exactly what ADR 043 exists to
      prevent, reintroduced in the header while being fixed in the rows. */
  status?: ReactNode
  /** The group's load read: chores' XP meter, calendar's weekday strip. Wraps to
      its own full-width row below `sm:` so a phone doesn't crush the name. */
  load?: ReactNode
  /** Trailing affordance — the tier-4 "+ Add" (prefills this member). */
  action?: ReactNode
  className?: string
}

/* The header of a by-member group: face, name, count, load, add.

   It is deliberately QUIET. Identity is carried by the rows beneath it — each an
   `ItemCard` with the member's hue on its spine (ADR 043: identity takes the
   edge). An earlier chores board washed the member's hue across this header as a
   full-width gradient, which made the label the loudest object on a page whose
   subject is the tasks.

   The avatar can hold a photograph, so it is NOT this header's colour signal
   (ADR 042). The hue lives in the `badge` tint and in the rows' spines.

   Shared by the chores admin board and the calendar Activities roster, which had
   converged on the same anatomy independently. */
export function MemberGroupHeader({
  name,
  hue,
  avatarUrl,
  count,
  status,
  load,
  action,
  className,
}: MemberGroupHeaderProps) {
  const ownerHue: OwnerHue = hue ?? resolveHue(name)
  return (
    <div className={cn('flex flex-wrap items-center gap-x-2.5 gap-y-2', className)}>
      <ProfileAvatar name={name} identity={ownerHue} avatarUrl={avatarUrl ?? undefined} size="sm" />
      <span className="text-heading text-foreground">{name}</span>
      {/* Status reads before the count — an alarm outranks an inventory. */}
      {status}
      {count !== undefined && (
        <span
          className="text-xs-token rounded-full px-2 py-0.5"
          style={{
            background: identityToken(ownerHue, 'tint'),
            color: identityToken(ownerHue, 'ink'),
          }}
        >
          {count}
        </span>
      )}
      {load !== undefined && (
        <div className="order-last basis-full sm:order-none sm:basis-auto">{load}</div>
      )}
      {action !== undefined && <div className="ml-auto shrink-0">{action}</div>}
    </div>
  )
}
