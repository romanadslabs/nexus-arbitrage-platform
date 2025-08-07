'use client'

import React, { useState, useEffect, useRef } from 'react'
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

    const comment: TaskComment = {
      id: Date.now().toString(),
      author: currentUser,
      authorId: currentUserId,
      authorAvatar: '/api/placeholder/32/32',
      content: newComment,
      timestamp: new Date()
    }

    setTasks(prev => prev.map(task =>
      task.id === selectedTask.id
        ? { ...task, comments: [...task.comments, comment] }
        : task
    ))

    setNewComment('')
  }

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, status: newStatus, updatedAt: new Date() }
        : task
    ))
  }

  const handleProgressUpdate = (taskId: string, progress: number) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, progress, updatedAt: new Date() }
        : task
    ))
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
        {filteredTasks.map((task) => (
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
                    <span>{formatTime(task.timeSpent)} / {formatTime(task.estimatedTime)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{task.comments.length}</span>
                  </div>
                </div>

                {/* Прогрес */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Прогрес</span>
                    <span className="text-gray-900 dark:text-white font-medium">{task.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>

                {/* Підзадачі */}
                {task.subtasks.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Підзадачі</span>
                      <span className="text-gray-900 dark:text-white">
                        {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {task.subtasks.slice(0, 3).map((subtask) => (
                        <div key={subtask.id} className="flex items-center space-x-2">
                          <CheckCircle className={`h-4 w-4 ${subtask.completed ? 'text-green-500' : 'text-gray-400'}`} />
                          <span className={`text-sm ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                            {subtask.title}
                          </span>
                        </div>
                      ))}
                      {task.subtasks.length > 3 && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          +{task.subtasks.length - 3} ще
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Теги */}
                {task.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {task.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 ml-4">
                {task.attachments.length > 0 && (
                  <div className="flex items-center space-x-1 text-gray-400">
                    <Paperclip className="h-4 w-4" />
                    <span className="text-xs">{task.attachments.length}</span>
                  </div>
                )}
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <MoreHorizontal className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Модаль перегляду задачі */}
      {showTaskModal && selectedTask && (
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
                        {formatTime(selectedTask.timeSpent)} / {formatTime(selectedTask.estimatedTime)}
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
                        <span className="text-gray-900 dark:text-white">{selectedTask.progress}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={selectedTask.progress}
                        onChange={(e) => handleProgressUpdate(selectedTask.id, parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Підзадачі</span>
                        <span className="text-gray-900 dark:text-white">
                          {selectedTask.subtasks.filter(st => st.completed).length}/{selectedTask.subtasks.length}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {selectedTask.subtasks.map((subtask) => (
                          <div key={subtask.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={subtask.completed}
                              onChange={() => {
                                // Логіка оновлення підзадачі
                              }}
                              className="rounded"
                            />
                            <span className={`text-sm ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                              {subtask.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Коментарі */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Коментарі ({selectedTask.comments.length})
                </h3>
                <div className="space-y-4 mb-4">
                  {selectedTask.comments.map((comment) => (
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
      )}
    </div>
  )
} 