import { cn } from '../lib/utils'

export type ProfileAvatarSize = 'sm' | 'md' | 'lg'

export interface ProfileAvatarProps {
  name: string
  size?: ProfileAvatarSize
  active?: boolean
  avatarUrl?: string
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

function getHue(name: string): number {
  let h = 0
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return h % 360
}

const SIZE_CLASSES: Record<ProfileAvatarSize, string> = {
  sm: 'w-8 h-8 text-[11px]',
  md: 'w-14 h-14 text-base',
  lg: 'w-20 h-20 text-[22px]',
}

export function ProfileAvatar({
  name,
  size = 'md',
  active = false,
  avatarUrl,
  className,
}: ProfileAvatarProps) {
  const hue = getHue(name)

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
        backgroundColor: `oklch(0.80 0.09 ${hue})`,
        color: `oklch(0.22 0.06 ${hue})`,
        backgroundImage: avatarUrl ? `url(${avatarUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {!avatarUrl && getInitials(name)}
    </div>
  )
}
