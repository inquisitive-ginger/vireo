import type { Meta, StoryObj } from '@storybook/react'
import { ShoppingPageView } from './ShoppingPageView'
import type { ShoppingItem } from '../types'

/* The /shopping surface — design.md §Anatomy, artifact frames S1 and S2. */

const item = (id: string, name: string, category: string, note?: string): ShoppingItem => ({
  id,
  name,
  category,
  quantity: null,
  status: 'needed',
  listId: 'grocery',
  addedAt: '2026-09-03T12:00:00.000Z',
  note: note ?? null,
})

const meta: Meta<typeof ShoppingPageView> = {
  title: 'Shopping/ShoppingPageView',
  component: ShoppingPageView,
  parameters: { layout: 'fullscreen' },
  args: {
    lists: [
      { id: 'grocery', name: 'Grocery', kind: 'permanent', groupByAisle: true, itemCount: 14 },
      { id: 'costco', name: 'Costco', kind: 'permanent', groupByAisle: true, itemCount: 3 },
      { id: 'hardware', name: 'Hardware', kind: 'runtime', groupByAisle: false, itemCount: 2 },
    ],
    selectedListId: 'grocery',
    onSelectList: () => {},
    groups: [
      {
        aisle: 'Produce',
        items: [
          item('1', 'snap peas', 'Produce', 'for Thursday'),
          item('2', 'bananas', 'Produce'),
          item('3', 'cilantro', 'Produce'),
        ],
      },
      {
        aisle: 'Dairy',
        items: [item('4', 'milk', 'Dairy'), item('5', 'greek yogurt', 'Dairy')],
      },
      {
        aisle: 'Meat',
        items: [
          // The pushed row (M5.5/3): its note is the PRODUCER's words, carried
          // across the contract — artifact frame S1 shows exactly this line.
          item('6', 'chicken thighs', 'Meat', 'for Thursday'),
          item('7', 'ground beef', 'Meat'),
        ],
      },
    ],
    loading: false,
    openCount: 14,
    onAdd: () => {},
    onDraftChange: () => {},
    draftAisle: null,
    addError: null,
    canAdd: true,
    layout: 'narrow',
    justAdded: [],
    totalOpenCount: 19,
    showLists: true,
    onToggleLists: () => {},
  },
}
export default meta
type Story = StoryObj<typeof ShoppingPageView>

export const AtRest: Story = {
  name: 'S1 — at rest',
}

export const Typing: Story = {
  name: 'S2 — typing (the filing stated before the commit)',
  args: { draftAisle: 'Pantry' },
}

// A destination with no aisles of ours renders flat — one group, no headers.
export const FlatList: Story = {
  name: 'A list with no aisles of ours',
  args: {
    lists: [
      { id: 'hardware', name: 'Hardware', kind: 'runtime', groupByAisle: false, itemCount: 3 },
    ],
    selectedListId: 'hardware',
    groups: [
      {
        aisle: '',
        items: [
          item('h1', 'wood screws', 'Other'),
          item('h2', 'painters tape', 'Other'),
          item('h3', 'furnace filter', 'Other'),
        ],
      },
    ],
    openCount: 3,
  },
}

export const Empty: Story = {
  args: {
    lists: [
      { id: 'grocery', name: 'Grocery', kind: 'permanent', groupByAisle: true, itemCount: 0 },
      { id: 'costco', name: 'Costco', kind: 'permanent', groupByAisle: true, itemCount: 3 },
    ],
    groups: [],
    openCount: 0,
  },
}

export const AddFailed: Story = {
  args: { addError: 'tortillas' },
}

/* The SAME component at tablet width and up — one surface, two layouts, picked
   by the viewport (design.md). Capture fills the screen and the lists come in
   only when asked for. Compare against artifact frame W2. */
export const Wide: Story = {
  args: {
    layout: 'wide',
    showLists: false,
    justAdded: [
      { id: 'r1', name: 'snap peas' },
      { id: 'r2', name: 'tortillas' },
      { id: 'r3', name: 'milk' },
      { id: 'r4', name: 'wood screws' },
    ],
  },
}

export const WideComposing: Story = {
  args: { ...Wide.args, draftAisle: 'Pantry' },
}

/* After `Show lists` — the same list, in place, with the hero still above it so
   the way back to capture is never off-screen. */
export const WideListsShown: Story = {
  args: { ...Wide.args, showLists: true },
}

/* Nobody has walked up to it today. The strip says so rather than sitting empty. */
export const WideNothingYet: Story = {
  args: { ...Wide.args, justAdded: [] },
}
