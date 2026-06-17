import type { ReactNode } from 'react'
import { MessagesSquare } from 'lucide-react'
import { EmptyState } from '@family-os/ui'

interface FeedEmptyStateProps {
  compose?: ReactNode
  /** Compact layout for widget slots (~180px tall). */
  compact?: boolean
}

export function FeedEmptyState({ compose, compact = false }: FeedEmptyStateProps) {
  return (
    <EmptyState
      icon={MessagesSquare}
      heading="Nothing on the board yet"
      body="Be the first to leave a note."
      action={compose}
      compact={compact}
    />
  )
}
