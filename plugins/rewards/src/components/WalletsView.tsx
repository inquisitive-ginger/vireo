import { useMemo, useState } from 'react'
import { Loader2, RotateCcw, Trash2, Wallet as WalletIcon } from 'lucide-react'
import {
  Button,
  Coin,
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
import { FAMILY_PROFILE_ID } from '@family-os/platform'
import type { Profile } from '@family-os/platform/types'
import {
  useAllBalances,
  useAllCards,
  useAllRedemptions,
  useProfiles,
  useRemoveCard,
  useRestoreRedemption,
  useRevokeRedemption,
  useUndoPunch,
} from '../lib/hooks'
import { askedLabel, boughtLabel, earnedLabel, usedLabel } from '../lib/when'
import type { PunchCardData, Redemption } from '../types'
import { ClampedList } from './ClampedList'
import { GrantDialog } from './GrantDialog'

const REVEAL_STEP = 10

/* The tier-4 Wallets tab (né Tickets, M4/7) — the per-kid money view. Every kid
   gets a section whether or not they hold anything: balance in the header (brass —
   the coin's colour, never the member's), "Give a bonus" on the header's action
   slot, and beneath them the inventory the tab has always carried. Approvals
   answers what's waiting and empties to zero; this one is where the money lives.

   Two corrections, and the difference between them is what comes back:
     · Put it back    — a ticket torn by mistake returns to the pocket. No money moves.
     · Refund & remove — the ADR 055 revoke: the P-Bucks come back, the ticket goes.
   Only the second is destructive, so only the second confirms. */
export function WalletsView() {
  const redemptions = useAllRedemptions()
  const punchCards = useAllCards()
  const profiles = useProfiles()
  const balances = useAllBalances()
  const restore = useRestoreRedemption()
  const revoke = useRevokeRedemption()
  const undoPunch = useUndoPunch()
  const removeCard = useRemoveCard()
  const [revoking, setRevoking] = useState<Redemption | null>(null)
  const [removing, setRemoving] = useState<PunchCardData | null>(null)
  const [granting, setGranting] = useState<Profile | null>(null)

  const byId = useMemo(() => new Map((profiles.data ?? []).map((m) => [m.id, m])), [profiles.data])

  // Seeded from the kid profiles first (M4/7) — a kid with an empty pocket is
  // exactly who a bonus finds — then anyone else holding data joins. Pocket keeps
  // the store's order (longest-held first); the used shelf is newest first — a
  // correction is nearly always to the thing that just happened. Punch cards
  // (M4/6) join their kid's section.
  const groups = useMemo(() => {
    const out = new Map<
      string,
      { pocket: Redemption[]; used: Redemption[]; cards: PunchCardData[] }
    >()
    const groupFor = (pid: string) => {
      const g = out.get(pid) ?? { pocket: [], used: [], cards: [] }
      out.set(pid, g)
      return g
    }
    for (const m of profiles.data ?? []) {
      if (m.id !== FAMILY_PROFILE_ID && m.tier < 4) groupFor(m.id)
    }
    for (const r of redemptions.data ?? []) {
      const g = groupFor(r.profileId)
      if (r.status === 'used') g.used.push(r)
      else g.pocket.push(r)
    }
    for (const c of punchCards.data?.cards ?? []) groupFor(c.profileId).cards.push(c)
    for (const g of out.values()) {
      g.pocket.sort((a, b) => a.purchasedAt.localeCompare(b.purchasedAt))
      g.used.sort((a, b) => (b.usedAt ?? '').localeCompare(a.usedAt ?? ''))
    }
    return out
  }, [profiles.data, redemptions.data, punchCards.data])

  const balanceById = useMemo(
    () => new Map((balances.data ?? []).map((b) => [b.profileId, b.balance])),
    [balances.data]
  )

  if (redemptions.isLoading || profiles.isLoading || balances.isLoading) {
    return (
      <div className="flex justify-center py-10 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
      </div>
    )
  }

  if (groups.size === 0) {
    return (
      <EmptyState
        icon={WalletIcon}
        heading="No wallets yet"
        body="Each kid's balance, tickets, and punch cards live here — add a family member to get started."
      />
    )
  }

  return (
    <>
      <div className="flex flex-col gap-7">
        {[...groups.entries()].map(([pid, { pocket, used, cards }]) => {
          const member = byId.get(pid)
          const name = member?.name ?? 'Someone'
          const hue = resolveHue(name, member?.identityHue)
          const spine = identityToken(hue)
          const empty = pocket.length === 0 && used.length === 0 && cards.length === 0
          return (
            <section key={pid} className="flex flex-col gap-3">
              <MemberGroupHeader
                name={name}
                hue={hue}
                avatarUrl={member?.avatarUrl}
                status={<BalanceChip balance={balanceById.get(pid) ?? 0} />}
                action={
                  member && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGranting(member)}
                      aria-label={`Give ${name} a bonus`}
                    >
                      🎁 Give a bonus
                    </Button>
                  )
                }
              />

              {empty && (
                <p className="text-xs-body text-muted-foreground">Nothing in their pocket yet.</p>
              )}

              {/* Ticket lifecycle stays contiguous (pocket → used — "Put it back"
                  restores into the shelf directly above it); punch cards close the
                  section as the different-shaped object (M4/6 review gate). */}
              {pocket.length > 0 && (
                <Shelf label="In pocket">
                  <ClampedList
                    items={pocket}
                    label="More in pocket"
                    render={(t) => (
                      <TicketRow
                        key={t.id}
                        redemption={t}
                        spine={spine}
                        meta={
                          t.status === 'use_requested' && t.useRequestedAt
                            ? `${askedLabel(t.useRequestedAt)} · waiting on your OK`
                            : t.cost === 0
                              ? earnedLabel(t.purchasedAt)
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
                    )}
                  />
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

              {cards.length > 0 && (
                <Shelf label="Punch cards">
                  <ClampedList
                    items={cards}
                    label="More cards"
                    render={(c) => (
                      <ItemCard
                        key={c.id}
                        spine={spine}
                        align="center"
                        // A finished card is settled — no eraser, no take-down; the
                        // kid's prize pick is the only move left on it. Icon-only
                        // (RowActions' recipe) so the row never has to squeeze its
                        // title to make room for a button's text (auto-bug #103).
                        trailing={
                          !c.completedAt && (
                            <div className="flex flex-none items-center gap-0.5">
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={c.count === 0 || undoPunch.isPending}
                                onClick={() => undoPunch.mutate(c.id)}
                                aria-label={`Undo the last punch on ${name}'s ${c.template.name} card`}
                                title="Undo last punch"
                                className="h-11 w-11"
                              >
                                <RotateCcw className="size-3.5" aria-hidden />
                              </Button>
                              <Button
                                variant="ghost-destructive"
                                size="icon"
                                onClick={() => setRemoving(c)}
                                aria-label={`Take ${name}'s ${c.template.name} card down`}
                                title="Take it down"
                                className="h-11 w-11"
                              >
                                <Trash2 className="size-3.5" aria-hidden />
                              </Button>
                            </div>
                          )
                        }
                      >
                        <span
                          className="grid size-9 flex-none place-items-center rounded-lg bg-secondary text-xl"
                          aria-hidden
                        >
                          {c.template.glyph}
                        </span>
                        <div className="min-w-0 flex-1">
                          <span className="text-card-title block truncate">{c.template.name}</span>
                          <span className="text-xs-body text-muted-foreground">
                            {c.completedAt
                              ? 'Card full — waiting on their prize pick'
                              : `${c.count} of ${c.template.goal} punched`}
                          </span>
                        </div>
                      </ItemCard>
                    )}
                  />
                </Shelf>
              )}
            </section>
          )
        })}
      </div>

      <GrantDialog member={granting} open={granting !== null} onClose={() => setGranting(null)} />

      <ConfirmDialog
        open={removing !== null}
        title={removing ? `Take ${removing.template.glyph} ${removing.template.name} down?` : ''}
        description={
          removing ? (
            <>
              {byId.get(removing.profileId)?.name.split(' ')[0] ?? 'Their'}&rsquo;s {removing.count}{' '}
              punch{removing.count === 1 ? '' : 'es'} go with it, and they won&rsquo;t get a new one
              — add them back on the card in Catalog anytime. Finished cards keep their history.
            </>
          ) : null
        }
        confirmLabel="Take it down"
        isPending={removeCard.isPending}
        onConfirm={() => {
          if (!removing) return
          removeCard.mutate(removing.id, { onSuccess: () => setRemoving(null) })
        }}
        onCancel={() => setRemoving(null)}
      />

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

/* Brass, not the member's hue — the balance belongs to the currency (ADR 051),
   and the header's avatar already carries identity. */
function BalanceChip({ balance }: { balance: number }) {
  return (
    <span
      className="text-xs-token flex items-center gap-1.5 rounded-full px-2.5 py-0.5 tabular-nums"
      style={{ background: 'var(--coin-tint)', color: 'var(--coin-ink)' }}
      aria-label={`Balance: ${bucks(balance)}`}
    >
      <Coin size={14} />
      {balance}
    </span>
  )
}

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

   Default-CLOSED (M4/6 review gate, superseding the #89 open-by-default): each kid
   now carries three shelves, so open history dominated the page with two-plus kids.
   The count stays in the header — a put-it-back is one tap away, not hidden. */
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
    <Disclosure label="Recently used" count={used.length}>
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
