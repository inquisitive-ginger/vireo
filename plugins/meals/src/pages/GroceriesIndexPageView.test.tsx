import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { GroceriesIndexPageView } from './GroceriesIndexPageView'
import type { GroceryEntry, GroceryList } from '../types'

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

const ENTRIES: GroceryEntry[] = [
  { normalizedName: 'butter', name: 'Butter' },
  { normalizedName: 'eggs', name: 'Eggs' },
]

function renderView(props: Partial<Parameters<typeof GroceriesIndexPageView>[0]> = {}) {
  return render(
    <GroceriesIndexPageView
      lists={[list()]}
      entries={ENTRIES}
      canAdd
      canCreateList={false}
      addError={null}
      createListError={null}
      onOpenList={vi.fn()}
      onAdd={vi.fn().mockResolvedValue(undefined)}
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

  it('renders nothing above the lists — no page-level composer, no chip strip', () => {
    renderView({ lists: [list(), list({ id: 'list-2', name: 'Costco' })] })
    expect(screen.queryByPlaceholderText('Add to the list…')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Choose which list to add to' })
    ).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Butter' })).not.toBeInTheDocument()
  })

  it('every list row carries its own add affordance — an item reaches any list from home', async () => {
    const onAdd = vi.fn().mockResolvedValue(undefined)
    const costco = list({ id: 'list-2', name: 'Costco' })
    renderView({ lists: [list(), costco], onAdd })

    fireEvent.click(screen.getByRole('button', { name: 'Add to Costco…' }))
    const input = screen.getByLabelText('Add to Costco')
    fireEvent.change(input, { target: { value: 'Paper towels' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    await waitFor(() => expect(onAdd).toHaveBeenCalledWith(costco, 'Paper towels'))
  })

  it('the add row completes from previous entries, in the field', () => {
    renderView()
    fireEvent.click(screen.getByRole('button', { name: 'Add to Grocery Store…' }))
    const input = screen.getByLabelText('Add to Grocery Store')
    fireEvent.change(input, { target: { value: 'But' } })
    expect(screen.getByText('ter')).toBeInTheDocument()
  })

  it('Escape collapses a capturing row back to its at-rest shape', () => {
    renderView()
    fireEvent.click(screen.getByRole('button', { name: 'Add to Grocery Store…' }))
    fireEvent.keyDown(screen.getByLabelText('Add to Grocery Store'), { key: 'Escape' })
    expect(screen.getByRole('button', { name: 'Add to Grocery Store…' })).toBeInTheDocument()
  })

  it('hides the per-row add affordance when the viewer cannot add', () => {
    renderView({ canAdd: false })
    expect(screen.queryByRole('button', { name: 'Add to Grocery Store…' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Open Grocery Store' })).toBeInTheDocument()
  })

  it('hides the "New list" affordance from a non-tier-4 viewer', () => {
    renderView({ canCreateList: false })
    expect(screen.queryByText('+ New list')).not.toBeInTheDocument()
  })

  it('a tier-4 viewer creates a list in the ghost row itself', async () => {
    const onCreateList = vi.fn().mockResolvedValue(undefined)
    renderView({ canCreateList: true, onCreateList })
    fireEvent.click(screen.getByRole('button', { name: 'Create a new list' }))
    const input = screen.getByLabelText('New list name')
    fireEvent.change(input, { target: { value: 'Home Depot' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    await waitFor(() => expect(onCreateList).toHaveBeenCalledWith('Home Depot'))
  })

  it('a runtime list at zero items is not on the index — the container drills into it', () => {
    // The view never renders a list the API did not send; the "created and
    // then invisible" trap this guards against is fixed in GroceriesIndexPage,
    // which navigates into the new list on success.
    renderView({ lists: [list()] })
    expect(screen.queryByText('Home Depot')).not.toBeInTheDocument()
  })

  it('shows "No lists yet" when there are none, and still offers the create row', () => {
    renderView({ lists: [], canCreateList: true })
    expect(screen.getByText('No lists yet.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create a new list' })).toBeInTheDocument()
  })

  it('an add failure names the card whose composer failed, not the page', () => {
    const costco = list({ id: 'list-2', name: 'Costco' })
    renderView({
      lists: [list(), costco],
      addError: { listId: 'list-2', message: "Couldn't add that — try again." },
    })
    const message = screen.getByText("Couldn't add that — try again.")
    expect(message.closest('[class*="rounded-card"]')).toContainElement(
      screen.getByRole('button', { name: 'Add to Costco…' })
    )
  })
})
