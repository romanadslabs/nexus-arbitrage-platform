'use client'

import React, { useState, useEffect } from 'react'
import { 
  User, 
  CheckSquare, 
  MessageSquare, 
  Calendar, 
  FileText,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Star,
  Zap,
  Target,
  Users,
  Activity
} from 'lucide-react'

interface ActivityItem {
  id: string
  type: 'task_completed' | 'task_created' | 'message_sent' | 'meeting_scheduled' | 'member_joined' | 'goal_achieved' | 'performance_improved'
  user: string
  userAvatar?: string
  description: string
  timestamp: Date
  metadata?: {
    taskTitle?: string
    taskId?: string
    meetingTitle?: string
    performance?: number
    goal?: string
  }
}

interface ActivityFeedProps {
  workspaceId: string
  maxItems?: number
}

export default function ActivityFeed({ workspaceId, maxItems = 10 }: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'task_completed',
      user: 'Марія Іваненко',
      description: 'завершила задачу',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      metadata: {
        taskTitle: 'Налаштування Facebook реклами',
        taskId: 'task-1'
      }
    },
    {
      id: '2',
      type: 'performance_improved',
      user: 'Дмитро Сидоренко',
      description: 'покращив продуктивність на 15%',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      metadata: {
        performance: 15
      }
    },
    {
      id: '3',
      type: 'meeting_scheduled',
      user: 'Олександр Петренко',
      description: 'запланував зустріч команди',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      metadata: {
        meetingTitle: 'Щоденна планерка'
      }
    },
    {
      id: '4',
      type: 'task_created',
      user: 'Анна Коваленко',
      description: 'створила нову задачу',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      metadata: {
        taskTitle: 'Аналіз TikTok конкурентів',
        taskId: 'task-2'
      }
    },
    {
      id: '5',
      type: 'goal_achieved',
      user: 'Віктор Морозов',
      description: 'досягнув цілі тижня',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      metadata: {
        goal: '100 аккаунтів готово'
      }
    },
    {
      id: '6',
      type: 'message_sent',
      user: 'Катерина Шевченко',
      description: 'надісла повідомлення в чат',
      timestamp: new Date(Date.now() - 90 * 60 * 1000)
    },
    {
      id: '7',
      type: 'member_joined',
      user: 'Ігор Бондаренко',
      description: 'приєднався до команди',
      timestamp: new Date(Date.now() - 120 * 60 * 1000)
    }
  ])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task_completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'task_created':
        return <CheckSquare className="h-4 w-4 text-blue-500" />
      case 'message_sent':
        return <MessageSquare className="h-4 w-4 text-purple-500" />
      case 'meeting_scheduled':
        return <Calendar className="h-4 w-4 text-orange-500" />
      case 'member_joined':
        return <Users className="h-4 w-4 text-indigo-500" />
      case 'goal_achieved':
        return <Target className="h-4 w-4 text-red-500" />
      case 'performance_improved':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'task_completed':
      case 'goal_achieved':
      case 'performance_improved':
        return 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800'
      case 'task_created':
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800'
      case 'message_sent':
        return 'bg-purple-50 border-purple-200 dark:bg-purple-900/10 dark:border-purple-800'
      case 'meeting_scheduled':
        return 'bg-orange-50 border-orange-200 dark:bg-orange-900/10 dark:border-orange-800'
      case 'member_joined':
        return 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/10 dark:border-indigo-800'
      default:
        return 'bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600'
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'щойно'
    if (diffInMinutes < 60) return `${diffInMinutes}хв тому`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}г тому`
    return `${Math.floor(diffInMinutes / 1440)}д тому`
  }

  const getActivityDescription = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'task_completed':
        return (
          <span>
            <strong>{activity.user}</strong> завершила задачу{' '}
            <span className="font-medium text-blue-600 dark:text-blue-400">
              "{activity.metadata?.taskTitle}"
            </span>
          </span>
        )
      case 'task_created':
        return (
          <span>
            <strong>{activity.user}</strong> створила задачу{' '}
            <span className="font-medium text-blue-600 dark:text-blue-400">
              "{activity.metadata?.taskTitle}"
            </span>
          </span>
        )
      case 'message_sent':
        return (
          <span>
            <strong>{activity.user}</strong> надісла повідомлення в командний чат
          </span>
        )
      case 'meeting_scheduled':
        return (
          <span>
            <strong>{activity.user}</strong> запланував зустріч{' '}
            <span className="font-medium text-orange-600 dark:text-orange-400">
              "{activity.metadata?.meetingTitle}"
            </span>
          </span>
        )
      case 'member_joined':
        return (
          <span>
            <strong>{activity.user}</strong> приєднався до команди
          </span>
        )
      case 'goal_achieved':
        return (
          <span>
            <strong>{activity.user}</strong> досягнув цілі:{' '}
            <span className="font-medium text-red-600 dark:text-red-400">
              "{activity.metadata?.goal}"
            </span>
          </span>
        )
      case 'performance_improved':
        return (
          <span>
            <strong>{activity.user}</strong> покращив продуктивність на{' '}
            <span className="font-medium text-green-600 dark:text-green-400">
              +{activity.metadata?.performance}%
            </span>
          </span>
        )
      default:
        return activity.description
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Активність команди
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Живий оновлення
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {activities.slice(0, maxItems).map((activity) => (
          <div
            key={activity.id}
            className={`flex items-start space-x-3 p-3 rounded-lg border ${getActivityColor(activity.type)} transition-colors hover:bg-opacity-75`}
          >
            <div className="flex-shrink-0 mt-1">
              {getActivityIcon(activity.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-900 dark:text-white">
                  {getActivityDescription(activity)}
                </p>
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatTimeAgo(activity.timestamp)}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activities.length > maxItems && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
            Показати більше активності
          </button>
        </div>
      )}
    </div>
  )
} 