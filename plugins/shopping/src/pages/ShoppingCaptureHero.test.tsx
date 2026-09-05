import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ShoppingCaptureHero, type ShoppingCaptureHeroProps } from './ShoppingCaptureHero'
import type { CaptureReport } from '../types'

const report = (over: Partial<CaptureReport> = {}): CaptureReport => ({
  tone: 'error',
  message: 'Couldn’t add “oat milk”',
  actions: [],
  onDismiss: vi.fn(),
  ...over,
})

function renderView(over: Partial<ShoppingCaptureHeroProps> = {}) {
  const props: ShoppingCaptureHeroProps = {
    openCount: 19,
    destinations: <div>Grocery 14 · Costco 3</div>,
    onShowLists: vi.fn(),
    loading: false,
    destination: 'Grocery',
    onAdd: vi.fn(),
    reports: [],
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

  /* SH-13 — nothing here names an aisle: the wall adds as tier 1 (ADR 072) and
     cannot re-file at all. */
  it('names no aisle, anywhere', () => {
    renderView()
    fireEvent.change(screen.getByLabelText('Add to Grocery'), { target: { value: 'oat milk' } })
    expect(screen.queryByText(/files under/)).not.toBeInTheDocument()
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

  /* The `Just added` strip is gone (Zach, live pass). Take-back lives on the rows
     at `/shopping/lists`, one click away and doing strictly more — rename,
     re-file and remove sit beside it. It could not leave until the rows had it:
     at W2 everyone is the `family` profile, so the chip `×` was once the wall's
     ONLY undo (ADR 073 §3). `ShoppingPageView`'s own suite pins the replacement,
     by touch long-press, on a row the wall cannot even check. */
  it('draws no short memory of what landed — the rows carry take-back now', () => {
    renderView()
    expect(screen.queryByText('Just added')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Take back/ })).not.toBeInTheDocument()
  })

  it('SHOWS a refused retract rather than swallowing it', () => {
    // The window closes between fetches by design, so this is an expected
    // outcome on a screen with no devtools behind it (ADR 073 §2). It lands in
    // the one report slot, because the chip it was tapped from is gone.
    renderView({ reports: [report({ message: 'Too late to take back “milk”.' })] })
    expect(screen.getByRole('alert')).toHaveTextContent('Too late to take back')
  })

  /* `Hold to speak` is gone (Zach, live pass): a control reserved for a feature
     outside M5.5 was the largest thing on the field. The hint took its slot. */
  it('carries the Enter hint in the field, persistently, in place of the voice slot', () => {
    renderView()
    expect(screen.queryByText(/speak/i)).not.toBeInTheDocument()
    // The placeholder DEMONSTRATES the comma rather than describing the field —
    // it is the only thing on a wall that can teach the syntax.
    expect(screen.getByLabelText('Add to Grocery')).toHaveAttribute(
      'placeholder',
      'milk, eggs, bread'
    )
    // Persistent, not a thing that appears mid-word: it replaces chrome that was
    // always there, and on a screen someone walks up to it IS the instruction.
    expect(screen.getByText('Enter to add')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Add to Grocery'), { target: { value: 'oat milk' } })
    expect(screen.getByText('Enter to add')).toBeInTheDocument()
  })

  it('drops the hint when the field is dead, and says why in the slot instead', () => {
    renderView({ canAdd: false })
    expect(screen.queryByText('Enter to add')).not.toBeInTheDocument()
    expect(screen.getByText(/turned off/i)).toBeInTheDocument()
  })

  it('is a block on the page, not a surface — it draws no list of its own', () => {
    // The aisle list is the page's, rendered under this by ShoppingPageView.
    // If the hero ever grows rows, the surface has two lists.
    renderView()
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    expect(screen.queryByText('Produce')).not.toBeInTheDocument()
  })

  /* The seam rule is UNCHANGED by any of this: house-wide is right here for the
     same reason it is right on the widget (D6) and wrong on the phone (SH-10) —
     this surface has no rows of its own to contradict, and the pills directly
     above name every scope it sums. */
  it('keeps the seam pinned to the bottom, counting the whole house', () => {
    renderView()
    expect(screen.getByText('19 things to get')).toBeInTheDocument()
  })

  it('names the word that failed, because the field already cleared', () => {
    renderView({ reports: [report()] })
    expect(screen.getByRole('alert')).toHaveTextContent('oat milk')
  })

  /* Several collisions stack, growing DOWNWARD into the empty space below the
     pills — the slot hangs out of flow there, so a notice arriving cannot move
     the field someone is typing into. */
  it('stacks one line per collision, each naming itself and carrying its own verb', () => {
    const onSelect = vi.fn()
    renderView({
      reports: [
        report({ tone: 'notice', message: '“milk” already on Grocery.', actions: [] }),
        report({
          tone: 'notice',
          message: '“bread” already on Grocery.',
          actions: [{ label: 'Take it back?', onSelect }],
        }),
      ],
    })
    expect(screen.getByText('“milk” already on Grocery.')).toBeInTheDocument()
    expect(screen.getByText('“bread” already on Grocery.')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Dismiss' })).toHaveLength(2)
    fireEvent.click(screen.getByRole('button', { name: 'Take it back?' }))
    expect(onSelect).toHaveBeenCalledOnce()
  })

  it('states the collision in two clauses and offers the one verb', () => {
    const onSelect = vi.fn()
    renderView({
      reports: [
        report({
          tone: 'notice',
          message: 'Already on Grocery.',
          actions: [{ label: 'Take it back?', onSelect }],
        }),
      ],
    })
    fireEvent.click(screen.getByRole('button', { name: 'Take it back?' }))
    expect(onSelect).toHaveBeenCalledOnce()
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
