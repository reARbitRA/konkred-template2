
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary component to catch runtime errors in the component tree.
 */
// FIX: Explicitly extending React.Component with proper generics to ensure 'this.props' and 'this.state' are correctly typed and recognized
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public props!: ErrorBoundaryProps;
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught system exception:', error, errorInfo);
  }

  render() {
    // FIX: Destructuring props and state from 'this' within the render method
    const { children } = this.props;
    const { hasError } = this.state;

    if (hasError) {
      return (
        <div className="min-h-screen bg-void flex items-center justify-center p-8 font-mono">
          <div className="max-w-md w-full concrete-card border-neon-red/30 p-12 text-center rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.1)]">
            <div className="w-20 h-20 bg-neon-red/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
              <AlertTriangle className="text-neon-red" size={40} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4 uppercase tracking-[0.2em]">System Disruption</h1>
            <p className="text-ghost text-sm mb-10 leading-relaxed uppercase">
              The neural enclave has encountered an unhandled exception. Uplink stability compromised.
            </p>
            <div className="space-y-4">
              <button 
                onClick={() => window.location.reload()}
                className="w-full bg-neon-red text-black font-black py-4 rounded-xl text-xs tracking-widest uppercase flex items-center justify-center gap-3"
              >
                <RefreshCw size={16} /> Reinitialize System
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="w-full border border-white/10 text-white font-bold py-4 rounded-xl text-xs tracking-widest uppercase flex items-center justify-center gap-3 hover:bg-white/5"
              >
                <Home size={16} /> Return to Hub
              </button>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}
