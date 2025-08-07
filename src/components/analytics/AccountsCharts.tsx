'use client'

import React, { useMemo } from 'react'
import { Account, Expense } from '@/types'
import { 
  BarChart3, PieChart, TrendingUp, Calendar, Activity,
  Users, DollarSign, Globe, Target, Zap
} from 'lucide-react'

interface AccountsChartsProps {
  accounts: Account[]
  expenses: Expense[]
}

export default function AccountsCharts({ accounts, expenses }: AccountsChartsProps) {
  
  // Дані для графіків
  const chartData = useMemo(() => {
    // Статистика по платформам
    const platformData = accounts.reduce((acc, account) => {
      acc[account.platform] = (acc[account.platform] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Статистика по статусах
    const statusData = accounts.reduce((acc, account) => {
      acc[account.status] = (acc[account.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Статистика по категоріях
    const categoryData = accounts.reduce((acc, account) => {
      acc[account.category] = (acc[account.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Активність за останні 7 днів
    const activityData = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayStart = new Date(date.setHours(0, 0, 0, 0))
      const dayEnd = new Date(date.setHours(23, 59, 59, 999))
      
      const accountsCreated = accounts.filter(acc => {
        const createdAt = new Date(acc.createdAt)
        return createdAt >= dayStart && createdAt <= dayEnd
      }).length

      const accountsActive = accounts.filter(acc => {
        if (!acc.updatedAt) return false
        const updatedAt = new Date(acc.updatedAt)
        return updatedAt >= dayStart && updatedAt <= dayEnd
      }).length

      activityData.push({
        date: date.toLocaleDateString('uk-UA', { weekday: 'short' }),
        created: accountsCreated,
        active: accountsActive
      })
    }

    // Витрати по типах
    const expenseData = expenses.reduce((acc, expense) => {
      acc[expense.type] = (acc[expense.type] || 0) + expense.cost
      return acc
    }, {} as Record<string, number>)

    return {
      platformData,
      statusData,
      categoryData,
      activityData,
      expenseData
    }
  }, [accounts, expenses])

  // Кольори для графіків
  const colors = {
    Facebook: '#1877F2',
    Google: '#DB4437',
    TikTok: '#000000',
    Instagram: '#E4405F',
    YouTube: '#FF0000',
    Twitter: '#1DA1F2',
    LinkedIn: '#0A66C2',
    Other: '#6B7280',
    active: '#10B981',
    pending: '#3B82F6',
    moderation: '#F59E0B',
    suspended: '#F59E0B',
    banned: '#EF4444',
    personal: '#3B82F6',
    business: '#8B5CF6',
    advertising: '#10B981',
    testing: '#F59E0B',
    backup: '#6B7280',
    card: '#10B981',
    proxy: '#3B82F6',
    sim: '#F59E0B',
    other: '#6B7280'
  }

  const getLabel = (key: string, type: 'platform' | 'status' | 'category' | 'expense') => {
    const labels: Record<string, Record<string, string>> = {
      platform: {
        Facebook: 'Facebook',
        Google: 'Google',
        TikTok: 'TikTok',
        Instagram: 'Instagram',
        YouTube: 'YouTube',
        Twitter: 'Twitter',
        LinkedIn: 'LinkedIn',
        Other: 'Інші'
      },
      status: {
        active: 'Активні',
        pending: 'В процесі',
        moderation: 'На модерації',
        suspended: 'Призупинені',
        banned: 'Заблоковані'
      },
      category: {
        personal: 'Особисті',
        business: 'Бізнес',
        advertising: 'Реклама',
        testing: 'Тестування',
        backup: 'Резервні'
      },
      expense: {
        card: 'Карти',
        proxy: 'Проксі',
        sim: 'SIM карти',
        other: 'Інше'
      }
    }
    return labels[type][key] || key
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Графіки та діаграми
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Візуальний аналіз даних аккаунтів
          </p>
        </div>
      </div>

      {/* Графіки */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Розподіл по платформам */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Розподіл по платформам
            </h3>
            <Globe className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-3">
            {Object.entries(chartData.platformData)
              .sort(([,a], [,b]) => b - a)
              .map(([platform, count]) => (
                <div key={platform} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: colors[platform as keyof typeof colors] || '#6B7280' }}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {getLabel(platform, 'platform')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {count}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({accounts.length > 0 ? ((count / accounts.length) * 100).toFixed(1) : 0}%)
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Розподіл по статусах */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Статуси аккаунтів
            </h3>
            <Activity className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-3">
            {Object.entries(chartData.statusData)
              .sort(([,a], [,b]) => b - a)
              .map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: colors[status as keyof typeof colors] || '#6B7280' }}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {getLabel(status, 'status')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {count}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({accounts.length > 0 ? ((count / accounts.length) * 100).toFixed(1) : 0}%)
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Додаткові графіки */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Категорії */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Категорії аккаунтів
            </h3>
            <Target className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-3">
            {Object.entries(chartData.categoryData)
              .sort(([,a], [,b]) => b - a)
              .map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: colors[category as keyof typeof colors] || '#6B7280' }}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {getLabel(category, 'category')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {count}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({accounts.length > 0 ? ((count / accounts.length) * 100).toFixed(1) : 0}%)
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Витрати по типах */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Витрати по типах
            </h3>
            <DollarSign className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-3">
            {Object.entries(chartData.expenseData)
              .sort(([,a], [,b]) => b - a)
              .map(([type, cost]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: colors[type as keyof typeof colors] || '#6B7280' }}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {getLabel(type, 'expense')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      ${cost.toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({expenses.reduce((sum, exp) => sum + exp.cost, 0) > 0 ? 
                        ((cost / expenses.reduce((sum, exp) => sum + exp.cost, 0)) * 100).toFixed(1) : 0}%)
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Активність за тиждень */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Активність за останній тиждень
          </h3>
          <Calendar className="w-5 h-5 text-gray-500" />
        </div>
        <div className="space-y-4">
          {chartData.activityData.map((day, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {day.date}
              </span>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Створено: {day.created}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Активні: {day.active}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Прогрес-бари для швидкого огляду */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Ефективність',
            value: accounts.length > 0 ? 
              ((accounts.filter(acc => acc.status === 'ready_for_ads').length / accounts.length) * 100).toFixed(1) : '0',
            color: 'bg-green-500',
            icon: TrendingUp
          },
          {
            title: 'Нові аккаунти',
            value: chartData.activityData.reduce((sum, day) => sum + day.created, 0),
            color: 'bg-blue-500',
            icon: Users
          },
          {
            title: 'Середня вартість',
            value: `$${accounts.length > 0 ? 
              (expenses.reduce((sum, exp) => sum + exp.cost, 0) / accounts.length).toFixed(2) : '0'}`,
            color: 'bg-purple-500',
            icon: DollarSign
          },
          {
            title: 'Активність',
            value: chartData.activityData.reduce((sum, day) => sum + day.active, 0),
            color: 'bg-orange-500',
            icon: Activity
          }
        ].map((metric, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between mb-2">
              <metric.icon className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {metric.title}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {metric.value}
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${metric.color}`}
                style={{ 
                  width: `${Math.min(parseFloat(metric.value.toString().replace(/[^0-9.]/g, '')) || 0, 100)}%` 
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 