import type { Meta, StoryObj } from '@storybook/react'
import { PenLine } from 'lucide-react'
import { Button, ComposeForm } from '@family-os/ui'
import { FeedPageView } from './FeedPageView'
import { SAMPLE_POSTS } from '../sample-posts'
import { StoryAnnotation } from '../story-annotation'

const meta: Meta<typeof FeedPageView> = {
  title: 'Family Feed/Feed Page',
  component: FeedPageView,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story, ctx) => (
      <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
        <div style={{ padding: '16px 24px 0' }}>
          <StoryAnnotation>{ctx.parameters.annotation}</StoryAnnotation>
        </div>
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
    Add post
  </Button>
)

export const Default: Story = {
  args: {
    posts: SAMPLE_POSTS,
    composeButton,
    hasMore: true,
  },
  parameters: {
    annotation:
      'day-grouped bulletin · ≤680px column in tablet main content · tier with write permission',
  },
}

export const Composing: Story = {
  args: {
    posts: SAMPLE_POSTS,
    composeForm: <ComposeForm authorName="Sarah" onSubmit={() => {}} onCancel={() => {}} />,
  },
  parameters: {
    annotation: 'compose open — raised card (--shadow-raised) above the feed; header button hidden',
  },
}

export const SinglePost: Story = {
  args: {
    posts: SAMPLE_POSTS.slice(0, 1),
    composeButton,
  },
  parameters: { annotation: 'single post — one day group, no load-more' },
}

export const Empty: Story = {
  args: {
    posts: [],
    composeButton,
    emptyAction: <Button size="sm">Write first post</Button>,
  },
  parameters: { annotation: 'empty — full anatomy; CTA is permission-gated by the container' },
}

export const EmptyReadOnly: Story = {
  name: 'Empty (no write permission)',
  args: {
    posts: [],
  },
  parameters: {
    annotation: 'empty · tier 1 / family pseudo-profile — no CTA, no compose button',
  },
}
