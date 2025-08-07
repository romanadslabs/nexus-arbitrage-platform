'use client'

import React, { useState } from 'react'
import { useData } from '@/components/providers/DataProvider'
import { Task, TeamMember } from '@/components/providers/DataProvider'
import { Plus, Trash2, Edit, MoreHorizontal, Clock, User, AlertTriangle } from 'lucide-react'
import ModernLayout from '@/components/layout/ModernLayout'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Sortable Task Card Component
const SortableTaskCard = ({ task, onEdit, onDelete, team }: { task: Task, onEdit: (task: Task) => void, onDelete: (taskId: string) => void, team: TeamMember[] }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/20'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200'
      case 'in_progress': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
      case 'done': return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
    }
  }

  const assignee = team.find(member => member.id === task.assigneeId)

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border cursor-move ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-medium text-gray-900 dark:text-white">{task.title}</h4>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(task); }}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
            className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
        {task.description}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {assignee && (
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <User size={12} />
              <span>{assignee.name}</span>
            </div>
          )}
          {task.dueDate && (
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <Clock size={12} />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
            {task.priority === 'high' ? 'Високий' : task.priority === 'medium' ? 'Середній' : 'Низький'}
          </span>
          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
            {task.status === 'todo' ? 'До виконання' : task.status === 'in_progress' ? 'В роботі' : 'Завершено'}
          </span>
        </div>
      </div>
    </div>
  )
}

// Task Modal Component
const TaskModal = ({ isOpen, onClose, onSave, task, team }: { isOpen: boolean, onClose: () => void, onSave: (taskData: any) => void, task: Task | null, team: TeamMember[] }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigneeId: '',
    dueDate: '',
    priority: 'medium',
    status: 'todo'
  })

  React.useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        assigneeId: task.assigneeId || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        priority: task.priority,
        status: task.status
      })
    } else {
      setFormData({
        title: '',
        description: '',
        assigneeId: '',
        dueDate: '',
        priority: 'medium',
        status: 'todo'
      })
    }
  }, [task])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      id: task?.id || Date.now().toString(),
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {task ? 'Редагувати задачу' : 'Створити задачу'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Назва</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Опис</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Виконавець</label>
            <select
              value={formData.assigneeId}
              onChange={(e) => setFormData({...formData, assigneeId: e.target.value})}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Виберіть виконавця</option>
              {team.map(member => (
                <option key={member.id} value={member.id}>{member.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Дата завершення</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Пріоритет</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value})}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="low">Низький</option>
              <option value="medium">Середній</option>
              <option value="high">Високий</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Статус</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="todo">До виконання</option>
              <option value="in_progress">В роботі</option>
              <option value="done">Завершено</option>
            </select>
          </div>
          
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Скасувати
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {task ? 'Оновити' : 'Створити'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Main Page Component
export default function WorkspaceTasksPage() {
  const { workspace, addTask, updateTask, deleteTask } = useData()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const activeTask = workspace?.tasks.find(task => task.id === active.id)
      if (activeTask && over) {
        updateTask(activeTask.id, { status: over.id as Task['status'] })
      }
    }
  }

  const handleSaveTask = (taskData: any) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData)
    } else {
      addTask(taskData)
    }
  }

  if (!workspace) return <div>Завантаження...</div>

  const columns = {
    todo: workspace.tasks.filter(t => t.status === 'todo'),
    in_progress: workspace.tasks.filter(t => t.status === 'in_progress'),
    done: workspace.tasks.filter(t => t.status === 'done'),
  }

  return (
    <ModernLayout title="Задачі" description="Керуйте задачами вашої команди за допомогою Kanban-дошки.">
      <div className="flex justify-end mb-4">
        <button 
          onClick={() => { setEditingTask(null); setIsModalOpen(true); }} 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
        >
          <Plus size={18}/> Створити задачу
        </button>
      </div>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(Object.keys(columns) as Array<keyof typeof columns>).map(status => (
            <div key={status} className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-4">
              <h3 className="font-semibold mb-4 capitalize">
                {status === 'todo' ? 'До виконання' : status === 'in_progress' ? 'В роботі' : 'Завершено'} ({columns[status].length})
              </h3>
              <SortableContext
                items={columns[status].map(task => task.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3 min-h-[200px]">
                  {columns[status].map((task) => (
                    <SortableTaskCard
                      key={task.id}
                      task={task}
                      onEdit={(task) => {setEditingTask(task); setIsModalOpen(true);}}
                      onDelete={deleteTask}
                      team={workspace.team}
                    />
                  ))}
                </div>
              </SortableContext>
            </div>
          ))}
        </div>
      </DndContext>
      
      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveTask} 
        task={editingTask} 
        team={workspace.team}
      />
    </ModernLayout>
  )
} 