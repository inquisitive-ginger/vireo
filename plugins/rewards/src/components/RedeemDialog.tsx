import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Coin, Modal, bucks, bucksSpoken } from '@family-os/ui'
import { useRequestRedemption } from '../lib/hooks'
import { redeemMode } from '../lib/affordability'
import type { Reward } from '../types'

/* The buy confirm (M4/5) — a centered MODAL, not a drawer. The drawer is the app's
   create/edit capture surface; buying a ticket is a one-tap decision, so it belongs in a
   focused dialog sized like ConfirmDialog. It derives its own mode from the reward and the
   balance:
     · affordable → spend confirm, arithmetic shown before → after (ADR 055: buying always
       debits, no parent gate at any price — approval gates USE, later, in the pocket)
     · can't afford → a nudge, not a wall: how close, and a way to go earn it
   On success it flips to the it's-yours outcome before it closes. M4/5b rebuilds this
   into the ticket purchase flow proper. */
export function RedeemDialog({
  reward,
  balance,
  open,
  onClose,
}: {
  reward: Reward | null
  balance: number
  open: boolean
  onClose: () => void
}) {
  const navigate = useNavigate()
  const request = useRequestRedemption()
  const [done, setDone] = useState<{ status: string; balance: number } | null>(null)

  const close = () => {
    onClose()
    setTimeout(() => {
      setDone(null)
      request.reset()
    }, 200)
  }

  if (!reward) return null

  const mode = redeemMode(reward, balance)
  const gap = Math.max(0, reward.cost - balance)
  const title = done ? 'All yours' : mode === 'nudge' ? 'Almost there' : 'Get this reward?'

  return (
    <Modal open={open} onClose={close} title={title}>
      <div className="flex flex-col items-center gap-2 text-center">
        <div
          className="grid size-16 place-items-center rounded-panel text-[38px] leading-none"
          style={{ background: 'var(--surface-sunken)' }}
          aria-hidden
        >
          {reward.emoji}
        </div>
        <h3 className="text-card-title mt-1">{reward.name}</h3>
        {reward.description && (
          <p className="text-sm-token text-muted-foreground">{reward.description}</p>
        )}

        {done ? (
          <Outcome balance={done.balance} onDone={close} />
        ) : mode === 'nudge' ? (
          <Nudge
            balance={balance}
            cost={reward.cost}
            gap={gap}
            onChores={() => {
              close()
              navigate('/chores')
            }}
            onClose={close}
          />
        ) : (
          <Confirm
            reward={reward}
            balance={balance}
            pending={request.isPending}
            error={request.error instanceof Error ? request.error.message : null}
            onConfirm={() =>
              request.mutate(reward.id, {
                onSuccess: (data) =>
                  setDone({ status: data.redemption.status, balance: data.balance }),
              })
            }
            onCancel={close}
          />
        )}
      </div>
    </Modal>
  )
}

function Confirm({
  reward,
  balance,
  pending,
  error,
  onConfirm,
  onCancel,
}: {
  reward: Reward
  balance: number
  pending: boolean
  error: string | null
  onConfirm: () => void
  onCancel: () => void
}) {
  const after = balance - reward.cost
  return (
    <>
      <div className="mt-3 flex items-baseline justify-center gap-2" aria-hidden>
        <span className="text-heading">{balance}</span>
        <span className="text-muted-foreground">&rarr;</span>
        <span className="text-heading" style={{ color: 'var(--coin-ink)' }}>
          {after}
        </span>
        <span className="text-sm-token font-semibold text-muted-foreground">P$ left</span>
      </div>
      <span className="sr-only">
        {`Spend ${bucksSpoken(reward.cost)} on ${reward.name}. You will have ${bucksSpoken(after)} left.`}
      </span>

      {error && <p className="text-sm-token mt-2 font-medium text-[var(--error)]">{error}</p>}

      <div className="mt-5 flex w-full flex-col gap-2">
        <Button onClick={onConfirm} disabled={pending} className="w-full">
          Get it
        </Button>
        <Button variant="ghost" onClick={onCancel} disabled={pending} className="w-full">
          Maybe later
        </Button>
      </div>
    </>
  )
}

function Nudge({
  balance,
  cost,
  gap,
  onChores,
  onClose,
}: {
  balance: number
  cost: number
  gap: number
  onChores: () => void
  onClose: () => void
}) {
  return (
    <>
      <p className="text-sm-token text-muted-foreground">Costs {bucks(cost)}</p>
      <div className="mt-4 w-full">
        <Track have={balance} total={cost} label={`You have ${balance} of ${cost} P-Bucks`} />
      </div>
      <p className="text-sm-token mt-3 font-semibold text-foreground">
        You have {balance} of {cost} P$.
      </p>
      <p className="text-xs-body text-muted-foreground">Do a chore to earn the last {gap}.</p>
      <div className="mt-5 flex w-full flex-col gap-2">
        <Button onClick={onChores} className="w-full">
          See my chores
        </Button>
        <Button variant="ghost" onClick={onClose} className="w-full">
          Okay
        </Button>
      </div>
    </>
  )
}

function Outcome({ balance, onDone }: { balance: number; onDone: () => void }) {
  // A purchase always lands `owned` (ADR 055) — buying is a celebration, every time.
  return (
    <>
      <div className="mt-2 flex items-center gap-2">
        <Coin size={20} />
        <span className="text-heading">{balance}</span>
        <span className="text-sm-token font-semibold text-muted-foreground">P$ left</span>
      </div>
      <p className="text-base-token mt-2 font-semibold text-foreground">
        🎉 It&rsquo;s yours! Find it in your pocket.
      </p>
      <Button onClick={onDone} className="mt-5 w-full">
        Done
      </Button>
    </>
  )
}

/** Matte progress: a statement of fact ("12 of 15"), never an ever-climbing bar. */
export function Track({ have, total, label }: { have: number; total: number; label: string }) {
  const pct = Math.max(3, Math.min(100, Math.round((have / total) * 100)))
  return (
    <div
      className="h-2 overflow-hidden rounded-full"
      style={{ background: 'var(--muted)' }}
      role="progressbar"
      aria-valuenow={have}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={label}
    >
      <div
        className="h-full rounded-full"
        style={{ width: `${pct}%`, background: 'var(--coin)' }}
      />
    </div>
  )
}
