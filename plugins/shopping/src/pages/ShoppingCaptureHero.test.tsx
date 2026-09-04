import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ShoppingCaptureHero, type ShoppingCaptureHeroProps } from './ShoppingCaptureHero'

function renderView(over: Partial<ShoppingCaptureHeroProps> = {}) {
  const props: ShoppingCaptureHeroProps = {
    justAdded: [
      { id: '1', name: 'snap peas' },
      { id: '2', name: 'tortillas' },
      { id: '3', name: 'milk' },
    ],
    openCount: 19,
    lists: [
      { id: 'grocery', name: 'Grocery', kind: 'permanent', groupByAisle: true, itemCount: 14 },
      { id: 'costco', name: 'Costco', kind: 'permanent', groupByAisle: false, itemCount: 3 },
      { id: 'hardware', name: 'Hardware', kind: 'runtime', groupByAisle: false, itemCount: 2 },
    ],
    showingLists: false,
    onToggleLists: vi.fn(),
    loading: false,
    destination: 'Grocery',
    onAdd: vi.fn(),
    onDraftChange: vi.fn(),
    draftAisle: null,
    addError: null,
    canAdd: true,
    ...over,
  }
  return { props, ...render(<ShoppingCaptureHero {...props} />) }
}

describe('ShoppingCaptureHero', () => {
  it('asks the question without taking the keyboard', () => {
    renderView()
    expect(screen.getByRole('heading', { name: 'What do we need?' })).toBeInTheDocument()
    expect(screen.getByLabelText('Add to Grocery')).not.toHaveFocus()
  })

  it('adds on Enter and leaves the field open for the next thing out of the fridge', () => {
    const { props } = renderView()
    const field = screen.getByLabelText('Add to Grocery')
    fireEvent.change(field, { target: { value: 'oat milk' } })
    fireEvent.submit(field.closest('form')!)
    expect(props.onAdd).toHaveBeenCalledWith('oat milk')
    expect(field).toHaveValue('')
    expect(field).toHaveFocus()
  })

  it('states the filing before the commit, not after it', () => {
    renderView({ draftAisle: 'Pantry' })
    expect(screen.getByText(/files under/)).toBeInTheDocument()
    expect(screen.getByText('Pantry')).toBeInTheDocument()
  })

  it('names what was just added, never who added it', () => {
    renderView({ justAdded: [{ id: '1', name: 'snap peas' }] })
    expect(screen.getByText('snap peas')).toBeInTheDocument()
    expect(screen.queryByText(/Emma|the house|added by/i)).not.toBeInTheDocument()
  })

  it('carries the whole count, split by destination — it is the only answer on screen', () => {
    renderView()
    expect(
      screen.getByText('19 things waiting · Grocery 14 · Costco 3 · Hardware 2')
    ).toBeInTheDocument()
  })

  it('reserves the voice slot without pretending it works', () => {
    renderView()
    // Reserved, not implemented (design.md §W2) — so it must not be reachable
    // as a control that does nothing when a family member taps it.
    expect(screen.queryByRole('button', { name: /speak/i })).not.toBeInTheDocument()
  })

  it('is a block on the page, not a surface — it draws no list of its own', () => {
    // The aisle list is the page's, rendered under this by ShoppingPageView.
    // If the hero ever grows rows, the surface has two lists.
    renderView()
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    expect(screen.queryByText('Produce')).not.toBeInTheDocument()
  })

  it('names the word that failed, because the field already cleared', () => {
    renderView({ addError: 'oat milk' })
    expect(screen.getByRole('alert')).toHaveTextContent('oat milk')
  })

  it('says so when adding is revoked rather than failing silently on submit', () => {
    renderView({ canAdd: false })
    expect(screen.getByLabelText('Add to Grocery')).toBeDisabled()
    expect(screen.getByText(/turned off/i)).toBeInTheDocument()
  })

  it('asks before it shows the lists, and says how to put them back', () => {
    const { props } = renderView()
    const control = screen.getByRole('button', { name: 'Show lists' })
    expect(control).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(control)
    expect(props.onToggleLists).toHaveBeenCalled()
  })

  it('reverses with the same control in the same place — never a one-way door', () => {
    // The trap this avoids: a kiosk left showing the lists, with the way back to
    // capture somewhere else or nowhere.
    renderView({ showingLists: true })
    expect(screen.getByRole('button', { name: 'Hide lists' })).toHaveAttribute(
      'aria-expanded',
      'true'
    )
  })
})
