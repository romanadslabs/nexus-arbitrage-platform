'use client'

import React, { useState, useEffect, useRef } from 'react'
// import { useData } from '@/components/providers/DataProvider'
import { useAuth } from '@/components/providers/AuthProvider'
import ModernLayout from '@/components/layout/ModernLayout'
import TaskCreator from '@/components/chat/TaskCreator'
import { 
  Send, 
  User, 
  Clock, 
  MoreHorizontal, 
  Hash, 
  Plus, 
  Settings, 
  Smile,
  Paperclip,
  AtSign,
  CheckCircle,
  MessageSquare,
  Users,
  TrendingUp
} from 'lucide-react'

interface ChatMessage {
  id: string
  text: string
  authorId: string
  authorName: string
  timestamp: string
  isSystem?: boolean
  channelId: string
  mentions?: string[]
  reactions?: any[]
  replyTo?: string
}

interface ChatChannel {
  id: string
  name: string
  description: string
  type: 'work' | 'general' | 'private'
  members: string[]
  isActive: boolean
  createdAt: Date
  lastMessageAt?: Date
}

interface Workspace {
  id: string
  name: string
  description: string
  ownerId: string
  team: any[]
  tasks: any[]
  activity: any[]
  chat: ChatMessage[]
  channels: ChatChannel[]
  createdAt: Date
}

