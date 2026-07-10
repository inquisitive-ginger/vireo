import { useState } from 'react'
import { cn } from '../lib/utils'
import { getIdentityHue, identityToken, type IdentityHue } from '../lib/identity'

export type ProfileAvatarSize = 'sm' | 'base' | 'md' | 'lg'

export interface ProfileAvatarProps {
  name: string
  size?: ProfileAvatarSize
  active?: boolean
  avatarUrl?: string
  /** Explicitly assigned identity hue; falls back to a name hash. */
  identity?: IdentityHue
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
  const hue = identity ?? getIdentityHue(name)
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = Boolean(avatarUrl) && !imageFailed

  // Initials are the base layer; the photo (when present and loadable) sits above
  // them, so a broken/absent URL falls back to initials rather than an empty circle.
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
