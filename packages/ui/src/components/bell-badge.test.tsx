import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BellBadge } from './bell-badge'

describe('BellBadge', () => {
  it('renders a Notifications button', () => {
    render(<BellBadge count={0} maxSeverity={null} onClick={() => {}} />)
    expect(screen.getByRole('button', { name: /notifications/i })).toBeInTheDocument()
  })

  it('hides the badge when count is 0', () => {
    const { container } = render(<BellBadge count={0} maxSeverity={null} onClick={() => {}} />)
    // No badge pill rendered when count === 0
    const pills = container.querySelectorAll('[aria-hidden="true"]')
    expect(Array.from(pills).some((el) => /\d/.test(el.textContent ?? ''))).toBe(false)
  })

  it('shows the count in the badge', () => {
    const { container } = render(<BellBadge count={5} maxSeverity="info" onClick={() => {}} />)
    const badge = Array.from(container.querySelectorAll('[aria-hidden="true"]')).find(
      (el) => el.textContent === '5'
    )
    expect(badge).toBeTruthy()
  })

  it('caps the displayed count at 99+', () => {
    const { container } = render(<BellBadge count={150} maxSeverity="error" onClick={() => {}} />)
    const badge = Array.from(container.querySelectorAll('[aria-hidden="true"]')).find(
      (el) => el.textContent === '99+'
    )
    expect(badge).toBeTruthy()
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<BellBadge count={3} maxSeverity="warning" onClick={onClick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('aria-label reflects unread count', () => {
    render(<BellBadge count={2} maxSeverity="success" onClick={() => {}} />)
    expect(screen.getByRole('button', { name: /2 unread notifications/i })).toBeInTheDocument()
  })

  it('aria-label is generic when count is 0', () => {
    render(<BellBadge count={0} maxSeverity={null} onClick={() => {}} />)
    expect(screen.getByRole('button', { name: /^notifications$/i })).toBeInTheDocument()
  })
})
