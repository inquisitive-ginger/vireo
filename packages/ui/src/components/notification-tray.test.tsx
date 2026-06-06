import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NotificationTray } from './notification-tray'
import type { NotificationEntry } from './notification-tray'

const SAMPLE: NotificationEntry[] = [
  {
    id: '1',
    title: 'Chore completed',
    body: 'Jordan marked "Clean room" as done',
    variant: 'success',
    createdAt: new Date(Date.now() - 60_000).toISOString(),
    isRead: false,
  },
  {
    id: '2',
    title: 'Payment failed',
    variant: 'error',
    createdAt: new Date(Date.now() - 3600_000).toISOString(),
    isRead: true,
  },
]

describe('NotificationTray', () => {
  it('is not rendered when closed', () => {
    render(<NotificationTray open={false} onClose={() => {}} notifications={SAMPLE} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders when open', () => {
    render(<NotificationTray open={true} onClose={() => {}} notifications={SAMPLE} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('shows notification titles', () => {
    render(<NotificationTray open={true} onClose={() => {}} notifications={SAMPLE} />)
    expect(screen.getByText('Chore completed')).toBeInTheDocument()
    expect(screen.getByText('Payment failed')).toBeInTheDocument()
  })

  it('shows the notification body when present', () => {
    render(<NotificationTray open={true} onClose={() => {}} notifications={SAMPLE} />)
    expect(screen.getByText('Jordan marked "Clean room" as done')).toBeInTheDocument()
  })

  it('shows the empty state when notifications list is empty', () => {
    render(<NotificationTray open={true} onClose={() => {}} notifications={[]} />)
    expect(screen.getByText('No notifications')).toBeInTheDocument()
  })

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn()
    render(<NotificationTray open={true} onClose={onClose} notifications={SAMPLE} />)
    fireEvent.click(screen.getByRole('button', { name: /close notifications/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('shows a loading indicator when loading=true and list is empty', () => {
    render(<NotificationTray open={true} onClose={() => {}} notifications={[]} loading={true} />)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })
})
