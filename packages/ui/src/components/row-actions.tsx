import { Pencil, Trash2 } from 'lucide-react'
import { Button } from './button'

export interface RowActionsProps {
  /** What the row is about — used to build the accessible names ("Edit “Vacuum”"). */
  label: string
  /** Tier-4 edit. Renders the pencil on `sm+` only; below that, tap-row-to-edit
      (`ItemCard onActivate`) is the affordance. */
  onEdit?: () => void
  /** Tier-4 remove. The host confirms — this only reports the intent. */
  onRemove?: () => void
  /** Noun for the tooltips: "task", "activity". */
  noun?: string
}

/* The inline edit/remove cluster for a list row — the settings→profiles pattern.
   A kebab was the original spec, but a kebab leans on hover, which touch doesn't
   have; these are plain 44px targets instead.

   The pencil is redundant with tap-row-to-edit, so it only appears on `sm+` as a
   visible desktop affordance. Remove stays inline at every width — it must never
   be the thing a stray tap does, so it is never the row's default action.

   Extracted 2026-07-12: chores' AdminRow and calendar's ActivityRow had shipped
   this verbatim, each citing the other in a comment. */
export function RowActions({ label, onEdit, onRemove, noun = 'task' }: RowActionsProps) {
  if (!onEdit && !onRemove) return null
  return (
    <>
      {onEdit && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          aria-label={`Edit “${label}”`}
          title={`Edit ${noun}`}
          className="hidden h-11 w-11 sm:inline-flex"
        >
          <Pencil className="size-3.5" aria-hidden />
        </Button>
      )}
      {onRemove && (
        <Button
          variant="ghost-destructive"
          size="icon"
          onClick={onRemove}
          aria-label={`Remove “${label}”`}
          title={`Remove ${noun}`}
          className="h-11 w-11"
        >
          <Trash2 className="size-3.5" aria-hidden />
        </Button>
      )}
    </>
  )
}
