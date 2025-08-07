'use client'

import React, { useState } from 'react'
import { 
  BarChart3, TrendingUp, Users, DollarSign, 
  Calendar, Filter, Download, Eye, 
  Target, CheckCircle, Clock, AlertCircle,
  ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react'

interface PerformanceMetrics {
  totalRevenue: number
  totalSpent: number
  totalProfit: number
  totalConversions: number
  totalClicks: number
  averageROI: number
  conversionRate: number
  averagePayout: number
  activeCampaigns: number
  completedTasks: number
  pendingTasks: number
  overdueTasks: number
}

interface TeamMemberPerformance {
  id: string
  name: string
  role: string
  revenue: number
  spent: number
  profit: number
  conversions: number
  campaigns: number
  tasksCompleted: number
  tasksPending: number
  efficiency: number
  lastActivity: Date
}

export default function PerformanceReports() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month')
  const [selectedTeam, setSelectedTeam] = useState<string>('all')
  const [reportType, setReportType] = useState<'overview' | 'team' | 'campaigns' | 'tasks'>('overview')

  // Тестові дані для метрик продуктивності
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    totalRevenue: 91527.50,
    totalSpent: 3850,
    totalProfit: 87677.50,
    totalConversions: 2788,
    totalClicks: 36680,
    averageROI: 2379.9,
    conversionRate: 7.6,
    averagePayout: 32.83,
    activeCampaigns: 3,
    completedTasks: 15,
    pendingTasks: 8,
    overdueTasks: 2
  })

  // Тестові дані для продуктивності команди
  const [teamPerformance, setTeamPerformance] = useState<TeamMemberPerformance[]>([
    {
      id: 'farmer-1',
      name: 'Фармер 1',
      role: 'farmer',
      revenue: 31467.50,
      spent: 850,
      profit: 30617.50,
      conversions: 1234,
      campaigns: 1,
      tasksCompleted: 8,
      tasksPending: 3,
      efficiency: 94.2,
      lastActivity: new Date('2024-01-19')
    },
    {
      id: 'farmer-2',
      name: 'Фармер 2',
      role: 'farmer',
      revenue: 25515.00,
      spent: 1800,
      profit: 23715.00,
      conversions: 567,
      campaigns: 1,
      tasksCompleted: 5,
      tasksPending: 2,
      efficiency: 89.3,
      lastActivity: new Date('2024-01-18')
    },
    {
      id: 'launcher-1',
      name: 'Арбітражник 1',
      role: 'launcher',
      revenue: 34545.00,
      spent: 1200,
      profit: 33345.00,
      conversions: 987,
      campaigns: 1,
      tasksCompleted: 2,
      tasksPending: 3,
      efficiency: 96.5,
      lastActivity: new Date('2024-01-20')
    }
  ])

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'week': return 'Цього тижня'
      case 'month': return 'Цього місяця'
      case 'quarter': return 'Цього кварталу'
      case 'year': return 'Цього року'
      default: return 'Цього місяця'
    }
  }

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-600'
    if (efficiency >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getEfficiencyIcon = (efficiency: number) => {
    if (efficiency >= 90) return <ArrowUpRight className="w-4 h-4 text-green-600" />
    if (efficiency >= 80) return <ArrowUpRight className="w-4 h-4 text-yellow-600" />
    return <ArrowDownRight className="w-4 h-4 text-red-600" />
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Звіти по продуктивності
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Аналіз ефективності команди та кампаній
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="btn-secondary">
            <Download className="w-4 h-4 mr-2" />
            Експорт
          </button>
          <button className="btn-primary">
            <Eye className="w-4 h-4 mr-2" />
            Детальний звіт
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Період:
          </label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="form-select"
          >
            <option value="week">Цього тижня</option>
            <option value="month">Цього місяця</option>
            <option value="quarter">Цього кварталу</option>
            <option value="year">Цього року</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Команда:
          </label>
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="form-select"
          >
            <option value="all">Всі команди</option>
            <option value="farmers">Фармери</option>
            <option value="launchers">Арбітражники</option>
            <option value="leaders">Керівники</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Тип звіту:
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value as any)}
            className="form-select"
          >
            <option value="overview">Загальний огляд</option>
            <option value="team">Команда</option>
            <option value="campaigns">Кампанії</option>
            <option value="tasks">Завдання</option>
          </select>
        </div>
      </div>

      {/* Overview Metrics */}
      {reportType === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Загальний дохід</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(metrics.totalRevenue)}
                </p>
                <p className="text-sm text-green-600 flex items-center">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +12.5% з минулого місяця
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Прибуток</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(metrics.totalProfit)}
                </p>
                <p className="text-sm text-green-600 flex items-center">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +15.2% з минулого місяця
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Конверсії</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics.totalConversions.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 flex items-center">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +8.3% з минулого місяця
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">ROI</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatPercentage(metrics.averageROI)}
                </p>
                <p className="text-sm text-green-600 flex items-center">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +5.7% з минулого місяця
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Performance */}
      {reportType === 'team' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Продуктивність команди - {getPeriodLabel(selectedPeriod)}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                      Учасник
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                      Роль
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                      Дохід
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                      Витрати
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                      Прибуток
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                      Конверсії
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                      Кампанії
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                      Завдання
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                      Ефективність
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                      Остання активність
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {teamPerformance.map((member) => (
                    <tr key={member.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">ID: {member.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          member.role === 'farmer' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                          member.role === 'launcher' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                          'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                        }`}>
                          {member.role === 'farmer' ? 'Фармер' : 
                           member.role === 'launcher' ? 'Арбітражник' : 'Керівник'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                        {formatCurrency(member.revenue)}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {formatCurrency(member.spent)}
                      </td>
                      <td className="py-3 px-4 font-medium text-green-600 dark:text-green-400">
                        {formatCurrency(member.profit)}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {member.conversions.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {member.campaigns}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-green-600 dark:text-green-400 font-medium">
                            {member.tasksCompleted}
                          </span>
                          <span className="text-gray-400">/</span>
                          <span className="text-yellow-600 dark:text-yellow-400">
                            {member.tasksPending}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {getEfficiencyIcon(member.efficiency)}
                          <span className={`font-medium ${getEfficiencyColor(member.efficiency)}`}>
                            {formatPercentage(member.efficiency)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {member.lastActivity.toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Performance */}
      {reportType === 'campaigns' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Активні кампанії
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Facebook E-commerce</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">$31,467</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Google Ads Casino</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">$25,515</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">TikTok Dating</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">$34,545</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Конверсії по платформах
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Facebook</span>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">8.0%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Google Ads</span>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">6.4%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">TikTok</span>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">8.0%</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                ROI по категоріях
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">E-commerce</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">370.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Gambling</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">1417.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Dating</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">2878.8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tasks Performance */}
      {reportType === 'tasks' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Завершені завдання</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.completedTasks}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Очікуючі завдання</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.pendingTasks}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Протерміновані</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.overdueTasks}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ефективність</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatPercentage((metrics.completedTasks / (metrics.completedTasks + metrics.pendingTasks + metrics.overdueTasks)) * 100)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 