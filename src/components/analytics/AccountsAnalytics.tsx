'use client'

import React, { useMemo } from 'react'
import { Account, Expense } from '@/types'
import { 
  BarChart3, PieChart, TrendingUp, TrendingDown, DollarSign, 
  Users, Eye, AlertTriangle, Clock, CheckCircle, XCircle, 
  Calendar, Activity, Target, Zap, Shield, Globe
} from 'lucide-react'

interface AccountsAnalyticsProps {
  accounts: Account[]
  expenses: Expense[]
  userRole: string
}

export default function AccountsAnalytics({ accounts, expenses, userRole }: AccountsAnalyticsProps) {
  
  // Розрахунок статистики
  const stats = useMemo(() => {
    const totalAccounts = accounts.length
    const activeAccounts = accounts.filter(acc => acc.status === 'ready_for_ads').length
    const pendingAccounts = accounts.filter(acc => acc.status.includes('farming')).length
    const bannedAccounts = accounts.filter(acc => acc.status.includes('blocked')).length
    const suspendedAccounts = accounts.filter(acc => acc.status === 'dead').length
    const moderationAccounts = accounts.filter(acc => acc.status === 'sold').length

    // Розрахунок витрат
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.cost, 0)
    const averageExpensePerAccount = totalAccounts > 0 ? totalExpenses / totalAccounts : 0

    // Статистика по платформах
    const platformStats = accounts.reduce((acc, account) => {
      acc[account.platform] = (acc[account.platform] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Статистика по категоріях
    const categoryStats = accounts.reduce((acc, account) => {
      acc[account.category] = (acc[account.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Статистика по пріоритетах
    const priorityStats = accounts.reduce((acc, account) => {
      acc[account.priority] = (acc[account.priority] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Активність за останні 30 днів
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentAccounts = accounts.filter(acc => 
      new Date(acc.createdAt) >= thirtyDaysAgo
    ).length

    const recentActivity = accounts.filter(acc => 
      acc.updatedAt && new Date(acc.updatedAt) >= thirtyDaysAgo
    ).length

    // Ефективність (активні / загальна кількість)
    const efficiency = totalAccounts > 0 ? (activeAccounts / totalAccounts) * 100 : 0

    // Прогноз на наступний місяць
    const growthRate = totalAccounts > 0 ? recentAccounts / totalAccounts : 0
    const projectedGrowth = Math.round(totalAccounts * (1 + growthRate))

    return {
      totalAccounts,
      activeAccounts,
      pendingAccounts,
      bannedAccounts,
      suspendedAccounts,
      moderationAccounts,
      totalExpenses,
      averageExpensePerAccount,
      platformStats,
      categoryStats,
      priorityStats,
      recentAccounts,
      recentActivity,
      efficiency,
      projectedGrowth
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
    low: '#10B981',
    medium: '#F59E0B',
    high: '#F97316',
    critical: '#EF4444'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending': return <Clock className="w-4 h-4 text-blue-500" />
      case 'moderation': return <AlertTriangle className="w-4 h-4 text-orange-500" />
      case 'suspended': return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'banned': return <XCircle className="w-4 h-4 text-red-500" />
      default: return <Eye className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Аналітика аккаунтів
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Детальна статистика та аналіз ефективності
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Оновлено: {new Date().toLocaleDateString('uk-UA')}
          </span>
        </div>
      </div>

      {/* Основні метрики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Всього аккаунтів',
            value: stats.totalAccounts,
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            change: stats.recentAccounts > 0 ? `+${stats.recentAccounts} за місяць` : 'Без змін'
          },
          {
            title: 'Активні аккаунти',
            value: stats.activeAccounts,
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            change: `${stats.efficiency.toFixed(1)}% ефективність`
          },
          {
            title: 'Загальні витрати',
            value: `$${stats.totalExpenses.toFixed(2)}`,
            icon: DollarSign,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
            change: `$${stats.averageExpensePerAccount.toFixed(2)} в середньому`
          },
          {
            title: 'Прогноз росту',
            value: stats.projectedGrowth,
            icon: TrendingUp,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50 dark:bg-orange-900/20',
            change: 'Наступний місяць'
          }
        ].map((metric, index) => (
          <div key={index} className={`card ${metric.bgColor}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {metric.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {metric.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {metric.change}
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-white dark:bg-gray-800`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Детальна статистика */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Статуси аккаунтів */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Статуси аккаунтів
            </h3>
            <Activity className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-3">
            {[
              { status: 'active', label: 'Активні', count: stats.activeAccounts, color: 'text-green-600' },
              { status: 'pending', label: 'В процесі', count: stats.pendingAccounts, color: 'text-blue-600' },
              { status: 'moderation', label: 'На модерації', count: stats.moderationAccounts, color: 'text-orange-600' },
              { status: 'suspended', label: 'Призупинені', count: stats.suspendedAccounts, color: 'text-yellow-600' },
              { status: 'banned', label: 'Заблоковані', count: stats.bannedAccounts, color: 'text-red-600' }
            ].map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(item.status)}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-semibold ${item.color}`}>
                    {item.count}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({stats.totalAccounts > 0 ? ((item.count / stats.totalAccounts) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Платформи */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Розподіл по платформах
            </h3>
            <Globe className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-3">
            {Object.entries(stats.platformStats)
              .sort(([,a], [,b]) => b - a)
              .map(([platform, count]) => (
                <div key={platform} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: colors[platform as keyof typeof colors] || '#6B7280' }}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {platform}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {count}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({stats.totalAccounts > 0 ? ((count / stats.totalAccounts) * 100).toFixed(1) : 0}%)
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Категорії та пріоритети */}
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
            {Object.entries(stats.categoryStats)
              .sort(([,a], [,b]) => b - a)
              .map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: colors[category as keyof typeof colors] || '#6B7280' }}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {category === 'personal' ? 'Особисті' :
                       category === 'business' ? 'Бізнес' :
                       category === 'advertising' ? 'Реклама' :
                       category === 'testing' ? 'Тестування' :
                       category === 'backup' ? 'Резервні' : category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {count}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({stats.totalAccounts > 0 ? ((count / stats.totalAccounts) * 100).toFixed(1) : 0}%)
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Пріоритети */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Пріоритети аккаунтів
            </h3>
            <Zap className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-3">
            {Object.entries(stats.priorityStats)
              .sort(([,a], [,b]) => b - a)
              .map(([priority, count]) => (
                <div key={priority} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: colors[priority as keyof typeof colors] || '#6B7280' }}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {priority === 'low' ? 'Низький' :
                       priority === 'medium' ? 'Середній' :
                       priority === 'high' ? 'Високий' :
                       priority === 'critical' ? 'Критичний' : priority}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {count}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({stats.totalAccounts > 0 ? ((count / stats.totalAccounts) * 100).toFixed(1) : 0}%)
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Активність та тренди */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Активність за останні 30 днів */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Активність (30 днів)
            </h3>
            <TrendingUp className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Нові аккаунти
              </span>
              <span className="text-lg font-semibold text-green-600">
                +{stats.recentAccounts}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Активні входи
              </span>
              <span className="text-lg font-semibold text-blue-600">
                {stats.recentActivity}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Середня активність
              </span>
              <span className="text-lg font-semibold text-purple-600">
                {stats.totalAccounts > 0 ? (stats.recentActivity / stats.totalAccounts * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Прогнози */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Прогнози
            </h3>
            <Target className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Прогноз росту
              </span>
              <span className="text-lg font-semibold text-orange-600">
                +{stats.projectedGrowth - stats.totalAccounts}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Ефективність
              </span>
              <span className="text-lg font-semibold text-green-600">
                {stats.efficiency.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Середня вартість
              </span>
              <span className="text-lg font-semibold text-purple-600">
                ${stats.averageExpensePerAccount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Рекомендації */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Рекомендації
          </h3>
          <Shield className="w-5 h-5 text-gray-500" />
        </div>
        <div className="space-y-3">
          {stats.efficiency < 70 && (
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Низька ефективність
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                  Рекомендуємо активувати більше аккаунтів або перевірити заблоковані
                </p>
              </div>
            </div>
          )}
          
          {stats.bannedAccounts > stats.totalAccounts * 0.1 && (
            <div className="flex items-start space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  Високий відсоток заблокованих
                </p>
                <p className="text-xs text-red-700 dark:text-red-300">
                  Потрібно переглянути стратегію створення аккаунтів
                </p>
              </div>
            </div>
          )}
          
          {stats.recentAccounts === 0 && (
            <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Users className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Немає нових аккаунтів
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Рекомендуємо створити нові аккаунти для розширення портфеля
                </p>
              </div>
            </div>
          )}
          
          {stats.averageExpensePerAccount > 50 && (
            <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Високі витрати на аккаунт
                </p>
                <p className="text-xs text-green-700 dark:text-green-300">
                  Розгляньте можливість оптимізації витрат на розхідники
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 