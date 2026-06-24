import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FieldLabel } from './field-label'

describe('FieldLabel', () => {
  it('renders the label and associates via htmlFor', () => {
    render(
      <>
        <FieldLabel htmlFor="title">Task title</FieldLabel>
        <input id="title" />
      </>
    )
    expect(screen.getByText('Task title')).toBeInTheDocument()
    // The label is wired to the input.
    expect(screen.getByLabelText('Task title')).toBeInTheDocument()
  })

  it('appends an "(optional)" suffix when optional', () => {
    render(<FieldLabel optional>Due date</FieldLabel>)
    expect(screen.getByText(/\(optional\)/)).toBeInTheDocument()
  })
})
