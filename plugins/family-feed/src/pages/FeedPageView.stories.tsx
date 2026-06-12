import type { Meta, StoryObj } from '@storybook/react'
import { PenLine } from 'lucide-react'
import { Button, ComposeForm } from '@family-os/ui'
import { FeedPageView } from './FeedPageView'
import { SAMPLE_POSTS } from '../sample-posts'

const meta: Meta<typeof FeedPageView> = {
  title: 'Family Feed/Feed Page',
  component: FeedPageView,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof FeedPageView>

const composeButton = (
  <Button>
    <PenLine size={16} />
    New Post
  </Button>
)

export const Default: Story = {
  args: {
    posts: SAMPLE_POSTS,
    composeButton,
    hasMore: true,
  },
}

export const Composing: Story = {
  args: {
    posts: SAMPLE_POSTS,
    composeForm: <ComposeForm authorName="Sarah" onSubmit={() => {}} onCancel={() => {}} />,
  },
}

export const SinglePost: Story = {
  args: {
    posts: SAMPLE_POSTS.slice(0, 1),
    composeButton,
  },
}

export const Empty: Story = {
  args: {
    posts: [],
    composeButton,
    emptyAction: <Button size="sm">Write first post</Button>,
  },
}

export const EmptyReadOnly: Story = {
  name: 'Empty (no write permission)',
  args: {
    posts: [],
  },
}
