import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Artiverse Application Error:', error, errorInfo)
    const msg = error?.message || ''

    // If a transient DOM reconciliation error occurs (e.g. Google Translate or an extension modified DOM nodes)
    if (msg.includes('removeChild') || msg.includes('not a child of this node')) {
      const lastRecovery = sessionStorage.getItem('artiverse_dom_recovery')
      const now = Date.now()
      if (!lastRecovery || now - Number(lastRecovery) > 5000) {
        sessionStorage.setItem('artiverse_dom_recovery', String(now))
        window.location.reload()
      }
    }
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafaf7] px-4 text-center text-[#0d0f08]">
          <div className="max-w-md rounded-3xl border border-[#e4e6da] bg-white p-8 shadow-xl">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-[#d4ff1f]/30 text-[#414d1e]">
              <span className="text-xl font-bold">!</span>
            </div>
            <h1 className="font-display text-2xl font-bold">Something went wrong</h1>
            <p className="mt-2 text-sm text-[#5e6355]">
              {this.state.error?.message || 'An unexpected error occurred while rendering the page.'}
            </p>
            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={this.handleReload}
                className="lime-button rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0d0f08]"
              >
                Reload Page
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="rounded-full border border-[#e4e6da] bg-[#f5f6ef] px-5 py-2.5 text-xs font-semibold text-[#0d0f08] transition hover:bg-white"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
