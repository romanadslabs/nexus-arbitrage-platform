'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Home, 
  BarChart3, 
  Users, 
  Settings, 
  Target, 
  FileText,
  CreditCard,
  Activity,
  LogOut,
  User,
  Bell,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  CheckSquare,
  MessageCircle,
  ExternalLink,
  Shield
} from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const navigation = [
    { name: 'Дашборд', href: '/', icon: Home },
    { name: 'Аккаунти', href: '/accounts', icon: Users },
    { name: 'Кампанії', href: '/campaigns', icon: Target },
    { name: 'Оффери', href: '/offers', icon: ExternalLink },
    { name: 'Карти та Проксі', href: '/cards-proxies', icon: CreditCard },
    { name: 'Звіти', href: '/reports', icon: BarChart3 },
  ]
  
  const workspaceNavigation = [
      { name: 'Дашборд простору', href: '/workspace/dashboard', icon: LayoutDashboard },
      { name: 'Задачі', href: '/workspace/tasks', icon: CheckSquare },
      { name: 'Команда', href: '/workspace/team', icon: Users },
      { name: 'Чат', href: '/workspace/chat', icon: MessageCircle },
  ]

  const adminNavigation = [
    { name: 'Управління користувачами', href: '/admin/users', icon: Shield },
  ]

  return (
    <aside className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Logo */}
      <div className="flex items-center justify-center h-20 border-b border-gray-200 dark:border-gray-700">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Nexus
            </span>
          )}
        </Link>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Пошук..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Головне</p>
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            title={isCollapsed ? item.name : undefined}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              pathname === item.href
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            } ${isCollapsed ? 'justify-center' : ''}`}
          >
            <item.icon className="w-5 h-5" />
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        ))}

        <p className="px-3 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Робочий простір</p>
        {workspaceNavigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            title={isCollapsed ? item.name : undefined}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              pathname.startsWith(item.href) ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            } ${isCollapsed ? 'justify-center' : ''}`}
          >
            <item.icon className="w-5 h-5" />
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        ))}

        {/* Admin Navigation */}
        {user?.role === 'admin' && (
          <>
            <p className="px-3 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Адміністрація</p>
            {adminNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                title={isCollapsed ? item.name : undefined}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname.startsWith(item.href) ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <item.icon className="w-5 h-5" />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </>
        )}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
        {!isCollapsed && (
          <>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || 'Користувач'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role || 'Гість'}</p>
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <Link href="/settings" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                <Settings className="w-5 h-5" />
                <span>Налаштування</span>
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="w-5 h-5" />
                <span>Вийти</span>
              </button>
            </div>
          </>
        )}
      </div>
      
      {/* Toggle Button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          title={isCollapsed ? 'Розгорнути' : 'Згорнути'}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          {!isCollapsed && <span className="ml-2 text-sm">Згорнути меню</span>}
        </button>
      </div>
    </aside>
  )
} 