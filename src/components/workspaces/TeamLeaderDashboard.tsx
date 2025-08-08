'use client'

import React, { useState } from 'react'
import { 
  Users, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  BarChart3,
  MessageSquare,
  Calendar,
  Settings,
  Plus,
  Eye,
  Edit,
  Trash2,
  Star,
  Activity,
  DollarSign,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface TeamMember {
  id: string
  name: string
  role: string
  status: 'online' | 'offline' | 'busy'
  performance: number
  tasksCompleted: number
  lastActivity?: Date | string
  isActive: boolean
}

// Безпечне форматування часу останньої активності
const formatLastActivityTime = (value?: Date | string) => {
  if (!value) return '-'
  const date = value instanceof Date ? value : new Date(value)
  if (isNaN(date.getTime())) return '-'
  return date.toLocaleTimeString('uk-UA')
}

interface TeamMetric {
  totalMembers: number
  activeMembers: number
  averagePerformance: number
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  overdueTasks: number
  weeklyGrowth: number
}

interface TeamLeaderDashboardProps {
  workspaceId: string
  teamMembers: TeamMember[]
  metrics: TeamMetric
}

export default function TeamLeaderDashboard({ 
  workspaceId, 
  teamMembers, 
  metrics 
}: TeamLeaderDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'tasks' | 'reports'>('overview')
  const router = useRouter()

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'text-green-600 dark:text-green-400'
    if (performance >= 70) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'busy': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'teamlead': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'farmer': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'launcher': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Центр управління командою
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Моніторинг продуктивності, управління задачами та аналітика команди
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => router.push('/reports')}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4 mr-1 inline" />
              Новий звіт
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-4">
          <nav className="flex space-x-6 border-b border-gray-200 dark:border-gray-700">
            {[
              { id: 'overview', label: 'Огляд', icon: BarChart3 },
              { id: 'performance', label: 'Продуктивність', icon: TrendingUp },
              { id: 'tasks', label: 'Задачі', icon: Target },
              { id: 'reports', label: 'Звіти', icon: Activity }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Активні учасники</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {metrics.activeMembers}/{metrics.totalMembers}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">Середня продуктивність</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                      {metrics.averagePerformance}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Завершені задачі</p>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                      {metrics.completedTasks}/{metrics.totalTasks}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Тижневий ріст</p>
                    <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                      +{metrics.weeklyGrowth}%
                    </p>
                  </div>
                  <Zap className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex gap-2">
              <Link href="/workspace/tasks" className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700">До задач</Link>
              <Link href="/workspace/chat" className="px-3 py-2 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">До чату</Link>
              <Link href="/reports" className="px-3 py-2 text-sm rounded-lg bg-purple-600 text-white hover:bg-purple-700">До звітів</Link>
            </div>

            {/* Team Members Overview */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Команда ({teamMembers.length} учасників)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="bg-white dark:bg_gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(member.status)} rounded-full border-2 border-white dark:border-gray-800`}></div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                          <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(member.role)}`}>
                            {member.role === 'teamlead' ? 'Тімлід' : 
                             member.role === 'farmer' ? 'Фармер' : 
                             member.role === 'launcher' ? 'Лончер' : 'Адмін'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                          <Eye className="h-3 w-3 text-gray-400" />
                        </button>
                        <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                          <Edit className="h-3 w-3 text-gray-400" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Продуктивність:</span>
                        <span className={`font-medium ${getPerformanceColor(member.performance)}`}>
                          {member.performance}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Задачі:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {member.tasksCompleted}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Остання активність:</span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {formatLastActivityTime(member.lastActivity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <h3 className="font-medium text-yellow-800 dark:text-yellow-200">
                  Увага: {metrics.overdueTasks} протермінованих задач
                </h3>
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Необхідно переглянути та перерозподілити навантаження
              </p>
            </div>

            {/* Кнопки переходу */}
            <div className="flex gap-2">
              <Link href="/reports" className="px-3 py-2 text-sm rounded-lg bg-purple-600 text-white hover:bg-purple-700">Звіти по продуктивності</Link>
              <Link href="/reports" className="px-3 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Звіти за період</Link>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex gap-2">
              <Link href="/workspace/tasks" className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700">Відкрити задачі</Link>
              <Link href="/workspace/chat" className="px-3 py-2 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Відкрити чат</Link>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-4">
            <Link href="/reports" className="block p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <p className="font-medium text-gray-900 dark:text-white">Відкрити Звіти</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Перейти до Performance/Period/Unified</p>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
} 