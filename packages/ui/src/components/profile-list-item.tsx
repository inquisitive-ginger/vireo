import { Pencil, Trash2 } from 'lucide-react'
import { ProfileAvatar } from './profile-avatar'
import { Spine } from './spine'
import { Button } from './button'
import { identityColor } from '../lib/identity'
import { cn } from '../lib/utils'

type TierLevel = 1 | 2 | 3 | 4

export interface ProfileListItemProps {
  name: string
  tier: TierLevel
  avatarUrl?: string | null
  isLast?: boolean
  onEdit?: () => void
  onRemove?: () => void
}

export function ProfileListItem({
  name,
  tier,
  avatarUrl,
  isLast,
  onEdit,
  onRemove,
}: ProfileListItemProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-4 sm:gap-4 sm:px-6',
        !isLast && 'border-b border-border'
      )}
    >
      {/* THE KEY. This list and the profile switcher are the only surfaces that show
          every member's face AND name together, which makes them the one place the
          hue→person code can be LEARNED — everywhere else (calendar chips, spines,
          split fills) colour appears with no name attached. Once a photo replaces
          the tinted initials circle, this spine is the only thing still teaching it.
          A legend needs the symbol beside the label; that is what this is. */}
      <Spine color={identityColor(name)} />
      <ProfileAvatar name={name} avatarUrl={avatarUrl ?? undefined} size="md" />
      <span className="min-w-0 flex-1 truncate text-card-title">{name}</span>
      <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-xs-body font-semibold tracking-[0.03em] text-muted-foreground">
        Tier {tier}
      </span>
      <div className="flex shrink-0 gap-0.5 sm:gap-1.5">
        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="gap-1.5"
            aria-label={`Edit ${name}`}
          >
            <Pencil className="size-3.5" aria-hidden />
            <span className="hidden sm:inline">Edit</span>
          </Button>
        )}
        {onRemove && (
          <Button
            variant="ghost-destructive"
            size="sm"
            onClick={onRemove}
            className="gap-1.5"
            aria-label={`Remove ${name}`}
          >
            <Trash2 className="size-3.5" aria-hidden />
            <span className="hidden sm:inline">Remove</span>
          </Button>
        )}
      </div>
    </div>
  )
}
