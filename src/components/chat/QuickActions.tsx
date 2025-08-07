'use client'

import React, { useState } from 'react'
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  User, 
  Calendar,
  Plus,
  X
} from 'lucide-react'

interface QuickAction {
  id: string
  icon: React.ReactNode
  label: string
  color: string
  action: () => void
}

interface QuickActionsProps {
  onCreateTask: (type: string) => void
  onMentionUser: (userId: string) => void
  onSetReminder: () => void
}

export default function QuickActions({ onCreateTask, onMentionUser, onSetReminder }: QuickActionsProps) {
  const [isOpen, setIsOpen] = useState(false)

  const quickActions: QuickAction[] = [
    {
      id: 'task-high',
      icon: <AlertTriangle size={16} />,
      label: 'Важлива задача',
      color: 'text-red-600',
      action: () => onCreateTask('high')
    },
    {
      id: 'task-medium',
      icon: <CheckCircle size={16} />,
      label: 'Звичайна задача',
      color: 'text-blue-600',
      action: () => onCreateTask('medium')
    },
    {
      id: 'task-low',
      icon: <Clock size={16} />,
      label: 'Негайна задача',
      color: 'text-green-600',
      action: () => onCreateTask('low')
    },
    {
      id: 'reminder',
      icon: <Calendar size={16} />,
      label: 'Нагадування',
      color: 'text-purple-600',
      action: onSetReminder
    },
    {
      id: 'mention',
      icon: <User size={16} />,
      label: 'Згадати користувача',
      color: 'text-orange-600',
      action: () => onMentionUser('user_1')
    }
  ]

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center z-40"
      >
        <Plus size={24} />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Close button */}
      <button
        onClick={() => setIsOpen(false)}
        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors flex items-center justify-center"
      >
        <X size={16} />
      </button>
      
      {/* Quick actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 min-w-[200px]">
        <div className="text-sm font-medium text-gray-900 dark:text-white mb-2 px-2">
          Швидкі дії
        </div>
        
        <div className="space-y-1">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => {
                action.action()
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <div className={action.color}>
                {action.icon}
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
} 