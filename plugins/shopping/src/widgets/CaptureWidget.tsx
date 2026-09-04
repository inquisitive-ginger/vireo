import { usePermissions } from '@family-os/platform'
import { useAmbientCapture } from '../lib/use-ambient-capture'
import { CaptureWidgetView } from './CaptureWidgetView'

/* The fifth registration point rides on this file: the manifest entry, the
   federation expose, `load-plugin.ts`, `federation.d.ts` — and `WIDGET_META` in
   the shell's `Home.tsx`, without which the widget drops off the dashboard with
   no error anywhere. */
export default function CaptureWidget() {
  const ability = usePermissions()
  const capture = useAmbientCapture(ability.can('create', 'shopping.Item'))

  return (
    <CaptureWidgetView
      items={capture.data?.items ?? []}
      openCount={capture.openCount}
      loading={capture.loading}
      error={capture.error}
      destination={capture.destination}
      onAdd={capture.add}
      onDraftChange={capture.onDraftChange}
      draftAisle={capture.draftAisle}
      addError={capture.addError}
      canAdd={capture.canAdd}
    />
  )
}
