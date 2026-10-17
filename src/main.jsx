import React, { Component, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Well Aqua Runtime Error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: '#f8fafc',
          textAlign: 'center',
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}>
          <div style={{
            background: '#ffffff',
            padding: '32px 24px',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
            maxWidth: '440px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px'
          }}>
            <img 
              src="/well-aqua-logo-tight.png" 
              alt="Well Aqua" 
              style={{ height: '42px', width: 'auto', objectFit: 'contain' }} 
            />
            <h2 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 800, margin: 0 }}>
              Notice Loading Portal
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
              A temporary display error occurred while restoring the farm session.
            </p>
            {this.state.error && (
              <div style={{
                background: '#fee2e2',
                color: '#991b1b',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                width: '100%',
                wordBreak: 'break-word',
                textAlign: 'left'
              }}>
                {this.state.error.message || String(this.state.error)}
              </div>
            )}
            <button
              onClick={this.handleReset}
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
                marginTop: '8px'
              }}
            >
              🔄 Refresh & Open Portal
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

// Register Service Worker for Progressive Web App (PWA / APK-like installation)
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (reg) => {
        console.log('✅ Well Aqua PWA Service Worker Registered:', reg.scope);
      },
      (err) => {
        console.warn('PWA Service Worker Registration notice:', err);
      }
    );
  });
}

// Global listener for Chrome PWA install prompt (WebAPK on Android)
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.deferredInstallPrompt = e;
    window.dispatchEvent(new CustomEvent('wellaqua:installable'));
    console.log('📱 Chrome WebAPK / PWA installation prompt ready');
  });
}

