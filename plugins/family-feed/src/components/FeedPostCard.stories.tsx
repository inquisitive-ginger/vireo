import type { Meta, StoryObj } from '@storybook/react'
import { FeedPostCard } from './FeedPostCard'
import { SAMPLE_POSTS } from '../sample-posts'

const meta: Meta<typeof FeedPostCard> = {
  title: 'Family Feed/FeedPostCard',
  component: FeedPostCard,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 640, background: 'var(--background)', padding: 24 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof FeedPostCard>

export const Note: Story = {
  args: { post: SAMPLE_POSTS[0] },
}

export const Plain: Story = {
  name: 'Plain (widget use)',
  args: { post: SAMPLE_POSTS[0], variant: 'plain', lineClamp: 2 },
}

export const LongBody: Story = {
  args: { post: SAMPLE_POSTS[4] },
}

export const IdentityRange: Story = {
  name: 'Identity colors (one per author)',
  render: () => (
    <div className="flex flex-col" style={{ gap: 12 }}>
      {['Sarah', 'Marcus', 'Emma', 'Jake', 'Zoë', 'Grandma June'].map((name) => (
        <FeedPostCard
          key={name}
          post={{
            id: name,
            body: `A note from ${name} — each family member keeps the same color everywhere.`,
            createdAt: new Date(Date.now() - 18 * 60_000).toISOString(),
            author: { id: name, name, avatarUrl: null },
          }}
        />
      ))}
    </div>
  ),
}
