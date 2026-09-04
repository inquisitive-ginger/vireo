import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { ShoppingPageView, type ShoppingPageViewProps } from './ShoppingPageView'
import type { ShoppingItem } from '../types'

const item = (over: Partial<ShoppingItem> & { id: string; name: string }): ShoppingItem => ({
  category: 'Produce',
  quantity: null,
  status: 'needed',
  listId: 'grocery',
  addedAt: '2026-09-03T12:00:00.000Z',
  note: null,
  ...over,
})

function renderView(over: Partial<ShoppingPageViewProps> = {}) {
  const props: ShoppingPageViewProps = {
    lists: [
      { id: 'grocery', name: 'Grocery', kind: 'permanent', groupByAisle: true, itemCount: 3 },
      { id: 'costco', name: 'Costco', kind: 'permanent', groupByAisle: true, itemCount: 1 },
    ],
    selectedListId: 'grocery',
    onSelectList: vi.fn(),
    groups: [
      {
        aisle: 'Produce',
        items: [
          item({ id: '1', name: 'snap peas', note: 'Emma added' }),
          item({ id: '2', name: 'bananas' }),
        ],
      },
      { aisle: 'Dairy', items: [item({ id: '3', name: 'milk', category: 'Dairy' })] },
    ],
    loading: false,
    openCount: 3,
    onAdd: vi.fn(),
    onDraftChange: vi.fn(),
    draftAisle: null,
    addError: null,
    canAdd: true,
    ...over,
  }
  return { props, ...render(<ShoppingPageView {...props} />) }
}

describe('ShoppingPageView', () => {
  it('leads with the title and a muted count strip, never a shout', () => {
    renderView()
    expect(screen.getByRole('heading', { name: 'Shopping' })).toBeInTheDocument()
    expect(screen.getByText('3 to get')).toBeInTheDocument()
  })

  it('puts the capture field first under the title and does NOT steal the keyboard', () => {
    renderView()
    const field = screen.getByLabelText('Add to Grocery')
    expect(field).toBeInTheDocument()
    expect(field).not.toHaveFocus()
  })

  it('names the destination on the field and in the trailing scope chip', () => {
    renderView({ selectedListId: 'costco' })
    expect(screen.getByLabelText('Add to Costco')).toBeInTheDocument()
  })

  it('groups rows under aisle headers in walk order', () => {
    renderView()
    const labels = screen.getAllByText(/^(Produce|Dairy)$/).map((el) => el.textContent)
    expect(labels).toEqual(['Produce', 'Dairy'])
    expect(screen.getByText('snap peas')).toBeInTheDocument()
    expect(screen.getByText('milk')).toBeInTheDocument()
  })

  it('renders provenance as a text fact — no spine, no avatar, no hue (ADR 064)', () => {
    const { container } = renderView()
    expect(screen.getByText('Emma added')).toBeInTheDocument()
    expect(container.querySelector('img')).toBeNull()
    expect(container.innerHTML).not.toMatch(/identity-/)
  })

  it('shows one pill per destination with its count, and swaps the list in place', () => {
    const { props } = renderView()
    const costco = screen.getByRole('button', { name: /Costco 1/ })
    expect(screen.getByRole('button', { name: /Grocery 3/ })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    fireEvent.click(costco)
    expect(props.onSelectList).toHaveBeenCalledWith('costco')
  })

  it('states the aisle BEFORE the commit, and gives the strip over to the echo while composing', () => {
    renderView({ draftAisle: 'Pantry' })
    const echo = screen.getByText(/Enter to add/)
    expect(within(echo).getByText('Pantry')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Costco/ })).not.toBeInTheDocument()
  })

  it('hands the typed word back when the add fails, so it is not silently lost', () => {
    renderView({ addError: 'tortillas' })
    expect(screen.getByRole('alert')).toHaveTextContent('tortillas')
  })

  it('reports a submit up with the caught word', () => {
    const { props } = renderView()
    const field = screen.getByLabelText('Add to Grocery')
    fireEvent.change(field, { target: { value: 'tortillas' } })
    fireEvent.submit(field.closest('form')!)
    expect(props.onAdd).toHaveBeenCalledWith('tortillas')
  })

  it('says why the unattended family dashboard cannot add rather than failing silently', () => {
    renderView({ canAdd: false })
    expect(screen.getByLabelText('Add to Grocery')).toBeDisabled()
    expect(screen.getByText(/Switch to your own profile/)).toBeInTheDocument()
  })

  it('does not claim the list is empty while the rows are still coming', () => {
    renderView({ loading: true, groups: [], openCount: 14 })
    expect(screen.queryByText(/Nothing on/)).not.toBeInTheDocument()
    // The index already knows the count, so the strip stays true meanwhile.
    expect(screen.getByText('14 to get')).toBeInTheDocument()
  })

  it('renders flat, with no aisle headers, on a list that has no aisles of ours', () => {
    renderView({
      lists: [
        { id: 'hardware', name: 'Hardware', kind: 'runtime', groupByAisle: false, itemCount: 1 },
      ],
      selectedListId: 'hardware',
      groups: [
        { aisle: 'Other', items: [item({ id: '9', name: 'wood screws', category: 'Other' })] },
      ],
      openCount: 1,
    })
    expect(screen.getByText('wood screws')).toBeInTheDocument()
    expect(screen.queryByText('Other')).not.toBeInTheDocument()
  })

  it('has no index of lists and no drill-in — a pill is a filter, not a link', () => {
    const { container } = renderView()
    expect(container.querySelector('a')).toBeNull()
  })
})
