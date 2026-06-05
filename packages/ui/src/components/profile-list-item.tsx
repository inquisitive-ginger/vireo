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
    <div className={cn('flex items-center gap-4 px-6 py-4', !isLast && 'border-b border-border')}>
      <ProfileAvatar name={name} size="md" />
      <span className="flex-1 text-card-title">{name}</span>
      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground tracking-[0.03em]">
        Tier {tier}
      </span>
      <div className="flex gap-1.5">
        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="gap-1.5"
            aria-label={`Edit ${name}`}
          >
            <Pencil className="size-3.5" aria-hidden /> Edit
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
            <Trash2 className="size-3.5" aria-hidden /> Remove
          </Button>
        )}
      </div>
    </div>
  )
}
