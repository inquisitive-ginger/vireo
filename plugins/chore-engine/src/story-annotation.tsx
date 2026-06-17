import type { ReactNode } from 'react'

/* Storybook-only context annotation, matching the Foundation story
   conventions in packages/ui (uppercase 11px section label). Stories set
   `parameters.annotation`; decorators render it above the story. */

export function StoryAnnotation({ children }: { children: ReactNode }) {
  if (!children) return null
  return (
    <p
      style={{
        fontFamily: 'var(--font-ui)',
        fontSize: 11,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--muted-foreground)',
        margin: '0 0 12px',
      }}
    >
      {children}
    </p>
  )
}
