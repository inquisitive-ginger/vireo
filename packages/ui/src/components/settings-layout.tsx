import type { ReactNode } from 'react'
import { cn } from '../lib/utils'

export interface SettingsSectionProps {
  title: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function SettingsSection({ title, action, children, className }: SettingsSectionProps) {
  return (
    <section
      className={cn('border border-border rounded-2xl overflow-hidden bg-background', className)}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
          {title}
        </h2>
        {action && <div>{action}</div>}
      </div>
      {children}
    </section>
  )
}

export interface SettingsLayoutProps {
  children: ReactNode
}

export function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight mb-7">Settings</h1>
      <div className="flex flex-col gap-5">{children}</div>
    </div>
  )
}
