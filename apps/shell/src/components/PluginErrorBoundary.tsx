import { Component, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { failed: boolean }

export class PluginErrorBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center gap-3">
          <p className="text-sm font-medium text-destructive">Plugin failed to load</p>
          <p className="text-xs text-muted-foreground">
            This plugin encountered an error. Other plugins are unaffected.
          </p>
        </div>
      )
    }
    return this.props.children
  }
}
