'use client'

import React, { useState } from 'react'
import { 
  Plus, 
  Calendar, 
  MessageSquare, 
  BarChart3,
  Users,
  CheckSquare,
  FileText,
  Settings,
  Zap,
  Lightbulb,
  Target,
  TrendingUp
} from 'lucide-react'

interface QuickAction {
  id: string
  title: string
  description: string
  icon: any
  color: string
  action: () => void
  category: 'task' | 'communication' | 'analytics' | 'management'
}

interface QuickActionsProps {
  onAction: (actionId: string) => void
  workspaceId: string
}

export default function QuickActions({ onAction, workspaceId }: QuickActionsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const quickActions: QuickAction[] = [
    // Задачі
    {
      id: 'new-task',
      title: 'Нова задача',
      description: 'Створити нову задачу для команди',
      icon: Plus,
      color: 'blue',
      category: 'task',
      action: () => onAction('new-task')
    },
    {
      id: 'task-template',
      title: 'Шаблон задачі',
      description: 'Використати готовий шаблон',
      icon: FileText,
      color: 'green',
      category: 'task',
      action: () => onAction('task-template')
    },
    {
      id: 'bulk-tasks',
      title: 'Масові задачі',
      description: 'Створити кілька задач одразу',
      icon: CheckSquare,
      color: 'purple',
      category: 'task',
      action: () => onAction('bulk-tasks')
    },

    // Комунікація
    {
      id: 'schedule-meeting',
      title: 'Запланувати зустріч',
      description: 'Організувати командну зустріч',
      icon: Calendar,
      color: 'green',
      category: 'communication',
      action: () => onAction('schedule-meeting')
    },
    {
      id: 'team-chat',
      title: 'Командний чат',
      description: 'Відкрити чат команди',
      icon: MessageSquare,
      color: 'purple',
      category: 'communication',
      action: () => onAction('team-chat')
    },
    {
      id: 'announcement',
      title: 'Оголошення',
      description: 'Створити важливе оголошення',
      icon: Zap,
      color: 'orange',
      category: 'communication',
      action: () => onAction('announcement')
    },

    // Аналітика
    {
      id: 'analytics',
      title: 'Аналітика',
      description: 'Переглянути статистику команди',
      icon: BarChart3,
      color: 'orange',
      category: 'analytics',
      action: () => onAction('analytics')
    },
    {
      id: 'performance-report',
      title: 'Звіт продуктивності',
      description: 'Згенерувати звіт за період',
      icon: TrendingUp,
      color: 'indigo',
      category: 'analytics',
      action: () => onAction('performance-report')
    },
    {
      id: 'insights',
      title: 'Інсайти',
      description: 'Отримати рекомендації',
      icon: Lightbulb,
      color: 'yellow',
      category: 'analytics',
      action: () => onAction('insights')
    },

    // Управління
    {
      id: 'add-member',
      title: 'Додати учасника',
      description: 'Запросити нового члена команди',
      icon: Users,
      color: 'blue',
      category: 'management',
      action: () => onAction('add-member')
    },
    {
      id: 'set-goals',
      title: 'Встановити цілі',
      description: 'Визначити цілі команди',
      icon: Target,
      color: 'red',
      category: 'management',
      action: () => onAction('set-goals')
    },
    {
      id: 'workspace-settings',
      title: 'Налаштування',
      description: 'Налаштувати робочий простір',
      icon: Settings,
      color: 'gray',
      category: 'management',
      action: () => onAction('workspace-settings')
    }
  ]

  const categories = [
    { id: 'all', label: 'Всі', count: quickActions.length },
    { id: 'task', label: 'Задачі', count: quickActions.filter(a => a.category === 'task').length },
    { id: 'communication', label: 'Комунікація', count: quickActions.filter(a => a.category === 'communication').length },
    { id: 'analytics', label: 'Аналітика', count: quickActions.filter(a => a.category === 'analytics').length },
    { id: 'management', label: 'Управління', count: quickActions.filter(a => a.category === 'management').length }
  ]

  const filteredActions = selectedCategory === 'all' 
    ? quickActions 
    : quickActions.filter(action => action.category === selectedCategory)

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
      green: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
      purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
      orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
      red: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
      indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400',
      yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
      gray: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
    }
    return colorMap[color] || colorMap.gray
  }

  return (
    <div className="relative">
      {/* Кнопка відкриття */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
      >
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">Швидкі дії</span>
      </button>

      {/* Модальне вікно */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Швидкі дії
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Оберіть дію для швидкого доступу
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Plus className="h-4 w-4 transform rotate-45" />
              </button>
            </div>

            {/* Категорії */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2 overflow-x-auto">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category.label} ({category.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Список дій */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => {
                      action.action()
                      setIsOpen(false)
                    }}
                    className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left group"
                  >
                    <div className={`p-2 rounded-lg ${getColorClasses(action.color)} group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {action.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {action.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {filteredActions.length} дій доступно
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Закрити
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 