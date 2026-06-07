import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { BellBadge } from './bell-badge'
import { NotificationItem } from './notification-item'
import { NotificationTray } from './notification-tray'
import { Toast } from './toast'
import { toast } from 'sonner'
import { Button } from './button'
import type { NotificationEntry } from './notification-tray'

// ─── Toast ───────────────────────────────────────────────────────────────────

const toastMeta: Meta = {
  title: 'Notifications/Toast',
  parameters: { layout: 'centered' },
}
export default toastMeta

const NOW = new Date().toISOString()
const HOUR_AGO = new Date(Date.now() - 3_600_000).toISOString()
const DAY_AGO = new Date(Date.now() - 86_400_000).toISOString()

const SAMPLE_NOTIFICATIONS: NotificationEntry[] = [
  {
    id: '1',
    title: 'Chore completed',
    body: 'Jordan marked "Clean room" as done',
    variant: 'success',
    createdAt: NOW,
    isRead: false,
  },
  {
    id: '2',
    title: 'Calendar reminder',
    body: 'Soccer practice in 30 minutes',
    variant: 'info',
    createdAt: HOUR_AGO,
    isRead: false,
  },
  {
    id: '3',
    title: 'Allowance low',
    body: 'F$ balance below 10',
    variant: 'warning',
    createdAt: DAY_AGO,
    isRead: true,
  },
  { id: '4', title: 'Plugin failed to load', variant: 'error', createdAt: DAY_AGO, isRead: true },
]

export const ToastVariants: StoryObj = {
  name: 'Toast — variants + dismiss behaviour',
  render: () => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 12, fontFamily: 'var(--font-ui)' }}
    >
      <Toast />
      <p style={{ fontSize: 13, color: 'var(--muted-foreground)', marginBottom: 8 }}>
        Success auto-dismisses in 3s · Info in 5s · Warning in 8s · Error persists
      </p>
      <Button
        onClick={() =>
          toast.success('Chore completed', {
            description: 'Jordan marked "Clean room" as done',
            duration: 3000,
          })
        }
      >
        Success (3s)
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.info('Calendar reminder', {
            description: 'Soccer practice in 30 minutes',
            duration: 5000,
          })
        }
      >
        Info (5s)
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.warning('Allowance low', { description: 'F$ balance is below 10', duration: 8000 })
        }
      >
        Warning (8s)
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.error('Plugin failed to load', { duration: Infinity })}
      >
        Error (persistent)
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          for (let i = 1; i <= 5; i++) toast.info(`Notification ${i}`)
        }}
      >
        Trigger 5 at once (max 3 visible)
      </Button>
    </div>
  ),
}

// ─── BellBadge ───────────────────────────────────────────────────────────────

export const BellNoUnread: StoryObj = {
  name: 'BellBadge — no unread',
  render: () => (
    <div style={{ width: 220, border: '1px solid var(--border)', borderRadius: 8, padding: 4 }}>
      <BellBadge count={0} maxSeverity={null} onClick={() => {}} />
    </div>
  ),
}

export const BellInfoUnread: StoryObj = {
  name: 'BellBadge — info/success severity (accent)',
  render: () => (
    <div style={{ width: 220, border: '1px solid var(--border)', borderRadius: 8, padding: 4 }}>
      <BellBadge count={3} maxSeverity="info" onClick={() => {}} />
    </div>
  ),
}

export const BellWarningUnread: StoryObj = {
  name: 'BellBadge — warning severity (amber)',
  render: () => (
    <div style={{ width: 220, border: '1px solid var(--border)', borderRadius: 8, padding: 4 }}>
      <BellBadge count={7} maxSeverity="warning" onClick={() => {}} />
    </div>
  ),
}

export const BellErrorUnread: StoryObj = {
  name: 'BellBadge — error severity (red)',
  render: () => (
    <div style={{ width: 220, border: '1px solid var(--border)', borderRadius: 8, padding: 4 }}>
      <BellBadge count={12} maxSeverity="error" onClick={() => {}} />
    </div>
  ),
}

export const BellOverflow: StoryObj = {
  name: 'BellBadge — count > 99',
  render: () => (
    <div style={{ width: 220, border: '1px solid var(--border)', borderRadius: 8, padding: 4 }}>
      <BellBadge count={150} maxSeverity="error" onClick={() => {}} />
    </div>
  ),
}

// ─── NotificationItem ────────────────────────────────────────────────────────
// Frame B: left accent bar (unread), bold title (unread), timestamp inline-right.
// Hover reveals × delete button (mouse). Swipe-left dismisses (touch/pen).

