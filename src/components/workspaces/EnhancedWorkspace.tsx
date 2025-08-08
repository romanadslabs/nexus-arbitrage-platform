'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useData } from '@/components/providers/DataProvider'
import { LinkStatsService } from '@/lib/offers'
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  CheckSquare, 
  BarChart3,
  Settings,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  Star,
  Activity,
  TrendingUp,
  DollarSign,
  Target,
  Crown,
  Bell,
  FileText,
  Image,
  Video,
  Download,
  Eye,
  Edit,
  Trash2,
  Tag,
  X,
  ArrowRight,
  Zap,
  Lightbulb,
  Award,
  CalendarDays,
  Timer,
  Target as TargetIcon,
  Users as UsersIcon,
  BarChart as BarChartIcon
} from 'lucide-react'
import TeamChat from './TeamChat'
import AdvancedTaskManager from './AdvancedTaskManager'
import TeamLeaderDashboard from './TeamLeaderDashboard'
import RealTimeNotifications from '@/components/ui/RealTimeNotifications'
import QuickActions from '@/components/ui/QuickActions'
import ActivityFeed from './ActivityFeed'

interface WorkspaceMember {
  id: string
  name: string
  role: 'teamlead' | 'farmer' | 'launcher' | 'admin'
  avatar: string
  status: 'online' | 'offline' | 'busy'
  lastActivity?: Date | string
  performance: number
  tasksCompleted: number
  currentTask?: string
  isActive: boolean
}

// Безпечне форматування часу останньої активності
const formatLastActivityTime = (value?: Date | string) => {
  if (!value) return '-'
  const date = value instanceof Date ? value : new Date(value)
  if (isNaN(date.getTime())) return '-'
  return date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })
}

interface WorkspaceEvent {
  id: string
  title: string
  description: string
  date: Date
  type: 'meeting' | 'deadline' | 'milestone' | 'review'
  attendees: string[]
  duration?: number
  location?: string
}

interface WorkspaceStats {
  totalMembers: number
  activeMembers: number
  totalTasks: number
  completedTasks: number
  overdueTasks: number
  totalRevenue: number
  weeklyGrowth: number
  averagePerformance: number
}

interface EnhancedWorkspaceProps {
  workspaceId: string
  currentUser: string
  currentUserId: string
}

