import type { CSSProperties, ReactNode } from 'react'
import { identityToken, resolveHue } from '../lib/identity'
import { cn } from '../lib/utils'

/* The shared selectable-pill chip — the rounded-full `border-2` toggle skeleton
   that chores (assignee / XP reward) and calendar (owner / Family / reminder)
   each hand-rolled. The base owns layout + interaction + the idle/selected weight;
   callers supply the selected color treatment via `selectedClassName` (token
   classes) or `selectedStyle` (dynamic values like an identity hue or the gold
   "treasure" palette). `aria-pressed` makes the toggle state available to AT. */

export interface ChipProps {
  selected: boolean
  onClick: () => void
  children: ReactNode
  /** Leading dot or icon. */
  leading?: ReactNode
  /** Classes applied only when selected — token-based color treatments. */
  selectedClassName?: string
  /** Inline styles applied only when selected — dynamic colors (identity hue, gold). */
  selectedStyle?: CSSProperties
  /** Classes applied only when idle (unselected). */
  idleClassName?: string
  /** Extra classes applied in both states (e.g. sizing overrides). */
  className?: string
}

export function Chip({
  selected,
  onClick,
  children,
  leading,
  selectedClassName,
  selectedStyle,
  idleClassName,
  className,
}: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'text-sm-token inline-flex cursor-pointer items-center gap-1.5 rounded-full border-2 px-3.5 py-1.5 transition-colors',
        selected
          ? cn('font-semibold', selectedClassName)
          : cn('border-border font-normal text-foreground', idleClassName),
        className
      )}
      style={selected ? selectedStyle : undefined}
    >
      {leading}
      {children}
    </button>
  )
}

export interface MemberChipProps {
  name: string
  /** The member's ASSIGNED identity hue (ADR 044). Omitted falls back to the name
      hash, which collides and moves on rename — pass it wherever the profile is at hand. */
  hue?: string | null
  selected: boolean
  onClick: () => void
}

/* The identity-hue member chip — selected fills with the member's `tint`/`ink`
   and a hue dot. Shared by the chores assignee picker and the calendar owner
   picker (both previously had a private copy). */
export function MemberChip({ name, hue, selected, onClick }: MemberChipProps) {
  const owner = resolveHue(name, hue)
  return (
    <Chip
      selected={selected}
      onClick={onClick}
      leading={
        <span
          className="size-2 shrink-0 rounded-full"
          style={{ background: identityToken(owner) }}
        />
      }
      selectedStyle={{
        borderColor: identityToken(owner),
        background: identityToken(owner, 'tint'),
        color: identityToken(owner, 'ink'),
      }}
    >
      {name}
    </Chip>
  )
}
