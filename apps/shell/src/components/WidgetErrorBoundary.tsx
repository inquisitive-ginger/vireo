import { Component, type ReactNode } from 'react'
import { ErrorCard } from '@family-os/ui'
import { evictWidget } from '@/lib/load-plugin'

type Props = {
  moduleName: string
  remoteName: string
  children: ReactNode
  /** Notifies the parent when the caught/recovered state flips, so the shell can
      render the slot flat (per design-system.md "Error state (slot level)"). */
  onErrorChange?: (hasError: boolean) => void
}
type State = { hasError: boolean; retried: boolean }

export class WidgetErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, retried: false }

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true }
  }

  componentDidCatch() {
    this.props.onErrorChange?.(true)
  }

  reset = () => {
    evictWidget(this.props.remoteName)
    this.setState({ hasError: false, retried: true })
    this.props.onErrorChange?.(false)
  }

  render() {
    if (this.state.hasError) {
      // The browser caches a failed module fetch for the life of the page, so a second
      // import of the same URL never reaches the network — once a retry is spent, a
      // reload is the only thing left that can recover.
      const reload = this.state.retried
      return (
        <ErrorCard
          moduleName={this.props.moduleName}
          onRetry={reload ? () => window.location.reload() : this.reset}
          retryLabel={reload ? 'Reload' : 'Retry'}
        />
      )
    }
    return this.props.children
  }
}
