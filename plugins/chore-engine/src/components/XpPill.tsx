import { GOLD_INK, GOLD_TINT } from '../lib/gold'

export interface XpPillProps {
  value: number
  /** Earned (post-completion) reads as success-green; pending reads as gold reward. */
  earned?: boolean
}

/** The gold reward pill on a task. Gold = XP only. Once a task is done, the
    reward reads as banked (success green). */
export function XpPill({ value, earned = false }: XpPillProps) {
  if (earned) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          fontFamily: 'var(--font-ui)',
          fontSize: 12,
          fontWeight: 700,
          color: 'var(--success)',
          lineHeight: 1,
        }}
      >
        ✓ +{value} XP
      </span>
    )
  }
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3,
        background: GOLD_TINT,
        borderRadius: 9999,
        padding: '4px 10px',
        fontFamily: 'var(--font-ui)',
        fontSize: 12,
        fontWeight: 700,
        color: GOLD_INK,
        lineHeight: 1,
      }}
    >
      +{value} XP
    </span>
  )
}
