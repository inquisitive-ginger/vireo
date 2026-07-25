import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EmojiPicker, type EmojiGroup } from './emoji-picker'

const GROUPS: EmojiGroup[] = [
  { label: 'Treats', emojis: ['🍦', '🍗', '🍪'] },
  { label: 'Screen', emojis: ['🎮', '📺'] },
]

describe('EmojiPicker (scoped)', () => {
  it('renders the grouped set with no network', () => {
    render(<EmojiPicker groups={GROUPS} onSelect={vi.fn()} />)
    expect(screen.getByText('Treats')).toBeInTheDocument()
    expect(screen.getByText('Screen')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Use 🍦' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Use 🎮' })).toBeInTheDocument()
  })

  it('reports the chosen emoji', () => {
    const onSelect = vi.fn()
    render(<EmojiPicker groups={GROUPS} onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('button', { name: 'Use 🍗' }))
    expect(onSelect).toHaveBeenCalledWith('🍗')
  })

  it('marks the current selection pressed', () => {
    render(<EmojiPicker groups={GROUPS} selected="🍪" onSelect={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Use 🍪' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Use 🍦' })).toHaveAttribute('aria-pressed', 'false')
  })
})
