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
          item({ id: '1', name: 'snap peas', note: 'for Thursday' }),
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
    layout: 'narrow',
    justAdded: [],
    totalOpenCount: 3,
    showLists: true,
    onToggleLists: vi.fn(),
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

  it('renders a producer fact on the note line — no spine, no avatar, no hue (ADR 064)', () => {
    const { container } = renderView()
    expect(screen.getByText('for Thursday')).toBeInTheDocument()
    expect(container.querySelector('img')).toBeNull()
    expect(container.innerHTML).not.toMatch(/identity-/)
  })

  it('says nothing about who added a row — that is noise on a shared list', () => {
    renderView()
    expect(screen.queryByText(/added/i)).not.toBeInTheDocument()
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

  it('says why a profile whose add is revoked cannot type, rather than failing silently', () => {
    renderView({ canAdd: false })
    expect(screen.getByLabelText('Add to Grocery')).toBeDisabled()
    expect(screen.getByText(/turned off for this profile/)).toBeInTheDocument()
  })

  it('has no index of lists and no drill-in — a pill is a filter, not a link', () => {
    const { container } = renderView()
    expect(container.querySelector('a')).toBeNull()
  })
})

/* The same surface at tablet width and up (design.md §"One surface, two
   layouts"). Not a route and not a mode: the viewport picks the arrangement,
   nothing on screen switches it, and the aisle list is the same list. */
describe('ShoppingPageView — the wide layout', () => {
  it('opens on capture: the question and the big field', () => {
    renderView({ layout: 'wide' })
    expect(screen.getByRole('heading', { name: 'What do we need?' })).toBeInTheDocument()
    expect(screen.getByLabelText('Add to Grocery')).toBeInTheDocument()
  })

  it('does not take the keyboard — a kitchen screen is not one you walked up to', () => {
    renderView({ layout: 'wide' })
    expect(screen.getByLabelText('Add to Grocery')).not.toHaveFocus()
  })

  it('is capture ONLY until the lists are asked for (Zach, 2026-09-04)', () => {
    renderView({ layout: 'wide', showLists: false })
    expect(screen.getByRole('heading', { name: 'What do we need?' })).toBeInTheDocument()
    expect(screen.queryByText('snap peas')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Costco/ })).not.toBeInTheDocument()
  })

  it('renders the same list, in place, once `Show lists` is pressed', () => {
    renderView({ layout: 'wide', showLists: true })
    expect(screen.getByText('snap peas')).toBeInTheDocument()
    expect(screen.getByText('milk')).toBeInTheDocument()
    // The hero stays above it, so the way back to capture is never off-screen.
    expect(screen.getByRole('heading', { name: 'What do we need?' })).toBeInTheDocument()
  })

  it('drops the narrow header, so the surface has one title and one field', () => {
    renderView({ layout: 'wide' })
    expect(screen.queryByRole('heading', { name: 'Shopping' })).not.toBeInTheDocument()
    expect(screen.getAllByRole('textbox')).toHaveLength(1)
  })

  it('keeps the destination strip visible while composing once lists are shown', () => {
    // Wide has room for both; narrow trades the strip for the echo line.
    renderView({ layout: 'wide', showLists: true, draftAisle: 'Pantry' })
    expect(screen.getByRole('button', { name: /Grocery/ })).toBeInTheDocument()
    expect(screen.getByText(/files under/)).toBeInTheDocument()
  })

  it('scrolls the reveal into view — a control whose effect is off-screen did nothing', () => {
    // The hero fills the screen, so what `Show lists` reveals starts below the
    // fold. Without this the button changes its own label and nothing else the
    // reader can see.
    const scrollIntoView = vi.fn()
    HTMLElement.prototype.scrollIntoView = scrollIntoView
    renderView({ layout: 'wide', showLists: true })
    expect(scrollIntoView).toHaveBeenCalled()
  })

  it('does not scroll on narrow, where nothing was revealed', () => {
    const scrollIntoView = vi.fn()
    HTMLElement.prototype.scrollIntoView = scrollIntoView
    renderView({ layout: 'narrow', showLists: true })
    expect(scrollIntoView).not.toHaveBeenCalled()
  })

  it('names what was just added, never who', () => {
    renderView({ layout: 'wide', justAdded: [{ id: '1', name: 'oat milk' }] })
    expect(screen.getByText('oat milk')).toBeInTheDocument()
    expect(screen.queryByText(/Emma|the house|added by/i)).not.toBeInTheDocument()
  })
})
