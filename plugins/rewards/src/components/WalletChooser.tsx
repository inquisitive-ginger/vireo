import { ProfileAvatar, Spine, identityToken, resolveHue } from '@family-os/ui'
import { FAMILY_PROFILE_ID, useQueryClient } from '@family-os/platform'
import { useProfiles } from '../lib/hooks'

/* The family profile's /rewards (M4/5c). A household holds no balance (ADR 053), and
   the fridge tablet sits on exactly this profile — so the page's job here is not to
   apologize with an error, it's to hand the store to whoever walked up. Tapping a
   face switches the session to that kid (no PIN below tier 4, same as the shell's
   switcher) and the store re-renders as theirs. This surface pairs faces with names,
   so each row carries the identity spine — the legend rule (ADR 042). */
export function WalletChooser() {
  const profiles = useProfiles()
  const queryClient = useQueryClient()

  const kids = (profiles.data ?? []).filter((p) => p.id !== FAMILY_PROFILE_ID && p.tier < 4)

  async function switchTo(targetProfileId: string) {
    const res = await fetch('/api/auth/switch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetProfileId }),
    })
    if (!res.ok) {
      console.error('[rewards] profile switch failed', res.status)
      return
    }
    queryClient.removeQueries({ queryKey: ['api/home/layout', targetProfileId] })
    await queryClient.invalidateQueries({ queryKey: ['api/auth/me'] })
  }

  return (
    <div className="mx-auto max-w-[430px] pt-6 text-center">
      <div className="text-3xl" aria-hidden>
        👛
      </div>
      <h1 className="text-page-title mt-2">Wallets are personal.</h1>
      <p className="text-sm-token mt-1 text-muted-foreground">Whose pocket?</p>

      <div className="mt-6 flex flex-col gap-2 text-left">
        {kids.map((kid) => (
          <button
            key={kid.id}
            type="button"
            onClick={() => switchTo(kid.id)}
            className="flex items-center gap-3 rounded-card border border-border bg-card px-4 py-3 text-left transition-transform active:scale-[0.99]"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <Spine color={identityToken(resolveHue(kid.name, kid.identityHue))} className="h-8" />
            <ProfileAvatar
              name={kid.name}
              identity={resolveHue(kid.name, kid.identityHue)}
              avatarUrl={kid.avatarUrl ?? undefined}
              size="sm"
            />
            <span className="text-sm-token flex-1 font-semibold">{kid.name.split(' ')[0]}</span>
            <span className="text-sm-token text-muted-foreground" aria-hidden>
              ›
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
