'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Bell, X, Check, AlertCircle, Info, MessageSquare, Users, Target } from 'lucide-react'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info' | 'task' | 'message' | 'team'
  title: string
  message: string
  timestamp: Date
  read: boolean
  priority: 'low' | 'medium' | 'high' | 'critical'
  action?: {
    label: string
    url: string
  }
  sender?: {
    name: string
    avatar: string
    role: string
  }
}

interface RealTimeNotificationsProps {
  userId: string
  workspaceId?: string
}

export default function RealTimeNotifications({ userId, workspaceId }: RealTimeNotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const wsRef = useRef<WebSocket | null>(null)

  // Симуляція WebSocket підключення
  useEffect(() => {
    // В реальному проекті тут буде WebSocket підключення
    const mockWebSocket = {
      onmessage: (event: any) => {
        const data = JSON.parse(event.data)
        if (data.type === 'notification') {
          addNotification(data.notification)
        }
      }
    }

    // Симуляція вхідних сповіщень
    const interval = setInterval(() => {
      const mockNotifications = [
        {
          id: Date.now().toString(),
          type: 'task' as const,
          title: 'Нова задача призначена',
          message: 'Вам призначено задачу "Налаштування Facebook реклами"',
          timestamp: new Date(),
          read: false,
          priority: 'medium' as const,
          action: {
            label: 'Переглянути',
            url: '/workspaces/nexus-1/tasks'
          },
          sender: {
            name: 'Олександр Петренко',
            avatar: '/api/placeholder/32/32',
            role: 'Тімлід'
          }
        },
        {
          id: (Date.now() + 1).toString(),
          type: 'message' as const,
          title: 'Нове повідомлення в чаті',
          message: 'Марія Іваненко: Завершила налаштування перших 5 аккаунтів',
          timestamp: new Date(),
          read: false,
          priority: 'low' as const,
          action: {
            label: 'Відповісти',
            url: '/workspaces/nexus-1/chat'
          },
          sender: {
            name: 'Марія Іваненко',
            avatar: '/api/placeholder/32/32',
            role: 'Фармер'
          }
        },
        {
          id: (Date.now() + 2).toString(),
          type: 'warning' as const,
          title: 'Низький баланс аккаунта',
          message: 'Баланс Facebook аккаунта скоро закінчиться',
          timestamp: new Date(),
          read: false,
          priority: 'high' as const,
          action: {
            label: 'Поповнити',
            url: '/accounts'
          }
        }
      ]

      const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)]
      addNotification(randomNotification)
    }, 30000) // Кожні 30 секунд

    return () => {
      clearInterval(interval)
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [userId, workspaceId])

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 49)]) // Максимум 50 сповіщень
    setUnreadCount(prev => prev + 1)
    
    // Автоматичне приховування через 5 секунд для низького пріоритету
    if (notification.priority === 'low') {
      setTimeout(() => {
        removeNotification(notification.id)
      }, 5000)
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
    setUnreadCount(prev => {
      const notification = notifications.find(n => n.id === id)
      return notification && !notification.read ? Math.max(0, prev - 1) : prev
    })
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <Check className="h-4 w-4 text-green-500" />
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'info': return <Info className="h-4 w-4 text-blue-500" />
      case 'task': return <Target className="h-4 w-4 text-purple-500" />
      case 'message': return <MessageSquare className="h-4 w-4 text-blue-500" />
      case 'team': return <Users className="h-4 w-4 text-green-500" />
      default: return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-l-red-500 bg-red-50 dark:bg-red-900/10'
      case 'high': return 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/10'
      case 'medium': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10'
      case 'low': return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/10'
      default: return 'border-l-gray-500 bg-gray-50 dark:bg-gray-900/10'
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'щойно'
    if (minutes < 60) return `${minutes}хв тому`
    if (hours < 24) return `${hours}год тому`
    return `${days}д тому`
  }

  return (
    <div className="relative">
      {/* Кнопка сповіщень */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Панель сповіщень */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          {/* Заголовок */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Сповіщення
            </h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Відмітити всі як прочитані
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Список сповіщень */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                Немає нових сповіщень
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-l-4 ${getPriorityColor(notification.priority)} ${
                      !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {notification.title}
                          </p>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTime(notification.timestamp)}
                            </span>
                            <button
                              onClick={() => removeNotification(notification.id)}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {notification.message}
                        </p>
                        {notification.sender && (
                          <div className="flex items-center space-x-2 mt-2">
                            <img
                              src={notification.sender.avatar}
                              alt={notification.sender.name}
                              className="w-5 h-5 rounded-full"
                            />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {notification.sender.name} • {notification.sender.role}
                            </span>
                          </div>
                        )}
                        {notification.action && (
                          <button
                            onClick={() => {
                              markAsRead(notification.id)
                              window.location.href = notification.action!.url
                            }}
                            className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {notification.action.label} →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Футер */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => window.location.href = '/notifications'}
              className="w-full text-sm text-center text-blue-600 dark:text-blue-400 hover:underline"
            >
              Переглянути всі сповіщення
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 