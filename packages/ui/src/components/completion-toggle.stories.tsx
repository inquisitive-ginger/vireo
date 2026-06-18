import type { Meta, StoryObj } from '@storybook/react'
import { CompletionToggle } from './completion-toggle'

const meta: Meta<typeof CompletionToggle> = {
  title: 'Primitives/CompletionToggle',
  component: CompletionToggle,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof CompletionToggle>

export const Incomplete: Story = {
  args: { checked: false, onToggle: () => {}, label: 'Mark done' },
}

export const Complete: Story = {
  name: 'Complete (interactive — reopen)',
  args: { checked: true, onToggle: () => {}, label: 'Reopen', title: 'Mark not done' },
}

export const StaticComplete: Story = {
  name: 'Static (read-only done)',
  args: { checked: true },
}

export const Muted: Story = {
  name: 'Muted ring (mid-flight)',
  args: { checked: false, muted: true },
}

export const Small: Story = {
  name: 'Admin row size (28)',
  args: { checked: false, size: 28, onToggle: () => {}, label: 'Mark done' },
}
