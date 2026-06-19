import type { ReactNode } from 'react'
import { CheckSquare } from 'lucide-react'
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

function copy(warmTone: boolean, isAdmin: boolean): { heading: string; body: string } {
  if (isAdmin) {
    return { heading: 'No chores yet', body: 'Assign the first chore to get the family going.' }
  }
  if (warmTone) {
    return { heading: 'All done! 🎉', body: 'Nothing on your list right now.' }
  }
  return { heading: 'No chores assigned', body: 'Nothing on your list right now.' }
}
