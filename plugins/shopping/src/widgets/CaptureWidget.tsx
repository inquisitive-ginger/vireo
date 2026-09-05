import { usePermissions } from '@family-os/platform'
import { useAmbientCapture } from '../lib/use-ambient-capture'
import { CaptureWidgetView } from './CaptureWidgetView'

/* The fifth registration point rides on this file: the manifest entry, the
   federation expose, `load-plugin.ts`, `federation.d.ts` — and `WIDGET_META` in
   the shell's `Home.tsx`, without which the widget drops off the dashboard with
   no error anywhere. */
export default function CaptureWidget() {
  const ability = usePermissions()
  const capture = useAmbientCapture(
    ability.can('create', 'shopping.Item'),
    // Whether `Take it back?` is offered beside a duplicate notice at all; the
    // just-created row's own eligibility is the server's `canRetract` (ADR 073).
    ability.can('retract', 'shopping.Item')
  )

  return (
    <CaptureWidgetView
      items={capture.data?.items ?? []}
      openCount={capture.openCount}
      loading={capture.loading}
      // A failed background refetch keeps its data; only a read with nothing
      // behind it is an error the tile should speak about.
      error={capture.error && !capture.data}
      destination={capture.destination}
      onAdd={capture.add}
      report={capture.report}
      canAdd={capture.canAdd}
    />
  )
}
