import type { AppAbility, DayMarkProvider } from '@family-os/platform/server'
import type { DayMark } from '@family-os/platform/types'

// `ability.can` is typed against the app's closed Actions/Subjects union; a
// provider's action/subject are plain strings by contract (ADR 066 — the
// registry must outlive this app's own CASL types), so the call is narrowed
// through `can`'s own parameter types rather than importing that union here.
type CanArgs = Parameters<AppAbility['can']>

/** Merges every registered provider's marks for `[from, to]`, gated per ADR 066:
 *  a provider the caller cannot `can(action, subject)` is skipped entirely — its
 *  `fetch` never runs, so a mark the caller may not see never reaches the wire.
 *  Each provider is trusted for "at most one mark per day" (ADR 050) but not
 *  relied on for it — a second mark on the same day from one provider is
 *  dropped, first one wins. The two-per-day cap is applied LAST, after every
 *  provider's filtering, so a caller never loses a mark they can see to one they
 *  can't (ADR 066) — and the tie-break for a third mark is registration order. */
export async function aggregateDayMarks(
  providers: DayMarkProvider[],
  ability: AppAbility,
  from: string,
  to: string
): Promise<DayMark[]> {
  const byDate = new Map<string, DayMark[]>()

  for (const provider of providers) {
    if (!ability.can(provider.action as CanArgs[0], provider.subject as CanArgs[1])) continue

    const marks = await provider.fetch(from, to, ability)
    const seenDates = new Set<string>()
    for (const mark of marks) {
      if (seenDates.has(mark.date)) continue
      seenDates.add(mark.date)
      const existing = byDate.get(mark.date)
      if (existing) existing.push(mark)
      else byDate.set(mark.date, [mark])
    }
  }

  const result: DayMark[] = []
  for (const marks of byDate.values()) {
    result.push(...marks.slice(0, 2))
  }
  return result.sort((a, b) => a.date.localeCompare(b.date))
}
