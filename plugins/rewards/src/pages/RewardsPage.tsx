import { useState } from 'react'
import { PageContainer } from '@family-os/ui'
import { useAuth } from '@family-os/platform'
import { ApprovalsQueue } from '../components/ApprovalsQueue'
import { CatalogView } from '../components/CatalogView'
import { useQueuePayouts, useQueueRedemptions } from '../lib/hooks'

type Tab = 'approvals' | 'catalog'

/* The rewards plugin's tier-4 home: the approvals queue and the catalog. The kid
   store + wallet are a later story (M4/5); until then this surface is parents only.
   The whole plugin stays unregistered in prod (plugins.json) until that lands. */
export function RewardsPage() {
  const { tier } = useAuth()
  const [tab, setTab] = useState<Tab>('approvals')

  const payouts = useQueuePayouts()
  const redemptions = useQueueRedemptions()
  const waiting = (payouts.data?.length ?? 0) + (redemptions.data?.length ?? 0)

  if (tier < 4) {
    return (
      <PageContainer width="list">
        <p className="rounded-card border border-dashed border-border p-10 text-center text-sm-token text-muted-foreground">
          The store is coming soon.
        </p>
      </PageContainer>
    )
  }

  return (
    <PageContainer width="list">
      <h1 className="text-page-title mb-4">Rewards</h1>
      <div className="mb-6 flex gap-1 border-b border-border">
        <TabButton active={tab === 'approvals'} onClick={() => setTab('approvals')}>
          Approvals
          {waiting > 0 && (
            <span className="ml-2 rounded-full bg-primary px-1.5 py-0.5 text-xs-token text-primary-foreground">
              {waiting}
            </span>
          )}
        </TabButton>
        <TabButton active={tab === 'catalog'} onClick={() => setTab('catalog')}>
          Catalog
        </TabButton>
      </div>

      {tab === 'approvals' ? <ApprovalsQueue /> : <CatalogView />}
    </PageContainer>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`-mb-px flex items-center border-b-2 px-4 py-2.5 text-base-token font-semibold transition-colors ${
        active
          ? 'border-primary text-foreground'
          : 'border-transparent text-muted-foreground hover:text-foreground'
      }`}
    >
      {children}
    </button>
  )
}
