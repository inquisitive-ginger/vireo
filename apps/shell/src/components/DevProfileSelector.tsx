import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@family-os/platform'

type ProfileRow = { id: string; name: string; tier: number }

export function DevProfileSelector() {
  const { id: activeId } = useAuth()
  const queryClient = useQueryClient()

  const { data: profiles = [] } = useQuery<ProfileRow[]>({
    queryKey: ['profiles'],
    queryFn: () => fetch('/profiles').then((r) => r.json()) as Promise<ProfileRow[]>,
    staleTime: Infinity,
  })

  async function switchTo(targetProfileId: string) {
    const res = await fetch('/auth/switch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetProfileId }),
    })

    if (res.status === 403) {
      const pin = window.prompt('PIN required to switch to this profile:')
      if (!pin) return
      const verifyRes = await fetch('/auth/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, targetProfileId }),
      })
      if (!verifyRes.ok) {
        window.alert('Invalid PIN')
        return
      }
    } else if (!res.ok) {
      return
    }

    await queryClient.invalidateQueries({ queryKey: ['auth/me'] })
  }

  if (profiles.length === 0) return null

  return (
    <div className="px-4 py-2 border-t border-border">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Dev: Profile</p>
      <select
        className="w-full text-xs bg-background border border-border rounded px-2 py-1"
        value={activeId}
        onChange={(e) => switchTo(e.target.value)}
      >
        {profiles.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} (T{p.tier})
          </option>
        ))}
      </select>
    </div>
  )
}
