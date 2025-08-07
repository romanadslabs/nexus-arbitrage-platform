'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, X, Minimize2, Maximize2, MessageCircle } from 'lucide-react'

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
  type?: 'text' | 'suggestion' | 'action'
  suggestions?: string[]
  action?: {
    type: 'navigate' | 'create' | 'export'
    label: string
    url?: string
    data?: any
  }
}

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Привіт! Я AI асистент Nexus. Чим можу допомогти?',
      sender: 'bot',
      timestamp: new Date(),
      type: 'suggestion',
      suggestions: [
        'Як створити нову кампанію?',
        'Показати статистику аккаунтів',
        'Допомога з налаштуваннями',
        'Згенерувати звіт'
      ]
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSendMessage = async (customMessage?: string) => {
    const messageContent = customMessage || inputValue.trim()
    if (!messageContent) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    if (!customMessage) {
      setInputValue('')
    }
    setIsTyping(true)

    // Симуляція відповіді AI
    setTimeout(() => {
      const botResponse = generateBotResponse(messageContent)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse.content,
        sender: 'bot',
        timestamp: new Date(),
        type: botResponse.type,
        suggestions: botResponse.suggestions,
        action: botResponse.action
      }
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 2000)
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const generateBotResponse = (userInput: string): {
    content: string
    type?: 'text' | 'suggestion' | 'action'
    suggestions?: string[]
    action?: {
      type: 'navigate' | 'create' | 'export'
      label: string
      url?: string
      data?: any
    }
  } => {
    const lowerInput = userInput.toLowerCase()
    
    // Базові відповіді на популярні запити
    if (lowerInput.includes('допомога') || lowerInput.includes('help')) {
      return {
        content: 'Я можу допомогти вам з:\n• Управлінням аккаунтами\n• Створенням кампаній\n• Аналітикою та звітами\n• Налаштуваннями системи\n\nЩо саме вас цікавить?',
        type: 'suggestion',
        suggestions: [
          'Як створити аккаунт?',
          'Як запустити кампанію?',
          'Показати звіти',
          'Налаштування системи'
        ]
      }
    }
    
    if (lowerInput.includes('аккаунт') || lowerInput.includes('account')) {
      return {
        content: 'Для управління аккаунтами:\n1. Перейдіть на вкладку "Аккаунти"\n2. Натисніть "Додати аккаунт"\n3. Заповніть необхідні поля\n4. Збережіть аккаунт\n\nПотрібна додаткова допомога?',
        type: 'action',
        action: {
          type: 'navigate',
          label: 'Перейти до аккаунтів',
          url: '/accounts'
        }
      }
    }
    
    if (lowerInput.includes('кампанія') || lowerInput.includes('campaign')) {
      return {
        content: 'Для створення кампанії:\n1. Перейдіть на вкладку "Кампанії"\n2. Натисніть "Створити кампанію"\n3. Виберіть аккаунт та оффер\n4. Встановіть бюджет та налаштування\n5. Запустіть кампанію\n\nЄ питання щодо налаштувань?',
        type: 'action',
        action: {
          type: 'navigate',
          label: 'Створити кампанію',
          url: '/campaigns'
        }
      }
    }
    
    if (lowerInput.includes('звіт') || lowerInput.includes('report')) {
      return {
        content: 'Звіти доступні на вкладці "Звіти та аналітика". Там ви можете:\n• Переглядати загальну статистику\n• Аналізувати продуктивність кампаній\n• Експортувати дані\n• Створювати кастомні звіти\n\nЯкий тип звіту вас цікавить?',
        type: 'action',
        action: {
          type: 'navigate',
          label: 'Переглянути звіти',
          url: '/reports'
        }
      }
    }
    
    if (lowerInput.includes('привіт') || lowerInput.includes('hello')) {
      return {
        content: 'Привіт! Радий вас бачити! Як справи з арбітражем? Чи потрібна допомога з платформою?',
        type: 'suggestion',
        suggestions: [
          'Показати статистику',
          'Створити нову кампанію',
          'Переглянути аккаунти',
          'Допомога з налаштуваннями'
        ]
      }
    }
    
    if (lowerInput.includes('дякую') || lowerInput.includes('thanks')) {
      return {
        content: 'Будь ласка! Радий був допомогти. Якщо виникнуть питання - звертайтеся! 😊'
      }
    }
    
    // Загальні відповіді
    const generalResponses = [
      'Цікаве питання! Давайте розберемо детальніше. Що саме вас цікавить?',
      'Я можу допомогти з цим. Чи можете уточнити ваш запит?',
      'Це хороше питання. Давайте я поясню покроково.',
      'Розумію ваш інтерес. Що саме ви хочете дізнатися?',
      'Я можу надати детальну інформацію про це. Що саме вас цікавить?'
    ]
    
    return {
      content: generalResponses[Math.floor(Math.random() * generalResponses.length)],
      type: 'suggestion',
      suggestions: [
        'Як створити нову кампанію?',
        'Показати статистику аккаунтів',
        'Допомога з налаштуваннями',
        'Згенерувати звіт'
      ]
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setIsMinimized(false)
    }
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={toggleChat}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl"
        >
          <Bot className="w-5 h-5" />
          <span className="font-medium">AI Асистент</span>
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        isMinimized ? 'w-80 h-12' : 'w-96 h-[500px]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">AI Асистент</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isTyping ? 'Печатає...' : 'Онлайн'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={toggleMinimize}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={toggleChat}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto h-[380px]">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`p-2 rounded-full ${
                      message.sender === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="w-3 h-3" />
                      ) : (
                        <Bot className="w-3 h-3" />
                      )}
                    </div>
                    <div className={`px-3 py-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      
                      {/* Suggestions */}
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="block w-full text-left px-3 py-2 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {/* Action Button */}
                      {message.action && (
                        <div className="mt-3">
                          <button
                            onClick={() => {
                              if (message.action?.type === 'navigate' && message.action.url) {
                                window.location.href = message.action.url
                              }
                            }}
                            className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                          >
                            {message.action.label}
                          </button>
                        </div>
                      )}
                      
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' 
                          ? 'text-blue-100' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {message.timestamp.toLocaleTimeString('uk-UA', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                      <Bot className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Напишіть повідомлення..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  disabled={isTyping}
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isTyping}
                  className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              
              {/* Quick Actions */}
              <div className="mt-3 flex flex-wrap gap-2">
                {['Допомога', 'Аккаунти', 'Кампанії', 'Звіти'].map((action) => (
                  <button
                    key={action}
                    onClick={() => setInputValue(action)}
                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
} 