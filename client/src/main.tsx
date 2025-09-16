
/* eslint-disable react/prop-types */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './custom.css'

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('React Error Boundary:', error, errorInfo);
  }

  render() {
    if ((this.state as any).hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'system-ui' }}>
          <h1>⚠️ Something went wrong</h1>
          <p>The app encountered an error. Please refresh the page.</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{ 
              padding: '0.5rem 1rem', 
              background: '#3b82f6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return (this.props as any).children;
  }
}

// Enhanced mounting with error handling
function mountApp() {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('Root element not found');
    document.body.innerHTML = `
      <div style="padding: 2rem; font-family: system-ui; text-align: center;">
        <h1>❌ App Mount Failed</h1>
        <p>Root element not found. Check HTML structure.</p>
      </div>
    `;
    return;
  }

  try {
    const root = ReactDOM.createRoot(rootElement);
    
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
    
    console.log('✅ React app mounted successfully');
    
    // Report to server
    fetch('/_telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        reactMounted: true, 
        timestamp: Date.now() 
      })
    }).catch(() => {});
    
  } catch (error) {
    console.error('React mount error:', error);
    rootElement.innerHTML = `
      <div style="padding: 2rem; font-family: system-ui; text-align: center; color: #dc2626;">
        <h1>❌ React Mount Failed</h1>
        <p>Error: ${(error as Error).message}</p>
        <button onclick="window.location.reload()" style="padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer;">
          Refresh Page
        </button>
      </div>
    `;
  }
}

// Wait for DOM and mount
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
