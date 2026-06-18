import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { Button, Drawer, Input, Label, identityColor } from '@family-os/ui'
import type { FamilyMember } from '../types'
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
  members: FamilyMember[]
  /** Prefill the assignee (per-person "+ add" entry point). */
  prefillAssigneeId?: string | null
  onSubmit: (input: CreateTaskInput) => Promise<void> | void
}

/* The single create surface (design §3) — a right Drawer (Radix Dialog). M2 =
   create only; edit + remove land with task-editing (out of scope here).
   Form controls use the shared Input/Label/Button; the assignee/reward toggle
   chips are bespoke (no toggle-group primitive in @family-os/ui yet). */
export function CreateTaskDrawer({
  open,
  onClose,
  members,
  prefillAssigneeId,
  onSubmit,
}: CreateTaskDrawerProps) {
  const [title, setTitle] = useState('')
  const [assigneeId, setAssigneeId] = useState<string | null>(null)
  const [xp, setXp] = useState(DEFAULT_XP)
  const [dueDate, setDueDate] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Reset the form each time the drawer opens; apply any prefilled assignee.
  useEffect(() => {
    if (open) {
      setTitle('')
      setAssigneeId(prefillAssigneeId ?? null)
      setXp(DEFAULT_XP)
      setDueDate('')
      setSubmitting(false)
    }
  }, [open, prefillAssigneeId])

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
    <Drawer open={open} onClose={onClose} title="New task">
      <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
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
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
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
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                {XP_PRESETS.map((v) => (
                  <XpChip key={v} value={v} selected={xp === v} onClick={() => setXp(v)} />
                ))}
                <span className="text-section-label" style={{ color: GOLD_INK, marginLeft: 2 }}>
                  XP
                </span>
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="chore-due" optional>
                Due date
              </FieldLabel>
              <Input
                id="chore-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                // Open the native picker on a click anywhere in the field, not just
                // the calendar icon. (Proper themed picker deferred to the calendar
                // module.) `showPicker` is recent — guard for older browsers.
                onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker?.()}
                style={{ cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            padding: 24,
            borderTop: '1px solid var(--border)',
          }}
        >
          <Button className="w-full" onClick={handleSubmit} disabled={!canSubmit}>
            {submitting ? 'Assigning…' : 'Assign task'}
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
    <Label htmlFor={htmlFor} style={{ display: 'block', marginBottom: 7 }}>
      {children}
      {optional && <span style={{ fontWeight: 400, opacity: 0.65 }}> (optional)</span>}
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
      className="text-sm-token"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 14px',
        borderRadius: 9999,
        border: `2px solid ${selected ? identityColor(name) : 'var(--border)'}`,
        background: selected ? identityColor(name, 'tint') : 'transparent',
        color: selected ? identityColor(name, 'ink') : 'var(--foreground)',
        fontWeight: selected ? 600 : 400,
        cursor: 'pointer',
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: identityColor(name),
          flexShrink: 0,
        }}
      />
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
      className="text-sm-token"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        minWidth: 44,
        justifyContent: 'center',
        padding: '6px 12px',
        borderRadius: 9999,
        border: `2px solid ${selected ? GOLD : 'var(--border)'}`,
        background: selected ? GOLD_TINT : 'transparent',
        color: selected ? GOLD_INK : 'var(--muted-foreground)',
        fontWeight: selected ? 700 : 500,
        cursor: 'pointer',
      }}
    >
      {selected && <Star size={12} fill={GOLD} style={{ color: GOLD }} />}
      {value}
    </button>
  )
}
