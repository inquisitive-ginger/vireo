import { useEffect, useState } from 'react'
import { Check, ChevronLeft } from 'lucide-react'
import { SHOPPING_AISLES, type ShoppingAisle } from '@family-os/schemas'
import { Sheet, cn } from '@family-os/ui'
import type { ShoppingItem } from '../types'
import { removalVerb } from '../lib/removal-verb'

export interface RowActionsProps {
  /** Null closes it. The row it was opened from restores focus. */
  item: ShoppingItem | null
  onClose: () => void
  /** `shopping.item.file`, tier 4 — writes a FAMILY-WIDE override, which is why
      the panel keeps saying so out loud. */
  canFile: boolean
  /** `shopping.item.manage`, tier 4 — rename and remove, one key (D5). No new
      permission: "let a lower tier fix their own row" is a product decision
      (SH-05), and a kid fixing `mikk` takes it back and adds it again. */
  canManage: boolean
  /** `shopping.item.retract`, tier 1 — held by the profile. Whether THIS row
      qualifies is the server's `canRetract`, never a client clock and never a
      position in the Just-added strip (ADR 073 §2). */
  canRetract: boolean
  onRefile: (item: ShoppingItem, category: ShoppingAisle) => void
  /** Hands off to the ROW, which becomes the field (Zach, list pass). The panel
      hosts no input of its own at either width — one rename path, not two. */
  onStartRename: (item: ShoppingItem) => void
  onRemove: (item: ShoppingItem) => void
  onRetract: (item: ShoppingItem) => void
  /** The inline presentation carries the recess — it says "let into the list".
      The phone's sheet is already a raised surface over the page and renders on
      `--card`; `--surface-sunken` and `--shadow-inset` travel together and are
      card-interior only (ADR 040). The surface lives HERE rather than at the
      call site so a story cannot draw a panel the app does not have. */
  inline?: boolean
}

/* The right edge's destination (SH-09 panel 3/4): every verb this reader may use
   on this row, filtered by permission before it is drawn rather than after it is
   tapped. Verbs run least to most destructive, remove last and in `--error`.

   It is where `AisleCorrection`'s permanent trailing button went (SH-08). The
   correction itself is unchanged — including its warning copy, which is the only
   thing on either surface that says a re-file rewrites the filing of every future
   add of that name, for everyone.

   TWO PRESENTATIONS, one body. At tablet and up it renders INLINE, in the list
   flow, anchored to its own row and pushing the rows below it down (E1 panel 3,
   and Zach's call on the live pass) — a bottom sheet on a screen with this much
   room travels the whole height to answer a question about a row near the top.
   Below 768px the bottom sheet stays: a panel pushing rows on a phone moves the
   thing you are looking at off the screen. */
export function RowActionsPanel({
  item,
  onClose,
  canFile,
  canManage,
  canRetract,
  onRefile,
  onStartRename,
  onRemove,
  onRetract,
  inline = false,
}: RowActionsProps) {
  const [view, setView] = useState<'menu' | 'aisle'>('menu')

  // A reopen must not land on the last row's aisle picker.
  useEffect(() => {
    if (item) setView('menu')
  }, [item])

  if (!item) return null

  /* ONE removal verb, never two. `Take it back` and `Remove from the list` both
     hard-delete the row; a reader who holds `manage` gets the unconditional one
     and never sees a second button with the same outcome. The quick edge reads
     the same rule from the same place — deliberately, not by coincidence. */
  const verb = removalVerb(item, canManage, canRetract)

  return (
    <div
      // Escape closes it and hands focus back to the row (`RowSwipe` restores it
      // on the open→closed transition). Radix gives the bottom sheet this for
      // free; inline, it is ours to wire.
      onKeyDown={(e) => {
        if (e.key !== 'Escape') return
        e.stopPropagation()
        onClose()
      }}
      className={cn(
        'px-4 pt-1 pb-4',
        inline && 'border-b border-border bg-surface-sunken shadow-[var(--shadow-inset)]'
      )}
    >
      {view !== 'menu' && (
        <button
          type="button"
          onClick={() => setView('menu')}
          className="text-sm-token min-h-touch flex cursor-pointer items-center gap-1 font-medium text-primary"
        >
          <ChevronLeft size={16} aria-hidden />
          Back
        </button>
      )}

      <div className="pt-1 pb-3">
        <p className="text-card-title truncate text-foreground">{item.name}</p>
        {/* What the row IS, not who put it there (ADR 064) — the aisle is the
              one fact a verb here might change. */}
        <p className="text-sm-token text-muted-foreground">{item.category}</p>
      </div>

      {view === 'menu' && (
        <div className="flex flex-col">
          {canFile && (
            <SheetAction label="Move to another aisle" onSelect={() => setView('aisle')} />
          )}
          {/* Hands off to the row, which becomes the field. The panel hosts no
              input at either width — one rename path, not two. */}
          {canManage && (
            <SheetAction
              label="Rename"
              onSelect={() => {
                onClose()
                onStartRename(item)
              }}
            />
          )}
          {verb === 'retract' && (
            <SheetAction
              label="Take it back"
              onSelect={() => {
                onClose()
                onRetract(item)
              }}
            />
          )}
          {verb === 'remove' && (
            <SheetAction
              label="Remove from the list"
              destructive
              onSelect={() => {
                onClose()
                onRemove(item)
              }}
            />
          )}
        </div>
      )}

      {view === 'aisle' && (
        <div className="flex flex-col">
          <p className="text-sm-token mb-1.5 border-b border-border px-2 pt-1 pb-2 text-muted-foreground">
            Files every future <span className="font-medium text-foreground">{item.name}</span>{' '}
            here.
          </p>
          {SHOPPING_AISLES.map((aisle) => (
            <button
              key={aisle}
              type="button"
              onClick={() => {
                onClose()
                if (aisle !== item.category) onRefile(item, aisle)
              }}
              aria-current={aisle === item.category}
              className={cn(
                'min-h-touch text-body flex w-full cursor-pointer items-center justify-between rounded-lg px-2 text-left hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                aisle === item.category && 'font-semibold text-primary'
              )}
            >
              {aisle}
              {aisle === item.category && <Check size={14} aria-hidden />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* The narrow presentation. Same body, in the surface a phone wants: a panel that
   pushed rows on a phone would move the row being acted on off the screen. */
export function RowActionsSheet(props: RowActionsProps) {
  if (!props.item) return null
  return (
    <Sheet open onClose={props.onClose} title={`Actions for ${props.item.name}`}>
      <RowActionsPanel {...props} />
    </Sheet>
  )
}

function SheetAction({
  label,
  destructive,
  onSelect,
}: {
  label: string
  destructive?: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'min-h-touch text-body flex w-full cursor-pointer items-center rounded-lg px-2 text-left hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        destructive ? 'text-error' : 'text-foreground'
      )}
    >
      {label}
    </button>
  )
}
