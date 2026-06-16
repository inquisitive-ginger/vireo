import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Star, Trash2, X } from 'lucide-react'
import { Button } from '../components/button'
import { identityToken, type IdentityHue } from '../lib/identity'
import { PARENT_TASKS, ViewLabel } from './_shared'

// ════════════════════════════════════════════════════════════════════════════
// 3 · Create / assign surface — LOCKED: right drawer.
//
// One form, two modes: CREATE (global "New Task" or per-person "+ add" prefilled
// to that assignee) and EDIT (admin taps a task → opens prefilled, with Remove).
// Locked language: DM Sans, identity-hue assignee chips, gold = XP. M2 fields:
// title, assignee (required, single), optional due date, xp_reward (default 10).
// ════════════════════════════════════════════════════════════════════════════

const GOLD = 'oklch(0.74 0.13 80)'
const GOLD_TINT = 'oklch(0.95 0.045 86)'
const GOLD_INK = 'oklch(0.45 0.1 70)'

type Mode = 'create' | 'edit'

const ASSIGNEES: { name: string; hue: IdentityHue }[] = [
  { name: 'Maya', hue: 'terracotta' },
  { name: 'Zach', hue: 'teal' },
  { name: 'Emma', hue: 'sky' },
  { name: 'Luca', hue: 'sage' },
]

const XP_PRESETS = [5, 10, 15, 20, 25]

// ─── field primitives ────────────────────────────────────────────────────────

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
  hue,
  selected,
  onClick,
}: {
  name: string
  hue: IdentityHue
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
        border: `2px solid ${selected ? identityToken(hue) : 'var(--border)'}`,
        background: selected ? identityToken(hue, 'tint') : 'transparent',
        color: selected ? identityToken(hue, 'ink') : 'var(--foreground)',
        fontFamily: 'var(--font-ui)',
        fontSize: 13,
        fontWeight: selected ? 600 : 400,
        cursor: 'pointer',
        transition: 'all var(--duration-fast) var(--ease-out)',
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: identityToken(hue),
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
        transition: 'all var(--duration-fast) var(--ease-out)',
      }}
    >
      {selected && <Star size={12} fill={GOLD} style={{ color: GOLD }} />}
      {value}
    </button>
  )
}

// ─── the form (shared across both modes) ─────────────────────────────────────

function TaskForm({ mode, prefillAssignee }: { mode: Mode; prefillAssignee?: string }) {
  const [assignee, setAssignee] = useState<string | null>(
    mode === 'edit' ? 'Maya' : (prefillAssignee ?? null)
  )
  const [xp, setXp] = useState(mode === 'edit' ? 15 : 10)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <FieldLabel>Task title</FieldLabel>
        <input
          defaultValue={mode === 'edit' ? 'Take out the trash' : ''}
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
          {ASSIGNEES.map(({ name, hue }) => (
            <AssigneeChip
              key={name}
              name={name}
              hue={hue}
              selected={assignee === name}
              onClick={() => setAssignee(name)}
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
          defaultValue={mode === 'edit' ? '2026-06-17' : ''}
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
  )
}

function FormHeader({ mode, onClose }: { mode: Mode; onClose?: () => void }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 24px 16px',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 20,
          fontWeight: 600,
          lineHeight: 1.2,
          color: 'var(--foreground)',
        }}
      >
        {mode === 'edit' ? 'Edit task' : 'New task'}
      </span>
      <button
        onClick={onClose}
        aria-label="Close"
        style={{
          width: 32,
          height: 32,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          color: 'var(--muted-foreground)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 6,
        }}
      >
        <X size={18} />
      </button>
    </div>
  )
}

// Drawer footer — full-width primary CTA; Remove (edit only) sits below it.
function FormFooter({ mode }: { mode: Mode }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: 24,
        borderTop: '1px solid var(--border)',
      }}
    >
      <Button style={{ width: '100%' }}>{mode === 'edit' ? 'Save changes' : 'Assign task'}</Button>
      {mode === 'edit' && (
        <button
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--error)',
            fontFamily: 'var(--font-ui)',
            fontSize: 14,
            fontWeight: 500,
            padding: '6px 0',
          }}
        >
          <Trash2 size={14} />
          Remove task
        </button>
      )}
    </div>
  )
}

// ─── dimmed board behind the drawer ──────────────────────────────────────────

function DimmedBoard() {
  return (
    <div style={{ opacity: 0.4, pointerEvents: 'none' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          padding: '24px 24px 16px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 26,
            fontWeight: 600,
            color: 'var(--foreground)',
          }}
        >
          Chores
        </span>
      </div>
      <div style={{ borderTop: '1px solid var(--border)' }}>
        {PARENT_TASKS.slice(0, 4).map((t) => (
          <div
            key={t.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              minHeight: 56,
              padding: '0 24px',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <span
              style={{
                width: 4,
                alignSelf: 'stretch',
                borderRadius: 2,
                background: identityToken(t.hue),
              }}
            />
            <div style={{ flex: 1, padding: '10px 0' }}>
              <div
                style={{ fontFamily: 'var(--font-ui)', fontSize: 16, color: 'var(--foreground)' }}
              >
                {t.title}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: 12,
                  color: 'var(--muted-foreground)',
                }}
              >
                {t.assignee}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Drawer panel shell — used for all modes/entry points.
function Drawer({ mode, prefillAssignee }: { mode: Mode; prefillAssignee?: string }) {
  return (
    <div
      style={{
        width: 380,
        background: 'var(--card)',
        boxShadow: 'var(--shadow-raised)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <FormHeader mode={mode} />
      <div style={{ flex: 1, padding: '20px 24px' }}>
        <TaskForm mode={mode} prefillAssignee={prefillAssignee} />
      </div>
      <FormFooter mode={mode} />
    </div>
  )
}

function DrawerFrame({
  label,
  mode,
  prefillAssignee,
}: {
  label: string
  mode: Mode
  prefillAssignee?: string
}) {
  return (
    <div>
      <ViewLabel>{label}</ViewLabel>
      <div
        style={{
          display: 'flex',
          width: 880,
          minHeight: 540,
          borderRadius: 16,
          overflow: 'hidden',
          position: 'relative',
          border: '1px solid var(--border)',
          background: 'var(--background)',
        }}
      >
        <div style={{ flex: 1 }}>
          <DimmedBoard />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'oklch(0.18 0.04 50 / 0.22)' }} />
        <Drawer mode={mode} prefillAssignee={prefillAssignee} />
      </div>
    </div>
  )
}

// ─── meta ─────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Chores Playground/3 · Create Surface',
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj

// ─── right drawer (locked) ───────────────────────────────────────────────────

export const RightDrawer: Story = {
  name: 'Right drawer (locked)',
  render: () => (
    <div style={{ background: 'var(--background)', padding: 32 }}>
      <DrawerFrame label="Create · global (New Task)" mode="create" />
    </div>
  ),
}

// ─── modes — global / per-person prefill / edit (same drawer) ────────────────

export const FormModes: Story = {
  name: 'Modes — global / prefill / edit',
  render: () => (
    <div style={{ background: 'var(--background)', padding: 32 }}>
      <ViewLabel>One drawer, three entry points</ViewLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <DrawerFrame label="Create · global (New Task) — assignee unset" mode="create" />
        <DrawerFrame
          label="Create · per-person “+ add” — Zach prefilled"
          mode="create"
          prefillAssignee="Zach"
        />
        <DrawerFrame label="Edit · admin taps a task — prefilled + Remove" mode="edit" />
      </div>
    </div>
  ),
}
