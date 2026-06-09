import type { Meta, StoryObj } from '@storybook/react'
import { FeedPostCard } from './FeedPostCard'
import type { FeedPost } from '../types'

const meta: Meta<typeof FeedPostCard> = {
  title: 'Family Feed/FeedPostCard',
  component: FeedPostCard,
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof FeedPostCard>

const basePost: FeedPost = {
  id: '1',
  body: 'Emma finished her science fair project — a light-up bioluminescent fungi diorama she built completely from scratch.',
  createdAt: new Date(Date.now() - 18 * 60_000).toISOString(),
  author: { id: 'a', name: 'Sarah', avatarUrl: null },
}

export const Default: Story = {
  args: { post: basePost },
}

export const LongBody: Story = {
  args: {
    post: {
      ...basePost,
      body: 'We had the most incredible day today. Started with a hike up to the ridge where we found wild strawberries growing along the trail. Jake caught his first fish (and released it). Emma read three chapters of her book under a pine tree. Brought home wildflowers for the kitchen table. Days like this are why we do this.',
    },
  },
}

export const WithLineClamp: Story = {
  name: 'With lineClamp (widget use)',
  args: {
    post: {
      ...basePost,
      body: 'We had the most incredible day today. Started with a hike up to the ridge where we found wild strawberries growing along the trail. Jake caught his first fish (and released it). Emma read three chapters of her book under a pine tree.',
    },
    lineClamp: 2,
  },
}

export const RecentPost: Story = {
  args: {
    post: {
      ...basePost,
      body: 'Just now.',
      createdAt: new Date().toISOString(),
    },
  },
}
