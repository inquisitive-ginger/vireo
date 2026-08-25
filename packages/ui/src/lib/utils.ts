import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/* Register our custom typography token utilities (defined in styles.css) as
   font-size classes. Without this, tailwind-merge treats e.g. `text-sm-token`
   as an unknown `text-*` and conflates it with `text-{color}` utilities, so
   cn('text-sm-token', 'text-muted-foreground') silently DROPS the size and the
   text falls back to the browser default. Registering them as font-size keeps
   size and color independent (and makes two token sizes mutually exclusive,
   which is correct). */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        'text-xs-token',
        'text-section-label',
        'text-sm-token',
        'text-base-token',
        'text-card-title',
        'text-list-title',
        'text-body',
        'text-prose',
        'text-heading',
        'text-page-title',
        'text-display-lg',
        'text-metric',
        'text-display-xl',
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
