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

   A checked row dims and strikes through but holds its position (artifact §2)
   — it does not migrate to a bottom group. Checking is M5/7; this renders the
   state, not the control. */
export function GroceryRow({
  item,
  flash,
  showCorrection,
  onCorrect,
}: {
  item: GroceryItem
  flash: boolean
  showCorrection: boolean
  onCorrect: (item: GroceryItem, category: string) => void
}) {
  const got = item.status === 'got'
  return (
    <>
      <ListRow
        leading={
          got ? (
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check className="size-3" aria-hidden />
            </span>
          ) : (
            <span className="size-5 shrink-0 rounded-full border-2 border-border" aria-hidden />
          )
        }
        className={cn(
          'min-h-11 transition-colors duration-[var(--duration-slow)]',
          got && 'opacity-[0.46]',
          flash && 'bg-primary/13'
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
        <div className="flex flex-wrap items-center gap-1.5 border-b border-border py-2">
          <span className="text-xs-body text-muted-foreground">Which aisle?</span>
          {CORRECTABLE_AISLES.map((aisle) => (
            <Chip
              key={aisle}
              selected={false}
              onClick={() => onCorrect(item, aisle)}
              className="px-2.5 py-0.5 text-xs-body"
            >
              {aisle}
            </Chip>
          ))}
          <Chip
            selected={false}
            onClick={() => onCorrect(item, 'Other')}
            className="border-dashed px-2.5 py-0.5 text-xs-body text-muted-foreground"
          >
            Leave it
          </Chip>
        </div>
      )}
    </>
  )
}
