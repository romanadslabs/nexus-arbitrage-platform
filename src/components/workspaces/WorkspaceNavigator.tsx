'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Users, 
  User, 
  Plus, 
  Settings, 
  ChevronDown, 
  ChevronRight,
  Home,
  Target,
  BarChart3,
  MessageSquare,
  Calendar,
  FileText,
  Star,
  MoreHorizontal
} from 'lucide-react'

interface Workspace {
  id: string
  name: string
  type: 'personal' | 'team' | 'project'
  description?: string
  isActive: boolean
  membersCount: number
  lastActivity: Date
}

interface WorkspaceNavigatorProps {
  workspaces: Workspace[]
  currentWorkspaceId?: string
  onWorkspaceChange: (workspaceId: string) => void
  onCreateWorkspace: () => void
}

export default function WorkspaceNavigator({ 
  workspaces, 
  currentWorkspaceId, 
  onWorkspaceChange, 
  onCreateWorkspace 
}: WorkspaceNavigatorProps) {
  const [expandedWorkspaces, setExpandedWorkspaces] = useState<Set<string>>(new Set())
  const [isClient, setIsClient] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const toggleWorkspace = (workspaceId: string) => {
    const newExpanded = new Set(expandedWorkspaces)
    if (newExpanded.has(workspaceId)) {
      newExpanded.delete(workspaceId)
    } else {
      newExpanded.add(workspaceId)
    }
    setExpandedWorkspaces(newExpanded)
  }

  const getWorkspaceIcon = (type: string) => {
    switch (type) {
      case 'personal':
        return <User className="h-4 w-4" />
      case 'team':
        return <Users className="h-4 w-4" />
      case 'project':
        return <Target className="h-4 w-4" />
      default:
        return <Home className="h-4 w-4" />
    }
  }

  const getWorkspaceColor = (type: string) => {
    switch (type) {
      case 'personal':
        return 'text-blue-500'
      case 'team':
        return 'text-green-500'
      case 'project':
        return 'text-purple-500'
      default:
        return 'text-gray-500'
    }
  }

  const formatLastActivity = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) return `${minutes}хв`
    if (hours < 24) return `${hours}год`
    return `${days}д`
  }

  const workspaceSections = [
    {
      title: 'Особистий простір',
      workspaces: workspaces.filter(w => w.type === 'personal')
    },
    {
      title: 'Командні простори',
      workspaces: workspaces.filter(w => w.type === 'team')
    },
    {
      title: 'Проекти',
      workspaces: workspaces.filter(w => w.type === 'project')
    }
  ]

  if (!isClient) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            РОБОЧІ ПРОСТОРИ
          </h3>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
          Завантаження...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          РОБОЧІ ПРОСТОРИ
        </h3>
        <button
          onClick={onCreateWorkspace}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Створити новий простір"
        >
          <Plus className="h-3 w-3 text-gray-500" />
        </button>
      </div>

      {/* Список просторів */}
      {workspaces.length === 0 ? (
        <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
          Поки що немає робочих просторів
        </div>
      ) : (
        <div className="space-y-2">
          {workspaceSections.map((section) => {
            if (section.workspaces.length === 0) return null
            
            return (
              <div key={section.title} className="space-y-1">
                <div className="text-xs font-medium text-gray-600 dark:text-gray-300 px-2">
                  {section.title}
                </div>
                {section.workspaces.map((workspace) => {
                  const isExpanded = expandedWorkspaces.has(workspace.id)
                  const isActive = currentWorkspaceId === workspace.id
                  
                  return (
                    <div key={workspace.id} className="space-y-1">
                      {/* Основна кнопка простору */}
                      <button
                        onClick={() => onWorkspaceChange(workspace.id)}
                        className={`
                          w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors
                          ${isActive 
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }
                        `}
                      >
                        <div className="flex items-center space-x-2">
                          <div className={getWorkspaceColor(workspace.type)}>
                            {getWorkspaceIcon(workspace.type)}
                          </div>
                          <span className="font-medium">{workspace.name}</span>
                          {workspace.isActive && (
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-gray-500">
                            {workspace.membersCount}
                          </span>
                          <div
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleWorkspace(workspace.id)
                            }}
                            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : (
                              <ChevronRight className="h-3 w-3" />
                            )}
                          </div>
                        </div>
                      </button>

                      {/* Розгорнутий контент простору */}
                      {isExpanded && (
                        <div className="ml-6 space-y-1">
                          {/* Швидкі дії */}
                          <div className="space-y-1">
                            <Link
                              href={`/workspaces/${workspace.id}/dashboard`}
                              className="flex items-center space-x-2 px-3 py-1.5 rounded text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                              <Home className="h-3 w-3" />
                              <span>Дашборд</span>
                            </Link>
                            
                            <Link
                              href={`/workspaces/${workspace.id}/accounts`}
                              className="flex items-center space-x-2 px-3 py-1.5 rounded text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                              <Users className="h-3 w-3" />
                              <span>Аккаунти</span>
                            </Link>
                            
                            <Link
                              href={`/workspaces/${workspace.id}/campaigns`}
                              className="flex items-center space-x-2 px-3 py-1.5 rounded text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                              <Target className="h-3 w-3" />
                              <span>Кампанії</span>
                            </Link>
                            
                            <Link
                              href={`/workspaces/${workspace.id}/analytics`}
                              className="flex items-center space-x-2 px-3 py-1.5 rounded text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                              <BarChart3 className="h-3 w-3" />
                              <span>Аналітика</span>
                            </Link>
                            
                            {workspace.type === 'team' && (
                              <>
                                <Link
                                  href={`/workspaces/${workspace.id}/chat`}
                                  className="flex items-center space-x-2 px-3 py-1.5 rounded text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                  <MessageSquare className="h-3 w-3" />
                                  <span>Чат</span>
                                </Link>
                                
                                <Link
                                  href={`/workspaces/${workspace.id}/tasks`}
                                  className="flex items-center space-x-2 px-3 py-1.5 rounded text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                  <FileText className="h-3 w-3" />
                                  <span>Задачі</span>
                                </Link>
                                
                                <Link
                                  href={`/workspaces/${workspace.id}/calendar`}
                                  className="flex items-center space-x-2 px-3 py-1.5 rounded text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                  <Calendar className="h-3 w-3" />
                                  <span>Календар</span>
                                </Link>
                              </>
                            )}
                          </div>

                          {/* Остання активність */}
                          <div className="px-3 py-1.5">
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Остання активність: {formatLastActivity(workspace.lastActivity)}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      )}

      {/* Кнопка створення */}
      <button
        onClick={onCreateWorkspace}
        className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
      >
        <Plus className="h-4 w-4" />
        <span>Створити простір</span>
      </button>
    </div>
  )
} 