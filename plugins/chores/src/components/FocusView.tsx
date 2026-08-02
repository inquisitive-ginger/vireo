import { useRef, type ReactNode } from 'react'
import { Check } from 'lucide-react'
import {
  Button,
  CoinValue,
  FAMILY_HUE,
  PageContainer,
  PageHeader,
  Spine,
  identityToken,
} from '@family-os/ui'
import { isReopened, type ChoreTask, type PendingPayout } from '../types'
import { isOverdue, dueLabel } from '../lib/dates'
import { REWARDS_UI_ENABLED, showCoinReward } from '../lib/flags'
import { kidPayoutView, payoutForTask, type PayoutsByInstance } from '../lib/payouts'
import { taskeeProgress } from '../lib/progress'
import { AllDone } from './AllDone'
import { CollapsibleSection } from './CollapsibleSection'
import { KidPayoutBadge } from './KidPayoutBadge'
import { ReopenedBadge } from './ReopenedBadge'
import { TaskReward, TaskStatusLine } from './TaskMeta'
import { ScorePlate } from './ScorePlate'
import { FlightChip } from './FlightChip'
import { useXpFlight } from '../lib/use-xp-flight'

export interface FocusViewProps {
  /** The active profile's own tasks, plus anything up for grabs. */
  tasks: ChoreTask[]
  /** Persist the completion. Rejects to revert the optimistic flight. Omitted in
      Storybook → the flight runs locally with no network. */
  onCompleteTask?: (taskId: string) => Promise<unknown>
  /** Claim an up-for-grabs task — its collapsed section's "I'll do it". */
  onClaimTask?: (taskId: string) => Promise<unknown>
  /** Persisted lifetime XP seed (GET /api/chores/xp). */
  initialXp?: number
  /** Held/decided payouts keyed by completion instance (M4/3b). */
  payoutIndex?: PayoutsByInstance
  /** The Today · Punch cards TabBar (M4/6) — rendered under the header. */
  tabBar?: ReactNode
}

/* Most urgent first — overdue, then earliest due, then undated (design §1, the
   hero "Next up" auto-surfaces the most urgent / overdue). */
function byUrgency(a: ChoreTask, b: ChoreTask): number {
  const oa = isOverdue(a.dueDate, a.status) ? 0 : 1
  const ob = isOverdue(b.dueDate, b.status) ? 0 : 1
  if (oa !== ob) return oa - ob
  if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate)
  if (a.dueDate) return -1
  if (b.dueDate) return 1
  return 0
}

/* The Focus taskee variant (design §1, "Spotlight" — gated 2026-06-20 Focus Mode).
   One obvious next action: a single hero "Next up" card with a big green Mark done,
   the rest collapsed to quiet "Coming up" / "Done" disclosure rows. Minimises
   executive-function load (younger / ADHD). Shares the XP flight engine with the
   Agency `TaskeeView` (`useXpFlight`): the hero's XP chip is the flight's launch
   point; on landing the plate banks and the next task promotes to hero. */
export function FocusView({
  tasks,
  onCompleteTask,
  onClaimTask,
  initialXp,
  payoutIndex,
  tabBar,
}: FocusViewProps) {
  // The hero and the progress meter speak about YOUR work only — an unclaimed
  // chore isn't yours yet, so up-for-grabs waits in its own collapsed section
  // (claiming moves it into the pending list, where it can promote to hero).
  const own = tasks.filter((t) => t.assigneeId !== null)
  const grabs = tasks.filter((t) => t.assigneeId === null && t.status === 'pending')

  const { plateRef, lifetime, flights, handleComplete, onFlightDone, effectiveStatus } =
    useXpFlight({ tasks: own, onCompleteTask, initialXp })

  // Hero promotes on landing: an in-flight task is still "not completed", so it
  // holds the hero slot through the flight (design §2 "the card does not change
  // during the flight") and only yields once it banks.
  const pending = own.filter((t) => effectiveStatus(t) !== 'completed').sort(byUrgency)
  const completed = own
    .filter((t) => effectiveStatus(t) === 'completed')
    .sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''))
  const [hero, ...rest] = pending

  const { done, total, pct } = taskeeProgress(own, (t) => effectiveStatus(t) === 'completed')

  return (
    <PageContainer width="list">
      <PageHeader title="Chores" action={<ScorePlate ref={plateRef} value={lifetime} />} />
      {tabBar}

      {/* Progress line + bar (design §1 taskee header — shared with Agency). */}
      <div className="mb-5">
        <p className="text-sm-token mb-2 text-muted-foreground">
          {done === total ? '🎉 All done today' : `${total - done} left · ${done} of ${total} done`}
        </p>
        <div className="h-meter overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-success transition-[width] duration-[var(--duration-slow)]"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {hero ? (
        <HeroCard
          key={hero.id}
          task={hero}
          inFlight={effectiveStatus(hero) === 'inFlight'}
          onComplete={handleComplete}
        />
      ) : (
        <AllDone />
      )}

      <CollapsibleSection
        label="Coming up"
        items={rest}
        renderItem={(t) => <MiniRow key={t.id} task={t} />}
      />
      <CollapsibleSection
        label="Up for grabs"
        items={grabs}
        renderItem={(t) => (
          <MiniRow
            key={t.id}
            task={t}
            onClaim={onClaimTask ? (taskId) => void onClaimTask(taskId) : undefined}
          />
        )}
      />
      <CollapsibleSection
        label="Done"
        items={completed}
        renderItem={(t) => (
          <MiniRow key={t.id} task={t} payout={payoutIndex && payoutForTask(t, payoutIndex)} />
        )}
      />

      {flights.map((flight) => (
        <FlightChip
          key={flight.taskId}
          from={flight.from}
          to={flight.to}
          value={flight.value}
          onDone={() => onFlightDone(flight)}
        />
      ))}
    </PageContainer>
  )
}

