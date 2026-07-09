import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CalendarDays, Repeat } from 'lucide-react'
import { TabBar } from './tab-bar'

const OPTIONS = [
  { value: 'calendar', label: 'Calendar', icon: CalendarDays },
  { value: 'activities', label: 'Activities', icon: Repeat },
]

function setup(value = 'calendar', onChange = vi.fn(), idBase?: string) {
  render(
    <TabBar
      aria-label="Calendar surface"
      options={OPTIONS}
      value={value}
      onChange={onChange}
      idBase={idBase}
    />
  )
  return { onChange }
}

describe('TabBar', () => {
  it('renders a labelled tablist of its options', () => {
    setup()
    expect(screen.getByRole('tablist', { name: 'Calendar surface' })).toBeInTheDocument()
    expect(screen.getAllByRole('tab')).toHaveLength(2)
  })

  it('marks the selected tab with aria-selected', () => {
    setup('activities')
    expect(screen.getByRole('tab', { name: 'Activities' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Calendar' })).toHaveAttribute('aria-selected', 'false')
  })

  it('gives only the selected tab a tabbable roving tabindex', () => {
    setup('activities')
    expect(screen.getByRole('tab', { name: 'Activities' })).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('tab', { name: 'Calendar' })).toHaveAttribute('tabindex', '-1')
  })

  it('underlines the active tab with the primary token', () => {
    setup('calendar')
    expect(screen.getByRole('tab', { name: 'Calendar' }).className).toContain('border-primary')
    expect(screen.getByRole('tab', { name: 'Activities' }).className).toContain(
      'text-muted-foreground'
    )
  })

  it('calls onChange with the clicked value', () => {
    const { onChange } = setup('calendar')
    fireEvent.click(screen.getByRole('tab', { name: 'Activities' }))
    expect(onChange).toHaveBeenCalledWith('activities')
  })

  it('moves to the next tab on ArrowRight and wraps on ArrowLeft', () => {
    const { onChange } = setup('calendar')
    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowRight' })
    expect(onChange).toHaveBeenCalledWith('activities')
    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowLeft' })
    expect(onChange).toHaveBeenCalledWith('activities') // wraps first → last
  })

  it('emits tab ids from idBase so a tabpanel can be associated', () => {
    setup('calendar', vi.fn(), 'surface')
    expect(screen.getByRole('tab', { name: 'Calendar' })).toHaveAttribute(
      'id',
      'surface-tab-calendar'
    )
  })
})