export default function WorkspaceChatPage() {
  const { user } = useAuth()
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState<string>('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [replyToMessage, setReplyToMessage] = useState<ChatMessage | null>(null)
  const [showTaskCreator, setShowTaskCreator] = useState(false)
  const [taskCreatorMessage, setTaskCreatorMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Завантаження workspace з localStorage
  useEffect(() => {
    const savedWorkspace = localStorage.getItem('nexus_workspace')
    if (savedWorkspace) {
      try {
        const parsed = JSON.parse(savedWorkspace)
        // Ensure channels array exists
        if (!parsed.channels) {
          parsed.channels = [
            {
              id: 'channel_google_ads',
              name: '🔍 Робота з Google аккаунтами',
              description: 'Робота з Google аккаунтами та запуск реклами',
              type: 'work',
              members: [user?.id || 'user_1'],
              isActive: true,
              createdAt: new Date(),
            },
            {
              id: 'channel_work_moments',
              name: '💼 Робочі моменти',
              description: 'Обговорення робочих питань та координація',
              type: 'work',
              members: [user?.id || 'user_1'],
              isActive: true,
              createdAt: new Date(),
            },
            {
              id: 'channel_improvements',
              name: '🚀 Покращення сайту',
              description: 'Обговорення покращень та нових функцій',
              type: 'work',
              members: [user?.id || 'user_1'],
              isActive: true,
              createdAt: new Date(),
            },
          ]
        }
        setWorkspace(parsed)
      } catch (error) {
        console.error('Error parsing workspace:', error)
        initializeWorkspace()
      }
    } else {
      initializeWorkspace()
    }
  }, [user])

  const initializeWorkspace = () => {
    const newWorkspace: Workspace = {
      id: 'ws_main',
      name: 'Основний робочий простір',
      description: 'Головний простір для командної роботи',
      ownerId: user?.id || 'user_1',
      team: [],
      tasks: [],
      activity: [],
      chat: [],
      channels: [
        {
          id: 'channel_google_ads',
          name: '🔍 Робота з Google аккаунтами',
          description: 'Робота з Google аккаунтами та запуск реклами',
          type: 'work',
          members: [user?.id || 'user_1'],
          isActive: true,
          createdAt: new Date(),
        },
        {
          id: 'channel_work_moments',
          name: '💼 Робочі моменти',
          description: 'Обговорення робочих питань та координація',
          type: 'work',
          members: [user?.id || 'user_1'],
          isActive: true,
          createdAt: new Date(),
        },
        {
          id: 'channel_improvements',
          name: '🚀 Покращення сайту',
          description: 'Обговорення покращень та нових функцій',
          type: 'work',
          members: [user?.id || 'user_1'],
          isActive: true,
          createdAt: new Date(),
        },
      ],
      createdAt: new Date()
    }
    setWorkspace(newWorkspace)
    localStorage.setItem('nexus_workspace', JSON.stringify(newWorkspace))
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (workspace?.channels && workspace.channels.length > 0 && !selectedChannel) {
      setSelectedChannel(workspace.channels[0].id)
    }
  }, [workspace, selectedChannel])

  useEffect(() => {
    scrollToBottom()
  }, [workspace?.chat, selectedChannel])

  const addChatMessage = async (messageData: { text: string; authorId: string; authorName: string; channelId: string }) => {
    if (!workspace) return
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: messageData.text,
      authorId: messageData.authorId,
      authorName: messageData.authorName,
      timestamp: new Date().toISOString(),
      channelId: messageData.channelId
    }
    
    const currentChat = Array.isArray(workspace.chat) ? workspace.chat : []
    
    const updatedWorkspace = {
      ...workspace,
      chat: [...currentChat, newMessage],
      channels: workspace.channels.map(channel => 
        channel.id === messageData.channelId 
          ? { ...channel, lastMessageAt: new Date() }
          : channel
      )
    }
    
    setWorkspace(updatedWorkspace)
    localStorage.setItem('nexus_workspace', JSON.stringify(updatedWorkspace))
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user || !workspace || !selectedChannel) return

    setIsLoading(true)
    try {
      await addChatMessage({
        text: newMessage.trim(),
        authorId: user.id,
        authorName: user.name || user.email,
        channelId: selectedChannel
      })
      setNewMessage('')
      setReplyToMessage(null)
    } catch (error) {
      console.error('Помилка відправки повідомлення:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReaction = async (messageId: string, emoji: string) => {
    // Implementation for reactions
    console.log('Reaction:', messageId, emoji)
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString('uk-UA', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    } else {
      return date.toLocaleDateString('uk-UA', { 
        day: '2-digit', 
        month: '2-digit',
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }
  }

  const getChannelMessages = (channelId: string) => {
    if (!workspace?.chat) return []
    return workspace.chat.filter(message => message.channelId === channelId)
  }

  const getCurrentChannel = () => {
    return workspace?.channels.find(channel => channel.id === selectedChannel)
  }

  const getUnreadCount = (channelId: string) => {
    const messages = getChannelMessages(channelId)
    const lastMessage = messages[messages.length - 1]
    if (!lastMessage) return 0
    
    // Simple unread count - in real app you'd track read status
    return messages.length
  }

  if (!workspace) {
    return (
      <ModernLayout title="Командний чат" description="Спілкуйтесь з командою в реальному часі.">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Завантаження чату...</div>
        </div>
      </ModernLayout>
    )
  }

  const currentChannel = getCurrentChannel()
  const channelMessages = getChannelMessages(selectedChannel)

  return (
    <ModernLayout title="Командний чат" description="Спілкуйтесь з командою в реальному часі.">
      <div className="flex h-[calc(100vh-200px)] bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {/* Sidebar with channels */}
        <div className="w-64 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <MessageSquare size={20} />
              Канали
            </h3>
          </div>

          {/* Channels list */}
          <div className="p-2">
            {workspace.channels.map((channel) => (
              <div
                key={channel.id}
                onClick={() => setSelectedChannel(channel.id)}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                  selectedChannel === channel.id
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Hash size={16} className="text-gray-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{channel.name}</div>
                    <div className="text-xs text-gray-500 truncate">{channel.description}</div>
                  </div>
                </div>
                {getUnreadCount(channel.id) > 0 && (
                  <div className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {getUnreadCount(channel.id)}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Team members */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-2 flex items-center gap-2">
              <Users size={16} />
              Команда
            </h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">{user?.name || 'Ви'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col">
          {/* Channel header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  {currentChannel?.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {currentChannel?.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg">
                  <Settings size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {channelMessages.map((message) => (
              <div key={message.id} className="flex gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {message.authorName.charAt(0).toUpperCase()}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900 dark:text-white text-sm">
                      {message.authorName}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="text-gray-700 dark:text-gray-300 text-sm">
                    {message.text}
                  </div>
                  
                  {/* Message actions */}
                  <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleReaction(message.id, '👍')}
                      className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      <Smile size={14} />
                    </button>
                    <button
                      onClick={() => setReplyToMessage(message)}
                      className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      Відповісти
                    </button>
                    <button
                      onClick={() => {
                        setTaskCreatorMessage(message.text)
                        setShowTaskCreator(true)
                      }}
                      className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      Створити задачу
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            {replyToMessage && (
              <div className="mb-3 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Відповідь на повідомлення {replyToMessage.authorName}
                  </span>
                  <button
                    onClick={() => setReplyToMessage(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    ✕
                  </button>
                </div>
                <div className="text-gray-500 dark:text-gray-400 truncate">
                  {replyToMessage.text}
                </div>
              </div>
            )}
            
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Написати в ${currentChannel?.name}...`}
                  className="w-full px-4 py-2 pr-24 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={isLoading}
                />
                
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  <button
                    type="button"
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Paperclip size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Smile size={16} />
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={!newMessage.trim() || isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Task Creator Modal */}
      {showTaskCreator && (
        <TaskCreator
          isOpen={showTaskCreator}
          onClose={() => {
            setShowTaskCreator(false)
            setTaskCreatorMessage('')
          }}
          messageText={taskCreatorMessage}
        />
      )}
    </ModernLayout>
  )
} 