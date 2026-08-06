import { useEffect, useState } from 'react'
import { Button, CoinAmountField, CURRENCY, FieldLabel, Input, Modal, bucks } from '@family-os/ui'
import type { Profile } from '@family-os/platform/types'
import { useGiveBonus } from '../lib/hooks'

// The chore-pay ladder (ADR 052) — a bonus is an earn, so it prices like one.
const AMOUNT_PRESETS = [1, 2, 5, 10]

/* Give a bonus (M4/7) — a compact Modal, not a Drawer: from the Wallets tab the
   recipient is already chosen, so the act is two fields — how much, and the
   reason that becomes the ledger row and the kid's notification verbatim. The
   grantId is minted per open, so a double-tapped or retried submit replays
   instead of paying twice. */
export function GrantDialog({
  member,
  open,
  onClose,
}: {
  member: Profile | null
  open: boolean
  onClose: () => void
}) {
  const give = useGiveBonus()
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [grantId, setGrantId] = useState('')

  // Re-seed per open: fresh fields, fresh idempotency key.
  useEffect(() => {
    if (!open) return
    setAmount('')
    setReason('')
    setGrantId(crypto.randomUUID())
  }, [open])

  const close = () => {
    onClose()
    give.reset()
  }

  if (!member) return null
  const firstName = member.name.split(' ')[0] ?? member.name
  const amountNum = parseInt(amount, 10)
  const amountValid = Number.isInteger(amountNum) && amountNum >= 1
  const valid = amountValid && reason.trim().length > 0

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid || !member) return
    give.mutate(
      { profileId: member.id, amount: amountNum, reason: reason.trim(), grantId },
      { onSuccess: onClose }
    )
  }

  return (
    <Modal open={open} onClose={close} title={`Give ${firstName} a bonus`} className="w-[420px]">
      <form onSubmit={submit} className="flex flex-col gap-5">
        <h2 className="text-card-title">Give {firstName} a bonus</h2>

        <div>
          <FieldLabel htmlFor="grant-amount">How much ({CURRENCY.code})</FieldLabel>
          <CoinAmountField
            id="grant-amount"
            value={amount}
            onChange={setAmount}
            presets={AMOUNT_PRESETS}
          />
        </div>

        <div>
          <FieldLabel htmlFor="grant-reason">For what?</FieldLabel>
          <Input
            id="grant-reason"
            placeholder="Helped carry in the groceries"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <p className="text-xs-body mt-1.5 text-muted-foreground">
            Goes on their money story, word for word.
          </p>
        </div>

        {give.error && <p className="text-sm-token text-error">{give.error.message}</p>}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" disabled={!valid || give.isPending}>
            {amountValid ? `Give ${bucks(amountNum)}` : 'Give'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
