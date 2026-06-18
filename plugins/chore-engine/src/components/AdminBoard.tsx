import { useMemo, useRef, useState } from 'react'
import { Check, Plus } from 'lucide-react'
import { Badge, Button, identityColor } from '@family-os/ui'
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
  /** Complete a task (tier-4 may complete anyone's — Option A). Omitted = read-only.
      Plain check-off; no XP flight (the board carries no score plate). */
  onCompleteTask?: (taskId: string) => Promise<unknown>
  /** Un-complete a task (tier-4 only) — it resurfaces on the assignee's list. */
  onReopenTask?: (taskId: string) => Promise<unknown>
}

/* By-assignee board — grouped by assignee. Identity hue does real work here (each
   person's lane). Status still wins on a row spine (done/overdue), falling back
   to identity. Gold = XP only. Sort: overdue → due-dated → undated → completed.
   Used by the tier-4 admin and the read-only family dashboard. */
export function AdminBoard({
  lanes,
  onAddForAssignee,
  showAdd = true,
  onCompleteTask,
  onReopenTask,
}: AdminBoardProps) {
  const maxLoad = Math.max(1, ...lanes.map(laneLoad))

  // Lock lane + within-lane row order on first sight. The initial sort
  // (overdue → due → undated → completed last) applies as rows first appear, but
  // completing/reopening a task must not resort live — it morphs in place. A
  // fresh page load re-sorts from scratch.
  const orderRef = useRef<{ lanes: string[]; tasksByLane: Record<string, string[]> }>({
    lanes: [],
    tasksByLane: {},
  })
  const orderedLanes = useMemo(() => {
    const o = orderRef.current
    for (const lane of lanes) {
      if (!o.lanes.includes(lane.assigneeId)) o.lanes.push(lane.assigneeId)
      const seen = (o.tasksByLane[lane.assigneeId] ??= [])
      for (const t of sortTasks(lane.tasks)) if (!seen.includes(t.id)) seen.push(t.id)
    }
    const laneById = new Map(lanes.map((l) => [l.assigneeId, l]))
    return o.lanes
      .map((id) => laneById.get(id))
      .filter((l): l is AdminLane => !!l)
      .map((lane) => ({
        lane,
        tasks: (o.tasksByLane[lane.assigneeId] ?? [])
          .map((tid) => lane.tasks.find((t) => t.id === tid))
          .filter((t): t is ChoreTask => !!t),
      }))
  }, [lanes])

  return (
    <div style={{ borderTop: '1px solid var(--border)' }}>
      {orderedLanes.map(({ lane, tasks }) => (
        <div key={lane.assigneeId}>
          <LaneHeader
            lane={lane}
            maxLoad={maxLoad}
            onAdd={showAdd ? () => onAddForAssignee(lane.assigneeId) : undefined}
          />
          {tasks.map((task) => (
            <AdminRow
              key={task.id}
              task={task}
              onComplete={onCompleteTask}
              onReopen={onReopenTask}
            />
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
          <span className="text-card-title" style={{ color: 'var(--foreground)' }}>
            {lane.assigneeName}
          </span>
          {overdue > 0 && <Badge variant="destructive">{overdue} overdue</Badge>}
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
          <span className="text-xs-token" style={{ color: 'var(--muted-foreground)' }}>
            {pending} task{pending === 1 ? '' : 's'} · {load} XP load
          </span>
        </div>
      </div>
      {onAdd && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onAdd}
          aria-label={`Add task for ${lane.assigneeName}`}
          title={`Add task for ${lane.assigneeName}`}
        >
          <Plus size={16} />
        </Button>
      )}
    </div>
  )
}

function AdminRow({
  task,
  onComplete,
  onReopen,
}: {
  task: ChoreTask
  onComplete?: (taskId: string) => Promise<unknown>
  onReopen?: (taskId: string) => Promise<unknown>
}) {
  // Optimistic per-row status — reverts if the mutation rejects. A query refetch
  // (on settle) reconciles to server truth underneath.
  const [override, setOverride] = useState<'completed' | 'pending' | null>(null)
  const status = override ?? task.status
  const done = status === 'completed'
  const overdue = !done && isOverdue(task.dueDate, task.status)
  const spine = done
    ? 'var(--success)'
    : overdue
      ? 'var(--error)'
      : identityColor(task.assigneeName)
  const label = dueLabel(task.dueDate)

  function complete() {
    if (!onComplete) return
    setOverride('completed')
    onComplete(task.id).catch(() => setOverride(null))
  }
  function reopen() {
    if (!onReopen) return
    setOverride('pending')
    onReopen(task.id).catch(() => setOverride(null))
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        minHeight: 54,
        padding: '0 14px 0 18px',
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
          className="text-base-token"
          style={{
            display: 'block',
            color: done ? 'var(--muted-foreground)' : 'var(--foreground)',
            textDecoration: done ? 'line-through' : 'none',
          }}
        >
          {task.title}
        </span>
        <span
          className="text-sm-token"
          style={{ color: overdue ? 'var(--error)' : 'var(--muted-foreground)' }}
        >
          {done ? 'Done' : overdue ? `Overdue · ${label}` : (label ?? 'No due date')}
        </span>
      </div>
      {!done && <XpPill value={task.xpReward} />}
      <AdminCompletionControl
        done={done}
        canComplete={!done && !!onComplete}
        canReopen={done && !!onReopen}
        title={task.title}
        onComplete={complete}
        onReopen={reopen}
      />
    </div>
  )
}

/* Plain admin check-off (Option A) — no XP flight; the board has no score plate.
   A completed row's check is itself the un-complete (reopen) control for tier 4,
   so a parent can reverse a completion and resurface it on the kid's list. */
function AdminCompletionControl({
  done,
  canComplete,
  canReopen,
  title,
  onComplete,
  onReopen,
}: {
  done: boolean
  canComplete: boolean
  canReopen: boolean
  title: string
  onComplete: () => void
  onReopen: () => void
}) {
  const circle = {
    display: 'grid',
    placeItems: 'center',
    width: 28,
    height: 28,
    borderRadius: '50%',
  } as const

  // Completed but read-only (e.g. family dashboard) → a static check, no button.
  if (done && !canReopen) {
    return (
      <span
        aria-hidden
        style={{ flexShrink: 0, ...circle, background: 'var(--success)', color: 'white' }}
      >
        <Check size={15} strokeWidth={3} />
      </span>
    )
  }
  if (done && canReopen) {
    return (
      <button
        type="button"
        onClick={onReopen}
        aria-label={`Reopen “${title}” (mark not done)`}
        title="Mark not done"
        style={{
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          padding: 8,
          margin: -8,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
        }}
      >
        <span style={{ ...circle, background: 'var(--success)', color: 'white' }}>
          <Check size={15} strokeWidth={3} />
        </span>
      </button>
    )
  }
  if (canComplete) {
    return (
      <button
        type="button"
        onClick={onComplete}
        aria-label={`Mark “${title}” done`}
        style={{
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          padding: 8,
          margin: -8,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          const c = e.currentTarget.firstElementChild as HTMLElement | null
          if (c) c.style.borderColor = 'var(--success)'
        }}
        onMouseLeave={(e) => {
          const c = e.currentTarget.firstElementChild as HTMLElement | null
          if (c) c.style.borderColor = 'var(--border)'
        }}
      >
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            border: '2.5px solid var(--border)',
            transition: 'border-color 160ms ease',
          }}
        />
      </button>
    )
  }
  // Pending + read-only → no control.
  return null
}
