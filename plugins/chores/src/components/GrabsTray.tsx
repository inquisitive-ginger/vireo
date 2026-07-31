import { Button, CoinValue, FAMILY_HUE, identityToken } from '@family-os/ui'
import type { ChoreTask } from '../types'
import { routineStatusLabel } from '../lib/routines'
import { showCoinReward } from '../lib/flags'

/* The up-for-grabs offer board (design gate D6): the household's unclaimed chores,
   one step DOWN on the sunken plane (ADR 040) — a recess is deliberately
   non-identity, which is exactly what unowned means, and it gives the hearth hue
   the second channel ADR 044 requires. The header states "up for grabs" once so
   the rows stop repeating it; rows are compact and coin-first (they are bounties,
   not tasks), and the ↻ tail appears only on a days routine, where it varies.
   Claiming morphs the chore into an ordinary card in the list above. */
export function GrabsTray({
  tasks,
  onClaim,
}: {
  tasks: ChoreTask[]
  onClaim?: (taskId: string) => void
}) {
  if (tasks.length === 0) return null
  return (
    <section className="mt-6">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-section-label text-muted-foreground">Up for grabs</span>
        <span
          className="text-xs-token rounded-full px-2 py-0.5"
          style={{
            background: identityToken(FAMILY_HUE, 'tint'),
            color: identityToken(FAMILY_HUE, 'ink'),
          }}
        >
          {tasks.length}
        </span>
      </div>
      <div className="rounded-panel bg-surface-sunken p-2.5 shadow-[var(--shadow-inset)]">
        <div className="flex flex-col gap-2">
          {tasks.map((t) => (
            <div
              key={t.id}
              className="flex min-h-[46px] items-center gap-2.5 rounded-card bg-card px-3 py-2 shadow-[var(--shadow-card)]"
            >
              {showCoinReward(t.coinReward) && <CoinValue value={t.coinReward} size={16} />}
              <span className="text-base-token min-w-0 flex-1 truncate font-semibold text-foreground">
                {t.title}
              </span>
              {t.routine?.kind === 'days' && (
                <span className="text-xs-token shrink-0 text-muted-foreground">
                  <span aria-hidden>↻ </span>
                  {routineStatusLabel(t.routine)}
                </span>
              )}
              {onClaim && (
                <Button size="sm" variant="outline" onClick={() => onClaim(t.id)}>
                  I&rsquo;ll do it
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
