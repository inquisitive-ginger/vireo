import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

export interface EmptyStateProps {
  /** Lucide icon representing the module/category — never a generic empty box.
      Omitted in the compact (widget) variant. */
  icon?: LucideIcon
  /** Primary signal. `display-lg` (Lora) at full size; `card-title` when compact. */
  heading: string
  /** Single sentence max. Optional. */
  body?: string
  /** CTA — wrap in `PermissionGate` at the call site so it's absent (not disabled)
      when the profile can't act. */
  action?: ReactNode
  /** Compact variant for ~180px widget slots: icon dropped, smaller type. */
  compact?: boolean
}

/* The shared empty-state pattern (design-system.md §Empty States): module icon
   (36px, muted, 0.4 opacity) → heading → body → CTA. Informational, never
   apologetic. Used by every empty surface so the language stays consistent. */
export function EmptyState({
  icon: Icon,
  heading,
  body,
  action,
  compact = false,
}: EmptyStateProps) {
  if (compact) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-6 py-3 text-center">
        <h2 className="text-card-title m-0 text-foreground">{heading}</h2>
        {body && <p className="text-sm-token m-0 text-muted-foreground">{body}</p>}
        {action}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-5 text-center">
      {Icon && (
        <Icon
          size={36}
          strokeWidth={1.5}
          className="text-muted-foreground opacity-40"
          aria-hidden
        />
      )}
      <h2 className="text-display-lg m-0 text-foreground">{heading}</h2>
      {body && <p className="text-body m-0 text-muted-foreground">{body}</p>}
      {action}
    </div>
  )
}
