'use client'

import React from 'react'
import { Crown, Users, Target, TrendingUp, Settings } from 'lucide-react'

interface UserRoleBadgeProps {
  role: string
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

export default function UserRoleBadge({ role, size = 'md', showIcon = true }: UserRoleBadgeProps) {
  const getRoleConfig = (role: string) => {
    switch (role) {
      case 'leader':
        return {
          label: 'Тімлід',
          color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
          icon: Crown,
          description: 'Керує командою та проектами'
        }
      case 'farmer':
        return {
          label: 'Фармер',
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
          icon: TrendingUp,
          description: 'Фармить аккаунти'
        }
      case 'launcher':
        return {
          label: 'Лончер',
          color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
          icon: Target,
          description: 'Запускає рекламні кампанії'
        }
      case 'admin':
        return {
          label: 'Адмін',
          color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
          icon: Settings,
          description: 'Повний доступ до системи'
        }
      default:
        return {
          label: 'Користувач',
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
          icon: Users,
          description: 'Звичайний користувач'
        }
    }
  }

  const config = getRoleConfig(role)
  const IconComponent = config.icon

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  return (
    <div className="group relative">
      <div className={`inline-flex items-center space-x-1.5 rounded-full font-medium ${config.color} ${sizeClasses[size]}`}>
        {showIcon && <IconComponent className="h-3 w-3" />}
        <span>{config.label}</span>
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
        {config.description}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  )
} 