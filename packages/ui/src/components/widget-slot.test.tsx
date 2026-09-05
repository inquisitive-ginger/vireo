import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { WidgetSlot, type WidgetSlotProps } from './widget-slot'

function slotClass(props: Partial<WidgetSlotProps>): string {
  const { container } = render(
    <WidgetSlot {...props}>
      <span>content</span>
    </WidgetSlot>
  )
  return (container.firstChild as HTMLElement).className
}

describe('WidgetSlot — elevation-ladder rungs', () => {
  it('feature lifts: raised shadow, hero radius, no border', () => {
    const cls = slotClass({ prominence: 'feature' })
    expect(cls).toContain('shadow-[var(--shadow-raised)]')
    expect(cls).toContain('rounded-hero')
    expect(cls).not.toContain('border')
  })

  it('card rests (the default): card shadow + soft hairline', () => {
    const cls = slotClass({})
    expect(cls).toContain('shadow-[var(--shadow-card)]')
    expect(cls).toContain('border')
    expect(cls).toContain('rounded-panel')
  })

  it('quiet recedes: recessed tint, no shadow', () => {
    const cls = slotClass({ prominence: 'quiet' })
    expect(cls).toContain('bg-secondary/60')
    expect(cls).not.toContain('shadow-[')
  })

  it('flat overrides prominence — no elevation, shape only (placeholder/error)', () => {
    const cls = slotClass({ prominence: 'feature', flat: true })
    expect(cls).not.toContain('shadow-')
    expect(cls).not.toContain('rounded-hero')
    expect(cls).toContain('rounded-panel')
  })
})
