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
  /** Omitted, the chip STATES rather than toggles and renders a `span` — no
      button, no `aria-pressed`, nothing to tab to. */
  onClick?: () => void
  /** An accessible name of its own, for a chip whose visible text is not the
      whole act ("Take back broccoli" on a chip reading `broccoli ×`). A chip
      with one is an action, not a toggle, so it drops `aria-pressed`. */
  label?: string
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
  label,
  children,
  leading,
  selectedClassName,
  selectedStyle,
  idleClassName,
  className,
}: ChipProps) {
  const Tag = onClick ? 'button' : 'span'
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      aria-label={label}
      aria-pressed={onClick && !label ? selected : undefined}
      className={cn(
        'text-sm-token inline-flex items-center gap-1.5 rounded-full border-2 px-3.5 py-1.5 transition-colors',
        onClick && 'cursor-pointer',
        selected
          ? cn('font-semibold', selectedClassName)
          : cn('border-border font-normal text-foreground', idleClassName),
        className
      )}
      style={selected ? selectedStyle : undefined}
    >
      {leading}
      {children}
    </Tag>
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
