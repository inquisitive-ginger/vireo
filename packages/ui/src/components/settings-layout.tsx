import type { ReactNode } from 'react'
import { PageContainer } from './page-container'
import { PageHeader } from './page-header'
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
      className={cn(
        'border border-border rounded-2xl overflow-hidden bg-card shadow-[var(--shadow-card)]',
        className
      )}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <h2 className="text-section-label text-muted-foreground">{title}</h2>
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
    // `list` — a column of member/permission rows, the same role as the chores
    // board. This had drifted onto Tailwind's stock `max-w-2xl` (672px, 8px off
    // our token) *without* `mx-auto`, so Settings quietly hugged the left edge
    // while every sibling route sat centred.
    <PageContainer width="list">
      <PageHeader title="Settings" />
      <div className="flex flex-col gap-4 md:gap-5">{children}</div>
    </PageContainer>
  )
}
