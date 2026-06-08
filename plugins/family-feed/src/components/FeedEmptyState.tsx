import { Rss } from 'lucide-react'

export function FeedEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 text-center px-6 py-5">
      <Rss size={36} style={{ color: 'var(--muted-foreground)', opacity: 0.4 }} strokeWidth={1.5} />
      <h2 className="text-display-lg" style={{ color: 'var(--foreground)', margin: 0 }}>
        No posts yet
      </h2>
      <p className="text-body" style={{ color: 'var(--muted-foreground)', margin: 0 }}>
        Be the first to share something.
      </p>
    </div>
  )
}
