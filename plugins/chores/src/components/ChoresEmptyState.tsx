import type { ReactNode } from 'react'
import { CheckCircle2, CheckSquare } from 'lucide-react'
import { EmptyState } from '@family-os/ui'

export interface ChoresEmptyStateProps {
  /** Tier 1 gets a warm tone; tier 2+ a neutral one (design-system copy tone). */
  warmTone: boolean
  /** Admin framing — "assign the first chore" rather than "you're all caught up". */
  isAdmin: boolean
  /** Already PermissionGate-wrapped by the container; omitted when can() = false. */
  action?: ReactNode
}

/* Chores copy on top of the shared EmptyState primitive (design-system anatomy:
   module icon → display-lg heading → body → CTA). */
export function ChoresEmptyState({ warmTone, isAdmin, action }: ChoresEmptyStateProps) {
  const { heading, body } = copy(warmTone, isAdmin)
  return <EmptyState icon={CheckSquare} heading={heading} body={body} action={action} />
}

/* The board with Hide completed on and nothing left pending. It is not the same
   state as an empty board — the work exists and it is done — and the toggle sits
   directly above, so the way back is named rather than duplicated as a button. */
export function CompletedHiddenEmptyState() {
  return (
    <EmptyState
      icon={CheckCircle2}
      heading="All caught up"
      body="Every chore is done. Switch off Hide completed to see them."
    />
  )
}

function copy(warmTone: boolean, isAdmin: boolean): { heading: string; body: string } {
  if (isAdmin) {
    return { heading: 'No chores yet', body: 'Assign the first chore to get the family going.' }
  }
  if (warmTone) {
    return { heading: 'All done! 🎉', body: 'Nothing on your list right now.' }
  }
  return { heading: 'No chores assigned', body: 'Nothing on your list right now.' }
}
