import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CoinDecisionTray, AskSeal } from './coin-decision'

const base = {
  amount: 10,
  prompt: 'Waiting on your OK',
  approveLabel: 'Pay 10 P$',
  declineLabel: 'Not yet',
}

describe('CoinDecisionTray', () => {
  it('approves through onApprove and collapses to a confirmation', async () => {
    const onApprove = vi.fn().mockResolvedValue(undefined)
    render(<CoinDecisionTray {...base} onApprove={onApprove} onDecline={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Pay 10 P$' }))
    expect(onApprove).toHaveBeenCalledTimes(1)
    expect(await screen.findByText('Paid 10 P$')).toBeInTheDocument()
  })

  it('without a note, declines immediately with null', () => {
    const onDecline = vi.fn().mockResolvedValue(undefined)
    render(
      <CoinDecisionTray
        {...base}
        declinedLabel="Not paid"
        onApprove={vi.fn()}
        onDecline={onDecline}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Not yet' }))
    expect(onDecline).toHaveBeenCalledWith(null)
    expect(screen.getByText('Not paid')).toBeInTheDocument()
  })

  it('with a note, opens a field and passes the typed reason', async () => {
    const onDecline = vi.fn().mockResolvedValue(undefined)
    render(
      <CoinDecisionTray
        {...base}
        prompt="15 P$ to spend"
        approveLabel="Approve"
        declineLabel="Not this time"
        amount={15}
        withDeclineNote
        onApprove={vi.fn()}
        onDecline={onDecline}
      />
    )

    // First tap only opens the note field — it must NOT decline yet.
    fireEvent.click(screen.getByRole('button', { name: 'Not this time' }))
    expect(onDecline).not.toHaveBeenCalled()

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'After your homework' },
    })
    fireEvent.click(screen.getByRole('button', { name: /refund 15 P\$/ }))
    await waitFor(() => expect(onDecline).toHaveBeenCalledWith('After your homework'))
  })

  it('reverts to the buttons if the mutation rejects', async () => {
    const onApprove = vi.fn().mockRejectedValue(new Error('nope'))
    render(<CoinDecisionTray {...base} onApprove={onApprove} onDecline={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Pay 10 P$' }))
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Pay 10 P$' })).toBeInTheDocument()
    )
  })
})

describe('AskSeal', () => {
  it('labels itself as needing approval', () => {
    render(<AskSeal />)
    expect(screen.getByRole('img', { name: "Needs a grown-up's OK" })).toBeInTheDocument()
  })
})
