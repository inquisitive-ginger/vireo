export type RunKind = 'dropoff' | 'pickup'

export type DriverFrom = { fromDate: string; driverId: string }

export type SchoolRunRecord = {
  id: string
  kidId: string
  weekday: number
  kind: RunKind
  place: string | null
  minutes: number
  startsOn: string
  endsOn: string | null
  drivers: DriverFrom[]
}

/** A run in the editor's week, with its driver that week. */
export type WeekRun = Omit<SchoolRunRecord, 'drivers'> & { driverId: string | null }

/** A run as it stands on one date. */
export type DayRun = Omit<SchoolRunRecord, 'drivers'> & {
  date: string
  driverId: string
  skipped: boolean
}

export const WEEKDAYS = [
  { weekday: 1, label: 'Monday' },
  { weekday: 2, label: 'Tuesday' },
  { weekday: 3, label: 'Wednesday' },
  { weekday: 4, label: 'Thursday' },
  { weekday: 5, label: 'Friday' },
] as const

const DAY_MS = 86_400_000

/** `date` is a household-local `YYYY-MM-DD`; read in UTC so no zone shifts it. */
export function weekdayOf(date: string): number {
  return new Date(`${date}T00:00:00Z`).getUTCDay()
}

export function addDays(date: string, days: number): string {
  return new Date(Date.parse(`${date}T00:00:00Z`) + days * DAY_MS).toISOString().slice(0, 10)
}

/** The date of `weekday` in the Monday-start week holding `date`. */
export function dateInWeek(date: string, weekday: number): string {
  const monday = addDays(date, -((weekdayOf(date) + 6) % 7))
  return addDays(monday, weekday - 1)
}

export function dateKeys(from: string, to: string): string[] {
  const keys: string[] = []
  for (let d = from; d <= to; d = addDays(d, 1)) keys.push(d)
  return keys
}

/** Who drives on `date` (D-097): the latest change on or before it. */
export function driverOn(drivers: DriverFrom[], date: string): string | null {
  let found: DriverFrom | null = null
  for (const d of drivers) {
    if (d.fromDate <= date && (!found || d.fromDate > found.fromDate)) found = d
  }
  return found?.driverId ?? null
}

export function runsOn(date: string) {
  return (run: Pick<SchoolRunRecord, 'weekday' | 'startsOn' | 'endsOn'>) =>
    run.weekday === weekdayOf(date) && run.startsOn <= date && (!run.endsOn || date < run.endsOn)
}

/** The seeded week applied to one date (D-097, D-099). */
export function dayRuns(runs: SchoolRunRecord[], skips: Set<string>, date: string): DayRun[] {
  return runs
    .filter(runsOn(date))
    .map(({ drivers, ...run }) => ({
      ...run,
      date,
      driverId: driverOn(drivers, date) ?? '',
      skipped: skips.has(`${run.id}:${date}`),
    }))
    .sort((a, b) => a.minutes - b.minutes)
}

export function runWhat(run: Pick<SchoolRunRecord, 'kind' | 'place'>): string {
  const verb = run.kind === 'dropoff' ? 'Drop-off' : 'Pickup'
  return run.place ? `${verb} at ${run.place}` : verb
}

/** "Mom picks up Teddy", "Dad picks up Zoë at yarn club". */
export function runText(run: DayRun, names: Map<string, string>): string {
  const who = names.get(run.driverId) ?? 'Someone'
  const verb = run.kind === 'dropoff' ? 'drops off' : 'picks up'
  const kid = names.get(run.kidId) ?? 'a kid'
  return `${who} ${verb} ${kid}${run.place ? ` at ${run.place}` : ''}`
}

export function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`
}
