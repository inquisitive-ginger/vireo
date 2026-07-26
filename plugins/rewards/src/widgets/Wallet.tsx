import { Loader2 } from 'lucide-react'
import { FAMILY_PROFILE_ID, useAuth } from '@family-os/platform'
import { useMyRedemptions, useStore, useXp } from '../lib/hooks'
import { WalletView } from './WalletView'

/* `rewards.wallet` widget container — registered in manifest.json `widgets[]`. Reads the
   same GET /rewards/store as the store page (shared `['rewards/store']` key, so a
   redemption there refreshes this), plus lifetime XP for the co-display footnote (taskee
   tiers only). A household has no balance (ADR 053), so the family pseudo-profile renders
   nothing. Self-sizes compact/standard via container queries in WalletView. */
export default function Wallet() {
  const { id, tier } = useAuth()
  const isFamily = id === FAMILY_PROFILE_ID
  const isTaskee = tier < 4 && !isFamily

  const store = useStore()
  const mine = useMyRedemptions()
  const xp = useXp(isTaskee)

  if (isFamily) return null
  if (store.isLoading) {
    return (
      <div className="flex size-full items-center justify-center">
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
      </div>
    )
  }
  if (store.isError || !store.data) return null

  return (
    <WalletView
      balance={store.data.balance}
      rewards={store.data.rewards}
      tickets={(mine.data ?? []).filter((t) => t.status === 'owned')}
      lifetimeXp={isTaskee ? xp.data?.totalXp : undefined}
    />
  )
}
