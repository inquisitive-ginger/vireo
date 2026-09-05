import { useState } from 'react'
import { PageContainer, PageHeader, TabBar } from '@family-os/ui'
import { FAMILY_PROFILE_ID, useAuth } from '@family-os/platform'
import { ApprovalsQueue } from '../components/ApprovalsQueue'
import { CatalogView } from '../components/CatalogView'
import { Store } from '../components/Store'
import { WalletsView } from '../components/WalletsView'
import { WalletChooser } from '../components/WalletChooser'
import { useQueuePayouts, useQueueRedemptions } from '../lib/hooks'

type Tab = 'wallets' | 'approvals' | 'catalog'

/* The rewards plugin's home (M4/5). A kid (tier 1–3) lands straight on the store — the
   whole point of the module (ADR 053: tier 1 reaches its own balance and the store). A
   parent doesn't spend in the kid store; tier 4 gets its real work — the per-kid
   Wallets view (balances, tickets, bonuses — M4/7 gate: leftmost and the landing tab),
   the approvals queue, and the catalog. Both halves split their surfaces with the
   shared TabBar (a top-level split between peer surfaces — the calendar precedent). The
   family pseudo-profile holds no wallet (ADR 053), so it gets the chooser and never
   fetches one. */
export function RewardsPage() {
  const { id, tier } = useAuth()
  const [tab, setTab] = useState<Tab>('wallets')

  if (id === FAMILY_PROFILE_ID) {
    return (
      <PageContainer width="list">
        <WalletChooser />
      </PageContainer>
    )
  }

  if (tier < 4) {
    return (
      <PageContainer width="list">
        <Store />
      </PageContainer>
    )
  }

  return <ParentRewards tab={tab} setTab={setTab} />
}

function ParentRewards({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const payouts = useQueuePayouts()
  const redemptions = useQueueRedemptions()
  const waiting = (payouts.data?.length ?? 0) + (redemptions.data?.length ?? 0)

  return (
    <PageContainer width="list">
      <PageHeader
        title="Rewards"
        nav={
          <TabBar<Tab>
            aria-label="Rewards"
            value={tab}
            onChange={setTab}
            options={[
              { value: 'wallets', label: 'Wallets' },
              { value: 'approvals', label: 'Approvals', badge: waiting },
              { value: 'catalog', label: 'Catalog' },
            ]}
          />
        }
      />

      {tab === 'wallets' ? (
        <WalletsView />
      ) : tab === 'approvals' ? (
        <ApprovalsQueue />
      ) : (
        <CatalogView />
      )}
    </PageContainer>
  )
}
