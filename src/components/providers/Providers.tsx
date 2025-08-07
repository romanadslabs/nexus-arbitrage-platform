'use client'

import { useEffect } from 'react'
import { ThemeProvider } from './ThemeProvider'
import { AuthProvider } from './AuthProvider'
import { QueryProvider } from './QueryProvider'
import { DataProvider } from './DataProvider'
import { MultiBrowserProvider } from './MultiBrowserProvider'
import { Toaster } from 'react-hot-toast'
import { setupErrorHandling } from '@/lib/errorHandler'

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize error handling
    setupErrorHandling()
  }, [])

  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <DataProvider>
            <MultiBrowserProvider>
                {children}
                <Toaster 
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: 'var(--toast-bg)',
                      color: 'var(--toast-color)',
                    },
                  }}
                />
            </MultiBrowserProvider>
          </DataProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  )
} 