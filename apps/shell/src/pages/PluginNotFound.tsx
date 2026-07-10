import { useNavigate } from 'react-router-dom'
import { PackageX } from 'lucide-react'
import { Button } from '@family-os/ui'

export function PluginNotFound() {
  const navigate = useNavigate()
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <PackageX size={40} strokeWidth={1.5} className="text-muted-foreground" aria-hidden />
      <h1 className="text-display-lg">Page not found</h1>
      <p className="text-body text-muted-foreground">No plugin is registered for this route.</p>
      <Button variant="outline" onClick={() => navigate(-1)}>
        Go back
      </Button>
    </div>
  )
}
