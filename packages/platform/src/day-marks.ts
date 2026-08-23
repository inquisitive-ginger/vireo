import type { AppAbility } from './ability'
import type { DayMark } from './types'

/** A read-time day-mark contributor (ADR 050). `action`/`subject` are the CASL
 *  pair ADR 066 requires at registration — no permissive default, so a provider
 *  that cannot name its own subject does not register. Loosely typed (`string`,
 *  not the app's closed `Actions`/`Subjects` union): the registry is a platform
 *  contract a plugin outside this app's own CASL types must be able to satisfy
 *  (M7 School's subject doesn't exist yet). The aggregator checks
 *  `ability.can(action, subject)` before ever calling `fetch`, and `fetch` still
 *  receives the caller's `ability` so it can apply its own row conditions
 *  (`accessibleBy()`) — the subject check is the floor, not a substitute. */
export type DayMarkProvider = {
  name: string
  action: string
  subject: string
  /** Returns at most one mark per day in `[from, to]` for what `ability` can see.
   *  `from`/`to` are passed through verbatim from the range query — the provider
   *  parses them itself. */
  fetch(from: string, to: string, ability: AppAbility): Promise<DayMark[]>
}

export type DayMarkRegistry = {
  register(provider: DayMarkProvider): void
  list(): DayMarkProvider[]
}

/** One registry per server process, decorated onto the Fastify instance by the
 *  calendar plugin (the surface that owns the read). Registration order is the
 *  tie-break when a day's marks exceed the two-per-cell cap (ADR 050) — the
 *  cheap, honest rule: first registered, first kept. */
export function createDayMarkRegistry(): DayMarkRegistry {
  const providers: DayMarkProvider[] = []
  return {
    register(provider) {
      providers.push(provider)
    },
    list() {
      return providers
    },
  }
}
