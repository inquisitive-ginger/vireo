import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
import { cn } from '../lib/utils'

/* Button props are the superset a polymorphic label needs — a header that opens
   and closes its own group is still a section label, and routing it through a
   second primitive would put its spacing back in the caller's hands. */
export interface SectionLabelProps extends Omit<ComponentPropsWithoutRef<'button'>, 'children'> {
  children: ReactNode
  /** The first label in its stack, or one whose separation is already owned by
      something else (a `gap-7` group stack, a panel's own inset). It takes the
      shorter lead. */
  leading?: boolean
  /** Rendered element — `div` by default. Pass a heading when the group it
      opens belongs in the page's outline. */
  as?: ElementType
  className?: string
}

/* The label that opens a group of rows, and the space that belongs to it.

   `text-section-label` fixes size, weight, tracking and colour and said NOTHING
   about space, so the call sites hand-rolled eight different gaps below it and
   three above. The type token is unchanged; this owns the rhythm.

   A label binds to what is BELOW it, so the gap above is the larger of the two
   (live review, 2026-09-04). Two relationships, one value each: `pt-7` separates
   a group from the group before it, `pt-4` opens the first one under whatever
   the surface put above it.

   Colour stays the caller's — muted on most surfaces, `text-accent` on the
   feed's day heads, `text-primary` on the meals row for today. That is a token
   choice, not a rhythm. So is a trailing rule. */
export function SectionLabel({ children, leading, as, className, ...rest }: SectionLabelProps) {
  const Tag = (as ?? 'div') as ElementType
  return (
    <Tag className={cn('text-section-label mb-2', leading ? 'pt-4' : 'pt-7', className)} {...rest}>
      {children}
    </Tag>
  )
}
