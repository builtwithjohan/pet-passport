import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled UI exception in Pet Passport:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          background: 'var(--bg-app, #0f172a)',
          color: '#fff',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{
            maxWidth: 480,
            width: '100%',
            background: 'rgba(30, 41, 59, 0.9)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 16,
            padding: 32,
            textAlign: 'center',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              background: 'rgba(244, 63, 94, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              color: '#f43f5e'
            }}>
              <AlertTriangle size={32} />
            </div>

            <h2 style={{ fontSize: '1.4rem', margin: '0 0 8px 0', fontWeight: 700 }}>
              Something went wrong
            </h2>
            
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', margin: '0 0 20px 0', lineHeight: 1.5 }}>
              Pet Passport encountered an unexpected error. Your records stored in IndexedDB remain safe.
            </p>

            {this.state.error?.message && (
              <div style={{
                background: 'rgba(15, 23, 42, 0.6)',
                padding: '10px 14px',
                borderRadius: 8,
                fontSize: '0.78rem',
                fontFamily: 'monospace',
                color: '#fca5a5',
                marginBottom: 24,
                wordBreak: 'break-word',
                textAlign: 'left'
              }}>
                {this.state.error.message}
              </div>
            )}

            <button
              onClick={this.handleReload}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#6366f1',
                color: '#fff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: 10,
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={18} /> Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
