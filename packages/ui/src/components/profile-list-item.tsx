import { Pencil, Trash2 } from 'lucide-react'
import { ProfileAvatar } from './profile-avatar'
import { Button } from './button'
import { cn } from '../lib/utils'

type TierLevel = 1 | 2 | 3 | 4

export interface ProfileListItemProps {
  name: string
  tier: TierLevel
  isLast?: boolean
  onEdit?: () => void
  onRemove?: () => void
}

export function ProfileListItem({ name, tier, isLast, onEdit, onRemove }: ProfileListItemProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-4 sm:gap-4 sm:px-6',
        !isLast && 'border-b border-border'
      )}
    >
      <ProfileAvatar name={name} size="md" />
      <span className="min-w-0 flex-1 truncate text-card-title">{name}</span>
      <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold tracking-[0.03em] text-muted-foreground">
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
