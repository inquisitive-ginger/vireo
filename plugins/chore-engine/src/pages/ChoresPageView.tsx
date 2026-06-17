import type { ReactNode } from 'react'
import type { ChoreTask } from '../types'
import { isOverdue } from '../lib/dates'
import { TaskCard } from '../components/TaskCard'
import { AdminBoard, type AdminLane } from '../components/AdminBoard'
import { ChoresEmptyState } from '../components/ChoresEmptyState'

export interface ChoresPageViewProps {
  tasks: ChoreTask[]
  /** Active profile tier — drives empty-state copy tone. */
  tier: number
  /** Sees the whole family's tasks → by-assignee board (tier 4 + family dashboard).
      Otherwise the taskee list of own tasks. */
  seesAllTasks: boolean
  /** Can create/assign (tier 4) — drives the per-lane add affordance + empty framing. */
  canManage: boolean
  /** Header action — already permission-gated by the container. */
  newTaskButton?: ReactNode
  /** Empty-state CTA — already permission-gated by the container (omitted if can() = false). */
  emptyAction?: ReactNode
  /** Open the create drawer prefilled to an assignee (admin per-lane "+ add"). */
  onAddForAssignee?: (assigneeId: string) => void
}

export function ChoresPageView({
  tasks,
  tier,
  seesAllTasks,
  canManage,
  newTaskButton,
  emptyAction,
  onAddForAssignee,
}: ChoresPageViewProps) {
  const done = tasks.filter((t) => t.status === 'completed').length
  const overdue = tasks.filter((t) => isOverdue(t.dueDate, t.status)).length
  const pending = tasks.length - done

  return (
    <div style={{ maxWidth: seesAllTasks ? 720 : 560, margin: '0 auto', padding: '28px 0 48px' }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 16,
          padding: '0 24px 14px',
        }}
      >
        <div>
          <h1 className="text-page-title" style={{ color: 'var(--foreground)', margin: 0 }}>
            Chores
          </h1>
          {/* Family pulse summary — counts only, no family XP (design §1). */}
          <p
            className="text-sm-token"
            style={{ color: 'var(--muted-foreground)', margin: '6px 0 0' }}
          >
            {summaryLine({ total: tasks.length, pending, done, overdue, seesAllTasks })}
          </p>
        </div>
        {/* Score plate (lifetime XP) lands with the XP Award story — leaving room. */}
        {newTaskButton}
      </header>

      {tasks.length === 0 ? (
        <ChoresEmptyState
          warmTone={tier <= 1 && !seesAllTasks}
          isAdmin={canManage}
          action={emptyAction}
        />
      ) : seesAllTasks ? (
        <AdminBoard
          lanes={toLanes(tasks)}
          showAdd={canManage}
          onAddForAssignee={onAddForAssignee ?? (() => {})}
        />
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            padding: '16px 24px 0',
            borderTop: '1px solid var(--border)',
          }}
        >
          {tasks.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </div>
      )}
    </div>
  )
}

function summaryLine({
  total,
  pending,
  done,
  overdue,
  seesAllTasks,
}: {
  total: number
  pending: number
  done: number
  overdue: number
  seesAllTasks: boolean
}): string {
  if (total === 0) return seesAllTasks ? 'No tasks assigned yet' : 'Nothing on your list'
  const parts = [`${pending} pending`]
  if (overdue > 0) parts.push(`${overdue} overdue`)
  parts.push(`${done} done`)
  return parts.join(' · ')
}

function toLanes(tasks: ChoreTask[]): AdminLane[] {
  const map = new Map<string, AdminLane>()
  for (const t of tasks) {
    let lane = map.get(t.assigneeId)
    if (!lane) {
      lane = { assigneeId: t.assigneeId, assigneeName: t.assigneeName, tasks: [] }
      map.set(t.assigneeId, lane)
    }
    lane.tasks.push(t)
  }
  return [...map.values()]
}
