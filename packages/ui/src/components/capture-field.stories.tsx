import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ChevronDown } from 'lucide-react'
import { CaptureField } from './capture-field'

/* The catch half of the capture taxonomy (ADR 070). `ComposeForm` is the other
   half — see design-system.md §Capture primitives for the rule. */

const meta: Meta<typeof CaptureField> = {
  title: 'Primitives/CaptureField',
  component: CaptureField,
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof CaptureField>

const DestinationChip = () => (
  <span className="text-sm-token flex h-8.5 shrink-0 items-center gap-1.5 rounded-full bg-secondary px-2.5 font-semibold text-secondary-foreground">
    Grocery
    <ChevronDown size={14} aria-hidden />
  </span>
)

export const Inline: Story = {
  render: () => (
    <div className="max-w-sm">
      <CaptureField onSubmit={() => {}} placeholder="Add something" label="Add something" />
    </div>
  ),
}

export const Hero: Story = {
  name: 'Page hero, with a scope slot',
  render: () => (
    <div className="max-w-sm">
      <CaptureField
        size="hero"
        onSubmit={() => {}}
        placeholder="Add to Grocery"
        label="Add to Grocery"
        trailing={<DestinationChip />}
      />
    </div>
  ),
}

export const Wall: Story = {
  name: 'Wall tablet (across-the-room)',
  render: () => (
    <div className="max-w-2xl">
      <CaptureField
        size="wall"
        onSubmit={() => {}}
        placeholder="Milk, batteries, dog food…"
        label="What do we need?"
      />
    </div>
  ),
}

export const ClearsAndStays: Story = {
  name: 'Clears and stays open',
  render: function ClearsAndStaysStory() {
    const [caught, setCaught] = useState<string[]>([])
    return (
      <div className="max-w-sm">
        <CaptureField
          size="hero"
          onSubmit={(v) => setCaught((c) => [...c, v])}
          placeholder="Add to Grocery"
          label="Add to Grocery"
        />
        <ul className="text-sm-token mt-3 text-muted-foreground">
          {caught.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>
    )
  },
}
