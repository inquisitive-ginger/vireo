import { Plus } from 'lucide-react'
import { identityColor } from '@family-os/ui'
import type { ChoreTask } from '../types'
import { isOverdue, dueLabel } from '../lib/dates'
import { XpPill } from './XpPill'

export interface AdminLane {
  assigneeId: string
  assigneeName: string
  tasks: ChoreTask[]
}

export interface AdminBoardProps {
  lanes: AdminLane[]
  /** Open the create drawer prefilled to this assignee. */
  onAddForAssignee: (assigneeId: string) => void
  /** Show the per-lane "+ add" affordance. False for read-only viewers (e.g. the
      family dashboard, which sees all tasks but cannot create). */
  showAdd?: boolean
}

/* By-assignee board — grouped by assignee. Identity hue does real work here (each
   person's lane). Status still wins on a row spine (done/overdue), falling back
   to identity. Gold = XP only. Sort: overdue → due-dated → undated → completed.
   Used by the tier-4 admin and the read-only family dashboard. */
export function AdminBoard({ lanes, onAddForAssignee, showAdd = true }: AdminBoardProps) {
  const maxLoad = Math.max(1, ...lanes.map(laneLoad))

  return (
    <div style={{ borderTop: '1px solid var(--border)' }}>
      {lanes.map((lane) => (
        <div key={lane.assigneeId}>
          <LaneHeader
            lane={lane}
            maxLoad={maxLoad}
            onAdd={showAdd ? () => onAddForAssignee(lane.assigneeId) : undefined}
          />
          {sortTasks(lane.tasks).map((task) => (
            <AdminRow key={task.id} task={task} />
          ))}
        </div>
      ))}
    </div>
  )
}

function laneLoad(lane: AdminLane): number {
  return lane.tasks.filter((t) => t.status !== 'completed').reduce((sum, t) => sum + t.xpReward, 0)
}

function pendingCount(lane: AdminLane): number {
  return lane.tasks.filter((t) => t.status !== 'completed').length
}

function overdueCount(lane: AdminLane): number {
  return lane.tasks.filter((t) => isOverdue(t.dueDate, t.status)).length
}

function sortTasks(tasks: ChoreTask[]): ChoreTask[] {
  const rank = (t: ChoreTask) =>
    t.status === 'completed' ? 3 : isOverdue(t.dueDate, t.status) ? 0 : t.dueDate ? 1 : 2
  return [...tasks].sort((a, b) => rank(a) - rank(b))
}

function LaneHeader({
  lane,
  maxLoad,
  onAdd,
}: {
  lane: AdminLane
  maxLoad: number
  onAdd?: () => void
}) {
  const hue = identityColor(lane.assigneeName)
  const tint = identityColor(lane.assigneeName, 'tint')
  const load = laneLoad(lane)
  const pending = pendingCount(lane)
  const overdue = overdueCount(lane)
  const pct = maxLoad > 0 ? Math.max(8, (load / maxLoad) * 100) : 0

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 18px',
        background: `linear-gradient(90deg, ${tint}, transparent 70%)`,
        borderTop: `2px solid ${hue}`,
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 16,
              fontWeight: 600,
              color: 'var(--foreground)',
            }}
          >
            {lane.assigneeName}
          </span>
          {overdue > 0 && (
            <span
              style={{
                background: 'var(--error)',
                color: 'var(--error-foreground)',
                borderRadius: 6,
                padding: '1px 6px',
                fontFamily: 'var(--font-ui)',
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              {overdue} overdue
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}>
          <div
            style={{
              flex: 1,
              maxWidth: 120,
              height: 5,
              borderRadius: 9999,
              background: 'var(--muted)',
            }}
          >
            <div
              style={{ width: `${pct}%`, height: '100%', borderRadius: 9999, background: hue }}
            />
          </div>
          <span
            style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--muted-foreground)' }}
          >
            {pending} task{pending === 1 ? '' : 's'} · {load} XP load
          </span>
        </div>
      </div>
      {onAdd && (
        <button
          onClick={onAdd}
          aria-label={`Add task for ${lane.assigneeName}`}
          title={`Add task for ${lane.assigneeName}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            borderRadius: 7,
            border: 'none',
            background: 'transparent',
            color: 'var(--muted-foreground)',
            cursor: 'pointer',
          }}
        >
          <Plus size={16} />
        </button>
      )}
    </div>
  )
}

function AdminRow({ task }: { task: ChoreTask }) {
  const done = task.status === 'completed'
  const overdue = isOverdue(task.dueDate, task.status)
  const spine = done
    ? 'var(--success)'
    : overdue
      ? 'var(--error)'
      : identityColor(task.assigneeName)
  const label = dueLabel(task.dueDate)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        minHeight: 54,
        padding: '0 18px',
        borderBottom: '1px solid var(--border)',
        opacity: done ? 0.55 : 1,
      }}
    >
      <span
        aria-hidden
        style={{
          width: 4,
          alignSelf: 'stretch',
          borderRadius: 2,
          background: spine,
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, minWidth: 0, padding: '9px 0' }}>
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 15,
            display: 'block',
            color: done ? 'var(--muted-foreground)' : 'var(--foreground)',
            textDecoration: done ? 'line-through' : 'none',
          }}
        >
          {task.title}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 12,
            color: overdue ? 'var(--error)' : 'var(--muted-foreground)',
          }}
        >
          {done ? 'Done' : overdue ? `Overdue · ${label}` : (label ?? 'No due date')}
        </span>
      </div>
      {!done && <XpPill value={task.xpReward} />}
    </div>
  )
}
