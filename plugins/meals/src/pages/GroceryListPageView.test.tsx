import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { GroceryListPageView } from './GroceryListPageView'
import type { GroceryEntry, GroceryItem, GroceryList } from '../types'

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

// Most recent first — what this family has added before, not a staple list.
const ENTRIES: GroceryEntry[] = [
  { normalizedName: 'milk', name: 'Milk' },
  { normalizedName: 'eggs', name: 'Eggs' },
]

function renderView(props: Partial<Parameters<typeof GroceryListPageView>[0]> = {}) {
  return render(
    <GroceryListPageView
      list={list()}
      items={[]}
      entries={ENTRIES}
      canAdd
      canCorrect
      flashItemId={null}
      errorMessage={null}
      onBack={vi.fn()}
      onAdd={vi.fn().mockResolvedValue(undefined)}
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

  it('the back link calls onBack — the only way out is up to the index', () => {
    const onBack = vi.fn()
    renderView({ onBack })
    fireEvent.click(screen.getByRole('button', { name: '‹ Groceries' }))
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
      selector: 'div.text-section-label',
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

  it('shows the last error next to the composer', () => {
    renderView({ errorMessage: "Couldn't add that — try again." })
    expect(screen.getByText("Couldn't add that — try again.")).toBeInTheDocument()
  })

  it('adds an item by typing and pressing Enter', async () => {
    const onAdd = vi.fn().mockResolvedValue(undefined)
    renderView({ onAdd })
    const input = screen.getByPlaceholderText('Add to the list…')
    fireEvent.change(input, { target: { value: 'Snap peas' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    await waitFor(() => expect(onAdd).toHaveBeenCalledWith('Snap peas'))
  })

  it('adds an item via the Add button and clears the input on success', async () => {
    const onAdd = vi.fn().mockResolvedValue(undefined)
    renderView({ onAdd })
    const input = screen.getByPlaceholderText('Add to the list…')
    fireEvent.change(input, { target: { value: 'Snap peas' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(onAdd).toHaveBeenCalledWith('Snap peas')
    await waitFor(() => expect(input).toHaveValue(''))
  })

  it('keeps the typed text when the add fails — no retyping after a blip', async () => {
    const onAdd = vi.fn().mockRejectedValue(new Error('500'))
    renderView({ onAdd })
    const input = screen.getByPlaceholderText('Add to the list…')
    fireEvent.change(input, { target: { value: 'Snap peas' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    await waitFor(() => expect(onAdd).toHaveBeenCalled())
    expect(input).toHaveValue('Snap peas')
  })

  it('renders no staple chip strip — the gate cut it from both surfaces', () => {
    renderView()
    expect(screen.queryByRole('button', { name: 'Milk' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Eggs' })).not.toBeInTheDocument()
  })

  it('shows a muted inline completion in the field while typing — nothing else moves', () => {
    renderView()
    const input = screen.getByPlaceholderText('Add to the list…')
    fireEvent.change(input, { target: { value: 'Mi' } })
    expect(screen.getByText('lk')).toBeInTheDocument()
  })

  it('the composer box is on the wrapper, so the ghost is not painted over', () => {
    // The overlay is a sibling UNDER the input; an opaque background on the
    // input itself hides the remainder while leaving it in the DOM — which is
    // how a working-looking test suite shipped an invisible completion.
    renderView()
    const input = screen.getByPlaceholderText('Add to the list…')
    expect(input).toHaveClass('bg-transparent')
    expect(input.parentElement).toHaveClass('bg-card')
  })

  it('Tab accepts the inline completion into the field', () => {
    renderView()
    const input = screen.getByPlaceholderText('Add to the list…') as HTMLInputElement
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

  it('a checked item dims, strikes through, and holds its position', () => {
    renderView({
      items: [item({ id: 'a', name: 'Milk', status: 'got' }), item({ id: 'b', name: 'Butter' })],
    })
    const names = screen.getAllByText(/Milk|Butter/, { selector: '.text-list-title' })
    expect(names.map((n) => n.textContent)).toEqual(['Milk', 'Butter'])
    expect(screen.getByText('Milk', { selector: '.text-list-title' })).toHaveClass('line-through')
  })

  it('the last row draws no hairline — the composer already closes the list', () => {
    renderView({ items: [item({ id: 'a', name: 'Rice' }), item({ id: 'b', name: 'Butter' })] })
    const last = screen.getByText('Butter', { selector: '.text-list-title' }).closest('.min-h-11')
    expect(last).toHaveClass('border-b-0')
  })

  it('flashes the just-added row', () => {
    renderView({ items: [item({ id: 'new-1' })], flashItemId: 'new-1' })
    const name = screen.getByText('Milk', { selector: '.text-list-title' })
    expect(name.closest('.bg-primary\\/13')).toBeTruthy()
  })

  it('hides the composer when the viewer cannot add', () => {
    renderView({ canAdd: false })
    expect(screen.queryByPlaceholderText('Add to the list…')).not.toBeInTheDocument()
  })
})
