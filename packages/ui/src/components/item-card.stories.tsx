import type { Meta, StoryObj } from '@storybook/react'
import { ItemCard } from './item-card'
import { CompletionToggle } from './completion-toggle'
import { identityColor } from '../lib/identity'

const meta: Meta<typeof ItemCard> = {
  title: 'Primitives/ItemCard',
  component: ItemCard,
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof ItemCard>

const Body = ({ title, meta }: { title: string; meta: string }) => (
  <div className="min-w-0 flex-1">
    <span className="text-card-title block text-foreground">{title}</span>
    <span className="text-sm-token text-muted-foreground">{meta}</span>
  </div>
)

// ─── Card chrome ────────────────────────────────────────────────────────────

export const Card: Story = {
  name: 'Card chrome + identity spine',
  render: () => (
    <ItemCard spine={identityColor('Maya')}>
      <Body title="Soccer practice" meta="Maya · 4:00 PM · Field 2" />
    </ItemCard>
  ),
}

// ─── Split spine (multi-member / shared) ────────────────────────────────────

export const SplitSpine: Story = {
  name: 'Split spine (shared event)',
  render: () => (
    <ItemCard spine={[identityColor('Maya'), identityColor('Noah')]}>
      <Body title="Grocery run" meta="Maya · Noah · 10:00 AM" />
    </ItemCard>
  ),
}

// ─── Bare chrome (widget slot owns its container) ───────────────────────────

export const Bare: Story = {
  name: 'Bare chrome (widget row)',
  render: () => (
    <div className="max-w-sm rounded-card border border-border bg-card p-4">
      <ItemCard chrome="bare" spine={identityColor('Avery')}>
        <Body title="Took out the recycling" meta="Avery · 12m ago" />
      </ItemCard>
    </div>
  ),
}

// ─── Center align + trailing control (chores) ───────────────────────────────

export const Trailing: Story = {
  name: 'Center align + trailing toggle',
  render: () => (
    <ItemCard
      spine="var(--border)"
      align="center"
      trailing={<CompletionToggle checked={false} size={40} label="Mark done" />}
    >
      <div className="min-w-0 flex-1">
        <span className="text-card-title block text-foreground">Empty the dishwasher</span>
        <span className="text-sm-token text-muted-foreground">Due today</span>
      </div>
    </ItemCard>
  ),
}

// ─── Dimmed (completed) ─────────────────────────────────────────────────────

export const Dimmed: Story = {
  name: 'Dimmed (completed)',
  render: () => (
    <ItemCard
      spine="var(--success)"
      align="center"
      dimmed
      trailing={<CompletionToggle checked size={40} label="Reopen" />}
    >
      <div className="min-w-0 flex-1">
        <span className="text-card-title block text-muted-foreground line-through">
          Empty the dishwasher
        </span>
      </div>
    </ItemCard>
  ),
}

// ─── Stack ──────────────────────────────────────────────────────────────────

export const Stack: Story = {
  name: 'Card stack',
  render: () => (
    <div className="flex max-w-md flex-col gap-2">
      <ItemCard spine={identityColor('Maya')}>
        <Body title="Soccer practice" meta="Maya · 4:00 PM" />
      </ItemCard>
      <ItemCard spine={identityColor('Noah')}>
        <Body title="Dentist" meta="Noah · 9:30 AM" />
      </ItemCard>
      <ItemCard>
        <Body title="Family movie night" meta="Family · 7:00 PM" />
      </ItemCard>
    </div>
  ),
}
