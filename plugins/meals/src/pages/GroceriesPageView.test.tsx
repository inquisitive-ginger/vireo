import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GroceriesPageView } from './GroceriesPageView'
import type { GroceryItem, Staple } from '../types'

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
    ...overrides,
  }
}

const STAPLES: Staple[] = [
  { id: 's1', name: 'Milk', category: 'Dairy', active: true },
  { id: 's2', name: 'Eggs', category: 'Dairy', active: true },
]

function renderView(props: Partial<Parameters<typeof GroceriesPageView>[0]> = {}) {
  return render(
    <GroceriesPageView
      items={[]}
      staples={STAPLES}
      canAdd
      flashItemId={null}
      onAdd={vi.fn()}
      onTapStaple={vi.fn()}
      onCorrect={vi.fn()}
      {...props}
    />
  )
}

describe('GroceriesPageView', () => {
  it('groups items by aisle in the fixed walk order', () => {
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

  it('renders the note line as provenance, never a chip in the name line', () => {
    renderView({ items: [item({ note: "for Sunday's rigatoni" })] })
    expect(screen.getByText("for Sunday's rigatoni")).toBeInTheDocument()
  })

  it('shows an empty state with no items', () => {
    renderView({ items: [] })
    expect(screen.getByText(/Nothing on the list/)).toBeInTheDocument()
  })

  it('adds an item by typing and pressing Enter', () => {
    const onAdd = vi.fn()
    renderView({ onAdd })
    const input = screen.getAllByPlaceholderText('Add to the list…')[0]
    fireEvent.change(input, { target: { value: 'Snap peas' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onAdd).toHaveBeenCalledWith('Snap peas')
  })

  it('adds an item via the Add button and clears the input', () => {
    const onAdd = vi.fn()
    renderView({ onAdd })
    const input = screen.getAllByPlaceholderText('Add to the list…')[0]
    fireEvent.change(input, { target: { value: 'Snap peas' } })
    fireEvent.click(screen.getAllByRole('button', { name: 'Add' })[0])
    expect(onAdd).toHaveBeenCalledWith('Snap peas')
    expect(input).toHaveValue('')
  })

  it('tapping a staple chip quick-adds it', () => {
    const onTapStaple = vi.fn()
    renderView({ onTapStaple })
    fireEvent.click(screen.getAllByRole('button', { name: 'Milk' })[0])
    expect(onTapStaple).toHaveBeenCalledWith(STAPLES[0])
  })

  it('narrows the chip strip to a typeahead while typing', () => {
    renderView()
    // Both the wide (wall) and narrow (phone) add bars render in the DOM —
    // the split between them is a CSS breakpoint, invisible to jsdom.
    for (const input of screen.getAllByPlaceholderText('Add to the list…')) {
      fireEvent.change(input, { target: { value: 'egg' } })
    }
    expect(screen.queryAllByRole('button', { name: 'Milk' })).toHaveLength(0)
    expect(screen.getAllByRole('button', { name: 'Eggs' }).length).toBeGreaterThan(0)
  })

  it('an Other-filed item shows a one-time "Which aisle?" correction row, in place', () => {
    const onCorrect = vi.fn()
    const other = item({ name: 'Kombucha', category: 'Other' })
    renderView({ items: [other], onCorrect })

    expect(screen.getByText('Which aisle?')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Produce' }))
    expect(onCorrect).toHaveBeenCalledWith(other, 'Produce')
  })

  it('no correction row on a filed item', () => {
    renderView({ items: [item({ category: 'Dairy' })] })
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
