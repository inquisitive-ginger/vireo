import type { Meta, StoryObj } from '@storybook/react'
import { BellBadge } from './bell-badge'

const meta: Meta = {
  title: 'Notifications/Bell Badge',
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 220, border: '1px solid var(--border)', borderRadius: 8, padding: 4 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta

export const NoUnread: StoryObj = {
  name: 'No unread',
  render: () => <BellBadge count={0} maxSeverity={null} onClick={() => {}} />,
}

export const InfoSeverity: StoryObj = {
  name: 'Info / success severity — accent badge',
  render: () => <BellBadge count={3} maxSeverity="info" onClick={() => {}} />,
}

export const WarningSeverity: StoryObj = {
  name: 'Warning severity — amber badge',
  render: () => <BellBadge count={7} maxSeverity="warning" onClick={() => {}} />,
}

export const ErrorSeverity: StoryObj = {
  name: 'Error severity — red badge',
  render: () => <BellBadge count={12} maxSeverity="error" onClick={() => {}} />,
}

export const CountOverflow: StoryObj = {
  name: 'Count > 99',
  render: () => <BellBadge count={150} maxSeverity="error" onClick={() => {}} />,
}
