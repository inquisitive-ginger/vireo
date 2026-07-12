import type { ReactNode } from 'react'
import { ProfileAvatar } from './profile-avatar'
import { getIdentityHue, identityToken, type OwnerHue } from '../lib/identity'
import { cn } from '../lib/utils'

export interface MemberGroupHeaderProps {
  name: string
  /** Explicit hue; falls back to the name hash (ADR 030). Pass `FAMILY_HUE` for
      the household. */
  hue?: OwnerHue
  avatarUrl?: string | null
  /** A short count beside the name, rendered on the member's identity tint —
      "3", "2 left". Omit for none. */
  badge?: ReactNode
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
  badge,
  load,
  action,
  className,
}: MemberGroupHeaderProps) {
  const ownerHue = hue ?? getIdentityHue(name)
  return (
    <div className={cn('flex flex-wrap items-center gap-x-2.5 gap-y-2', className)}>
      <ProfileAvatar name={name} identity={ownerHue} avatarUrl={avatarUrl ?? undefined} size="sm" />
      <span className="text-heading text-foreground">{name}</span>
      {badge !== undefined && (
        <span
          className="text-xs-token rounded-full px-2 py-0.5"
          style={{
            background: identityToken(ownerHue, 'tint'),
            color: identityToken(ownerHue, 'ink'),
          }}
        >
          {badge}
        </span>
      )}
      {load !== undefined && (
        <div className="order-last basis-full sm:order-none sm:basis-auto">{load}</div>
      )}
      {action !== undefined && <div className="ml-auto shrink-0">{action}</div>}
    </div>
  )
}
