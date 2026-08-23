import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { GroceryListPageView } from './GroceryListPageView'
import type { GroceryItem, GroceryList, Staple } from '../types'

function item(overrides: Partial<GroceryItem> = {}): GroceryItem {
  return {
    id: 'item-1',
    name: 'Milk',
    category: 'Dairy',
    quantity: null,
    status: 'needed',
    sourceType: 'manual',
    sourceId: null,
    addedBy: 'profile-1',
    note: null,
    listId: 'list-1',
    hasOverride: false,
    ...overrides,
  }
}

function list(overrides: Partial<GroceryList> = {}): GroceryList {
  return {
    id: 'list-1',
    name: 'Grocery Store',
    kind: 'permanent',
    groupByAisle: true,
    itemCount: 0,
    ...overrides,
  }
}

const STAPLES: Staple[] = [
  { id: 's1', name: 'Milk', category: 'Dairy', active: true },
  { id: 's2', name: 'Eggs', category: 'Dairy', active: true },
]

function renderView(props: Partial<Parameters<typeof GroceryListPageView>[0]> = {}) {
  return render(
    <GroceryListPageView
      list={list()}
      items={[]}
      staples={STAPLES}
      canAdd
      canCorrect
      flashItemId={null}
      errorMessage={null}
      onBack={vi.fn()}
      onAdd={vi.fn().mockResolvedValue(undefined)}
      onTapStaple={vi.fn()}
      onCorrect={vi.fn()}
      {...props}
    />
  )
}

