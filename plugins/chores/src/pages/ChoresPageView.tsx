import type { ReactNode } from 'react'
import { PageHeader } from '@family-os/ui'
import type { ChoreTask } from '../types'
import { isOverdue } from '../lib/dates'
import { TaskeeView } from '../components/TaskeeView'
import { FocusView } from '../components/FocusView'
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
  /** Persist a completion (taskee flight + admin check-off). Rejects to revert. */
  onCompleteTask?: (taskId: string) => Promise<unknown>
  /** Un-complete a task (tier-4 only, admin board). Rejects to revert. */
  onReopenTask?: (taskId: string) => Promise<unknown>
  /** Edit a task (tier-4 only) — opens the drawer prefilled. */
  onEditTask?: (task: ChoreTask) => void
  /** Remove a task (tier-4 only) — container confirms then deletes. */
  onRemoveTask?: (task: ChoreTask) => void
  /** Persisted lifetime XP seed from GET /api/chores/xp (taskee view only). */
  initialXp?: number
  /** Effective Focus-mode setting (ADR 036). Taskee + on → the Focus variant;
      off → the Agency `TaskeeView`. Ignored by the admin/family board. */
  focusMode?: boolean
}

export function ChoresPageView({
  tasks,
  tier,
  seesAllTasks,
  canManage,
  newTaskButton,
  emptyAction,
  onAddForAssignee,
  onCompleteTask,
  onReopenTask,
  onEditTask,
  onRemoveTask,
  initialXp,
  focusMode,
}: ChoresPageViewProps) {
  // Taskee, non-empty → the dedicated taskee surface (owns its header, the
  // lifetime score plate, and the XP-flight completion — design §1/§2). The
  // Focus-mode setting picks the variant: Focus (hero "Next up") vs Agency (the
  // full status-encoded list); both share the flight engine (ADR 036).
  if (!seesAllTasks && tasks.length > 0) {
    const TaskeeSurface = focusMode ? FocusView : TaskeeView
    return <TaskeeSurface tasks={tasks} onCompleteTask={onCompleteTask} initialXp={initialXp} />
  }

  const done = tasks.filter((t) => t.status === 'completed').length
  const overdue = tasks.filter((t) => isOverdue(t.dueDate, t.status)).length
  const pending = tasks.length - done

  return (
    <div className="mx-auto max-w-[680px] px-6 pt-7 pb-12">
      {/* Family pulse summary — counts only, no family XP (design §1). When the
          board is empty the empty-state owns the primary CTA, so the header action
          is suppressed (avoids a duplicate "New Task" primary action). */}
      <PageHeader
        title="Chores"
        subtitle={summaryLine({ total: tasks.length, pending, done, overdue, seesAllTasks })}
        action={tasks.length > 0 ? newTaskButton : undefined}
      />

      {tasks.length === 0 ? (
        <ChoresEmptyState
          warmTone={tier <= 1 && !seesAllTasks}
          isAdmin={canManage}
          action={emptyAction}
        />
      ) : (
        <AdminBoard
          lanes={toLanes(tasks)}
          showAdd={canManage}
          onAddForAssignee={onAddForAssignee ?? (() => {})}
          onCompleteTask={canManage ? onCompleteTask : undefined}
          onReopenTask={canManage ? onReopenTask : undefined}
          onEditTask={canManage ? onEditTask : undefined}
          onRemoveTask={canManage ? onRemoveTask : undefined}
        />
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
