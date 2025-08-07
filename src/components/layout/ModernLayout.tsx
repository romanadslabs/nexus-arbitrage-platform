'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'

interface ModernLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export default function ModernLayout({ children, title, description }: ModernLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  useEffect(() => {
    const storedPreference = localStorage.getItem('sidebarCollapsed')
    if (storedPreference) {
      setIsSidebarCollapsed(JSON.parse(storedPreference))
    }
  }, [])

  const handleToggleSidebar = () => {
    const newState = !isSidebarCollapsed
    setIsSidebarCollapsed(newState)
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={handleToggleSidebar} 
      />
      <main className={`transition-all duration-300 ${isSidebarCollapsed ? 'pl-20' : 'pl-64'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {title && (
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {title}
              </h1>
              {description && (
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {description}
                </p>
              )}
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  )
} 