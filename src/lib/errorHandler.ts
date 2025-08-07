// Error handling utilities for the Nexus Platform

interface ErrorInfo {
  message: string
  stack?: string
  componentStack?: string
  timestamp: number
  userAgent: string
  url: string
}

class ErrorHandler {
  private static instance: ErrorHandler
  private suppressedErrors: Set<string> = new Set()
  private originalConsoleError: typeof console.error
  private originalConsoleWarn: typeof console.warn

  private constructor() {
    this.originalConsoleError = console.error
    this.originalConsoleWarn = console.warn
    this.setupErrorSuppression()
  }

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  private setupErrorSuppression() {
    // Suppress browser extension errors
    const extensionErrorPatterns = [
      'message port closed',
      'content.js',
      'chrome.runtime',
      'browser.runtime',
      'extension',
      'chrome-extension://',
      'moz-extension://'
    ]

    // Override console.error to filter extension errors
    console.error = (...args: any[]) => {
      const message = args[0]
      if (typeof message === 'string') {
        const shouldSuppress = extensionErrorPatterns.some(pattern => 
          message.toLowerCase().includes(pattern.toLowerCase())
        )
        
        if (shouldSuppress) {
          this.suppressedErrors.add(message)
          return // Don't log extension errors
        }
      }
      
      this.originalConsoleError.apply(console, args)
    }

      // Override console.warn to filter React DevTools warnings (only in production)
  console.warn = (...args: any[]) => {
    const message = args[0]
    if (typeof message === 'string' && message.includes('Download the React DevTools')) {
      // Only suppress in production to avoid interfering with development tools
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        return // Don't show React DevTools warning in development
      }
    }
    
    this.originalConsoleWarn.apply(console, args)
  }
  }

  // Log application errors
  logError(error: Error, context?: any): void {
    const errorInfo: ErrorInfo = {
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'server'
    }

    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Application Error')
      console.error('Error:', error)
      console.error('Context:', context)
      console.error('Error Info:', errorInfo)
      console.groupEnd()
    }

    // In production, you can send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      this.sendToErrorService(errorInfo, context)
    }
  }

  // Send error to external service (implement as needed)
  private sendToErrorService(errorInfo: ErrorInfo, context?: any): void {
    // Example implementation - replace with your error tracking service
    try {
      // Example: Sentry, LogRocket, etc.
      // Sentry.captureException(error, { extra: { context, errorInfo } })
      
      // For now, just log to console in production
      console.error('Production Error:', errorInfo, context)
    } catch (e) {
      // Fallback to console if error service fails
      console.error('Error logging failed:', e)
    }
  }

  // Get suppressed errors for debugging
  getSuppressedErrors(): string[] {
    return Array.from(this.suppressedErrors)
  }

  // Clear suppressed errors
  clearSuppressedErrors(): void {
    this.suppressedErrors.clear()
  }

  // Setup global error handlers
  setupGlobalHandlers(): void {
    if (typeof window !== 'undefined') {
      // Handle unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        this.logError(new Error(event.reason), { type: 'unhandledrejection' })
        event.preventDefault()
      })

      // Handle global errors
      window.addEventListener('error', (event) => {
        this.logError(event.error || new Error(event.message), { 
          type: 'global',
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        })
      })
    }
  }

  // React error boundary helper
  handleReactError(error: Error, errorInfo: React.ErrorInfo): void {
    this.logError(error, {
      type: 'react',
      componentStack: errorInfo.componentStack
    })
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance()

// Export utility functions
export const logError = (error: Error, context?: any) => errorHandler.logError(error, context)
export const setupErrorHandling = () => errorHandler.setupGlobalHandlers()
export const handleReactError = (error: Error, errorInfo: React.ErrorInfo) => 
  errorHandler.handleReactError(error, errorInfo)

// Setup global variables for console access
if (typeof window !== 'undefined') {
  // Make errorHandler available globally
  ;(window as any).errorHandler = errorHandler
  
  // Add global debug mode
  ;(window as any).nexusDebugMode = false
  
  // Add global dev tools
  ;(window as any).nexusDevTools = {
    help: () => {
      console.log('🔧 Nexus Platform Dev Tools')
      console.log('Available commands:')
      console.log('• errorHandler.getSuppressedErrors() - Get suppressed errors')
      console.log('• errorHandler.clearSuppressedErrors() - Clear suppressed errors')
      console.log('• window.nexusDebugMode = true/false - Toggle debug mode')
      console.log('• nexusDevTools.help() - Show this help')
    },
    getSuppressedErrors: () => errorHandler.getSuppressedErrors(),
    clearSuppressedErrors: () => errorHandler.clearSuppressedErrors(),
    toggleDebugMode: () => {
      ;(window as any).nexusDebugMode = !(window as any).nexusDebugMode
      console.log(`Debug mode: ${(window as any).nexusDebugMode ? 'ON' : 'OFF'}`)
    }
  }
  
  console.log('🔧 Global error handler and dev tools initialized')
}

// Default export
export default errorHandler 