export default function EnhancedWorkspace({ workspaceId, currentUser, currentUserId }: EnhancedWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'calendar' | 'analytics'>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [notifications, setNotifications] = useState(0)

  // Дані з провайдера
  const { workspace: ws } = useData()
  const team = ws?.team || []
  const tasks = ws?.tasks || []
  const activity = ws?.activity || []

  // Розрахунок метрик із реальних даних (оффери/лінк-статистика)
  const totalRevenue = (() => {
    try {
      const stats = LinkStatsService.getAllStats()
      return stats.reduce((s, r) => s + (r.revenue || 0), 0)
    } catch {
      return 0
    }
  })()

  const metrics: WorkspaceStats = {
    totalMembers: team.length,
    activeMembers: team.length, // за замовчуванням вважаємо всіх активними
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t: any) => t.status === 'done').length,
    overdueTasks: 0,
    totalRevenue,
    weeklyGrowth: 0,
    averagePerformance: 0,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'busy': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
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

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'review': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'done': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'blocked': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}г ${mins}хв`
  }

  const tabs = [
    { id: 'overview', label: 'Огляд', icon: BarChartIcon, color: 'blue' },
    { id: 'team', label: 'Команда', icon: UsersIcon, color: 'green' },
    { id: 'calendar', label: 'Календар', icon: Calendar, color: 'red' },
    { id: 'analytics', label: 'Аналітика', icon: BarChart3, color: 'indigo' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">N</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    {ws?.name || 'Робочий простір'}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {ws?.description || 'Командний простір'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Пошук */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Пошук..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Швидкі лінки */}
              <Link href="/workspace/tasks" className="px-3 py-2 text-sm rounded-lg bg-purple-600 text-white hover:bg-purple-700">Задачі</Link>
              <Link href="/workspace/chat" className="px-3 py-2 text-sm rounded-lg bg-orange-600 text-white hover:bg-orange-700">Чат</Link>

              {/* Сповіщення */}
              <RealTimeNotifications userId={currentUserId} workspaceId={workspaceId} />

              {/* Швидкі дії */}
              <QuickActions onAction={() => {}} workspaceId={workspaceId} />

              {/* Налаштування */}
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>


        </div>
      </div>

      {/* Навігація */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
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

      {/* Основний контент */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Статистика */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Команда</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {metrics.activeMembers}/{metrics.totalMembers}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <CheckSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Задачі</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {metrics.completedTasks}/{metrics.totalTasks}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Продуктивність</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {metrics.averagePerformance}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                    <DollarSign className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Дохід</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${metrics.totalRevenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Активність команди */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ActivityFeed workspaceId={workspaceId} maxItems={5} />

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Найближчі події
                </h3>
                <div className="space-y-4">
                  {(ws as any)?.events?.slice?.(0, 3)?.map((event: any) => (
                    <div key={event.id} className="flex items-start space-x-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {event.title}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(event.date).toLocaleDateString('uk-UA')} • {formatLastActivityTime(event.date)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {event.attendees.length} учасників
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Останні задачі */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Останні задачі
                </h3>
                <Link
                  href="/workspace/tasks"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
                >
                  <span>Переглянути всі</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="space-y-3">
                {tasks.slice(0, 3).map((task: any) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {task.title}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          task.status === 'todo' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
                          task.status === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                          task.status === 'review' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          task.status === 'done' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {task.status === 'todo' ? 'Очікує' :
                           task.status === 'in_progress' ? 'В роботі' :
                           task.status === 'review' ? 'Перевірка' :
                           task.status === 'done' ? 'Завершено' : 'Заблоковано'}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          task.priority === 'low' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          task.priority === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {task.priority === 'low' ? 'Низький' :
                           task.priority === 'medium' ? 'Середній' :
                           task.priority === 'high' ? 'Високий' : 'Критичний'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {task.progress ?? 0}%
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {/* Прогрес за наявності детальної інформації */}
                        </p>
                      </div>
                      <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${task.progress ?? 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Команда ({team.length} учасників)
              </h2>
              <Link href="/workspace/chat" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Відкрити чат</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((member: any) => (
                <div key={member.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${'bg-green-500'} rounded-full border-2 border-white dark:border-gray-800`}></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {member.name}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'}`}>
                        {member.role || 'Учасник'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Задач завершено</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {/* За бажанням можна підрахувати по задачах */}0
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Вкладки задач і чату перенаправляємо на окремі сторінки */}

        {activeTab === 'calendar' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Календар подій
              </h2>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition-colors">
                <Plus className="h-4 w-4" />
                <span>Нова подія</span>
              </button>
            </div>
            <div className="space-y-4">
              {(ws as any)?.events?.map?.((event: any) => (
                <div key={event.id} className="flex items-start space-x-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {event.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        event.type === 'meeting' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                        event.type === 'deadline' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                        event.type === 'milestone' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }`}>
                        {event.type === 'meeting' ? 'Зустріч' :
                         event.type === 'deadline' ? 'Дедлайн' :
                         event.type === 'milestone' ? 'Віха' : 'Перевірка'}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {event.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center space-x-1">
                        <CalendarDays className="h-4 w-4" />
                        <span>{new Date(event.date).toLocaleDateString('uk-UA')}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Timer className="h-4 w-4" />
                        <span>{formatLastActivityTime(event.date)}</span>
                      </span>
                      {event.duration && (
                        <span className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{event.duration} хв</span>
                        </span>
                      )}
                      <span className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{event.attendees.length} учасників</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <TeamLeaderDashboard
            workspaceId={workspaceId}
            teamMembers={team.map((member: any) => ({
              id: member.id,
              name: member.name,
              role: (member.role as any) || 'member',
              status: 'online',
              performance: 0,
              tasksCompleted: 0,
              lastActivity: new Date(),
              isActive: true
            }))}
            metrics={{
              totalMembers: metrics.totalMembers,
              activeMembers: metrics.activeMembers,
              averagePerformance: metrics.averagePerformance,
              totalTasks: metrics.totalTasks,
              completedTasks: metrics.completedTasks,
              pendingTasks: tasks.filter((t: any) => t.status === 'in_progress').length,
              overdueTasks: metrics.overdueTasks,
              weeklyGrowth: metrics.weeklyGrowth
            }}
          />
        )}
      </div>
    </div>
  )
} 