export const ItemReadStates: StoryObj = {
  name: 'NotificationItem — read vs unread states',
  render: () => (
    <div
      style={{ width: 400, border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}
    >
      <NotificationItem
        title="Chore completed"
        body='Jordan marked "Clean room" as done'
        variant="success"
        createdAt={NOW}
        isRead={false}
      />
      <NotificationItem
        title="Calendar reminder"
        body="Soccer practice in 30 minutes"
        variant="info"
        createdAt={HOUR_AGO}
        isRead={false}
      />
      <NotificationItem
        title="Allowance low"
        body="F$ balance is below 10"
        variant="warning"
        createdAt={DAY_AGO}
        isRead={true}
      />
      <NotificationItem
        title="Plugin failed to load"
        variant="error"
        createdAt={DAY_AGO}
        isRead={true}
      />
    </div>
  ),
}

export const ItemWithDelete: StoryObj = {
  name: 'NotificationItem — hover × delete (mouse)',
  render: () => {
    function Demo() {
      const [items, setItems] = useState([
        {
          id: '1',
          title: 'Chore completed',
          body: 'Jordan marked "Clean room" as done',
          variant: 'success' as const,
          createdAt: NOW,
          isRead: false,
        },
        {
          id: '2',
          title: 'Calendar reminder',
          body: 'Soccer practice in 30 minutes',
          variant: 'info' as const,
          createdAt: HOUR_AGO,
          isRead: true,
        },
      ])
      return (
        <div
          style={{
            width: 400,
            border: '1px solid var(--border)',
            borderRadius: 8,
            overflow: 'hidden',
            fontFamily: 'var(--font-ui)',
          }}
        >
          <p
            style={{
              fontSize: 11,
              color: 'var(--muted-foreground)',
              padding: '8px 16px 4px',
              borderBottom: '1px solid var(--border)',
            }}
          >
            Hover an item to reveal the × button
          </p>
          {items.length === 0 && (
            <p
              style={{
                fontSize: 13,
                color: 'var(--muted-foreground)',
                padding: '24px 16px',
                textAlign: 'center',
              }}
            >
              All deleted
            </p>
          )}
          {items.map((item) => (
            <NotificationItem
              key={item.id}
              {...item}
              onDelete={() => setItems((prev) => prev.filter((i) => i.id !== item.id))}
            />
          ))}
        </div>
      )
    }
    return <Demo />
  },
}

export const ItemVariants: StoryObj = {
  name: 'NotificationItem — all variants (unread)',
  render: () => (
    <div
      style={{ width: 400, border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}
    >
      <NotificationItem
        title="Chore completed"
        body='Jordan marked "Clean room" as done'
        variant="success"
        createdAt={NOW}
        isRead={false}
      />
      <NotificationItem
        title="Calendar reminder"
        body="Soccer practice in 30 minutes"
        variant="info"
        createdAt={HOUR_AGO}
        isRead={false}
      />
      <NotificationItem
        title="Allowance low"
        body="F$ balance is below 10"
        variant="warning"
        createdAt={DAY_AGO}
        isRead={false}
      />
      <NotificationItem
        title="Plugin failed to load"
        variant="error"
        createdAt={HOUR_AGO}
        isRead={false}
      />
    </div>
  ),
}

// ─── NotificationTray ────────────────────────────────────────────────────────

export const TrayWithNotifications: StoryObj = {
  name: 'NotificationTray — with items + delete + clear all',
  render: () => {
    function Demo() {
      const [open, setOpen] = useState(false)
      const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS)
      return (
        <div style={{ padding: 32, fontFamily: 'var(--font-ui)' }}>
          <BellBadge count={2} maxSeverity="warning" onClick={() => setOpen(true)} />
          <NotificationTray
            open={open}
            onClose={() => setOpen(false)}
            notifications={notifications}
            onDeleteNotification={(id) =>
              setNotifications((prev) => prev.filter((n) => n.id !== id))
            }
            onClearAll={() => setNotifications([])}
          />
        </div>
      )
    }
    return <Demo />
  },
}

export const TrayEmpty: StoryObj = {
  name: 'NotificationTray — empty state',
  render: () => {
    function Demo() {
      const [open, setOpen] = useState(false)
      return (
        <div style={{ padding: 32, fontFamily: 'var(--font-ui)' }}>
          <BellBadge count={0} maxSeverity={null} onClick={() => setOpen(true)} />
          <NotificationTray open={open} onClose={() => setOpen(false)} notifications={[]} />
        </div>
      )
    }
    return <Demo />
  },
}

export const TrayLoading: StoryObj = {
  name: 'NotificationTray — loading state',
  render: () => {
    function Demo() {
      const [open, setOpen] = useState(false)
      return (
        <div style={{ padding: 32, fontFamily: 'var(--font-ui)' }}>
          <BellBadge count={3} maxSeverity="info" onClick={() => setOpen(true)} />
          <NotificationTray
            open={open}
            onClose={() => setOpen(false)}
            notifications={[]}
            loading={true}
          />
        </div>
      )
    }
    return <Demo />
  },
}
