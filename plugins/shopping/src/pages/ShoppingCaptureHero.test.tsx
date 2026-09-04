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
    destinations: <div>Grocery 14 · Costco 3</div>,
    onShowLists: vi.fn(),
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

  it('states one cumulative count, and leaves the split to the pills', () => {
    renderView()
    expect(screen.getByText('19 things to get')).toBeInTheDocument()
  })

  it('carries the destinations, so Costco is reachable from a capture screen', () => {
    // The hole this closes: the trailing slot holds `Hold to speak`, so before
    // the pills came up here an add could only ever land on the default list.
    renderView()
    expect(screen.getByText('Grocery 14 · Costco 3')).toBeInTheDocument()
  })

  it('offers to take back a just-added typo, naming the thing it removes', () => {
    const onRemove = vi.fn()
    renderView({ justAdded: [{ id: 'a1', name: 'mikk' }], onRemove })
    fireEvent.click(screen.getByRole('button', { name: 'Remove mikk' }))
    expect(onRemove).toHaveBeenCalledWith('a1')
  })

  it('offers no remove when the profile cannot remove — a kid adds but cannot', () => {
    // `manage` is tier 4 while adding is tier 1 (ADR 071), so the person who
    // made the typo may not be the one who can undo it.
    renderView({ justAdded: [{ id: 'a1', name: 'mikk' }], onRemove: undefined })
    expect(screen.queryByRole('button', { name: /Remove/ })).not.toBeInTheDocument()
    expect(screen.getByText('mikk')).toBeInTheDocument()
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

  it('offers one way to the lists, and draws none of them itself', () => {
    const { props } = renderView()
    fireEvent.click(screen.getByRole('button', { name: 'Show lists' }))
    expect(props.onShowLists).toHaveBeenCalled()
    expect(screen.queryByText('Produce')).not.toBeInTheDocument()
  })
})
