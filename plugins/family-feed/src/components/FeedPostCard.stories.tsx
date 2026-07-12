import type { Meta, StoryObj } from '@storybook/react'
import { FeedPostCard } from './FeedPostCard'
import { SAMPLE_POSTS } from '../sample-posts'
import { StoryAnnotation } from '../story-annotation'

const meta: Meta<typeof FeedPostCard> = {
  title: 'Family Feed/FeedPostCard',
  component: FeedPostCard,
  parameters: { layout: 'padded' },
  decorators: [
    (Story, ctx) => (
      <div style={{ maxWidth: 640, background: 'var(--background)', padding: 24 }}>
        <StoryAnnotation>{ctx.parameters.annotation}</StoryAnnotation>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof FeedPostCard>

export const Note: Story = {
  args: { post: SAMPLE_POSTS[0] },
  parameters: {
    annotation:
      'note variant (default) — card + full-height identity edge + Lora prose · feed page',
  },
}

export const Plain: Story = {
  name: 'Plain (widget use)',
  args: { post: SAMPLE_POSTS[0], variant: 'plain', lineClamp: 2 },
  parameters: {
    annotation: 'plain variant — no card chrome; WidgetSlot provides the surface',
  },
}

export const LongBody: Story = {
  args: { post: SAMPLE_POSTS[4] },
  parameters: { annotation: 'long body — no clamp on the feed page; card grows' },
}

export const IdentityRange: Story = {
  name: 'Identity colors (one per author)',
  parameters: {
    annotation: 'identity spines — hash-assigned hues today, explicit assignment planned (ADR 030)',
  },
  render: () => (
    <div className="flex flex-col" style={{ gap: 12 }}>
      {['Sarah', 'Marcus', 'Emma', 'Jake', 'Zoë', 'Grandma June'].map((name) => (
        <FeedPostCard
          key={name}
          post={{
            id: name,
            body: `A note from ${name} — each family member keeps the same color everywhere.`,
            createdAt: new Date(Date.now() - 18 * 60_000).toISOString(),
            author: { id: name, name, avatarUrl: null, identityHue: null },
          }}
        />
      ))}
    </div>
  ),
}
