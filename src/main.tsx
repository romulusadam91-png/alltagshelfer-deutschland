import { StrictMode, Component, type ReactNode, type ErrorInfo } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Muse Journal Error caught by boundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backgroundColor: '#0d0d0f', color: '#f4f4f5', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <div style={{ maxWidth: '420px', width: '100%', backgroundColor: '#161619', borderRadius: '1.5rem', padding: '2rem', textAlign: 'center', border: '1px solid #27272a' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600, fontFamily: 'serif', color: '#f4f4f5', marginBottom: '0.75rem' }}>
              Muse Journal
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#a1a1aa', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              A temporary issue occurred while rendering your private journal. Click below to refresh your view.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={this.handleReload}
                style={{ padding: '0.625rem 1.25rem', backgroundColor: '#f59e0b', color: '#09090b', border: 'none', borderRadius: '0.75rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}
              >
                Reload Journal
              </button>
              <button
                onClick={this.handleReset}
                style={{ padding: '0.625rem 1.25rem', backgroundColor: '#27272a', color: '#e4e4e7', border: '1px solid #3f3f46', borderRadius: '0.75rem', fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem' }}
              >
                Reset Database
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
} else {
  console.error('Fatal: #root container element was not found in DOM.');
}
