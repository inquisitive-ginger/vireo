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
      { id: '1', name: 'snap peas' },
      { id: '2', name: 'tortillas' },
      { id: '3', name: 'milk' },
      { id: '4', name: 'wood screws' },
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
    onRemove: () => {},
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

/* A tier-1 profile — the unattended wall included — can add but not remove, so
   the chips carry no way back (ADR 071: `manage` is tier 4). */
export const CannotRemove: Story = { args: { onRemove: undefined } }
