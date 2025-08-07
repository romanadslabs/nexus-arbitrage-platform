'use client'

import React, { useState, useEffect, useRef } from 'react'
import { User, Send, Paperclip, Smile, MoreHorizontal, Clock, FileText, Image, Video, Download, Eye, X } from 'lucide-react'

interface ChatMessage {
  id: string
  author: string
  authorId: string
  content: string
  timestamp: Date
  type: 'message' | 'announcement' | 'task' | 'system' | 'file'
  attachments?: ChatAttachment[]
  reactions?: ChatReaction[]
  edited?: boolean
  replyTo?: string
}

interface ChatAttachment {
  id: string
  name: string
  type: 'image' | 'document' | 'video' | 'audio'
  url: string
  size: number
  thumbnail?: string
}

interface ChatReaction {
  emoji: string
  users: string[]
}

interface TeamChatProps {
  workspaceId: string
  currentUser: string
  currentUserId?: string
}

export default function TeamChat({ workspaceId, currentUser, currentUserId = '1' }: TeamChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      author: 'Олександр Петренко',
      authorId: '1',
      content: 'Вітаю команду! Сьогодні починаємо новий проект з Facebook реклами. Всі деталі в прикріпленому файлі.',
      timestamp: new Date(Date.now() - 3600000),
      type: 'announcement',
      attachments: [
        {
          id: 'att1',
          name: 'Проект_Facebook_Реклама.pdf',
          type: 'document',
          url: '/files/project-facebook.pdf',
          size: 2048576
        }
      ],
      reactions: [
        { emoji: '👍', users: ['2', '3', '4'] },
        { emoji: '🚀', users: ['5'] }
      ]
    },
    {
      id: '2',
      author: 'Марія Іваненко',
      authorId: '2',
      content: 'Завершила налаштування перших 5 аккаунтів. Ось скріншоти результатів:',
      timestamp: new Date(Date.now() - 1800000),
      type: 'task',
      attachments: [
        {
          id: 'att2',
          name: 'account_setup_1.png',
          type: 'image',
          url: '/files/account_setup_1.png',
          size: 512000,
          thumbnail: '/files/thumbnails/account_setup_1.png'
        },
        {
          id: 'att3',
          name: 'account_setup_2.png',
          type: 'image',
          url: '/files/account_setup_2.png',
          size: 487000,
          thumbnail: '/files/thumbnails/account_setup_2.png'
        }
      ],
      reactions: [
        { emoji: '✅', users: ['1', '3'] }
      ]
    },
    {
      id: '3',
      author: 'Дмитро Сидоренко',
      authorId: '3',
      content: 'Відмінно! Я перевірю їх зараз. Марія, чи всі аккаунти мають 2FA?',
      timestamp: new Date(Date.now() - 900000),
      type: 'message',
      replyTo: '2'
    },
    {
      id: '4',
      author: 'Марія Іваненко',
      authorId: '2',
      content: 'Так, всі налаштовані з 2FA та резервними кодами. Ось детальний звіт:',
      timestamp: new Date(Date.now() - 600000),
      type: 'message',
      replyTo: '3',
      attachments: [
        {
          id: 'att4',
          name: '2FA_Report.xlsx',
          type: 'document',
          url: '/files/2fa_report.xlsx',
          size: 156000
        }
      ]
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      author: currentUser,
      authorId: currentUserId,
      content: newMessage,
      timestamp: new Date(),
      type: 'message'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'announcement': return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
      case 'task': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
      case 'system': return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800'
      default: return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    }
  }

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'announcement': return '📢'
      case 'task': return '📋'
      case 'system': return '⚙️'
      default: return null
    }
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Командний чат
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {messages.length} повідомлень
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </div>
            ))}
          </div>
          <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <MoreHorizontal className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 p-3 rounded-lg border ${getMessageTypeColor(message.type)}`}
          >
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-gray-900 dark:text-white">
                  {message.author}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {message.timestamp.toLocaleTimeString('uk-UA')}
                </span>
                {getMessageTypeIcon(message.type) && (
                  <span className="text-sm">{getMessageTypeIcon(message.type)}</span>
                )}
                {message.type === 'announcement' && (
                  <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 text-xs rounded-full">
                    Оголошення
                  </span>
                )}
                {message.type === 'task' && (
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 text-xs rounded-full">
                    Задача
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {message.content}
              </p>
              {message.attachments && message.attachments.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {message.attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      {attachment.type === 'image' && <Image className="h-4 w-4 text-blue-500" />}
                      {attachment.type === 'document' && <FileText className="h-4 w-4 text-green-500" />}
                      {attachment.type === 'video' && <Video className="h-4 w-4 text-purple-500" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {attachment.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {(attachment.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                        <Download className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span>Хтось друкує...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Написати повідомлення..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>
          <div className="flex items-center space-x-1">
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <Paperclip className="h-4 w-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <Smile className="h-4 w-4" />
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}