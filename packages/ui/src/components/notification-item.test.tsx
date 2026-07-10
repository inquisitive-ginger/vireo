import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NotificationItem } from './notification-item'

const baseProps = {
  title: 'Chore assigned',
  variant: 'info' as const,
  createdAt: new Date().toISOString(),
}

describe('NotificationItem', () => {
  it('renders the delete button without hover so it stays keyboard-reachable', () => {
    render(<NotificationItem {...baseProps} onDelete={() => {}} />)
    // The mouse never entered — the button must still be in the DOM (tab order).
    expect(screen.getByRole('button', { name: /delete notification/i })).toBeInTheDocument()
  })

  it('activates delete from keyboard focus', () => {
    const onDelete = vi.fn()
    render(<NotificationItem {...baseProps} onDelete={onDelete} />)
    const btn = screen.getByRole('button', { name: /delete notification/i })
    btn.focus()
    expect(btn).toHaveFocus()
    // A native <button> fires the same activation on Enter/Space as on click.
    fireEvent.click(btn)
    expect(onDelete).toHaveBeenCalledOnce()
  })

  it('omits the delete button when onDelete is not provided', () => {
    render(<NotificationItem {...baseProps} />)
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument()
  })
})
