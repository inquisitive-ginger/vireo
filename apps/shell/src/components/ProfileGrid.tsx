import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Check, Settings } from 'lucide-react'
import { ProfileAvatar, PinInput, cn } from '@family-os/ui'
import { useAuth } from '@family-os/platform'

type ProfileRow = { id: string; name: string; tier: number }
type PinPhase = 'list' | 'pin-entry' | 'pin-error'

interface ProfileGridProps {
  open: boolean
  onClose: () => void
  className?: string
  onNavigate?: (to: string) => void
}

export function ProfileGrid({ open, onClose, className, onNavigate }: ProfileGridProps) {
  const { id: activeId, tier: activeTier, familyName } = useAuth()
  const queryClient = useQueryClient()

  const [pinPhase, setPinPhase] = useState<PinPhase>('list')
  const [pinTarget, setPinTarget] = useState<ProfileRow | null>(null)
  const [pinValue, setPinValue] = useState('')

  const { data: profiles = [] } = useQuery<ProfileRow[]>({
    queryKey: ['api/profiles'],
    queryFn: () => fetch('/api/profiles').then((r) => r.json()) as Promise<ProfileRow[]>,
    staleTime: 30_000,
  })

  // Exclude active profile and the family pseudo-profile (shown as dedicated item below)
  const switchableProfiles = profiles.filter((p) => p.id !== activeId && p.id !== 'family')

  async function switchTo(target: ProfileRow) {
    const needsPin = target.tier === 4 && activeTier < 4
    if (needsPin) {
      setPinTarget(target)
      setPinPhase('pin-entry')
      setPinValue('')
      return
    }
    await doSwitch(target.id)
  }

  async function doSwitch(targetProfileId: string) {
    const res = await fetch('/api/auth/switch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetProfileId }),
    })
    if (!res.ok) return
    queryClient.removeQueries({ queryKey: ['api/home/layout', targetProfileId] })
    await queryClient.invalidateQueries({ queryKey: ['api/auth/me'] })
    resetAndClose()
  }

  async function submitPin(pin: string) {
    if (!pinTarget) return
    const res = await fetch('/api/auth/verify-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin, targetProfileId: pinTarget.id }),
    })
    if (!res.ok) {
      setPinPhase('pin-error')
      setPinValue('')
      setTimeout(() => {
        setPinPhase('pin-entry')
        setPinValue('')
      }, 900)
      return
    }
    queryClient.removeQueries({ queryKey: ['api/home/layout', pinTarget.id] })
    await queryClient.invalidateQueries({ queryKey: ['api/auth/me'] })
    resetAndClose()
  }

  function handlePinChange(val: string) {
    setPinValue(val)
    if (val.length === 4) setTimeout(() => submitPin(val), 200)
  }

  function resetAndClose() {
    setPinPhase('list')
    setPinTarget(null)
    setPinValue('')
    onClose()
  }

  if (!open) return null

  return (
    <>
      <div onClick={resetAndClose} className="fixed inset-0 z-30" />
      <div
        className={cn(
          'absolute top-[56px] left-0 right-0 z-40 border-b border-border bg-card shadow-[var(--shadow-raised)]',
          className
        )}
        style={{ animation: 'expandDown 180ms var(--ease-out)' }}
      >
        <style>{`
          @keyframes expandDown {
            from { opacity: 0; transform: translateY(-6px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {pinPhase === 'list' ? (
          <div className="flex flex-col p-2 gap-0.5">
            {switchableProfiles.map((profile) => (
              <button
                key={profile.id}
                onClick={() => switchTo(profile)}
                className={cn(
                  'flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-left cursor-pointer',
                  'transition-colors duration-[var(--duration-fast)]',
                  'hover:bg-background/60'
                )}
              >
                <ProfileAvatar name={profile.name} size="sm" />
                <span className="flex-1 text-sm">{profile.name.split(' ')[0]}</span>
              </button>
            ))}

            {/* Family view — always shown, switches to the family pseudo-profile */}
            <div className="border-t border-border mt-1 pt-1">
              <button
                onClick={() => doSwitch('family')}
                className={cn(
                  'flex items-center gap-2 w-full px-3 py-2.5 rounded-md cursor-pointer',
                  'transition-colors duration-[var(--duration-fast)]',
                  activeId === 'family'
                    ? 'bg-primary/10 pointer-events-none'
                    : 'hover:bg-background/60'
                )}
              >
                <ProfileAvatar name={familyName ?? 'Family'} size="sm" />
                <span className="text-sm text-muted-foreground leading-none">
                  {familyName ?? 'Family view'}
                </span>
                {activeId === 'family' && (
                  <Check size={13} className="text-primary shrink-0 ml-auto" />
                )}
              </button>
            </div>

            {/* Settings — only surfaced here on mobile (sidebar not available) */}
            {onNavigate && activeTier >= 2 && (
              <div className="border-t border-border mt-1 pt-1">
                <button
                  onClick={() => onNavigate('/settings')}
                  className={cn(
                    'flex items-center gap-3 w-full px-3 py-2.5 rounded-md cursor-pointer',
                    'transition-colors duration-[var(--duration-fast)]',
                    'text-muted-foreground hover:bg-background/60'
                  )}
                >
                  <Settings size={16} aria-hidden />
                  <span className="text-sm">Settings</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-5 px-3">
            <p className="text-xs font-medium text-muted-foreground">
              {pinPhase === 'pin-error' ? 'Incorrect PIN' : 'Enter family PIN'}
            </p>
            <PinInput
              value={pinValue}
              onChange={handlePinChange}
              error={pinPhase === 'pin-error'}
              size="sm"
              autoFocus
            />
            <button
              onClick={() => {
                setPinPhase('list')
                setPinValue('')
              }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </>
  )
}
