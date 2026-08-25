import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button, Input, cn } from '@family-os/ui'
import type { GroceryEntry } from '../types'

/* The overlay splits one word across two spans, so the kern pair straddling
   the join is never applied — but the same word, once accepted into the input,
   is a single run and IS kerned, so the remainder sits up to half a pixel off
   where the finished word will put it ("chicken breast" is the bad case; most
   pairs are 0). Shaping off on all three nodes makes the mirror, the ghost and
   the typed text measure identically. Scoped here, not on the `Input`
   primitive: no other field in the app is mirrored. */
const SHAPING = '[font-kerning:none] [font-variant-ligatures:none]'

export interface GroceryCompletionFieldProps {
  /** Most-recent-first, from `GET /groceries/entries`. */
  entries: GroceryEntry[]
  /** `row` — the index card's add region: a leading `+` badge on the card's own
      ground, no box. `field` — the per-list composer: a boxed input with a
      trailing `+`. Both are drawn in the dev-ready artifact (§1, §2). */
  variant: 'row' | 'field'
  placeholder: string
  ariaLabel: string
  autoFocus?: boolean
  onSubmit: (name: string) => Promise<void>
  /** Escape, or blurring an empty field — the index card collapses back to its
      at-rest shape. The per-list composer is persistent and passes nothing. */
  onCancel?: () => void
}

/* Inline ghost completion (handoff spec "Typing"): the remainder of a match
   renders muted inside the field itself, so nothing appears and nothing moves
   — the gate rejected the suggestion sheet and the pill strip for exactly that.
   Tab or an end-of-field ArrowRight accepts; Enter adds what is typed.

   The overlay is a mirror of the input, not a second control: an invisible copy
   of the typed text pushes the muted remainder to the caret. Its padding and
   type track the input's, which is why the variant owns both. */
export function GroceryCompletionField({
  entries,
  variant,
  placeholder,
  ariaLabel,
  autoFocus,
  onSubmit,
  onCancel,
}: GroceryCompletionFieldProps) {
  const [value, setValue] = useState('')

  const typedLower = value.toLowerCase()
  const match =
    typedLower.length > 0
      ? entries.find(
          (e) => e.name.toLowerCase().startsWith(typedLower) && e.name.toLowerCase() !== typedLower
        )
      : undefined
  const remainder = match ? match.name.slice(value.length) : ''

  const submit = async () => {
    const name = value.trim()
    if (!name) return
    try {
      await onSubmit(name)
      setValue('')
    } catch {
      // The container logged and surfaced the failure — keeping the typed text
      // is the recovery: nobody should retype "chicken thighs" after a blip.
    }
  }

  const boxed = variant === 'field'
  const padding = boxed ? 'px-3' : 'px-0'

  const field = (
    <div className="relative min-w-0 flex-1">
      {remainder && (
        <div
          aria-hidden
          className={cn(
            // A geometric twin of the input, borders included — `Input` carries a
            // 1px border inside its box, so an overlay without one starts the
            // remainder 1px left of the typed text it has to continue.
            'text-base-token pointer-events-none absolute inset-0 flex h-11 items-center overflow-hidden border border-transparent',
            SHAPING,
            padding
          )}
        >
          <span className={cn('invisible whitespace-pre', SHAPING)}>{value}</span>
          <span className={cn('whitespace-pre text-muted-foreground', SHAPING)}>{remainder}</span>
        </div>
      )}
      <Input
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Tab' || e.key === 'ArrowRight') {
            const el = e.currentTarget
            const atEnd = el.selectionStart === value.length && el.selectionEnd === value.length
            if (match && atEnd) {
              e.preventDefault()
              setValue(match.name)
            }
            return
          }
          if (e.key === 'Enter') void submit()
          if (e.key === 'Escape') onCancel?.()
        }}
        onBlur={() => {
          if (!value.trim()) onCancel?.()
        }}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className={cn(
          'relative h-11',
          SHAPING,
          boxed
            ? 'rounded-card border-border bg-card'
            : 'border-transparent bg-transparent px-0 shadow-none focus-visible:ring-0'
        )}
      />
    </div>
  )

  if (boxed) {
    return (
      <div className="flex items-center gap-2">
        {field}
        <Button
          type="button"
          size="icon"
          aria-label="Add"
          onClick={() => void submit()}
          disabled={!value.trim()}
          className="size-11 shrink-0 rounded-card"
        >
          <Plus className="size-5" aria-hidden />
        </Button>
      </div>
    )
  }

  // The badge leads the row and goes primary while the row is live (artifact
  // §1 "capturing") — the same control the at-rest row shows muted.
  return (
    <div className="flex items-center gap-2.5">
      <button
        type="button"
        aria-label="Add"
        onClick={() => void submit()}
        className="flex size-6 shrink-0 items-center justify-center rounded-card bg-primary text-primary-foreground"
      >
        <Plus className="size-3.5" aria-hidden />
      </button>
      {field}
    </div>
  )
}
