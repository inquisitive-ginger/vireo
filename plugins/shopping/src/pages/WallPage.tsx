import { useNavigate } from 'react-router-dom'
import { usePermissions } from '@family-os/platform'
import { ErrorCard } from '@family-os/ui'
import { useAmbientCapture } from '../lib/use-ambient-capture'
import { WallPageView } from './WallPageView'

/** How many chips the short memory holds. More than a row's worth stops being a
    memory and starts being the list the wall exists not to be. */
const JUST_ADDED = 5

export function WallPage() {
  const ability = usePermissions()
  const navigate = useNavigate()
  const capture = useAmbientCapture(ability.can('create', 'shopping.Item'))

  if (capture.error) {
    return (
      <div className="p-6">
        <ErrorCard moduleName="Shopping" onRetry={capture.refetch} />
      </div>
    )
  }

  return (
    <WallPageView
      justAdded={(capture.data?.items ?? [])
        .slice(0, JUST_ADDED)
        .map((i) => ({ id: i.id, name: i.name }))}
      lists={capture.data?.lists ?? []}
      openCount={capture.openCount}
      loading={capture.loading}
      destination={capture.destination}
      onAdd={capture.add}
      onDraftChange={capture.onDraftChange}
      draftAisle={capture.draftAisle}
      addError={capture.addError}
      canAdd={capture.canAdd}
      // The one way off the wall, and the only navigation on it.
      onSeeLists={() => void navigate('/shopping')}
    />
  )
}