describe('GroceryListPageView', () => {
  it('shows the list name as the page title', () => {
    renderView({ list: list({ name: 'Costco' }) })
    expect(screen.getByText('Costco')).toBeInTheDocument()
  })

  it('the back button calls onBack — the only way out is up to the index', () => {
    const onBack = vi.fn()
    renderView({ onBack })
    fireEvent.click(screen.getByRole('button', { name: 'Back to lists' }))
    expect(onBack).toHaveBeenCalled()
  })

  it('groups items by aisle in the fixed walk order when the list groups by aisle', () => {
    renderView({
      items: [
        item({ id: '1', name: 'Rice', category: 'Pantry' }),
        item({ id: '2', name: 'Chicken', category: 'Meat' }),
        item({ id: '3', name: 'Apples', category: 'Produce' }),
      ],
    })
    const headings = screen.getAllByText(/Produce|Bakery|Meat|Dairy|Pantry|Frozen|Other/, {
      selector: 'span.text-aisle-head',
    })
    expect(headings.map((h) => h.textContent)).toEqual(['Produce', 'Meat', 'Pantry'])
  })

  it('renders flat, no aisle heads, when the list does not group by aisle', () => {
    renderView({
      list: list({ groupByAisle: false }),
      items: [item({ name: 'Hammer', category: 'Other' })],
    })
    expect(screen.queryByText('Other')).not.toBeInTheDocument()
    expect(screen.getByText('Hammer')).toBeInTheDocument()
  })

  it('shows quantity right-aligned and tabular when set', () => {
    renderView({ items: [item({ quantity: '2 lbs' })] })
    expect(screen.getByText('2 lbs')).toBeInTheDocument()
  })

  it('shows an empty state with no items', () => {
    renderView({ items: [] })
    expect(screen.getByText(/Nothing on the list/)).toBeInTheDocument()
  })

  it('shows the last error next to the add bar', () => {
    renderView({ errorMessage: "Couldn't add that — try again." })
    const messages = screen.getAllByText("Couldn't add that — try again.")
    const inputs = screen.getAllByPlaceholderText('Add to the list…')
    expect(messages).toHaveLength(inputs.length)
  })

  it('adds an item by typing and pressing Enter', async () => {
    const onAdd = vi.fn().mockResolvedValue(undefined)
    renderView({ onAdd })
    const input = screen.getAllByPlaceholderText('Add to the list…')[0]
    fireEvent.change(input, { target: { value: 'Snap peas' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    await waitFor(() => expect(onAdd).toHaveBeenCalledWith('Snap peas'))
  })

  it('adds an item via the Add button and clears the input on success', async () => {
    const onAdd = vi.fn().mockResolvedValue(undefined)
    renderView({ onAdd })
    const input = screen.getAllByPlaceholderText('Add to the list…')[0]
    fireEvent.change(input, { target: { value: 'Snap peas' } })
    fireEvent.click(screen.getAllByRole('button', { name: 'Add' })[0])
    expect(onAdd).toHaveBeenCalledWith('Snap peas')
    await waitFor(() => expect(input).toHaveValue(''))
  })

  it('keeps the typed text when the add fails — no retyping after a blip', async () => {
    const onAdd = vi.fn().mockRejectedValue(new Error('500'))
    renderView({ onAdd })
    const input = screen.getAllByPlaceholderText('Add to the list…')[0]
    fireEvent.change(input, { target: { value: 'Snap peas' } })
    fireEvent.click(screen.getAllByRole('button', { name: 'Add' })[0])
    await waitFor(() => expect(onAdd).toHaveBeenCalled())
    expect(input).toHaveValue('Snap peas')
  })

  it('tapping a staple chip at rest quick-adds it', () => {
    const onTapStaple = vi.fn()
    renderView({ onTapStaple })
    fireEvent.click(screen.getAllByRole('button', { name: 'Milk' })[0])
    expect(onTapStaple).toHaveBeenCalledWith(STAPLES[0])
  })

  it('shows a muted inline completion in the field while typing a staple prefix — nothing else moves', () => {
    renderView()
    // Both the wide (wall) and narrow (phone) add bars render in the DOM —
    // the split between them is a CSS breakpoint, invisible to jsdom — and
    // each owns its own input state, so both need the keystroke.
    for (const input of screen.getAllByPlaceholderText('Add to the list…')) {
      fireEvent.change(input, { target: { value: 'Mi' } })
    }
    // The rest-state chip strip is gone once typing starts (rejected: a
    // pill strip that narrows while typing moves layout) — the ghost text
    // lives inside the field instead.
    expect(screen.queryByRole('button', { name: 'Eggs' })).not.toBeInTheDocument()
    expect(screen.getAllByText('lk').length).toBeGreaterThan(0)
  })

  it('Tab accepts the inline completion into the field', () => {
    renderView()
    const input = screen.getAllByPlaceholderText('Add to the list…')[0] as HTMLInputElement
    fireEvent.change(input, { target: { value: 'Mi' } })
    fireEvent.keyDown(input, { key: 'Tab' })
    expect(input.value).toBe('Milk')
  })

  it('an Other-filed item shows a one-time "Which aisle?" correction row, in place, to a manager', () => {
    const onCorrect = vi.fn()
    const other = item({ name: 'Kombucha', category: 'Other' })
    renderView({ items: [other], onCorrect })

    expect(screen.getByText('Which aisle?')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Produce' }))
    expect(onCorrect).toHaveBeenCalledWith(other, 'Produce')
  })

  it('"Leave it" teaches an Other override instead of picking an aisle', () => {
    const onCorrect = vi.fn()
    const other = item({ name: 'Paper towels', category: 'Other' })
    renderView({ items: [other], onCorrect })

    fireEvent.click(screen.getByRole('button', { name: 'Leave it' }))
    expect(onCorrect).toHaveBeenCalledWith(other, 'Other')
  })

  it('an item with a server-taught override shows no correction row — survives a reload', () => {
    const other = item({ id: 'other-1', category: 'Other', hasOverride: true })
    renderView({ items: [other] })
    expect(screen.queryByText('Which aisle?')).not.toBeInTheDocument()
  })

  it('hides the correction row from a non-manager — teaching an override is tier 4', () => {
    renderView({ items: [item({ category: 'Other' })], canCorrect: false })
    expect(screen.queryByText('Which aisle?')).not.toBeInTheDocument()
  })

  it('flashes the just-added row', () => {
    renderView({ items: [item({ id: 'new-1' })], flashItemId: 'new-1' })
    const name = screen.getByText('Milk', { selector: '.text-list-title' })
    expect(name.closest('.bg-primary\\/13')).toBeTruthy()
  })

  it('hides the add bar when the viewer cannot add', () => {
    renderView({ canAdd: false })
    expect(screen.queryByPlaceholderText('Add to the list…')).not.toBeInTheDocument()
  })
})
