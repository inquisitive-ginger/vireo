import { useMemo } from 'react'
import { CURRENCY, Coin, Sheet, relativeDayLabel } from '@family-os/ui'
import { useAuth } from '@family-os/platform'
import { useLedger, useProfiles } from '../lib/hooks'
import type { LedgerEntry } from '../types'

/* "Where'd it go?" — the ledger read back in kid grammar (M4/5c). ADR 047's
   promise rendered: every number a kid might argue about, explained by the rows
   beneath it. A bottom sheet, not a tab — history is a question ("wait, why is
   it 35?"), not a place a kid hangs out; the sheet answers and gets out of the
   way. Rows come straight off `ledger_entries`: `reason` is already human text,
   earned rows are green and signed, spent rows plain, grouped by day. */

/** What kind of move a row is, told by its provenance — never by parsing `reason`. */
function glyphFor(entry: LedgerEntry): string {
  if (entry.sourceType === 'redemption' || entry.sourceType === 'refund') return '🎟️'
  if (entry.sourceType === 'chores.task.reversal') return '↩️'
  if (entry.sourceType.startsWith('chores.')) return '🧹'
  return '🎁'
}

export function HistorySheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { name } = useAuth()
  const ledger = useLedger(open)
  const profiles = useProfiles()

  const pages = ledger.data?.pages
  const balance = pages?.[0]?.balance ?? 0
  const entries = useMemo(() => (pages ?? []).flatMap((p) => p.entries), [pages])

  const nameById = useMemo(() => {
    const m = new Map<string, string>()
    for (const p of profiles.data ?? []) m.set(p.id, p.name.split(' ')[0] ?? p.name)
    return m
  }, [profiles.data])

  // Newest first off the API; bucket consecutive rows by local calendar day.
  const days = useMemo(() => {
    const groups: { label: string; key: string; rows: LedgerEntry[] }[] = []
    for (const e of entries) {
      const d = new Date(e.createdAt)
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
      const last = groups[groups.length - 1]
      if (last?.key === key) last.rows.push(e)
      else
        groups.push({
          key,
          label: relativeDayLabel(d, new Date(), { direction: 'backward' }).lead,
          rows: [e],
        })
    }
    return groups
  }, [entries])

  const firstName = name.split(' ')[0] ?? name

  return (
    <Sheet open={open} onClose={onClose} title={`${firstName}'s ${CURRENCY.short} story`}>
      <div className="px-5 pb-6 pt-2">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <Coin size={28} />
          <div className="text-card-title min-w-0 flex-1 truncate">
            {firstName}&rsquo;s {CURRENCY.short} story
          </div>
          <div className="flex items-baseline gap-1.5" style={{ color: 'var(--coin-ink)' }}>
            <span className="text-card-title tabular-nums">{balance}</span>
            <span className="text-xs-body text-muted-foreground">now</span>
          </div>
        </div>

        {ledger.isLoading ? (
          <div
            aria-busy="true"
            aria-label="Loading your story"
            className="flex flex-col gap-3 pt-4"
          >
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded-card bg-secondary" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <p className="text-sm-token pt-4 text-muted-foreground">
            Nothing yet — do a chore, and the story starts here.
          </p>
        ) : (
          <>
            {days.map((day) => (
              <section key={day.key} aria-label={day.label}>
                <div className="text-section-label pb-1.5 pt-4 text-muted-foreground">
                  {day.label}
                </div>
                <div className="flex flex-col gap-2.5">
                  {day.rows.map((e) => (
                    <HistoryRow key={e.id} entry={e} nameById={nameById} />
                  ))}
                </div>
              </section>
            ))}

            {ledger.hasNextPage ? (
              <button
                type="button"
                onClick={() => ledger.fetchNextPage()}
                disabled={ledger.isFetchingNextPage}
                className="text-sm-token mt-4 font-semibold text-primary"
              >
                {ledger.isFetchingNextPage ? 'Looking further back…' : 'Further back ›'}
              </button>
            ) : (
              <p className="text-xs-body mt-4 text-muted-foreground">
                That&rsquo;s the whole story — it adds up to {balance} {CURRENCY.code}.
              </p>
            )}
          </>
        )}
      </div>
    </Sheet>
  )
}

function HistoryRow({ entry, nameById }: { entry: LedgerEntry; nameById: Map<string, string> }) {
  const earned = entry.delta > 0
  // The payout tray's provenance, retold: a chore credit released by a parent
  // carries their id in `createdBy`; the auto path carries none.
  const checkedBy =
    entry.sourceType === 'chores.task' && entry.createdBy
      ? nameById.get(entry.createdBy)
      : undefined

  return (
    <div className="flex items-center gap-3">
      <span className="w-6 flex-none text-center text-lg leading-none" aria-hidden>
        {glyphFor(entry)}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-sm-token truncate font-semibold">{entry.reason}</div>
        {checkedBy && (
          <div className="text-xs-body text-muted-foreground">checked by {checkedBy}</div>
        )}
      </div>
      <span
        className="text-sm-token flex-none font-bold tabular-nums"
        style={earned ? { color: 'var(--success)' } : undefined}
      >
        {earned ? `+${entry.delta}` : `−${Math.abs(entry.delta)}`}
      </span>
    </div>
  )
}
