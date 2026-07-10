import { Component, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@family-os/ui'

type Props = { children: ReactNode }
type State = { failed: boolean }

export class PluginErrorBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  reset = () => this.setState({ failed: false })

  render() {
    if (this.state.failed) {
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
          <Button variant="outline" onClick={this.reset}>
            Retry
          </Button>
        </div>
      )
    }
    return this.props.children
  }
}
