import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CaptureField } from './capture-field'

function type(value: string) {
  fireEvent.change(screen.getByLabelText('Add to Grocery'), { target: { value } })
}

function enter() {
  fireEvent.submit(screen.getByLabelText('Add to Grocery').closest('form')!)
}

describe('CaptureField', () => {
  it('submits the trimmed value on Enter', () => {
    const onSubmit = vi.fn()
    render(<CaptureField onSubmit={onSubmit} placeholder="Add to Grocery" label="Add to Grocery" />)
    type('  tortillas  ')
    enter()
    expect(onSubmit).toHaveBeenCalledWith('tortillas')
  })

  it('clears and stays open and focused — the lifecycle that makes it not a ComposeForm (ADR 070)', () => {
    render(<CaptureField onSubmit={vi.fn()} placeholder="Add to Grocery" label="Add to Grocery" />)
    const input = screen.getByLabelText('Add to Grocery') as HTMLInputElement
    type('tortillas')
    enter()
    expect(input).toHaveValue('')
    expect(input).toBeInTheDocument()
    expect(input).toHaveFocus()
  })

  it('ignores an empty or whitespace-only submit', () => {
    const onSubmit = vi.fn()
    render(<CaptureField onSubmit={onSubmit} placeholder="Add to Grocery" label="Add to Grocery" />)
    enter()
    type('   ')
    enter()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('reports every keystroke so the surface can state the filing before the commit', () => {
    const onValueChange = vi.fn()
    render(
      <CaptureField
        onSubmit={vi.fn()}
        onValueChange={onValueChange}
        placeholder="Add to Grocery"
        label="Add to Grocery"
      />
    )
    type('tort')
    expect(onValueChange).toHaveBeenLastCalledWith('tort')
    enter()
    expect(onValueChange).toHaveBeenLastCalledWith('')
  })

  it('renders the trailing scope slot', () => {
    render(
      <CaptureField
        onSubmit={vi.fn()}
        placeholder="Add to Grocery"
        label="Add to Grocery"
        trailing={<button>Grocery</button>}
      />
    )
    expect(screen.getByRole('button', { name: 'Grocery' })).toBeInTheDocument()
  })

  it('does not autofocus unless the surface asks — an unrequested keyboard is a surface decision (ADR 070)', () => {
    render(<CaptureField onSubmit={vi.fn()} placeholder="Add to Grocery" label="Add to Grocery" />)
    expect(screen.getByLabelText('Add to Grocery')).not.toHaveFocus()
  })

  it('focuses when the surface asks, even mounted long after the document parsed', () => {
    // The regression this guards: the `autoFocus` DOM prop is honoured by
    // browsers only during parsing, so it focused nothing on the two surfaces
    // that ask for it — both mount inside a lazily loaded federated remote.
    // Rendering into an already-parsed document is the closest a unit test gets
    // to that; the real proof was the live shell.
    render(
      <CaptureField
        onSubmit={vi.fn()}
        placeholder="Add to Grocery"
        label="Add to Grocery"
        autoFocus
      />
    )
    expect(screen.getByLabelText('Add to Grocery')).toHaveFocus()
  })

  it('waits for the field to be usable before claiming focus', async () => {
    // The real defect this caught: an ambient surface mounts DISABLED while its
    // first read is in flight, because it does not know its destination yet.
    // Focusing a disabled input is a silent no-op, so the wall came up with the
    // keyboard unclaimed — the one thing that surface exists to do.
    const { rerender } = render(
      <CaptureField
        onSubmit={vi.fn()}
        placeholder="Add to Grocery"
        label="Add to Grocery"
        autoFocus
        disabled
      />
    )
    expect(screen.getByLabelText('Add to Grocery')).not.toHaveFocus()

    rerender(
      <CaptureField
        onSubmit={vi.fn()}
        placeholder="Add to Grocery"
        label="Add to Grocery"
        autoFocus
      />
    )
    expect(screen.getByLabelText('Add to Grocery')).toHaveFocus()
  })

  it('does not yank the caret back if it is disabled and re-enabled later', async () => {
    const { rerender } = render(
      <CaptureField
        onSubmit={vi.fn()}
        placeholder="Add to Grocery"
        label="Add to Grocery"
        autoFocus
      />
    )
    const field = screen.getByLabelText('Add to Grocery')
    expect(field).toHaveFocus()

    field.blur()
    rerender(
      <CaptureField
        onSubmit={vi.fn()}
        placeholder="Add to Grocery"
        label="Add to Grocery"
        autoFocus
        disabled
      />
    )
    rerender(
      <CaptureField
        onSubmit={vi.fn()}
        placeholder="Add to Grocery"
        label="Add to Grocery"
        autoFocus
      />
    )
    expect(screen.getByLabelText('Add to Grocery')).not.toHaveFocus()
  })
})
