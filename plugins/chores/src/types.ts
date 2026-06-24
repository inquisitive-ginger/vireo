export type TaskStatus = 'pending' | 'completed'

export interface ChoreTask {
  id: string
  title: string
  description: string | null
  assigneeId: string
  assigneeName: string
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
