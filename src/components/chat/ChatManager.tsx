'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/components/providers/AuthProvider'
import Button from '@/components/ui/Button'
import LoadingState from '@/components/ui/LoadingState'
import { 
  MessageSquare, 
  Send, 
  Plus, 
  Users, 
  Settings,
  MoreVertical,
  Smile,
  Paperclip,
  Mic,
  Phone,
  Video,
  Search,
  Filter,
  RefreshCw,
  Edit,
  Trash2,
  Heart,
  ThumbsUp,
  Clock,
  Check,
  CheckCheck
} from 'lucide-react'

interface ChatMessage {
  id: string
  content: string
  senderId: string
  senderName: string
  timestamp: Date
  reactions: { emoji: string; userId: string }[]
  isEdited: boolean
  attachments?: { type: 'image' | 'file'; url: string; name: string }[]
}

interface ChatWorkspace {
  id: string
  name: string
  description: string
  members: { id: string; name: string; role: string }[]
  lastMessage?: ChatMessage
  unreadCount: number
  isActive: boolean
}

export default function ChatManager() {
  const { user } = useAuth()
  const [workspaces, setWorkspaces] = useState<ChatWorkspace[]>([])
  const [currentWorkspace, setCurrentWorkspace] = useState<ChatWorkspace | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Форма для створення робочого простору
  const [workspaceForm, setWorkspaceForm] = useState({
    name: '',
    description: ''
  })

  // Мокові дані для тестування
  useEffect(() => {
    const mockWorkspaces: ChatWorkspace[] = [
      {
        id: 'workspace-1',
        name: 'Команда Alpha',
        description: 'Основна команда арбітражників',
        members: [
          { id: '1', name: 'Олександр Петренко', role: 'admin' },
          { id: '2', name: 'Марія Іваненко', role: 'leader' },
          { id: '3', name: 'Петро Сидоренко', role: 'farmer' }
        ],
        unreadCount: 3,
        isActive: true
      },
      {
        id: 'workspace-2',
        name: 'Проект Facebook',
        description: 'Проект з Facebook реклами',
        members: [
          { id: '1', name: 'Олександр Петренко', role: 'admin' },
          { id: '2', name: 'Марія Іваненко', role: 'leader' }
        ],
        unreadCount: 0,
        isActive: false
      }
    ]
    setWorkspaces(mockWorkspaces)
    setCurrentWorkspace(mockWorkspaces[0])
  }, [])

  // Мокові повідомлення
  useEffect(() => {
    if (currentWorkspace) {
      const mockMessages: ChatMessage[] = [
        {
          id: '1',
          content: 'Привіт команда! Як справи з новими аккаунтами?',
          senderId: '1',
          senderName: 'Олександр Петренко',
          timestamp: new Date(Date.now() - 3600000),
          reactions: [{ emoji: '👍', userId: '2' }],
          isEdited: false
        },
        {
          id: '2',
          content: 'Все добре! Додав 5 нових аккаунтів, всі працюють стабільно.',
          senderId: '2',
          senderName: 'Марія Іваненко',
          timestamp: new Date(Date.now() - 1800000),
          reactions: [],
          isEdited: false
        },
        {
          id: '3',
          content: 'Чудово! Петро, як справи з фармінгом?',
          senderId: '1',
          senderName: 'Олександр Петренко',
          timestamp: new Date(Date.now() - 900000),
          reactions: [],
          isEdited: false
        },
        {
          id: '4',
          content: 'День 2 завершений, всі аккаунти в нормі. Завтра переходжу на день 3.',
          senderId: '3',
          senderName: 'Петро Сидоренко',
          timestamp: new Date(Date.now() - 300000),
          reactions: [{ emoji: '❤️', userId: '1' }, { emoji: '👍', userId: '2' }],
          isEdited: false
        }
      ]
      setMessages(mockMessages)
    }
  }, [currentWorkspace])

  // Автопрокрутка до останнього повідомлення
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!newMessage.trim() || !currentWorkspace || !user) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: user.id,
      senderName: user.name,
      timestamp: new Date(),
      reactions: [],
      isEdited: false
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
  }

  const addReaction = (messageId: string, emoji: string) => {
    if (!user) return

    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions.find(r => r.userId === user.id && r.emoji === emoji)
        if (existingReaction) {
          return {
            ...msg,
            reactions: msg.reactions.filter(r => !(r.userId === user.id && r.emoji === emoji))
          }
        } else {
          return {
            ...msg,
            reactions: [...msg.reactions, { emoji, userId: user.id }]
          }
        }
      }
      return msg
    }))
  }

  const createWorkspace = () => {
    if (!workspaceForm.name.trim()) return

    const newWorkspace: ChatWorkspace = {
      id: Date.now().toString(),
      name: workspaceForm.name,
      description: workspaceForm.description,
      members: [{ id: user?.id || '1', name: user?.name || 'User', role: 'admin' }],
      unreadCount: 0,
      isActive: false
    }

    setWorkspaces(prev => [...prev, newWorkspace])
    setCurrentWorkspace(newWorkspace)
    setShowCreateWorkspace(false)
    setWorkspaceForm({ name: '', description: '' })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return 'Сьогодні'
    if (days === 1) return 'Вчора'
    if (days < 7) return `${days} днів тому`
    return date.toLocaleDateString('uk-UA')
  }

  if (isLoading) {
    return <LoadingState message="Завантаження чату..." />
  }

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Бічна панель з робочими просторами */}
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Робочі простори
            </h2>
            <Button
              onClick={() => setShowCreateWorkspace(true)}
              variant="outline"
              icon={Plus}
              size="sm"
            >
              Створити
            </Button>
          </div>
        </div>

        {/* Список робочих просторів */}
        <div className="flex-1 overflow-y-auto">
          {workspaces.map((workspace) => (
            <div
              key={workspace.id}
              onClick={() => setCurrentWorkspace(workspace)}
              className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors ${
                currentWorkspace?.id === workspace.id
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {workspace.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {workspace.description}
                  </p>
                  <div className="flex items-center mt-2">
                    <div className="flex -space-x-2">
                      {workspace.members.slice(0, 3).map((member) => (
                        <div
                          key={member.id}
                          className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white"
                        >
                          {member.name.charAt(0)}
                        </div>
                      ))}
                      {workspace.members.length > 3 && (
                        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-xs text-gray-600 dark:text-gray-300">
                          +{workspace.members.length - 3}
                        </div>
                      )}
                    </div>
                    {workspace.unreadCount > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                        {workspace.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
                {workspace.lastMessage && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                    {formatTime(workspace.lastMessage.timestamp)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Основна область чату */}
      <div className="flex-1 flex flex-col">
        {currentWorkspace ? (
          <>
            {/* Header чату */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                    {currentWorkspace.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {currentWorkspace.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {currentWorkspace.members.length} учасників
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" icon={Search} size="sm" />
                  <Button variant="outline" icon={Phone} size="sm" />
                  <Button variant="outline" icon={Video} size="sm" />
                  <Button variant="outline" icon={MoreVertical} size="sm" />
                </div>
              </div>
            </div>

            {/* Повідомлення */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => {
                const isOwnMessage = message.senderId === user?.id
                const showDate = index === 0 || 
                  formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp)

                return (
                  <div key={message.id}>
                    {showDate && (
                      <div className="text-center mb-4">
                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-3 py-1 rounded-full">
                          {formatDate(message.timestamp)}
                        </span>
                      </div>
                    )}
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                        {!isOwnMessage && (
                          <div className="flex items-center space-x-2 mb-1">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white">
                              {message.senderName.charAt(0)}
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {message.senderName}
                            </span>
                          </div>
                        )}
                        
                        <div className={`rounded-lg px-4 py-2 ${
                          isOwnMessage 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          
                          {/* Реакції */}
                          {message.reactions.length > 0 && (
                            <div className="flex items-center space-x-1 mt-2">
                              {message.reactions.map((reaction, idx) => (
                                <span
                                  key={idx}
                                  className="bg-gray-100 dark:bg-gray-600 text-xs px-2 py-1 rounded-full"
                                >
                                  {reaction.emoji}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className={`flex items-center space-x-2 mt-1 ${
                          isOwnMessage ? 'justify-end' : 'justify-start'
                        }`}>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTime(message.timestamp)}
                          </span>
                          {isOwnMessage && (
                            <CheckCheck className="w-3 h-3 text-blue-500" />
                          )}
                          {message.isEdited && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              (ред.)
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Кнопки реакцій */}
                      <div className={`flex items-center space-x-1 ${isOwnMessage ? 'order-1 mr-2' : 'order-2 ml-2'}`}>
                        <button
                          onClick={() => addReaction(message.id, '👍')}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          👍
                        </button>
                        <button
                          onClick={() => addReaction(message.id, '❤️')}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          ❤️
                        </button>
                        <button
                          onClick={() => addReaction(message.id, '😊')}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          😊
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Поле введення */}
            <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <Paperclip className="w-5 h-5 text-gray-500" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <Smile className="w-5 h-5 text-gray-500" />
                </button>
                <div className="flex-1">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Напишіть повідомлення..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <Mic className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Виберіть робочий простір
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Або створіть новий для початку спілкування
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Модальне вікно створення робочого простору */}
      {showCreateWorkspace && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Створити робочий простір</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Назва</label>
                <input
                  type="text"
                  value={workspaceForm.name}
                  onChange={(e) => setWorkspaceForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  placeholder="Назва робочого простору"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Опис</label>
                <textarea
                  value={workspaceForm.description}
                  onChange={(e) => setWorkspaceForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  rows={3}
                  placeholder="Опис робочого простору"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <Button
                onClick={() => setShowCreateWorkspace(false)}
                variant="outline"
                className="flex-1"
              >
                Скасувати
              </Button>
              <Button
                onClick={createWorkspace}
                variant="primary"
                className="flex-1"
              >
                Створити
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 