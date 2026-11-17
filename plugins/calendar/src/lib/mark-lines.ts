import type { DayMark, DayMarkLine } from '@family-os/platform/types'
import { localDateKey } from './grid'

export type MarkLineAction = 'claim' | 'swap' | 'clear' | 'restore'

export function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = String(minutes % 60).padStart(2, '0')
  return `${h % 12 || 12}:${m} ${h < 12 ? 'AM' : 'PM'}`
}

/** The line a mark's header names (D-087): today, the next one not yet past (the
 *  last once all have passed); a later day, its first. Cleared lines never count. */
export function headlineLine(mark: DayMark, now: Date): DayMarkLine | null {
  const live = (mark.lines ?? []).filter((l) => !l.cleared)
  if (live.length === 0) return null
  if (mark.date !== localDateKey(now)) return live[0]
  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  return live.find((l) => l.minutes >= nowMinutes) ?? live[live.length - 1]
}

export function hasOpenLine(mark: DayMark): boolean {
  return (mark.lines ?? []).some((l) => !l.cleared && l.ownerId === null)
}

/** What a line's change posts: claim takes it, swap hands it to the next owner. */
export function lineChange(
  line: DayMarkLine,
  action: MarkLineAction,
  owners: string[],
  viewerId: string
): { ownerId: string | null; cleared: boolean } {
  if (action === 'clear') return { ownerId: line.ownerId, cleared: true }
  if (action === 'restore') return { ownerId: line.ownerId, cleared: false }
  if (action === 'claim') return { ownerId: viewerId, cleared: false }
  const at = owners.indexOf(line.ownerId ?? '')
  return { ownerId: owners[(at + 1) % owners.length] ?? null, cleared: false }
}
