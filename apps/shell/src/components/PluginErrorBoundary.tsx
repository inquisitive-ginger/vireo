import { Component, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@family-os/ui'
import { evictPlugin } from '@/lib/load-plugin'

type Props = { remoteName: string; children: ReactNode }
type State = { failed: boolean; retried: boolean }

export class PluginErrorBoundary extends Component<Props, State> {
  state: State = { failed: false, retried: false }

  static getDerivedStateFromError(): Partial<State> {
    return { failed: true }
  }

  reset = () => {
    evictPlugin(this.props.remoteName)
    this.setState({ failed: false, retried: true })
  }

  render() {
    if (this.state.failed) {
      // A remote whose assets failed to fetch stays failed for the life of the page:
      // the browser caches the failure in its module map, so a second import of the
      // same URL never reaches the network. Once a retry is spent, only a reload can
      // recover — offering "Retry" again would be a button that cannot work.
      const reload = this.state.retried
      return (
        <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
          <AlertTriangle
            size={40}
            strokeWidth={1.5}
            className="text-muted-foreground"
            aria-hidden
          />
          <h1 className="text-display-lg">Something went wrong</h1>
          <p className="text-body text-muted-foreground">
            This plugin hit an error. Other plugins are unaffected.
          </p>
          <Button variant="outline" onClick={reload ? () => window.location.reload() : this.reset}>
            {reload ? 'Reload page' : 'Retry'}
          </Button>
        </div>
      )
    }
    return this.props.children
  }
}
