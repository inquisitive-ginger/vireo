import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { SegmentedControl } from './segmented-control'

const meta: Meta<typeof SegmentedControl> = {
  title: 'Primitives/SegmentedControl',
  component: SegmentedControl,
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof SegmentedControl>

const VIEW_OPTIONS = [
  { value: 'month', label: 'Month' },
  { value: 'week', label: 'Week' },
  { value: 'day', label: 'Day' },
]

function ViewSwitch() {
  const [view, setView] = useState('month')
  return (
    <SegmentedControl
      aria-label="Calendar view"
      options={VIEW_OPTIONS}
      value={view}
      onChange={setView}
    />
  )
}

function ScopeToggle() {
  const [scope, setScope] = useState('mine')
  return (
    <SegmentedControl
      aria-label="Task scope"
      options={[
        { value: 'mine', label: 'Mine' },
        { value: 'everyone', label: 'Everyone' },
      ]}
      value={scope}
      onChange={setScope}
    />
  )
}

// ─── Interactive ────────────────────────────────────────────────────────────

export const Interactive: Story = {
  name: 'Calendar view switch',
  render: () => <ViewSwitch />,
}

// ─── Two options ────────────────────────────────────────────────────────────

export const TwoOptions: Story = {
  name: 'Two-option toggle',
  render: () => <ScopeToggle />,
}
