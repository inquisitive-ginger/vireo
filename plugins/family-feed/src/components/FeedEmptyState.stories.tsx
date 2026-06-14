import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@family-os/ui'
import { FeedEmptyState } from './FeedEmptyState'
import { StoryAnnotation } from '../story-annotation'

const meta: Meta<typeof FeedEmptyState> = {
  title: 'Family Feed/FeedEmptyState',
  component: FeedEmptyState,
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
type Story = StoryObj<typeof FeedEmptyState>

export const Default: Story = {
  parameters: {
    annotation: 'full anatomy — feed page; icon + display-lg heading + body (design system spec)',
  },
}

export const WithAction: Story = {
  args: {
    compose: <Button size="sm">Write first post</Button>,
  },
  parameters: {
    annotation: 'with CTA — permission-gated by the parent; absent when can() = false',
  },
}

export const Compact: Story = {
  args: { compact: true },
  parameters: {
    annotation: 'compact variant — 1-row widget slots (~180px); card-title heading, no icon',
  },
}
