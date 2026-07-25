import { CheckCheck, Loader2 } from 'lucide-react'
import {
  Button,
  CoinDecisionTray,
  EmptyState,
  ItemCard,
  MemberGroupHeader,
  bucks,
  identityToken,
  resolveHue,
} from '@family-os/ui'
import {
  useDecidePayout,
  useDecideRedemption,
  useProfiles,
  useQueuePayouts,
  useQueueRedemptions,
} from '../lib/hooks'
import type { PendingPayout, Redemption } from '../types'

type Item =
  | { kind: 'payout'; at: number; payout: PendingPayout }
  | { kind: 'redemption'; at: number; redemption: Redemption }

/* The tier-4 approvals queue — one place to clear everything waiting on a parent:
   held chore payouts (M4/3b) AND reward redemptions, grouped by kid (design gate:
   "C — grouped by kid"). Both kinds share the brass CoinDecisionTray, so the queue
   and the chores board can't drift. */
export function ApprovalsQueue() {
  const payouts = useQueuePayouts()
  const redemptions = useQueueRedemptions()
  const profiles = useProfiles()
  const decidePayout = useDecidePayout()
  const decideRedemption = useDecideRedemption()

  const loading = payouts.isLoading || redemptions.isLoading || profiles.isLoading

  const byId = new Map((profiles.data ?? []).map((m) => [m.id, m]))

  // One flat list, then bucketed by kid. A payout and a redemption interleave by time.
  const items: Item[] = [
    ...(payouts.data ?? []).map(
      (payout): Item => ({ kind: 'payout', at: Date.parse(payout.createdAt), payout })
    ),
    ...(redemptions.data ?? []).map(
      (redemption): Item => ({
        kind: 'redemption',
        at: Date.parse(redemption.requestedAt),
        redemption,
      })
    ),
  ]

  const groups = new Map<string, Item[]>()
  for (const item of items) {
    const pid = item.kind === 'payout' ? item.payout.profileId : item.redemption.profileId
    ;(groups.get(pid) ?? groups.set(pid, []).get(pid)!).push(item)
  }
  for (const list of groups.values()) list.sort((a, b) => b.at - a.at)

  if (loading) {
    return (
      <div className="flex justify-center py-10 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={CheckCheck}
        heading="All caught up"
        body="Held chore payouts and reward requests land here for your OK."
      />
    )
  }

  return (
    <div className="flex flex-col gap-7">
      {[...groups.entries()].map(([pid, list]) => {
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
              count={`${list.length} waiting`}
            />
            <div className="flex flex-col gap-2">
              {list.map((item) =>
                item.kind === 'payout' ? (
                  <PayoutCard
                    key={item.payout.id}
                    payout={item.payout}
                    spine={spine}
                    onDecide={(decision) =>
                      decidePayout.mutateAsync({ id: item.payout.id, decision })
                    }
                  />
                ) : (
                  <RedemptionCard
                    key={item.redemption.id}
                    redemption={item.redemption}
                    kidName={name}
                    spine={spine}
                    onDecide={(action, note) =>
                      decideRedemption.mutateAsync({ id: item.redemption.id, action, note })
                    }
                  />
                )
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}

function PayoutCard({
  payout,
  spine,
  onDecide,
}: {
  payout: PendingPayout
  spine: string
  onDecide: (decision: 'approve' | 'decline') => Promise<unknown>
}) {
  return (
    <ItemCard spine={spine} align="stretch">
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div>
          <span className="text-card-title block truncate">{payout.reason}</span>
          <span className="text-xs-body text-muted-foreground">chore payout</span>
        </div>
        <CoinDecisionTray
          amount={payout.amount}
          prompt="Waiting on your OK"
          approveLabel={`Pay ${bucks(payout.amount)}`}
          declineLabel="Not yet"
          approvedLabel={`Paid ${bucks(payout.amount)}`}
          declinedLabel="Not paid"
          onApprove={() => onDecide('approve')}
          onDecline={() => onDecide('decline')}
        />
      </div>
    </ItemCard>
  )
}

function RedemptionCard({
  redemption,
  kidName,
  spine,
  onDecide,
}: {
  redemption: Redemption
  kidName: string
  spine: string
  onDecide: (action: 'grant' | 'decline' | 'fulfil', note: string | null) => Promise<unknown>
}) {
  const label = redemption.reward
    ? `${redemption.reward.emoji} ${redemption.reward.name}`
    : 'a reward'

  // A granted request is no longer a coin decision — the P-Bucks already moved. It
  // waits to be handed over.
  if (redemption.status === 'granted') {
    return (
      <ItemCard
        spine={spine}
        align="center"
        trailing={
          <Button size="sm" variant="outline" onClick={() => onDecide('fulfil', null)}>
            Mark as given
          </Button>
        }
      >
        <div className="min-w-0 flex-1">
          <span className="text-card-title block truncate">{label}</span>
          <span className="text-xs-body text-muted-foreground">approved · hand it over</span>
        </div>
      </ItemCard>
    )
  }

  return (
    <ItemCard spine={spine} align="stretch">
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div>
          <span className="text-card-title block truncate">{label}</span>
          <span className="text-xs-body text-muted-foreground">wants to spend</span>
        </div>
        <CoinDecisionTray
          amount={redemption.cost}
          prompt={`${bucks(redemption.cost)} to spend`}
          approveLabel="Approve"
          declineLabel="Not this time"
          approvedLabel="Approved"
          declinedLabel="Not this time"
          withDeclineNote
          declineNoteLabel={
            <>
              Add a reason — <b className="font-semibold text-foreground">{kidName} sees this</b>{' '}
              (optional)
            </>
          }
          declineNotePlaceholder="Maybe after homework…"
          onApprove={() => onDecide('grant', null)}
          onDecline={(note) => onDecide('decline', note)}
        />
      </div>
    </ItemCard>
  )
}
