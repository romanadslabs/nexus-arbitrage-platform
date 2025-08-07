'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useData } from '@/components/providers/DataProvider'
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
  attachments?: any[]
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

export default function WorkspaceChatPage() {
  const { workspace, addChatMessage, addReaction, removeReaction } = useData()
  const { user } = useAuth()
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState<string>('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [replyToMessage, setReplyToMessage] = useState<ChatMessage | null>(null)
  const [showTaskCreator, setShowTaskCreator] = useState(false)
  const [taskCreatorMessage, setTaskCreatorMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
    if (!user) return
    
    const message = workspace?.chat.find(m => m.id === messageId)
    const hasReaction = message?.reactions?.some(r => 
      r.emoji === emoji && r.userIds.includes(user.id)
    )

    if (hasReaction) {
      await removeReaction(messageId, emoji, user.id)
    } else {
      await addReaction(messageId, emoji, user.id)
    }
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
    return workspace?.chat.filter(message => message.channelId === channelId) || []
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
            <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Users size={16} />
              Команда
            </h4>
            <div className="space-y-1">
              {workspace.team.map((member) => (
                <div key={member.id} className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">{member.name}</span>
                  {member.role === 'leader' && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-1 rounded">Лідер</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col">
          {/* Channel header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Hash size={20} className="text-gray-500" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {currentChannel?.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {currentChannel?.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Users size={16} />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Settings size={16} />
              </button>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {channelMessages.length > 0 ? (
              channelMessages.map((message) => (
                <div key={message.id} className="group">
                  <div className={`flex ${message.authorId === user?.id ? 'justify-end' : 'justify-start'}`}>
                    <div className="max-w-xs lg:max-w-md">
                      {replyToMessage && replyToMessage.id === message.id && (
                        <div className="text-xs text-blue-500 mb-1">Відповідає на повідомлення</div>
                      )}
                      
                      <div
                        className={`px-4 py-2 rounded-lg relative ${
                          message.isSystem
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-center mx-auto'
                            : message.authorId === user?.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        }`}
                      >
                        {!message.isSystem && message.authorId !== user?.id && (
                          <div className="flex items-center gap-2 mb-1">
                            <User size={12} className="text-gray-500" />
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                              {message.authorName}
                            </span>
                          </div>
                        )}
                        
                        <p className="text-sm">{message.text}</p>
                        
                        {/* Reactions */}
                        {message.reactions && message.reactions.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {message.reactions.map((reaction, index) => (
                              <button
                                key={index}
                                onClick={() => handleReaction(message.id, reaction.emoji)}
                                className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                                  reaction.userIds.includes(user?.id || '')
                                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                                    : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                {reaction.emoji} {reaction.userIds.length}
                              </button>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <Clock size={10} className="text-gray-400" />
                          <span className="text-xs text-gray-400">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Message actions */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 mt-1">
                        <button
                          onClick={() => setReplyToMessage(message)}
                          className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1"
                        >
                          Відповісти
                        </button>
                        <button
                          onClick={() => {
                            setTaskCreatorMessage(message.text)
                            setShowTaskCreator(true)
                          }}
                          className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1 flex items-center gap-1"
                        >
                          <CheckCircle size={12} />
                          Задача
                        </button>
                        <button
                          onClick={() => handleReaction(message.id, '👍')}
                          className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1"
                        >
                          👍
                        </button>
                        <button
                          onClick={() => handleReaction(message.id, '❤️')}
                          className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1"
                        >
                          ❤️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                <p>Почніть розмову в каналі {currentChannel?.name}!</p>
                <p className="text-sm mt-1">Напишіть перше повідомлення нижче</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Reply indicator */}
          {replyToMessage && (
            <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  Відповідаєте на повідомлення від {replyToMessage.authorName}
                </div>
                <button
                  onClick={() => setReplyToMessage(null)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Message input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Напишіть повідомлення в #${currentChannel?.name}...`}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white pr-20"
                  disabled={isLoading}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                  >
                    <Smile size={16} />
                  </button>
                  <button
                    type="button"
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                  >
                    <Paperclip size={16} />
                  </button>
                  <button
                    type="button"
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                  >
                    <AtSign size={16} />
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={!newMessage.trim() || isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send size={16} />
                {isLoading ? 'Відправка...' : 'Надіслати'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Task Creator Modal */}
      <TaskCreator
        isOpen={showTaskCreator}
        onClose={() => {
          setShowTaskCreator(false)
          setTaskCreatorMessage('')
        }}
        messageText={taskCreatorMessage}
      />
    </ModernLayout>
  )
} 