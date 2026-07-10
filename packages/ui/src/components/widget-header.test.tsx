import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CheckSquare } from 'lucide-react'
import { WidgetHeader } from './widget-header'

describe('WidgetHeader', () => {
  it('renders the label with a muted, hidden icon', () => {
    const { container } = render(<WidgetHeader icon={CheckSquare} label="Chores" />)
    expect(screen.getByText('Chores')).toBeInTheDocument()
    const icon = container.querySelector('svg[aria-hidden]')
    expect(icon).not.toBeNull()
    expect(icon).toHaveClass('text-muted-foreground')
  })

  it('renders the trailing slot when given', () => {
    render(<WidgetHeader icon={CheckSquare} label="Chores" trailing={<span>3 overdue</span>} />)
    expect(screen.getByText('3 overdue')).toBeInTheDocument()
  })

  it('omits trailing content when absent', () => {
    render(<WidgetHeader icon={CheckSquare} label="Calendar" />)
    expect(screen.queryByText('overdue')).toBeNull()
  })
})
