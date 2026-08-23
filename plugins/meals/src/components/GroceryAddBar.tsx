import { useRef, useState } from 'react'
import { ChevronDown, Plus } from 'lucide-react'
import { Button, Chip, Input, Popover, PopoverContent, PopoverTrigger, cn } from '@family-os/ui'
import type { Staple } from '../types'

export interface GroceryListOption {
  id: string
  name: string
}

export interface GroceryAddBarProps {
  staples: Staple[]
  errorMessage: string | null
  onAdd: (name: string) => Promise<void>
  onTapStaple: (staple: Staple) => void
  layout: 'wide' | 'narrow'
  /** Only the index needs this (handoff spec "Adding") — inside a list the
      destination is implied by the URL, so the picker is omitted there. */
  listPicker?: {
    options: GroceryListOption[]
    selectedId: string
    onSelect: (id: string) => void
  }
}

/** The persistent add composer (bottom on phone, top on the wall) — genuinely
    new, no existing `@family-os/ui` primitive covers it (handoff spec
    "Component mapping"). */
export function GroceryAddBar({
  staples,
  errorMessage,
  onAdd,
  onTapStaple,
  layout,
  listPicker,
}: GroceryAddBarProps) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const submit = async () => {
    const name = value.trim()
    if (!name) return
    try {
      await onAdd(name)
      setValue('')
    } catch {
      // The container already logged and surfaced the failure (errorMessage
      // below) — keeping the typed text here is the recovery: a family
      // member shouldn't have to retype "chicken thighs" after a blip.
    }
  }

  // Inline ghost completion (handoff spec "Typing"): the field itself shows
  // the rest of a matching staple's name, muted, in place — nothing appears,
  // nothing moves, unlike the rejected suggestion sheet / pill strip. Tab or
  // an end-of-field ArrowRight accepts it.
  const typedLower = value.trim().toLowerCase()
  const ghostMatch =
    typedLower.length > 0
      ? staples.find(
          (s) => s.name.toLowerCase().startsWith(typedLower) && s.name.toLowerCase() !== typedLower
        )
      : undefined
  const ghostRemainder = ghostMatch ? ghostMatch.name.slice(value.trimEnd().length) : ''

  const acceptGhost = (el: HTMLInputElement) => {
    if (!ghostMatch) return
    const full = ghostMatch.name
    el.value = full
    el.setSelectionRange(full.length, full.length)
    setValue(full)
  }

  const nameField = (
    <div className="relative flex-1">
      {ghostRemainder && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex h-9 items-center overflow-hidden rounded-md border border-transparent px-3 text-base-token"
        >
          <span className="invisible whitespace-pre">{value}</span>
          <span className="whitespace-pre text-muted-foreground">{ghostRemainder}</span>
        </div>
      )}
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Tab' || e.key === 'ArrowRight') {
            const el = e.currentTarget
            const atEnd = el.selectionStart === value.length && el.selectionEnd === value.length
            if (ghostMatch && atEnd) {
              e.preventDefault()
              acceptGhost(el)
            }
            return
          }
          if (e.key === 'Enter') void submit()
        }}
        placeholder="Add to the list…"
        aria-label="Add to the grocery list"
        className="relative bg-transparent"
      />
    </div>
  )

  // Staples at rest only (handoff spec rejects a strip that narrows while
  // typing — that's what ghost completion replaces). The index composer never
  // renders this: a staple is a shortcut for a store you're already in, and
  // on the index no store is implied yet (`listPicker` is index-only).
  const chipStrip = !listPicker && value === '' && staples.length > 0 && (
    <div className={cn('flex flex-wrap gap-1.5', layout === 'wide' ? 'max-w-md' : '')}>
      {staples.map((staple) => (
        <Chip key={staple.id} selected={false} onClick={() => onTapStaple(staple)}>
          {staple.name}
        </Chip>
      ))}
    </div>
  )

  // A compact trigger, not a row of chips — the index's subject is the list
  // of lists, and a full picker row above the composer is the proportion bug
  // this replaces (see GroceriesIndexPageView). One h-9 control matches the
  // field it sits beside.
  const selectedList = listPicker?.options.find((o) => o.id === listPicker.selectedId)
  const picker = listPicker && (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Choose which list to add to"
          className="flex h-9 shrink-0 items-center gap-1 rounded-md border border-input bg-background px-2.5 text-sm-token max-w-36"
        >
          <span className="truncate">{selectedList?.name ?? 'Add to…'}</span>
          <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-44 p-1">
        {listPicker.options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => listPicker.onSelect(option.id)}
            className={cn(
              'block w-full rounded-md px-2.5 py-1.5 text-left text-sm-token',
              option.id === listPicker.selectedId
                ? 'bg-primary/10 text-primary font-medium'
                : 'hover:bg-secondary/70'
            )}
          >
            {option.name}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  )

  const bar = (
    <div className="flex items-center gap-2">
      {picker}
      {nameField}
      <Button
        type="button"
        size="icon"
        aria-label="Add"
        onClick={() => void submit()}
        disabled={!value.trim()}
      >
        <Plus className="size-4" aria-hidden />
      </Button>
    </div>
  )

  const error = errorMessage && <p className="text-sm-token text-destructive">{errorMessage}</p>

  if (layout === 'wide') {
    return (
      <div className="flex flex-col gap-2 border-b border-border pb-4">
        <div className="flex items-center gap-4">
          <div className="max-w-sm flex-1">{bar}</div>
          {chipStrip}
        </div>
        {error}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 px-4">
      {chipStrip}
      {bar}
      {error}
    </div>
  )
}
