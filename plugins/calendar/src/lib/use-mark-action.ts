import { useMutation, useQueryClient } from '@family-os/platform'
import type { DayMark, DayMarkLine } from '@family-os/platform/types'
import { lineChange, type MarkLineAction } from './mark-lines'

/** A mark line's change (D-087) goes to the provider's own endpoint; the
 *  calendar never imports the provider. Shared by the page and the widget. */
export function useMarkAction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      mark,
      line,
      action,
    }: {
      mark: DayMark
      line: DayMarkLine
      action: MarkLineAction
    }) =>
      fetch(mark.act!.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineId: line.id, ...lineChange(line, action, mark.act!.owners) }),
      }).then((r) => {
        if (!r.ok) throw new Error(String(r.status))
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['calendar/day-marks'] }),
    onError: (err) => console.error('[calendar] day-mark change failed', err),
  })
}
