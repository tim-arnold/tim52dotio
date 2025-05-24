'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        
        // In production, you might want to log this to an error reporting service
        if (process.env.NODE_ENV === 'production') {
            // Example: logErrorToService(error, errorInfo);
        }
    }

    render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div
                    role="alert"
                    style={{
                        padding: '2rem',
                        textAlign: 'center',
                        backgroundColor: 'var(--background)',
                        color: 'var(--foreground)',
                        border: '2px solid var(--accent)',
                        borderRadius: '8px',
                        margin: '1rem',
                    }}
                >
                    <h2>Oops! Something went wrong</h2>
                    <p>We&apos;re sorry, but something unexpected happened.</p>
                    <details style={{ marginTop: '1rem' }}>
                        <summary>Error details</summary>
                        <pre style={{ 
                            textAlign: 'left', 
                            overflow: 'auto', 
                            fontSize: '0.8rem',
                            marginTop: '0.5rem',
                            padding: '0.5rem',
                            backgroundColor: 'var(--background-dark)',
                            borderRadius: '4px'
                        }}>
                            {this.state.error?.toString()}
                        </pre>
                    </details>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: '1rem',
                            padding: '0.5rem 1rem',
                            backgroundColor: 'var(--primary)',
                            color: 'var(--text-dark)',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}