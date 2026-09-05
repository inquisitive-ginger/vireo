import { useState } from 'react'
import { ListX, MoreHorizontal, Trash2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger, cn } from '@family-os/ui'

export type ClearScope = 'checked' | 'all'

export interface ClearListMenuProps {
  /** What is in the cart. It is not in the label — it is the whole of the
      confirmation — but it is still what decides whether the verb appears: with
      nothing checked there is nothing for it to remove. */
  got: number
  /** Everything on the list — what `all` would take. */
  total: number
  onClear: (scope: ClearScope) => void
}

/* A paper list gets recycled until the next time (Zach). Two verbs, both hard
   deletes: `checked` recycles — what was in the cart stops existing and has to be
   re-originated, which is what makes it a list and not a receipt — and `all`
   throws it away mid-trip.

   It rides the sticky `{list} · {n} left` line rather than sitting beside the
   destination pills, so it stays reachable while scrolling a long list: the
   moment you want to bin a list is the moment you are at the bottom of one.

   CONFIRMATION IS TWO-STEP AND INLINE, never a dialog — the same shape as the
   row's reveal-then-tap, where the control becomes its own confirmation. There is
   no undo (hard delete, ADR 073 §4), so the confirm names the COUNT: that number
   is the whole warning, and a dialog would only add a tap to reading it. */
export function ClearListMenu({ got, total, onClear }: ClearListMenuProps) {
  const [open, setOpen] = useState(false)
  const [confirming, setConfirming] = useState<ClearScope | null>(null)

  function close() {
    setOpen(false)
    setConfirming(null)
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        // A reopen never lands mid-confirmation.
        if (!next) setConfirming(null)
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="What to do with this list"
          className="min-h-touch -my-2 flex w-touch shrink-0 cursor-pointer items-center justify-center rounded-panel text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <MoreHorizontal size={20} aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-1.5">
        {/* Least to most destructive, and the destructive one last and in
            `--error` — the same order the row's sheet runs in. */}
        {got > 0 && (
          <ClearAction
            /* `ListX` over the `Recycle` this first shipped with: the recycling
               metaphor does not survive contact with a list of checkmarks, and
               both of these are hard deletes — an icon promising the items go
               somewhere retrievable would be a lie. */
            icon={ListX}
            /* "Clear" reads as UNCHECK on a surface whose items carry
               checkmarks. `Remove` is the verb the row's own sheet already uses
               (`Remove from the list`), so the two now agree. The count is not in
               the label; it does its work in the confirmation. */
            label="Remove checked items"
            confirm={`Sure? This removes ${got}`}
            active={confirming === 'checked'}
            onArm={() => setConfirming('checked')}
            onFire={() => {
              close()
              onClear('checked')
            }}
          />
        )}
        <ClearAction
          destructive
          // The house's established destructive mark.
          icon={Trash2}
          label="Throw the list away"
          confirm={`Sure? This removes ${total}`}
          active={confirming === 'all'}
          onArm={() => setConfirming('all')}
          onFire={() => {
            close()
            onClear('all')
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

/* Armed by the first tap, fired by the second. Anything else — the other verb,
   Escape, a tap outside — disarms it, which is why the arm state lives on the
   menu rather than in here. */
function ClearAction({
  icon: Icon,
  label,
  confirm,
  active,
  destructive,
  onArm,
  onFire,
}: {
  icon: LucideIcon
  label: string
  confirm: string
  active: boolean
  destructive?: boolean
  onArm: () => void
  onFire: () => void
}) {
  return (
    <button
      type="button"
      onClick={active ? onFire : onArm}
      className={cn(
        'min-h-touch text-body flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 text-left hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        destructive || active ? 'text-error' : 'text-foreground',
        active && 'font-semibold'
      )}
    >
      {/* The icon names the VERB, so it goes with the verb. A confirm line's whole
          job is the count, and a glyph adds nothing to a number. */}
      {!active && <Icon size={16} aria-hidden className="shrink-0" />}
      {active ? confirm : label}
    </button>
  )
}
