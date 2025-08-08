'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import MobileNavigation from '@/components/ui/MobileNavigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { Activity, LayoutDashboard, CheckSquare, Users, MessageCircle, Home, Target, ExternalLink, CreditCard, BarChart3, Settings } from 'lucide-react'

interface ModernLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export default function ModernLayout({ children, title, description }: ModernLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const { user, logout } = useAuth()

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

  const navigation = [
    { name: 'Дашборд', href: '/', icon: Home },
    { name: 'Аккаунти', href: '/accounts', icon: Users },
    { name: 'Кампанії', href: '/campaigns', icon: Target },
    { name: 'Оффери', href: '/offers', icon: ExternalLink },
    { name: 'Карти та Проксі', href: '/cards-proxies', icon: CreditCard },
    { name: 'Звіти', href: '/reports', icon: BarChart3 },
    { name: 'Налаштування', href: '/settings', icon: Settings, adminOnly: false },
    { name: 'Адміністрація', href: '/admin/users', icon: Users, adminOnly: true },
  ]

  const quickActions = [
    { name: 'Дашборд простору', href: '/workspace/dashboard', icon: LayoutDashboard },
    { name: 'Задачі', href: '/workspace/tasks', icon: CheckSquare },
    { name: 'Команда', href: '/workspace/team', icon: Users },
    { name: 'Чат', href: '/workspace/chat', icon: MessageCircle },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggle={handleToggleSidebar} 
        />
      </div>

      {/* Mobile Topbar */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setIsMobileNavOpen(true)}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200"
            aria-label="Відкрити меню"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">Nexus</span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {user?.name || 'Користувач'}
          </div>
        </div>
      </header>

      {/* Main content with responsive left padding on desktop only */}
      <main className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'} pl-0`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {title && (
            <motion.div
              className="mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                {title}
              </h1>
              {description && (
                <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-400">
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

      {/* Mobile Navigation Drawer */}
      {isMobileNavOpen && (
        <MobileNavigation 
          navigation={navigation}
          quickActions={quickActions}
          user={user}
          onClose={() => setIsMobileNavOpen(false)}
          onLogout={logout}
        />
      )}
    </div>
  )
} 