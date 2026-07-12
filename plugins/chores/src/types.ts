export type TaskStatus = 'pending' | 'completed'

export interface ChoreTask {
  id: string
  title: string
  description: string | null
  assigneeId: string
  assigneeName: string
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
  xpReward: number
  createdBy: string
  createdAt: string
  completedAt: string | null
}

export interface TasksResponse {
  tasks: ChoreTask[]
}
