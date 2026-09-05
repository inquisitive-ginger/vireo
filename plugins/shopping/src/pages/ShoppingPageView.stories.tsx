import type { Meta, StoryObj } from '@storybook/react'
import { ShoppingPageView } from './ShoppingPageView'
import type { ShoppingItem } from '../types'

/* The /shopping surface — design.md §Anatomy, artifact frames S1 and S2. */

const item = (
  id: string,
  name: string,
  category: string,
  note?: string,
  status: ShoppingItem['status'] = 'needed'
): ShoppingItem => ({
  id,
  name,
  category,
  quantity: null,
  status,
  listId: 'grocery',
  addedAt: '2026-09-03T12:00:00.000Z',
  note: note ?? null,
  canRetract: true,
})

const gotItem = (id: string, name: string, category: string): ShoppingItem =>
  item(id, name, category, undefined, 'got')

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
    onAdd: () => {},
    reports: [],
    canAdd: true,
    canCheck: true,
    canFile: false,
    canManage: false,
    canRetract: false,
    onToggle: () => {},
    onRefile: () => {},
    onRename: () => {},
    onRemove: () => {},
    onRowRetract: () => {},
    rowErrors: {},
    layout: 'list',
    totalOpenCount: 19,
    onShowLists: () => {},
  },
}
export default meta
type Story = StoryObj<typeof ShoppingPageView>

export const AtRest: Story = {
  name: 'S1 — at rest',
}

/* Mid-shop — one arithmetic, `{list} · {n} left`, the same figure the pill
   above reports over the same rows (SH-10/11). */
export const MidShop: Story = {
  name: 'S3 — in a shop',
  args: {
    groups: [
      { aisle: 'Produce', items: [gotItem('1', 'snap peas', 'Produce')] },
      {
        aisle: 'Dairy',
        items: [gotItem('4', 'milk', 'Dairy'), item('5', 'greek yogurt', 'Dairy')],
      },
    ],
  },
}

/* The walk gets an ending (SH-07). It replaces the meter and nothing else — the
   field, the pills and every aisle summary stay live. */
export const Cleared: Story = {
  name: 'The list is clear',
  args: {
    groups: [
      { aisle: 'Produce', items: [gotItem('1', 'snap peas', 'Produce')] },
      { aisle: 'Dairy', items: [gotItem('4', 'milk', 'Dairy')] },
    ],
  },
}

/* Every verb permitted, so both edges bind. A reader with none of the three gets
   no gesture on either edge. */
export const AllVerbs: Story = {
  name: 'Tier 4 — both edges bind',
  args: { canFile: true, canManage: true, canRetract: true },
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
  },
}

export const Empty: Story = {
  args: {
    lists: [
      { id: 'grocery', name: 'Grocery', kind: 'permanent', groupByAisle: true, itemCount: 0 },
      { id: 'costco', name: 'Costco', kind: 'permanent', groupByAisle: true, itemCount: 3 },
    ],
    groups: [],
  },
}

export const AddFailed: Story = {
  args: {
    reports: [
      {
        tone: 'error',
        message: 'Couldn’t add “bread” · 1 more',
        actions: [],
        onDismiss: () => {},
      },
    ],
  },
}

/* SH-03 — the collision caught where it happens. Two clauses: the fact, and the
   only thing to do about it. */
export const Duplicate: Story = {
  args: {
    reports: [
      {
        tone: 'notice',
        message: 'Already on Grocery.',
        actions: [{ label: 'Take it back?', onSelect: () => {} }],
        onDismiss: () => {},
      },
    ],
  },
}

/* The SAME component at tablet width and up — one surface, two layouts, picked
   by the viewport (design.md). Capture fills the screen and the lists come in
   only when asked for. Compare against artifact frame W2. */
export const Wide: Story = {
  args: { layout: 'capture' },
}

/* Three names on one Enter, all three already on the list. The stack grows
   DOWNWARD into the space under the pills and moves nothing above it — the slot
   hangs out of flow, so a notice cannot shift the field. Each line names itself,
   because with three submitted the reader cannot tell which one collided. */
export const WideDuplicatesStacked: Story = {
  name: 'Wide — three collisions at once',
  args: {
    layout: 'capture',
    reports: ['milk', 'eggs', 'bread'].map((name) => ({
      tone: 'notice' as const,
      message: `“${name}” already on Grocery.`,
      actions: [{ label: 'Take it back?', onSelect: () => {} }],
      onDismiss: () => {},
    })),
  },
}

/* After `Show lists` — the same list, in place, with the hero still above it so
   the way back to capture is never off-screen. */
export const WideListsShown: Story = {
  args: { ...Wide.args },
}

/* Nobody has walked up to it today. The strip says so rather than sitting empty. */
export const WideNothingYet: Story = {
  args: { ...Wide.args },
}

/* The same screen, scrolled, mid-shop — Produce cleared and collapsed, Dairy
   part-done, the status line and meter pinned. Nothing switched modes. */
export const InTheAisle: Story = {
  name: 'S3 — in the aisle',
  args: {
    // `itemCount` is the OPEN count the index endpoint sends, so it falls as the
    // walk proceeds. Inheriting the at-rest 14 drew a screen the API cannot
    // produce: the pill said Grocery 14 while the title said 4 to get and the
    // meter said 4 of 8 — three numbers for one list, none of them agreeing.
    lists: [
      { id: 'grocery', name: 'Grocery', kind: 'permanent', groupByAisle: true, itemCount: 4 },
      { id: 'costco', name: 'Costco', kind: 'permanent', groupByAisle: true, itemCount: 3 },
      { id: 'hardware', name: 'Hardware', kind: 'runtime', groupByAisle: false, itemCount: 2 },
    ],
    groups: [
      {
        aisle: 'Produce',
        items: [
          item('1', 'snap peas', 'Produce', 'for Thursday', 'got'),
          item('2', 'bananas', 'Produce', undefined, 'got'),
          item('3', 'cilantro', 'Produce', undefined, 'got'),
        ],
      },
      {
        aisle: 'Dairy',
        items: [
          item('4', 'milk', 'Dairy', undefined, 'got'),
          item('5', 'greek yogurt', 'Dairy'),
          item('6', 'butter', 'Dairy'),
        ],
      },
      {
        aisle: 'Meat',
        items: [
          item('7', 'chicken thighs', 'Meat', 'for Thursday'),
          item('8', 'ground beef', 'Meat'),
        ],
      },
    ],
  },
}

/* AC9. Tier 4 only — below it the control is absent, not disabled. */
export const CanCorrectTheAisle: Story = {
  name: 'The aisle correction (tier 4)',
  args: { canFile: true },
}

/* A check that never reached the server. The row that was tapped is the row that
   answers — a page-scoped line names nothing when thirty rows look alike. */
export const CheckFailed: Story = {
  args: {
    canCheck: true,
    rowErrors: { '4': "Didn't reach the list — check your connection and tap again." },
  },
}

/* `shopping.item.check` revoked: the list still reads, it just does not move. */
export const CheckRevoked: Story = {
  args: { canCheck: false },
}
