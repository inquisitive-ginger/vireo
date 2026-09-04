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
})
