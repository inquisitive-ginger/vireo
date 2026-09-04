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

  /* ADR 070, amended 2026-09-04: NO surface autofocuses, and there is no prop
     to ask. The three tests below are the record of why that is not merely a
     default — the two mechanisms cost a live-shell session to find, and both
     are invisible to a test that mounts this component directly. */

  it('never claims focus on mount — no surface autofocuses (ADR 070, amended)', () => {
    render(<CaptureField onSubmit={vi.fn()} placeholder="Add to Grocery" label="Add to Grocery" />)
    expect(screen.getByLabelText('Add to Grocery')).not.toHaveFocus()
  })

  it("offers no way to ask for focus — the decision is not a call site's to make", () => {
    render(
      <CaptureField
        onSubmit={vi.fn()}
        placeholder="Add to Grocery"
        label="Add to Grocery"
        // A prop nobody may set is a trap, so there is no prop: TypeScript
        // rejects `autoFocus` at every call site. Forced through at runtime it
        // still does nothing, which is what this asserts. If autofocus ever
        // returns it comes back through the ADR, not through a call site.
        {...({ autoFocus: true } as Record<string, unknown>)}
      />
    )
    expect(screen.getByLabelText('Add to Grocery')).not.toHaveFocus()
  })

  it('stays unfocused when a disabled field becomes usable', () => {
    // The second mechanism, kept because it is the one that made the first look
    // fixed when it was not: this field mounts DISABLED while its first read is
    // in flight, and focusing a disabled input is a silent no-op — so an
    // autofocus that "works" in a unit test can still focus nothing in the app.
    const { rerender } = render(
      <CaptureField
        onSubmit={vi.fn()}
        placeholder="Add to Grocery"
        label="Add to Grocery"
        disabled
      />
    )
    rerender(
      <CaptureField onSubmit={vi.fn()} placeholder="Add to Grocery" label="Add to Grocery" />
    )
    expect(screen.getByLabelText('Add to Grocery')).not.toHaveFocus()
  })
})
