import type { ReactNode } from 'react'
import { MessagesSquare } from 'lucide-react'

interface FeedEmptyStateProps {
  compose?: ReactNode
  /** Compact layout for widget slots (~180px tall). */
  compact?: boolean
}

export function FeedEmptyState({ compose, compact = false }: FeedEmptyStateProps) {
  if (compact) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-center px-6 py-3">
        <h2 className="text-card-title" style={{ color: 'var(--foreground)', margin: 0 }}>
          Nothing on the board yet
        </h2>
        <p className="text-sm-token" style={{ color: 'var(--muted-foreground)', margin: 0 }}>
          Be the first to leave a note.
        </p>
        {compose}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 text-center px-6 py-5">
      <MessagesSquare
        size={36}
        style={{ color: 'var(--muted-foreground)', opacity: 0.4 }}
        strokeWidth={1.5}
      />
      <h2 className="text-display-lg" style={{ color: 'var(--foreground)', margin: 0 }}>
        Nothing on the board yet
      </h2>
      <p className="text-body" style={{ color: 'var(--muted-foreground)', margin: 0 }}>
        Be the first to leave a note.
      </p>
      {compose}
    </div>
  )
}
