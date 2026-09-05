import type { Meta, StoryObj } from '@storybook/react'
import { ShoppingCaptureHero } from './ShoppingCaptureHero'

/* The top block of `/shopping` at tablet width and up (design.md §"One surface,
   two layouts", artifact frame W2). Judge it from across a room, not at this
   laptop. In the app the aisle list renders directly beneath it — this story
   shows the block alone. */

const meta: Meta<typeof ShoppingCaptureHero> = {
  title: 'Shopping/ShoppingCaptureHero',
  component: ShoppingCaptureHero,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="h-screen">
        <Story />
      </div>
    ),
  ],
  args: {
    openCount: 19,
    destinations: (
      <div className="flex gap-2">
        <span className="text-sm-token rounded-full border-2 border-primary bg-primary/13 px-3.5 py-1.5 font-semibold text-primary">
          Grocery 14
        </span>
        <span className="text-sm-token rounded-full border-2 border-border px-3.5 py-1.5">
          Costco 3
        </span>
      </div>
    ),
    onShowLists: () => {},
    loading: false,
    destination: 'Grocery',
    onAdd: () => {},
    report: null,
    canAdd: true,
  },
}
export default meta
type Story = StoryObj<typeof ShoppingCaptureHero>

export const AtRest: Story = {}

/* Nothing waiting anywhere. The seam still states it rather than going blank. */
export const NothingYet: Story = { args: { openCount: 0 } }

/* The add did not land. The field cleared on Enter, so this line is the only
   thing standing between the person and a word they think they said. */
export const AddFailed: Story = {
  args: {
    report: {
      tone: 'error',
      message: 'Couldn’t add “oat milk”',
      actions: [],
      onDismiss: () => {},
    },
  },
}

/* SH-03 — the collision, in the one report slot. */
export const Duplicate: Story = {
  args: {
    report: {
      tone: 'notice',
      message: 'Already on Grocery.',
      actions: [{ label: 'Take it back?', onSelect: () => {} }],
      onDismiss: () => {},
    },
  },
}

/* `shopping.item.add` revoked for this profile (ADR 072 §6) — the one lever that
   closes the wall's field. */
export const AddingRevoked: Story = { args: { canAdd: false } }

/* The window closed between fetches. Expected, and shown. */
export const RetractRefused: Story = {
  args: {
    report: {
      tone: 'error',
      message: 'Too late to take back “snap peas” — it has been on the list a while.',
      actions: [],
      onDismiss: () => {},
    },
  },
}
