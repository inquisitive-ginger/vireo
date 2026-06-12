import type { LucideIcon } from 'lucide-react'
import { cn } from '../lib/utils'

export interface PlaceholderCardProps {
  moduleName: string
  description: string
  icon: LucideIcon
  className?: string
}

export function PlaceholderCard({
  moduleName,
  description,
  icon: Icon,
  className,
}: PlaceholderCardProps) {
  return (
    <div
      className={cn('@container h-full w-full', className)}
      aria-label={`${moduleName} — not installed`}
      role="status"
    >
      <div
        className={cn(
          'flex h-full w-full flex-col items-center justify-center gap-2.5 rounded-xl px-5 py-5',
          'bg-muted text-center',
          '@[600px]:flex-row @[600px]:text-left @[600px]:gap-3.5'
        )}
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-muted-foreground/10">
          <Icon className="size-5 text-muted-foreground" strokeWidth={1.5} aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] font-medium leading-none tracking-[0.01em] text-muted-foreground">
            {moduleName}
          </span>
          <span className="text-[11px] leading-[1.4] text-muted-foreground/70">{description}</span>
        </div>
      </div>
    </div>
  )
}