/* The hero "Next up" card. The XP chip is the flight's launch point (it lifts off
   on tap, mirroring the Agency badge); the big green Mark done is the tap target
   (design §2 "focus = green Mark done button"). */
function HeroCard({
  task,
  inFlight,
  onComplete,
}: {
  task: ChoreTask
  inFlight: boolean
  onComplete: (taskId: string, badgeRect: DOMRect) => void
}) {
  const overdue = isOverdue(task.dueDate, task.status)
  const chipRef = useRef<HTMLSpanElement>(null)

  function handleClick() {
    const rect = chipRef.current?.getBoundingClientRect()
    if (rect) onComplete(task.id, rect)
  }

  return (
    <div
      className="rounded-hero border bg-card p-6 shadow-[var(--shadow-card)]"
      style={{
        borderColor: overdue
          ? 'color-mix(in oklch, var(--error) 35%, var(--border))'
          : 'var(--border)',
      }}
    >
      <span className="text-section-label text-muted-foreground">Next up</span>
      <h2
        className="text-page-title mt-1.5 font-semibold text-foreground"
        style={{ lineHeight: 1.15 }}
      >
        {task.title}
      </h2>
      {/* Same meta system as the Agency card, but the hero has no completion circle
          for the reward to align to. State and reward each get their own line, both
          anchored at the card's left edge — so the reward's position never depends on
          whether a status line is present, which otherwise slides it sideways as one
          task completes and the next promotes in. */}
      <div className="mt-3 mb-5 flex flex-col items-start gap-2">
        <TaskStatusLine task={task} />
        <TaskReward ref={chipRef} task={task} done={false} inFlight={inFlight} payoutView={null} />
      </div>
      <Button
        type="button"
        onClick={inFlight ? undefined : handleClick}
        disabled={inFlight}
        className="h-auto w-full rounded-hero bg-success py-4 font-semibold text-success-foreground transition-transform hover:bg-success/90 active:scale-[0.98] disabled:opacity-60"
        aria-label={`Mark “${task.title}” done`}
      >
        <Check size={20} strokeWidth={3} />
        Mark done
      </Button>
    </div>
  )
}

function MiniRow({
  task,
  payout,
  onClaim,
}: {
  task: ChoreTask
  payout?: PendingPayout
  onClaim?: (taskId: string) => void
}) {
  const done = task.status === 'completed'
  const overdue = isOverdue(task.dueDate, task.status)
  const upForGrabs = !done && task.assigneeId === null
  const spine = done
    ? 'var(--success)'
    : upForGrabs
      ? identityToken(FAMILY_HUE)
      : overdue
        ? 'var(--error)'
        : 'var(--border)'
  const label = dueLabel(task.dueDate)
  const payoutView = done && REWARDS_UI_ENABLED ? kidPayoutView(task, payout) : null
  return (
    <div
      className="flex items-center gap-2.5 rounded-panel px-3 py-2.5"
      style={{ background: 'var(--muted)' }}
    >
      <Spine color={spine} />
      <span
        className={`text-sm-token min-w-0 flex-1 truncate ${done ? 'text-muted-foreground line-through' : 'text-foreground'}`}
      >
        {task.title}
      </span>
      {isReopened(task) && <ReopenedBadge />}
      {!done && label && (
        <span
          className={`text-xs-token shrink-0 ${overdue ? 'text-error' : 'text-muted-foreground'}`}
        >
          {label}
        </span>
      )}
      {/* Held / earned / declined P-Bucks takes the coin's slot on a done row (M4/3b). */}
      {payoutView ? (
        <KidPayoutBadge view={payoutView} />
      ) : (
        !done && showCoinReward(task.coinReward) && <CoinValue value={task.coinReward} size={14} />
      )}
      <span
        className={`text-xs-token shrink-0 font-bold ${done ? 'text-success' : 'text-muted-foreground'}`}
      >
        {done ? `✓ ${task.xpReward}` : task.xpReward} XP
      </span>
      {upForGrabs && onClaim && (
        <Button size="sm" variant="outline" onClick={() => onClaim(task.id)}>
          I&rsquo;ll do it
        </Button>
      )}
    </div>
  )
}
