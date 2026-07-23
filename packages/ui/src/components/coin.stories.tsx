import type { Meta, StoryObj } from '@storybook/react'
import { Coin, CoinValue } from './coin'
import { ItemCard } from './item-card'
import { identityToken } from '../lib/identity'

/* The F$ currency mark (ADR 051). The coin is one struck brass disc — separated from a
   member's identity spine by FORM (relief, a swept rim, a specular gloss), which a flat
   4px spine can never have. Review it beside a marigold spine: the two must not read as
   the same colour doing two jobs. */

const meta: Meta<typeof Coin> = {
  title: 'Primitives/Coin',
  component: Coin,
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof Coin>

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      <Coin size={14} />
      <Coin size={18} />
      <Coin size={26} />
      <Coin size={44} />
      <Coin size={72} />
    </div>
  ),
}

export const Values: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <CoinValue value={2} />
      <CoinValue value={5} />
      <CoinValue value={10} />
      <CoinValue value={40} />
    </div>
  ),
}

/* The collision check ADR 051 exists to pass: a gold coin beside a member assigned
   marigold. Separation is form, not hue. */
export const OnChoreRows: Story = {
  render: () => (
    <div className="max-w-[420px] space-y-2">
      <ItemCard spine={identityToken('marigold')} align="center">
        <div className="min-w-0 flex-1">
          <p className="text-card-title truncate">Mow the lawn</p>
          <p className="text-sm-token text-muted-foreground">Due Saturday</p>
        </div>
        <CoinValue value={5} size={16} />
      </ItemCard>
      <ItemCard spine={identityToken('teal')} align="center">
        <div className="min-w-0 flex-1">
          <p className="text-card-title truncate">Empty the dishwasher</p>
          <p className="text-sm-token text-muted-foreground">Today</p>
        </div>
        <CoinValue value={2} size={16} />
      </ItemCard>
    </div>
  ),
}
