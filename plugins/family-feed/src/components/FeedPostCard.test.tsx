import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { IDENTITY_HUES, getIdentityHue } from '@family-os/ui'
import { FeedPostCard } from './FeedPostCard'
import { post } from '../test-posts'

function spineOf(container: HTMLElement): string {
  const spine = container.querySelector('span[aria-hidden]') as HTMLElement | null
  if (!spine) throw new Error('no spine')
  return spine.style.background
}

describe('FeedPostCard', () => {
  it("D-044 paints the author's assigned hue, not the name hash [F-011]", () => {
    const assigned = IDENTITY_HUES.find((h) => h !== getIdentityHue('Maya'))!
    const { container } = render(
      <FeedPostCard post={post({ author: { identityHue: assigned } })} />
    )

    expect(spineOf(container)).toBe(`var(--identity-${assigned})`)
  })

  it('D-042 keeps the identity spine when the author has a photo [F-011]', () => {
    const { container } = render(
      <FeedPostCard
        post={post({ author: { identityHue: 'sage', avatarUrl: '/avatars/maya.jpg' } })}
      />
    )

    expect(container.querySelector('img')).toHaveAttribute('src', '/avatars/maya.jpg')
    expect(spineOf(container)).toBe('var(--identity-sage)')
  })

  it('F-011 shows who posted, what they said and how long ago', () => {
    render(
      <FeedPostCard post={post({ createdAt: new Date(Date.now() - 5 * 60_000).toISOString() })} />
    )

    expect(screen.getByText('Maya')).toBeInTheDocument()
    expect(screen.getByText('Pizza night is moved to Friday')).toBeInTheDocument()
    expect(screen.getByText('5m ago')).toBeInTheDocument()
  })
})
