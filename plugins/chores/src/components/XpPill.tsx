import { Star } from 'lucide-react'

export interface XpPillProps {
  value: number
  /** Earned (post-completion) reads as success-green; pending is a quiet score. */
  earned?: boolean
}

/* The XP score on a task. XP demoted off gold when F$ took the coin (ADR 051): a
   score is a fact about you, not a thing you hold, so it is a quiet star in
   --muted-foreground and keeps no metal. Earned still reads success-green. */
export function XpPill({ value, earned = false }: XpPillProps) {
  if (earned) {
    return <span className="text-sm-token font-semibold text-success">✓ +{value} XP</span>
  }
  return (
    <span className="text-sm-token inline-flex items-center gap-1 font-semibold text-muted-foreground">
      <Star size={12} strokeWidth={2.5} />
      {value} XP
    </span>
  )
}
