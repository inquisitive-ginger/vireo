import type { Meta, StoryObj } from '@storybook/react'
import { FeedEmptyState } from './FeedEmptyState'

const meta: Meta<typeof FeedEmptyState> = {
  title: 'Family Feed/FeedEmptyState',
  component: FeedEmptyState,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof FeedEmptyState>

export const Default: Story = {}
