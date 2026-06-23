import { CalendarDays } from 'lucide-react'
import { EmptyState, PageHeader } from '@family-os/ui'

/* Placeholder route for the calendar module. The real glanceable month view
   lands in story #2 (Tablet Month View); this story (#1) ships only the data
   backbone, the plugin scaffold, and this stub so `/calendar` resolves. */
export function CalendarPage() {
  return (
    <div className="mx-auto w-full max-w-[680px] px-6 pt-7 pb-12">
      <PageHeader eyebrow="Calendar" title="The family calendar" />
      <EmptyState
        icon={CalendarDays}
        heading="The month view is on its way"
        body="Events have a home now — the glanceable month grid arrives in the next calendar story."
      />
    </div>
  )
}
