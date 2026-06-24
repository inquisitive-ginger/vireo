import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ConfirmDialog } from './confirm-dialog'

describe('ConfirmDialog', () => {
  it('fires onConfirm for a single destructive action', () => {
    const onConfirm = vi.fn()
    render(
      <ConfirmDialog
        open
        title="Remove “Soccer”?"
        description="This can't be undone."
        confirmLabel="Remove"
        onConfirm={onConfirm}
        onCancel={() => {}}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('offers a secondary choice and routes each button to its own handler', () => {
    const onConfirm = vi.fn()
    const onSecondary = vi.fn()
    render(
      <ConfirmDialog
        open
        title="Remove “Gymnastics”?"
        description="This event repeats weekly."
        confirmLabel="All events"
        secondaryLabel="Just this week"
        onConfirm={onConfirm}
        onSecondary={onSecondary}
        onCancel={() => {}}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Just this week' }))
    expect(onSecondary).toHaveBeenCalledTimes(1)
    expect(onConfirm).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'All events' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })
})
