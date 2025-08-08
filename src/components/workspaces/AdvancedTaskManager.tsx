'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useData } from '@/components/providers/DataProvider'
import { useAuth } from '@/components/providers/AuthProvider'
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Star,
  MessageSquare,
  Paperclip,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Tag,
  BarChart3,
  TrendingUp,
  Users,
  Target,
  X
} from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in_progress' | 'review' | 'done' | 'blocked'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignee: string
  assigneeId: string
  assigneeAvatar: string
  dueDate: Date
  createdAt: Date
  updatedAt: Date
  tags: string[]
  comments: TaskComment[]
  attachments: TaskAttachment[]
  timeSpent: number // в хвилинах
  estimatedTime: number // в хвилинах
  progress: number // від 0 до 100
  dependencies: string[] // ID залежних задач
  subtasks: SubTask[]
  watchers: string[] // ID користувачів, що слідкують за задачею
}

interface TaskComment {
  id: string
  author: string
  authorId: string
  authorAvatar: string
  content: string
  timestamp: Date
  attachments?: TaskAttachment[]
}

interface TaskAttachment {
  id: string
  name: string
  type: 'image' | 'document' | 'video' | 'audio'
  url: string
  size: number
  uploadedBy: string
  uploadedAt: Date
}

interface SubTask {
  id: string
  title: string
  completed: boolean
  assignee?: string
}

interface AdvancedTaskManagerProps {
  workspaceId: string
  currentUser: string
  currentUserId?: string
}

