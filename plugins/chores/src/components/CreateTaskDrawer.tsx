import { useEffect, useState } from 'react'
import { CalendarDays, Star } from 'lucide-react'
import { Button, Drawer, Input, Label, identityColor } from '@family-os/ui'
import type { Profile } from '@family-os/platform/types'
import type { ChoreTask } from '../types'
import { GOLD, GOLD_INK, GOLD_TINT } from '../lib/gold'

const XP_PRESETS = [5, 10, 15, 20, 25]
const DEFAULT_XP = 10

export interface CreateTaskInput {
  title: string
  assigneeId: string
  xpReward: number
  dueDate: string | null
}

export interface CreateTaskDrawerProps {
  open: boolean
  onClose: () => void
  members: Profile[]
  /** Prefill the assignee (per-person "+ add" entry point). Ignored in edit mode. */
  prefillAssigneeId?: string | null
  /** When set, the drawer opens in edit mode: fields prefilled from this task,
      header "Edit task", CTA "Save changes". Absent → create mode. */
  editingTask?: ChoreTask | null
  onSubmit: (input: CreateTaskInput) => Promise<void> | void
}

/* The single create/edit surface (design §3) — a right Drawer (Radix Dialog).
   Create mode = blank (or assignee-prefilled); edit mode prefills from
   `editingTask` and swaps the header + CTA copy. Remove is a row-level action
   (settings → profiles pattern), not in this footer. Form controls use the
   shared Input/Label/Button; the assignee/reward toggle chips are bespoke (no
   toggle-group primitive in @family-os/ui yet). */
export function CreateTaskDrawer({
  open,
  onClose,
  members,
  prefillAssigneeId,
  editingTask,
  onSubmit,
}: CreateTaskDrawerProps) {
  const isEdit = Boolean(editingTask)
  const [title, setTitle] = useState('')
  const [assigneeId, setAssigneeId] = useState<string | null>(null)
  const [xp, setXp] = useState(DEFAULT_XP)
  const [dueDate, setDueDate] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Reset the form each time the drawer opens: prefill from the task in edit
  // mode, otherwise blank with any prefilled assignee.
  useEffect(() => {
    if (open) {
      setTitle(editingTask?.title ?? '')
      setAssigneeId(editingTask?.assigneeId ?? prefillAssigneeId ?? null)
      setXp(editingTask?.xpReward ?? DEFAULT_XP)
      setDueDate(editingTask?.dueDate ?? '')
      setSubmitting(false)
    }
  }, [open, prefillAssigneeId, editingTask])

  const canSubmit = title.trim().length > 0 && Boolean(assigneeId) && !submitting

  async function handleSubmit() {
    if (!canSubmit || !assigneeId) return
    setSubmitting(true)
    try {
      await onSubmit({
        title: title.trim(),
        assigneeId,
        xpReward: xp,
        dueDate: dueDate || null,
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Drawer open={open} onClose={onClose} title={isEdit ? 'Edit task' : 'New task'}>
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-6">
            <div>
              <FieldLabel htmlFor="chore-title">Task title</FieldLabel>
              <Input
                id="chore-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs doing?"
              />
            </div>

            <div>
              <FieldLabel>Assign to</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {members.map((m) => (
                  <AssigneeChip
                    key={m.id}
                    name={m.name}
                    selected={assigneeId === m.id}
                    onClick={() => setAssigneeId(m.id)}
                  />
                ))}
              </div>
            </div>

            <div>
              <FieldLabel>Reward</FieldLabel>
              <div className="flex flex-wrap items-center gap-2">
                {XP_PRESETS.map((v) => (
                  <XpChip key={v} value={v} selected={xp === v} onClick={() => setXp(v)} />
                ))}
                <span className="text-section-label ml-0.5" style={{ color: GOLD_INK }}>
                  XP
                </span>
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="chore-due" optional>
                Due date
              </FieldLabel>
              <div className="relative">
                <Input
                  id="chore-due"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  // Open the native picker on a click anywhere in the field, not just
                  // the calendar icon. (Proper themed picker deferred to the calendar
                  // module.) `showPicker` is recent — guard for older browsers.
                  onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker?.()}
                  // Strip every native affordance — Chrome's calendar button, the
                  // Android down-chevron, spin/clear buttons — and overlay one
                  // consistent calendar icon with proper right padding. `appearance-none`
                  // kills the chevron; `display:none` on the picker indicator removes
                  // the desktop calendar button (it occupies space when only faded).
                  className="cursor-pointer appearance-none pr-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-clear-button]:hidden [&::-webkit-inner-spin-button]:hidden"
                />
                <CalendarDays
                  size={16}
                  aria-hidden
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 border-t border-border p-6">
          <Button className="w-full" onClick={handleSubmit} disabled={!canSubmit}>
            {isEdit
              ? submitting
                ? 'Saving…'
                : 'Save changes'
              : submitting
                ? 'Assigning…'
                : 'Assign task'}
          </Button>
        </div>
      </div>
    </Drawer>
  )
}

function FieldLabel({
  children,
  optional,
  htmlFor,
}: {
  children: string
  optional?: boolean
  htmlFor?: string
}) {
  return (
    <Label htmlFor={htmlFor} className="mb-[7px] block">
      {children}
      {optional && <span className="font-normal opacity-65"> (optional)</span>}
    </Label>
  )
}

function AssigneeChip({
  name,
  selected,
  onClick,
}: {
  name: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-sm-token inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5"
      // border/background/text all carry the assignee's identity hue when selected.
      style={{
        border: `2px solid ${selected ? identityColor(name) : 'var(--border)'}`,
        background: selected ? identityColor(name, 'tint') : 'transparent',
        color: selected ? identityColor(name, 'ink') : 'var(--foreground)',
        fontWeight: selected ? 600 : 400,
      }}
    >
      <span className="size-2 shrink-0 rounded-full" style={{ background: identityColor(name) }} />
      {name}
    </button>
  )
}

function XpChip({
  value,
  selected,
  onClick,
}: {
  value: number
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-sm-token inline-flex min-w-[44px] cursor-pointer items-center justify-center gap-1 rounded-full px-3 py-1.5"
      // gold "treasure" fill when selected (gold isn't in the token set — see lib/gold).
      style={{
        border: `2px solid ${selected ? GOLD : 'var(--border)'}`,
        background: selected ? GOLD_TINT : 'transparent',
        color: selected ? GOLD_INK : 'var(--muted-foreground)',
        fontWeight: selected ? 700 : 500,
      }}
    >
      {selected && <Star size={12} fill={GOLD} style={{ color: GOLD }} />}
      {value}
    </button>
  )
}
