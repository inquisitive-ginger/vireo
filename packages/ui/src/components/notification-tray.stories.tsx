import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { BellBadge } from './bell-badge'
import { NotificationTray } from './notification-tray'
import type { NotificationEntry } from './notification-tray'

const meta: Meta = {
  title: 'Notifications/Notification Tray',
  parameters: { layout: 'centered' },
}
export default meta

const NOW = new Date().toISOString()
const HOUR_AGO = new Date(Date.now() - 3_600_000).toISOString()
const DAY_AGO = new Date(Date.now() - 86_400_000).toISOString()

const SAMPLE: NotificationEntry[] = [
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

function TrayDemo({
  initialNotifications = SAMPLE,
  ...props
}: Partial<React.ComponentProps<typeof NotificationTray>> & {
  initialNotifications?: NotificationEntry[]
}) {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState(initialNotifications)
  return (
    <div style={{ padding: 32, fontFamily: 'var(--font-ui)' }}>
      <BellBadge
        count={notifications.filter((n) => !n.isRead).length}
        maxSeverity={
          notifications.some((n) => !n.isRead && n.variant === 'error')
            ? 'error'
            : notifications.some((n) => !n.isRead && n.variant === 'warning')
              ? 'warning'
              : notifications.some((n) => !n.isRead)
                ? 'info'
                : null
        }
        onClick={() => setOpen(true)}
      />
      <NotificationTray
        open={open}
        onClose={() => setOpen(false)}
        notifications={notifications}
        onDeleteNotification={(id) => setNotifications((prev) => prev.filter((n) => n.id !== id))}
        onClearAll={() => setNotifications([])}
        {...props}
      />
    </div>
  )
}

export const WithNotifications: StoryObj = {
  name: 'With notifications — delete + clear all',
  render: () => <TrayDemo />,
}

export const EmptyState: StoryObj = {
  name: 'Empty state',
  render: () => <TrayDemo initialNotifications={[]} />,
}

export const LoadingState: StoryObj = {
  name: 'Loading state',
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

export const AllRead: StoryObj = {
  name: 'All read — no badge',
  render: () => <TrayDemo initialNotifications={SAMPLE.map((n) => ({ ...n, isRead: true }))} />,
}
