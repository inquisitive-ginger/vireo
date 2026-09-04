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
    justAdded: [
      { id: '1', name: 'snap peas', canRetract: true },
      { id: '2', name: 'tortillas', canRetract: true },
      { id: '3', name: 'milk', canRetract: false },
      { id: '4', name: 'wood screws', canRetract: false },
    ],
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
    onRetract: () => {},
    retractError: null,
    onShowLists: () => {},
    loading: false,
    destination: 'Grocery',
    onAdd: () => {},
    onDraftChange: () => {},
    draftAisle: null,
    addError: null,
    canAdd: true,
  },
}
export default meta
type Story = StoryObj<typeof ShoppingCaptureHero>

export const AtRest: Story = {}

/* The filing echo, stated before the commit — the one moment a mis-file is
   catchable by the person who caused it. */
export const Composing: Story = { args: { draftAisle: 'Pantry' } }

/* The short memory is empty. Not a gap — a wall nobody has walked up to today. */
export const NothingYet: Story = { args: { justAdded: [], openCount: 0 } }

/* The add did not land. The field cleared on Enter, so this line is the only
   thing standing between the person and a word they think they said. */
export const AddFailed: Story = { args: { addError: 'oat milk' } }

/* `shopping.item.add` revoked for this profile (ADR 072 §6) — the one lever that
   closes the wall's field. */
export const AddingRevoked: Story = { args: { canAdd: false } }

/* Past the fifteen-minute window, or somebody else's adds: `canRetract` is false
   and the chips carry no way back (ADR 073). */
export const NothingRetractable: Story = {
  args: {
    justAdded: [
      { id: '1', name: 'snap peas', canRetract: false },
      { id: '2', name: 'tortillas', canRetract: false },
    ],
  },
}

/* The window closed between fetches. Expected, and shown. */
export const RetractRefused: Story = {
  args: { retractError: 'Too late to take back “snap peas” — it has been on the list a while.' },
}
