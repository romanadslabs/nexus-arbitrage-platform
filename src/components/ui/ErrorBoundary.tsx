'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Button from './Button'
import { handleReactError } from '@/lib/errorHandler'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
  isTestError?: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    const isTestError = error.message.includes('test error') || error.message.includes('Test error')
    return { hasError: true, error, isTestError }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const isTestError = error.message.includes('test error') || error.message.includes('Test error')
    this.setState({ error, errorInfo, isTestError })
    
    // Use the error handler to log the error
    handleReactError(error, errorInfo)
    
    // Auto-recover from test errors after 3 seconds
    if (isTestError) {
      setTimeout(() => {
        this.handleRetry()
      }, 3000)
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined, isTestError: undefined })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <motion.div
            className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6"
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </motion.div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Щось пішло не так
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Виникла неочікувана помилка. Спробуйте оновити сторінку або повернутися на головну.
            </p>
            
            {this.state.isTestError && (
              <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  🧪 Це тестова помилка. Автоматичне відновлення через 3 секунди...
                </p>
              </div>
            )}

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Деталі помилки (тільки для розробки)
                </summary>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-xs font-mono text-red-600 dark:text-red-400 overflow-auto max-h-32">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap mt-1">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={this.handleRetry}
                variant="primary"
                size="md"
                icon={RefreshCw}
                className="flex-1"
              >
                Спробувати знову
              </Button>
              
              <Button
                onClick={this.handleGoHome}
                variant="outline"
                size="md"
                icon={Home}
                className="flex-1"
              >
                На головну
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Якщо проблема повторюється, зверніться до технічної підтримки
              </p>
            </div>
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
} 