'use client'

import React, { useState, useEffect } from 'react'
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
  lastActivity: Date
  performance: number
  tasksCompleted: number
  currentTask?: string
}

interface WorkspaceTask {
  id: string
  title: string
  description: string
  status: 'todo' | 'in_progress' | 'review' | 'done' | 'blocked'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignee: string
  assigneeId: string
  dueDate: Date
  createdAt: Date
  tags: string[]
  progress: number
  timeSpent: number
  estimatedTime: number
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
  const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'tasks' | 'chat' | 'calendar' | 'analytics'>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [notifications, setNotifications] = useState(0)

  // Мок дані для робочого простору
  const workspace = {
    id: workspaceId,
    name: 'Нексіс 1',
    description: 'Основний робочий простір для команди арбітражників',
    type: 'team',
    isActive: true,
    members: [
      {
        id: '1',
        name: 'Олександр Петренко',
        role: 'teamlead',
        avatar: '/api/placeholder/32/32',
        status: 'online',
        lastActivity: new Date(),
        performance: 95,
        tasksCompleted: 12,
        currentTask: 'Налаштування Facebook реклами'
      },
      {
        id: '2',
        name: 'Марія Іваненко',
        role: 'farmer',
        avatar: '/api/placeholder/32/32',
        status: 'online',
        lastActivity: new Date(Date.now() - 30 * 60 * 1000),
        performance: 88,
        tasksCompleted: 8,
        currentTask: 'Фармінг Google Ads аккаунтів'
      },
      {
        id: '3',
        name: 'Дмитро Сидоренко',
        role: 'launcher',
        avatar: '/api/placeholder/32/32',
        status: 'busy',
        lastActivity: new Date(Date.now() - 15 * 60 * 1000),
        performance: 92,
        tasksCompleted: 10,
        currentTask: 'Запуск TikTok кампанії'
      },
      {
        id: '4',
        name: 'Анна Коваленко',
        role: 'farmer',
        avatar: '/api/placeholder/32/32',
        status: 'offline',
        lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
        performance: 85,
        tasksCompleted: 6
      }
    ] as WorkspaceMember[],
    tasks: [
      {
        id: '1',
        title: 'Налаштування Facebook реклами',
        description: 'Створити та налаштувати рекламні кампанії для нового продукту',
        status: 'in_progress',
        priority: 'high',
        assignee: 'Дмитро Сидоренко',
        assigneeId: '3',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        tags: ['facebook', 'реклама', 'a/b тестування'],
        progress: 60,
        timeSpent: 240,
        estimatedTime: 480
      },
      {
        id: '2',
        title: 'Фармінг Google Ads аккаунтів',
        description: 'Підготувати 10 Google Ads аккаунтів для рекламних кампаній',
        status: 'todo',
        priority: 'critical',
        assignee: 'Марія Іваненко',
        assigneeId: '2',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        tags: ['google ads', 'фармінг', '2fa'],
        progress: 0,
        timeSpent: 0,
        estimatedTime: 360
      },
      {
        id: '3',
        title: 'Аналіз конкурентів',
        description: 'Провести детальний аналіз конкурентів у ніші',
        status: 'review',
        priority: 'medium',
        assignee: 'Віктор Мельник',
        assigneeId: '5',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        tags: ['аналітика', 'конкуренти', 'звіт'],
        progress: 90,
        timeSpent: 420,
        estimatedTime: 300
      }
    ] as WorkspaceTask[],
    events: [
      {
        id: '1',
        title: 'Щоденна зустріч команди',
        description: 'Обговорення прогресу та планів на день',
        date: new Date(Date.now() + 2 * 60 * 60 * 1000),
        type: 'meeting',
        attendees: ['1', '2', '3', '4'],
        duration: 30,
        location: 'Zoom'
      },
      {
        id: '2',
        title: 'Дедлайн Facebook кампанії',
        description: 'Завершення налаштування рекламних кампаній',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        type: 'deadline',
        attendees: ['3'],
        duration: 0
      },
      {
        id: '3',
        title: 'Віха: 100 аккаунтів готово',
        description: 'Досягнення важливої віхи в проекті',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        type: 'milestone',
        attendees: ['1', '2', '3', '4'],
        duration: 0
      }
    ] as WorkspaceEvent[],
    stats: {
      totalMembers: 4,
      activeMembers: 3,
      totalTasks: 3,
      completedTasks: 0,
      overdueTasks: 0,
      totalRevenue: 18500,
      weeklyGrowth: 15,
      averagePerformance: 90
    } as WorkspaceStats
  }

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'new-task':
      case 'task-template':
      case 'bulk-tasks':
        setActiveTab('tasks')
        break
      case 'schedule-meeting':
      case 'announcement':
        setActiveTab('calendar')
        break
      case 'team-chat':
        setActiveTab('chat')
        break
      case 'analytics':
      case 'performance-report':
      case 'insights':
        setActiveTab('analytics')
        break
      case 'add-member':
        setActiveTab('team')
        break
      default:
        console.log('Action:', actionId)
    }
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
    { id: 'tasks', label: 'Задачі', icon: CheckSquare, color: 'purple' },
    { id: 'chat', label: 'Чат', icon: MessageSquare, color: 'orange' },
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
                    {workspace.name}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {workspace.description}
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

              {/* Сповіщення */}
              <RealTimeNotifications userId={currentUserId} workspaceId={workspaceId} />

              {/* Швидкі дії */}
              <QuickActions onAction={handleQuickAction} workspaceId={workspaceId} />

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
                      {workspace.stats.activeMembers}/{workspace.stats.totalMembers}
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
                      {workspace.stats.completedTasks}/{workspace.stats.totalTasks}
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
                      {workspace.stats.averagePerformance}%
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
                      ${workspace.stats.totalRevenue.toLocaleString()}
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
                  {workspace.events.slice(0, 3).map((event) => (
                    <div key={event.id} className="flex items-start space-x-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {event.title}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {event.date.toLocaleDateString('uk-UA')} • {event.date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}
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
                <button
                  onClick={() => setActiveTab('tasks')}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
                >
                  <span>Переглянути всі</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
              <div className="space-y-3">
                {workspace.tasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {task.title}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${getTaskStatusColor(task.status)}`}>
                          {task.status === 'todo' ? 'Очікує' :
                           task.status === 'in_progress' ? 'В роботі' :
                           task.status === 'review' ? 'Перевірка' :
                           task.status === 'done' ? 'Завершено' : 'Заблоковано'}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority === 'low' ? 'Низький' :
                           task.priority === 'medium' ? 'Середній' :
                           task.priority === 'high' ? 'Високий' : 'Критичний'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {task.progress}%
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTime(task.timeSpent)} / {formatTime(task.estimatedTime)}
                        </p>
                      </div>
                      <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${task.progress}%` }}
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
                Команда ({workspace.members.length} учасників)
              </h2>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition-colors">
                <Plus className="h-4 w-4" />
                <span>Додати учасника</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workspace.members.map((member) => (
                <div key={member.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(member.status)} rounded-full border-2 border-white dark:border-gray-800`}></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {member.name}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(member.role)}`}>
                        {member.role === 'teamlead' ? 'Тімлід' : 
                         member.role === 'farmer' ? 'Фармер' : 
                         member.role === 'launcher' ? 'Лончер' : 'Адмін'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Продуктивність</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {member.performance}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${member.performance}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Задач завершено</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {member.tasksCompleted}
                      </span>
                    </div>

                    {member.currentTask && (
                      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                          Поточна задача:
                        </p>
                        <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
                          {member.currentTask}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Остання активність:</span>
                      <span>
                        {member.lastActivity.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <AdvancedTaskManager
            workspaceId={workspaceId}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'chat' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <TeamChat 
              workspaceId={workspaceId} 
              currentUser={currentUser} 
            />
          </div>
        )}

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
              {workspace.events.map((event) => (
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
                        <span>{event.date.toLocaleDateString('uk-UA')}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Timer className="h-4 w-4" />
                        <span>{event.date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}</span>
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
            teamMembers={workspace.members.map(member => ({
              id: member.id,
              name: member.name,
              role: member.role,
              status: member.status,
              performance: member.performance,
              tasksCompleted: member.tasksCompleted,
              lastActivity: member.lastActivity,
              isActive: member.status === 'online' || member.status === 'busy'
            }))}
            metrics={{
              totalMembers: workspace.stats.totalMembers,
              activeMembers: workspace.stats.activeMembers,
              averagePerformance: workspace.stats.averagePerformance,
              totalTasks: workspace.stats.totalTasks,
              completedTasks: workspace.stats.completedTasks,
              pendingTasks: workspace.tasks.filter(t => t.status === 'in_progress').length,
              overdueTasks: workspace.stats.overdueTasks,
              weeklyGrowth: workspace.stats.weeklyGrowth
            }}
          />
        )}
      </div>
    </div>
  )
} 