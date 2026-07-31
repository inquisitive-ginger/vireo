import { useMemo, useState } from 'react'
import { Loader2, Ticket as TicketIcon } from 'lucide-react'
import {
  Button,
  ConfirmDialog,
  Disclosure,
  EmptyState,
  ItemCard,
  MemberGroupHeader,
  RevealMore,
  bucks,
  identityToken,
  resolveHue,
} from '@family-os/ui'
import {
  useAllRedemptions,
  useProfiles,
  useRestoreRedemption,
  useRevokeRedemption,
} from '../lib/hooks'
import { askedLabel, boughtLabel, usedLabel } from '../lib/when'
import type { Redemption } from '../types'

const REVEAL_STEP = 10

/* The tier-4 tickets tab — where a parent corrects a ticket, and the only place the
   two administrative exceptions live. Approvals answers what's waiting and empties
   to zero; this one is an inventory, so it gets its own tab rather than a permanent
   list inside a queue.

   Two corrections, and the difference between them is what comes back:
     · Put it back    — a ticket torn by mistake returns to the pocket. No money moves.
     · Refund & remove — the ADR 055 revoke: the P-Bucks come back, the ticket goes.
   Only the second is destructive, so only the second confirms. */
export function TicketsView() {
  const redemptions = useAllRedemptions()
  const profiles = useProfiles()
  const restore = useRestoreRedemption()
  const revoke = useRevokeRedemption()
  const [revoking, setRevoking] = useState<Redemption | null>(null)

  const byId = useMemo(() => new Map((profiles.data ?? []).map((m) => [m.id, m])), [profiles.data])

  // Grouped by kid, then split by whether the ticket is still theirs to use. The
  // pocket keeps the store's order (longest-held first); the used shelf is newest
  // first — a correction is nearly always to the thing that just happened.
  const groups = useMemo(() => {
    const out = new Map<string, { pocket: Redemption[]; used: Redemption[] }>()
    for (const r of redemptions.data ?? []) {
      const g = out.get(r.profileId) ?? { pocket: [], used: [] }
      if (r.status === 'used') g.used.push(r)
      else g.pocket.push(r)
      out.set(r.profileId, g)
    }
    for (const g of out.values()) {
      g.pocket.sort((a, b) => a.purchasedAt.localeCompare(b.purchasedAt))
      g.used.sort((a, b) => (b.usedAt ?? '').localeCompare(a.usedAt ?? ''))
    }
    return out
  }, [redemptions.data])

  if (redemptions.isLoading || profiles.isLoading) {
    return (
      <div className="flex justify-center py-10 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
      </div>
    )
  }

  if (groups.size === 0) {
    return (
      <EmptyState
        icon={TicketIcon}
        heading="No tickets yet"
        body="Once a kid buys a reward, their ticket shows up here — and you can put one back if it gets used by mistake."
      />
    )
  }

  return (
    <>
      <div className="flex flex-col gap-7">
        {[...groups.entries()].map(([pid, { pocket, used }]) => {
          const member = byId.get(pid)
          const name = member?.name ?? 'Someone'
          const hue = resolveHue(name, member?.identityHue)
          const spine = identityToken(hue)
          return (
            <section key={pid} className="flex flex-col gap-3">
              <MemberGroupHeader
                name={name}
                hue={hue}
                avatarUrl={member?.avatarUrl}
                count={`${pocket.length} in pocket`}
              />

              {pocket.length > 0 && (
                <Shelf label="In pocket">
                  {pocket.map((t) => (
                    <TicketRow
                      key={t.id}
                      redemption={t}
                      spine={spine}
                      meta={
                        t.status === 'use_requested' && t.useRequestedAt
                          ? `${askedLabel(t.useRequestedAt)} · waiting on your OK`
                          : boughtLabel(t.purchasedAt)
                      }
                      action={
                        <Button
                          variant="ghost-destructive"
                          size="sm"
                          onClick={() => setRevoking(t)}
                          aria-label={`Refund and remove ${labelFor(t)} from ${name}'s pocket`}
                        >
                          Refund &amp; remove
                        </Button>
                      }
                    />
                  ))}
                </Shelf>
              )}

              {used.length > 0 && (
                <UsedShelf
                  used={used}
                  spine={spine}
                  name={name}
                  pending={restore.isPending}
                  onRestore={(id) => restore.mutate(id)}
                />
              )}
            </section>
          )
        })}
      </div>

      <ConfirmDialog
        open={revoking !== null}
        title="Refund and remove this ticket?"
        description={
          revoking ? (
            <>
              {labelFor(revoking)} leaves{' '}
              {byId.get(revoking.profileId)?.name.split(' ')[0] ?? 'their'}
              &rsquo;s pocket and {bucks(revoking.cost)} goes back to their wallet. To undo a ticket
              they used by mistake, put it back instead — that keeps the ticket and moves no money.
            </>
          ) : null
        }
        confirmLabel="Refund & remove"
        isPending={revoke.isPending}
        onConfirm={() => {
          if (!revoking) return
          revoke.mutate(revoking.id, { onSuccess: () => setRevoking(null) })
        }}
        onCancel={() => setRevoking(null)}
      />
    </>
  )
}

