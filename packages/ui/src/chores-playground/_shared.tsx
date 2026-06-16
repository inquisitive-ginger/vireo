import type { ReactNode } from 'react'
import { CheckSquare } from 'lucide-react'
import { identityToken, type IdentityHue } from '../lib/identity'

export interface Task {
  id: string
  title: string
  assignee: string
  hue: IdentityHue
  dueDate?: string
  overdue?: boolean
  status: 'pending' | 'completed'
  completedLabel?: string
  xpReward: number
}

export const KID_TASKS: Task[] = [
  {
    id: '1',
    title: 'Take out the trash',
    assignee: 'Maya',
    hue: 'terracotta',
    dueDate: 'Tue Jun 17',
    status: 'pending',
    xpReward: 15,
  },
  {
    id: '2',
    title: 'Feed the dog',
    assignee: 'Maya',
    hue: 'terracotta',
    dueDate: 'Fri Jun 13',
    overdue: true,
    status: 'pending',
    xpReward: 10,
  },
  {
    id: '3',
    title: 'Fold laundry',
    assignee: 'Maya',
    hue: 'terracotta',
    status: 'completed',
    completedLabel: 'just now',
    xpReward: 20,
  },
]

export const PARENT_TASKS: Task[] = [
  {
    id: '1',
    title: 'Take out the trash',
    assignee: 'Maya',
    hue: 'terracotta',
    dueDate: 'Tue Jun 17',
    status: 'pending',
    xpReward: 15,
  },
  {
    id: '2',
    title: 'Feed the dog',
    assignee: 'Maya',
    hue: 'terracotta',
    dueDate: 'Fri Jun 13',
    overdue: true,
    status: 'pending',
    xpReward: 10,
  },
  {
    id: '3',
    title: 'Fold laundry',
    assignee: 'Maya',
    hue: 'terracotta',
    status: 'completed',
    completedLabel: '2m ago',
    xpReward: 20,
  },
  {
    id: '4',
    title: 'Pick up groceries',
    assignee: 'Zach',
    hue: 'teal',
    dueDate: 'Mon Jun 16',
    overdue: true,
    status: 'pending',
    xpReward: 20,
  },
  {
    id: '5',
    title: 'Set the table',
    assignee: 'Emma',
    hue: 'sky',
    dueDate: 'Today',
    status: 'pending',
    xpReward: 10,
  },
  {
    id: '6',
    title: 'Mow the lawn',
    assignee: 'Luca',
    hue: 'sage',
    dueDate: 'Sat Jun 14',
    overdue: true,
    status: 'pending',
    xpReward: 25,
  },
]

// 4px identity spine — the settled design-system pattern
export function IdentitySpine({ hue }: { hue: IdentityHue }) {
  return (
    <div
      className="w-1 shrink-0 self-stretch rounded-sm"
      style={{ background: identityToken(hue) }}
    />
  )
}

// Widget identity header: [icon] MODULE NAME
export function WidgetHeader() {
  return (
    <div className="flex items-center gap-1.5 px-4 pt-3 pb-2">
      <CheckSquare size={13} style={{ color: 'var(--accent)' }} />
      <span className="text-section-label" style={{ color: 'var(--accent)' }}>
        Chores
      </span>
    </div>
  )
}

export function WidgetDivider() {
  return <div className="h-px mx-4 bg-border" />
}

// Simulated page content area (no sidebar chrome)
export function MockPage({ children, width = 680 }: { children: ReactNode; width?: number }) {
  return (
    <div className="bg-background rounded-xl overflow-hidden" style={{ width }}>
      {children}
    </div>
  )
}

// Small uppercase label used to separate view panels
export function ViewLabel({ children }: { children: ReactNode }) {
  return (
    <p
      className="text-muted-foreground mb-3"
      style={{
        fontFamily: 'var(--font-ui)',
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}
    >
      {children}
    </p>
  )
}

// Reusable assignee profile chip for the create form
export function AssigneeChip({
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
          display: 'inline-block',
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

// The form fields shared across all create-surface options
export function TaskFormFields({
  selectedAssignee,
  onSelectAssignee,
}: {
  selectedAssignee: string
  onSelectAssignee: (name: string) => void
}) {
  const assignees: { name: string; hue: IdentityHue }[] = [
    { name: 'Maya', hue: 'terracotta' },
    { name: 'Zach', hue: 'teal' },
    { name: 'Emma', hue: 'sky' },
    { name: 'Luca', hue: 'sage' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Title */}
      <div>
        <label
          style={{
            display: 'block',
            fontFamily: 'var(--font-ui)',
            fontSize: 13,
            color: 'var(--muted-foreground)',
            marginBottom: 6,
          }}
        >
          Task title
        </label>
        <input
          defaultValue="Take out the trash"
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

      {/* Assign to */}
      <div>
        <label
          style={{
            display: 'block',
            fontFamily: 'var(--font-ui)',
            fontSize: 13,
            color: 'var(--muted-foreground)',
            marginBottom: 8,
          }}
        >
          Assign to
        </label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {assignees.map(({ name, hue }) => (
            <AssigneeChip
              key={name}
              name={name}
              hue={hue}
              selected={selectedAssignee === name}
              onClick={() => onSelectAssignee(name)}
            />
          ))}
        </div>
      </div>

      {/* Due date */}
      <div>
        <label
          style={{
            display: 'block',
            fontFamily: 'var(--font-ui)',
            fontSize: 13,
            color: 'var(--muted-foreground)',
            marginBottom: 6,
          }}
        >
          Due date <span style={{ fontWeight: 400, opacity: 0.65 }}>(optional)</span>
        </label>
        <input
          type="date"
          defaultValue="2026-06-17"
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

      {/* XP hint */}
      <div
        style={{
          borderRadius: 8,
          padding: '10px 14px',
          background: 'var(--muted)',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <span
          style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--muted-foreground)' }}
        >
          This task earns
        </span>
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--foreground)',
          }}
        >
          10
        </span>
        <span
          className="text-section-label"
          style={{ color: 'var(--muted-foreground)', letterSpacing: '0.1em' }}
        >
          XP
        </span>
      </div>
    </div>
  )
}
