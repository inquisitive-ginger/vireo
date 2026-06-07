import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { NotificationItem } from './notification-item'

const meta: Meta = {
  title: 'Notifications/Notification Item',
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div
        style={{
          width: 400,
          border: '1px solid var(--border)',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        <Story />
      </div>
    ),
  ],
}
export default meta

const NOW = new Date().toISOString()
const HOUR_AGO = new Date(Date.now() - 3_600_000).toISOString()
const DAY_AGO = new Date(Date.now() - 86_400_000).toISOString()

// ─── Read vs unread ───────────────────────────────────────────────────────────

export const ReadVsUnread: StoryObj = {
  name: 'Read vs unread — Frame B visual treatment',
  render: () => (
    <>
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
    </>
  ),
}

// ─── Variants ─────────────────────────────────────────────────────────────────

export const AllVariantsUnread: StoryObj = {
  name: 'All variants — unread',
  render: () => (
    <>
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
    </>
  ),
}

export const AllVariantsRead: StoryObj = {
  name: 'All variants — read',
  render: () => (
    <>
      <NotificationItem
        title="Chore completed"
        body='Jordan marked "Clean room" as done'
        variant="success"
        createdAt={NOW}
        isRead={true}
      />
      <NotificationItem
        title="Calendar reminder"
        body="Soccer practice in 30 minutes"
        variant="info"
        createdAt={HOUR_AGO}
        isRead={true}
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
        createdAt={HOUR_AGO}
        isRead={true}
      />
    </>
  ),
}

// ─── Delete interactions ──────────────────────────────────────────────────────

export const HoverDelete: StoryObj = {
  name: 'Hover × delete — mouse interaction',
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
        <>
          <div
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 11,
              color: 'var(--muted-foreground)',
              padding: '8px 16px 4px',
              borderBottom: '1px solid var(--border)',
            }}
          >
            Hover an item to reveal ×
          </div>
          {items.length === 0 && (
            <p
              style={{
                fontSize: 13,
                color: 'var(--muted-foreground)',
                padding: '24px 16px',
                textAlign: 'center',
                fontFamily: 'var(--font-ui)',
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
        </>
      )
    }
    return <Demo />
  },
}

export const SwipeDelete: StoryObj = {
  name: 'Swipe dismiss — touch/pen (use touch emulation)',
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
          title: 'Allowance low',
          body: 'F$ balance is below 10',
          variant: 'warning' as const,
          createdAt: DAY_AGO,
          isRead: true,
        },
      ])
      return (
        <>
          <div
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 11,
              color: 'var(--muted-foreground)',
              padding: '8px 16px 4px',
              borderBottom: '1px solid var(--border)',
            }}
          >
            Enable touch emulation in DevTools, then swipe left
          </div>
          {items.length === 0 && (
            <p
              style={{
                fontSize: 13,
                color: 'var(--muted-foreground)',
                padding: '24px 16px',
                textAlign: 'center',
                fontFamily: 'var(--font-ui)',
              }}
            >
              All dismissed
            </p>
          )}
          {items.map((item) => (
            <NotificationItem
              key={item.id}
              {...item}
              onDelete={() => setItems((prev) => prev.filter((i) => i.id !== item.id))}
            />
          ))}
        </>
      )
    }
    return <Demo />
  },
}
