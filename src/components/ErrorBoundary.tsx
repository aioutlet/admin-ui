import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
          <div className="max-w-md w-full">
            <div className="text-center">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="h-px bg-gradient-to-r from-transparent via-red-500 to-transparent w-12"></div>
                <div className="bg-red-100 dark:bg-red-900/30 rounded-full px-4 py-2">
                  <span className="text-sm font-medium text-red-700 dark:text-red-300 uppercase tracking-wide">
                    Error
                  </span>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-red-500 to-transparent w-12"></div>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent dark:from-red-400 dark:to-pink-400">
                  Something went wrong
                </span>
              </h1>

              <p className="text-gray-600 dark:text-gray-400 mb-8">
                We're sorry, but an unexpected error occurred. Please refresh the page or contact support if the problem
                persists.
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Refresh Page
                </button>

                <button
                  onClick={() => (window.location.href = '/dashboard')}
                  className="w-full px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
