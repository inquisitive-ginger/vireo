import { useMemo, useRef, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Badge, Button, CompletionToggle, identityColor } from '@family-os/ui'
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
  /** Edit a task (tier-4 only) — opens the drawer prefilled. Omitted = no edit action. */
  onEditTask?: (task: ChoreTask) => void
  /** Remove a task (tier-4 only) — host confirms then deletes. Omitted = no remove action. */
  onRemoveTask?: (task: ChoreTask) => void
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
  onEditTask,
  onRemoveTask,
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
    <div className="border-t border-border">
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
              onEdit={onEditTask}
              onRemove={onRemoveTask}
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
      className="flex items-center gap-3 border-b border-border px-[18px] py-3"
      // tint gradient + 2px identity top-border carry the lane's identity hue.
      style={{
        background: `linear-gradient(90deg, ${tint}, transparent 70%)`,
        borderTop: `2px solid ${hue}`,
      }}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-card-title text-foreground">{lane.assigneeName}</span>
          {overdue > 0 && <Badge variant="destructive">{overdue} overdue</Badge>}
        </div>
        <div className="mt-[5px] flex items-center gap-2">
          <div className="h-[5px] max-w-[120px] flex-1 rounded-full bg-muted">
            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: hue }} />
          </div>
          <span className="text-xs-token text-muted-foreground">
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
  onEdit,
  onRemove,
}: {
  task: ChoreTask
  onComplete?: (taskId: string) => Promise<unknown>
  onReopen?: (taskId: string) => Promise<unknown>
  onEdit?: (task: ChoreTask) => void
  onRemove?: (task: ChoreTask) => void
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
      className={`relative flex min-h-[54px] items-center gap-3 border-b border-border pr-1.5 pl-[18px] ${
        onEdit ? 'transition-colors hover:bg-secondary/40' : ''
      }`}
      style={{ opacity: done ? 0.55 : 1 }}
    >
      <span
        aria-hidden
        className="w-1 shrink-0 self-stretch rounded-sm"
        style={{ background: spine }}
      />
      <div className="min-w-0 flex-1 py-[9px]">
        <span
          className={`text-base-token block ${done ? 'text-muted-foreground line-through' : 'text-foreground'}`}
        >
          {task.title}
        </span>
        <span className={`text-sm-token ${overdue ? 'text-error' : 'text-muted-foreground'}`}>
          {done ? 'Done' : overdue ? `Overdue · ${label}` : (label ?? 'No due date')}
        </span>
      </div>
      {/* Tap-row-to-edit (design §3 "admin taps a task → drawer"). A stretched
          transparent button covers the row's passive area (spine, title, XP pill);
          the real controls below sit above it (z-20) so they stay clickable. This is
          the primary edit affordance on mobile, where the explicit pencil is hidden. */}
      {onEdit && (
        <button
          type="button"
          onClick={() => onEdit(task)}
          aria-label={`Edit “${task.title}”`}
          className="absolute inset-0 z-10 cursor-pointer rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
        />
      )}
      {!done && <XpPill value={task.xpReward} />}
      {/* Edit / remove — inline row actions (settings → profiles pattern), 44px touch
          targets. Above the stretched edit button (z-20). The pencil is redundant with
          tap-row-to-edit, so it only shows on sm+ (a visible desktop affordance);
          Remove stays inline at every width. Remove is confirmed by the host. */}
      {(onEdit || onRemove) && (
        <div className="relative z-20 flex shrink-0 items-center gap-0.5">
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(task)}
              aria-label={`Edit “${task.title}”`}
              title="Edit task"
              className="hidden h-11 w-11 sm:inline-flex"
            >
              <Pencil className="size-3.5" aria-hidden />
            </Button>
          )}
          {onRemove && (
            <Button
              variant="ghost-destructive"
              size="icon"
              onClick={() => onRemove(task)}
              aria-label={`Remove “${task.title}”`}
              title="Remove task"
              className="h-11 w-11"
            >
              <Trash2 className="size-3.5" aria-hidden />
            </Button>
          )}
        </div>
      )}
      {/* Option A check-off (no flight — the board has no score plate). A completed
          row's check doubles as the tier-4 reopen control; read-only viewers
          (family dashboard) get a static check and no control on pending rows.
          Kept above the stretched edit button (z-20) so it stays tappable + a
          touch-padded wrapper gives it a 44px target away from Remove. */}
      {done || onComplete ? (
        <div className="relative z-20 flex size-11 shrink-0 items-center justify-center">
          {done ? (
            <CompletionToggle
              checked
              size={28}
              onToggle={onReopen ? reopen : undefined}
              label={`Reopen “${task.title}” (mark not done)`}
              title="Mark not done"
            />
          ) : (
            <CompletionToggle
              checked={false}
              size={28}
              onToggle={complete}
              label={`Mark “${task.title}” done`}
            />
          )}
        </div>
      ) : null}
    </div>
  )
}
