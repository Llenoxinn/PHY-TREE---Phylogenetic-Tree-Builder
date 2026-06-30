import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex items-center justify-center bg-surface-alt text-text-primary">
          <div className="max-w-md text-center space-y-3">
            <div className="text-3xl font-bold text-blush-500">!</div>
            <h2 className="text-sm font-semibold">Something went wrong</h2>
            <p className="text-[11px] text-text-secondary font-mono leading-relaxed">
              {this.state.error?.message}
            </p>
            <button
              onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload() }}
              className="px-3 py-1.5 text-[11px] font-medium bg-blush-500 text-white hover:bg-blush-600 transition-colors"
            >
              Reload
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
