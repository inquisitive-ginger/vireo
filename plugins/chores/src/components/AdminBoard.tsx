import { useMemo, useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import {
  Badge,
  Coin,
  CoinValue,
  CompletionToggle,
  ItemCard,
  MemberGroupHeader,
  RowActions,
  Button,
  bucks,
  identityToken,
  resolveHue,
} from '@family-os/ui'
import { isReopened, type ChoreTask, type PendingPayout } from '../types'
import type { DecidePayoutInput } from '../pages/ChoresPage'
import { isOverdue, dueLabel } from '../lib/dates'
import { showCoinReward } from '../lib/flags'
import { payoutForTask, reopenClawback, type PayoutsByInstance } from '../lib/payouts'
import { XpPill } from './XpPill'
import { ReopenedBadge } from './ReopenedBadge'

export interface AdminLane {
  assigneeId: string
  assigneeName: string
  assigneeAvatarUrl: string | null
  /** The member's assigned hue (ADR 044) — null falls back to the name hash. */
  assigneeHue: string | null
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
  /** Un-complete a task (tier-4 only) — it resurfaces on the assignee's list. Used
      directly when reopening claws back no money. */
  onReopenTask?: (taskId: string) => Promise<unknown>
  /** Reopen a chore whose payout was already made (M4/3b) — the host confirms the
      clawback first (it takes the paid amount back, maybe overdrawing the kid).
      Omitted → a paid reopen falls back to `onReopenTask`. */
  onReopenPaidTask?: (task: ChoreTask, clawback: number) => void
  /** Edit a task (tier-4 only) — opens the drawer prefilled. Omitted = no edit action. */
  onEditTask?: (task: ChoreTask) => void
  /** Remove a task (tier-4 only) — host confirms then deletes. Omitted = no remove action. */
  onRemoveTask?: (task: ChoreTask) => void
  /** Drop completed rows from the board (design.md §1). A member left with nothing
      to show is dropped with them — a header over an empty list says nothing. */
  hideCompleted?: boolean
  /** Held/decided payouts keyed by completion instance (M4/3b). A completed row
      with a `pending` payout grows the approve/decline tray. Empty when the earn UI
      is flagged off. */
  payoutIndex?: PayoutsByInstance
  /** Approve/decline a held payout. Omitted → the tray renders read-only (it won't). */
  onDecidePayout?: (input: DecidePayoutInput) => Promise<unknown>
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
  onReopenPaidTask,
  onEditTask,
  onRemoveTask,
  hideCompleted = false,
  payoutIndex,
  onDecidePayout,
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
              hue={resolveHue(lane.assigneeName, lane.assigneeHue)}
              avatarUrl={lane.assigneeAvatarUrl}
              status={<LaneStatus lane={lane} />}
              count={pendingCount(lane) > 0 ? `${pendingCount(lane)} left` : undefined}
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
                  payout={payoutIndex && payoutForTask(task, payoutIndex)}
                  onDecidePayout={onDecidePayout}
                  onComplete={onCompleteTask}
                  onReopen={onReopenTask}
                  onReopenPaid={onReopenPaidTask}
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

/* The member's STATE, said in the state language — never in their identity hue.
   A header chip reading "1 overdue" in someone's pale teal, two lines above a row
   badge reading "Overdue" in red, is one fact wearing two colours. Same `Badge`
   component and the same red as the row; the same green as a completed row's check.

   This mirrors the widget's `PersonTile` (AllDoneChip / OverduePill / CountChip) —
   a language the widget settled in the Today Widget rework, and the board simply
   never adopted. Only the *count* is identity-tinted (see `MemberGroupHeader`),
   because a count of someone's things is a statement about them, not about a state. */
function LaneStatus({ lane }: { lane: AdminLane }) {
  const overdue = overdueCount(lane)
  if (overdue > 0) return <Badge variant="destructive">{overdue} overdue</Badge>
  if (pendingCount(lane) === 0) return <Badge variant="success">✓ all done</Badge>
  return null
}

function sortTasks(tasks: ChoreTask[]): ChoreTask[] {
  const rank = (t: ChoreTask) =>
    t.status === 'completed' ? 3 : isOverdue(t.dueDate, t.status) ? 0 : t.dueDate ? 1 : 2
  return [...tasks].sort((a, b) => rank(a) - rank(b))
}

/* Summed XP of a member's open tasks, against the busiest member — "is Teddy
   carrying the house this week?".

   A METER IS A COMPARISON. With nothing on the plate there is nothing to compare,
   so it does not render — it is not a quiet meter at zero, it is a meter claiming
   to have data. The first pass rendered "0 tasks · 0 XP load" under an empty bar,
   and the `Math.max(6, …)` floor even painted a 6% stub of the member's hue, so an
   all-done member appeared to be carrying a little something. The "✓ all done" chip
   already says everything true about them.

   The bar is the one place the member's hue appears in the header, since the avatar
   may hold a photo (ADR 042). */
function LoadMeter({ lane, maxLoad }: { lane: AdminLane; maxLoad: number }) {
  const pending = pendingCount(lane)
  if (pending === 0) return null

  const load = laneLoad(lane)
  // The 6% floor keeps a real-but-tiny load visible; it must never manufacture one,
  // so it only applies when there IS load.
  const pct = load > 0 && maxLoad > 0 ? Math.max(6, (load / maxLoad) * 100) : 0

  return (
    <div className="flex items-center gap-2">
      <div className="h-meter w-24 rounded-full bg-muted">
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: identityToken(resolveHue(lane.assigneeName, lane.assigneeHue)),
          }}
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
   strikethrough + green check of a completed row.

   A completed row whose payout is HELD (M4/3b) takes a distinct shape — see
   `HeldRow`: it grows a full-width payout tray and is NOT dimmed, because a held
   payout is asking the parent for a decision. */
function AdminRow({
  task,
  payout,
  onDecidePayout,
  onComplete,
  onReopen,
  onReopenPaid,
  onEdit,
  onRemove,
}: {
  task: ChoreTask
  payout?: PendingPayout
  onDecidePayout?: (input: DecidePayoutInput) => Promise<unknown>
  onComplete?: (taskId: string) => Promise<unknown>
  onReopen?: (taskId: string) => Promise<unknown>
  onReopenPaid?: (task: ChoreTask, clawback: number) => void
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
  // Done is locked: a completed chore is not edited in place. Reopen it (the check)
  // to make it editable again — which also voids a held payout, so re-completing
  // re-prices it. This kills the mismatch of editing terms behind a snapshotted
  // payout, and reads the same on every completed row, held or not.
  const canEdit = !done && !!onEdit

  function complete() {
    if (!onComplete) return
    setOverride('completed')
    onComplete(task.id).catch(() => setOverride(null))
  }
  function reopen() {
    // Reopening a paid chore claws the P-Bucks back (maybe overdrawing the kid), so it
    // goes through the host's confirm rather than firing optimistically here.
    const clawback = reopenClawback(task, payout)
    if (clawback > 0 && onReopenPaid) {
      onReopenPaid(task, clawback)
      return
    }
    if (!onReopen) return
    setOverride('pending')
    onReopen(task.id).catch(() => setOverride(null))
  }

  // A held payout only applies to a still-completed row (an optimistic reopen drops
  // the tray immediately). The tray needs the decide handler to do anything.
  if (done && payout?.status === 'pending' && onDecidePayout) {
    return (
      <HeldRow
        task={task}
        payout={payout}
        onDecidePayout={onDecidePayout}
        onReopen={onReopen ? reopen : undefined}
        onRemove={onRemove}
      />
    )
  }

  return (
    <ItemCard
      spine={identityToken(resolveHue(task.assigneeName, task.assigneeHue))}
      align="center"
      dimmed={done}
      className="transition-opacity duration-200"
      // Status takes the field: an overdue row is washed in error, mixed INTO the
      // card so it stays a card and not a coloured block (ADR 043).
      style={
        overdue ? { background: 'color-mix(in oklch, var(--error) 7%, var(--card))' } : undefined
      }
      onActivate={canEdit ? () => onEdit!(task) : undefined}
      activateLabel={canEdit ? `Edit “${task.title}”` : undefined}
      trailing={
        <>
          <RowActions
            label={task.title}
            noun="task"
            onEdit={canEdit ? () => onEdit!(task) : undefined}
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
        <div className="mt-0.5 flex flex-wrap items-center gap-2">
          {overdue && <Badge variant="destructive">Overdue</Badge>}
          {isReopened(task) && <ReopenedBadge />}
          <span
            className={`text-sm-token ${overdue ? 'font-semibold text-error' : 'text-muted-foreground'}`}
          >
            {done ? 'Done' : (label ?? 'No due date')}
          </span>
        </div>
      </div>
      {!done && showCoinReward(task.coinReward) && <CoinValue value={task.coinReward} size={16} />}
      {!done && <XpPill value={task.xpReward} />}
    </ItemCard>
  )
}

/* A completed row whose P-Bucks payout is HELD for the parent's OK (M4/3b, the approved
   "A1 — payout tray" direction). The card is a column: the completed title line with
   the reopen check (and remove) on the right, then a full-width brass tray at the
   base carrying the decision.

   Like every completed row, it is NOT editable in place — a held payout freezes the
   chore's terms, so the only ways to change it are to decide the tray or reopen
   (which voids the payout). Hence no pencil and no tap-to-edit; the reopen check is
   the way back. NOT dimmed — a held payout wants attention. The spine is the
   assignee's hue like every other row (ADR 043). */
function HeldRow({
  task,
  payout,
  onDecidePayout,
  onReopen,
  onRemove,
}: {
  task: ChoreTask
  payout: PendingPayout
  onDecidePayout: (input: DecidePayoutInput) => Promise<unknown>
  onReopen?: () => void
  onRemove?: (task: ChoreTask) => void
}) {
  // Optimistic decision — the tray shows "Paid"/"Declined" the instant it's tapped,
  // reverting if the request fails. A query refetch reconciles underneath.
  const [decided, setDecided] = useState<'approve' | 'decline' | null>(null)
  const [deciding, setDeciding] = useState(false)

  function decide(decision: 'approve' | 'decline') {
    setDecided(decision)
    setDeciding(true)
    onDecidePayout({ id: payout.id, decision })
      .catch(() => setDecided(null))
      .finally(() => setDeciding(false))
  }

  return (
    <ItemCard
      spine={identityToken(resolveHue(task.assigneeName, task.assigneeHue))}
      align="stretch"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <span className="text-card-title block truncate text-muted-foreground line-through">
              {task.title}
            </span>
            <div className="mt-0.5">
              <XpPill value={task.xpReward} earned />
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-0.5">
            <RowActions
              label={task.title}
              noun="task"
              onRemove={onRemove ? () => onRemove(task) : undefined}
            />
            {onReopen && (
              <div className="flex size-11 shrink-0 items-center justify-center">
                <CompletionToggle
                  checked
                  size={28}
                  onToggle={onReopen}
                  label={`Reopen “${task.title}” (mark not done)`}
                  title="Mark not done"
                />
              </div>
            )}
          </div>
        </div>
        <PayoutTray
          amount={payout.amount}
          decided={decided}
          deciding={deciding}
          onDecide={decide}
        />
      </div>
    </ItemCard>
  )
}

/* The held-payout tray — a full-width brass band at the base of a held row. The coin
   marks it as money, the amount lives in the Pay button so the parent reads the figure
   before committing (never "Pay" alone). Once decided it collapses to a quiet
   confirmation line, so a busy board doesn't keep a resolved payout shouting. */
function PayoutTray({
  amount,
  decided,
  deciding,
  onDecide,
}: {
  amount: number
  decided: 'approve' | 'decline' | null
  deciding: boolean
  onDecide: (decision: 'approve' | 'decline') => void
}) {
  const trayStyle = {
    background: 'color-mix(in oklch, var(--coin) 12%, var(--card))',
    borderColor: 'color-mix(in oklch, var(--coin) 42%, var(--card))',
  }

  if (decided) {
    return (
      <div
        className="relative z-20 flex items-center gap-2 rounded-card border px-3 py-2.5"
        style={trayStyle}
      >
        <Coin size={18} />
        <span className="text-sm-token font-semibold" style={{ color: 'var(--coin-ink)' }}>
          {decided === 'approve' ? `Paid ${bucks(amount)}` : 'Not paid'}
        </span>
      </div>
    )
  }

  return (
    <div
      className="relative z-20 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-card border py-2 pr-2 pl-3"
      style={trayStyle}
    >
      <Coin size={22} />
      <span className="text-sm-token flex-1 font-semibold" style={{ color: 'var(--coin-ink)' }}>
        Waiting on your OK
      </span>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          disabled={deciding}
          onClick={() => onDecide('approve')}
          className="font-bold text-[oklch(0.28_0.09_74)] shadow-[var(--shadow-card)] hover:brightness-95"
          style={{ background: 'var(--coin)' }}
        >
          Pay {bucks(amount)}
        </Button>
        <Button size="sm" variant="outline" disabled={deciding} onClick={() => onDecide('decline')}>
          Not yet
        </Button>
      </div>
    </div>
  )
}
