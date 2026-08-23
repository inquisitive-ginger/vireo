import { Chip, ListRow, cn } from '@family-os/ui'
import type { GroceryItem } from '../types'
import { AISLES } from '../lib/grocery-filing'

const CORRECTABLE_AISLES = AISLES.filter((a) => a !== 'Other')

/* ADR 063/064 applied: `ListRow`, no identity chrome — no note line (design
   gate 2026-08-23; `item.note` still computes server-side for M5/7, nothing
   here renders it). Quantity goes in `children` beside the `min-w-0 flex-1`
   wrapper — `ListRow`'s `leading` slot needed no change (ADR 063's open
   question, answered by the gate). */
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
  return (
    <ListRow
      leading={
        <span className="size-6.5 shrink-0 rounded-full border-2 border-border" aria-hidden />
      }
      className={cn(
        'items-start py-2 transition-colors duration-[var(--duration-slow)]',
        flash && 'bg-primary/13'
      )}
    >
      <div className="min-w-0 flex-1 py-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-list-title truncate text-foreground">{item.name}</span>
          {item.quantity && (
            <span className="text-sm-token shrink-0 text-muted-foreground [font-variant-numeric:tabular-nums]">
              {item.quantity}
            </span>
          )}
        </div>
        {showCorrection && (
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
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
            <button
              type="button"
              onClick={() => onCorrect(item, 'Other')}
              className="text-xs-body text-muted-foreground underline-offset-2 hover:underline"
            >
              Leave it
            </button>
          </div>
        )}
      </div>
    </ListRow>
  )
}
