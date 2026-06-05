import { useQueryClient, useMutation } from '@tanstack/react-query'
import { Sun, Monitor, Moon } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useAuth } from '@family-os/platform'
import { Button, cn } from '@family-os/ui'

type DarkModeValue = boolean | null

const APPEARANCE_OPTIONS: { value: DarkModeValue; label: string; Icon: LucideIcon }[] = [
  { value: false, label: 'Light', Icon: Sun },
  { value: null, label: 'System', Icon: Monitor },
  { value: true, label: 'Dark', Icon: Moon },
]

export function Settings() {
  const { id: profileId, darkMode } = useAuth()
  const queryClient = useQueryClient()
  const isFamily = profileId === 'family'
  const controlsDisabled = isFamily || !profileId

  const { mutate, isPending } = useMutation({
    mutationFn: async (value: DarkModeValue) => {
      const res = await fetch('/api/preferences/dark-mode', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ darkMode: value }),
      })
      if (!res.ok) throw new Error('Failed to update preference')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api/auth/me'] })
    },
  })

  // darkMode undefined means auth hasn't resolved yet — treat as system (null)
  const activeValue: DarkModeValue = darkMode === undefined ? null : darkMode

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-xl font-semibold mb-8">Settings</h1>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          Display
        </h2>

        <div className="flex items-center justify-between py-4 border-b border-border">
          <div>
            <p className="text-sm font-medium">Appearance</p>
            {isFamily && (
              <p className="text-xs text-muted-foreground mt-0.5">
                The family profile follows the system setting
              </p>
            )}
          </div>

          <div
            className={cn(
              'flex rounded-lg bg-muted p-1 gap-0.5',
              (controlsDisabled || isPending) && 'pointer-events-none opacity-50'
            )}
          >
            {APPEARANCE_OPTIONS.map(({ value, label, Icon }) => {
              const isActive = activeValue === value
              return (
                <Button
                  key={String(value)}
                  variant="ghost"
                  size="sm"
                  onClick={() => mutate(value)}
                  disabled={controlsDisabled || isPending}
                  aria-pressed={isActive}
                  className={cn(
                    'gap-1.5',
                    isActive &&
                      'bg-background text-foreground shadow-sm hover:bg-background hover:text-foreground'
                  )}
                >
                  <Icon className="size-3.5" aria-hidden />
                  {label}
                </Button>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
