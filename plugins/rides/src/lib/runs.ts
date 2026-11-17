export type RunKind = 'dropoff' | 'pickup'

export type SchoolRun = {
  id: string
  kidId: string
  weekday: number
  kind: RunKind
  place: string | null
  minutes: number
  driverId: string | null
}

export type RunDayOverride = {
  runId: string
  date: string
  driverId: string | null
  cleared: boolean
}

export type DayRun = SchoolRun & { date: string; cleared: boolean }

export const WEEKDAYS = [
  { weekday: 1, label: 'Monday' },
  { weekday: 2, label: 'Tuesday' },
  { weekday: 3, label: 'Wednesday' },
  { weekday: 4, label: 'Thursday' },
  { weekday: 5, label: 'Friday' },
] as const

/** `date` is a household-local `YYYY-MM-DD`; read in UTC so no zone shifts it. */
export function weekdayOf(date: string): number {
  return new Date(`${date}T00:00:00Z`).getUTCDay()
}

export function dateKeys(from: string, to: string): string[] {
  const keys: string[] = []
  const end = new Date(`${to}T00:00:00Z`)
  for (let d = new Date(`${from}T00:00:00Z`); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    keys.push(d.toISOString().slice(0, 10))
  }
  return keys
}

/** The usual week applied to one date, with that date's changes (D-087, D-094). */
export function dayRuns(runs: SchoolRun[], overrides: RunDayOverride[], date: string): DayRun[] {
  const weekday = weekdayOf(date)
  return runs
    .filter((run) => run.weekday === weekday)
    .map((run) => {
      const change = overrides.find((o) => o.runId === run.id && o.date === date)
      return change
        ? { ...run, date, driverId: change.driverId, cleared: change.cleared }
        : { ...run, date, cleared: false }
    })
    .sort((a, b) => a.minutes - b.minutes)
}

export function runWhat(run: Pick<SchoolRun, 'kind' | 'place'>): string {
  const verb = run.kind === 'dropoff' ? 'Drop-off' : 'Pickup'
  return run.place ? `${verb} at ${run.place}` : verb
}

/** "Hallie picks up Teddy", "Nobody yet picks up Zoë at yarn club". */
export function runText(run: DayRun, names: Map<string, string>): string {
  const who = run.driverId ? (names.get(run.driverId) ?? 'Someone') : 'Nobody yet'
  const verb = run.kind === 'dropoff' ? 'drops off' : 'picks up'
  const kid = names.get(run.kidId) ?? 'a kid'
  return `${who} ${verb} ${kid}${run.place ? ` at ${run.place}` : ''}`
}

export function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`
}