const labelFor = (r: Redemption) => (r.reward ? `${r.reward.emoji} ${r.reward.name}` : 'a reward')

function Shelf({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-section-label text-muted-foreground">{label}</span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </section>
  )
}

/* Used tickets are never archived, so this shelf is every reward the kid has ever
   torn — the unbounded-wall shape auto-bug #82 named. Count-clamped, not paged: the
   tab already holds every row (the clamp is a reading aid, not a fetch boundary).

   It opens by default, unlike the chores Done section it borrows from: putting a
   mistakenly torn ticket back is the reason a parent opens this tab, so the common
   case must not start behind a tap. */
function UsedShelf({
  used,
  spine,
  name,
  pending,
  onRestore,
}: {
  used: Redemption[]
  spine: string
  name: string
  pending: boolean
  onRestore: (id: string) => void
}) {
  const [shown, setShown] = useState(REVEAL_STEP)
  const visible = used.slice(0, shown)
  const more = used.length - visible.length

  return (
    <Disclosure label="Recently used" count={used.length} defaultOpen>
      <div className="flex flex-col gap-2 pt-1">
        {visible.map((t) => (
          <TicketRow
            key={t.id}
            redemption={t}
            spine={spine}
            dimmed
            meta={t.usedAt ? usedLabel(t.usedAt) : 'Used'}
            action={
              <Button
                variant="outline"
                size="sm"
                disabled={pending}
                onClick={() => onRestore(t.id)}
                aria-label={`Put ${labelFor(t)} back in ${name}'s pocket`}
              >
                Put it back
              </Button>
            }
          />
        ))}
        {more > 0 && (
          <RevealMore
            label={`Show ${more} more`}
            onClick={() => setShown((n) => n + REVEAL_STEP)}
          />
        )}
      </div>
    </Disclosure>
  )
}

/* One anatomy for both shelves — the spine is the kid's hue in every state and the
   used state goes to the field as a dim (ADR 043), so a row can't come to mean two
   different things across the two lists. */
function TicketRow({
  redemption,
  spine,
  meta,
  action,
  dimmed = false,
}: {
  redemption: Redemption
  spine: string
  meta: string
  action: React.ReactNode
  dimmed?: boolean
}) {
  return (
    <ItemCard spine={spine} dimmed={dimmed} align="center">
      <div className="min-w-0 flex-1">
        <span className="text-card-title block truncate">{labelFor(redemption)}</span>
        <span className="text-xs-body text-muted-foreground">{meta}</span>
      </div>
      <div className="flex-none">{action}</div>
    </ItemCard>
  )
}
