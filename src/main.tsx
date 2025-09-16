import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { assertEnv } from './envCheck'
import { startMonitoring } from './monitoring'

assertEnv()
startMonitoring()

declare const __APP_VERSION__: string

class RootErrorBoundary extends React.Component<{ children: React.ReactNode }, { error?: Error }> {
  state = { error: undefined as Error | undefined }
  static getDerivedStateFromError(error: Error) { return { error } }
  componentDidCatch(error: Error, info: unknown) { console.error('Root error:', error, info) }
  render() {
    if (this.state.error) {
      return (
        <div style={{ fontFamily: 'sans-serif', padding: 24 }}>
          <h1>Application Error</h1>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.error.message}</pre>
          <small style={{ opacity: 0.6 }}>Build: {__APP_VERSION__}</small>
        </div>
      )
    }
    return this.props.children
  }
}

window.addEventListener('unhandledrejection', e => console.error('Unhandled rejection:', (e as any).reason))
window.addEventListener('error', e => console.error('Global error:', (e as any).error || e.message))

const el = document.getElementById('root')
if (!el) {
  console.error('#root not found; check index.html')
} else {
  createRoot(el).render(
    <React.StrictMode>
      <RootErrorBoundary>
        <App />
      </RootErrorBoundary>
    </React.StrictMode>
  )
}
