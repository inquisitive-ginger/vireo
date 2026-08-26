import { Check } from 'lucide-react'
import { Chip, ListRow, cn } from '@family-os/ui'
import type { GroceryItem } from '../types'
import { AISLES } from '../lib/grocery-filing'

const CORRECTABLE_AISLES = AISLES.filter((a) => a !== 'Other')

/* ADR 063/064 applied: `ListRow`, no identity chrome — no note line (design
   gate 2026-08-23; `item.note` still computes server-side for M5/7, nothing
   here renders it). Quantity goes in `children` beside the `min-w-0 flex-1`
   wrapper — `ListRow`'s `leading` slot needed no change (ADR 063's open
   question, answered by the gate).

   The whole row is the check target (design.md §M5/7 "whole-row tap toggles",
   pulled into M5/6): `ListRow`'s own `onActivate`, so there is exactly one
   control per row and the target is the whole row rather than a 20px ring.
   The row's height is the primitive's to set (ADR 068) — this file used to
   override it to 44px, under the house's own control minimum, on the one
   surface where every row is a target and the reader is one-handed. The ring stays a marker in `leading` — making it a second button would
   nest two controls that do the same thing. The correction band is a sibling
   OUTSIDE the row, so its chips never fall under the check target.

   A checked row dims and strikes through but holds its position (artifact §2)
   — it does not migrate to a bottom group. Cleared-aisle collapse and the
   progress track stay M5/7. */
export function GroceryRow({
  item,
  flash,
  showCorrection,
  isLast,
  canCheck,
  onCorrect,
  onToggleCheck,
}: {
  item: GroceryItem
  flash: boolean
  showCorrection: boolean
  /** Last thing in the list — it draws no hairline of its own, because the
      composer's own rule is already closing the list one gap below it. */
  isLast: boolean
  canCheck: boolean
  onCorrect: (item: GroceryItem, category: string) => void
  onToggleCheck: (item: GroceryItem) => void
}) {
  const got = item.status === 'got'
  return (
    <>
      <ListRow
        onActivate={canCheck ? () => onToggleCheck(item) : undefined}
        activateLabel={got ? `Uncheck ${item.name}` : `Check off ${item.name}`}
        leading={
          got ? (
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check className="size-3" aria-hidden />
            </span>
          ) : (
            // A marker, not a button — the row around it is the control. Back
            // to the artifact's own ring weight now that a tap answers.
            <span className="size-5 shrink-0 rounded-full border-2 border-border" aria-hidden />
          )
        }
        className={cn(
          'transition-colors duration-[var(--duration-slow)]',
          got && 'opacity-[0.46]',
          flash && 'bg-primary/13',
          // The band below is about THIS row, so the row does not close itself —
          // fenced off by the same hairline that divides unrelated items, the
          // question reads as one more row of the list.
          (showCorrection || isLast) && 'border-b-0'
        )}
      >
        <div className="flex min-w-0 flex-1 items-baseline justify-between gap-2">
          <span className={cn('text-list-title truncate text-foreground', got && 'line-through')}>
            {item.name}
          </span>
          {item.quantity && (
            <span className="text-sm-token shrink-0 text-muted-foreground [font-variant-numeric:tabular-nums]">
              {item.quantity}
            </span>
          )}
        </div>
      </ListRow>

      {/* Directly beneath the row it is about, so nothing above it moves
          (AC4) — a band of its own, not a second line inside the row. */}
      {showCorrection && (
        <div
          className={cn(
            'flex flex-wrap items-center gap-1.5 border-b border-border pt-0.5 pb-2.5',
            isLast && 'border-b-0'
          )}
        >
          <span className="text-sm-token text-muted-foreground">Which aisle?</span>
          {CORRECTABLE_AISLES.map((aisle) => (
            <Chip
              key={aisle}
              selected={false}
              onClick={() => onCorrect(item, aisle)}
              className="px-3 py-1"
            >
              {aisle}
            </Chip>
          ))}
          <Chip
            selected={false}
            onClick={() => onCorrect(item, 'Other')}
            className="border-dashed px-3 py-1 text-muted-foreground"
          >
            Leave it
          </Chip>
        </div>
      )}
    </>
  )
}
