import type { Meta, StoryObj } from '@storybook/react'
import { CheckCircle2, CalendarDays, Package } from 'lucide-react'
import { Button } from './button'
import { EmptyState } from './empty-state'

const meta: Meta<typeof EmptyState> = {
  title: 'Primitives/EmptyState',
  component: EmptyState,
  parameters: { layout: 'centered' },
}
export default meta
type Story = StoryObj<typeof EmptyState>

// Full pattern: icon → heading (display-lg) → body (body) → CTA
export const Anatomy: Story = {
  name: 'Anatomy — full pattern',
  args: {
    icon: CheckCircle2,
    heading: 'All done!',
    body: 'Nothing left for today. Tasks will appear here when assigned.',
    action: (
      <Button variant="outline" size="sm">
        View completed
      </Button>
    ),
  },
}

export const HeadingOnly: Story = {
  name: 'Icon + heading only',
  args: { icon: CheckCircle2, heading: 'All done!' },
}

export const HeadingAndBody: Story = {
  name: 'Icon + heading + body',
  args: { icon: CalendarDays, heading: 'No events today', body: 'Your schedule is clear.' },
}

export const WithCta: Story = {
  name: 'Icon + heading + body + CTA',
  args: {
    icon: Package,
    heading: 'No plugins installed',
    body: 'Browse the marketplace to add modules for your family.',
    action: <Button size="sm">Browse marketplace</Button>,
  },
}

// Tier 1: simple, positive vocabulary. Tier 2+: full context.
export const TierOneCopy: Story = {
  name: 'Tier 1 — simple, positive',
  args: { icon: CheckCircle2, heading: "You're all done!", body: 'Great job today.' },
}

export const TierTwoPlusCopy: Story = {
  name: 'Tier 2+ — context',
  args: {
    icon: CheckCircle2,
    heading: 'No tasks assigned',
    body: 'Tasks will appear here once a parent assigns them.',
  },
}

// Compact variant for ~180px widget slots: icon dropped, smaller type.
export const Compact: Story = {
  name: 'Compact — widget slot',
  args: {
    heading: 'Nothing on the board yet',
    body: 'Be the first to leave a note.',
    compact: true,
  },
}
