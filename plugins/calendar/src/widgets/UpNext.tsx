import { EmptyState } from '@family-os/ui'

/* Stub for the `calendar.up-next` widget. The real widget (Family/Mine framings,
   owner spine, three sizes) is story #7; this story only reserves the exposed
   module so the manifest, federation, and shell widget-loader wiring resolve. */
export function UpNext() {
  return <EmptyState compact heading="Up Next" body="Coming soon." />
}

export default UpNext
