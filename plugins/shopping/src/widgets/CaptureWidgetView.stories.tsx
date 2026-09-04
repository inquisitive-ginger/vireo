import type { Meta, StoryObj } from '@storybook/react'
import { CaptureWidgetView } from './CaptureWidgetView'
import type { RecentItem } from '../types'

/* The zero-navigation capture on the home dashboard. The slot height comes from
   the viewport, so review it at both heights — the tile must show whole rows and
   state the remainder, never crop one (design-system.md §"A widget list fits its
   slot"). */

const item = (id: string, name: string, listName = 'Grocery'): RecentItem => ({
  id,
  name,
  listName,
  category: 'Produce',
  quantity: null,
  status: 'needed',
  listId: 'grocery',
  addedAt: '2026-09-04T12:00:00.000Z',
  note: null,
})

const meta: Meta<typeof CaptureWidgetView> = {
  title: 'Shopping/CaptureWidgetView',
  component: CaptureWidgetView,
  decorators: [
    (Story) => (
      <div className="h-[180px] w-[380px] rounded-panel border border-border bg-card">
        <Story />
      </div>
    ),
  ],
  args: {
    items: [
      item('1', 'snap peas'),
      item('2', 'wood screws', 'Hardware'),
      item('3', 'tortillas'),
      item('4', 'milk'),
      item('5', 'paper towels', 'Costco'),
      item('6', 'black beans'),
    ],
    openCount: 19,
    loading: false,
    error: false,
    destination: 'Grocery',
    onAdd: () => {},
    onDraftChange: () => {},
    draftAisle: null,
    addError: null,
    canAdd: true,
  },
}
export default meta
type Story = StoryObj<typeof CaptureWidgetView>

/* The 2×1 slot it ships in — one or two whole rows and the remainder stated. */
export const Standard: Story = {}

/* A taller slot fits more rows without any variant knowing how many. */
export const Tall: Story = {
  decorators: [
    (Story) => (
      <div className="h-[376px] w-[380px] rounded-panel border border-border bg-card">
        <Story />
      </div>
    ),
  ],
}

export const Composing: Story = { args: { draftAisle: 'Pantry' } }

export const NothingWaiting: Story = { args: { items: [], openCount: 0 } }

/* The read failed. "Nothing waiting" would be a false claim about the house. */
export const ReadFailed: Story = { args: { items: [], error: true } }

export const AddFailed: Story = { args: { addError: 'milk' } }
