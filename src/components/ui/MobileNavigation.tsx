'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  X, 
  Home, 
  BarChart3, 
  Users, 
  Settings, 
  Target, 
  FileText,
  CreditCard,
  Globe,
  Activity,
  LogOut,
  User,
  Bell,
  Search,
  Plus,
  ChevronRight,
  Star,
  Clock,
  TrendingUp
} from 'lucide-react'
import Button from './Button'

interface MobileNavigationProps {
  navigation: Array<{
    name: string
    href: string
    icon: any
    adminOnly?: boolean
  }>
  quickActions: Array<{
    name: string
    href: string
    icon: any
  }>
  user: any
  onClose: () => void
  onLogout: () => void
}

export default function MobileNavigation({
  navigation,
  quickActions,
  user,
  onClose,
  onLogout
}: MobileNavigationProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 lg:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Navigation Panel */}
        <motion.div
          className="absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-white dark:bg-gray-900 shadow-2xl flex flex-col overflow-hidden"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Nexus
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Меню навігації
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.name || 'Користувач'}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {user?.role || 'user'}
                </p>
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              ⚡ Швидкі дії
            </h3>
            <div className="space-y-2">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <motion.div
                    key={action.name}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href={action.href}
                      onClick={onClose}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {action.name}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Main Navigation (scrollable) */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="p-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                📱 Навігація
              </h3>
              <nav className="space-y-1">
                {navigation.map((item) => {
                  if (item.adminOnly && user?.role !== 'admin') return null
                  
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  
                  return (
                    <motion.div
                      key={item.name}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={`
                          flex items-center space-x-3 p-3 rounded-lg transition-colors
                          ${isActive 
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }
                        `}
                      >
                        <div className={`
                          w-8 h-8 rounded-lg flex items-center justify-center
                          ${isActive 
                            ? 'bg-blue-100 dark:bg-blue-900/50' 
                            : 'bg-gray-100 dark:bg-gray-800'
                          }
                       `}>
                          <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`} />
                        </div>
                        <span className="text-sm font-medium">
                          {item.name}
                        </span>
                        {isActive && (
                          <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full ml-auto" />
                        )}
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>
            </div>

            {/* Recent Activity */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                🕒 Остання активність
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Новий аккаунт додано
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      2 хвилини тому
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Кампанія запущена
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      15 хвилин тому
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Звіт згенеровано
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      1 годину тому
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Nexus Platform v1.0</span>
              <span>© 2024</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 