export default function AdvancedTaskManager({ workspaceId, currentUser, currentUserId = '1' }: AdvancedTaskManagerProps) {
  const { workspace, addTask, updateTask, deleteTask, addCommentToTask } = useData()
  const { user, getAllUsers } = useAuth() as any
  const users = typeof getAllUsers === 'function' ? getAllUsers() : []

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Налаштування Facebook реклами',
      description: 'Створити та налаштувати рекламні кампанії для нового продукту. Включити A/B тестування та оптимізацію.',
      status: 'in_progress',
      priority: 'high',
      assignee: 'Дмитро Сидоренко',
      assigneeId: '3',
      assigneeAvatar: '/api/placeholder/32/32',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      tags: ['facebook', 'реклама', 'a/b тестування'],
      comments: [
        {
          id: 'c1',
          author: 'Олександр Петренко',
          authorId: '1',
          authorAvatar: '/api/placeholder/32/32',
          content: 'Дмитро, не забудь налаштувати ретаргетинг для існуючих клієнтів.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          id: 'c2',
          author: 'Дмитро Сидоренко',
          authorId: '3',
          authorAvatar: '/api/placeholder/32/32',
          content: 'Зрозуміло! Вже створив окрему аудиторію для ретаргетингу.',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
        }
      ],
      attachments: [
        {
          id: 'a1',
          name: 'Facebook_Campaign_Setup.pdf',
          type: 'document',
          url: '/files/facebook_campaign_setup.pdf',
          size: 1024000,
          uploadedBy: 'Дмитро Сидоренко',
          uploadedAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
        }
      ],
      timeSpent: 240, // 4 години
      estimatedTime: 480, // 8 годин
      progress: 60,
      dependencies: [],
      subtasks: [
        { id: 'st1', title: 'Створити креативи', completed: true },
        { id: 'st2', title: 'Налаштувати аудиторії', completed: true },
        { id: 'st3', title: 'Запустити A/B тести', completed: false },
        { id: 'st4', title: 'Оптимізувати ставки', completed: false }
      ],
      watchers: ['1', '2', '4']
    },
    {
      id: '2',
      title: 'Фармінг Google Ads аккаунтів',
      description: 'Підготувати 10 Google Ads аккаунтів для рекламних кампаній. Включити 2FA та резервні коди.',
      status: 'todo',
      priority: 'critical',
      assignee: 'Марія Іваненко',
      assigneeId: '2',
      assigneeAvatar: '/api/placeholder/32/32',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      tags: ['google ads', 'фармінг', '2fa'],
      comments: [],
      attachments: [],
      timeSpent: 0,
      estimatedTime: 360, // 6 годин
      progress: 0,
      dependencies: [],
      subtasks: [
        { id: 'st5', title: 'Створити аккаунти', completed: false },
        { id: 'st6', title: 'Налаштувати 2FA', completed: false },
        { id: 'st7', title: 'Згенерувати резервні коди', completed: false },
        { id: 'st8', title: 'Перевірити роботу', completed: false }
      ],
      watchers: ['1', '3']
    },
    {
      id: '3',
      title: 'Аналіз конкурентів',
      description: 'Провести детальний аналіз конкурентів у ніші. Створити звіт з рекомендаціями.',
      status: 'review',
      priority: 'medium',
      assignee: 'Віктор Мельник',
      assigneeId: '5',
      assigneeAvatar: '/api/placeholder/32/32',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      tags: ['аналітика', 'конкуренти', 'звіт'],
      comments: [
        {
          id: 'c3',
          author: 'Олександр Петренко',
          authorId: '1',
          authorAvatar: '/api/placeholder/32/32',
          content: 'Віктор, додай більше деталей про цінову політику конкурентів.',
          timestamp: new Date(Date.now() - 30 * 60 * 1000)
        }
      ],
      attachments: [
        {
          id: 'a2',
          name: 'Competitor_Analysis.xlsx',
          type: 'document',
          url: '/files/competitor_analysis.xlsx',
          size: 2048000,
          uploadedBy: 'Віктор Мельник',
          uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
        }
      ],
      timeSpent: 420, // 7 годин
      estimatedTime: 300, // 5 годин
      progress: 90,
      dependencies: [],
      subtasks: [
        { id: 'st9', title: 'Зібрати дані конкурентів', completed: true },
        { id: 'st10', title: 'Проаналізувати стратегії', completed: true },
        { id: 'st11', title: 'Створити звіт', completed: true },
        { id: 'st12', title: 'Підготувати рекомендації', completed: false }
      ],
      watchers: ['1', '2', '3']
    }
  ])

  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    assigneeId: '',
    assignee: '',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    priority: 'medium' as Task['priority'],
    status: 'todo' as Task['status'],
    tags: [] as string[],
  })

  // Синхронізація з Workspace (localStorage)
  useEffect(() => {
    if (workspace?.tasks) {
      // Конвертація полів дат, якщо прийшли як рядки
      const normalized = workspace.tasks.map((t: any) => ({
        ...t,
        dueDate: t?.dueDate ? new Date(t.dueDate) : new Date(),
        createdAt: t?.createdAt ? new Date(t.createdAt) : new Date(),
        updatedAt: t?.updatedAt ? new Date(t.updatedAt) : new Date(),
        assignee: t?.assignee || (() => {
          const u = users.find((x: any) => x.id === t.assigneeId)
          return u ? (u.name || u.email) : ''
        })(),
        assigneeAvatar: '/api/placeholder/32/32',
        tags: Array.isArray(t.tags) ? t.tags : [],
        attachments: Array.isArray(t.attachments) ? t.attachments : [],
        subtasks: Array.isArray(t.subtasks) ? t.subtasks : [],
        comments: Array.isArray(t.comments)
          ? t.comments.map((c: any) => ({
              id: c.id,
              author: c.author || c.authorName || 'Користувач',
              authorId: c.authorId || '',
              authorAvatar: '/api/placeholder/32/32',
              content: c.content || c.text || '',
              timestamp: c.timestamp ? new Date(c.timestamp) : (c.createdAt ? new Date(c.createdAt) : new Date()),
            }))
          : [],
      })) as Task[]
      setTasks(normalized)
    }
  }, [workspace?.tasks])

  // Фільтрація задач
  useEffect(() => {
    let filtered = tasks

    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter)
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter)
    }

    if (assigneeFilter !== 'all') {
      filtered = filtered.filter(task => task.assigneeId === assigneeFilter)
    }

    setFilteredTasks(filtered)
  }, [tasks, searchQuery, statusFilter, priorityFilter, assigneeFilter])

  const getStatusColor = (status: string) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo': return <Clock className="h-4 w-4" />
      case 'in_progress': return <TrendingUp className="h-4 w-4" />
      case 'review': return <Eye className="h-4 w-4" />
      case 'done': return <CheckCircle className="h-4 w-4" />
      case 'blocked': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}г ${mins}хв`
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setShowTaskModal(true)
  }

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedTask) return

    // миттєво оновлюємо локальний стан
    setTasks(prev => prev.map(task =>
      task.id === selectedTask.id
        ? { ...task, comments: [...(task.comments || []), {
            id: Date.now().toString(),
            author: currentUser,
            authorId: currentUserId,
            authorAvatar: '/api/placeholder/32/32',
            content: newComment,
            timestamp: new Date()
          } as any] }
        : task
    ))

    // зберігаємо в localStorage через DataProvider
    addCommentToTask(selectedTask.id, newComment)

    setNewComment('')
  }

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, status: newStatus, updatedAt: new Date() }
        : task
    ))
    updateTask(taskId, { status: newStatus })
  }

  const handleProgressUpdate = (taskId: string, progress: number) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, progress, updatedAt: new Date() }
        : task
    ))
  }

  const handleCreateTask = async (data: { title: string; description: string; assignee: string; assigneeId: string; dueDate: Date; priority: Task['priority']; status: Task['status']; tags: string[] }) => {
    const created = await addTask({
      title: data.title,
      description: data.description,
      assigneeId: data.assigneeId,
      dueDate: data.dueDate,
      status: data.status,
      priority: data.priority,
    })
    setTasks(prev => [...prev, {
      ...(created as any),
      assignee: data.assignee,
      assigneeAvatar: '/api/placeholder/32/32',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: data.tags,
      comments: [],
      attachments: [],
      timeSpent: 0,
      estimatedTime: 60,
      progress: 0,
      dependencies: [],
      subtasks: [],
      watchers: user ? [user.id] : [],
    }])
  }

  return (
    <div className="space-y-6">
      {/* Header з статистикою */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Управління задачами
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {tasks.length} задач • {tasks.filter(t => t.status === 'done').length} завершено
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Нова задача</span>
          </button>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {tasks.filter(t => t.status === 'todo').length}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">Очікують</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {tasks.filter(t => t.status === 'in_progress').length}
            </div>
            <div className="text-sm text-yellow-600 dark:text-yellow-400">В роботі</div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {tasks.filter(t => t.status === 'review').length}
            </div>
            <div className="text-sm text-purple-600 dark:text-purple-400">На перевірці</div>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {tasks.filter(t => t.status === 'done').length}
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">Завершено</div>
          </div>
        </div>
      </div>

      {/* Фільтри */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Пошук задач..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">Всі статуси</option>
            <option value="todo">Очікують</option>
            <option value="in_progress">В роботі</option>
            <option value="review">На перевірці</option>
            <option value="done">Завершено</option>
            <option value="blocked">Заблоковано</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">Всі пріоритети</option>
            <option value="low">Низький</option>
            <option value="medium">Середній</option>
            <option value="high">Високий</option>
            <option value="critical">Критичний</option>
          </select>
        </div>
      </div>

      {/* Список задач */}
      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const commentsCount = Array.isArray(task.comments) ? task.comments.length : 0
          const attachmentsCount = Array.isArray(task.attachments) ? task.attachments.length : 0
          const subtasks = Array.isArray(task.subtasks) ? task.subtasks : []
          const tags = Array.isArray(task.tags) ? task.tags : []
          return (
            <div
              key={task.id}
              onClick={() => handleTaskClick(task)}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {task.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                        {task.status === 'todo' && 'Очікує'}
                        {task.status === 'in_progress' && 'В роботі'}
                        {task.status === 'review' && 'Перевірка'}
                        {task.status === 'done' && 'Завершено'}
                        {task.status === 'blocked' && 'Заблоковано'}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority === 'low' && 'Низький'}
                        {task.priority === 'medium' && 'Середній'}
                        {task.priority === 'high' && 'Високий'}
                        {task.priority === 'critical' && 'Критичний'}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {task.description}
                  </p>

                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{task.assignee}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>До {task.dueDate.toLocaleDateString('uk-UA')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatTime(task.timeSpent || 0)} / {formatTime(task.estimatedTime || 0)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{commentsCount}</span>
                    </div>
                    {attachmentsCount > 0 && (
                      <div className="flex items-center space-x-1 text-gray-400">
                        <Paperclip className="h-4 w-4" />
                        <span className="text-xs">{attachmentsCount}</span>
                      </div>
                    )}
                  </div>

                  {/* Прогрес */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Прогрес</span>
                      <span className="text-gray-900 dark:text-white font-medium">{(task.progress || 0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${task.progress || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Підзадачі */}
                  {subtasks.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center justify_between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Підзадачі</span>
                        <span className="text-gray-900 dark:text-white">
                          {subtasks.filter(st => st.completed).length}/{subtasks.length}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {subtasks.slice(0, 3).map((subtask) => (
                          <div key={subtask.id} className="flex items-center space-x-2">
                            <CheckCircle className={`h-4 w-4 ${subtask.completed ? 'text-green-500' : 'text-gray-400'}`} />
                            <span className={`text-sm ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                              {subtask.title}
                            </span>
                          </div>
                        ))}
                        {subtasks.length > 3 && (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            +{subtasks.length - 3} ще
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Теги */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text_gray-600 dark:text-gray-400 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {attachmentsCount > 0 && (
                    <div className="flex items-center space-x-1 text-gray-400">
                      <Paperclip className="h-4 w-4" />
                      <span className="text-xs">{attachmentsCount}</span>
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteTask(task.id)
                      setTasks(prev => prev.filter(t => t.id !== task.id))
                    }}
                    className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    title="Видалити"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Модаль створення задачі */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Нова задача</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Назва</label>
                <input
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Коротка назва задачі"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Опис</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Виконавець</label>
                  <select
                    value={createForm.assigneeId}
                    onChange={(e) => {
                      const selected = users.find((u: any) => u.id === e.target.value)
                      setCreateForm({ ...createForm, assigneeId: e.target.value, assignee: selected ? (selected.name || selected.email) : '' })
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">— Обрати —</option>
                    {users.map((u: any) => (
                      <option key={u.id} value={u.id}>{u.name || u.email}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Дедлайн</label>
                  <input
                    type="date"
                    value={createForm.dueDate.toISOString().split('T')[0]}
                    onChange={(e) => setCreateForm({ ...createForm, dueDate: new Date(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Статус</label>
                  <select
                    value={createForm.status}
                    onChange={(e) => setCreateForm({ ...createForm, status: e.target.value as Task['status'] })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="todo">Очікує</option>
                    <option value="in_progress">В роботі</option>
                    <option value="review">Перевірка</option>
                    <option value="done">Завершено</option>
                    <option value="blocked">Заблоковано</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Пріоритет</label>
                  <select
                    value={createForm.priority}
                    onChange={(e) => setCreateForm({ ...createForm, priority: e.target.value as Task['priority'] })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="low">Низький</option>
                    <option value="medium">Середній</option>
                    <option value="high">Високий</option>
                    <option value="critical">Критичний</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end space-x-3">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                Скасувати
              </button>
              <button
                onClick={async () => {
                  await handleCreateTask(createForm)
                  setShowCreateModal(false)
                  setCreateForm({ title: '', description: '', assigneeId: '', assignee: '', dueDate: new Date(Date.now() + 7*24*60*60*1000), priority: 'medium', status: 'todo', tags: [] })
                }}
                disabled={!createForm.title.trim() || !createForm.assigneeId}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg"
              >
                Створити
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модаль перегляду задачі */}
      {showTaskModal && selectedTask && (() => {
        const sComments = Array.isArray(selectedTask.comments) ? selectedTask.comments : []
        const sSubtasks = Array.isArray(selectedTask.subtasks) ? selectedTask.subtasks : []
        return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedTask.title}
                </h2>
                <button
                  onClick={() => setShowTaskModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Опис */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Опис</h3>
                <p className="text-gray-600 dark:text-gray-400">{selectedTask.description}</p>
              </div>

              {/* Деталі */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Деталі</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Статус:</span>
                      <select
                        value={selectedTask.status}
                        onChange={(e) => handleStatusChange(selectedTask.id, e.target.value as Task['status'])}
                        className="text-gray-900 dark:text-white bg-transparent border-none focus:ring-0"
                      >
                        <option value="todo">Очікує</option>
                        <option value="in_progress">В роботі</option>
                        <option value="review">Перевірка</option>
                        <option value="done">Завершено</option>
                        <option value="blocked">Заблоковано</option>
                      </select>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Призначено:</span>
                      <span className="text-gray-900 dark:text-white">{selectedTask.assignee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Дедлайн:</span>
                      <span className="text-gray-900 dark:text-white">
                        {selectedTask.dueDate.toLocaleDateString('uk-UA')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Час:</span>
                      <span className="text-gray-900 dark:text-white">
                        {formatTime(selectedTask.timeSpent || 0)} / {formatTime(selectedTask.estimatedTime || 0)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Прогрес</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Загальний прогрес</span>
                        <span className="text-gray-900 dark:text-white">{(selectedTask.progress || 0)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={selectedTask.progress || 0}
                        onChange={(e) => handleProgressUpdate(selectedTask.id, parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    {sSubtasks.length > 0 && (
                      <div>
                        <div className="flex justify_between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">Підзадачі</span>
                          <span className="text-gray-900 dark:text-white">
                            {sSubtasks.filter(st => st.completed).length}/{sSubtasks.length}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {sSubtasks.map((subtask) => (
                            <div key={subtask.id} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={subtask.completed}
                                onChange={() => {}}
                                className="rounded"
                              />
                              <span className={`text-sm ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                                {subtask.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Коментарі */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Коментарі ({sComments.length})
                </h3>
                <div className="space-y-4 mb-4">
                  {sComments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <img
                        src={comment.authorAvatar}
                        alt={comment.author}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {comment.author}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {comment.timestamp.toLocaleString('uk-UA')}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Додати коментар..."
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    Додати
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        )})()}
    </div>
  )
} 