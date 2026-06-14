import type { Meta, StoryObj } from '@storybook/react'
import { Button, WidgetSlot } from '@family-os/ui'
import { FeedWidgetView } from './FeedWidgetView'
import { SAMPLE_POSTS } from '../sample-posts'
import { StoryAnnotation } from '../story-annotation'

// Widget rendered inside a real WidgetSlot at exact slot dimensions
// from the widget taxonomy (ADR 022).
function slotDecorator(width: number, height: number) {
  return (Story: React.ComponentType, ctx: { parameters: { annotation?: string } }) => (
    <div style={{ background: 'var(--background)', padding: 24 }}>
      <StoryAnnotation>{ctx.parameters.annotation}</StoryAnnotation>
      <div style={{ width, height }}>
        <WidgetSlot>
          <Story />
        </WidgetSlot>
      </div>
    </div>
  )
}

const meta: Meta<typeof FeedWidgetView> = {
  title: 'Family Feed/Feed Widget',
  component: FeedWidgetView,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof FeedWidgetView>

export const Standard: Story = {
  name: 'Standard (2×1)',
  args: { posts: SAMPLE_POSTS },
  parameters: { annotation: 'standard 2×1 · 522×180 — default slot in tier 1–4 home layouts' },
  decorators: [slotDecorator(522, 180)],
}

export const Banner: Story = {
  name: 'Banner (4×1)',
  args: { posts: SAMPLE_POSTS },
  parameters: { annotation: 'banner 4×1 · 1060×180 — family pseudo-profile home layout' },
  decorators: [slotDecorator(1060, 180)],
}

export const Large: Story = {
  name: 'Large (2×2)',
  args: { posts: SAMPLE_POSTS },
  parameters: { annotation: 'large 2×2 · 522×376 — multi-post layout via container query' },
  decorators: [slotDecorator(522, 376)],
}

export const EmptyStandard: Story = {
  name: 'Empty (standard)',
  args: {
    posts: [],
    emptyAction: (
      <Button size="sm" variant="outline">
        New Post
      </Button>
    ),
  },
  parameters: {
    annotation: 'empty — compact variant; CTA is permission-gated by the container',
  },
  decorators: [slotDecorator(522, 180)],
}
