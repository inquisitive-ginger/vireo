import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { WallPageView, type WallPageViewProps } from './WallPageView'

function renderView(over: Partial<WallPageViewProps> = {}) {
  const props: WallPageViewProps = {
    justAdded: [
      { id: '1', name: 'snap peas' },
      { id: '2', name: 'tortillas' },
      { id: '3', name: 'milk' },
    ],
    lists: [
      { id: 'grocery', name: 'Grocery', kind: 'permanent', groupByAisle: true, itemCount: 14 },
      { id: 'costco', name: 'Costco', kind: 'permanent', groupByAisle: false, itemCount: 3 },
      { id: 'hardware', name: 'Hardware', kind: 'runtime', groupByAisle: false, itemCount: 2 },
    ],
    openCount: 19,
    loading: false,
    destination: 'Grocery',
    onAdd: vi.fn(),
    onDraftChange: vi.fn(),
    draftAisle: null,
    addError: null,
    canAdd: true,
    onSeeLists: vi.fn(),
    ...over,
  }
  return { props, ...render(<WallPageView {...props} />) }
}

describe('WallPageView', () => {
  it('asks the question and takes the keyboard — somebody walked up to it to type', () => {
    renderView()
    expect(screen.getByRole('heading', { name: 'What do we need?' })).toBeInTheDocument()
    expect(screen.getByLabelText('Add to Grocery')).toHaveFocus()
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

  it('carries the count strip across every destination', () => {
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

  it('only takes things in — no checking, no aisles, no shopping', () => {
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

  it('offers exactly one way off the surface', () => {
    const { props } = renderView()
    fireEvent.click(screen.getByRole('button', { name: /See the lists/ }))
    expect(props.onSeeLists).toHaveBeenCalled()
  })
})
