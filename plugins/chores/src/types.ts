export type TaskStatus = 'pending' | 'completed'

export type RoutineKind = 'days' | 'ongoing'

/** The rule a routine-spawned task carries for its row language ("↻ Mon & Thu",
    "back tomorrow"). Rule truth lives on the routine; the task mirrors the other
    fields at spawn. */
export interface TaskRoutineRef {
  kind: RoutineKind
  repeatDays: number[]
}

export interface ChoreTask {
  id: string
  title: string
  description: string | null
  /** Null = up for grabs: the task belongs to the household (Hearth treatment)
      until a member claims it. */
  assigneeId: string | null
  assigneeName: string | null
  /** The assignee's photo, or null for the tinted-initials fallback (ADR 042).
      The avatar carries the face; the row's spine carries the identity hue. */
  assigneeAvatarUrl: string | null
  /** The assignee's ASSIGNED identity hue (ADR 044), which the row spine paints in
      every state (ADR 043). Null only while a profile has none — `resolveHue` then
      falls back to the name hash. Never re-derive this from `assigneeName`: the hash
      collides, and a rename would silently re-colour the person. */
  assigneeHue: string | null
  status: TaskStatus
  dueDate: string | null
  routineId: string | null
  routine: TaskRoutineRef | null
  xpReward: number
  /** P-Bucks this chore pays on completion (ADR 052). Defaults to 0 — most chores earn a
      score only; a parent opts a chore in to paying. Credited off `chores.task.completed`
      by the rewards ledger (ADR 048). */
  coinReward: number
  /** Hold the payout for a parent's OK instead of crediting on completion
      (M4/3b). Only meaningful when `coinReward > 0`. */
  requiresApproval: boolean
  /** True once the task has been completed at least once (XP is awarded once, ever).
      A **pending** task with this set was reopened — sent back, not freshly assigned. */
  xpAwarded: boolean
  createdBy: string
  createdAt: string
  completedAt: string | null
}

/** A pending task that has been completed before was reopened by a parent — it reads
    as "redo", distinct from a freshly assigned one. */
export const isReopened = (task: ChoreTask): boolean => task.status === 'pending' && task.xpAwarded

/** A payout awaiting a parent's decision (`GET /rewards/payouts`). The chores board
    matches these to task rows by `sourceId` (`taskId@completedAt`), so chores keeps
    the instance-id knowledge and rewards stays plugin-agnostic (ADR 048). */
export interface PendingPayout {
  id: string
  profileId: string
  amount: number
  reason: string
  sourceType: string
  sourceId: string
  status: 'pending' | 'approved' | 'declined' | 'voided'
  decidedNote: string | null
  createdAt: string
}

export interface TasksResponse {
  tasks: ChoreTask[]
}
