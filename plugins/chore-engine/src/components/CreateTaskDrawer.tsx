import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { Button, Drawer, identityColor } from '@family-os/ui'
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

/* The single create surface (design §3) — a right drawer. M2 = create only;
   edit + remove land with task-editing (out of scope here). */
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
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <FieldLabel>Task title</FieldLabel>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs doing?"
                style={{
                  width: '100%',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '10px 12px',
                  fontFamily: 'var(--font-ui)',
                  fontSize: 18,
                  color: 'var(--foreground)',
                  background: 'var(--background)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
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
                <span
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: GOLD_INK,
                    marginLeft: 2,
                  }}
                >
                  XP
                </span>
              </div>
            </div>

            <div>
              <FieldLabel optional>Due date</FieldLabel>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '10px 12px',
                  fontFamily: 'var(--font-ui)',
                  fontSize: 14,
                  color: 'var(--foreground)',
                  background: 'var(--background)',
                  outline: 'none',
                }}
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
          <Button onClick={handleSubmit} disabled={!canSubmit} style={{ width: '100%' }}>
            {submitting ? 'Assigning…' : 'Assign task'}
          </Button>
        </div>
      </div>
    </Drawer>
  )
}

function FieldLabel({ children, optional }: { children: string; optional?: boolean }) {
  return (
    <label
      style={{
        display: 'block',
        fontFamily: 'var(--font-ui)',
        fontSize: 13,
        color: 'var(--muted-foreground)',
        marginBottom: 7,
      }}
    >
      {children}
      {optional && <span style={{ fontWeight: 400, opacity: 0.65 }}> (optional)</span>}
    </label>
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
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 14px',
        borderRadius: 9999,
        border: `2px solid ${selected ? identityColor(name) : 'var(--border)'}`,
        background: selected ? identityColor(name, 'tint') : 'transparent',
        color: selected ? identityColor(name, 'ink') : 'var(--foreground)',
        fontFamily: 'var(--font-ui)',
        fontSize: 13,
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
      onClick={onClick}
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
        fontFamily: 'var(--font-ui)',
        fontSize: 13,
        fontWeight: selected ? 700 : 500,
        cursor: 'pointer',
      }}
    >
      {selected && <Star size={12} fill={GOLD} style={{ color: GOLD }} />}
      {value}
    </button>
  )
}
