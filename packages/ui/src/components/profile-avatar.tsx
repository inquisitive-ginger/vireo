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
  sm: 'w-8 h-8 text-[11px]',
  base: 'w-10 h-10 text-[13px]',
  md: 'w-14 h-14 text-base',
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
  return (
    <div
      role="img"
      aria-label={name}
      className={cn(
        'rounded-full flex items-center justify-center font-semibold shrink-0 select-none',
        'transition-[outline-offset] duration-[var(--duration-normal)] ease-[var(--ease-out)]',
        active && 'outline outline-2 outline-primary outline-offset-[3px]',
        SIZE_CLASSES[size],
        className
      )}
      style={{
        backgroundColor: identityToken(hue, 'tint'),
        color: identityToken(hue, 'ink'),
        backgroundImage: avatarUrl ? `url(${avatarUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {!avatarUrl && getInitials(name)}
    </div>
  )
}
