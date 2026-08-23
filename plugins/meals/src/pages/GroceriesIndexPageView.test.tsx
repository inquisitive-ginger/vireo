import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { GroceriesIndexPageView } from './GroceriesIndexPageView'
import type { GroceryList, Staple } from '../types'

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

const STAPLES: Staple[] = [{ id: 's1', name: 'Milk', category: 'Dairy', active: true }]

function renderView(props: Partial<Parameters<typeof GroceriesIndexPageView>[0]> = {}) {
  return render(
    <GroceriesIndexPageView
      lists={[list()]}
      staples={STAPLES}
      canAdd
      canCreateList={false}
      addListTargetId="list-1"
      errorMessage={null}
      createListError={null}
      onSelectAddTarget={vi.fn()}
      onOpenList={vi.fn()}
      onAdd={vi.fn().mockResolvedValue(undefined)}
      onTapStaple={vi.fn()}
      onCreateList={vi.fn().mockResolvedValue(undefined)}
      {...props}
    />
  )
}

describe('GroceriesIndexPageView', () => {
  it('shows a permanent list even at zero items, dimmed', () => {
    renderView({ lists: [list({ itemCount: 0 })] })
    const row = screen
      .getByText('Grocery Store', { selector: 'span.text-list-title' })
      .closest('[class*="opacity"]')
    expect(row).toBeTruthy()
    expect(screen.getByText('Empty')).toBeInTheDocument()
  })

  it('shows an item count for a non-empty list, not dimmed', () => {
    renderView({ lists: [list({ itemCount: 3 })] })
    expect(screen.getByText('3 items')).toBeInTheDocument()
  })

  it('tapping a list row calls onOpenList with that list — the drill-in', () => {
    const onOpenList = vi.fn()
    const costco = list({ id: 'list-2', name: 'Costco' })
    renderView({ lists: [list(), costco], onOpenList })
    fireEvent.click(screen.getByRole('button', { name: 'Open Costco' }))
    expect(onOpenList).toHaveBeenCalledWith(costco)
  })

  it('adds an item to the currently-selected "Add to" list', async () => {
    const onAdd = vi.fn().mockResolvedValue(undefined)
    renderView({ onAdd })
    const input = screen.getAllByPlaceholderText('Add to the list…')[0]
    fireEvent.change(input, { target: { value: 'Snap peas' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    await waitFor(() => expect(onAdd).toHaveBeenCalledWith('Snap peas'))
  })

  it('shows the "Add to" list picker only on the index', () => {
    renderView({ lists: [list(), list({ id: 'list-2', name: 'Costco' })] })
    expect(screen.getAllByText('Add to').length).toBeGreaterThan(0)
    expect(screen.getAllByRole('button', { name: 'Costco' }).length).toBeGreaterThan(0)
  })

  it('switching the "Add to" target calls onSelectAddTarget', () => {
    const onSelectAddTarget = vi.fn()
    renderView({
      lists: [list(), list({ id: 'list-2', name: 'Costco' })],
      onSelectAddTarget,
    })
    fireEvent.click(screen.getAllByRole('button', { name: 'Costco' })[0])
    expect(onSelectAddTarget).toHaveBeenCalledWith('list-2')
  })

  it('hides the "New list" affordance from a non-tier-4 viewer', () => {
    renderView({ canCreateList: false })
    expect(screen.queryByText('New list')).not.toBeInTheDocument()
  })

  it('a tier-4 viewer can create a list', async () => {
    const onCreateList = vi.fn().mockResolvedValue(undefined)
    renderView({ canCreateList: true, onCreateList })
    fireEvent.click(screen.getByText('New list'))
    const input = screen.getByLabelText('New list name')
    fireEvent.change(input, { target: { value: 'Home Depot' } })
    fireEvent.click(screen.getByRole('button', { name: 'Create' }))
    await waitFor(() => expect(onCreateList).toHaveBeenCalledWith('Home Depot'))
  })

  it('hides the add bar when the viewer cannot add', () => {
    renderView({ canAdd: false })
    expect(screen.queryByPlaceholderText('Add to the list…')).not.toBeInTheDocument()
  })

  it('shows "No lists yet" when there are none', () => {
    renderView({ lists: [] })
    expect(screen.getByText('No lists yet.')).toBeInTheDocument()
  })
})
