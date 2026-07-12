import { useState } from 'react'
import { cn } from '../lib/utils'
import { identityToken, resolveHue, type OwnerHue } from '../lib/identity'

export type ProfileAvatarSize = 'sm' | 'base' | 'md' | 'lg'

export interface ProfileAvatarProps {
  name: string
  size?: ProfileAvatarSize
  active?: boolean
  avatarUrl?: string
  /** Explicitly assigned identity hue; falls back to a name hash. Pass `FAMILY_HUE`
   *  for the household pseudo-profile — the hash only ever returns member hues, so
   *  without it the family would wear one of its own members' colours (ADR 041). */
  identity?: OwnerHue
  className?: string
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  return (
    parts
      .map((w) => w[0] ?? '')
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?'
  )
}

const SIZE_CLASSES: Record<ProfileAvatarSize, string> = {
  sm: 'w-8 h-8 text-xs-body',
  base: 'w-10 h-10 text-sm-token',
  md: 'w-14 h-14 text-base',
  // Raw px is intentional here: initials scale with the lg avatar, off the token ramp.
  lg: 'w-20 h-20 text-[22px]',
}

export function ProfileAvatar({
  name,
  size = 'md',
  active = false,
  avatarUrl,
  identity,
  className,
}: ProfileAvatarProps) {
  const hue: OwnerHue = identity ?? resolveHue(name)
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = Boolean(avatarUrl) && !imageFailed

  // A photo is a FACE, not an identity token (ADR 042). It fills the circle — no
  // hue band. The identity hue is carried by the chrome BESIDE the avatar (the
  // ItemCard spine, an identity wash, a hue pill), never by the avatar itself, so a
  // photo and the identity system never compete. Any surface showing several people
  // at once must therefore carry a hue element of its own; an avatar alone is not
  // enough once it can hold a face.
  //
  // Initials are the base layer, so a broken or absent URL falls back to them
  // rather than to an empty circle — and initials still sit on the identity tint.
  return (
    <div
      role="img"
      aria-label={name}
      className={cn(
        'relative overflow-hidden rounded-full flex items-center justify-center font-semibold shrink-0 select-none',
        'transition-[outline-offset] duration-[var(--duration-normal)] ease-[var(--ease-out)]',
        active && 'outline outline-2 outline-primary outline-offset-[3px]',
        SIZE_CLASSES[size],
        className
      )}
      style={{
        backgroundColor: identityToken(hue, 'tint'),
        color: identityToken(hue, 'ink'),
      }}
    >
      {getInitials(name)}
      {showImage && (
        <img
          src={avatarUrl}
          alt=""
          aria-hidden
          onError={() => setImageFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  )
}
