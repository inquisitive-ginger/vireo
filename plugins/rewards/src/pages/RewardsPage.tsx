import { useState } from 'react'
import { PageContainer } from '@family-os/ui'
import { useAuth } from '@family-os/platform'
import { ApprovalsQueue } from '../components/ApprovalsQueue'
import { CatalogView } from '../components/CatalogView'
import { Store } from '../components/Store'
import { useQueuePayouts, useQueueRedemptions } from '../lib/hooks'

type Tab = 'approvals' | 'catalog'

/* The rewards plugin's home (M4/5). A kid (tier 1–3) lands straight on the store — the
   whole point of the module (ADR 053: tier 1 reaches its own balance and the store). A
   parent doesn't spend in the kid store; tier 4 gets its real work — the approvals queue
   and the catalog. */
export function RewardsPage() {
  const { tier } = useAuth()
  const [tab, setTab] = useState<Tab>('approvals')

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
