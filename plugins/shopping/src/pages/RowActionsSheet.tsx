import { useEffect, useRef, useState } from 'react'
import { Check, ChevronLeft } from 'lucide-react'
import { SHOPPING_AISLES, ShoppingItemNameSchema, type ShoppingAisle } from '@family-os/schemas'
import { Button, Input, Sheet, cn } from '@family-os/ui'
import type { ShoppingItem } from '../types'

/** Read off the schema the create, the rename and the batch all share, never
    restated: a copy of 120 here is a second rule wearing the first one's clothes.
    Held at the field so a long word is stopped where the person can see it,
    rather than coming back as a 400 after the sheet has closed. */
const NAME_MAX = ShoppingItemNameSchema.maxLength ?? undefined

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
  onRename: (item: ShoppingItem, name: string) => void
  onRemove: (item: ShoppingItem) => void
  onRetract: (item: ShoppingItem) => void
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
  onRename,
  onRemove,
  onRetract,
}: RowActionsProps) {
  const [view, setView] = useState<'menu' | 'aisle' | 'rename'>('menu')
  const [draft, setDraft] = useState('')
  const renameRef = useRef<HTMLInputElement>(null)

  // A reopen must not land on the last row's rename panel with the last row's
  // word in the field.
  useEffect(() => {
    if (item) {
      setView('menu')
      setDraft(item.name)
    }
  }, [item])

  useEffect(() => {
    if (view === 'rename') renameRef.current?.focus()
  }, [view])

  if (!item) return null

  const retractable = canRetract && item.canRetract
  const trimmed = draft.trim()

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
      className="border-b border-border bg-surface-sunken px-4 pt-1 pb-4"
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
          {canManage && <SheetAction label="Rename" onSelect={() => setView('rename')} />}
          {retractable && (
            <SheetAction
              label="Take it back"
              onSelect={() => {
                onClose()
                onRetract(item)
              }}
            />
          )}
          {canManage && (
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

      {view === 'rename' && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (!trimmed) return
            onClose()
            if (trimmed !== item.name) onRename(item, trimmed)
          }}
          className="flex flex-col gap-3"
        >
          {/* A rename fixes a typo and nothing else: it does not re-file the
                aisle and does not teach the dictionary (D5, ADR 073 §4's
                asymmetry). */}
          <Input
            ref={renameRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            aria-label={`Rename “${item.name}”`}
            enterKeyHint="done"
            maxLength={NAME_MAX}
            className="min-h-touch"
          />
          <Button type="submit" disabled={!trimmed} className="self-start">
            Rename
          </Button>
        </form>
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
