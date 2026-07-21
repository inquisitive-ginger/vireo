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

  it('shows Clear all button when notifications exist and onClearAll is provided', () => {
    render(
      <NotificationTray
        open={true}
        onClose={() => {}}
        notifications={SAMPLE}
        onClearAll={() => {}}
      />
    )
    expect(screen.getByRole('button', { name: /clear all/i })).toBeInTheDocument()
  })

  it('hides Clear all button when notification list is empty', () => {
    render(
      <NotificationTray open={true} onClose={() => {}} notifications={[]} onClearAll={() => {}} />
    )
    expect(screen.queryByRole('button', { name: /clear all/i })).not.toBeInTheDocument()
  })

  it('calls onClearAll when Clear all is clicked', () => {
    const onClearAll = vi.fn()
    render(
      <NotificationTray
        open={true}
        onClose={() => {}}
        notifications={SAMPLE}
        onClearAll={onClearAll}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /clear all/i }))
    expect(onClearAll).toHaveBeenCalledOnce()
  })

  it('renders a keyboard-reachable per-item delete button when onDeleteNotification is provided', () => {
    const onDeleteNotification = vi.fn()
    render(
      <NotificationTray
        open={true}
        onClose={() => {}}
        notifications={[SAMPLE[0]]}
        onDeleteNotification={onDeleteNotification}
      />
    )
    // In the DOM without hover so it stays in the tab order; hover/focus only
    // reveals it visually via CSS.
    const btn = screen.getByLabelText('Delete notification: Chore completed')
    fireEvent.click(btn)
    expect(onDeleteNotification).toHaveBeenCalledWith('1')
  })

  it('does not show delete button when onDeleteNotification is not provided', () => {
    render(<NotificationTray open={true} onClose={() => {}} notifications={SAMPLE} />)
    const container = screen.getByText('Chore completed').closest('.relative')!
    fireEvent.mouseEnter(container)
    expect(screen.queryByLabelText(/delete notification/i)).not.toBeInTheDocument()
  })

  it('renders a footer below the list', () => {
    render(
      <NotificationTray
        open={true}
        onClose={() => {}}
        notifications={SAMPLE}
        footer={<button>Report a problem</button>}
      />
    )
    expect(screen.getByRole('button', { name: 'Report a problem' })).toBeInTheDocument()
  })

  // The footer is the report entry (ADR 046) — it has to survive the empty state,
  // which is exactly when a broken app has produced no notifications to show.
  it('keeps the footer when there are no notifications', () => {
    render(
      <NotificationTray
        open={true}
        onClose={() => {}}
        notifications={[]}
        footer={<button>Report a problem</button>}
      />
    )
    expect(screen.getByText('No notifications')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Report a problem' })).toBeInTheDocument()
  })

  it('renders no footer element when none is given', () => {
    const { container } = render(
      <NotificationTray open={true} onClose={() => {}} notifications={SAMPLE} />
    )
    expect(container.querySelector('.border-t')).not.toBeInTheDocument()
  })
})
