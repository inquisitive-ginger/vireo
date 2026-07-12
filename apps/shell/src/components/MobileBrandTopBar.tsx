import { FAMILY_HUE, ProfileAvatar } from '@family-os/ui'
import { NotificationBell } from './NotificationBell'

export function MobileBrandTopBar({
  name,
  isFamily = false,
  profileOpen,
  onProfileClick,
}: {
  name: string
  /** On the household pseudo-profile the avatar wears the reserved family hue —
   *  the name hash only ever returns member hues (ADR 041). */
  isFamily?: boolean
  profileOpen: boolean
  onProfileClick: () => void
}) {
  return (
    <header
      className="grid grid-cols-[1fr_auto_1fr] items-center md:hidden px-3 min-h-top-bar bg-secondary border-b border-border shrink-0"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <button
        type="button"
        onClick={onProfileClick}
        aria-label="Profile and settings"
        aria-expanded={profileOpen}
        className="justify-self-start rounded-full cursor-pointer"
      >
        <ProfileAvatar
          name={name}
          identity={isFamily ? FAMILY_HUE : undefined}
          size="sm"
          active={profileOpen}
        />
      </button>
      <span className="justify-self-center text-base-token font-semibold tracking-tight text-foreground">
        Family OS
      </span>
      <NotificationBell className="justify-self-end" compact />
    </header>
  )
}
