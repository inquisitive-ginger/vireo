import type { ReactNode } from 'react'
import { Label } from './label'
import { cn } from '../lib/utils'

/* A form field's label with the shared spacing + an optional muted "(optional)"
   suffix — the helper chores and calendar drawers each defined privately. */

export interface FieldLabelProps {
  children: ReactNode
  htmlFor?: string
  /** Append a muted "(optional)" suffix. */
  optional?: boolean
  className?: string
}

export function FieldLabel({ children, htmlFor, optional, className }: FieldLabelProps) {
  return (
    <Label htmlFor={htmlFor} className={cn('mb-[7px] block', className)}>
      {children}
      {optional && <span className="font-normal opacity-65"> (optional)</span>}
    </Label>
  )
}
