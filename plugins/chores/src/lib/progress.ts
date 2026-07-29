import type { ChoreTask } from '../types'
import { isToday } from './dates'

/** Today's progress for a taskee surface (the header line + bar).
 *
 * Scoped to today because chores are never archived: an all-time denominator
 * climbs toward 100% and stays there, so a kid with three chores left reads a
 * nearly-full bar. Same defect as the widget's "+N today" (auto-bug #73).
 *
 * `isCompleted` comes from the XP flight so an in-flight task still counts as
 * pending until it banks. A task completed in-session has no server `completedAt`
 * yet — a completion happening now is today by construction. */
export function taskeeProgress(
  tasks: ChoreTask[],
  isCompleted: (task: ChoreTask) => boolean
): { done: number; total: number; pct: number } {
  let done = 0
  let pending = 0
  for (const task of tasks) {
    if (!isCompleted(task)) pending += 1
    else if (task.completedAt === null || isToday(task.completedAt)) done += 1
  }
  const total = pending + done
  return { done, total, pct: total > 0 ? (done / total) * 100 : 100 }
}
