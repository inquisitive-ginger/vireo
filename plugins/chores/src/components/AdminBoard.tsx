import { useMemo, useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import {
  Badge,
  CompletionToggle,
  ItemCard,
  MemberGroupHeader,
  RowActions,
  Button,
  identityColor,
} from '@family-os/ui'
import type { ChoreTask } from '../types'
import { isOverdue, dueLabel } from '../lib/dates'
import { XpPill } from './XpPill'

export interface AdminLane {
  assigneeId: string
  assigneeName: string
  assigneeAvatarUrl: string | null
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
  /** Drop completed rows from the board (design.md §1). A member left with nothing
      to show is dropped with them — a header over an empty list says nothing. */
  hideCompleted?: boolean
}

/* The by-assignee admin board.
 *
 * IDENTITY TAKES THE EDGE; STATUS TAKES THE FIELD (ADR 043). Every row is an
 * `ItemCard` whose spine is its assignee's hue — the same grammar the feed, the
 * calendar agenda, and the Activities roster already use, so a row says whose it
 * is on its own, wherever it ends up. Status is carried by the row's SURFACE
 * instead: an overdue wash, the Overdue badge and red due text, and dim +
 * strikethrough + a green check when done.
 *
 * This reverses the original board, where the spine rendered green when done, red
 * when overdue, and *otherwise* the assignee's hue — one 4px element answering a
 * different question depending on state — while identity was shouted separately as
 * a full-width tint gradient across each group header. Status was already stated
 * three other ways on every row; identity was stated nowhere the eye actually
 * lands. See ADR 043.
 *
 * Gold = XP only. Sort: overdue → due-dated → undated → completed last.
 * Used by the tier-4 admin and the read-only family dashboard.
 */
export function AdminBoard({
  lanes,
  onAddForAssignee,
  showAdd = true,
  onCompleteTask,
  onReopenTask,
  onEditTask,
  onRemoveTask,
  hideCompleted = false,
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
    <div className="flex flex-col gap-7">
      {orderedLanes.map(({ lane, tasks }) => {
        const visible = hideCompleted ? tasks.filter((t) => t.status !== 'completed') : tasks
        // Hiding completed can empty a member out entirely. Don't leave a header
        // standing over nothing.
        if (visible.length === 0) return null

        return (
          <section key={lane.assigneeId} className="flex flex-col gap-3">
            <MemberGroupHeader
              name={lane.assigneeName}
              avatarUrl={lane.assigneeAvatarUrl}
              badge={laneBadge(lane)}
              load={<LoadMeter lane={lane} maxLoad={maxLoad} />}
              action={
                showAdd ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                    onClick={() => onAddForAssignee(lane.assigneeId)}
                  >
                    <Plus className="mr-1 size-4" /> Add
                  </Button>
                ) : undefined
              }
            />
            <div className="flex flex-col gap-2">
              {visible.map((task) => (
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
          </section>
        )
      })}
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

/** The count beside the name — an urgent member says so here, before you reach
    their rows. */
function laneBadge(lane: AdminLane): string {
  const overdue = overdueCount(lane)
  if (overdue > 0) return `${overdue} overdue`
  const pending = pendingCount(lane)
  return pending === 0 ? 'all done' : `${pending} left`
}

function sortTasks(tasks: ChoreTask[]): ChoreTask[] {
  const rank = (t: ChoreTask) =>
    t.status === 'completed' ? 3 : isOverdue(t.dueDate, t.status) ? 0 : t.dueDate ? 1 : 2
  return [...tasks].sort((a, b) => rank(a) - rank(b))
}

/** Summed XP of a member's open tasks, against the busiest member — "is Teddy
    carrying the house this week?". The bar is the one place the member's hue
    appears in the header, since the avatar may hold a photo (ADR 042). */
function LoadMeter({ lane, maxLoad }: { lane: AdminLane; maxLoad: number }) {
  const load = laneLoad(lane)
  const pending = pendingCount(lane)
  const pct = maxLoad > 0 ? Math.max(6, (load / maxLoad) * 100) : 0

  return (
    <div className="flex items-center gap-2">
      <div className="h-meter w-24 rounded-full bg-muted">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: identityColor(lane.assigneeName) }}
        />
      </div>
      <span className="text-xs-token text-muted-foreground">
        {pending} task{pending === 1 ? '' : 's'} · {load} XP load
      </span>
    </div>
  )
}

/* A task row. The spine is the assignee's hue — always, in every state. Status is
   the row's field: the overdue wash, the badge, the red due text, and the dim +
   strikethrough + green check of a completed row. */
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
    <ItemCard
      spine={identityColor(task.assigneeName)}
      align="center"
      dimmed={done}
      className="transition-opacity duration-200"
      // Status takes the field: an overdue row is washed in error, mixed INTO the
      // card so it stays a card and not a coloured block (ADR 043).
      style={
        overdue ? { background: 'color-mix(in oklch, var(--error) 7%, var(--card))' } : undefined
      }
      onActivate={onEdit ? () => onEdit(task) : undefined}
      activateLabel={onEdit ? `Edit “${task.title}”` : undefined}
      trailing={
        <>
          <RowActions
            label={task.title}
            noun="task"
            onEdit={onEdit ? () => onEdit(task) : undefined}
            onRemove={onRemove ? () => onRemove(task) : undefined}
          />
          {/* Option A check-off (no flight — the board has no score plate). A completed
              row's check doubles as the tier-4 reopen control; read-only viewers
              (family dashboard) get a static check and no control on pending rows. */}
          {done || onComplete ? (
            <div className="flex size-11 shrink-0 items-center justify-center">
              <CompletionToggle
                checked={done}
                size={28}
                onToggle={done ? (onReopen ? reopen : undefined) : complete}
                label={
                  done ? `Reopen “${task.title}” (mark not done)` : `Mark “${task.title}” done`
                }
                title={done ? 'Mark not done' : undefined}
              />
            </div>
          ) : null}
        </>
      }
    >
      <div className="min-w-0 flex-1">
        <span
          className={`text-card-title block truncate ${done ? 'text-muted-foreground line-through' : 'text-foreground'}`}
        >
          {task.title}
        </span>
        <div className="mt-0.5 flex items-center gap-2">
          {overdue && <Badge variant="destructive">Overdue</Badge>}
          <span
            className={`text-sm-token ${overdue ? 'font-semibold text-error' : 'text-muted-foreground'}`}
          >
            {done ? 'Done' : (label ?? 'No due date')}
          </span>
        </div>
      </div>
      {!done && <XpPill value={task.xpReward} />}
    </ItemCard>
  )
}
