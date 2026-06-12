import type { Meta, StoryObj } from '@storybook/react'
import { Button, WidgetSlot } from '@family-os/ui'
import { FeedWidgetView } from './FeedWidgetView'
import { SAMPLE_POSTS } from '../sample-posts'

// Widget rendered inside a real WidgetSlot at exact slot dimensions
// from the widget taxonomy (ADR 022).
function slotDecorator(width: number, height: number) {
  return (Story: React.ComponentType) => (
    <div
      style={{
        width,
        height,
        background: 'var(--background)',
        padding: 24,
        boxSizing: 'content-box',
      }}
    >
      <WidgetSlot>
        <Story />
      </WidgetSlot>
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
  name: 'Standard (2×1 · 522×180)',
  args: { posts: SAMPLE_POSTS },
  decorators: [slotDecorator(522, 180)],
}

export const Banner: Story = {
  name: 'Banner (4×1 · 1060×180)',
  args: { posts: SAMPLE_POSTS },
  decorators: [slotDecorator(1060, 180)],
}

export const Large: Story = {
  name: 'Large (2×2 · 522×376)',
  args: { posts: SAMPLE_POSTS },
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
  decorators: [slotDecorator(522, 180)],
}
