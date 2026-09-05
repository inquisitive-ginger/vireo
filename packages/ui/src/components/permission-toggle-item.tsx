import { memo } from 'react'
import { cn } from '../lib/utils'
import { Switch } from './switch'

export interface PermissionToggleItemProps {
  id: string
  label: string
  inBaseline: boolean
  override: 'grant' | 'revocation' | null
  disabled?: boolean
  isLast?: boolean
  onToggle: (key: string) => void
}

function isChecked(inBaseline: boolean, override: 'grant' | 'revocation' | null): boolean {
  return inBaseline ? override !== 'revocation' : override === 'grant'
}

export const PermissionToggleItem = memo(function PermissionToggleItem({
  id,
  label,
  inBaseline,
  override,
  disabled,
  isLast,
  onToggle,
}: PermissionToggleItemProps) {
  return (
    <div className={cn('flex items-center gap-3 px-6 py-3.5', !isLast && 'border-b border-border')}>
      <label htmlFor={id} className="flex-1 text-sm-token text-foreground cursor-pointer">
        {label}
      </label>

      {override === 'grant' && (
        <span className="text-xs-token uppercase tracking-[0.06em] text-success">Granted</span>
      )}
      {override === 'revocation' && (
        <span className="text-xs-token uppercase tracking-[0.06em] text-destructive">Revoked</span>
      )}

      <Switch
        id={id}
        checked={isChecked(inBaseline, override)}
        onCheckedChange={() => onToggle(id)}
        disabled={disabled}
      />
    </div>
  )
})
