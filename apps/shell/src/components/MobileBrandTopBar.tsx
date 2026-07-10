import { ProfileAvatar } from '@family-os/ui'
import { NotificationBell } from './NotificationBell'

export function MobileBrandTopBar({
  name,
  profileOpen,
  onProfileClick,
}: {
  name: string
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
        <ProfileAvatar name={name} size="sm" active={profileOpen} />
      </button>
      <span className="justify-self-center text-base-token font-semibold tracking-tight text-foreground">
        Family OS
      </span>
      <NotificationBell className="justify-self-end" compact />
    </header>
  )
}
