'use client'

import React from 'react'
import { useTheme } from '@/components/providers/ThemeProvider'

interface ChartWrapperProps {
  children: React.ReactNode
  className?: string
  height?: number
}

export default function ChartWrapper({ children, className = '', height = 300 }: ChartWrapperProps) {
  const { theme } = useTheme()

  return (
    <div 
      className={`chart-wrapper ${className}`}
      style={{ 
        height,
        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
        borderRadius: '8px',
        padding: '16px',
      }}
    >
      {children}
    </div>
  )
} 