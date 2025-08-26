import React from 'react'

class ErrorBoundary extends React.Component {
// @ts-ignore TODO fix
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
// @ts-ignore TODO fix
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
// @ts-ignore TODO fix
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    // @ts-ignore TODO fix
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full text-center">
            <div className="mx-auto h-12 w-12 text-red-500 mb-4">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Algo salió mal
            </h2>
            <p className="text-gray-600 mb-4">
              Ha ocurrido un error inesperado. Por favor, recarga la página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Recargar página
            </button>
          </div>
        </div>
      )
    }
// @ts-ignore TODO fix
    return this.props.children
  }
}

export default ErrorBoundary 