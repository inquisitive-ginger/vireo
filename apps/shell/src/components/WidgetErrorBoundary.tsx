import { Component, Fragment, type ReactNode } from 'react'
import { ErrorCard } from '@family-os/ui'

type Props = {
  moduleName: string
  children: ReactNode
  /** Notifies the parent when the caught/recovered state flips, so the shell can
      render the slot flat (per design-system.md "Error state (slot level)"). */
  onErrorChange?: (hasError: boolean) => void
}
type State = { hasError: boolean; remountKey: number }

export class WidgetErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, remountKey: 0 }

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true }
  }

  componentDidCatch() {
    this.props.onErrorChange?.(true)
  }

  reset = () => {
    this.setState((s) => ({ hasError: false, remountKey: s.remountKey + 1 }))
    this.props.onErrorChange?.(false)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorCard moduleName={this.props.moduleName} onRetry={this.reset} />
    }
    // Keyed so retry gives the widget subtree a fresh mount (re-runs the failed load).
    return <Fragment key={this.state.remountKey}>{this.props.children}</Fragment>
  }
}
