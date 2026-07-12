import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProfileAvatar } from './profile-avatar'
import { FAMILY_HUE, getIdentityHue, identityToken } from '../lib/identity'

const PHOTO = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA=='

function circleOf(container: HTMLElement): HTMLElement {
  return container.firstElementChild as HTMLElement
}

describe('ProfileAvatar', () => {
  describe('initials', () => {
    it('renders two initials from a first + last name', () => {
      render(<ProfileAvatar name="Dana Pritchett" />)
      expect(screen.getByRole('img', { name: 'Dana Pritchett' })).toHaveTextContent('DP')
    })

    it('renders a single initial from a mononym', () => {
      render(<ProfileAvatar name="Teddy" />)
      expect(screen.getByRole('img', { name: 'Teddy' })).toHaveTextContent('T')
    })

    it('falls back to ? when the name is blank', () => {
      const { container } = render(<ProfileAvatar name="   " />)
      expect(circleOf(container)).toHaveTextContent('?')
    })
  })

  describe('identity hue', () => {
    it('uses the explicit identity over the name hash', () => {
      const { container } = render(<ProfileAvatar name="Dana Pritchett" identity="plum" />)
      expect(circleOf(container)).toHaveStyle({
        backgroundColor: identityToken('plum', 'tint'),
      })
    })

    it('wears the Family hue when told to, not a member hue (ADR 041)', () => {
      const { container } = render(<ProfileAvatar name="Family" identity={FAMILY_HUE} />)
      expect(circleOf(container)).toHaveStyle({
        backgroundColor: identityToken(FAMILY_HUE, 'tint'),
      })
      // The hash would otherwise hand the household one of its own members' colours.
      expect(identityToken(FAMILY_HUE, 'tint')).not.toBe(
        identityToken(getIdentityHue('Family'), 'tint')
      )
    })
  })

  describe('photo (ADR 042)', () => {
    it('renders the photo over the initials', () => {
      const { container } = render(<ProfileAvatar name="Dana Pritchett" avatarUrl={PHOTO} />)
      const img = container.querySelector('img')
      expect(img).toHaveAttribute('src', PHOTO)
      // The initials stay in the DOM as the layer underneath.
      expect(circleOf(container)).toHaveTextContent('DP')
    })

    it('fills the circle — the avatar carries no hue band', () => {
      // A photo is a face, not an identity token. The hue is carried by the chrome
      // BESIDE the avatar (the ItemCard spine, an identity wash), never by the
      // avatar itself, so a photo and the identity system never compete.
      const { container } = render(<ProfileAvatar name="Dana Pritchett" avatarUrl={PHOTO} />)
      const img = container.querySelector('img')
      expect(img?.className).toContain('inset-0')
      expect(img?.className).toContain('h-full')
      expect(img?.className).toContain('w-full')
    })

    it('keeps the identity tint underneath, so initials still wear the hue', () => {
      const { container } = render(
        <ProfileAvatar name="Dana Pritchett" identity="terracotta" avatarUrl={PHOTO} />
      )
      expect(circleOf(container)).toHaveStyle({
        backgroundColor: identityToken('terracotta', 'tint'),
      })
    })

    it('keeps the footprint fixed whether or not there is a photo', () => {
      const { container, rerender } = render(<ProfileAvatar name="Dana Pritchett" size="sm" />)
      const withoutPhoto = circleOf(container).className

      rerender(<ProfileAvatar name="Dana Pritchett" size="sm" avatarUrl={PHOTO} />)
      expect(circleOf(container).className).toBe(withoutPhoto)
      expect(circleOf(container).className).toContain('w-8')
      expect(circleOf(container).className).toContain('h-8')
    })

    it('reverts to initials when the photo fails to load', () => {
      const { container } = render(
        <ProfileAvatar name="Dana Pritchett" identity="terracotta" avatarUrl="/broken.webp" />
      )
      const img = container.querySelector('img') as HTMLImageElement
      fireEvent.error(img)

      expect(container.querySelector('img')).toBeNull()
      expect(circleOf(container)).toHaveStyle({
        backgroundColor: identityToken('terracotta', 'tint'),
      })
      expect(circleOf(container)).toHaveTextContent('DP')
    })
  })

  describe('active state', () => {
    it('sits outside the circle', () => {
      const { container } = render(<ProfileAvatar name="Dana Pritchett" avatarUrl={PHOTO} active />)
      expect(circleOf(container).className).toContain('outline-offset-[3px]')
    })

    it('is absent when inactive', () => {
      const { container } = render(<ProfileAvatar name="Dana Pritchett" />)
      expect(circleOf(container).className).not.toContain('outline-primary')
    })
  })
})
