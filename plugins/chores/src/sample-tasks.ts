import type { Profile } from '@family-os/platform/types'
import type { ChoreTask } from './types'
import { SAMPLE_AVATARS } from './sample-avatars'

function isoDay(offsetDays: number): string {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().slice(0, 10)
}

export const SAMPLE_MEMBERS: Profile[] = [
  { id: 'm-maya', name: 'Maya', tier: 1 },
  { id: 'm-zach', name: 'Zach', tier: 2 },
  { id: 'm-emma', name: 'Emma', tier: 3 },
  { id: 'm-luca', name: 'Luca', tier: 1 },
]

/* One taskee's list (all assigned to Maya) — used for the taskee stories. */
export const SAMPLE_TASKEE_TASKS: ChoreTask[] = [
  task('t1', 'Feed the dog', 'm-maya', 'Maya', { dueDate: isoDay(-1), xpReward: 10 }),
  task('t2', 'Make your bed', 'm-maya', 'Maya', { dueDate: isoDay(0), xpReward: 5 }),
  task('t3', 'Practice piano', 'm-maya', 'Maya', { dueDate: isoDay(1), xpReward: 15 }),
  task('t4', 'Read for 20 minutes', 'm-maya', 'Maya', { xpReward: 10 }),
  task('t5', 'Tidy the playroom', 'm-maya', 'Maya', { status: 'completed', xpReward: 10 }),
]

/* A whole-family board across four members — used for the admin story. */
export const SAMPLE_FAMILY_TASKS: ChoreTask[] = [
  task('f1', 'Feed the dog', 'm-maya', 'Maya', { dueDate: isoDay(-1), xpReward: 10 }),
  task('f2', 'Make your bed', 'm-maya', 'Maya', { dueDate: isoDay(0), xpReward: 5 }),
  task('f3', 'Empty dishwasher', 'm-zach', 'Zach', { dueDate: isoDay(0), xpReward: 15 }),
  task('f4', 'Take out recycling', 'm-zach', 'Zach', { xpReward: 10 }),
  task('f5', 'Mow the lawn', 'm-emma', 'Emma', { dueDate: isoDay(2), xpReward: 25 }),
  task('f6', 'Vacuum stairs', 'm-emma', 'Emma', { status: 'completed', xpReward: 15 }),
  task('f7', 'Water the plants', 'm-luca', 'Luca', { dueDate: isoDay(-2), xpReward: 5 }),
]

/* The same board with everyone's photo attached. The board must read identically:
   the spine says who, the face is just a face (ADR 042/043). */
export const SAMPLE_FAMILY_TASKS_WITH_PHOTOS: ChoreTask[] = SAMPLE_FAMILY_TASKS.map((t) => ({
  ...t,
  assigneeAvatarUrl: SAMPLE_AVATARS[t.assigneeName] ?? null,
}))

function task(
  id: string,
  title: string,
  assigneeId: string,
  assigneeName: string,
  opts: Partial<Pick<ChoreTask, 'status' | 'dueDate' | 'xpReward' | 'assigneeAvatarUrl'>> = {}
): ChoreTask {
  return {
    id,
    title,
    description: null,
    assigneeId,
    assigneeName,
    // Stories exercise the no-photo fallback by default — the tinted-initials
    // circle. The board's identity signal is the row spine either way (ADR 043).
    assigneeAvatarUrl: opts.assigneeAvatarUrl ?? null,
    status: opts.status ?? 'pending',
    dueDate: opts.dueDate ?? null,
    xpReward: opts.xpReward ?? 10,
    createdBy: 'm-parent',
    createdAt: new Date().toISOString(),
    completedAt: opts.status === 'completed' ? new Date().toISOString() : null,
  }
}
